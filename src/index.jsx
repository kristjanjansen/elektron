import ReactDOM from "react-dom";
import React, {
  Suspense,
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { EffectComposer, Bloom } from "react-postprocessing";
import { Plane, OrbitControls, Text, Sphere } from "drei";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useThree, useResource } from "react-three-fiber";
import { useAudio } from "react-use";

import "./styles.css";
import { range, random, useFetch } from "./utils";
//import { GLTFLoader } from './loaders/GLTFLoader';

const Message = (props) => {
  const ref = useRef();
  return (
    <Text
      color="white"
      fontSize={1.75}
      maxWidth={100}
      lineHeight={1}
      letterSpacing={-0.01}
      textAlign={"left"}
      font="/font-medium.woff"
      anchorX="center"
      anchorY="middle"
      {...props}
    >
      {props.children}
    </Text>
  );
};

const Image = ({ src, width }) => {
  const texture = useLoader(THREE.TextureLoader, src);
  const ratio = texture.image.height / texture.image.width;
  return (
    <mesh>
      <planeGeometry attach="geometry" args={[width, width * ratio]} />
      <meshBasicMaterial
        attach="material"
        map={texture}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const Polygon = (props) => {
  const points = props.points || [];
  const color = props.color || "white";

  //const texture = useLoader(THREE.TextureLoader, "/hexacoralia.jpg");

  const vectorPoints = useMemo(
    () =>
      new THREE.Shape().setFromPoints(
        points.map((p) => new THREE.Vector2(p[0], p[1]))
      ),
    [points]
  );

  return (
    <>
      <mesh>
        <shapeGeometry attach="geometry" args={[vectorPoints]} />
        <meshBasicMaterial attach="material" color={color} />
      </mesh>
    </>
  );
};

const Line = (props) => {
  const [ref] = useResource();
  const points = props.points || [];
  const color = props.color || "white";

  const vectorPoints = useMemo(
    () => points.map((p) => new THREE.Vector3(...p)),
    []
  );

  const onUpdate = useCallback((self) => self.setFromPoints(vectorPoints), [
    vectorPoints,
  ]);
  return (
    <>
      <line ref={ref}>
        <bufferGeometry attach="geometry" onUpdate={onUpdate} />
        <lineBasicMaterial
          attach="material"
          color={color}
          linewidth={100}
          linecap={"round"}
          linejoin={"round"}
        />
      </line>
    </>
  );
};

const Grid = (props) => {
  const from = props.from || -5;
  const to = props.to || 5;
  const numbers = range(from, to);
  return (
    <>
      {numbers.map((n, i) => (
        <group key={i} {...props}>
          <Line
            points={[
              [n, from, 0],
              [n, to, 0],
            ]}
            color={props.color}
          />
          <Line
            points={[
              [from, n, 0],
              [to, n, 0],
            ]}
            color={props.color}
          />
        </group>
      ))}
    </>
  );
};

const Schedule = (props) => {
  const url =
    "https://www.googleapis.com/calendar/v3/calendars/mkr5k66b069hve1f7aa77m4bsc@group.calendar.google.com/events?key=AIzaSyAkeDHwQgc22TWxi4-2r9_5yMWVnLQNMXc";
  const { response } = useFetch(url);
  return (
    <div
      {...props}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: "50vw",
        border: "1px solid white",
        background: "rgba(20, 20, 20, 1)",
        margin: "10px",
        overflow: "auto",
        color: "white",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      {response
        ? response.items.map((item, i) => (
            <div
              style={{
                borderTop: i !== 0 ? "1px solid #aaa" : "",
                padding: "10px 0",
              }}
            >
              {item.summary}
            </div>
          ))
        : null}
    </div>
  );
};

const App = () => {
  const [showSchedule, setShowSchedule] = useState(false);
  const numbers = range(-5, 5);
  const mesh = useRef();
  const points = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];
  const points2 = [
    [0.1, 0, 0],
    [0.9, 0, 0],
    [0.9, 0.9, 0],
    [0.1, 0.9, 0],
    [0.1, 0.1, 0],
  ];
  const [audio, state, controls, ref] = useAudio({
    src:
      "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Blue_Dressed_Man/Voidland_EP/Blue_Dressed_Man_-_01_-_welcome.mp3",
    autoPlay: false,
  });
  useEffect(() => controls.volume(0.2), []);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas invalidateFrameloop camera={{ position: [0, 0, 10] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Grid
            from={-25}
            to={25}
            position={[0, 5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            color="gray"
          />
          <Grid
            from={-25}
            to={25}
            position={[0, -5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            color="gray"
          />
          <group
            rotation={[0, Math.PI / 4, 0]}
            onClick={() => setShowSchedule(!showSchedule)}
          >
            <Message position={[0, 0, -10]}>Schedule</Message>
          </group>
          <Message position={[0, 0, -10]}>Live</Message>
          <group rotation={[0, -Math.PI / 4, 0]}>
            <Message position={[0, 0, -10]}>Demo</Message>
          </group>
          <Sphere
            scale={[0.1, 0.1, 0.1]}
            position={[0, -5, 0]}
            color="yellow"
          />
          <Suspense fallback={null}>
            <Image src="/hexacoralia.jpg" />
          </Suspense>
          {/* <Suspense fallback={null}>
            <Polygon points={points} color="#333" />
          </Suspense> */}
          <Line points={points} color="white" />
          {/* <group position-z="0.01">
            <Polygon points={points2} color="black" />
          </group> */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.1}
              luminanceSmoothing={0.9}
              height={300}
            />
          </EffectComposer>
          <OrbitControls />
        </Canvas>
        {showSchedule && (
          <Schedule onClick={() => setShowSchedule(!showSchedule)} />
        )}
      </div>
      {audio}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

//https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Blue_Dressed_Man/Voidland_EP/Blue_Dressed_Man_-_01_-_welcome.mp3
