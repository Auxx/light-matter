import { IpcMainInvokeEvent } from 'electron';

interface ClassDescriptor {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  ctor: Function;
  proto: unknown;
  methods: MethodDescriptor[];
}

interface MethodDescriptor {
  proto: unknown;
  handlerName: string;
  methodName: string;
}

export class IpcRegistry {
  private static instance: IpcRegistry;

  private readonly handlerClasses: Record<string, ClassDescriptor> = {};

  private readonly hangingMethods: MethodDescriptor[] = [];

  private constructor() {
    // Nothing to do here yet
  }

  readonly registerMethod = <T>(handlerName: string, proto: T, methodName: string) => {
    this.hangingMethods.push({
      handlerName,
      proto,
      methodName
    });
  };

  readonly registerIpcHandlers = (ipc: Electron.IpcMain, instances: unknown[]) => {
    this.hangingMethods.forEach(method => {
      const instance = instances.find(i => Object.getPrototypeOf(i) === method.proto);

      if (instance instanceof Object && instance !== null) {
        const m = instance[method.methodName as keyof typeof instance];
        if (m instanceof Function) {
          ipc.handle(
            method.handlerName,
            m as (event: IpcMainInvokeEvent, ...args: unknown[]) => (Promise<unknown>) | (unknown)
          );
        }
      }
    });
  };

  static getInstance(): IpcRegistry {
    if (!IpcRegistry.instance) {
      IpcRegistry.instance = new IpcRegistry();
    }

    return IpcRegistry.instance;
  }
}
