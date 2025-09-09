import {
  Rule,
  Tree,
  SchematicContext,
  strings,
} from '@angular-devkit/schematics';

export function updateAppComponent(options: any, pageName: string): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const componentPath = `./src/app/app.ts`;
    if (!tree.exists(componentPath)) {
      context.logger.error(`Component file ${componentPath} does not exist.`);
      return;
    }

    const content = tree.read(componentPath);
    if (!content) {
      context.logger.error(`Could not read component file ${componentPath}.`);
      return;
    }

    const moduleImport = `import { ${pageName}Component } from './pages/${pageName}/${strings.dasherize(
      pageName
    )}.component';\n`;

    const checkImportsIsEmpty = content.toString().includes('imports: []');
    context.logger.info(checkImportsIsEmpty + '');
    let updatedContent = content.toString();

    if (checkImportsIsEmpty) {
      const importsRegex = /imports: \[\]/;
      const contentString = content.toString();
      if (!importsRegex.test(contentString)) {
        context.logger.error(`No imports array found in ${componentPath}.`);
        return;
      }
      updatedContent = contentString.replace(importsRegex, (match) => {
        return match.replace(']', `${pageName}Component]`);
      });
    } else {
      const importsRegex = /imports: \[([\s\S]*?)\]/;
      const contentString = content.toString();
      if (!importsRegex.test(contentString)) {
        context.logger.error(`No imports array found in ${componentPath}.`);
        return;
      }
      updatedContent = contentString.replace(importsRegex, (match) => {
        return match.replace(']', `, ${pageName}Component]`);
      });
    }

    updatedContent = moduleImport + updatedContent;
    tree.overwrite(componentPath, updatedContent);
    context.logger.info(`Updated component file ${componentPath}.`);
  };
}

export function updateAppComponentTemplate(
  options: any,
  pageName: string
): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const appHtmlPath = `./src/app/app.html`;
    if (!tree.exists(appHtmlPath)) {
      context.logger.error(`App HTML file ${appHtmlPath} does not exist.`);
      return;
    }

    const content = tree.read(appHtmlPath);
    if (!content) {
      context.logger.error(`Could not read app HTML file ${appHtmlPath}.`);
      return;
    }

    const newComponentTag = `<app-${strings.dasherize(
      pageName
    )}></app-${strings.dasherize(pageName)}>`;

    tree.overwrite(appHtmlPath, newComponentTag + '\n' + content.toString());
    context.logger.info(`Updated app HTML file ${appHtmlPath}.`);
  };
}
