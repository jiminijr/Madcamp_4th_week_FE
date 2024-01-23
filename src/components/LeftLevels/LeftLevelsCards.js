
import React from "react";
import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';

function LeftLevelsCards(props) {
  let navigate = useNavigate();

  const handleCardClick = () => {
    console.log(props.path)
    navigate(props.path);
  };

  return (
<Card className="level-card-view" onClick={handleCardClick} style={{ cursor: "pointer" }}>
  <div className="card-flex-container">
    <Card.Img variant="top" src={props.imgPath} alt="card-img" className="card-flex-item" />
    <Card.Body className="card-flex-item">
      <Card.Title>{props.title}</Card.Title>
    </Card.Body>
  </div>
</Card>

  );
}
export default LeftLevelsCards;
