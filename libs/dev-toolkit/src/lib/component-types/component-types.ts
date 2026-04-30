export type ComponentType = 'component' | 'page' | 'dialog';

export const defaultComponentPrefix = 'app';

const componentFolder: Record<ComponentType, string> = {
  component: 'components',
  page: 'pages',
  dialog: 'dialogs'
};

const componentSuffix: Record<ComponentType, string> = {
  component: 'component',
  page: 'page',
  dialog: 'dialog'
};

const componentClassSuffix: Record<ComponentType, string> = {
  component: 'Component',
  page: 'Page',
  dialog: 'Dialog'
};

export function getComponentFolder(type: ComponentType) {
  return componentFolder[type];
}

export function getComponentSuffix(type: ComponentType) {
  return componentSuffix[type];
}

export function getComponentClassSuffix(type: ComponentType) {
  return componentClassSuffix[type];
}
