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

// 立方体控制参数
const cubeParameters = {
  color: 0x00ff00,
  rotationRate: 0.02,
  y: 0,
  visible: true,
  wireframe: false,
};
// 创建一个 长 宽 高 分别是 1 的立方几何体。
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// 为这个几何体添加一些属性，材质，颜色，纹理贴图等，用来描述这个几何体的物理属性
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: cubeParameters.color,
});

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.rotation.x = 1;
cube.rotation.y = 1;
cube.rotation.z = 1;
cube.position.x = -3;
// 添加到场景中
scene.add(cube);

const cubeGui = gui.addFolder("Cube");
cubeGui.open();

cubeGui.addColor(cubeParameters, "color").onChange((e) => {
  cubeMaterial.color.set(e);
});
cubeGui.add(cubeParameters, "rotationRate", 0, 1, 0.01);

cubeGui.add(cubeParameters, "y", 0, 1, 0.01).onChange((e) => {
  cube.position.y = e;
});
cubeGui.add(cubeParameters, "visible").onChange((e) => {
  cube.visible = e;
});
cubeGui.add(cubeParameters, "wireframe").onChange((e) => {
  cubeMaterial.wireframe = e;
});

const sphereParameters = {
  color: 0xffff00,
  frequency: 1,
  visible: true,
  wireframe: false,
};

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: sphereParameters.color,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
const sphereGui = gui.addFolder("Sphere");

sphereGui.addColor(sphereParameters, "color").onChange((e) => {
  sphereMaterial.color.set(e);
});
sphereGui.add(sphereParameters, "frequency", 1, 10, 0.01);

sphereGui.add(sphereParameters, "visible").onChange((e) => {
  sphere.visible = e;
});
sphereGui.add(sphereParameters, "wireframe").onChange((e) => {
  sphereMaterial.wireframe = e;
});

const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  100
);
// 将相机的位置偏移
camera.position.set(-2,2,2)

scene.add(camera);
// 传入相机对象
const cameraHelper = new THREE.CameraHelper(camera)
// 添加到场景中
scene.add(cameraHelper)

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

/**
 * 添加辅助相机观察 cameraHelper
 */
const camera1 = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  100
);
camera1.position.z = 10
scene.add(camera1)

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

let step = 0;
// 定义渲染函数
const animation = () => {
  // 定义立方体每次渲染旋转角度
  cube.rotation.x += cubeParameters.rotationRate;
  cube.rotation.y += cubeParameters.rotationRate;
  cube.rotation.z += cubeParameters.rotationRate;

  step += 0.02;
  sphere.position.x = Math.cos(step * sphereParameters.frequency);
  sphere.position.y = Math.abs(Math.sin(step * sphereParameters.frequency));

  cameraHelper.update()
  controls.update();
  window.requestAnimationFrame(animation);
  renderer.render(scene, camera1);
};
animation();
