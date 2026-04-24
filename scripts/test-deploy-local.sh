#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Script: test-deploy-local.sh
# Description: Simulates GitHub Actions deploy workflow locally to verify
#              .htaccess and other files are correctly included in builds
# Usage: ./scripts/test-deploy-local.sh
# =============================================================================

readonly SCRIPT_DIR=$(cd -- $(dirname -- ${BASH_SOURCE[0]}) && pwd)
readonly PROJECT_ROOT=$(dirname -- ${SCRIPT_DIR})
readonly DIST_DIR=${PROJECT_ROOT}/dist
readonly TEST_TARGET=${PROJECT_ROOT}/.test-deploy-target

# Exit codes
readonly EXIT_SUCCESS=0
readonly EXIT_FAILURE=1

# Logging
log_info() { echo >&2 "[INFO] $*"; }
log_error() { echo >&2 "[ERROR] $*"; }
die() { log_error "$*"; exit EXIT_FAILURE; }

cleanup() {
    local exit_code=$?
    rm -rf -- ${TEST_TARGET:-.test-deploy-target} 2>/dev/null || true
    exit $exit_code
}
trap cleanup EXIT

main() {
    echo ========================================
    echo 'LOCAL DEPLOY TEST'
    echo ========================================
    echo >&2

    # 1. Cleanup previous test
    log_info 'Cleaning up previous test target...'
    rm -rf -- ${TEST_TARGET}
    mkdir -p -- ${TEST_TARGET}

    # 2. Build (simulate GitHub Actions build job)
    echo >&2
    log_info 'Running build (simulating GitHub Actions build job)...'
    cd -- ${PROJECT_ROOT} || die 'Cannot change to project directory'
    npm run build

    # 3. Verify .htaccess exists in dist
    echo >&2
    log_info 'Verifying .htaccess in dist/ before sync...'
    if [[ -f ${DIST_DIR}/.htaccess ]]; then
        log_info '.htaccess FOUND in dist/'
        echo 'Content:' >&2
        cat -- ${DIST_DIR}/.htaccess
    else
        die '.htaccess NOT FOUND in dist/'
    fi

    # 4. Sync to test target (simulate rsync deploy)
    echo >&2
    log_info 'Syncing dist/ to test target (simulating rsync deploy)...'
    echo 'Target:' ${TEST_TARGET} >&2
    command -v rsync &>/dev/null || die 'rsync is required but not installed'
    rsync -av --delete --chmod=Du=rwx,Dg=rx,Fu=rw,Fg=r "${DIST_DIR}/" "${TEST_TARGET}/"

    # 5. Verify .htaccess in target
    echo >&2
    echo '========================================' >&2
    echo 'VERIFICATION RESULTS' >&2
    echo '========================================' >&2
    echo >&2

    log_info 'Files in test target:'
    ls -la -- ${TEST_TARGET}/ >&2

    echo >&2
    log_info '.htaccess in test target:'
    if [[ -f ${TEST_TARGET}/.htaccess ]]; then
        echo '.htaccess FOUND in test target' >&2
        cat -- ${TEST_TARGET}/.htaccess

        echo >&2
        log_info 'Setting permissions 644...'
        chmod 644 "${TEST_TARGET}/.htaccess"
        ls -la "${TEST_TARGET}/.htaccess" >&2
        echo 'Permissions set successfully' >&2
    else
        die '.htaccess NOT FOUND in test target after rsync'
    fi

    echo >&2
    echo '========================================' >&2
    log_info 'LOCAL DEPLOY TEST PASSED'
    echo '========================================' >&2
    echo >&2
    echo 'Summary:' >&2
    echo '- Build completed successfully' >&2
    echo '- .htaccess included in dist/' >&2
    echo '- rsync synced .htaccess to target' >&2
    echo '- Permissions can be set on .htaccess' >&2
    echo >&2
    echo 'Test target location:' ${TEST_TARGET} >&2
    echo 'To cleanup: rm -rf .test-deploy-target' >&2
}

main