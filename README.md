/*
# Ferrum Language Extension for VS Code

Full language support for Ferrum .fe source files.

## Features

- **Syntax highlighting** - all keywords, types, ownership modifiers,
	hardware commands, and built-in functions coloured distinctly
- **Ferrum Dark theme** - warm iron/amber palette designed for
	hardware code
- **Code snippets** - type ferrum, define, create, fn, every,
	etc. for full template expansions
- **Auto-check on save** - runs ferrum check on every save and
	shows errors/warnings inline via the problem matcher
- **One-click compile** - click the play button in the editor title bar
	to compile the current .fe file
- **LSP ready** - connects to ferrum lsp --stdio when available
	for hover types and completion

## Requirements

Install the Ferrum compiler and ensure it is on your PATH:

```bash
cargo install --path ferrum/compiler
ferrum --version
```

## Extension settings

| Setting | Default | Description |
|---|---|---|
| ferrum.compilerPath | "ferrum" | Path to the compiler binary |
| ferrum.enableLsp | true | Enable language server |
| ferrum.autoCheckOnSave | true | Run check on save |

## Keyboard shortcuts

| Command | Shortcut |
|---|---|
| Ferrum: Compile | Click play button in editor title |
| Ferrum: Check | Via Command Palette |

## Monaco Editor

This extension's grammar and theme are designed to be reused in
Monaco Editor (e.g. inside a Tauri+Vue IDE). See monaco directory.
*/
# ferrum-vscode
