import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import "./style.css";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GUI } from "dat.gui";
import { addLights, createHUD } from "./lights";



SCREEN_WIDTH = window.innerWidth;
SCREEN_HEIGHT = window.innerHeight;
const FLOOR = -250;

let camera, controls, scene, renderer;
let container, stats;

const NEAR = 10,
  FAR = 3000;

let mixer;
let lady;
const morphs = [];


const clock = new THREE.Clock();

let showHUD = false;
let middleMouseDown = false;

init();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  // CAMERA
  camera = new THREE.PerspectiveCamera(23, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR);
  camera.position.set(700, 50, 1900);

  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x808080);
  scene.fog = new THREE.Fog(0x808080, 1000, FAR);
  addLights(scene);
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
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // CONTROLS
  controls = new FirstPersonControls(camera, renderer.domElement);
  controls.lookSpeed = 0.0125;
  controls.movementSpeed = 100;
  controls.lookVertical = true;
  controls.lookAt(scene.position);

  // STATS
  stats = new Stats();
  container.appendChild(stats.dom);

  // Event Listeners
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", onKeyDown);
}



function createGUI() {
  const gui = new GUI()

  // Directional Light Controls
  const directionalLightFolder = gui.addFolder("Directional Light");
  directionalLightFolder.add(directionalLight, "visible").name("Toggle Light");
  directionalLightFolder.add(directionalLight, "castShadow").name("Cast Shadow");
  directionalLightFolder.add(directionalLight.position, "x", -2000, 2000).name("Position X");
  directionalLightFolder.add(directionalLight.position, "y", 0, 3000).name("Position Y");
  directionalLightFolder.add(directionalLight.position, "z", -2000, 2000).name("Position Z");
  directionalLightFolder.add(directionalLight, "intensity", 0, 10).name("Intensity");
  directionalLightFolder.add(directionalLight.shadow.camera, "near", 0.1, 3000).name("Shadow Near")
  directionalLightFolder.add(directionalLight.shadow.camera, "far", 0.1, 5000).name("Shadow Far")
  directionalLightFolder.add(directionalLight.shadow.camera, "top", -3000, 3000).name("Shadow Top")
  directionalLightFolder
    .add(directionalLight.shadow.camera, "bottom", -3000, 3000)
    .name("Shadow Bottom")
  directionalLightFolder.add(directionalLight.shadow.camera, "left", -3000, 3000).name("Shadow Left")
  directionalLightFolder
    .add(directionalLight.shadow.camera, "right", -3000, 3000)
    .name("Shadow Right")
  directionalLightFolder.add(directionalLight.shadow, "bias", -0.01, 0.01).name("Shadow Bias")
  directionalLightFolder
    .add(directionalLight.shadow.mapSize, "width", 512, 8192)
    .name("Shadow Map Width")
    .onChange(updateShadowMap)
  directionalLightFolder
    .add(directionalLight.shadow.mapSize, "height", 512, 8192)
    .name("Shadow Map Height")
    .onChange(updateShadowMap)
  directionalLightFolder
    .addColor({ color: directionalLight.color.getHex() }, "color")
    .name("Light Color")
    .onChange((val) => directionalLight.color.setHex(val))


  // Point Light 1 Controls
  const pointLight1Folder = gui.addFolder("Red Point Light");
  pointLight1Folder.add(pointLight1, "castShadow").name("Cast Shadow");
  pointLight1Folder.add(pointLight1.position, "x", -2000, 2000).name("Position X");
  pointLight1Folder.add(pointLight1.position, "y", -1000, 3000).name("Position Y");
  pointLight1Folder.add(pointLight1.position, "z", -2000, 2000).name("Position Z");
  pointLight1Folder.add(pointLight1, "intensity", 0, 100000).name("Intensity");
  pointLight1Folder.addColor({ color: pointLight1.color.getHex() }, "color").name("Light Color");

  // Point Light 2 Controls
  const pointLight2Folder = gui.addFolder("Green Point Light");
  pointLight2Folder.add(pointLight2, "castShadow").name("Cast Shadow");
  pointLight2Folder.add(pointLight2.position, "x", -2000, 2000).name("Position X");
  pointLight2Folder.add(pointLight2.position, "y", -1000, 3000).name("Position Y");
  pointLight2Folder.add(pointLight2.position, "z", -2000, 2000).name("Position Z");
  pointLight2Folder.add(pointLight2, "intensity", 0, 100000).name("Intensity");
  pointLight2Folder.addColor({ color: pointLight2.color.getHex() }, "color").name("Light Color");

  // Spotlight Controls
  const spotlightFolder = gui.addFolder("Blue Spotlight");
  spotlightFolder.add(spotlight, "castShadow").name("Cast Shadow");
  spotlightFolder.add(spotlight.position, "x", -2000, 2000).name("Position X");
  spotlightFolder.add(spotlight.position, "y", -1000, 3000).name("Position Y");
  spotlightFolder.add(spotlight.position, "z", -2000, 2000).name("Position Z");
  spotlightFolder.add(spotlight, "intensity", 0, 5000).name("Intensity");
  spotlightFolder.add(spotlight, "distance", 0, 2000).name("Distance");
  spotlightFolder.add(spotlight, "angle", 0, Math.PI / 2).name("Angle");
  spotlightFolder.add(spotlight, "penumbra", 0, 1).name("Penumbra");
  spotlightFolder.add(spotlight, "decay", 0, 2).name("Decay");
  spotlightFolder.addColor({ color: spotlight.color.getHex() }, "color").name("Light Color");


  // Ambient Light Controls
  const ambientFolder = gui.addFolder("Ambient Light")
  ambientFolder.add(ambient, "visible").name("Toggle Light")
  ambientFolder.add(ambient, "intensity", 0, 10).name("Intensity")
  ambientFolder
    .addColor({ color: ambient.color.getHex() }, "color")
    .name("Light Color")
    .onChange((val) => ambient.color.setHex(val))

  // The model
  const modelFolder = gui.addFolder("Model")
  console.log("gui: ", lady)
  modelFolder.add(lady.rotation, "z", 0, Math.PI * 2, 0.1).name("Z Rotation")
}
function onWindowResize() {
  SCREEN_WIDTH = window.innerWidth
  SCREEN_HEIGHT = window.innerHeight

  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT
  camera.updateProjectionMatrix()

  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
  controls.handleResize()
}

