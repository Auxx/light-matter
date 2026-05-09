import { Meta, StoryObj } from '@storybook/angular';
import { allExtendedSizes } from '../../types/size.types';
import { allVariants } from '../../types/variant.types';
import { IconComponent } from './icon.component';
import { allIcons } from './icon.types';

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
      control: 'select',
      options: allVariants,
      description: 'Icon variant',
      table: {
        category: 'Presentation',
        defaultValue: { summary: allVariants[0] },
        type: { summary: 'Variant' }
      }
    },
    size: {
      control: 'select',
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
