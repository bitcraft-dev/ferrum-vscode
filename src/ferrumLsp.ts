//
// LSP client wiring.
//
// The Ferrum compiler exposes a language server mode via:
//   ferrum lsp --stdio
//
// This file wires the vscode-languageclient to that process.
// The LSP server provides:
//   - textDocument/publishDiagnostics (errors + warnings)
//   - textDocument/hover              (type at cursor)
//   - textDocument/completion         (keyword + identifier completion)
//
// The server side (ferrum lsp) is a future addition to the compiler.
// This client is ready to connect when the server is implemented.
// Until then, the problem matcher in package.json handles diagnostics
// from the CLI output of ferrum check.

import * as vscode from 'vscode';
import * as path   from 'path';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

export function startLspClient(context: vscode.ExtensionContext) {
	const config       = vscode.workspace.getConfiguration('ferrum');
	const compilerPath = config.get<string>('compilerPath', 'ferrum');

	const serverOptions: ServerOptions = {
		command:    compilerPath,
		args:       ['lsp', '--stdio'],
		transport:  TransportKind.stdio,
		options: {
			// Inherit environment so the compiler can find stdlib
			env: { ...process.env },
		},
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'ferrum' }],
		synchronize: {
			fileEvents: vscode.workspace.createFileSystemWatcher('**/*.fe'),
		},
		outputChannelName: 'Ferrum Language Server',
		// Map LSP severity to VS Code diagnostic severity
		diagnosticCollectionName: 'ferrum',
	};

	client = new LanguageClient(
		'ferrum-lsp',
		'Ferrum Language Server',
		serverOptions,
		clientOptions,
	);

	// Start but do not fail the extension if the server is not present yet
	client.start().catch((err) => {
		console.warn(
			'Ferrum LSP server not found - falling back to problem matcher diagnostics.',
			err.message,
		);
	});
}

export async function stopLspClient() {
	if (client) {
		await client.stop();
		client = undefined;
	}
}
