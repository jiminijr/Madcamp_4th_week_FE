// Projects.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { useNavigate } from "react-router-dom";
import righthanded from "../../Assets/righthanded.svg";
import lefthanded from "../../Assets/lefthanded.svg";
import Typewriter from "typewriter-effect";

function Projects() {

  return (
<Container fluid className="project-section">
  <Particle />
  <Container>
    <div className="typewriter-text">
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
        <Col md={5} className="project-card">
          <ProjectCard
            imgPath={lefthanded}
            title="Left-handed"
            path="/left/levels" // path prop 전달
          />
        </Col>
        <Col md={5} className="project-card">
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