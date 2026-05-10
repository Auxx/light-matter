import addFilled from '@fluentui/svg-icons/icons/add_16_filled.svg';
import add from '@fluentui/svg-icons/icons/add_16_regular.svg';
import addCircleFilled from '@fluentui/svg-icons/icons/add_circle_16_filled.svg';
import addCircle from '@fluentui/svg-icons/icons/add_circle_16_regular.svg';
import arrowCircleDownFilled from '@fluentui/svg-icons/icons/arrow_circle_down_16_filled.svg';
import arrowCircleDown from '@fluentui/svg-icons/icons/arrow_circle_down_16_regular.svg';
import arrowCircleLeftFilled from '@fluentui/svg-icons/icons/arrow_circle_left_16_filled.svg';
import arrowCircleLeft from '@fluentui/svg-icons/icons/arrow_circle_left_16_regular.svg';
import arrowCircleRightFilled from '@fluentui/svg-icons/icons/arrow_circle_right_16_filled.svg';
import arrowCircleRight from '@fluentui/svg-icons/icons/arrow_circle_right_16_regular.svg';
import arrowCircleUpFilled from '@fluentui/svg-icons/icons/arrow_circle_up_16_filled.svg';
import arrowCircleUp from '@fluentui/svg-icons/icons/arrow_circle_up_16_regular.svg';
import chevronDown from '@fluentui/svg-icons/icons/chevron_down_16_regular.svg';
import chevronLeft from '@fluentui/svg-icons/icons/chevron_left_16_regular.svg';
import chevronRight from '@fluentui/svg-icons/icons/chevron_right_16_regular.svg';
import chevronUp from '@fluentui/svg-icons/icons/chevron_up_16_regular.svg';
import desktopFilled from '@fluentui/svg-icons/icons/desktop_16_filled.svg';
import desktop from '@fluentui/svg-icons/icons/desktop_16_regular.svg';
import folderFilled from '@fluentui/svg-icons/icons/folder_16_filled.svg';
import folder from '@fluentui/svg-icons/icons/folder_16_regular.svg';
import folderAddFilled from '@fluentui/svg-icons/icons/folder_add_16_filled.svg';
import folderAdd from '@fluentui/svg-icons/icons/folder_add_16_regular.svg';
import folderProhibitedFilled from '@fluentui/svg-icons/icons/folder_prohibited_16_filled.svg';
import folderProhibited from '@fluentui/svg-icons/icons/folder_prohibited_16_regular.svg';
import infoFilled from '@fluentui/svg-icons/icons/info_16_filled.svg';
import info from '@fluentui/svg-icons/icons/info_16_regular.svg';
import moreHorizontal from '@fluentui/svg-icons/icons/more_horizontal_16_regular.svg';
import moreVertical from '@fluentui/svg-icons/icons/more_vertical_16_regular.svg';
import reorderDotsVertical from '@fluentui/svg-icons/icons/re_order_dots_vertical_16_regular.svg';
import reorderVertical from '@fluentui/svg-icons/icons/re_order_vertical_16_regular.svg';
import zoomFitFilled from '@fluentui/svg-icons/icons/zoom_fit_16_filled.svg';
import zoomFit from '@fluentui/svg-icons/icons/zoom_fit_16_regular.svg';
import zoomInFilled from '@fluentui/svg-icons/icons/zoom_in_16_filled.svg';
import zoomIn from '@fluentui/svg-icons/icons/zoom_in_16_regular.svg';
import zoomOutFilled from '@fluentui/svg-icons/icons/zoom_out_16_filled.svg';
import zoomOut from '@fluentui/svg-icons/icons/zoom_out_16_regular.svg';

export const allIcons = [
  'add',
  'addFilled',
  'addCircle',
  'addCircleFilled',
  'desktop',
  'desktopFilled',
  'folderAdd',
  'folderAddFilled',
  'folder',
  'folderFilled',
  'folderProhibited',
  'folderProhibitedFilled',
  'chevronDown',
  'chevronUp',
  'chevronLeft',
  'chevronRight',
  'moreVertical',
  'moreHorizontal',
  'arrowCircleLeft',
  'arrowCircleRight',
  'arrowCircleUp',
  'arrowCircleDown',
  'arrowCircleLeftFilled',
  'arrowCircleRightFilled',
  'arrowCircleUpFilled',
  'arrowCircleDownFilled',
  'info',
  'infoFilled',
  'zoomIn',
  'zoomInFilled',
  'zoomOut',
  'zoomOutFilled',
  'zoomFit',
  'zoomFitFilled',
  'reorderVertical',
  'reorderDotsVertical'
] as const;

export type IconName = typeof allIcons[number];

export const iconMapping: Record<IconName, string> = {
  add,
  addFilled,
  addCircle,
  addCircleFilled,
  desktop,
  desktopFilled,
  folderAdd,
  folderAddFilled,
  folder,
  folderFilled,
  folderProhibited,
  folderProhibitedFilled,
  chevronDown,
  chevronUp,
  chevronLeft,
  chevronRight,
  moreVertical,
  moreHorizontal,
  arrowCircleLeft,
  arrowCircleRight,
  arrowCircleUp,
  arrowCircleDown,
  arrowCircleLeftFilled,
  arrowCircleRightFilled,
  arrowCircleUpFilled,
  arrowCircleDownFilled,
  info,
  infoFilled,
  zoomIn,
  zoomInFilled,
  zoomOut,
  zoomOutFilled,
  zoomFit,
  zoomFitFilled,
  reorderVertical,
  reorderDotsVertical
};
