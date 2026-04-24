export interface Flags {
  enableGalleryMode: boolean;
}

export function flags(isPackaged: boolean): Flags {
  return isPackaged
    ? {
      enableGalleryMode: false
    }
    : {
      enableGalleryMode: true
    };
}
