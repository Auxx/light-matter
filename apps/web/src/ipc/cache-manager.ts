import { Injectable } from '@angular/core';
import { DesktopCacheManager } from 'internal-api';

@Injectable({ providedIn: 'root' })
export class CacheManager implements DesktopCacheManager {
  readonly clear = () => window.desktop.CacheManager.clear();
}
