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
      control: 'select',
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
