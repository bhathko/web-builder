"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPage = createPage;
const schematics_1 = require("@angular-devkit/schematics");
function createPage(options, pageName, pageContent) {
    return (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)("./files/page"), [
        (0, schematics_1.template)(Object.assign(Object.assign(Object.assign({}, options), schematics_1.strings), { pageName,
            pageContent })),
        (0, schematics_1.forEach)((file) => {
            if (file.path.endsWith(".template")) {
                const newPath = file.path.replace(".template", "");
                return {
                    path: newPath,
                    content: file.content,
                };
            }
            return file;
        }),
        (0, schematics_1.move)(`./src/app/pages/${pageName}`),
    ]));
}
//# sourceMappingURL=create-page.js.map