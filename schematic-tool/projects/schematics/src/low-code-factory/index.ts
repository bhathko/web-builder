import {
  apply,
  chain,
  externalSchematic,
  FileAlreadyExistException,
  FileEntry,
  forEach,
  mergeWith,
  move,
  Rule,
  strings,
  template,
  url,
} from '@angular-devkit/schematics';

import { fetchProject } from '../utils/api/api.handler';
import { htmlGenerator } from '../utils/html-generator/html-generator';
import { createPage } from './steps/create-page';
import {
  updateAppComponent,
  updateAppComponentTemplate,
} from './steps/update-app-component';
import { CopyProject } from '../utils/save-project/save-project';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function lowCodeFactory(options: any): Rule {
  return async (tree, context) => {
    const res = await fetchProject(options.id);
    const { _id, name, component } = res.data;
    if (!name || !component) {
      throw new Error('Invalid response from fetchProject');
    }
    if (tree.exists(`/${options.name}/src/app/page/${name}.component.ts`)) {
      throw new FileAlreadyExistException(
        `Component ${name} already exists in the project.`
      );
    }

    const pageContent = htmlGenerator(component);

    context.logger.info(`Creating component with name: ${name}`);

    // Take a snapshot of the original tree
    const originalTree = tree.branch();
    return chain([
      createPage(options, name, pageContent),
      updateAppComponent(options, name),
      updateAppComponentTemplate(options, name),
      // Ensure CopyProject runs last
      (tree, context) => {
        context.logger.info('Copying project to tmp directory...');
        CopyProject(_id)(tree, context);
        tree = originalTree;
        context.logger.info('Project copied successfully.');
        return tree;
      },
    ]);
  };
}
