/*
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;

async function loadModelAndEncoders() {
  try {
    console.log('TensorFlow ready...');
    await tf.ready();

    console.log('Reading model files...');
    const modelJson = await fs.readFile('./model.json', 'utf-8');
    const modelWeights = await fs.readFile('./group1-shard1of1.bin');

    console.log('Loading model...');
    
    const loadedModel = await tf.loadLayersModel(tf.io.fromMemory(modelJson, modelWeights));

    // 모델의 첫 레이어에 batchInputShape 정의
    if (loadedModel.layers.length > 0 && !loadedModel.layers[0].batchInputShape) {
      loadedModel.layers[0].batchInputShape = [null, 2]; // 입력 데이터의 특성 수에 맞게 설정 (성별, 연령대)
    }
    
    console.log('Loading label encoders...');
    const encoderJson = await fs.readFile('./label_encoders.json', 'utf-8');
    const labelEncoders = JSON.parse(encoderJson);

    console.log('Model and label encoders loaded successfully.');

    return { model: loadedModel, labelEncoders };
  } catch (error) {
    console.error("Error loading model or label encoders:", error);
    throw error;
  }
}

async function encodeUserInfo(gender, ageGroup, labelEncoders) {
  const genderIndex = labelEncoders.gender.indexOf(gender);
  const ageGroupIndex = labelEncoders.age_group.indexOf(ageGroup);

  return tf.tensor2d([[genderIndex, ageGroupIndex]], [1, 2]);
}

async function recommendBooks(model, labelEncoders, gender, ageGroup, topN = 10) {
  if (!model || !labelEncoders) {
    console.log('Model or label encoders not loaded.');
    return [];
  }

  const predictions = [];

  for (const isbn of labelEncoders.isbn) {
    const userInfo = await encodeUserInfo(gender, ageGroup, labelEncoders);
    const prediction = model.predict(userInfo);
    const predictedValue = (await prediction.data())[0];
    predictions.push([isbn, predictedValue]);
    userInfo.dispose();
    prediction.dispose();
  }

  const sortedPredictions = predictions.sort((a, b) => b[1] - a[1]).slice(0, topN);
  const recommendedIsbns = sortedPredictions.map(([isbn]) => isbn.replace("'", ""));
  return recommendedIsbns;
}

async function main() {
  try {
    const { model, labelEncoders } = await loadModelAndEncoders();
    const bookSuggestion = await recommendBooks(model, labelEncoders, '남성', '30대', 10);
    console.log('Book suggestions:', bookSuggestion);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();

const tf = require('@tensorflow/tfjs-node');

// 모델 로드
async function loadModel() {
    const model = await tf.loadLayersModel('file:///model.json');
    return model;
}

// 예측 수행
async function makePrediction(inputData) {
    const model = await loadModel();
    const inputTensor = tf.tensor2d(inputData, [1, 2]);  // 입력 데이터 형태에 맞게 조정
    const prediction = model.predict(inputTensor);
    return prediction.arraySync();
}

// 예제 입력 데이터
const inputData = [['남성', '30대']];

makePrediction(inputData).then(prediction => {
    console.log('Prediction:', prediction);
});*/

const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

// 모델 로드
async function loadModel() {
    
    const model = await tf.loadLayersModel('file://C:/Users/USER/projact/projectName/auth-backend/src/models/model.json');
    return model;
}

// 라벨 인코더 로드
function loadLabelEncoders() {
    const data = fs.readFileSync('label_encoders.json');
    return JSON.parse(data);
}

// 예측 수행
async function makePrediction(inputData) {
    const model = await loadModel();
    const encoders = loadLabelEncoders();

    // 성별과 연령대 인코딩
    const genderEncoder = encoders.gender;
    const ageGroupEncoder = encoders.age_group;

    const encodedGender = genderEncoder.indexOf(inputData.gender);
    const encodedAgeGroup = ageGroupEncoder.indexOf(inputData.ageGroup);

    const inputTensor = tf.tensor2d([[encodedGender, encodedAgeGroup]], [1, 2]);
    const prediction = model.predict(inputTensor);
    const predictionArray = await prediction.array();
    
    // ISBN 디코딩
    const isbnEncoder = encoders.isbn;
    const predictedIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
    const predictedISBN = isbnEncoder[predictedIndex];
    
    return predictedISBN;
}

// 예제 입력 데이터
const inputData = {
    gender: '남성',
    ageGroup: '30대'
};

makePrediction(inputData).then(predictedISBN => {
    console.log('Predicted ISBN:', predictedISBN);
}).catch(error => {
    console.error('Error making prediction:', error);
});