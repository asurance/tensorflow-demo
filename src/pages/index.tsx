import { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import { observer } from 'mobx-react';
import LoadingModel from '@/models/loading';
import TFModel from '@/models/tf';
import { Button, Col, Row, Spin } from 'antd';

import './index.less';

const model = new LoadingModel(() => tf.loadLayersModel('mnist-model.json'));

type PredictResult = number[];
type Preview = {
  data: Uint8Array;
  label: string;
};

type State = {
  result: PredictResult | null;
  previews: Preview[];
};
@observer
export default class IndexPage extends Component<unknown, State> {
  ctx: CanvasRenderingContext2D | null = null;
  lastX = 0;
  lastY = 0;

  constructor(props: Readonly<unknown>) {
    super(props);
    this.state = {
      result: null,
      previews: [],
    };
  }

  componentDidMount() {
    model.load();
    TFModel.load();
  }

  onMouseDown = (evt: MouseEvent) => {
    this.ctx?.beginPath();
    this.ctx?.moveTo(evt.offsetX, evt.offsetY);
    this.ctx?.canvas.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  };

  onMouseMove = (evt: MouseEvent) => {
    if (this.ctx) {
      this.ctx.lineTo(evt.offsetX, evt.offsetY);
      this.ctx.stroke();
      // this.ctx.beginPath();
      // this.ctx.arc(evt.offsetX, evt.offsetY, 10, 0, Math.PI * 2);
      // this.ctx.closePath();
      // this.ctx.fill();
    }
  };

  onMouseUp = () => {
    this.ctx?.closePath();
    this.ctx?.canvas.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  onGetCanvasRef = (canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      this.ctx = canvas.getContext('2d')!;
      canvas.addEventListener('mousedown', this.onMouseDown);
      this.onReset();
    } else {
      this.onMouseUp();
      this.ctx?.canvas.removeEventListener('mousedown', this.onMouseDown);
    }
  };

  onReset = () => {
    if (this.ctx) {
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 25;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    }
    this.setState({ result: null });
  };

  onPredict = async () => {
    if (this.ctx) {
      const canvas = document.createElement('canvas');
      canvas.width = 28;
      canvas.height = 28;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(this.ctx.canvas, 0, 0, 28, 28);
      const imageData = ctx.getImageData(0, 0, 28, 28);
      const input: number[] = [];
      for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
          input.push(imageData.data[(i * 28 + j) * 4]);
        }
      }
      const result = model.loadResult!.predict(
        tf.tensor4d(input, [1, 28, 28, 1]),
      ) as tf.Tensor2D;
      const data = await result.array();
      this.setState({ result: data[0] });
    }
  };

  render(): JSX.Element {
    const loaded = model.loaded && TFModel.loaded;
    const { result } = this.state;
    return (
      <div className="index">
        <Spin spinning={!loaded}>
          {loaded && (
            <Row justify="center" align="middle">
              <Col className="center" span={12}>
                <canvas
                  style={{ cursor: 'url(paint-brush.svg) 8 8, auto' }}
                  width="512"
                  height="512"
                  ref={this.onGetCanvasRef}
                />
              </Col>
              <Col className="center predict" span={12}>
                {result &&
                  result.map((val, index) => (
                    <span key={index}>{`${index}:${Math.trunc(
                      val * 100,
                    )}%`}</span>
                  ))}
              </Col>
              <Col className="footer" span={24}>
                <Button onClick={this.onReset}>重置</Button>
                <Button type="primary" onClick={this.onPredict}>
                  预测
                </Button>
              </Col>
            </Row>
          )}
        </Spin>
      </div>
    );
  }
}
