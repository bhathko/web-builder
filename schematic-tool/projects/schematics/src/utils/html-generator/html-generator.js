"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlGenerator = htmlGenerator;
function htmlGenerator(node) {
    // Factory map for supported tags
    const factories = {
        div: new GenericElement('div'),
        form: new GenericElement('form'),
        input: new InputElementWithMatInput(),
        button: new ButtonElementWithMatButton(),
        select: new GenericElement('select'),
        textarea: new GenericElement('textarea'),
        label: new GenericElement('label'),
        span: new GenericElement('span'),
        a: new GenericElement('a'),
        table: new GenericElement('table'),
        tr: new GenericElement('tr'),
        td: new GenericElement('td'),
        th: new GenericElement('th'),
        h2: new GenericElement('h2'),
    };
    const factory = factories[node.type.toLowerCase()];
    if (!factory) {
        throw new Error(`Unsupported element type: ${node.type}`);
    }
    return factory.createElement(node);
}
class GenericElement {
    constructor(tag, selfClosing = false) {
        this.tag = tag;
        this.selfClosing = selfClosing;
    }
    createElement(node) {
        var _a, _b;
        const classAttr = ((_a = node === null || node === void 0 ? void 0 : node.class) === null || _a === void 0 ? void 0 : _a.length)
            ? ` class="${node.class.join(' ')}"`
            : '';
        let propsAttr = '';
        if (node.props) {
            propsAttr = Object.entries(node.props)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
        }
        if (this.selfClosing) {
            return `<${this.tag} id="${node.id}"${classAttr} ${propsAttr}>`;
        }
        const childrenHtml = ((_b = node.children) === null || _b === void 0 ? void 0 : _b.map(htmlGenerator).join('')) || '';
        return `<${this.tag} id="${node.id}"${classAttr} ${propsAttr}>${node.content || ''}${childrenHtml}</${this.tag}>`;
    }
}
// Example of a special-case element with custom logic
class InputElementWithMatInput {
    createElement(node) {
        var _a;
        const classAttr = ((_a = node === null || node === void 0 ? void 0 : node.class) === null || _a === void 0 ? void 0 : _a.length)
            ? ` class="${node.class.join(' ')}"`
            : '';
        let propsAttr = '';
        if (node.props) {
            propsAttr = Object.entries(node.props)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
        }
        // Always add matInput directive
        return `<input matInput id="${node.id}"${classAttr} ${propsAttr}>`;
    }
}
class ButtonElementWithMatButton {
    createElement(node) {
        var _a;
        const classAttr = ((_a = node === null || node === void 0 ? void 0 : node.class) === null || _a === void 0 ? void 0 : _a.length)
            ? ` class="${node.class.join(' ')}"`
            : '';
        let propsAttr = '';
        if (node.props) {
            propsAttr = Object.entries(node.props)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
        }
        // Always add mat-button directive
        return `<button matButton id="${node.id}"${classAttr} ${propsAttr}>${node.content || ''}</button>`;
    }
}
//# sourceMappingURL=html-generator.js.map