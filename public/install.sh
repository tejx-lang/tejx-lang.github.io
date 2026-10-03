#!/bin/sh
# TejX Compiler Installer
# Usage: curl -fsSL https://tejx-lang.github.io/install.sh | sh
#
# Downloads the latest TejX release from GitHub Releases
# and installs it to ~/.tejx

set -e

REPO="tejx-lang/tejx"
BINARY_NAME="tejxc"
RUNTIME_NAME="tejx_rt.a"
TEJX_DIR="${TEJX_DIR:-$HOME/.tejx}"
BIN_DIR="${TEJX_DIR}/bin"
LIB_DIR="${TEJX_DIR}/lib"
RUNTIME_DIR="${TEJX_DIR}/runtime"
TMP_DIR=""

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
RESET='\033[0m'

info()    { printf "${CYAN}➜${RESET} %s\n" "$1"; }
success() { printf "${GREEN}✔${RESET} %s\n" "$1"; }
warn()    { printf "${YELLOW}⚠${RESET} %s\n" "$1"; }
error()   { printf "${RED}✖${RESET} %s\n" "$1"; exit 1; }

cleanup() {
    if [ -n "$TMP_DIR" ] && [ -d "$TMP_DIR" ]; then
        rm -rf "$TMP_DIR"
    fi
}

trap cleanup 0 INT TERM

# ── Detect OS & Architecture ──
detect_platform() {
    OS="$(uname -s)"
    ARCH="$(uname -m)"

    case "$OS" in
        Linux)  OS="linux" ;;
        Darwin) OS="macos" ;;
        *)      error "Unsupported OS: $OS. TejX supports Linux and macOS." ;;
    esac

    case "$ARCH" in
        x86_64|amd64)   ARCH="x64" ;;
        arm64|aarch64)  ARCH="arm64" ;;
        *)              error "Unsupported architecture: $ARCH" ;;
    esac

    PLATFORM="${OS}-${ARCH}"
}

# ── Ensure System Dependencies ──
ensure_dependencies() {
    info "Verifying system requirements (Clang, build-essential, OpenSSL)..."

    clang_bin=""
    for c in clang clang-19 clang-18 clang-17 clang-16 clang-15; do
        if command -v "$c" >/dev/null 2>&1; then
            clang_bin="$c"
            break
        fi
    done

    need_deps=0
    if [ -z "$clang_bin" ]; then
        need_deps=1
    fi

    if [ "$OS" = "linux" ]; then
        ssl_found=0
        for dir in /usr/lib /usr/lib64 /usr/local/lib /usr/lib/*-linux-* /lib/*-linux-*; do
            if [ -f "$dir/libssl.so" ] || [ -f "$dir/libssl.so.3" ] || [ -f "$dir/libssl.so.1.1" ]; then
                ssl_found=1
                break
            fi
        done
        if [ "$ssl_found" -eq 0 ]; then
            need_deps=1
        fi

        if ! command -v make >/dev/null 2>&1 || ! command -v ld >/dev/null 2>&1; then
            need_deps=1
        fi

        if [ "$need_deps" -eq 1 ]; then
            info "Installing required build dependencies (Clang, build-essential, OpenSSL)..."

            sudo_cmd=""
            if [ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1; then
                sudo_cmd="sudo"
            fi

            if command -v apt-get >/dev/null 2>&1; then
                deps="clang build-essential libssl-dev"
                info "Installing via apt-get (${deps})..."
                if [ -n "$sudo_cmd" ]; then
                    $sudo_cmd apt-get update -qq && $sudo_cmd apt-get install -y -qq $deps || warn "Please run manually: sudo apt-get update && sudo apt-get install -y $deps"
                elif [ "$(id -u)" -eq 0 ]; then
                    apt-get update -qq && apt-get install -y -qq $deps || warn "Please run manually: apt-get update && apt-get install -y $deps"
                else
                    warn "Sudo privileges required. Please run: sudo apt-get update && sudo apt-get install -y $deps"
                fi
            elif command -v dnf >/dev/null 2>&1; then
                deps="clang gcc openssl-devel"
                info "Installing via dnf (${deps})..."
                if [ -n "$sudo_cmd" ]; then
                    $sudo_cmd dnf install -y -q $deps || warn "Please run manually: sudo dnf install -y $deps"
                elif [ "$(id -u)" -eq 0 ]; then
                    dnf install -y -q $deps || warn "Please run manually: dnf install -y $deps"
                else
                    warn "Please run manually: sudo dnf install -y $deps"
                fi
            elif command -v pacman >/dev/null 2>&1; then
                deps="clang base-devel openssl"
                info "Installing via pacman (${deps})..."
                if [ -n "$sudo_cmd" ]; then
                    $sudo_cmd pacman -Sy --noconfirm --needed $deps || warn "Please run manually: sudo pacman -S $deps"
                elif [ "$(id -u)" -eq 0 ]; then
                    pacman -Sy --noconfirm --needed $deps || warn "Please run manually: pacman -S $deps"
                else
                    warn "Please run manually: sudo pacman -S $deps"
                fi
            elif command -v apk >/dev/null 2>&1; then
                deps="clang build-base openssl-dev"
                info "Installing via apk (${deps})..."
                if [ -n "$sudo_cmd" ]; then
                    $sudo_cmd apk add --no-cache $deps || warn "Please run manually: sudo apk add $deps"
                elif [ "$(id -u)" -eq 0 ]; then
                    apk add --no-cache $deps || warn "Please run manually: apk add $deps"
                else
                    warn "Please run manually: sudo apk add $deps"
                fi
            fi
        fi
    elif [ "$OS" = "macos" ]; then
        if [ -z "$clang_bin" ]; then
            info "Clang compiler not detected. Triggering Xcode Command Line Tools installation..."
            xcode-select --install 2>/dev/null || true
        fi
    fi

    # Post-check: discover Clang compiler
    for c in clang clang-19 clang-18 clang-17 clang-16 clang-15; do
        if command -v "$c" >/dev/null 2>&1; then
            clang_bin="$c"
            break
        fi
    done

    if [ -n "$clang_bin" ]; then
        clang_ver="$($clang_bin --version 2>/dev/null | head -n 1)"
        success "Compiler backend verified: ${clang_ver}"
    else
        warn "Clang compiler not detected. Please install Clang manually if native builds fail."
    fi
}

# ── Find latest release tag ──
get_latest_version() {
    LATEST_URL="https://api.github.com/repos/${REPO}/releases/latest"

    if command -v curl > /dev/null 2>&1; then
        VERSION="$(curl -fsSL "$LATEST_URL" | grep '"tag_name"' | head -1 | sed 's/.*"tag_name": *"//;s/".*//')"
    elif command -v wget > /dev/null 2>&1; then
        VERSION="$(wget -qO- "$LATEST_URL" | grep '"tag_name"' | head -1 | sed 's/.*"tag_name": *"//;s/".*//')"
    else
        error "Neither curl nor wget found. Please install one of them."
    fi

    if [ -z "$VERSION" ]; then
        error "Could not determine the latest release version. Check https://github.com/${REPO}/releases"
    fi
}

