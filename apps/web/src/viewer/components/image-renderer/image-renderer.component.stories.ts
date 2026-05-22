import { Meta, StoryObj } from '@storybook/angular';
import { ImageRendererComponent } from './image-renderer.component';

const meta: Meta<ImageRendererComponent> = {
  title: 'Components/ImageRenderer',
  component: ImageRendererComponent,

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<ImageRendererComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `<app-image-renderer></app-image-renderer>`
    };
  }
};
