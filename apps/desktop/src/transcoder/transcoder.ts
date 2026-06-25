import Vips from 'wasm-vips';

export class Transcoder {
  private vips: typeof Vips | null = null;

  constructor() {
    this.init().then();
  }

  readonly generate = async (source: string, target: string): Promise<boolean> => {
    if (this.vips === null) {
      console.error('VIPS instance missing.');
      return false;
    }

    try {
      {
        using img = this.vips.Image.newFromFile(source);
        img.jxlsave(target, { Q: 80 });
        return true;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  private readonly init = async () => this.vips = await Vips();
}
