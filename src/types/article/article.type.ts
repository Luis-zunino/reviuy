export enum ContentType {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  P = 'p',
  UL = 'ul',
  OL = 'ol',
  LI = 'li',
  STRONG = 'strong',
  EM = 'em',
  BLOCKQUOTE = 'blockquote',
  CODE = 'code',
}

export interface ContentBlock {
  type: ContentType;
  text?: string;
  children?: ContentBlock[];
}

export type ContentSection = ContentBlock[];

export interface Tip {
  id: string;
  title: string;
  excerpt: string;
  category: TipType;
  date: string;
  readTime: string;
  content: ContentSection[];
}

export enum TipType {
  ARTICLE = 'article',
  TIP = 'tip',
  ALL = 'Todos',
  CONTRACTS = 'Contratos',
  FINANCE = 'Finanzas',
  SECURITY = 'Seguridad',
  LEGAL = 'Legal',
  TIPS = 'Tips',
  GUIDES = 'Guías',
}
