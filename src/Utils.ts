/**
 * Utility functions to help with file path parsing and others
 */

import * as vscode from "vscode";
import * as config from "./Config";

const localPath = getUriFilePath(config.localWorkspacePath);
const remotePath = getUriFilePath(config.remoteWorkspacePath);

function getUriFilePath(path: string|undefined): string {
  return path ? vscode.Uri.file(path).toString() : '';
}

/**
 * Converts a local workspace URI to a file path string (with or without scheme) to pass to
 * the typechecker. Path is mapped to an alternate workspace root if configured.
 * @param file The file URI to convert
 * @param includeScheme Whether to include the file:// scheme in the response or not
 */
export const mapFromWorkspaceUri = (file: vscode.Uri): string => {
  if (!config.remoteEnabled || !config.remoteWorkspacePath) {
    return file.toString();
  }
  return file
    .toString()
    .replace(localPath, remotePath);
};

/**
 * Converts a file path string received from the typechecker to a local workspace URI.
 * Path is mapped from an alternate workspace root if configured.
 * @param file The file path to convert
 */
export const mapToWorkspaceUri = (file: string): vscode.Uri => {
  let filePath = file;
  if (config.remoteEnabled && config.remoteWorkspacePath) {
    filePath = filePath.replace(
      remotePath,
      localPath
    );
  }
  if (filePath.startsWith("file://")) {
    return vscode.Uri.parse(filePath);
  } else {
    return vscode.Uri.file(filePath);
  }
};
