# Makefile for processing media files

# Variables
INPUT_DIR := input
PROMPT := slide-extractor
PROMPTS_DIR := prompts
PROMPT_FILE := $(PROMPTS_DIR)/$(PROMPT).md
SHELL := /bin/bash

# Default target
all: rename process

# Target to rename files based on EXIF data
rename:
	@echo "Renaming files in $(INPUT_DIR)..."
	@for file in $(INPUT_DIR)/*; do \
		if [ -f "$$file" ]; then \
			new_name=$$(exiftool -d "%Y-%m-%d-%H-%M" -p '$$DateTimeOriginal' "$$file" 2>/dev/null); \
			if [ -n "$$new_name" ]; then \
				extension=$${file##*.}; \
				mv -v "$$file" "$(INPUT_DIR)/$$new_name.$$extension"; \
			else \
				echo "Could not find EXIF date for $$file"; \
			fi \
		fi \
	done

# Target to process files with a prompt
process: install
	@echo "Processing files in $(INPUT_DIR) with prompt: $(PROMPT)..."
	@if [ ! -f "$(PROMPT_FILE)" ]; then \
		echo "Error: Prompt file '$(PROMPT_FILE)' not found!"; \
		echo "Available prompts:"; \
		ls -1 $(PROMPTS_DIR)/*.md 2>/dev/null | xargs -n1 basename | sed 's/.md$$//' || echo "  (none)"; \
		exit 1; \
	fi
	@mkdir -p output
	@bash -c 'for file in $(INPUT_DIR)/*; do \
		if [ -f "$$file" ] && [[ "$$file" != *".gitkeep" ]]; then \
			base=$$(basename "$$file"); \
			name="$${base%.*}"; \
			output="output/$${name}-edited.png"; \
			if [ -f "$$output" ]; then \
				echo "Skipping $$file (already processed)"; \
			else \
				echo "Processing $$file..."; \
				nano-banana --file "$$file" --prompt-file "$(PROMPT_FILE)" --output "$$output"; \
			fi \
		fi \
	done'

# List available prompts
list-prompts:
	@echo "Available prompts:"
	@ls -1 $(PROMPTS_DIR)/*.md 2>/dev/null | xargs -n1 basename | sed 's/.md$$/  /' || echo "  (none found)"

install:
	@echo "Installing Node.js dependencies..."
	@pnpm install

.PHONY: all rename process list-prompts install
