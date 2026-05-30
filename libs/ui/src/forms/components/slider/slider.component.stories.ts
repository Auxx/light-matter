import { Meta, StoryObj } from '@storybook/angular';
import { allVariants } from '../../../content';
import { SliderComponent } from './slider.component';

const meta: Meta<SliderComponent> = {
  title: 'Components/Forms/Slider',
  component: SliderComponent,

  args: {
    variant: allVariants[0],
    min: 0,
    max: 100
  },

  argTypes: {
    variant: {
      control: 'radio',
      options: allVariants,
      description: 'Slider variant',
      table: {
        category: 'Presentation',
        defaultValue: { summary: allVariants[0] },
        type: { summary: 'Variant' }
      }
    },
    min: {
      control: 'number',
      description: 'Minimum value',
      table: {
        category: 'Behaviour',
        defaultValue: { summary: '0' },
        type: { summary: 'number' }
      }
    },
    max: {
      control: 'number',
      description: 'Maximum value',
      table: {
        category: 'Behaviour',
        defaultValue: { summary: '100' },
        type: { summary: 'number' }
      }
    }
  }
};

export default meta;

type Story = StoryObj<SliderComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-slider
        [variant]="variant"
        [min]="min"
        [max]="max"
      />`
    };
  }
};

/**
 * It is possible to customise most visual aspects of `Slider` using CSS variables.
 * These variables can be set either via a stylesheet or using Angular `[style]` binding,
 * as shown in the example below. The `[style]` binding can also accept a single object
 * containing multiple variables.
 *
 * The following CSS variables can be used for custom styling:
 *
 * | Variable           |
 * |--------------------|
 * | --track-color      |
 * | --indicator-color  |
 * | --indicator-radius |
 * | --dot-radius       |
 * | --track-radius     |
 */
export const CustomStyling: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-slider [style.--track-color]="'red'"/>`
    };
  }
};
