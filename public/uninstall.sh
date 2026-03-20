#!/bin/sh
# TejX Compiler Uninstaller
# Usage: curl -fsSL https://tejx-lang.github.io/uninstall.sh | sh
#
# Removes the TejX toolchain from ~/.tejx

set -e

TEJX_DIR="${TEJX_DIR:-$HOME/.tejx}"

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

    if [ ! -d "$TEJX_DIR" ]; then
        error "TejX installation not found at ${TEJX_DIR}"
    fi

    info "Removing TejX toolchain from ${TEJX_DIR}..."

    rm -rf "$TEJX_DIR"

    if [ -d "$TEJX_DIR" ]; then
        error "Failed to completely remove the TejX toolchain."
    fi

    success "TejX toolchain has been successfully removed."
    echo ""
}

main
