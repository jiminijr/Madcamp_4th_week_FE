import React from "react";
import { useNavigate } from "react-router-dom"; // useHistory 훅 임포트
import { Container, Row, Col} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import homeLogo from "../../Assets/signify.svg";
import Particle from "../Particle";
import Type from "./Type";
import About from "../About/About";


function Home() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleStartClick = () => {

    console.log("Button clicked"); // 콘솔에 로그 출력
    navigate("/handed"); //
  };

  
  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row>
            <Col md={5} style={{ paddingBottom: 20 }}>
              <img
                src={homeLogo}
                alt="home pic"
                className="img-fluid"
                style={{ maxHeight: "500px" }}
              />
            </Col>
            <Col md={7} className="home-header">
              <h1 style={{ paddingBottom: 15 }} className="heading">
                Hi There!{" "}
                <span className="wave" role="img" aria-labelledby="wave">
                  👋🏻
                </span>
              </h1>

              <h1 className="heading-name">
                We're
                <strong className="main-name"> SIGNify</strong>
              </h1>

              <div style={{ padding: 50, textAlign: "left" }}>
                <Type />
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="button-class">
            <Button
                className=""
                variant="primary"
                size="lg"
                style={{ width: '400px' , padding: '10px 30px', fontSize: '4rem', fontFamily: 'sans-serif', marginLeft: '450px', borderRadius: '50px'}} // 버튼 사이즈와 폰트 크기 조정
                onClick={handleStartClick}>
                Let's go

              </Button>
              
            </Col>
          </Row>
        </Container>
      </Container>
    </section>
  );
}

export default Home;
