import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { IconComponent } from '../../../content/components/icon/icon.component';
import { allSizes } from '../../../content/types/size.types';
import { allVariants } from '../../../content/types/variant.types';
import { allButtonTypes } from '../../types/button.types';
import { ActionButtonComponent } from './action-button.component';

const meta: Meta<ActionButtonComponent> = {
  component: ActionButtonComponent,
  title: 'Components/Actions/ActionButton',
  decorators: [
    moduleMetadata({ imports: [ IconComponent ] })
  ],

  args: {
    variant: 'default',
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

type Story = StoryObj<ActionButtonComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-action-button
        [variant]="variant"
        [size]="size"
        [compact]="compact"
        [type]="type"
        [disabled]="disabled">
        Click me
      </ui-action-button>`
    };
  }
};

export const BasicButton: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-action-button>
        Cancel
      </ui-action-button>`
    };
  }
};

export const AccentButton: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-action-button variant="accent">
        Save
      </ui-action-button>`
    };
  }
};

export const ButtonWithIcon: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-action-button>
        <ui-icon icon="info"/>
        Info
      </ui-action-button>`
    };
  }
};
