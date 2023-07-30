import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("extension.runJava", () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const { fsPath } = editor.document.uri;
      const fileExtension = path.extname(fsPath);

      if (fileExtension === ".java") {
        const directoryPath = path.dirname(fsPath);
        const fileNameWithExtension = path.basename(fsPath);
        const fileNameWithoutExtension = path.parse(fileNameWithExtension).name;

        const terminal = vscode.window.createTerminal();
        terminal.sendText(`cd ${directoryPath}`);
        terminal.sendText(`javac ${fileNameWithExtension}`);
        terminal.sendText(`java ${fileNameWithoutExtension}`);
        terminal.show();
      } else {
        vscode.window.showErrorMessage("Active file is not a Java file");
      }
    } else {
      vscode.window.showErrorMessage("No active editor found");
    }
  });

  context.subscriptions.push(disposable);

  let runButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  runButton.text = "$(triangle-right) Run";
  runButton.command = "extension.runJava";
  runButton.tooltip = "Run Java";

  context.subscriptions.push(runButton);

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      const { fsPath } = editor.document.uri;
      const fileExtension = path.extname(fsPath);
      runButton.color = fileExtension === ".java" ? undefined : "transparent";
    }
  });

  runButton.show();
}

export function deactivate() {}
