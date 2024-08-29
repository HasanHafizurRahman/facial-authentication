# Facial Authentication with Face-API.js

This project demonstrates how to implement a facial authentication system using `face-api.js` in a React application. Users can register by capturing their face, and later log in by presenting their face again. If the face matches the registered data, the user is logged in successfully; otherwise, an error message is displayed.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Face-API.js Model Loading](#face-apijs-model-loading)
- [Face Registration](#face-registration)
- [Face Login](#face-login)
- [Local Storage Persistence](#local-storage-persistence)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/facial-authentication-app.git
    cd facial-authentication-app
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Download `face-api.js` models:**

    Download the necessary models from the [face-api.js GitHub repository](https://github.com/justadudewhohacks/face-api.js/tree/master/weights). Place the downloaded models in the `public/models` directory of your React app.

## Setup

1. **Set up the basic React application:**

   Use `create-react-app` to set up a new React application, if you haven't already.

    ```bash
    npx create-react-app facial-authentication-app
    cd facial-authentication-app
    ```

2. **Install `face-api.js`:**

    ```bash
    npm install face-api.js
    ```

3. **Install React Router (if not already installed):**

    ```bash
    npm install react-router-dom
    ```

4. **Install Tailwind CSS (optional for styling):**

    ```bash
    npm install -D tailwindcss
    npx tailwindcss init
    ```

5. **Configure Tailwind CSS:**

   Add the following to your `tailwind.config.js`:

    ```javascript
    module.exports = {
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

## Project Structure

```
facial-authentication-app/
│
├── public/
│   └── models/                    # Face-API.js models
│       ├── face_landmark_68_model-weights_manifest.json
│       ├── face_landmark_68_model-shard1
│       ├── face_landmark_68_model-shard2
│       ├── face_recognition_model-weights_manifest.json
│       └── face_recognition_model-shard1
│
├── src/
│   ├── components/
│   │   ├── Register.js            # Component for face registration
│   │   └── Login.js               # Component for face login
│   ├── App.js                     # Main application file
│   └── index.js                   # Entry point
│
└── README.md                      # This file
```

## Face-API.js Model Loading

To use `face-api.js` for facial recognition, you need to load the required models into your application. This is done in both the `Register.js` and `Login.js` components.

### Model Loading Example

```javascript
import * as faceapi from 'face-api.js';

useEffect(() => {
  const loadModels = async () => {
    const MODEL_URL = '/models';
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    setModelsLoaded(true);
  };
  loadModels();
}, []);
```

## Face Registration

The `Register.js` component allows users to register their face by capturing a face descriptor from the webcam feed and storing it locally.

### Key Functions

- **`startVideo`**: Accesses the user's webcam and streams the video to a `<video>` element.
- **`handleRegisterFace`**: Captures a face descriptor from the video feed using `face-api.js` and stores it in local storage for persistence across page reloads.

### Example Code

```javascript
const handleRegisterFace = async () => {
  setIsRegistering(true);
  const detections = await faceapi
    .detectSingleFace(videoRef.current)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (detections) {
    const newRegisteredFaces = [...registeredFaces, detections.descriptor];
    setRegisteredFaces(newRegisteredFaces);
    localStorage.setItem('registeredFaces', JSON.stringify(newRegisteredFaces));
    alert('Face registered successfully!');
  } else {
    alert('No face detected. Please try again.');
  }

  setIsRegistering(false);
};
```

## Face Login

The `Login.js` component allows users to log in by matching their live video feed against stored face descriptors.

### Key Functions

- **`startVideo`**: Starts video feed from the user's webcam.
- **`handleLoginFace`**: Detects the user's face in the live feed and compares it with the stored face descriptors using `face-api.js`.

### Example Code

```javascript
const handleLoginFace = async () => {
  setIsAuthenticating(true);
  const detections = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor();

  if (detections) {
    if (registeredFaces.length > 0) {
      const faceMatcher = new faceapi.FaceMatcher(registeredFaces, 0.6);
      const match = faceMatcher.findBestMatch(detections.descriptor);
      if (match.label !== 'unknown') {
        alert('Logged in successfully!');
      } else {
        alert('Face not recognized. Please try again.');
      }
    } else {
      alert('No registered faces available. Please register first.');
    }
  } else {
    alert('No face detected. Please try again.');
  }

  setIsAuthenticating(false);
};
```

## Local Storage Persistence

To ensure that registered faces are remembered after a page reload, face descriptors are stored in local storage.

### How to Use Local Storage

- **Storing Data**: Use `localStorage.setItem('key', JSON.stringify(data))` to store data.
- **Retrieving Data**: Use `JSON.parse(localStorage.getItem('key'))` to retrieve data.

## Deployment

To deploy this application, you can use any static hosting service like Netlify, Vercel, or GitHub Pages. Ensure that the `/models` folder with the required models is included in your `public` directory and accessible in the deployed environment.

1. **Build the Application:**

    ```bash
    npm run build
    ```

2. **Deploy:** Follow the instructions for your chosen deployment service to upload the build directory.

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are welcome!

## License

This project is open-source and available under the [MIT License](LICENSE).

---

By following this guide, you can implement a facial authentication system in a React application using `face-api.js`. Feel free to modify and extend the project to suit your needs!

