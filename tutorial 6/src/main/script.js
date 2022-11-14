import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new dat.GUI();
let preClickCube = null;
let preMaterial = null;

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

// 随机创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);

const clickObj = [];
for (let i = 0; i < 2000; i++) {
  const cube = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
  );

  // Random position
  cube.position.set(
    Math.random() * 50 - 25,
    Math.random() * 50 - 25,
    Math.random() * 50 - 25
  );

  // Random rotation
  cube.rotation.set(
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI
  );

  // Random Scale
  cube.scale.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);

  clickObj.push(cube);
  scene.add(cube);
}

const mouse = new THREE.Vector2();

const raycaster = new THREE.Raycaster();

window.addEventListener("click", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickObj);
  const clickCube = intersects[0];
  if (clickCube && preClickCube !== clickCube) {
    if (preClickCube && preMaterial) {
      preClickCube.object.material = preMaterial;
    }
    preClickCube = clickCube;
    preMaterial = clickCube.object.material.clone();
    clickCube.object.material.color = new THREE.Color(0xff0000);
  } else {
    if (preClickCube && preMaterial) {
      preClickCube.object.material = preMaterial;
    }
  }
});

const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  150
);
// 将相机的位置偏移
camera.position.z = 100;

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
