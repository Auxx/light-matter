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
      control: 'select',
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
