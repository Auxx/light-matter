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
      control: 'radio',
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

/**
 * It is possible to customise most visual aspects of `Text ` using CSS variables.
 * These variables can be set either via a stylesheet or using Angular `[style]` binding,
 * as shown in the example below. The `[style]` binding can also accept a single object
 * containing multiple variables.
 *
 * The following CSS variables can be used for custom styling:
 *
 * | Variable          |
 * |-------------------|
 * | --font-family     |
 * | --font-size       |
 * | --color           |
 */
export const CustomStyling: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-text [style.--color]="'red'">
        Source code
      </ui-text>`
    };
  }
};
