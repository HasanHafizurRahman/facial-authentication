import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const Register = ({ registeredFaces, setRegisteredFaces }) => { // Receive props here
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

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

  const handleRegisterFace = async () => {
    setIsRegistering(true);
    const detections = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      // Store descriptors using the setRegisteredFaces function from props
      setRegisteredFaces((prevFaces) => [...prevFaces, detections.descriptor]);
      alert('Face registered successfully!');
    } else {
      alert('No face detected. Please try again.');
    }

    setIsRegistering(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <video ref={videoRef} autoPlay muted className="rounded shadow-lg"></video>
      <button
        onClick={handleRegisterFace}
        disabled={!modelsLoaded || isRegistering}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isRegistering ? 'Registering...' : 'Register Face'}
      </button>
    </div>
  );
};

export default Register;
