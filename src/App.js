import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer";
import Resume from "./components/Resume/ResumeNew";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RightLevels from "./components/RightLevels/RightLevels";
import LeftLevels from "./components/LeftLevels/LeftLevels";
import Level1 from "./components/Levels/Level1";
import Level2 from "./components/Levels/Level2";
import Level3 from "./components/Levels/Level3";
import Level1Left from "./components/Levels/Level1Left";
import Level2Left from "./components/Levels/Level2Left";
import Level3Left from "./components/Levels/Level3Left";

function App() {
  const [load, updateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateLoad(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader load={load} />
      <div className="App">
        <PageTransitions />
      </div>
    </Router>
  );
}

function PageTransitions() {
  let location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={1000}
        classNames="fade"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/handed" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/left/levels" element={<LeftLevels/>} />
          <Route path="/right/levels" element={<RightLevels/>} />
          <Route path="/right/level1" element={<Level1/>} />
          <Route path="/right/level2" element={<Level2/>} />
          <Route path="/right/level3" element={<Level3/>} />
          <Route path="/left/level1" element={<Level1Left/>} />
          <Route path="/left/level2" element={<Level2Left/>} />
          <Route path="/left/level3" element={<Level3Left/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default App;
