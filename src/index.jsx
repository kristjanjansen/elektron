import React, { Suspense, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import { OrbitControls, Box } from "drei";
import { useAudio } from "react-use";
import { PCFSoftShadowMap } from "three";

import { SettingsProvider, useSettings } from "./settings";

import {
  Avatars,
  Effects,
  Grid,
  Image,
  Lights,
  Line,
  Message,
  MessageSmall,
  Music,
  Panels,
  Polygon,
  Schedule,
  Video,
} from "./components";

import {
  range,
  degToRad,
  pointsMidpoint,
  pointsAngle,
  pointsDistance,
  rectPoints,
  pointsTransforms,
  random,
} from "./utils";
import "./styles.css";

const App = () => {
  const [showSchedule, setShowSchedule] = useState(false);

  // const { first, second } = useSettings();

  return (
    <>
      <Music />
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas
          invalidateFrameloop={true}
          camera={{ position: [0, 2, 8], fov: 100 }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = PCFSoftShadowMap;
          }}
        >
          <Panels />
          <Message color="white" position={[-1, 1.5, 0]}>
            Live
          </Message>
          <Video position={[0, 1, 7]} scale={[2, 2, 2]} />
          <Avatars />
          <OrbitControls />
          <Lights />
          <Effects />
        </Canvas>
      </div>
    </>
  );
};

ReactDOM.render(
  <SettingsProvider>
    <App />
  </SettingsProvider>,
  document.getElementById("root")
);
