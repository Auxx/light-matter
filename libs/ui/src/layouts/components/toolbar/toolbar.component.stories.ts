import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ActionButtonComponent } from '../../../actions';
import { IconComponent, TitleComponent } from '../../../content';
import { ToolbarComponent } from './toolbar.component';

const meta: Meta<ToolbarComponent> = {
  title: 'Layouts/Toolbar',
  component: ToolbarComponent,
  decorators: [
    moduleMetadata({
      imports: [
        IconComponent,
        ActionButtonComponent,
        TitleComponent
      ]
    })
  ],

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<ToolbarComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-toolbar>
        <ui-action-button><ui-icon icon="chevronLeft" size="large"/></ui-action-button>
        <ui-title>Properties</ui-title>
        <aside>
          <ui-action-button><ui-icon icon="moreVertical" size="large"/></ui-action-button>
        </aside>
      </ui-toolbar>`
    };
  }
};
