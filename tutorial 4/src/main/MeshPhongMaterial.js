import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const parameter = {
  color: "#049ef4",
  emissive: "#000000",
};

const phongParameter = {
  color: "#049ef4",
  specular: "#049ef4",
  shininess: 30,
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

const phongMaterial = new THREE.MeshPhongMaterial({
  color: phongParameter.color,
  shininess: phongParameter.shininess,
});

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-0.2, 0, 0);
const phongCube = new THREE.Mesh(cubeGeometry, phongMaterial);
phongCube.position.set(0.2, 0, 0);
scene.add(cube, phongCube);

const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(0.2, 0, 0.5);
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

const lambert = gui.addFolder("Lambert");
lambert.addColor(parameter, "color").onChange((e) => {
  cubeMaterial.color = new THREE.Color(e);
});

lambert.addColor(parameter, "emissive").onChange((e) => {
  cubeMaterial.emissive = new THREE.Color(e);
});

const phong = gui.addFolder("phong");
phong.open();
phong.addColor(phongParameter, "color").onChange((e) => {
  phongMaterial.color = new THREE.Color(e);
});

phong.addColor(phongParameter, "specular").onChange((e) => {
  phongMaterial.specular = new THREE.Color(e);
});

phong
  .add(phongParameter, "shininess")
  .min(10)
  .max(100)
  .step(1)
  .onChange((e) => {
    phongMaterial.shininess = e;
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
