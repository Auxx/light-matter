import { Meta, StoryObj } from '@storybook/angular';
import { ToolMenuComponent } from './tool-menu.component';

const meta: Meta<ToolMenuComponent> = {
  title: 'Layouts/ToolMenu',
  component: ToolMenuComponent,

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<ToolMenuComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-tool-menu>
        <section>First section</section>
        <section>Second section</section>
        <section>Third section</section>
      </ui-tool-menu>`
    };
  }
};
