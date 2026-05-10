import { Meta, StoryObj } from '@storybook/angular';
import { allVariants } from '../../types/variant.types';
import { TextComponent } from './text.component';

const meta: Meta<TextComponent> = {
  component: TextComponent,
  title: 'Components/Content/Text',

  args: {
    variant: allVariants[0],
    important: false
  },

  argTypes: {
    variant: {
      control: 'select',
      options: allVariants,
      description: 'Text variant',
      table: {
        category: 'Presentation',
        defaultValue: { summary: allVariants[0] },
        type: { summary: 'Variant' }
      }
    },
    important: {
      control: 'boolean',
      description: 'Whether the text is important',
      table: {
        category: 'Presentation',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' }
      }
    }
  }
};

export default meta;

type Story = StoryObj<TextComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-text
        [variant]="variant"
        [important]="important">
        Picture location
      </ui-text>`
    };
  }
};
