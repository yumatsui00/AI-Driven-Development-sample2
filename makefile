.PHONY: review

# プロジェクトルート（Makefileが置かれたディレクトリ）
ROOT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

review:
	@echo "=== Running review prompt generator ==="
	@bash $(ROOT_DIR)/scripts/create_review_prompt.sh
