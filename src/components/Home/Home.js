import React from "react";
import { useNavigate } from "react-router-dom"; // useHistory 훅 임포트
import { Container, Row, Col} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import homeLogo from "../../Assets/logo4.svg";
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
        <Col className="home-logo">
              <img
                src={homeLogo}
                alt="home pic"
                className="img-fluid"
              />
            </Col>
        <Container className="home-content">
          <Row>
            <Col md={9} className="home-header">
              <h1 style={{}} className="heading">
                Welcome to{" "}
                <strong className="main-name"> SIGNify</strong>
                <span className="wave" role="img" aria-labelledby="wave">
                   👋🏻
                </span>
              </h1>
{/* 
              <h1 className="heading-name">
                We're

              </h1> */}

              <div style={{ padding: 20, textAlign: "left" }}>
                <Type style={{marginLeft: '80px'}}/>
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="button-class">
            <Button
                className=""
                variant="primary"
                size="lg"
                style={{ width: '200px' , padding: '10px 30px', fontSize: '2rem', fontFamily: 'sans-serif', marginTop: '60px', marginLeft: '-280px', borderRadius: '50px'}} // 버튼 사이즈와 폰트 크기 조정
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
