import * as tf from '@tensorflow/tfjs';
import LoadingModel from '@/models/loading';

export default new LoadingModel(() => tf.ready());
