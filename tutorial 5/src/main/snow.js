import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import image from "../assets/images/9.png";
import snowImage1 from '../assets/images/scorch_02.png'
import snowImage2 from '../assets/images/scorch_03.png'
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

const textureLoader = new THREE.TextureLoader();

const createPoints = (snow = image, size = 1, count = 20000) => {
  const position = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    position[i] = (Math.random() - 0.5) * 100;
    colors[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const starTexture = textureLoader.load(snow);

  // Points
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size,
  });
  pointsMaterial.map = starTexture;
  pointsMaterial.alphaMap = starTexture;
  pointsMaterial.transparent = true;
  pointsMaterial.depthTest = false;
  pointsMaterial.blending = THREE.AdditiveBlending;

  const ponits = new THREE.Points(geometry, pointsMaterial);
  ponits.position.set(1.2, 0, 0);
  scene.add(ponits);
  return ponits;
};

const snow = createPoints(image, 1, 2000)
const snow1 = createPoints(snowImage1, 0.5)
const snow2 = createPoints(snowImage2, 0.8)

// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  30
);
// 将相机的位置偏移
camera.position.z = 40;

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

const clock = new THREE.Clock()

// 定义渲染函数
const animation = () => {
  const time = clock.getElapsedTime()
  snow1.rotation.x = time * 0.5
  snow2.rotation.x = time * 0.4
  snow2.rotation.y = time * 0.02
  controls.update();
  window.requestAnimationFrame(animation);
  renderer.render(scene, camera);
};
animation();
