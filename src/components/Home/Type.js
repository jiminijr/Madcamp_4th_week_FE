import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <div style={{ marginLeft: '80px' }}>
    <Typewriter
      options={{
        strings: [
          "Enhance Sign Language Skills",
          "with Intuitive Learning System",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
    </div>
  );
}

export default Type;
