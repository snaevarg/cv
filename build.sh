#!/usr/bin/env bash

# Default values
LANGUAGE="both"
CLEANUP=false
LOG_FILE="build.log"

# Help message
show_help() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -l, --language    Language to build (icelandic, english, both) [default: both]"
    echo "  -c, --cleanup     Clean temporary files after building"
    echo "  -h, --help        Show this help message"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -l|--language)
            LANGUAGE="$2"
            shift 2
            ;;
        -c|--cleanup)
            CLEANUP=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Validate language choice
if [[ ! "$LANGUAGE" =~ ^(icelandic|english|both)$ ]]; then
    echo "Invalid language selection. Must be 'icelandic', 'english', or 'both'"
    exit 1
fi

# Function to clean temporary files
cleanup() {
    echo "Cleaning up temporary files..."
    rm -f *.aux *.log *.out *.toc *.synctex.gz "$LOG_FILE"
}

# Function to build a single language version
build_language() {
    # local lang=$1
    local lang="english"
    local output_name

    if [ "$lang" = "icelandic" ]; then
        output_name="SveinbjörnGeirsson"
    else
        output_name="SveinbjornGeirsson"
    fi

    echo "Building ${lang} version..."

    # Run xelatex and log output
    if xelatex -interaction=nonstopmode -shell-escape "\PassOptionsToPackage{${lang}}{babel} \input{cv.tex}" > "$LOG_FILE" 2>&1; then
        mv cv.pdf "${output_name}.pdf"
        echo "Successfully built ${output_name}.pdf"
    else
        echo "Error: Failed to build ${lang} version. Check ${LOG_FILE} for details."
        exit 1
    fi
}

# Main build process
case $LANGUAGE in
    "both")
        build_language "icelandic"
        build_language "english"
        ;;
    *)
        build_language "$LANGUAGE"
        ;;
esac

# Cleanup if requested
if [ "$CLEANUP" = true ]; then
    cleanup
fi

echo "Build complete!"
