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
  const [accuracy, setAccuracy] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [allWordsDisplayed, setAllWordsDisplayed] = useState(false);
  const [showButton, setShowButton] = useState(false); // 새로운 버튼 표시 여부 상태 추가
  const [showSmallScreen, setShowSmallScreen] = useState(false); // 작은 화면 표시 여부 상태 추가
  const [nextWord, setNextWord] = useState(''); // 다음 word를 담는 상태 추가
  const [serverAnswer, setServerAnswer] = useState('');
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

//   const styles = {
//     container: css`
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       width: 100vw;
//       height: 100vh;
//     `,
//     webcamContainer: css`
//       flex: 1;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//     `,
//     canvasContainer: css`
//       flex: 1;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//     `,
//     .canvas: css`
//       background-color: #fff;
//     `}


const onResults = (results) => {
    const canvasElement = canvasRef.current;
    const videoElement = videoRef.current;
    
    if (canvasElement && videoElement) {
      const ctx = canvasElement.getContext('2d');
      ctx.save();
      
      // Clear previous frame
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      // Draw the webcam feed
      ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

      // Draw the hands annotations from MediaPipe
      drawCanvas(ctx, results);

      ctx.restore();
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

    // Use the existing video element for MediaPipe processing
    if (videoRef.current) {
      hands.send({ image: videoRef.current }).catch(console.error);
    }
  }, []);


  useEffect(() => {
      // 웹소켓 연결
      const socket = io('http://localhost:9999', { withCredentials: true, transports: ['websocket'] });

      const startCamera = async () => {
          try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
              videoRef.current.srcObject = stream;

              videoRef.current.onloadedmetadata = () => {
                  // 비디오 메타데이터가 로드된 후에 실행되는 콜백
                  // 여기에서 비디오 크기와 관련된 작업을 수행할 수 있습니다.

                  const captureImage = () => {
                      if (videoRef.current) {
                          const canvas = document.createElement('canvas');
                          const context = canvas.getContext('2d');
                          canvas.width = videoRef.current.videoWidth;
                          canvas.height = videoRef.current.videoHeight;
                          context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
                          const imageData = canvas.toDataURL('image/jpeg', 0.8);
                          socket.emit('prediction', imageData);
                      }
                  };

                  const intervalId = setInterval(captureImage, 500);

                  // 컴포넌트가 언마운트 될 때 setInterval을 클리어하는 정리 함수
                  return () => clearInterval(intervalId);
              }
          } catch (error) {
              console.error('웹캠 액세스 오류:', error);
          }
      };

      startCamera();

      socket.on('prediction_result', (data) => {
          console.log(data);
          // 여기서 data를 활용하여 결과를 표시하거나 상태를 업데이트할 수 있습니다.
      });

      return () => {
          socket.disconnect();
      };
  }, []);

  useEffect(() => {
    // 웹소켓 클라이언트 설정
    socketRef.current = io('http://localhost:9999', { withCredentials: true, transports: ['websocket'] });

    // 서버로부터 정답 알파벳 수신
    socketRef.current.on('answer', (answer) => {
      setServerAnswer(answer);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // 사용자 입력과 서버 응답 비교
      if (inputValue.toLowerCase() === serverAnswer.toLowerCase()) {
        setCorrectCount((prevCount) => prevCount + 1);
        if (correctCount + 1 >= 5) {
          console.log('정답!');
        }
      } else {
        console.log('오답');
      }
      setInputValue('');
      setTotalCount((prevCount) => prevCount + 1);
    }
  };

  useEffect(() => {
    let timeoutId; // 타이머 식별자를 저장할 변수
  
    const showSmallScreenTimer = () => {
      setShowSmallScreen(true);
      setNextWord(words[(currentWordIndex + 1) % words.length]); // 다음 word 설정
  
      // 입력 받는 시간 설정
      const inputTime = currentWordIndex === 0 ? 10000 : 5000;
  
      timeoutId = setTimeout(() => {
        setShowSmallScreen(false);
        setNextWord(''); // 다음 word 초기화
  
        inputRef.current.focus();
      }, inputTime);
    };

    const mainTimer = () => {
      if (currentLetterIndex === words[currentWordIndex].length - 1) {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setCurrentLetterIndex(0);
        setInputValue('');
        setIncorrectCount(0);
  
        if (currentWordIndex === words.length - 1 && allWordsDisplayed) {
          // 수정: 정답률 계산을 현재까지의 맞춘 철자 수로 변경
          // const newAccuracy = (correctCount / totalCount) * 100;
          // setAccuracy(newAccuracy);
          console.log("useeffect 최종 갯수 :", correctCount);
          console.log("useeffect 총 count 갯수 :", totalCount);
          setShowPopup(true);
          // 새로운 버튼 표시
          setShowButton(true);
          // 수정: 모든 단어를 표시했음을 초기화
          setAllWordsDisplayed(true);

          setTimeout(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
          }, 5000);
        }
      } else {
        setCurrentLetterIndex((prevIndex) => prevIndex + 1);
      }
      setTotalCount((prevCount) => prevCount + 1);
      // 작은 화면 타이머 재시작
      showSmallScreenTimer();
    };

    timeoutId = setTimeout(mainTimer, 3000); // 초기 실행

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentWordIndex, currentLetterIndex, allWordsDisplayed, correctCount, totalCount, showPopup]);

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
          <div>
            <button className='button_menu' onClick={() => console.log('New Button Clicked')}> 메뉴 </button>
            <button>다음 레벨 </button>
          </div>
        )}
      </div>
    )}
  </div>

  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <div>
        <canvas
          ref={canvasRef}
          width={640}
          height={720}
        />
      </div>
    <div>
      <h1>Predict 페이지</h1>
  <video ref={videoRef} width="640" height="480" autoPlay></video>

    </div>
  </div>
</div>

  );};
  
  export default Level1;
