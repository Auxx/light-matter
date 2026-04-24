let isPackaged = true;

export interface Flags {
  enableGalleryMode: boolean;
}

export function setPackagedMode(flag: boolean) {
  isPackaged = flag;
}

export function flags(): Flags {
  return isPackaged
    ? {
      enableGalleryMode: false
    }
    : {
      enableGalleryMode: true
    };
}
