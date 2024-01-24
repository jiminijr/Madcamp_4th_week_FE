import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import Webcam from "react-webcam";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results } from "@mediapipe/hands";
import { drawCanvas } from "../../components/Utils/drawCanvas";
import { useDeferredValue } from 'react';

const words = ['happy', 'love', 'good'];
let socket; // socket 객체를 전역 스코프에서 정의

const Level1 = () => {

//   let currentLetterIndex=0;
//   let currentWordIndex=0;
//   currentLetterIndex = currentLetterIndex+1;
//   currentWordIndex = currentWordIndex +1;
    
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [allWordsDisplayed, setAllWordsDisplayed] = useState(false);
  const [showButton, setShowButton] = useState(false); // 새로운 버튼 표시 여부 상태 추가
  const [showModal, setShowModal] = useState(false);
  const [showSmallScreen, setShowSmallScreen] = useState(false); // 작은 화면 표시 여부 상태 추가
  const [nextWord, setNextWord] = useState(''); // 다음 word를 담는 상태 추가
  const [serverAnswer, setServerAnswer] = useState('');
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null); // hands 객체를 useRef로 참조


  const onResults = useCallback((results) => {
    console.log(results, "called")
    if (!results.multiHandLandmarks) {
      console.log('No hands detected.');
      return;
    }

    const canvasElement = canvasRef.current;
    const videoElement = videoRef.current;
    if (!canvasElement || !videoElement) {
      console.log('Canvas or Video element not found.');
      return;
    }

    console.log('Hand landmarks:', results.multiHandLandmarks);
    const ctx = canvasElement.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    // 미디어 파이프 결과를 그리는 코드 추가
    drawCanvas(ctx, results.multiHandLandmarks);
    ctx.restore();
  }, []);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
  
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    handsRef.current = hands; 
  
    // 웹캠 스트림 및 미디어 파이프 설정
    if (webcamRef.current) {
      const videoElement = webcamRef.current.video;
      if (videoElement) {
        videoElement.onloadedmetadata = () => {
          // 미디어 파이프로 웹캠 프레임을 전달합니다.
          hands.send({ image: videoElement });
        };
      }
    }
  
    return () => {
      hands.close(); // Hands 객체 정리
    };
  }, []); // 이 useEffect는 한 번만 실행됨

  useEffect(() => {
    if (handsRef.current) {
        handsRef.current.onResults(onResults);
      }
    }, [onResults]);
  

  useEffect(() => {

    // 웹소켓 클라이언트 설정
    socketRef.current = io('http://172.10.5.163:80', { withCredentials: true, transports: ['websocket'] });

    // 서버로부터 정답 알파벳 수신
    socketRef.current.on('answer', (answer) => {
      setServerAnswer(answer);
    });

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();

          const captureImage = () => {
            if (videoRef.current) {
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
              context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
              const imageData = canvas.toDataURL('image/jpeg', 0.8);
              socketRef.current.emit('prediction', imageData);
            }
          };

          const intervalId = setInterval(captureImage, 1000);

          return () => clearInterval(intervalId);
        };
      } catch (error) {
        console.error('웹캠 액세스 오류:', error);
      }
    };

    startCamera();

    socketRef.current.on('prediction_result', (data) => {
      console.log(data);
      // 여기서 data를 활용하여 결과를 표시하거나 상태를 업데이트할 수 있습니다.
      console.log("received!");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [onResults]);


  

  //키보드 입력받은 값 처리하는 곳
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (inputValue.toLowerCase() === currentLetter.toLowerCase()) {
        setInputValue('');
        setCorrectCount((prevCount) => prevCount + 1);
        setTotalCount((prevCount) => prevCount + 1);

        if (currentLetterIndex === currentWord.length - 1) {
          setWordCount((prevIndex) => prevIndex + 1);
          if (currentWordIndex === words.length - 1) {
            setShowPopup(true);
            setAllWordsDisplayed(true);
            return;
          } else {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
            setCurrentLetterIndex(0);
          }
        } else {
          setCurrentLetterIndex((prevIndex) => prevIndex + 1);
        }
      } else {
        setTotalCount((prevCount) => prevCount + 1);
      }
    }
  };

  

  useEffect(() => {
    let timeoutId;

    const mainTimer = () => {
      if (currentLetterIndex === words[currentWordIndex].length - 1) {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setCurrentLetterIndex(0);
        setInputValue('');
        setWordCount((prevIndex) => prevIndex + 1);

        if (wordCount === words.length && currentWordIndex === words.length - 1 && allWordsDisplayed) {
          const newAccuracy = (correctCount / totalCount) * 100;
          setAccuracy(newAccuracy);
          setShowPopup(true);
          setShowButton(true);
          setAllWordsDisplayed(true);
          const inputTime = currentLetterIndex === 0 ? 15000 : 10000;

          setTimeout(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
          }, inputTime);
        }
      } else {
        setCurrentLetterIndex((prevIndex) => prevIndex + 1);
      }
      setTotalCount((prevCount) => prevCount + 1);
    };

    timeoutId = setTimeout(mainTimer, currentLetterIndex === 0 ? 15000 : 10000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentWordIndex, currentLetterIndex, allWordsDisplayed, correctCount, totalCount, showPopup]);

  // Modal 창 띄우는 곳
  useEffect(() => {
    if (currentLetterIndex === 0) {
      setShowModal(true);

      const modalTimeoutId = setTimeout(() => {
        setShowModal(false);
      }, 3000);

      return () => {
        clearTimeout(modalTimeoutId);
      };
    }
  }, [currentLetterIndex]);

  const currentWord = words[currentWordIndex];
  const currentLetter = currentWord[currentLetterIndex];

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
<div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    {!allWordsDisplayed && currentWord && (
      <div>
        {currentWord.split('').map((letter, index) => (
          <span key={index} style={{ fontSize: index === currentLetterIndex ? '3em' : '2em' }}>
            {letter}
          </span>
        ))}
      </div>
    )}

    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
      style={{ fontSize: '2em', width: '40px' }}
    />

    {showPopup && (
      <div>
        <p>정답률: {accuracy.toFixed(2)}%</p>
        {showButton && (
            <button className='button_menu' onClick={() => console.log('New Button Clicked')}> 처음으로 </button>
        )}
      </div>
    )}
  </div>

  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!allWordsDisplayed && showModal && (
          <div style={{ width: '700px', height: '500px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ fontSize: '4em' }}>Next Word: {currentWord}</p>
          </div>
        )}
  {/* <div>
        <canvas
          ref={canvasRef}
          width={640}
          height={1000}
        />
      </div> */}
 {/* 웹캠 및 캔버스 */}
 <div className="video-container" style={{ position: 'relative' }}>
        <video ref={videoRef} style={{ width: '100%', height: '100%' }} autoPlay></video>
        <canvas ref={canvasRef} width={640} height={480} style={{ position: 'absolute', top: '0', left: '0' }} />
      </div>

  </div>
</div>

  );};
  
  export default Level1;
