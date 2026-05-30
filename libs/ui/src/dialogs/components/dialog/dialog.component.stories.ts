import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ActionButtonComponent } from '../../../actions';
import { TextComponent, TitleComponent } from '../../../content';
import { DialogComponent } from './dialog.component';

const meta: Meta<DialogComponent> = {
  title: 'Dialogs/Dialog',
  component: DialogComponent,
  decorators: [
    moduleMetadata({
      imports: [
        TitleComponent,
        TextComponent,
        ActionButtonComponent
      ]
    })
  ],

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<DialogComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-dialog>
        <header>
          <ui-title>Header</ui-title>
          <ui-text>Info</ui-text>
        </header>
        <section>
          <ui-text>Body</ui-text>
        </section>
        <footer>
          <ui-action-button variant="primary">OK</ui-action-button>
          <ui-action-button>Cancel</ui-action-button>
        </footer>
      </ui-dialog>`
    };
  }
};

/**
 * It is possible to customise most visual aspects of `ActionButton` using CSS variables.
 * These variables can be set either via a stylesheet or using Angular `[style]` binding,
 * as shown in the example below. The `[style]` binding can also accept a single object
 * containing multiple variables.
 *
 * The following CSS variables can be used for custom styling:
 *
 * | Variable                   |
 * |----------------------------|
 * | --dialog-background-color  |
 * | --header-background-color  |
 * | --content-background-color |
 * | --footer-background-color  |
 * | --gap                      |
 * | --padding-vertical         |
 * | --padding-horizontal       |
 * | --header-height            |
 * | --footer-height            |
 */
export const CustomStyling: Story = {
  render: props => {
    return {
      props,
      template: `
      <ui-dialog [style.--header-background-color]="'#122'">
        <header>
          <ui-title>Header</ui-title>
          <div>Info</div>
        </header>
        <section>
          <div>Body</div>
        </section>
        <footer>
          <ui-action-button variant="accent">OK</ui-action-button>
          <ui-action-button>Cancel</ui-action-button>
        </footer>
      </ui-dialog>`
    };
  }
};
