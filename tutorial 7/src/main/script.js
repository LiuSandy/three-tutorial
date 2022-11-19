import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import image from "../assets/images/9.png";
import * as dat from "dat.gui";
import gsap from "gsap";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new dat.GUI();

// 获取画布元素
const canvas = document.querySelector("canvas.webgl");
// 创建渲染器对象，将画布对象传入渲染器
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
// renderer.setClearColor("#000000");
// 设置渲染器画布大小
renderer.setSize(size.width, size.height);
// 设置渲染器设备像素比
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();

// Section 1: Raycaster
const group = new THREE.Group();
{
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 500; i++) {
    const cube = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
    );

    // Random position
    cube.position.set(
      Math.random() * 16 - 8,
      Math.random() * 16 - 8,
      Math.random() * 16 - 8
    );

    // Random rotation
    cube.rotation.set(Math.random(), Math.random(), Math.random());

    // Random Scale
    cube.scale.set(Math.random(), Math.random(), Math.random());

    group.add(cube);
  }
  scene.add(group);
  // add animation
  gsap.to(group.rotation, {
    x: "+=" + Math.PI,
    y: "+=" + Math.PI,
    duration: 5,
    ease: "power2.inOut",
    repeat: -1,
  });
}

// Section 2: Points
let points = new THREE.Points();
{
  const paramater = {
    count: 10000,
    size: 0.6,
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
        (Math.pow((Math.random() - 0.5) * 2, 3) *
          (paramater.radius - distance)) /
        5;
      const randomY =
        (Math.pow((Math.random() - 0.5) * 2, 3) *
          (paramater.radius - distance)) /
        5;
      const randomZ =
        (Math.pow((Math.random() - 0.5) * 2, 3) *
          (paramater.radius - distance)) /
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
      vertexColors: true,
    });

    points = new THREE.Points(geometry, materail);
    points.position.y = -40;
    points.rotation.x = Math.PI / 4;
    points.scale.set(5, 5, 5);
    scene.add(points);
  };

  generaterGalaxy();

  gsap.to(points.rotation, {
    y: "+=" + Math.PI * 2,
    duration: 3,
    ease: "power2.inOut",
    repeat: -1,
  });
}

const lightGroup = new THREE.Group();
// Section 3: Light
{
  const pointLightColor = 0xffffff;
  const pointLight = new THREE.PointLight(pointLightColor, 1);
  const point = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 32),
    new THREE.MeshBasicMaterial({ color: pointLightColor })
  );
  pointLight.castShadow = true;
  pointLight.lookAt(0, 0, 0);
  pointLight.position.set(6, 6, 6);
  point.position.set(6, 6, 6);
  const smallLight = new THREE.Group();
  smallLight.add(point, pointLight);

  const material = new THREE.MeshStandardMaterial();
  // material.roughness = 0.4;
  // plane
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), material);
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI * 0.5;

  const shpere = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), material);
  shpere.castShadow = true;
  shpere.position.y = 2;

  lightGroup.add(plane, shpere, smallLight);
  lightGroup.position.y = -85;

  scene.add(lightGroup);

  gsap.to(smallLight.position, {
    x: -3,
    duration: 3,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
  });
  gsap.to(smallLight.position, {
    y: 3,
    duration: 3,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
  });
}

const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  100
);
// 将相机的位置偏移
camera.position.set(0, 20, 30);

scene.add(camera);

// const controls = new OrbitControls(camera, canvas);
const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 -1;
  mouse.y = (e.clientY / window.innerHeight) * 2 -1;
});

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
const groupList = [group, points, lightGroup];
let currentPage = 0;
window.addEventListener("scroll", (e) => {
  const newPage = Math.round(window.scrollY / window.innerHeight);
  if (newPage !== currentPage) {
    currentPage = newPage;
    gsap.to(groupList[newPage].rotation, {
      z: "+=" + Math.PI,
      x: "+=" + Math.PI,
      duration: 1,
    });
  }
});

const clock = new THREE.Clock()
// 定义渲染函数
const animation = () => {
  const deltaTime = clock.getDelta()
  // controls.update();
  camera.position.y = -(window.scrollY / window.innerHeight) * 40;
  camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime * 5
  window.requestAnimationFrame(animation);
  renderer.render(scene, camera);
};
animation();
