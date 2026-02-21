#!/bin/sh
# TejX Compiler Uninstaller
# Usage: curl -fsSL https://tejx-lang.github.io/uninstall.sh | sh
#
# Removes the tejxc binary from /usr/local/bin/tejxc

set -e

BINARY_NAME="tejxc"
INSTALL_DIR="/usr/local/bin"
BINARY_PATH="${INSTALL_DIR}/${BINARY_NAME}"

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

# ── Main ──
main() {
    echo ""
    printf "  ${BOLD}${RED}TejX${RESET} Compiler Uninstaller\n"
    echo "  ───────────────────────────"
    echo ""

    if [ ! -f "$BINARY_PATH" ]; then
        error "TejX compiler not found at ${BINARY_PATH}"
    fi

    info "Removing TejX compiler from ${BINARY_PATH}..."

    if [ -w "$INSTALL_DIR" ]; then
        rm "$BINARY_PATH"
    else
        info "Permission denied. Requesting sudo to remove ${BINARY_PATH}..."
        sudo rm "$BINARY_PATH"
    fi

    if [ ! -f "$BINARY_PATH" ]; then
        success "TejX compiler has been successfully removed."
    else
        error "Failed to remove the TejX compiler."
    fi
    echo ""
}

main
