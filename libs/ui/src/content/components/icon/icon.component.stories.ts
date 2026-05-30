import { Meta, StoryObj } from '@storybook/angular';
import { allExtendedSizes } from '../../types/size.types';
import { allVariants } from '../../types/variant.types';
import { IconComponent } from './icon.component';
import { allIcons } from './icons/icon.mapping';

const meta: Meta<IconComponent> = {
  component: IconComponent,
  title: 'Components/Content/Icon',

  args: {
    icon: allIcons[0],
    size: allExtendedSizes[0],
    variant: allVariants[0]
  },

  argTypes: {
    icon: {
      control: 'select',
      options: allIcons,
      description: 'Fluent icon name',
      table: {
        category: 'Presentation',
        defaultValue: { summary: allIcons[0] },
        type: { summary: 'IconName' }
      }
    },
    variant: {
      control: 'radio',
      options: allVariants,
      description: 'Icon variant',
      table: {
        category: 'Presentation',
        defaultValue: { summary: allVariants[0] },
        type: { summary: 'Variant' }
      }
    },
    size: {
      control: 'radio',
      options: allExtendedSizes,
      description: 'Icon size',
      table: {
        category: 'Presentation',
        defaultValue: { summary: allExtendedSizes[0] },
        type: { summary: 'ExtendedSize' }
      }
    }
  }
};

export default meta;

type Story = StoryObj<IconComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-icon
        [icon]="icon"
        [size]="size"
        [variant]="variant"/>`
    };
  }
};

export const BasicIcon: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-icon icon="folder"/>`
    };
  }
};

/**
 * It is possible to customise most visual aspects of `Icon` using CSS variables.
 * These variables can be set either via a stylesheet or using Angular `[style]` binding,
 * as shown in the example below. The `[style]` binding can also accept a single object
 * containing multiple variables.
 *
 * The following CSS variables can be used for custom styling:
 *
 * | Variable    |
 * |-------------|
 * | --icon-size |
 * | --color     |
 */
export const CustomStyling: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-icon icon="folder" [style.--icon-size]="'48px'"/>`
    };
  }
};
