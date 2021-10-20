// import * as tf from '@tensorflow/tfjs';
// function nn_model() {
//   const model = tf.sequential();
//   model.add(
//     tf.layers.dense({
//       units: 32,
//       inputShape: [784],
//     }),
//   );
//   model.add(
//     tf.layers.dense({
//       units: 256,
//     }),
//   );
//   model.add(
//     tf.layers.dense({
//       units: 10,
//       kernelInitializer: 'varianceScaling',
//       activation: 'softmax',
//     }),
//   );
//   return model;
// }
// const model = nn_model();
// model.compile({
//   optimizer: tf.train.sgd(0.15),
//   loss: 'categoricalCrossentropy',
//   metrics: ['accuracy'],
// });
// async function train() {
//   const BATCH_SIZE = 16;
//   const TRAIN_BATCHES = 100;

//   const TEST_BATCH_SIZE = 100;
//   const TEST_ITERATION_FREQUENCY = 5;

//   for (let i = 0; i < TRAIN_BATCHES; i++) {
//     const batch = data.nextTrainBatch(BATCH_SIZE);

//     let testBatch;
//     let validationData;
//     // Every few batches test the accuracy of the mode.
//     if (i % TEST_ITERATION_FREQUENCY === 0 && i > 0) {
//       testBatch = data.nextTestBatch(TEST_BATCH_SIZE);
//       validationData = [
//         testBatch.xs.reshape([TEST_BATCH_SIZE, 784]),
//         testBatch.labels,
//       ];
//     }

//     // The entire dataset doesn't fit into memory so we call fit repeatedly
//     // with batches.
//     const history = await model.fit(
//       batch.xs.reshape([BATCH_SIZE, 784]),
//       batch.labels,
//       { batchSize: BATCH_SIZE, validationData, epochs: 1 },
//     );

//     batch.xs.dispose();
//     batch.labels.dispose();
//     if (testBatch != null) {
//       testBatch.xs.dispose();
//       testBatch.labels.dispose();
//     }
//     await tf.nextFrame();
//   }
// }