function onKeyDown(event) {
  switch (event.keyCode) {
    case 84: // T key
      showHUD = !showHUD
      break
  }
}



function createScene() {
  // GROUND
  const geometry = new THREE.PlaneGeometry(100, 100)
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 }) // Grayish floor color

  const ground = new THREE.Mesh(geometry, planeMaterial)
  ground.position.set(0, FLOOR, 0)
  ground.rotation.x = -Math.PI / 2
  ground.scale.set(100, 100, 100)

  ground.castShadow = false
  ground.receiveShadow = true

  scene.add(ground)

  // CUBES
  const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xffdd99 })
  for (let i = 0; i < 10; i++) {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(100, 100, 100),
      cubeMaterial
    )
    cube.position.set(
      Math.random() * 2000 - 1000,
      FLOOR + 200,
      Math.random() * 2000 - 1000
    )

    cube.castShadow = true
    cube.receiveShadow = true

    scene.add(cube)
  }

  // MORPHS
  mixer = new THREE.AnimationMixer(scene)

  const gltfloader = new GLTFLoader()
  gltfloader.load("lady.glb", function (gltf) {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })
    // "Ch22_Body" body
    // "Ch22_Hair" hair
    // "Ch22_Pants" pants
    // "Ch22_Shirt"
    // "Ch22_Sneakers"
    lady = gltf.scene.children[0]
    // roughness
    lady.getObjectByName("Ch22_Hair").material.roughness = 0.7
    lady.getObjectByName("Ch22_Body").material.roughness = 50
    lady.scale.set(200, 200, 200)
    lady.position.set(0, FLOOR, 300)
    lady.rotation.z = 5.6
    console.log(lady)
    createGUI()

    scene.add(gltf.scene)
    const animations = gltf.animations
    animations.forEach((clip) => {
      if (clip.name === "arguing") {
        mixer.clipAction(clip).setLoop(THREE.LoopRepeat).play()
      }
    })
  })
}
function updateShadowMap() {
  directionalLight.shadow.mapSize.width = SHADOW_MAP_WIDTH
  directionalLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT
  directionalLight.shadow.map.dispose() // Dispose previous shadow map
  directionalLight.shadow.map = null // Set map to null to trigger reallocation
}

window.addEventListener("mousedown", onMouseDown)
function onMouseDown(event) {
  if (event.button === 1) {
    console.log("mouse D")
    middleMouseDown = !middleMouseDown
  }
}
function animate() {
  render()
  stats.update()
}

function render() {
  const delta = clock.getDelta()

  mixer.update(delta)

  for (let i = 0; i < morphs.length; i++) {
    const morph = morphs[i]

    morph.position.x += morph.speed * delta

    if (morph.position.x > 2000) {
      morph.position.x = -1000 - Math.random() * 500
    }
  }

  if (!middleMouseDown) {
    controls.update(delta)
  }

  renderer.clear()
  renderer.render(scene, camera)

  // Render debug HUD with shadow map
  if (showHUD) {
    lightShadowMapViewer.render(renderer)
  }
}
