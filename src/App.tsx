import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

import "./App.css";
import textureParticles1 from "./textures/particles/1.png";

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// GUI
const gui = new GUI();

// シーン
const scene = new THREE.Scene();

// カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(1, 1, 2);
scene.add(camera);

// レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

/**
 * テクスチャ設定
 */

const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load(textureParticles1);

/**
 * パーティクルを作成する
 */

// ジオメトリ
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;

const positionArray = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

// 球を作成してみる
const cube = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshNormalMaterial()
);

scene.add(cube);

// マテリアル
const pointsMaterial = new THREE.PointsMaterial({
  size: 0.15,
  transparent: true, // テクスチャの透過を有効にする
  alphaMap: particlesTexture, // 透過有りでテクスチャを貼り付ける
  // alphaTest: 0.001, // 透過度
  // depthTest: false,
  depthWrite: false,
});

// メッシュ化
const particles = new THREE.Points(particlesGeometry, pointsMaterial);

scene.add(particles);

// マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// クロック
const clock = new THREE.Clock();

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function App() {
  const refDiv = useRef<HTMLDivElement>(null);

  const onBrowserResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    return;
  };

  useEffect(() => {
    window.addEventListener("resize", onBrowserResize);

    refDiv.current?.appendChild(renderer.domElement);

    const updateRender = () => {
      const elapsedTime = clock.getElapsedTime();

      controls.update();

      // レンダリング
      renderer.render(scene, camera);
      requestAnimationFrame(updateRender);
    };

    updateRender();

    return () => {
      refDiv.current?.removeChild(renderer.domElement);
      removeEventListener("mousemove", onBrowserResize);
    };
  }, []);

  return (
    <div className="App">
      <div className="scene" ref={refDiv}></div>
    </div>
  );
}

export default App;
