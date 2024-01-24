import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom"; // useHistory 훅 임포트
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results } from "@mediapipe/hands";
import { drawCanvas } from "../Utils/drawCanvas";


import AImage from "../../Assets/Letters/a.webp";
import BImage from "../../Assets/Letters/b.webp";
import CImage from "../../Assets/Letters/c.webp";
import DImage from "../../Assets/Letters/d.webp";
import EImage from "../../Assets/Letters/e.png";
import FImage from "../../Assets/Letters/f.webp";
import VImage from "../../Assets/Letters/v.webp";
import MImage from "../../Assets/Letters/m.webp";
import NImage from "../../Assets/Letters/n.webp";
import OImage from "../../Assets/Letters/o.webp";
import RImage from "../../Assets/Letters/r.webp";
import TImage from "../../Assets/Letters/t.webp";
import WImage from "../../Assets/Letters/w.webp";
import YImage from "../../Assets/Letters/y.webp";


const words = ['A', 'O', 'W', 'Y', 'V'];

const images = {
  A: AImage,
  B: BImage,
  C: CImage,
  D: DImage,
  E: EImage,
  F: FImage,
  V: VImage,
  M: MImage,
  N: NImage,
  O: OImage,
  R: RImage,
  T: TImage,
  W: WImage,
  Y: YImage,
};

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
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  

  const navigate = useNavigate(); 

  const handleGoBack = () => {
    console.log("Button clicked"); // 콘솔에 로그 출력

    // 카메라 리소스 정리
    if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null; // 참조 제거
    }
  
    // 비디오 스트림 정리
    if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null; // 참조 제거
    }

    // 페이지 이동
    navigate("/right/levels"); 
};

  // 모달 창 스타일 추가 및 어두운 오버레이 스타일
  const modalStyle = {
    width: '700px',
    height: '500px',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    background: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px', // 꼭짓점을 둥글게 만듦
    opacity: showModal ? 1 : 0,
    transition: 'opacity 0.5s',
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.5)', // 어두운 오버레이 색상
    zIndex: 1, // 모달 창보다 위에 위치
    borderRadius: 0, // 어두운 오버레이의 꼭짓점을 둥글게 하지 않기
  };

  // 모달 창 애니메이션 효과
  const modalTransition = {
    opacity: showModal ? 1 : 0,
    transition: 'opacity 0.5s',
  };

  // clipPath를 통한 애니메이션 효과는 클래스를 추가하여 적용
  const clipPathStyle = showModal ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)';

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
    return (correctCount / (totalCount)) * 100;
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
      
              // 여기서 Camera 객체를 생성하고 시작합니다.
              const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                //   console.log('Sending frame to MediaPipe');
                  await hands.send({ image: videoRef.current });
                },
                width: 640,
                height: 480
              });
              camera.start();

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
          console.log(currentLetter);
          if (data.alphabet) {
            // 정답 알파벳과 손동작에 해당하는 알파벳이 일치하는 경우
            if (String(data.alphabet) === currentLetter) {
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

  // 모달 창 띄우는 곳
  useEffect(() => {
    if (currentLetterIndex === 0) {
      setShowModal(true);

      // 모달 창 나타나는 애니메이션
      setTimeout(() => {
        setShowModal(true);
      }, 100);

      const modalTimeoutId = setTimeout(() => {
        setShowModal(false);
      }, 3000);

      return () => {
        clearTimeout(modalTimeoutId);
      };
    }
  }, [currentLetterIndex, currentWordIndex]);

  const flipImageLetters = ['A', 'W', 'Y', 'V'];

  const currentWord = words[currentWordIndex];
  const currentLetter = currentWord[currentLetterIndex];
  const shouldFlipImage = flipImageLetters.includes(currentLetter);


  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {/* 뒤로가기 버튼 */}
        <button className='button_menu' style={{ fontSize: '1.5em', margin: '10px', position: 'absolute', top: '10px', left: '10px', zIndex: 2  }} onClick={handleGoBack}>
          Back
        </button>

        {!allWordsDisplayed && currentWord && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                    src={images[currentLetter]}
                    className="img-fluid"
                    style={{
                        width: '800px',
                        height: 'auto',
                        transform: shouldFlipImage ? 'scaleX(-1)' : 'scaleX(1)', // 조건부 스타일 적용
                    }}
                />
            <div style={{ marginTop: '5px', textAlign: 'center' }}>
              {currentWord.split('').map((letter, index) => (
                <span key={index} style={{ fontSize: index === currentLetterIndex ? '5em' : '3em', color: index === currentLetterIndex ? 'purple' : 'black' }}>
                  {letter}
                </span>
              ))}
            </div>
          </div>
        )}
        <div>
          {allWordsDisplayed && (
            <p style={{ fontSize: '100px' }}>ACCURACY: {accuracy.toFixed(2)}%</p>
          )}
          {showButton && (
            <button className='button_menu' style={{ fontSize: '2em', margin: '10px' }} onClick={() => console.log('New Button Clicked')}>MENU</button>
          )}
          {!showButton && (
            <button className='button_menu' onClick={handleSkip} style={{ fontSize: '2em', margin: '10px' }}>Skip</button>
          )}
        </div>
      </div>
      {/* 모달 창 및 화면 영역 표시 코드 */}
      {showModal && (
        <div style={{ ...overlayStyle, ...modalTransition }}>
          <div style={{ ...modalStyle, clipPath: clipPathStyle }}>
            <p style={{ fontSize: '4em' }}>Next Word: {currentWord}</p>
          </div>
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          {/* 비디오 및 캔버스 표시 코드 */}
          <div className="video-container" style={{ position: 'relative' }}>
            <video ref={videoRef} style={{ display: 'none' }} autoPlay muted></video>
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level1;