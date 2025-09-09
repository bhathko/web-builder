import { ComponentNode } from './html-generator.model';

export function htmlGenerator(node: ComponentNode): string {
  // Factory map for supported tags
  const factories: { [key: string]: elementTagFactory } = {
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

interface elementTagFactory {
  createElement: (node: ComponentNode) => string;
}

class GenericElement implements elementTagFactory {
  constructor(private tag: string, private selfClosing = false) {}

  createElement(node: ComponentNode): string {
    const classAttr = node?.class?.length
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
    const childrenHtml = node.children?.map(htmlGenerator).join('') || '';
    return `<${this.tag} id="${node.id}"${classAttr} ${propsAttr}>${
      node.content || ''
    }${childrenHtml}</${this.tag}>`;
  }
}

// Example of a special-case element with custom logic
class InputElementWithMatInput implements elementTagFactory {
  createElement(node: ComponentNode): string {
    const classAttr = node?.class?.length
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

class ButtonElementWithMatButton implements elementTagFactory {
  createElement(node: ComponentNode): string {
    const classAttr = node?.class?.length
      ? ` class="${node.class.join(' ')}"`
      : '';
    let propsAttr = '';
    if (node.props) {
      propsAttr = Object.entries(node.props)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    }
    // Always add mat-button directive
    return `<button matButton id="${node.id}"${classAttr} ${propsAttr}>${
      node.content || ''
    }</button>`;
  }
}
