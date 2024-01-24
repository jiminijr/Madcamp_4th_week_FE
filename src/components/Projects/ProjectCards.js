// ProjectCards.js
import React, { useEffect } from "react";
import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ imgPath, title, path, description }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트가 마운트될 때 초기 애니메이션 적용
    const card = document.querySelector(".project-card-view");
    card.style.opacity = 1;
    card.style.transform = "translateY(0)";
  }, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 실행

  const handleCardClick = () => {
    navigate(path);
  };

  return (
    <Card className="project-card-view" onClick={handleCardClick} style={{ cursor: "pointer", opacity: 0, transform: 'translateY(0px)', transition: 'opacity 0.5s, transform 0.5s' }}>
      <Card.Img variant="top" src={imgPath} alt="card-img" />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text style={{ textAlign: "justify" }}>
          {description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ProjectCard;
