import { Meta, StoryObj } from '@storybook/angular';
import { allSizes } from '../../../content/types/size.types';
import { allVariants } from '../../../content/types/variant.types';
import { allButtonTypes } from '../../types/button.types';
import { ActionButtonComponent } from './action-button.component';

const meta: Meta<ActionButtonComponent> = {
  component: ActionButtonComponent,
  title: 'Components/Actions/ActionButton',

  args: {
    variant: 'default',
    size: 'medium',
    type: allButtonTypes[0],
    disabled: false
  },

  argTypes: {
    variant: {
      control: 'select',
      options: allVariants,
      description: 'Button variant',
      table: {
        category: 'Presentation',
        defaultValue: { summary: allVariants[0] },
        type: { summary: 'Variant' }
      }
    },
    size: {
      control: 'select',
      options: allSizes,
      description: 'Button size',
      table: {
        category: 'Presentation',
        defaultValue: { summary: allSizes[0] },
        type: { summary: 'Size' }
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

type Story = StoryObj<ActionButtonComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-action-button
        [variant]="variant"
        [size]="size"
        [type]="type"
        [disabled]="disabled">
        Click me
      </ui-action-button>`
    };
  }
};
