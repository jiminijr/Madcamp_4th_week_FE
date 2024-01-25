// LeftLevels.js
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import LeftLevelsCards from "./LeftLevelsCards";
import Particle from "../Particle";
import { useNavigate } from "react-router-dom";
import one from "../../Assets/1.png";
import two from "../../Assets/2.webp";
import three from "../../Assets/3.webp";
import Typewriter from "typewriter-effect";

function LeftLevels(props) {
  let navigate = useNavigate();

  const handleGoBack = () => {
    console.log("Button clicked"); // 콘솔에 로그 출력

    // 페이지 이동
    navigate("/handed");
  };

  useEffect(() => {
    // 컴포넌트가 마운트되면 투명도를 1로, 이동한 위치를 0으로 애니메이션 적용
    document.querySelectorAll(".level-card").forEach(card => {
      card.style.opacity = 1;
      card.style.transform = "translateX(0)";
    });
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  return (
    <Container fluid className="project-section1">
      <Particle />
      <Container>
        {/* 뒤로가기 버튼 */}
        <button
          className='button_menu'
          style={{
            fontSize: '1.5em',
            margin: '10px',
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 2,
            borderRadius: '20%'
          }}
          onClick={handleGoBack}
        >
          ⬅
        </button>

        <div className="typewriter-text" style={{ fontSize: "1.4em" }}>
          <Typewriter
            options={{
              strings: ['Which <span style="color: purple;">level</span> do you want to play?'],
              autoStart: true,
              loop: false,
              delay: 75,
              deleteSpeed: Infinity
            }}
          />
        </div>
        <Row className="level-card" style={{ opacity: 0, transform: 'translatex(-700px)', transition: 'opacity 0.5s, transform 1s' }}>
          <LeftLevelsCards
            imgPath={one}
            title="Level 1"
            path='/left/level1'
          />
        </Row>
        <Row className="level-card" style={{ opacity: 0, transform: 'translatex(700px)', transition: 'opacity 0.5s, transform 1s' }}>
          <LeftLevelsCards
            imgPath={two}
            title="Level 2"
            path='/left/level2'
          />
        </Row >
        <Row className="level-card" style={{ opacity: 0, transform: 'translatex(-700px)', transition: 'opacity 0.5s, transform 1s' }}>
          <LeftLevelsCards
            imgPath={three}
            title="Level 3"
            path='/left/level3'
          />
        </Row>
      </Container>
    </Container>
  );
}

export default LeftLevels;
