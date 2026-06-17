import { stat } from 'node:fs/promises';
import Vips from 'wasm-vips';

export class ThumbManager {
  private vips: typeof Vips | null = null;

  constructor() {
    this.init().then();
  }

  readonly generate = async (source: string, target: string, width: number, height: number): Promise<boolean> => {
    if (this.vips === null) {
      console.error('VIPS instance missing.');
      return false;
    }

    try {
      await stat(target);
      return false;
    } catch (_) {
      // Nothing to do here, we just create a new thumbnail
    }

    try {
      {
        using img = this.vips.Image.newFromFile(source);

        using thumb = img.thumbnailImage(
          width,
          {
            height,
            size: 2,
            crop: 1
          }
        );

        thumb.writeToFile(target, { Q: 80 });
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  private readonly init = async () => this.vips = await Vips();
}
