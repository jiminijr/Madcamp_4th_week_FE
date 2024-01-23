import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import leaf from "../../Assets/Projects/leaf.png";
import emotion from "../../Assets/Projects/emotion.png";
import editor from "../../Assets/Projects/codeEditor.png";
import chatify from "../../Assets/Projects/chatify.png";
import suicide from "../../Assets/Projects/suicide.png";
import right from "../../Assets/righthanded.svg";
import left from "../../Assets/lefthanded.svg";
function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          Are <strong className="purple">you?</strong>
        </h1>

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={right}
            
              title="Left-Handed"
            
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={left}
              title="Right-Handed"
            />
          </Col>

        
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
