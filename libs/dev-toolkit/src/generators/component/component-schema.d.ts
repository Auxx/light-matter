import { ComponentType } from '../../lib/component-types/component.types';

export interface ComponentGeneratorSchema {
  name: string;
  project: string;
  feature: string;
  type: ComponentType;
}
