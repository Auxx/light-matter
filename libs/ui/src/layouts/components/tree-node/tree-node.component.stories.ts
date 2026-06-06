import { Meta, StoryObj } from '@storybook/angular';
import { TreeNodeComponent } from './tree-node.component';

const meta: Meta<TreeNodeComponent<string>> = {
  title: 'Layouts/TreeNode',
  component: TreeNodeComponent,

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<TreeNodeComponent<string>>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `<div>XXX</div>`
      // template: `<ui-tree-node></ui-tree-node>`
    };
  }
};