find_binary() {
    FOUND="$(find "$TMP_DIR" -name "$BINARY_NAME" -type f 2>/dev/null | head -1)"
    if [ -z "$FOUND" ]; then
        error "Could not find ${BINARY_NAME} in the downloaded archive."
    fi
    printf "%s\n" "$FOUND"
}

find_runtime() {
    FOUND="$(find "$TMP_DIR" \( -name "$RUNTIME_NAME" -o -name "libtejx_rt.a" \) -type f 2>/dev/null | head -1)"
    if [ -z "$FOUND" ]; then
        error "Could not find ${RUNTIME_NAME} in the downloaded archive."
    fi
    printf "%s\n" "$FOUND"
}

find_stdlib_dir() {
    # Prefer 'lib/' as seen in release structure
    for DIR in \
        "$TMP_DIR/tejx/lib" \
        "$TMP_DIR/lib" \
        "$TMP_DIR/library" \
        "$TMP_DIR/src/library"
    do
        if [ -d "$DIR" ] && [ -n "$(find "$DIR" -mindepth 1 -maxdepth 1 2>/dev/null | head -1)" ]; then
            printf "%s\n" "$DIR"
            return 0
        fi
    done

    # Final attempt: search for a 'lib' or 'library' folder
    FOUND="$(find "$TMP_DIR" -type d \( -name 'lib' -o -name 'library' \) 2>/dev/null | while read -r DIR; do
        if [ -n "$(find "$DIR" -mindepth 1 -maxdepth 1 2>/dev/null | head -1)" ]; then
            printf "%s\n" "$DIR"
            break
        fi
    done)"

    if [ -z "$FOUND" ]; then
        error "Could not find the TejX standard library in the downloaded archive."
    fi

    printf "%s\n" "$FOUND"
}

prepare_directories() {
    mkdir -p "$BIN_DIR" "$LIB_DIR" "$RUNTIME_DIR"

    rm -f "${BIN_DIR}/${BINARY_NAME}"
    rm -f "${RUNTIME_DIR}/${RUNTIME_NAME}"
    find "$LIB_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf {} \; 2>/dev/null || true
}

