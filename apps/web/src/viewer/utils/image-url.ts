import { appProtocol } from 'internal-api';

export function imageUrl(selectedFile: string): string {
  return `${appProtocol}://${encodeURIComponent(selectedFile)}`;
}
