import * as THREE from 'three';
import "./style.css";
import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ShadowMapViewer } from 'three/addons/utils/ShadowMapViewer.js';
import { GUI } from 'dat.gui'; // Import dat.GUI

const SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
const FLOOR = -10;

let camera, controls, scene, renderer;
let container, stats;

const NEAR = 0.1, FAR = 3000; // Adjust NEAR to a small value, but not zero.

let mixer;

const morphs = [];

let light;
let lightShadowMapViewer;

const clock = new THREE.Clock();

let showHUD = false;

init();
createGUI(); // Initialize the GUI

function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  // CAMERA

  camera = new THREE.PerspectiveCamera(20, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR);
  camera.position.set(0, 2, 20);

  // SCENE

  scene = new THREE.Scene();
  scene.background = new THREE.Color("#D3D3D3");

  // LIGHTS

  const ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);

  light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0, 1500, 1000);
  light.castShadow = true;
  light.shadow.camera.top = 2000;
  light.shadow.camera.bottom = -2000;
  light.shadow.camera.left = -2000;
  light.shadow.camera.right = 2000;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 2500;
  light.shadow.bias = 0.0001;

  light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
  light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

  scene.add(light);

  createHUD();
  createScene();

  // RENDERER

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.setAnimationLoop(animate);
  container.appendChild(renderer.domElement);

  renderer.autoClear = false;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // CONTROLS

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  // STATS

  stats = new Stats();
  //container.appendChild(stats.dom);

  //

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('keydown', onKeyDown);

}

function onWindowResize() {

  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;

  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.updateProjectionMatrix();

  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

  controls.update();

}

function onKeyDown(event) {

  switch (event.keyCode) {

    case 84:	/*t*/
      showHUD = !showHUD;
      break;

  }

}

function createHUD() {
  lightShadowMapViewer = new ShadowMapViewer(light);
  lightShadowMapViewer.position.x = 10;
  lightShadowMapViewer.position.y = SCREEN_HEIGHT - (SHADOW_MAP_HEIGHT / 4) - 10;
  lightShadowMapViewer.size.width = SHADOW_MAP_WIDTH / 4;
  lightShadowMapViewer.size.height = SHADOW_MAP_HEIGHT / 4;
  lightShadowMapViewer.update();
}

function createScene() {

  // GROUND

  const geometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: "gray" });

  const ground = new THREE.Mesh(geometry, planeMaterial);

  ground.position.set(0, FLOOR, 0);
  ground.rotation.x = -Math.PI / 2;
  ground.scale.set(100, 100, 100);

  ground.castShadow = false;
  ground.receiveShadow = true;

  scene.add(ground);

  // MORPHS

  mixer = new THREE.AnimationMixer(scene);

  const gltfloader = new GLTFLoader();

  gltfloader.load('lady.glb', function (gltf) {
    const lady = gltf.scene.children[0];
    console.log(lady);
    lady.scale.set(1, 1, 1);
    lady.position.set(0, FLOOR, 2);
    scene.add(lady);
    console.log(lady);
    const clip = gltf.animations[0];
    lady.castShadow=true
    lady.receiveShadow=true
    controls.target.copy(lady.position);
    controls.update();
  });

}

function createGUI() {
  const gui = new GUI();

  // Camera controls
  const cameraFolder = gui.addFolder('Camera');
  cameraFolder.add(camera.position, 'x', -1, 1);
  cameraFolder.add(camera.position, 'y', 0, 10);
  cameraFolder.add(camera.position, 'z', 0, 10);
  cameraFolder.add(camera, 'fov', 1, 100).onChange(() => {
    camera.updateProjectionMatrix();
  });
  cameraFolder.open();

  // Light controls
  const lightFolder = gui.addFolder('Directional Light');
  lightFolder.add(light.position, 'x', -5000, 5000);
  lightFolder.add(light.position, 'y', -5000, 5000);
  lightFolder.add(light.position, 'z', -5000, 5000);
  lightFolder.add(light, 'intensity', 0, 10);
  lightFolder.open();
}

function animate() {

  render();
  stats.update();

}

function render() {

  const delta = clock.getDelta();

  mixer.update(delta);

  controls.update();

  renderer.clear();
  renderer.render(scene, camera);

  // Render debug HUD with shadow map
  if (showHUD) {
    lightShadowMapViewer.render(renderer);
  }

}
