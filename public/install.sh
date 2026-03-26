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
    FOUND="$(find "$TMP_DIR" -name "$RUNTIME_NAME" -type f 2>/dev/null | head -1)"
    if [ -z "$FOUND" ]; then
        error "Could not find ${RUNTIME_NAME} in the downloaded archive."
    fi
    printf "%s\n" "$FOUND"
}

find_stdlib_dir() {
    # Prefer 'lib/' as seen in release structure
    for DIR in \
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
    local shell_config=""
    
    # Detect shell config file
    if [[ "$SHELL" == */zsh ]]; then
        shell_config="$HOME/.zshrc"
    elif [[ "$SHELL" == */bash ]]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            shell_config="$HOME/.bash_profile"
        else
            shell_config="$HOME/.bashrc"
        fi
    fi
    
    # Fallback to .profile if specific shell config not found
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
        *":$BIN_DIR:"*|*":\$HOME/.tejx/bin:"*) 
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
    touch "$shell_config"
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

    get_latest_version
    info "Latest version: ${VERSION}"

    install_release
    verify
}

main
