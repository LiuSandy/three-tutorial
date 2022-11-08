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
renderer.setClearColor("#ffffff");
// 设置渲染器画布大小
renderer.setSize(size.width, size.height);
// 设置渲染器设备像素比
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.localClippingEnabled = true;

const scene = new THREE.Scene();

const clippingPlanes = [new THREE.Plane(new THREE.Vector3(-1, 0, 0), -3)];

const sphere = new THREE.SphereGeometry(1, 32, 32);

const basicMaterialParameters = {
  color: 0x049ef4,
  wireframe: false,
  wireframeLinewidth: 1,
  transparent: false,
  opacity: 1,
  visible: true,
  side: "front",
};

const basicMaterial = new THREE.MeshBasicMaterial(basicMaterialParameters);
basicMaterial.clippingPlanes = clippingPlanes;
basicMaterial.clipIntersection = true;
// basicMaterial.side = THREE.BackSide

// 添加控制器
const basicMaterialGui = gui.addFolder("Basic Material");
basicMaterialGui.open();
basicMaterialGui.addColor(basicMaterialParameters, "color").onChange((e) => {
  basicMaterial.color.set(e);
});
basicMaterialGui.add(basicMaterialParameters, "wireframe").onChange((e) => {
  basicMaterial.wireframe = e;
});
basicMaterialGui
  .add(basicMaterialParameters, "wireframeLinewidth")
  .min(1)
  .max(20)
  .step(1)
  .onChange((e) => {
    basicMaterial.wireframeLinewidth = e;
  });

basicMaterialGui.add(basicMaterialParameters, "visible").onChange((e) => {
  basicMaterial.visible = e;
});

basicMaterialGui.add(basicMaterialParameters, "transparent").onChange((e) => {
  basicMaterial.transparent = e;
  basicMaterial.needsUpdate = true;
});

basicMaterialGui
  .add(basicMaterialParameters, "opacity")
  .min(0)
  .max(1)
  .step(0.1)
  .onChange((e) => {
    basicMaterial.opacity = e;
  });

basicMaterialGui
  .add(basicMaterialParameters, "side", ["front", "back", "double"])
  .onChange((e) => {
    switch (e) {
      case "front":
        basicMaterial.side = THREE.FrontSide;
        break;
      case "back":
        basicMaterial.side = THREE.BackSide;
        break;
      case "double":
        basicMaterial.side = THREE.DoubleSide;
        break;
    }
    basicMaterial.needsUpdate = true;
  });

const lambertMaterial = new THREE.MeshLambertMaterial({
  color: "#049ef4",
});

const phongMaterial = new THREE.MeshPhongMaterial({
  color: "#049ef4",
});

const basicSphere = new THREE.Mesh(sphere, basicMaterial);
basicSphere.position.set(-3, 0, 0);
const lambertSphere = new THREE.Mesh(sphere, lambertMaterial);
const phongSphere = new THREE.Mesh(sphere, phongMaterial);
phongSphere.position.set(3, 0, 0);

scene.add(basicSphere, lambertSphere, phongSphere);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(0, 0, 10);
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  100
);
// 将相机的位置偏移
camera.position.z = 6;

scene.add(camera);

const helpers = new THREE.Group();
helpers.add(new THREE.PlaneHelper(clippingPlanes[0], 2, 0xff0000));
scene.add(helpers);

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
