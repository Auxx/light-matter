import { Meta, StoryObj } from '@storybook/angular';
import { allVariants } from '../../types/variant.types';
import { TitleComponent } from './title.component';

const meta: Meta<TitleComponent> = {
  component: TitleComponent,
  title: 'Components/Content/Title',

  args: {
    variant: allVariants[0]
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
    }
  }
};

export default meta;

type Story = StoryObj<TitleComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-title
        [variant]="variant"
        [important]="important">
        Picture location
      </ui-title>`
    };
  }
};

/**
 * It is possible to customise most visual aspects of `Title` using CSS variables.
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
      <ui-title [style.--color]="'red'">
        Source code
      </ui-title>`
    };
  }
};
