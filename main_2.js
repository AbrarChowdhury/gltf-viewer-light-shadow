import * as THREE from "three"
import Stats from "three/addons/libs/stats.module.js"
import "./style.css"
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { ShadowMapViewer } from "three/addons/utils/ShadowMapViewer.js"

// const SHADOW_MAP_WIDTH = 2048,
//   SHADOW_MAP_HEIGHT = 1024
const SHADOW_MAP_WIDTH = 4096,
  SHADOW_MAP_HEIGHT = 4096


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
  scene.background = new THREE.Color(0x808080) // Grayish background color
  scene.fog = new THREE.Fog(0x808080, 1000, FAR) // Grayish fog color

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
  light.shadow.bias = -0.0005

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

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // CONTROLS
  controls = new FirstPersonControls(camera, renderer.domElement)
  controls.lookSpeed = 0.0125
  controls.movementSpeed = 500
  controls.lookVertical = true

  controls.lookAt(scene.position)

  // STATS
  stats = new Stats()
  container.appendChild(stats.dom)

  // Event Listeners
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
    case 84: // T key
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
    console.log(gltf.animations)
    const lady = gltf.scene.children[0]
    lady.scale.set(200, 200, 200)
    lady.position.set(0, FLOOR, 300)

    scene.add(gltf.scene)
    const animations = gltf.animations;
    animations.forEach((clip) => {
      if (clip.name === "arguing") {
        mixer.clipAction(clip).setLoop(THREE.LoopRepeat).play();
      }
    });
  })
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
