export interface RootComponent {
  pageName: string;
  pageId: string;
  component: ComponentNode;
}

export interface ComponentNode {
  id: string;
  class: string[];
  type: ComponentType;
  content: string;
  props: Record<string, string>;
  children?: ComponentNode[];
}

export enum ComponentType {
  INPUT = 'input',
  BUTTON = 'button',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  DIV = 'div',
  SPAN = 'span',
  LABEL = 'label',
  FORM = 'form',
  TABLE = 'table',
  TR = 'tr',
  TD = 'td',
  TH = 'th',
  UL = 'ul',
  OL = 'ol',
  LI = 'li',
  NAV = 'nav',
  HEADER = 'header',
  FOOTER = 'footer',
  ARTICLE = 'article',
  SECTION = 'section',
  ASIDE = 'aside',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  P = 'p',
  IMG = 'img',
  A = 'a',
  IFRAME = 'iframe',
  CANVAS = 'canvas',
  SVG = 'svg',
  VIDEO = 'video',
  AUDIO = 'audio',
  LINK = 'link',
  SCRIPT = 'script',
}
