import { IpcRegistry } from './ipc-registry';

export function IpcHandler(options: { name: string; }) {
  return (target: unknown, propertyKey: string /*, descriptor?: PropertyDescriptor*/) => {
    IpcRegistry.getInstance().registerMethod(options.name, target, propertyKey);
  };
}
