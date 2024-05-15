---
title: 'On-the-Fly _Machine Learning_ in the Browser with TensorFlow.js'
date: '2024-05-15'
tags: ['frontend', 'machine-learning']
images: ['/articles/on-the-fly-machine-learning-in-the-browser-with-tensor-flow-js/hero.webp']
summary: 'TensorFlow.js is an incredibly powerful JavaScript library for training and deploying machine learning models in the browser and Node. js. Let’s explore this library by building a teachable machine!'
authors: ['dave-bitter']
theme: 'blue'
---

I first came across [the teachable machine](https://teachablemachine.withgoogle.com/) while researching TensorFlow.js. Quite frankly, the idea of this working seemed insane to me. Are you telling me I can run machine learning in the browser where I can train the model on the fly? You sure can! Luckily, Google provides [a Codelab where you build a simple version](https://codelabs.developers.google.com/tensorflowjs-transfer-learning-teachable-machine) yourself which I followed loosely.

## What is Tensorflow.js?

TensorFlow.js is a JavaScript library developed by Google that allows you to define, train, and run machine learning models entirely in the browser, using JavaScript and a high-level layers API. It is part of the TensorFlow ecosystem, which includes a range of tools for machine learning applications. The advantage of TensorFlow.js is that it allows machine learning models to be run in the browser (or in Node.js), making machine learning more accessible to JavaScript developers and allowing for real-time interaction with the user.

Some of the benefits are:

- **Privacy** - you can both train and classify data on the machine of the user instead of sending it over to a server
- **Speed** - you can directly classify data instead of having to send it over to a remote server
- **Sensor access** - you can have access to the sensors of the user’s device like their camera and microphone
- **Deploy** - you just have to deploy the web application and don’t have to mess with complex server-side setups for machine learning
- **Cost** - last but not least, you dramatically cut down costs by just hosting a (static) website and using the user’s machine for the machine learning part

## How does a teachable machine work?

A teachable machine basically takes an existing (or base) model and uses it on a similar but different domain. This is known as transfer learning. As humans, we do this all the time. We have a lifetime of experiences that we can use to recognize things we have never seen before. This example in the Codelab explains this best in my opinion. This is a willow tree:

![A picture of a willow tree](/articles/on-the-fly-machine-learning-in-the-browser-with-tensor-flow-js/willow-tree.webp)

There is a chance you might have never seen this type of tree before. Now that I showed you, find the willow tree in this image:

![A picture of a willo tree in a forest](/articles/on-the-fly-machine-learning-in-the-browser-with-tensor-flow-js/willow-tree-in-forest.webp)

You already have neurons in your brain that know how to identify objects that look like trees and long straight lines. You can use that knowledge to quickly classify the willow tree in this image as it is a tree, has long straight lines and you’ve learned that a willow tree looks like that.

### Using the MobileNet base model

We need a model that is trained at classifying objects that we can then use to teach new things. Luckily this base model exists. [MobileNet](https://keras.io/api/applications/mobilenet/) is a popular model that performs image recognition on 1000 different types of objects. It was trained on a huge dataset called [ImageNet](https://www.image-net.org/) which has millions of labeled images. This model learned to spot common features among 1000 objects during training. Many of these features, like lines, textures, and shapes, can help identify new objects it hasn't seen before.

## Let’s start building

For my demo, I bootstrapped a Next.js project and therefor the code examples might show React.js code. Naturally, this is just my preference for reactive web application and you can use any (or no) framework.

### Loading TensorFlow.js and MobileNet

First, I added TensorFlow.js through NPM with the `[@tensorflow/tfjs](https://www.npmjs.com/package/@tensorflow/tfjs)` package. I then created a small hook where I load MobileNet:

```jsx
export const useMobileNet = ({ tf, numberOfClasses }) => {
  const model = useRef < any > null
  const mobileNet = useRef < any > null
  const [readyToTrainAndPredict, setReadyToTrainAndPredict] = useState(false)

  useEffect(() => {
    if (!tf) {
      return
    }

    async function loadMobileNetFeatureModel() {
      // ...
    }
    loadMobileNetFeatureModel().then(() => {
      // ...
    })
  }, [tf])

  return {
    model: model.current,
    mobileNet: mobileNet.current,
    readyToTrainAndPredict,
  }
}
```

It receives two props. `tf` (TensorFlow.js) and `numberOfClasses` which is the number of different classes it should detect and categorise in. Let’s dive into the `loadMobileNetFeatureModel` function:

```jsx
async function loadMobileNetFeatureModel() {
  const URL =
    'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1'

  mobileNet.current = await tf.loadGraphModel(URL, {
    fromTFHub: true,
  })

  // Warm up the model by passing zeros through it once.
  tf.tidy(function () {
    mobileNet.current?.predict(tf.zeros([1, 224, 224, 3]))
  })
}
```

I load the model from TFHub which is why I need to let TensorFlow.js know through `fromTFHub: true`. To warm the model up, I pass zeros with a few specific values. `1` is the batch size, `244` is both the width and the height of the image and `3` is the number of color channels (reg, green and blue). Once the MobileNet feature model is loaded I define the model head:

```jsx
loadMobileNetFeatureModel().then(() => {
  model.current = tf.sequential()

  model.current.add(
    tf.layers.dense({
      inputShape: [1024],
      units: 128,
      activation: 'relu',
    })
  )

  model.current.add(
    tf.layers.dense({
      units: numberOfClasses,
      activation: 'softmax',
    })
  )

  model.current.summary()

  model.current.compile({
    optimizer: 'adam',
    loss: numberOfClasses === 2 ? 'binaryCrossentropy' : 'categoricalCrossentropy',
    metrics: ['accuracy'],
  })

  setReadyToTrainAndPredict(true)
})
```

Quite a few things are happening here. Let’s go over them. First, I'm setting up a model that learns patterns in data to make predictions. Then, I'm adding an input layer, which acts like a first step in understanding the data. I'm using 128 "neurons" to analyze the data, and I'm applying a function called ReLU to understand it better. Next, I'm creating the output layer where the model makes its predictions. It looks at the patterns it learned and makes guesses based on them. Here, I'm using a function called `softmax` to ensure it selects one option from all the possibilities. After that, I'm checking what the model looks like so far by generating a model summary. Finally, before the model starts learning, I'm setting up how it should learn. I'm instructing it to improve its guesses over time and defining how it can evaluate its performance, such as by checking its accuracy.

### Using the user’s webcam to gather training data

Next, I want to be able to gather images to use in the demo. I could just let the user upload images, but let’s make it easier and allow them to snap images with their webcam to use. Yet again, I create a small hook to give us access:

```jsx
export const useWebcam = () => {
  const videoRef = useRef < HTMLVideoElement > null
  const [videoPlaying, setVideoPlaying] = useState(false)

  const toggleWebcam = async () => {
    if (videoPlaying) {
      videoRef.current.srcObject?.getVideoTracks().forEach((track) => {
        track.stop()
      })
      setVideoPlaying(false)
      return
    }

    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      // getUsermedia parameters.
      const constraints = {
        video: true,
        width: 640,
        height: 480,
      }

      // Activate the webcam stream.
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        videoRef.current.srcObject = stream
        videoRef.current.addEventListener('loadeddata', function () {
          setVideoPlaying(true)
        })
      })
    } else {
      console.warn('getUserMedia() is not supported by your browser')
    }
  }

  useEffect(() => {
    navigator.permissions.query({ name: 'camera' }).then(function (permissionStatus) {
      if (permissionStatus.state === 'granted') {
        toggleWebcam()
      }
    })
  }, [])

  return {
    toggleWebcam,
    videoRef,
    videoPlaying,
  }
}
```

With this hook, I can toggle the webcam on and off and have access to the video reference so I place it on an HTML `video` element:

```jsx
const { toggleWebcam, videoPlaying, videoRef } = useWebcam()

// ...

;<video ref={videoRef} />
```

Next, for each class we add a button to the UI to capture data. Once the user clicks this button, I call the `gatherDataForClass` function:

```jsx
const [capturedImages, setCapturedImages] = useState({})

const [isTraining, setIsTraining] = useState(false)
const [trainingData, setTrainingData] = useState([])

const gatherDataForClass = (classNumber) => {
  let imageFeatures = tf?.tidy(function () {
    let videoFrameAsTensor = tf.browser.fromPixels(videoRef.current)
    let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [224, 224], true)
    let normalizedTensorFrame = resizedTensorFrame.div(255)
    return mobileNet.predict(normalizedTensorFrame.expandDims()).squeeze()
  })

  setTrainingData([...trainingData, { input: imageFeatures, output: classNumber }])

  const canvas = document.createElement('canvas')
  canvas.width = videoRef.current.videoWidth
  canvas.height = videoRef.current.videoHeight
  canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
  const capturedImage = canvas.toDataURL('image/png')
  setCapturedImages((prevImages) => {
    const classKey = `class_${classNumber + 1}`
    return {
      ...prevImages,
      [classKey]: [capturedImage, ...prevImages[classKey]],
    }
  })
}
```

Using `tf.browser.fromPixels()` I grab a picture from the webcam feed. Next, I resize the `videoFrameAsTensor` variable to be of the correct shape for the MobileNet model's input. Remember, in `loadMobileNetFeatureModel` we set this to 224 by 224. I store this training data for this class in an array for later use.

It might also be nice to show the user which images are being used in which class. I use canvas to create a data URL for the image so I can show it in the UI.

### Training the model on-the-fly

Once the user has captured data (images) for the classes, it’s time to train the model with this new data.

```jsx
const [progressBarValues, setProgressBarValues] = useState()
const shouldPredict = useRef(false)

function predictLoop() {
  // ...
}

const trainAndPredict = async () => {
  setIsTraining(true)
  shouldPredict.current = false

  const trainingDataInputs = trainingData.map((data) => data.input)
  const trainingDataOutputs = trainingData.map((data) => data.output)

  tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs)
  let outputsAsTensor = tf.tensor1d(trainingDataOutputs, 'int32')
  let oneHotOutputs = tf.oneHot(outputsAsTensor, 3)
  let inputsAsTensor = tf.stack(trainingDataInputs)

  await model.fit(inputsAsTensor, oneHotOutputs, {
    shuffle: true,
    batchSize: 5,
    epochs: 10,
  })

  outputsAsTensor.dispose()
  oneHotOutputs.dispose()
  inputsAsTensor.dispose()

  setIsTraining(false)
  shouldPredict.current = true
  predictLoop()
}
```

You can call the `trainAndPredict` function that will take the training data we stored before and pass it to the model. First we shuffle the training data to ensure that the order of the data does not cause any issues during training. Next I convert the outputs to tensors. I can then pass them to the `tf.oneHot()` function along with the max number of classes which in the case of my demo is 3. Next, I convert the input tensors to become regular 2D tensors using the `tf.stack()` function. I can now finally train the model head using the `model.fit()` function where I pass the tensors. Finally I can dispose of the created tensors as the model is trained and I don’t need them anymore.

Time to call the `predictLoop` function that will continuously grab a frame of the webcam, and predict in which class it falls:

```jsx
function predictLoop() {
  tf?.tidy(function () {
    if (!shouldPredict.current) {
      return
    }

    let videoFrameAsTensor = tf.browser.fromPixels(videoRef.current).div(255)
    let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [224, 224], true)

    let imageFeatures = mobileNet.predict(resizedTensorFrame.expandDims())
    let prediction = model.predict(imageFeatures).squeeze()
    let predictionArray = prediction.arraySync()

    setProgressBarValues(predictionArray)
  })

  window.requestAnimationFrame(predictLoop)
}
```

As this is is a recursive function using `window.requestAnimationFrame` we first check if we need to break out of the loop. Next we the current frame of the webcam similarly to how we previously grabbed images to gather data for the classes. Next we essentially call the `predict` method on the model to get a value for each class from 0 to 1 on how confident it is that the class matches. The results might look something like `[0.39075496792793274, 0.6091347932815552, 0.00011020545935025439]` indicating that this is most likely the second class with hints of the first class. Finally we take this values and store it so we can display progress bars under each class to visualise how certain it is that the current webcam frame is for that class.

## The final result

The above logic, combined with some extra application logic results in this demo:

<iframe width="100%" style={{aspectRatio: "16/9"}} src="https://www.youtube.com/embed/A6SdL_o4mXQ?si=GdQ9aqvKB59fW7EY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

As you can see, I take images for the three classes. One neutral, one with my phone in my hand and one with a coffee in my hand. Then when I click "Train & Predict" it trains in a fraction of a second. Finally, for each class, in real time you can see how confident it is that the class matches. Naturally, you can provide more diverse images so it gets better and better and classifying.

You can [try the demo out yourself here](https://tensorflow-transfer-learning.davebitter.com/) (probably best on desktop). The final code can be found [over at my GitHub](https://github.com/DaveBitter/tensorflow-transfer-learning).

### Some things I noticed

While building this demo, I noticed a few this. Firstly, this stuff is hard! I don’t have a machine learning background so many of the techniques and concepts I was not familiar with. While doing the Codelab I read things like _"Now it's time to define your model head, which is essentially a very minimal multi-layer perceptron."_ which didn’t fill me with much confidence that I was able to build this demo. Luckily, with the help of the codelab and TensorFlow.js’s documentation of there utilities to make this stuff easier for you, I was able to make something cool!

I also noticed how accessible this actually is for developers. Being able to run this in the browser on a relatively "low-powered" machine like my laptop (in machine learning terms) is just amazing. I’m able to share a link to this static websites and let people play around with this and train models which is amazing!

Finally, I noticed that this is a gateway into machine learning for me. It hits the right balance between having familiar concepts and being a bit out of my depth and wanting to learn about these techniques in this exciting field. Try one of these codelabs out. It might be a lot less daunting than you suspect.

## Cool demo, what are actual use cases?

As the demo and possibilities are so wide, it’s hard to see actual use cases at first. Just focussing on image recognition and transfer learning (which is a tiny part of what machine learning can offer) I can think of quite a few use cases:

- **Vehicle Damage Assessment in Insurance Apps -** Users can upload photos of damaged vehicles, and the app can classify the type and severity of damage, facilitating the claims process for insurance companies.
- **Vehicle Condition Assessment for Lease Returns -** Leaseholders can upload photos of leased vehicles for inspection before returning them. The app can classify the condition of the vehicle, helping to determine if any additional charges are warranted.
- **Property Identification for Mortgage Assessment -** Analyze uploaded photos of properties to classify them into residential, commercial, or mixed-use categories, assisting in property valuation and mortgage assessment.

You can kind of see where I’m going with this. Even scoped to this tiny part of what is possible with machine learning, it’s an incredibly useful tool we can offer to our users. in the end, it’s a tool that supplies us with data. We can then use that data to offer awesome capabilities and user experiences!
