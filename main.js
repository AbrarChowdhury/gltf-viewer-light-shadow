import "./style.css";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { addLights, createHUD } from "./lights";
import addGUI from "./controls"



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
    scene.add(gltf.scene)
    const animations = gltf.animations
    animations.forEach((clip) => {
      if (clip.name === "arguing") {
        mixer.clipAction(clip).setLoop(THREE.LoopRepeat).play()
      }
    })
    addGUI()
  })
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
