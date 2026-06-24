import { Meta, StoryObj } from '@storybook/angular';
import { SettingsDialogComponent } from './settings-dialog.component';

const meta: Meta<SettingsDialogComponent> = {
  title: 'Components/SettingsDialog',
  component: SettingsDialogComponent,

  args: {},

  argTypes: {}
};

export default meta;

type Story = StoryObj<SettingsDialogComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `<app-settings-dialog></app-settings-dialog>`
    };
  }
};
