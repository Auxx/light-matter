import { FileInfo } from 'internal-api';

export interface MonthGroup {
  readonly year: number;
  readonly month: number; // 0-11
  readonly monthName: string; // e.g. "January"
  readonly sectionId: string; // e.g. "date-group-2024-0"
  readonly images: FileInfo[];
}

export interface YearGroup {
  readonly year: number;
  readonly months: MonthGroup[];
}

export const MONTH_NAMES: readonly string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export function groupImagesByYearAndMonth(images: FileInfo[] | null): YearGroup[] {
  if (!images || images.length === 0) {
    return [];
  }

  const yearMap = new Map<number, Map<number, FileInfo[]>>();
  const yearOrder: number[] = [];
  const monthOrder = new Map<number, number[]>();

  for (const image of images) {
    const timestamp = image.createdAt;
    const date = typeof timestamp === 'number' && !isNaN(timestamp) ? new Date(timestamp) : new Date(0);
    const year = date.getFullYear();
    const month = date.getMonth();

    let monthsMap = yearMap.get(year);
    if (!monthsMap) {
      monthsMap = new Map<number, FileInfo[]>();
      yearMap.set(year, monthsMap);
      yearOrder.push(year);
      monthOrder.set(year, []);
    }

    let monthImages = monthsMap.get(month);
    if (!monthImages) {
      monthImages = [];
      monthsMap.set(month, monthImages);
      const monthsList = monthOrder.get(year);
      if (monthsList) {
        monthsList.push(month);
      }
    }

    monthImages.push(image);
  }

  return yearOrder.map(year => {
    const monthsMap = yearMap.get(year);
    const months = (monthOrder.get(year) ?? []).map(month => {
      const monthName = MONTH_NAMES[month] ?? 'Unknown';
      const sectionId = `date-group-${year}-${month}`;
      return {
        year,
        month,
        monthName,
        sectionId,
        images: monthsMap?.get(month) ?? []
      };
    });

    return {
      year,
      months
    };
  });
}
