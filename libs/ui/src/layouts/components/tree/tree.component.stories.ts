import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { IconComponent } from '../../../content';
import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { TreeNode } from '../tree-node/tree-node.component.types';
import { TreeComponent } from './tree.component';

const meta: Meta<TreeComponent<string>> = {
  title: 'Layouts/Tree',
  component: TreeComponent,
  decorators: [
    moduleMetadata({
      imports: [
        IconComponent,
        TreeNodeComponent
      ]
    })
  ],

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<TreeComponent<string>>;

export const Primary: Story = {
  render: props => {
    const root: TreeNode<string> = {
      id: '/',
      label: 'My PC',
      openIcon: 'desktop',
      closedIcon: 'desktop',
      isOpen: true,
      children: [
        {
          id: '/pictures',
          label: 'Pictures',
          openIcon: 'folderOpen',
          closedIcon: 'folder',
          children: [
            {
              id: '/pictures/2025',
              label: '2025',
              openIcon: 'folderOpen',
              closedIcon: 'folder'
            },
            {
              id: '/pictures/2026',
              label: '2026',
              openIcon: 'folderOpen',
              closedIcon: 'folder'
            }
          ]
        },
        {
          id: '/camera',
          label: 'Camera',
          openIcon: 'folderOpen',
          closedIcon: 'folder'
        },
        {
          id: '/blackmagic-camera',
          label: 'Blackmagic Camera',
          openIcon: 'folderOpen',
          closedIcon: 'folder'
        }
      ]
    };

    return {
      props: { ...props, root },
      template: `
      <ui-tree [root]="root" [enableLoading]="true" />`
    };
  }
};
