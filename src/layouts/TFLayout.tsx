import { Spin } from 'antd';
import { observer } from 'mobx-react';
import { Component, ReactNode } from 'react';
import TFModel from '@/models/tf';

type Props = {
  children?: ReactNode;
};

@observer
export default class TFLayout extends Component<Props> {
  componentDidMount() {
    TFModel.load();
  }

  render() {
    const { children } = this.props;
    const { loaded } = TFModel;
    return <Spin spinning={!loaded}>{loaded ? children : null}</Spin>;
  }
}
