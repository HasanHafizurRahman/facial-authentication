import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const Login = ({ registeredFaces }) => {
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

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

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
    }
  }, [modelsLoaded]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error('Error accessing webcam:', err));
  };

  const handleLoginFace = async () => {
    setIsAuthenticating(true);
    const detections = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor();

    if (detections) {
      // Check if there are any registered faces before creating the FaceMatcher
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <video ref={videoRef} autoPlay muted className="rounded shadow-lg"></video>
      <button
        onClick={handleLoginFace}
        disabled={!modelsLoaded || isAuthenticating}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {isAuthenticating ? 'Authenticating...' : 'Login with Face'}
      </button>
    </div>
  );
};

export default Login;
