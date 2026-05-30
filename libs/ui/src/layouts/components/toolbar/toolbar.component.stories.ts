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
        <ui-action-button>
          <ui-icon icon="chevronLeft" size="large" [inherit]="true"/>
        </ui-action-button>
        <ui-title>Properties</ui-title>
        <aside>
          <ui-action-button>
            <ui-icon icon="moreVertical" size="large" [inherit]="true"/>
          </ui-action-button>
        </aside>
      </ui-toolbar>`
    };
  }
};

/**
 * It is possible to customise most visual aspects of `Toolbar` using CSS variables.
 * These variables can be set either via a stylesheet or using Angular `[style]` binding,
 * as shown in the example below. The `[style]` binding can also accept a single object
 * containing multiple variables.
 *
 * The following CSS variables can be used for custom styling:
 *
 * | Variable |
 * |----------|
 * | --gap    |
 * | --height |
 */
export const CustomStyling: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-toolbar [style.--height]="'60px'">
        <ui-action-button><ui-icon icon="chevronLeft" size="large"/></ui-action-button>
        <ui-title>Properties</ui-title>
        <aside>
          <ui-action-button><ui-icon icon="moreVertical" size="large"/></ui-action-button>
        </aside>
      </ui-toolbar>`
    };
  }
};
