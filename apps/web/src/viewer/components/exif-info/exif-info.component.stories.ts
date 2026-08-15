import { Meta, StoryObj } from '@storybook/angular';
import { ExifInfoComponent } from './exif-info.component';

const meta: Meta<ExifInfoComponent> = {
  title: 'Components/ExifInfo',
  component: ExifInfoComponent,

  args: {
    exif: {
      FileName: 'sample.jpg',
      FileSize: '2.4 MB',
      FileType: 'JPEG',
      MIMEType: 'image/jpeg',
      Make: 'Canon',
      Model: 'EOS R5',
      LensID: 'RF 24-70mm F2.8 L IS USM',
      FocalLength: '50.0 mm',
      ShutterSpeedValue: '1/250',
      ISO: 100
    },
    dimensions: {
      width: 1920,
      height: 1080
    }
  },

  argTypes: {}
};

export default meta;

type Story = StoryObj<ExifInfoComponent>;

export const Primary: Story = {
  render: props => {
    return {
      props,
      template: `<app-exif-info [exif]="exif" [dimensions]="dimensions"></app-exif-info>`
    };
  }
};

export const Loading: Story = {
  args: {
    exif: false
  },
  render: props => {
    return {
      props,
      template: `<app-exif-info [exif]="exif" [dimensions]="dimensions"></app-exif-info>`
    };
  }
};
