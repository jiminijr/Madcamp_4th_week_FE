// src/components/Predict.js

import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const Predict = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        // 웹소켓 연결
        const socket = io('http://172.10.7.41:80', { withCredentials: true, transports: ['websocket'] });

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

    return (
        <div>
            <h1>Predict 페이지</h1>
            <video ref={videoRef} width="640" height="480" autoPlay></video>
        </div>
    );
};

export default Predict;
