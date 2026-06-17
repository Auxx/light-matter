import { stat } from 'node:fs/promises';
import Vips from 'wasm-vips';

export class ThumbManager {
  readonly generate = async (source: string, target: string, width: number, height: number) => {
    try {
      await stat(target);
      return false;
    } catch (_) {
      // Nothing to do here, we just create a new thumbnail
    }

    try {
      const vips = await Vips();
      using img = vips.Image.newFromFile(source);

      using thumb = img.thumbnailImage(
        width,
        {
          height,
          size: 2,
          crop: 1
        }
      );

      thumb.writeToFile(target, { Q: 80 });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
}
