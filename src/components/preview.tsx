import { Tooltip } from 'antd';
import { Component } from 'react';

type Props = {
  width: number;
  height: number;
  image: Uint8Array;
  label: string;
};

export default class Preview extends Component<Props> {
  canvas: HTMLCanvasElement | null = null;

  onGetCanvasRef = (ref: HTMLCanvasElement | null) => {
    if (ref) {
      if (this.canvas !== ref) {
        const ctx = ref.getContext('2d')!;
        const data = new Uint8ClampedArray(this.props.image.byteLength * 4);
        for (let i = 0; i < this.props.image.byteLength; i++) {
          data[i * 4] = this.props.image[i];
          data[i * 4 + 1] = this.props.image[i];
          data[i * 4 + 2] = this.props.image[i];
          data[i * 4 + 3] = 255;
        }
        ctx.putImageData(
          new ImageData(data, this.props.width, this.props.height),
          0,
          0,
        );
      }
    }
    this.canvas = ref;
  };

  render() {
    return (
      <Tooltip overlay={this.props.label}>
        <canvas
          ref={this.onGetCanvasRef}
          width={this.props.width}
          height={this.props.height}
        />
      </Tooltip>
    );
  }
}
