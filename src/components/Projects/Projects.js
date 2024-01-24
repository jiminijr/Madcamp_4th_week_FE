 // Projects.js
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { useNavigate } from "react-router-dom";
import righthanded from "../../Assets/righthanded.svg";
import lefthanded from "../../Assets/lefthanded.svg";
import Typewriter from "typewriter-effect";

function Projects() {
  useEffect(() => {
    // 컴포넌트가 마운트되면 투명도를 1로, 이동한 위치를 0으로 애니메이션 적용
    document.querySelectorAll(".project-card").forEach(card => {
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    });
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  return (
<Container fluid className="project-section">
  <Particle />
  <Container>
    <div className="typewriter-text" style={{fontSize: "2em"}}>
      <Typewriter
        options={{
          strings: ['Are <span style="color: purple;">you</span>?'],
          autoStart: true,
          loop: false,
          delay: 75,
          deleteSpeed: Infinity

        }}
      />
    </div>



        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={5} className="project-card" style={{ opacity: 0, transform: 'translateY(500px)', transition: 'opacity 0.5s, transform 1s'}}>
            <ProjectCard
              imgPath={lefthanded}
              title="Left-handed"
              path="/left/levels" // path prop 전달
            />
          </Col>

          <Col md={5} className="project-card" style={{ opacity: 0, transform: 'translateY(-500px)', transition: 'opacity 0.5s, transform 1s' }}>
            <ProjectCard
              imgPath={righthanded}
              title="Right-handed"
              path="/right/levels" // path prop 전달
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;