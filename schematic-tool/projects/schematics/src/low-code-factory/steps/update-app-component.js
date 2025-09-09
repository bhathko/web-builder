"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppComponent = updateAppComponent;
exports.updateAppComponentTemplate = updateAppComponentTemplate;
const schematics_1 = require("@angular-devkit/schematics");
function updateAppComponent(options, pageName) {
    return (tree, context) => {
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
        const moduleImport = `import { ${pageName}Component } from './pages/${pageName}/${schematics_1.strings.dasherize(pageName)}.component';\n`;
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
        }
        else {
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
function updateAppComponentTemplate(options, pageName) {
    return (tree, context) => {
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
        const newComponentTag = `<app-${schematics_1.strings.dasherize(pageName)}></app-${schematics_1.strings.dasherize(pageName)}>`;
        tree.overwrite(appHtmlPath, newComponentTag + '\n' + content.toString());
        context.logger.info(`Updated app HTML file ${appHtmlPath}.`);
    };
}
//# sourceMappingURL=update-app-component.js.map