#!/bin/sh
# TejX Compiler Installer
# Usage: curl -fsSL https://tejx-lang.github.io/install.sh | sh
#
# Downloads the latest tejxc binary from GitHub Releases
# and installs it to /usr/local/bin/tejxc

set -e

REPO="tejx-lang/tejx"
BINARY_NAME="tejxc"
INSTALL_DIR="/usr/local/bin"

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

# ── Download & Install ──
install() {
    ASSET_NAME="tejxc-${PLATFORM}.tar.gz"
    DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/${ASSET_NAME}"
    TMP_DIR="$(mktemp -d)"
    TMP_FILE="${TMP_DIR}/${BINARY_NAME}"

    info "Downloading TejX ${VERSION} for ${PLATFORM}..."

    if command -v curl > /dev/null 2>&1; then
        curl -fsSL -o "${TMP_DIR}/archive.tar.gz" "$DOWNLOAD_URL" || error "Download failed. Check https://github.com/${REPO}/releases"
    else
        wget -qO "${TMP_DIR}/archive.tar.gz" "$DOWNLOAD_URL" || error "Download failed. Check https://github.com/${REPO}/releases"
    fi

    tar -xzf "${TMP_DIR}/archive.tar.gz" -C "$TMP_DIR" 2>/dev/null || error "Failed to extract archive."

    # Find the binary in extracted contents
    if [ -f "${TMP_DIR}/tejxc" ]; then
        TMP_FILE="${TMP_DIR}/tejxc"
    elif [ -f "${TMP_DIR}/${BINARY_NAME}" ]; then
        TMP_FILE="${TMP_DIR}/${BINARY_NAME}"
    else
        # Search for it
        FOUND="$(find "$TMP_DIR" -name "tejxc" -type f 2>/dev/null | head -1)"
        if [ -n "$FOUND" ]; then
            TMP_FILE="$FOUND"
        else
            error "Could not find tejxc binary in the downloaded archive."
        fi
    fi

    chmod +x "$TMP_FILE"

    # Install to INSTALL_DIR (may need sudo)
    if [ -w "$INSTALL_DIR" ]; then
        mv "$TMP_FILE" "${INSTALL_DIR}/${BINARY_NAME}"
    else
        info "Installing to ${INSTALL_DIR} (requires sudo)..."
        sudo mv "$TMP_FILE" "${INSTALL_DIR}/${BINARY_NAME}"
    fi

    rm -rf "$TMP_DIR"
}

# ── Verify Installation ──
verify() {
    if command -v "$BINARY_NAME" > /dev/null 2>&1; then
        success "TejX compiler installed successfully!"
        echo ""
        printf "  ${BOLD}Version:${RESET}  %s\n" "$VERSION"
        printf "  ${BOLD}Binary:${RESET}   %s\n" "$(command -v $BINARY_NAME)"
        echo ""
        printf "  ${CYAN}Get started:${RESET}\n"
        printf "    ${BOLD}$${RESET} tejxc main.tx && ./main\n"
        echo ""
    else
        warn "Installation completed but '${BINARY_NAME}' is not in your PATH."
        warn "Add ${INSTALL_DIR} to your PATH, or move the binary manually."
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

    install
    verify
}

main
