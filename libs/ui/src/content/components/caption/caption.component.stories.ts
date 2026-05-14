import { Meta, StoryObj } from '@storybook/angular';
import { allVariants } from '../../types/variant.types';
import { CaptionComponent } from './caption.component';

const meta: Meta<CaptionComponent> = {
  title: 'Components/Content/Caption',
  component: CaptionComponent,

  args: {
    variant: allVariants[0]
  },

  argTypes: {
    variant: {
      control: 'radio',
      options: allVariants,
      description: 'Caption variant',
      table: {
        category: 'Presentation',
        defaultValue: { summary: allVariants[0] },
        type: { summary: 'Variant' }
      }
    }
  }
};

export default meta;

type Story = StoryObj<CaptionComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-caption [variant]="variant">
        Show folders
      </ui-caption>`
    };
  }
};

/**
 * It is possible to customise most visual aspects of `Caption` using CSS variables.
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
      <ui-caption [style.--color]="'red'">
        Source code
      </ui-caption>`
    };
  }
};
