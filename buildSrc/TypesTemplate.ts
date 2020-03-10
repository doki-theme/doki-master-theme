export interface DokiThemeDefinitions {
  [key: string]: any;
}

export interface MasterDokiThemeDefinition {
  id: string;
  name: string;
  displayName: string;
  dark: boolean;
  author: string;
  group: string;
  product?: 'community' | 'ultimate';
  stickers: Stickers;
  colors: StringDictonary<string>;
}

interface HasColors {
  colors: StringDictonary<string>;
}

export interface Overrides {
  editorScheme: HasColors;
}

export interface ApplicationCodeDokiThemeDefinition {
  id: string;
  overrides: Overrides;
  laf: {
    extends: string;
    ui: StringDictonary<string>
  };
  syntax: {};
  colors: {};
}


export interface StringDictonary<T> {
  [key: string]: T;
}

export interface Stickers {
  default: string;
  secondary?: string;
  normal?: string;
}
