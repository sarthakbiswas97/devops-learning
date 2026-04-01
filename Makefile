.PHONY: install build start fast

install:
	bun install

build:
	bun run build

start:
	bun run start

fast:
	bun run dev
