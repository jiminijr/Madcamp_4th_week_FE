// Projects.js
import React from "react";
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



  return (
<Container fluid className="project-section1">
  <Particle />
  <Container>
    <div className="typewriter-text">
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
        <Row className="level-card">
          <LeftLevelsCards
            imgPath={one}
            title="Level 1"
            path='/left/levels'
          />
        </Row>
        <Row className="level-card">
          <LeftLevelsCards
            imgPath={two}
            title="Level 2"
            path='/left/levels'
          />
        </Row >
        <Row className="level-card">
          <LeftLevelsCards
            imgPath={three}
            title="Level 3"
            path='/left/levels'
          />
        </Row>
      </Container>
    </Container>
  );
}

export default LeftLevels;