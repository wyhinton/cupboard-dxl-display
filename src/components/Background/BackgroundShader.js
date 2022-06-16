import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

import { randomIntFromInterval } from "../../utils";
import TestShader1 from "./TestShader1";

var randomisePosition = new THREE.Vector2(1, 2);

function rgb(r, g, b) {
  return new THREE.Vector3(r, g, b);
}

const segmentsResolution = 45;

const baseColors = {
  pink: rgb(182, 9, 76),
  brightPink: rgb(241, 3, 66),
  darkPurple: rgb(42, 8, 56),
  orange: rgb(244, 93, 31),
  darkgrey: rgb(50, 50, 50),
  lightgrey: rgb(150, 150, 150),
  red: rgb(204, 0, 0),
};

const uniforms = {
  u_bg: { type: "v3", value: baseColors.lightgrey },
  u_bgMain: { type: "v3", value: baseColors.lightgrey },
  u_color1: { type: "v3", value: baseColors.lightgrey },
  u_color2: { type: "v3", value: baseColors.lightgrey },
  u_time: { type: "f", value: 0 },
  u_randomisePosition: { type: "v2", value: randomisePosition },
};
const R = function (x, y, t) {
  return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t));
};

const G = function (x, y, t) {
  return Math.floor(
    192 +
      64 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)
  );
};

const B = function (x, y, t) {
  return Math.floor(
    192 +
      64 *
        Math.sin(
          5 * Math.sin(t / 9) +
            ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
        )
  );
};

const ShadedGeometry1 = ({ position }) => {
  const shaderMaterialRef = useRef();
  let t = 0;
  let j = 0;

  let x = randomIntFromInterval(0, 32);
  let y = randomIntFromInterval(0, 32);
  let vCheck = false;

  useFrame(({ clock }) => {
    shaderMaterialRef.current.uniforms.u_randomisePosition.value =
      new THREE.Vector2(j, j);
    shaderMaterialRef.current.uniforms.u_color1.value = new THREE.Vector3(
      R(x, y, t / 2),
      G(x, y, t / 2),
      B(x, y, t / 2)
    );

    shaderMaterialRef.current.uniforms.u_time.value = t;
    if (t % 0.1 === 0) {
      if (vCheck === false) {
        x -= 1;
        if (x <= 0) {
          vCheck = true;
        }
      } else {
        x += 1;
        if (x >= 32) {
          vCheck = false;
        }
      }
    }
    // Increase t by a certain value every frame
    j = j + 0.01;
    t = t + 0.01;
  });

  return (
    <mesh
      position={position}
      rotation={[
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(90),
      ]}
    >
      <planeGeometry
        attach="geometry"
        args={[
          400,
          window.innerWidth / 2,
          segmentsResolution,
          segmentsResolution,
        ]}
      />
      <shaderMaterial
        attach="material"
        vertexShader={TestShader1.vertexShader}
        fragmentShader={TestShader1.fragmentShader}
        uniforms={uniforms}
        ref={shaderMaterialRef}
      />
    </mesh>
  );
};

const BackgroundShader = () => {
  const cam = useRef();
  return (
    <Canvas gl={{ antialias: false, alpha: false }}>
      <PerspectiveCamera
        ref={cam}
        position={[0, 0, 0]}
        fov={75}
        aspect={window.innerWidth / window.innerHeight}
        near={0.1}
        far={1000}
      />
      <ShadedGeometry1 position={[0, 0, -100]} faceResolution={100} />
      <OrbitControls />
    </Canvas>
  );
};

export default BackgroundShader;
