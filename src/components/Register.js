import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'react-toastify';

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
      toast.success('Face registered successfully!', { position: 'top-right' });
    } else {
      toast.error('No face detected. Please try again.', { position: 'top-right' });
    }

    setIsRegistering(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Register Your Face</h1>
      <video ref={videoRef} autoPlay muted className="rounded-lg shadow-lg mb-4 max-w-full"></video>
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
