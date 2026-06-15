import { Meta, StoryObj } from '@storybook/angular';
import { OverlayComponent } from './overlay.component';

const meta: Meta<OverlayComponent> = {
  title: 'Components/Overlay',
  component: OverlayComponent,

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<OverlayComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `<ui-overlay></ui-overlay>`
    };
  }
};
