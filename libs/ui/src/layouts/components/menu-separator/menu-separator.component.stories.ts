import { Meta, StoryObj } from '@storybook/angular';
import { MenuSeparatorComponent } from './menu-separator.component';

const meta: Meta<MenuSeparatorComponent> = {
  title: 'Components/MenuSeparator',
  component: MenuSeparatorComponent,

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<MenuSeparatorComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `<ui-menu-separator></ui-menu-separator>`
    };
  }
};
