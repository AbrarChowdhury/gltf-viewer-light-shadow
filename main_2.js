import * as THREE from "three"

import Stats from "three/addons/libs/stats.module.js"
import "./style.css"
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { ShadowMapViewer } from "three/addons/utils/ShadowMapViewer.js"

const SHADOW_MAP_WIDTH = 2048,
  SHADOW_MAP_HEIGHT = 1024

let SCREEN_WIDTH = window.innerWidth
let SCREEN_HEIGHT = window.innerHeight
const FLOOR = -250

let camera, controls, scene, renderer
let container, stats

const NEAR = 10,
  FAR = 3000

let mixer

const morphs = []

let light
let lightShadowMapViewer

const clock = new THREE.Clock()

let showHUD = false

init()

function init() {
  container = document.createElement("div")
  document.body.appendChild(container)

  // CAMERA

  camera = new THREE.PerspectiveCamera(
    23,
    SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR,
    FAR
  )
  camera.position.set(700, 50, 1900)

  // SCENE

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x59472b)
  scene.fog = new THREE.Fog(0x59472b, 1000, FAR)

  // LIGHTS

  const ambient = new THREE.AmbientLight(0xffffff)
  scene.add(ambient)

  light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(0, 1500, 1000)
  light.castShadow = true
  light.shadow.camera.top = 2000
  light.shadow.camera.bottom = -2000
  light.shadow.camera.left = -2000
  light.shadow.camera.right = 2000
  light.shadow.camera.near = 1200
  light.shadow.camera.far = 2500
  light.shadow.bias = 0.0001

  light.shadow.mapSize.width = SHADOW_MAP_WIDTH
  light.shadow.mapSize.height = SHADOW_MAP_HEIGHT

  scene.add(light)

  createHUD()
  createScene()

  // RENDERER

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
  renderer.setAnimationLoop(animate)
  container.appendChild(renderer.domElement)

  renderer.autoClear = false

  //

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap

  // CONTROLS

  controls = new FirstPersonControls(camera, renderer.domElement)

  controls.lookSpeed = 0.0125
  controls.movementSpeed = 500
  controls.lookVertical = true

  controls.lookAt(scene.position)

  // STATS

  stats = new Stats()
  container.appendChild( stats.dom );

  //

  window.addEventListener("resize", onWindowResize)
  window.addEventListener("keydown", onKeyDown)
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
    case 84 /*t*/:
      showHUD = !showHUD
      break
  }
}

function createHUD() {
  lightShadowMapViewer = new ShadowMapViewer(light)
  lightShadowMapViewer.position.x = 10
  lightShadowMapViewer.position.y = SCREEN_HEIGHT - SHADOW_MAP_HEIGHT / 4 - 10
  lightShadowMapViewer.size.width = SHADOW_MAP_WIDTH / 4
  lightShadowMapViewer.size.height = SHADOW_MAP_HEIGHT / 4
  lightShadowMapViewer.update()
}

function createScene() {
  // GROUND

  const geometry = new THREE.PlaneGeometry(100, 100)
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffdd99 })

  const ground = new THREE.Mesh(geometry, planeMaterial)

  ground.position.set(0, FLOOR, 0)
  ground.rotation.x = -Math.PI / 2
  ground.scale.set(100, 100, 100)

  ground.castShadow = false
  ground.receiveShadow = true

  scene.add(ground)



  // CUBES

  const cubes1 = new THREE.Mesh(
    new THREE.BoxGeometry(1500, 220, 150),
    planeMaterial
  )

  cubes1.position.y = FLOOR - 50
  cubes1.position.z = 20

  cubes1.castShadow = true
  cubes1.receiveShadow = true

  scene.add(cubes1)

  const cubes2 = new THREE.Mesh(
    new THREE.BoxGeometry(1600, 170, 250),
    planeMaterial
  )

  cubes2.position.y = FLOOR - 50
  cubes2.position.z = 20

  cubes2.castShadow = true
  cubes2.receiveShadow = true

  scene.add(cubes2)

  // MORPHS

  mixer = new THREE.AnimationMixer(scene)



  const gltfloader = new GLTFLoader()



  gltfloader.load("lady.glb", function (gltf) {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  
    const lady = gltf.scene.children[0];
    lady.scale.set(100, 100, 100);
    lady.position.set(0, FLOOR, 300);
  
    scene.add(gltf.scene);
  });


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

  controls.update(delta)

  renderer.clear()
  renderer.render(scene, camera)

  // Render debug HUD with shadow map

  if (showHUD) {
    lightShadowMapViewer.render(renderer)
  }
}
