import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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

// 创建一个 长 宽 高 分别是 1 的立方几何体。
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// 为这个几何体添加一些属性，材质，颜色，纹理贴图等，用来描述这个几何体的物理属性
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
});

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.rotation.x = 1;
cube.rotation.y = 1;
cube.rotation.z = 1;
// 添加到场景中
scene.add(cube);

const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  100
);
// 将相机的位置偏移
camera.position.z = 6;

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

// 定义渲染函数
const animation = () => {
  controls.update();
  window.requestAnimationFrame(animation);
  renderer.render(scene, camera);
};
animation();
