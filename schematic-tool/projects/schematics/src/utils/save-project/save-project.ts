import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as fs from 'fs';
import * as path from 'path';

export function CopyProject(_id: string): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!_id) {
      context.logger.error('Project _id is required for CopyProject.');
      return tree;
    }

    let projectsDir = `../projects/${_id}`;
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
        const dir_id = path.dirname(fullPath);

        // Ensure the directory structure exists
        if (!fs.existsSync(dir_id)) {
          fs.mkdirSync(dir_id, { recursive: true });
        }

        // Write the file content to the projects directory
        fs.writeFileSync(fullPath, fileEntry.content);
      }
    });
    context.logger.info(`Project copied to ${projectsDir}`);

    return tree;
  };
}
