import { Meta, StoryObj } from '@storybook/angular';
import { SidePanelComponent } from './side-panel.component';

const meta: Meta<SidePanelComponent> = {
  component: SidePanelComponent,
  title: 'Layouts/SidePanel',

  args: {
    resizable: true,
    hidden: false
  },

  argTypes: {}
};

export default meta;

type Story = StoryObj<SidePanelComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `
      <div style="height: 300px; display: flex;">
        <ui-side-panel
          [resizable]="resizable"
          [hidden]="hidden">

        <aside>
          <div>Side panel content</div>
        </aside>

        <div>
          Main content
        </div>

        </ui-side-panel>
      </div>
      `
    };
  }
};
