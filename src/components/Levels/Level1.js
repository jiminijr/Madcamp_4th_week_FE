import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import Webcam from "react-webcam";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results } from "@mediapipe/hands";
import { drawCanvas } from "../../components/Utils/drawCanvas";

const words = ['happy', 'love', 'good'];

const Level1 = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
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

  // 새로운 모달 창 관리
  const [isModalOpened, setIsModalOpened] = useState(false);

  // skip버튼을 눌렀을 때 동작
  const handleSkip = () => {
    // 모든 단어가 끝났을 경우
    if ((currentWordIndex === words.length - 1) && (currentLetterIndex === words[currentWordIndex].length - 1)) {
      setTotalCount((prevIndex) => prevIndex + 1);
      setShowPopup(true);
      setAllWordsDisplayed(true);
      setShowButton(true); // 단어의 마지막 철자일 때 버튼 표시
      setAccuracy(calculateAccuracy());
      return;
    }
    // 단어 하나가 끝났을 경우
    if (currentLetterIndex === words[currentWordIndex].length - 1) {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      setCurrentLetterIndex(0);
      setTotalCount((prevIndex) => prevIndex + 1);
    }
    // 단어 중간인 경우
    else {
      setCurrentLetterIndex((prevIndex) => prevIndex + 1);
      setTotalCount((prevIndex) => prevIndex + 1);
    }
    setShowButton(false); // 단어의 마지막 철자가 아닐 때 버튼 숨김
  };

  // 정답률 계산 함수
  const calculateAccuracy = () => {
    if (totalCount === 0) {
      return 0;
    }
    console.log(correctCount);
    console.log(totalCount);
    return (correctCount / (totalCount+1)) * 100;
  };

  const onResults = (results) => {
    // MediaPipe 결과를 캔버스에 그리는 로직
    const canvasElement = canvasRef.current;
    const videoElement = videoRef.current;
    
    if (canvasElement && videoElement) {
      const ctx = canvasElement.getContext('2d');
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      drawCanvas(ctx, results);
    }
  };

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
    
      hands.onResults(onResults);
    
      const socket = io('http://172.10.5.163:80', { withCredentials: true, transports: ['websocket'] });

      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
  
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
  
            // 이미지 캡쳐 후 웹소켓을 통해 서버로 이미지 전송
            const captureImage = () => {
              if (videoRef.current) {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                socket.emit('prediction', imageData);
              }
            };
            // 서버로 전송하는 시간 간격 설정
            const intervalId = setInterval(captureImage, 1000);
  
            return () => clearInterval(intervalId);
          };
        } catch (error) {
          console.error('웹캠 액세스 오류:', error);
        }
      };
  
      startCamera();

      // 서버로부터 데이터를 수신했을 경우
      socket.on('prediction_result', (data) => {
          console.log(data);
          if (data.alphabet) {
            // 정답 알파벳과 손동작에 해당하는 알파벳이 일치하는 경우
            if (String(data.alphabet).toLowerCase() === currentLetter.toLowerCase()) {
              console.log("correct!");
              setInputValue('');
              setCorrectCount((prevCount) => prevCount + 1);
              setTotalCount((prevCount) => prevCount + 1);

              // 단어 하나가 끝났을 경우
              if (currentLetterIndex === currentWord.length - 1) {
                setWordCount((prevIndex) => prevIndex + 1);
                // 전체 단어가 끝났을 경우
                if (currentWordIndex === words.length - 1) {
                  setShowPopup(true);
                  setAllWordsDisplayed(true);
                  setAccuracy(calculateAccuracy());
                  setShowButton(true);
                  return;
                } else {
                  setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
                  setCurrentLetterIndex(0);
                }
              }
              // 단어 중간일 경우
              else {
                setCurrentLetterIndex((prevIndex) => prevIndex + 1);
              }
            }
          }
      });

      return () => {
          socket.disconnect();
      };
  }, [currentLetterIndex, currentWordIndex]);

  useEffect(() => {
    // 웹소켓 클라이언트 설정
    socketRef.current = io('http://172.10.5.163:80', { withCredentials: true, transports: ['websocket'] });

    // 서버로부터 정답 알파벳 수신
    // 이거 없애도 될 듯
    socketRef.current.on('answer', (answer) => {
      setServerAnswer(answer);
      
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);


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
  }, [currentLetterIndex, currentWordIndex]);



  const currentWord = words[currentWordIndex];
  const currentLetter = currentWord[currentLetterIndex];

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
<div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    {!allWordsDisplayed && currentWord && (
      <div>
        {currentWord.split('').map((letter, index) => (
          <span key={index} style={{ fontSize: index === currentLetterIndex ? '3em' : '2em', color: index === currentLetterIndex ? 'purple' : 'black' }}>
            {letter}
          </span>
        ))}
      </div>
    )}
        <div>
          {allWordsDisplayed && (
            <p>정답률: {accuracy.toFixed(2)}%</p>
          )}
          {showButton && (
            <button className='button_menu' onClick={() => console.log('New Button Clicked')}>처음으로</button>
          )}
          {!showButton && (
            <button className='button_menu' onClick={handleSkip} style={{ fontSize: '1em', margin: '10px' }}>Skip</button>
          )}
        </div>
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
    <div>
      <div className="video-container">
        <video ref={videoRef} width="50vw" height="100vh" autoPlay></video>
      </div>
    </div>
  </div>
</div>

  );};
  
  export default Level1;
