import * as vscode from 'vscode';
import * as path   from 'path';
import { startLspClient, stopLspClient } from './ferrumLsp';

export function activate(context: vscode.ExtensionContext) {
	console.log('Ferrum extension activated');

	// -- Register commands ----------------------------------------

	context.subscriptions.push(
		vscode.commands.registerCommand('ferrum.compile', () => {
			runFerrum('compile', context);
		}),
		vscode.commands.registerCommand('ferrum.check', () => {
			runFerrum('check', context);
		}),
		vscode.commands.registerCommand('ferrum.showTokens', () => {
			runFerrum('tokens', context);
		}),
		vscode.commands.registerCommand('ferrum.showAst', () => {
			runFerrum('ast', context);
		}),
	);

	// -- Auto-check on save ---------------------------------------

	context.subscriptions.push(
		vscode.workspace.onDidSaveTextDocument((doc) => {
			const config = vscode.workspace.getConfiguration('ferrum');
			if (doc.languageId === 'ferrum' && config.get<boolean>('autoCheckOnSave', true)) {
				runFerrum('check', context, doc.fileName);
			}
		})
	);

	// -- Start LSP client -----------------------------------------

	const config = vscode.workspace.getConfiguration('ferrum');
	if (config.get<boolean>('enableLsp', true)) {
		startLspClient(context);
	}
}

export function deactivate() {
	stopLspClient();
}

// -- Run ferrum CLI command ---------------------------------------

function runFerrum(
	subcommand: 'compile' | 'check' | 'tokens' | 'ast',
	context:    vscode.ExtensionContext,
	filePath?:  string,
) {
	const editor = vscode.window.activeTextEditor;
	const target = filePath ?? editor?.document.fileName;

	if (!target || !target.endsWith('.fe')) {
		vscode.window.showWarningMessage(
			'Ferrum: Open a .fe file first.'
		);
		return;
	}

	const config       = vscode.workspace.getConfiguration('ferrum');
	const compilerPath = config.get<string>('compilerPath', 'ferrum');

	// Use VS Code's built-in task runner for compile (shows output panel)
	const task = new vscode.Task(
		{ type: 'ferrum', task: subcommand },
		vscode.TaskScope.Workspace,
		`ferrum ${subcommand}`,
		'ferrum',
		new vscode.ShellExecution(`${compilerPath} ${subcommand} "${target}"`),
		'$ferrum'   // problem matcher name from package.json
	);

	task.presentationOptions = {
		reveal:     vscode.TaskRevealKind.Always,
		panel:      vscode.TaskPanelKind.Dedicated,
		showReuseMessage: false,
		clear:      true,
	};

	vscode.tasks.executeTask(task);
}
