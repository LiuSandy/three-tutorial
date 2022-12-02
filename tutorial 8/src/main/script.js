import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";

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
renderer.shadowMap.enabled = true;
// 设置渲染器画布大小
renderer.setSize(size.width, size.height);
// 设置渲染器设备像素比
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();

// create a sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x787876,
  })
);
sphere.castShadow = true;
sphere.position.set(0, 2, 0);
scene.add(sphere);
// create a floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 70),
  new THREE.MeshStandardMaterial({
    color: 0x8c470e,
  })
);
floor.position.y = -10;
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
light.castShadow = true;
scene.add(light);

// 初始化物理世界吗
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
});
// 创建物理世界小球
const _shpere = new CANNON.Body({
  shape: new CANNON.Sphere(1),
  mass: 10,
});
_shpere.position.copy(sphere.position);
world.addBody(_shpere);

_shpere.addEventListener('collide',e=>{
  console.log(e)
})

const _floor = new CANNON.Body({
  shape: new CANNON.Plane(40, 70),
  mass: 0,
});
_floor.position.copy(floor.position);
_floor.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(_floor);

const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  100
);
// 将相机的位置偏移
camera.position.set(15, 5, 20);

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
  world.fixedStep();
  sphere.position.copy(_shpere.position);
  renderer.render(scene, camera);
};
animation();
