// RightLevels.js
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import RightLevelsCards from "./RightLevelsCards";
import Particle from "../Particle";
import { useNavigate } from "react-router-dom";
import one from "../../Assets/1.png";
import two from "../../Assets/2.webp";
import three from "../../Assets/3.webp";
import Typewriter from "typewriter-effect";
import { ImFontSize } from "react-icons/im";

function RightLevels(props) {
  let navigate = useNavigate();

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
    <div className="typewriter-text" style={{fontSize: "1.4em" }}>
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
          <RightLevelsCards
            imgPath={one}
            title="Level 1"
            path='/right/level1'
          />
        </Row>
        <Row className="level-card" style={{ opacity: 0, transform: 'translatex(700px)', transition: 'opacity 0.5s, transform 1s' }}>
          <RightLevelsCards
            imgPath={two}
            title="Level 2"
            path='/right/level2'
          />
        </Row >
        <Row className="level-card" style={{ opacity: 0, transform: 'translatex(-700px)', transition: 'opacity 0.5s, transform 1s' }}>
          <RightLevelsCards
            imgPath={three}
            title="Level 3"
            path='/right/level3'
          />
        </Row>
      </Container>
    </Container>
  );
}

export default RightLevels;