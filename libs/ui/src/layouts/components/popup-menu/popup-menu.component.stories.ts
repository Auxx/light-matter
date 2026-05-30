import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ActionButtonComponent } from '../../../actions';
import { IconComponent, TextComponent } from '../../../content';
import { PopupMenuComponent } from './popup-menu.component';

const meta: Meta<PopupMenuComponent> = {
  title: 'Layouts/PopupMenu',
  component: PopupMenuComponent,
  decorators: [
    moduleMetadata({ imports: [ IconComponent, ActionButtonComponent, TextComponent ] })
  ],

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<PopupMenuComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-popup-menu>
        <ui-action-button class="cdk-menu-item">
          <ui-icon icon="folderAdd" [inherit]="true" />
          <ui-text [inherit]="true">Add</ui-text>
        </ui-action-button>
        <ui-action-button variant="warn" class="cdk-menu-item">
          <ui-icon icon="folderProhibited" [inherit]="true" />
          <ui-text [inherit]="true">Remove</ui-text>
        </ui-action-button>
      </ui-popup-menu>`
    };
  }
};

/**
 * It is possible to customise most visual aspects of `PopupMenu` using CSS variables.
 * These variables can be set either via a stylesheet or using Angular `[style]` binding,
 * as shown in the example below. The `[style]` binding can also accept a single object
 * containing multiple variables.
 *
 * The following CSS variables can be used for custom styling:
 *
 * | Variable           |
 * |--------------------|
 * | --background-color |
 * | --border-radius    |
 * | --padding          |
 */
export const CustomStyling: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-popup-menu [style.--background-color]="'#132'">
        <ui-action-button class="cdk-menu-item">
          <ui-icon icon="folderAdd" [inherit]="true" />
          <ui-text [inherit]="true">Add</ui-text>
        </ui-action-button>
        <ui-action-button variant="warn" class="cdk-menu-item">
          <ui-icon icon="folderProhibited" [inherit]="true" />
          <ui-text [inherit]="true">Remove</ui-text>
        </ui-action-button>
      </ui-popup-menu>`
    };
  }
};
