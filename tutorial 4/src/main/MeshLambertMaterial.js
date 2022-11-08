import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const parameter = {
  color: "#FF69B4",
  emissive: "#000000",
  light: true,
  lightColor: "#ffffff",
};

const gui = new dat.GUI();

// 获取画布元素
const canvas = document.querySelector("canvas.webgl");
// 创建渲染器对象，将画布对象传入渲染器
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearColor(new THREE.Color(0xffffff));
// 设置渲染器画布大小
renderer.setSize(size.width, size.height);
// 设置渲染器设备像素比
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();

const cubeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: parameter.color,
  emissive: parameter.emissive,
});

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

const light = new THREE.DirectionalLight(parameter.lightColor);
light.position.set(10, 10, 10);
light.visible = parameter.light;
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  100
);
// 将相机的位置偏移
camera.position.z = 1;
camera.lookAt(new THREE.Vector3(0, 0, 0));

scene.add(camera);

gui.addColor(parameter, "color").onChange((e) => {
  cubeMaterial.color = new THREE.Color(e);
});

gui.addColor(parameter, "emissive").onChange((e) => {
  cubeMaterial.emissive = new THREE.Color(e);
});

gui.addColor(parameter, "lightColor").onChange((e) => {
  light.color = new THREE.Color(e);
});

gui.add(parameter, "light").onChange(e=>{
  light.visible = e
});

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
