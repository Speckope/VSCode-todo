import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vstodo" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand('vstodo.helloWorld', () => {
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vstodo.refresh', () => {
      HelloWorldPanel.kill();
      HelloWorldPanel.createOrShow(context.extensionUri);
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