install_release() {
    ASSET_NAME="tejxc-${PLATFORM}.tar.gz"
    DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/${ASSET_NAME}"
    TMP_DIR="$(mktemp -d)"

    info "Downloading TejX ${VERSION} for ${PLATFORM}..."

    if command -v curl > /dev/null 2>&1; then
        curl -fsSL -o "${TMP_DIR}/archive.tar.gz" "$DOWNLOAD_URL" || error "Download failed. Check https://github.com/${REPO}/releases"
    else
        wget -qO "${TMP_DIR}/archive.tar.gz" "$DOWNLOAD_URL" || error "Download failed. Check https://github.com/${REPO}/releases"
    fi

    tar -xzf "${TMP_DIR}/archive.tar.gz" -C "$TMP_DIR" 2>/dev/null || error "Failed to extract archive."

    BINARY_PATH="$(find_binary)"
    RUNTIME_PATH="$(find_runtime)"
    STDLIB_PATH="$(find_stdlib_dir)"

    prepare_directories

    cp "$BINARY_PATH" "${BIN_DIR}/${BINARY_NAME}"
    chmod +x "${BIN_DIR}/${BINARY_NAME}"
    cp "$RUNTIME_PATH" "${RUNTIME_DIR}/${RUNTIME_NAME}"
    cp -R "${STDLIB_PATH}/." "$LIB_DIR/"
}

# ── PATH Configuration ──
update_path() {
    shell_config=""
    
    # Detect shell config file using POSIX case patterns
    case "$SHELL" in
        */zsh)
            shell_config="$HOME/.zshrc"
            ;;
        */bash)
            case "$(uname -s)" in
                Darwin) shell_config="$HOME/.bash_profile" ;;
                *)      shell_config="$HOME/.bashrc" ;;
            esac
            ;;
        *)
            if [ -f "$HOME/.zshrc" ]; then shell_config="$HOME/.zshrc"
            elif [ -f "$HOME/.bash_profile" ]; then shell_config="$HOME/.bash_profile"
            elif [ -f "$HOME/.bashrc" ]; then shell_config="$HOME/.bashrc"
            else shell_config="$HOME/.profile"
            fi
            ;;
    esac
    
    # Fallback to existing config or .profile
    if [ -z "$shell_config" ] || [ ! -f "$shell_config" ]; then
        if [ -f "$HOME/.zshrc" ]; then shell_config="$HOME/.zshrc"
        elif [ -f "$HOME/.bash_profile" ]; then shell_config="$HOME/.bash_profile"
        elif [ -f "$HOME/.bashrc" ]; then shell_config="$HOME/.bashrc"
        else shell_config="$HOME/.profile"
        fi
    fi

    # Create file if it doesn't exist
    touch "$shell_config"

    # Check current session PATH first
    case ":$PATH:" in
        *":$BIN_DIR:"*|*":\$HOME/.tejx/bin:"*|*":$HOME/.tejx/bin:"*) 
            printf "${CYAN}➜${RESET} TejX is already in your session PATH\n"
            return 0
            ;;
    esac

    # Check config file
    if [ -f "$shell_config" ] && grep -q "\.tejx/bin" "$shell_config"; then
        printf "${CYAN}➜${RESET} TejX is already in PATH in ${BOLD}%s${RESET}\n" "$shell_config"
        return 0
    fi

    # Add to config
    echo "" >> "$shell_config"
    echo "# TejX Toolchain" >> "$shell_config"
    echo "export PATH=\"\$HOME/.tejx/bin:\$PATH\"" >> "$shell_config"
    printf "${CYAN}➜${RESET} Added TejX to PATH in ${BOLD}%s${RESET}\n" "$shell_config"
    printf "${CYAN}➜${RESET} Please restart your terminal or run: ${BOLD}source %s${RESET}\n" "$shell_config"
}

# ── Verify Installation ──
verify() {
    if [ -x "${BIN_DIR}/${BINARY_NAME}" ] && [ -f "${RUNTIME_DIR}/${RUNTIME_NAME}" ]; then
        PATH_BINARY="$(command -v "$BINARY_NAME" 2>/dev/null || true)"

        # Cleanup unwanted files
        find "$TEJX_DIR" -name ".DS_Store" -type f -delete 2>/dev/null || true

        success "TejX compiler installed successfully!"
        echo ""
        printf "  ${BOLD}Version:${RESET}  %s\n" "$VERSION"
        printf "  ${BOLD}Home:${RESET}     %s\n" "$TEJX_DIR"
        printf "  ${BOLD}Binary:${RESET}   %s\n" "${BIN_DIR}/${BINARY_NAME}"
        printf "  ${BOLD}Stdlib:${RESET}   %s\n" "$LIB_DIR"
        printf "  ${BOLD}Runtime:${RESET}  %s\n" "${RUNTIME_DIR}/${RUNTIME_NAME}"
        if [ -n "$clang_bin" ]; then
            printf "  ${BOLD}Backend:${RESET}  %s\n" "$clang_bin"
        fi
        echo ""

        update_path
        echo ""

        printf "  ${CYAN}Get started:${RESET}\n"
        printf "    ${BOLD}\$${RESET} tejxc main.tx && ./main\n"
        echo ""
    else
        error "Installation did not complete successfully."
    fi
}

# ── Main ──
main() {
    echo ""
    printf "  ${BOLD}${CYAN}TejX${RESET} Compiler Installer\n"
    echo "  ─────────────────────────"
    echo ""

    detect_platform
    info "Detected platform: ${PLATFORM}"

    ensure_dependencies

    get_latest_version
    info "Latest version: ${VERSION}"

    install_release
    verify
}

main
