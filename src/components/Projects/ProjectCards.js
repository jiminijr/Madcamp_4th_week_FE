// ProjectCards.js
import React from "react";
import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';

function ProjectCards(props) {
  let navigate = useNavigate();

  const handleCardClick = () => {
    navigate(props.path);
  };

  return (
    <Card className="project-card-view" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <Card.Img variant="top" src={props.imgPath} alt="card-img" />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text style={{ textAlign: "justify" }}>
          {props.description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
export default ProjectCards;
