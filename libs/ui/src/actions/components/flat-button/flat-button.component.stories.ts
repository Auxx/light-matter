import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { IconComponent } from '../../../content/components/icon/icon.component';
import { allSizes } from '../../../content/types/size.types';
import { allVariants } from '../../../content/types/variant.types';
import { allButtonTypes } from '../../types/button.types';
import { FlatButtonComponent } from './flat-button.component';

const meta: Meta<FlatButtonComponent> = {
  title: 'Components/Actions/FlatButton',
  component: FlatButtonComponent,
  decorators: [
    moduleMetadata({ imports: [ IconComponent ] })
  ],

  args: {
    variant: allVariants[0],
    size: 'medium',
    compact: false,
    type: allButtonTypes[0],
    disabled: false
  },

  argTypes: {
    variant: {
      control: 'radio',
      options: allVariants,
      description: 'Button variant',
      table: {
        category: 'Presentation',
        defaultValue: { summary: allVariants[0] },
        type: { summary: 'Variant' }
      }
    },
    size: {
      control: 'radio',
      options: allSizes,
      description: 'Button size',
      table: {
        category: 'Presentation',
        defaultValue: { summary: allSizes[0] },
        type: { summary: 'Size' }
      }
    },
    compact: {
      control: 'boolean',
      description: 'Is button compact?',
      table: {
        category: 'Presentation',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' }
      }
    },
    type: {
      control: 'radio',
      options: allButtonTypes,
      description: 'Type of the button',
      table: {
        category: 'Behaviour',
        defaultValue: { summary: allButtonTypes[0] },
        type: { summary: 'ButtonType' }
      }
    },
    disabled: {
      description: 'Flag to disable the button',
      table: { category: 'Behaviour', defaultValue: { summary: 'false' } }
    }
  }
};

export default meta;

type Story = StoryObj<FlatButtonComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-flat-button
        [variant]="variant"
        [size]="size"
        [compact]="compact"
        [type]="type"
        [disabled]="disabled">
        Click me
      </ui-flat-button>`
    };
  }
};

/**
 * It is possible to customise most visual aspects of `FlatButton` using CSS variables.
 * These variables can be set either via a stylesheet or using Angular `[style]` binding,
 * as shown in the example below. The `[style]` binding can also accept a single object
 * containing multiple variables.
 *
 * The following CSS variables can be used for custom styling:
 *
 * | Variable                    |
 * |-----------------------------|
 * | --font-family               |
 * | --font-size                 |
 * | --height                    |
 * | --gap                       |
 * | --side-padding              |
 * | --text-color                |
 * | --disabled-text-color       |
 * | --background-color          |
 * | --disabled-background-color |
 */
export const CustomStyling: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-flat-button
        [style.--font-size]="'24px'"
        [style.--text-color]="'red'">
        Custom style
      </ui-flat-button>`
    };
  }
};
