import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ActionButtonComponent } from '../../../actions';
import { TitleComponent } from '../../../content';
import { DialogComponent } from './dialog.component';

const meta: Meta<DialogComponent> = {
  title: 'Dialogs/Dialog',
  component: DialogComponent,
  decorators: [
    moduleMetadata({
      imports: [
        TitleComponent,
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
