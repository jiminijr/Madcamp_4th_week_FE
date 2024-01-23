// AnimatedRoute.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function AnimatedRoute({ children }) {
  const [currentChildren, setCurrentChildren] = useState(children);
  const [nextChildren, setNextChildren] = useState(null);
  const [transitionStage, setTransitionStage] = useState("page-enter");
  const location = useLocation();

  useEffect(() => {
    if (location.key !== children.key) {
      setNextChildren(children);
      setTransitionStage("page-exit");
    }
  }, [location, children]);

  useEffect(() => {
    if (transitionStage === "page-exit") {
      const timeoutId = setTimeout(() => {
        setCurrentChildren(nextChildren);
        setNextChildren(null);
        setTransitionStage("page-enter");
      }, 300); // 애니메이션 지속 시간
      return () => clearTimeout(timeoutId);
    }
  }, [transitionStage, nextChildren]);

  return (
    <div className={`page-transition ${transitionStage}`}>
      {currentChildren}
    </div>
  );
}

export default AnimatedRoute;
