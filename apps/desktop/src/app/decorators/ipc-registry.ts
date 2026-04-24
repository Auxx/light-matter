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

  readonly registerMethod = <T>(name: string, proto: T, methodName: string) => {
    this.hangingMethods.push({
      handlerName: name,
      proto,
      methodName
    });
  };

  readonly registerIpcHandlers = (ipc: Electron.IpcMain, instances: unknown[]) => {
    this.hangingMethods.forEach(method => {
      const instance = instances.find(i => Object.getPrototypeOf(i) === method.proto);

      if (instance instanceof Object && instance !== null && instance[method.methodName] instanceof Function) {
        ipc.handle(method.handlerName, instance[method.methodName]);
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
