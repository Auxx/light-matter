import { Meta, StoryObj } from '@storybook/angular';
import { SliderComponent } from './slider.component';

const meta: Meta<SliderComponent> = {
  title: 'Components/Slider',
  component: SliderComponent,

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<SliderComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `<ui-slider></ui-slider>`
    };
  }
};
