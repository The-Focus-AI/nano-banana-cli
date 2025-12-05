#!/bin/bash
# Test script for nano-banana CLI
# Run: ./test.sh [--with-api]

# Don't use set -e - we handle exit codes explicitly

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

pass() {
    echo -e "${GREEN}PASS${NC}: $1"
    ((PASS++))
}

fail() {
    echo -e "${RED}FAIL${NC}: $1"
    ((FAIL++))
}

skip() {
    echo -e "${YELLOW}SKIP${NC}: $1"
}

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLI="npx tsx $SCRIPT_DIR/cli.ts"

echo "================================================"
echo "nano-banana CLI Tests"
echo "================================================"
echo ""

# ==========================================
# LOCAL TESTS (No API required)
# ==========================================

echo "--- Local Tests (no API required) ---"
echo ""

# Help output
if $CLI --help 2>&1 | grep -q "Usage:"; then
    pass "Help shows usage"
else
    fail "Help shows usage"
fi

# Missing prompt shows help
if $CLI 2>&1 | grep -q "Usage:"; then
    pass "Missing prompt shows help"
else
    fail "Missing prompt shows help"
fi

# Invalid duration rejected
if $CLI --video "test" --duration 5 2>&1 | grep -q "must be 4, 6, or 8"; then
    pass "Invalid duration rejected"
else
    fail "Invalid duration rejected"
fi

# Invalid aspect ratio rejected
if $CLI --video "test" --aspect 4:3 2>&1 | grep -q "must be 16:9 or 9:16"; then
    pass "Invalid aspect ratio rejected"
else
    fail "Invalid aspect ratio rejected"
fi

# Invalid resolution rejected
if $CLI --video "test" --resolution 4k 2>&1 | grep -q "must be 720p or 1080p"; then
    pass "Invalid resolution rejected"
else
    fail "Invalid resolution rejected"
fi

# Missing file error
if $CLI "edit" --file /tmp/nonexistent-file-12345.jpg 2>&1 | grep -q "not found"; then
    pass "Missing file error shown"
else
    fail "Missing file error shown"
fi

# Non-image file rejected (create temp file first)
echo "not an image" > /tmp/nano-banana-test-fake.txt
if $CLI "edit" --file /tmp/nano-banana-test-fake.txt 2>&1 | grep -q "not an image"; then
    pass "Non-image file rejected"
else
    fail "Non-image file rejected"
fi
rm -f /tmp/nano-banana-test-fake.txt

# Cost estimate works (no API call)
if $CLI --video "test" --estimate-cost 2>&1 | grep -q "Estimated cost"; then
    pass "Cost estimate shows estimate"
else
    fail "Cost estimate shows estimate"
fi

# Cost estimate with fast model (8s with audio = ~$1.20)
if $CLI --video "test" --estimate-cost --video-fast --duration 8 2>&1 | grep -q '\$1'; then
    pass "Fast model pricing shown"
else
    fail "Fast model pricing shown"
fi

# No-audio shown in estimate
if $CLI --video "test" --estimate-cost --video-fast --no-audio 2>&1 | grep -q "disabled"; then
    pass "No-audio shown in estimate"
else
    fail "No-audio shown in estimate"
fi

# Cannot use both --prompt and --prompt-file
echo "test prompt" > /tmp/nano-banana-test-prompt.txt
if $CLI "inline prompt" --prompt-file /tmp/nano-banana-test-prompt.txt 2>&1 | grep -qi "cannot use both\|simultaneously"; then
    pass "Prompt conflict detected"
else
    fail "Prompt conflict detected"
fi
rm -f /tmp/nano-banana-test-prompt.txt

# Extend without URI file rejected
touch /tmp/nano-banana-test-external.mp4
if $CLI --video "extend" --extend /tmp/nano-banana-test-external.mp4 2>&1 | grep -qi "URI file\|only extend"; then
    pass "External video (no URI) rejected"
else
    fail "External video (no URI) rejected"
fi
rm -f /tmp/nano-banana-test-external.mp4

echo ""

# ==========================================
# API TESTS (Require GEMINI_API_KEY)
# ==========================================

if [ "$1" == "--with-api" ]; then
    if [ -z "$GEMINI_API_KEY" ]; then
        echo "--- API Tests ---"
        echo ""
        skip "GEMINI_API_KEY not set, skipping API tests"
        echo ""
    else
        echo "--- API Tests (GEMINI_API_KEY set) ---"
        echo ""

        # List models
        if $CLI --list-models 2>&1 | grep -q "Available models"; then
            pass "List models shows header"
        else
            fail "List models shows header"
        fi

        if $CLI --list-models 2>&1 | grep -q "Image Generation"; then
            pass "List models shows image section"
        else
            fail "List models shows image section"
        fi

        if $CLI --list-models 2>&1 | grep -q "Video Generation"; then
            pass "List models shows video section"
        else
            fail "List models shows video section"
        fi

        # Image generation (quick test)
        echo ""
        echo "Testing image generation (this will call the API)..."
        if $CLI "a simple red circle on white background" --output /tmp/nano-banana-test-image.png 2>&1; then
            if [ -f /tmp/nano-banana-test-image.png ]; then
                pass "Image generated and saved"
                rm -f /tmp/nano-banana-test-image.png
            else
                fail "Image file not created"
            fi
        else
            fail "Image generation failed"
        fi

        echo ""
        echo "Note: Video tests are expensive. Run manually with:"
        echo "  $CLI --video \"A simple test\" --video-fast --no-audio --duration 4"
        echo ""
    fi
else
    echo "--- API Tests ---"
    echo ""
    skip "Run with --with-api to include API tests"
    echo ""
fi

# ==========================================
# Summary
# ==========================================

echo "================================================"
echo "Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC}"
echo "================================================"

if [ $FAIL -gt 0 ]; then
    exit 1
fi
