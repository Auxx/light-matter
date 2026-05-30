import { Meta, StoryObj } from '@storybook/angular';
import { PalettePreviewComponent } from './palette-preview.component';

const meta: Meta<PalettePreviewComponent> = {
  component: PalettePreviewComponent,
  title: 'Documentation/Stories/PalettePreview'
};

export default meta;

type Story = StoryObj<PalettePreviewComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `<ui-palette-preview/>`
    };
  }
};
