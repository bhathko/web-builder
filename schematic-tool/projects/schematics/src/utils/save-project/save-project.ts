import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as fs from 'fs';
import * as path from 'path';

export function CopyProject(name: string): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!name) {
      context.logger.error('Project name is required for CopyProject.');
      return tree;
    }

    let projectsDir = `../projects/${name}`;
    const excludedDirs = ['node_modules', '.angular', '.vscode', 'projects'];
    // Ensure the projects directory exists
    while (fs.existsSync(projectsDir)) {
      fs.rmSync(projectsDir, { recursive: true, force: true });
    }

    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true });
    }

    // Iterate through all files in the Tree
    tree.visit((filePath, fileEntry) => {
      // Skip excluded directories
      if (excludedDirs.some((dir) => filePath.includes(`/${dir}/`))) {
        return;
      }

      if (fileEntry) {
        const fullPath = path.join(projectsDir, filePath);
        const dirName = path.dirname(fullPath);

        // Ensure the directory structure exists
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }

        // Write the file content to the projects directory
        fs.writeFileSync(fullPath, fileEntry.content);
      }
    });
    context.logger.info(`Project copied to ${projectsDir}`);

    return tree;
  };
}
