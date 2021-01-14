import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('vstodo-sidebar', sidebarProvider)
  );

  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = '$(add) Add Todo';
  item.command = 'vstodo.addTodo';
  item.show();

  context.subscriptions.push(
    vscode.commands.registerCommand('vstodo.addTodo', () => {
      const { activeTextEditor } = vscode.window;

      if (!activeTextEditor) {
        vscode.window.showInformationMessage('No active text editor');
        return;
      }

      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );

      sidebarProvider._view?.webview.postMessage({
        type: 'new-todo',
        value: text,
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vstodo.helloWorld', () => {
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vstodo.refresh', async () => {
      // HelloWorldPanel.kill();
      // HelloWorldPanel.createOrShow(context.extensionUri);
      // close the sidebar
      await vscode.commands.executeCommand('workbench.action.closeSidebar');
      // open the sidebar
      await vscode.commands.executeCommand(
        'workbench.view.extension.vstodo-sidebar-view'
      );
      setTimeout(() => {
        vscode.commands.executeCommand(
          'workbench.action.webview.openDeveloperTools'
        );
      }, 500);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vstodo.askQuestion', async () => {
      const answer = await vscode.window.showInformationMessage(
        'How was Your day?',
        'good',
        'bad',
        'decent'
      );

      if (answer === 'bad') {
        vscode.window.showInformationMessage(
          'Look for the time ahead and use is as best as you can. No use beating yourself for what you can not change.'
        );
      } else {
        console.log({ answer });
      }
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
