import { Meta, StoryObj } from '@storybook/angular';
import { VerticalStackComponent } from './vertical-stack.component';

const meta: Meta<VerticalStackComponent> = {
  title: 'Components/VerticalStack',
  component: VerticalStackComponent,

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<VerticalStackComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `<ui-vertical-stack></ui-vertical-stack>`
    };
  }
};
