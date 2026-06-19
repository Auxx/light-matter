import { addFilled } from './add_16_filled';
import { add } from './add_16_regular';
import { addCircleFilled } from './add_circle_16_filled';
import { addCircle } from './add_circle_16_regular';
import { arrowCircleDownFilled } from './arrow_circle_down_16_filled';
import { arrowCircleDown } from './arrow_circle_down_16_regular';
import { arrowCircleLeftFilled } from './arrow_circle_left_16_filled';
import { arrowCircleLeft } from './arrow_circle_left_16_regular';
import { arrowCircleRightFilled } from './arrow_circle_right_16_filled';
import { arrowCircleRight } from './arrow_circle_right_16_regular';
import { arrowCircleUpFilled } from './arrow_circle_up_16_filled';
import { arrowCircleUp } from './arrow_circle_up_16_regular';
import { arrowClockwise } from './arrow_clockwise_16_regular';
import { arrowSort } from './arrow_sort_16_regular';
import { calendar } from './calendar_16_regular';
import { chevronDown } from './chevron_down_16_regular';
import { chevronLeft } from './chevron_left_16_regular';
import { chevronRight } from './chevron_right_16_regular';
import { chevronUp } from './chevron_up_16_regular';
import { desktopFilled } from './desktop_16_filled';
import { desktop } from './desktop_16_regular';
import { dismissCircleFilled } from './dismiss_circle_16_filled';
import { dismissCircle } from './dismiss_circle_16_regular';
import { folderFilled } from './folder_16_filled';
import { folder } from './folder_16_regular';
import { folderAddFilled } from './folder_add_16_filled';
import { folderAdd } from './folder_add_16_regular';
import { folderOpen } from './folder_open_16_regular';
import { folderProhibitedFilled } from './folder_prohibited_16_filled';
import { folderProhibited } from './folder_prohibited_16_regular';
import { fullScreenMaximize } from './full_screen_maximize_16_regular';
import { infoFilled } from './info_16_filled';
import { info } from './info_16_regular';
import { moreHorizontal } from './more_horizontal_16_regular';
import { moreVertical } from './more_vertical_16_regular';
import { reorderDotsVertical } from './re_order_dots_vertical_16_regular';
import { reorderVertical } from './re_order_vertical_16_regular';
import { save } from './save_16_regular';
import { scaleFill } from './scale_fill_20_regular';
import { scaleFit } from './scale_fit_16_regular';
import { scanCamera } from './scan_camera_16_regular';
import { text } from './text_16_regular';
import { zoomFitFilled } from './zoom_fit_16_filled';
import { zoomFit } from './zoom_fit_16_regular';
import { zoomInFilled } from './zoom_in_16_filled';
import { zoomIn } from './zoom_in_16_regular';
import { zoomOutFilled } from './zoom_out_16_filled';
import { zoomOut } from './zoom_out_16_regular';

export const allIcons = [
  'addFilled',
  'add',
  'addCircleFilled',
  'addCircle',
  'arrowCircleDownFilled',
  'arrowCircleDown',
  'arrowCircleLeftFilled',
  'arrowCircleLeft',
  'arrowCircleRightFilled',
  'arrowCircleRight',
  'arrowCircleUpFilled',
  'arrowCircleUp',
  'arrowClockwise',
  'arrowSort',
  'calendar',
  'chevronDown',
  'chevronLeft',
  'chevronRight',
  'chevronUp',
  'desktopFilled',
  'desktop',
  'dismissCircleFilled',
  'dismissCircle',
  'folderFilled',
  'folder',
  'folderAddFilled',
  'folderAdd',
  'folderOpen',
  'folderProhibitedFilled',
  'folderProhibited',
  'fullScreenMaximize',
  'infoFilled',
  'info',
  'moreHorizontal',
  'moreVertical',
  'reorderDotsVertical',
  'reorderVertical',
  'save',
  'scaleFill',
  'scaleFit',
  'scanCamera',
  'text',
  'zoomFitFilled',
  'zoomFit',
  'zoomInFilled',
  'zoomIn',
  'zoomOutFilled',
  'zoomOut'
] as const;

export type IconName = typeof allIcons[number];

export const iconMapping: Record<IconName, string> = {
  addFilled,
  add,
  addCircleFilled,
  addCircle,
  arrowCircleDownFilled,
  arrowCircleDown,
  arrowCircleLeftFilled,
  arrowCircleLeft,
  arrowCircleRightFilled,
  arrowCircleRight,
  arrowCircleUpFilled,
  arrowCircleUp,
  arrowClockwise,
  arrowSort,
  calendar,
  chevronDown,
  chevronLeft,
  chevronRight,
  chevronUp,
  desktopFilled,
  desktop,
  dismissCircleFilled,
  dismissCircle,
  folderFilled,
  folder,
  folderAddFilled,
  folderAdd,
  folderOpen,
  folderProhibitedFilled,
  folderProhibited,
  fullScreenMaximize,
  infoFilled,
  info,
  moreHorizontal,
  moreVertical,
  reorderDotsVertical,
  reorderVertical,
  save,
  scaleFill,
  scaleFit,
  scanCamera,
  text,
  zoomFitFilled,
  zoomFit,
  zoomInFilled,
  zoomIn,
  zoomOutFilled,
  zoomOut
};
