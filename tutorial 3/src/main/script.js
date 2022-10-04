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

/**
 * Three.js 中可用的标准几何体
 */
const material = new THREE.MeshBasicMaterial({
  color: "#0c435d",
});
// material.wireframe = true
material.side = THREE.DoubleSide;

// 1. Box
const cube = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), material);
cube.position.set(-3, 1, 1);
scene.add(cube);

// 2. Circle
const circle = new THREE.Mesh(new THREE.CircleGeometry(0.1, 32), material);
circle.position.set(-2.5, 1, 1);
scene.add(circle);

// 3. Cone
const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 32), material);
cone.position.set(-2, 1, 1);
scene.add(cone);

// 4. Cylinder
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32),
  material
);
cylinder.position.set(-1.5, 1, 1);
scene.add(cylinder);

// 5. Dodecahedron
const dodecahedron = new THREE.Mesh(
  new THREE.DodecahedronGeometry(0.2),
  material
);
dodecahedron.position.set(-1, 1, 1);
scene.add(dodecahedron);

// 6. Edges 可以查看任何一个几何体的边缘线框
const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.5, 0.5, 0.5));
const line = new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: "#0c435d" })
);
line.position.set(0, 1, 1);
scene.add(line);

// 7. Extrude 挤压缓冲几何体 通过二维平面挤压产生三维图形
const points = []
points.push(new THREE.Vector2(.5,0))
points.push(new THREE.Vector2(.5,.2))
points.push(new THREE.Vector2(.7,.2))
points.push(new THREE.Vector2(.7,0))
const shape = new THREE.Shape(points)
const extrudeSettings = {
  steps: 2,
  depth: .1,
  bevelEnabled: true,
  bevelThickness: .3,
  bevelSize: 1,
  bevelOffset: 0,
  bevelSegments: 1,
};

const extrude = new THREE.Mesh(
  new THREE.ExtrudeGeometry(shape, extrudeSettings),
  material
);
extrude.scale.set(.5,.5,.5)
scene.add(extrude);

// 8. Icosahedron
const icosahedron = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.2),
  material
);
icosahedron.position.set(1.5, 1, 1);
scene.add(icosahedron);

// 9. Octahedron
const octahedron = new THREE.Mesh(
  new THREE.OctahedronGeometry(0.2),
  material
);
octahedron.position.set(-3, 0, 1);
scene.add(octahedron);

// 10. plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(0.2,.2),
  material
);
plane.position.set(-2.5, 0, 1);
scene.add(plane);

// 11. Ring
const ring = new THREE.Mesh(
  new THREE.RingGeometry(0.2,.5,30),
  material
);
ring.position.set(-1.5, 0, 1);
scene.add(ring);

// 12. Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.2,30),
  material
);
sphere.position.set(-.5, 0, 1);
scene.add(sphere);


// 13. Sphere
const tetrahedron = new THREE.Mesh(
  new THREE.TetrahedronGeometry(0.2),
  material
);
tetrahedron.position.set(1.5, 0, 1);
scene.add(tetrahedron);


// 14. Torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3,.07, 30,30),
  material
);
torus.position.set(2.5, 0, 1);
scene.add(torus);

// 15. TorusKnot
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.3,.07),
  material
);
torusKnot.position.set(-3, -1, 1);
scene.add(torusKnot);


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
  scene.children.forEach(item=>{
    if (item.isMesh) {
      item.rotation.x += 0.02
      item.rotation.y += 0.02
      item.rotation.z += 0.02
    }
  })
  controls.update();
  window.requestAnimationFrame(animation);
  renderer.render(scene, camera);
};
animation();
