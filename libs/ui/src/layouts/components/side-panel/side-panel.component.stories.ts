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

/**
 * It is possible to customise most visual aspects of `SidePanel` using CSS variables.
 * These variables can be set either via a stylesheet or using Angular `[style]` binding,
 * as shown in the example below. The `[style]` binding can also accept a single object
 * containing multiple variables.
 *
 * The following CSS variables can be used for custom styling:
 *
 * | Variable                 |
 * |--------------------------|
 * | --border-radius          |
 * | --padding                |
 * | --margin                 |
 * | --divider-color          |
 * | --background-color       |
 * | --aside-background-color |
 */
export const CustomStyling: Story = {
  render: props => {
    return {
      props,
      template: `
      <div style="height: 300px; display: flex;">
        <ui-side-panel
          [style.--aside-background-color]="'#013'"
          [resizable]="resizable"
          [hidden]="hidden">

        <aside>
          <div>Side panel content</div>
        </aside>

        <div>
          Main content
        </div>

        </ui-side-panel>
      </div>`
    };
  }
};
