import { CacheManager } from '../cache-manager/cache-manager';
import { Dialogs } from '../dialogs/dialogs';
import { Exif } from '../exif/exif';
import { FileSystem } from '../file-system/file-system';
import { ProcessManager } from '../process-manager/process-manager';
import { ThumbManager } from '../thumb-manager/thumb-manager';

/**
 * Basic dependency injector. Don't have time to investigate DI solutions for Node/Electron.
 */
export class Injector {
  private static instance: Injector;

  private readonly dependencies = {
    Dialogs: new Dialogs(),
    Exif: new Exif(),
    FileSystem: new FileSystem(),
    ProcessManager: new ProcessManager(),
    CacheManager: new CacheManager(),
    ThumbManager: new ThumbManager()
  } as const;

  private constructor() {
    // No code here
  }

  readonly inject = <T extends keyof typeof this.dependencies>(dependency: T): (typeof this.dependencies)[T] =>
    this.dependencies[dependency];

  static getInstance() {
    if (!Injector.instance) {
      Injector.instance = new Injector();
    }

    return Injector.instance;
  }
}
