"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lowCodeFactory = lowCodeFactory;
const schematics_1 = require("@angular-devkit/schematics");
const api_handler_1 = require("../utils/api/api.handler");
const html_generator_1 = require("../utils/html-generator/html-generator");
const create_page_1 = require("./steps/create-page");
const update_app_component_1 = require("./steps/update-app-component");
const save_project_1 = require("../utils/save-project/save-project");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function lowCodeFactory(options) {
    return (tree, context) => __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, api_handler_1.fetchCompoentTree)(options.id);
        const { pageName, component } = res.data;
        if (!pageName || !component) {
            throw new Error('Invalid response from fetchCompoentTree');
        }
        if (tree.exists(`/${options.name}/src/app/page/${pageName}.component.ts`)) {
            throw new schematics_1.FileAlreadyExistException(`Component ${pageName} already exists in the project.`);
        }
        const pageContent = (0, html_generator_1.htmlGenerator)(component);
        context.logger.info(`Creating component with name: ${pageName}`);
        // Take a snapshot of the original tree
        const originalTree = tree.branch();
        return (0, schematics_1.chain)([
            (0, create_page_1.createPage)(options, pageName, pageContent),
            (0, update_app_component_1.updateAppComponent)(options, pageName),
            (0, update_app_component_1.updateAppComponentTemplate)(options, pageName),
            // Ensure CopyProject runs last
            (tree, context) => {
                context.logger.info('Copying project to tmp directory...');
                (0, save_project_1.CopyProject)()(tree, context);
                tree = originalTree;
                context.logger.info('Project copied successfully.');
                return tree;
            },
        ]);
    });
}
//# sourceMappingURL=index.js.map