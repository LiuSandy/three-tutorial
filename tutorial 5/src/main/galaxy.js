import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import image from "../assets/images/9.png";
import * as dat from "dat.gui";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new dat.GUI();

// 获取画布元素
const canvas = document.querySelector("canvas.webgl");
// 创建渲染器对象，将画布对象传入渲染器
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearColor("#000000");
// 设置渲染器画布大小
renderer.setSize(size.width, size.height);
// 设置渲染器设备像素比
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();

const paramater = {
  count: 10000,
  size: 0.1,
  radius: 3,
  branch: 8,
  color: "#ff6030",
  endColor: "#1b3984",
  rotateScale: 0.6,
};
const textureLoader = new THREE.TextureLoader();
const centerColor = new THREE.Color(paramater.color);
const endColor = new THREE.Color(paramater.endColor);
const generaterGalaxy = () => {
  const starTexture = textureLoader.load(image);
  const position = new Float32Array(paramater.count * 3);
  const colors = new Float32Array(paramater.count * 3);

  for (let i = 0; i < paramater.count; i++) {
    const current = i * 3;
    const branchAngle =
      (i % paramater.branch) * ((2 * Math.PI) / paramater.branch);
    // 点距离圆心的位置
    const distance =
      Math.random() * paramater.radius * Math.pow(Math.random(), 3);
    // 设置随机值
    const randomX =
      (Math.pow((Math.random() - 0.5) * 2, 3) * (paramater.radius - distance)) /
      5;
    const randomY =
      (Math.pow((Math.random() - 0.5) * 2, 3) * (paramater.radius - distance)) /
      5;
    const randomZ =
      (Math.pow((Math.random() - 0.5) * 2, 3) * (paramater.radius - distance)) /
      5;

    // x y z
    position[current] =
      Math.cos(branchAngle + distance * paramater.rotateScale) * distance +
      randomX;
    position[current + 1] = randomY;
    position[current + 2] =
      Math.sin(branchAngle + distance * paramater.rotateScale) * distance +
      randomZ;

    const mixColor = centerColor.clone();
    mixColor.lerp(endColor, distance / paramater.radius);
    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const materail = new THREE.PointsMaterial({
    // color: "0xffffff",
    size: paramater.size,
    map: starTexture,
    sizeAttenuation: true,
    alphaMap: starTexture,
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });

  const points = new THREE.Points(geometry, materail);
  scene.add(points);
};

generaterGalaxy();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  30
);
// 将相机的位置偏移
camera.position.set(3, 3, 3);

scene.add(camera);

const controls = new OrbitControls(camera, canvas);

window.addEventListener("resize", () => {
  // Update size
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  // Update camera
  camera.aspect = size.width / size.height;
  // 在更新 camrea 的时候需要手动调用更新方法
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(size.width, size.height);
});

const clock = new THREE.Clock();

// 定义渲染函数
const animation = () => {
  const time = clock.getElapsedTime();

  controls.update();
  window.requestAnimationFrame(animation);
  renderer.render(scene, camera);
};
animation();
