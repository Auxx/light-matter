import { Meta, StoryObj } from '@storybook/angular';
import { InfoOverlayComponent } from './info-overlay.component';

const meta: Meta<InfoOverlayComponent> = {
  title: 'Components/InfoOverlay',
  component: InfoOverlayComponent,

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<InfoOverlayComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `<ui-info-overlay></ui-info-overlay>`
    };
  }
};
