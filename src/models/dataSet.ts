import LoadingModel from './loading';

class DataSet {
  private imageView: DataView;
  private labelView: DataView;
  readonly count: number;
  readonly width: number;
  readonly height: number;
  constructor(imageBuffer: ArrayBuffer, labelBuffer: ArrayBuffer) {
    this.imageView = new DataView(imageBuffer);
    this.labelView = new DataView(labelBuffer);
    this.count = this.imageView.getUint32(4);
    this.height = this.imageView.getUint32(8);
    this.width = this.imageView.getUint32(12);
  }

  getLabel(index: number) {
    return this.labelView.getUint8(8 + index);
  }

  getAllLabel() {
    const out = new Uint8Array(this.count * 10);
    for (let i = 0; i < this.count; i++) {
      for (let j = 0; j < 10; j++) {
        out[i * 10 + j] = this.labelView.getUint8(8 + i) === j ? 1 : 0;
      }
    }
    return out;
  }

  getImage(index: number) {
    return new Uint8Array(
      this.imageView.buffer,
      16 + index * this.width * this.height,
      this.width * this.height,
    );
  }

  getAllImage() {
    return new Uint8Array(this.imageView.buffer, 16);
  }
}

export default (tag: string) =>
  new LoadingModel<DataSet>(async () => {
    const imageBuffer = await fetchArrayBuffer(`${tag}-images.idx3-ubyte`);
    const labelBuffer = await fetchArrayBuffer(`${tag}-labels.idx1-ubyte`);
    return new DataSet(imageBuffer, labelBuffer);
  });

async function fetchArrayBuffer(url: string) {
  const response = await fetch(url);
  return await response.arrayBuffer();
}
