import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as fs from 'fs';
import * as path from 'path';

export function CopyProject(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const todayDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
    let version = 1;

    let tmpDir = `../tmp/${todayDate}`;
    const excludedDirs = ['node_modules', '.angular', '.vscode', 'projects'];
    // Ensure the tmp directory exists
    while (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // Iterate through all files in the Tree
    tree.visit((filePath, fileEntry) => {
      // Skip excluded directories
      if (excludedDirs.some((dir) => filePath.includes(`/${dir}/`))) {
        return;
      }

      if (fileEntry) {
        const fullPath = path.join(tmpDir, filePath);
        const dirName = path.dirname(fullPath);

        // Ensure the directory structure exists
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }

        // Write the file content to the tmp directory
        fs.writeFileSync(fullPath, fileEntry.content);
      }
    });
    context.logger.info(`Project copied to ${tmpDir}`);

    return tree;
  };
}
