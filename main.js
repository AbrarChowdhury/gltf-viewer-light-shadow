import "./style.css"
import * as THREE from "three"
import Stats from "three/addons/libs/stats.module.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { onKeyDown, onMouseDown, onWindowResize } from "./eventHandlers"
import createInfoCard from "./infoCard"
import vertexShader from "./shaders/vertexShader"
import fragmentShader from "./shaders/fragmentShader"

const clock = new THREE.Clock()

init()
function init() {
  container = document.createElement("div")
  document.body.appendChild(container)

  // CAMERA
  camera = new THREE.PerspectiveCamera(
    23,
    SCREEN_WIDTH / SCREEN_HEIGHT,
    1,
    20000
  )
  camera.position.set(0, 50, 2000)


  // SCENE
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x808080)
  createScene()

  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
  renderer.setAnimationLoop(animate)
  container.appendChild(renderer.domElement)

  renderer.autoClear = false

  // CONTROLS
  controls = new OrbitControls(camera, renderer.domElement)

  // Event Listeners
  window.addEventListener("resize", onWindowResize)
}

function createScene() {
  // //Shpere
  // const objectGeometry = new THREE.SphereGeometry(30, 32, 32)
  // const objectMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
  // const objectMesh = new THREE.Mesh(objectGeometry, objectMaterial)
  // objectMesh.position.set(0, 1, 0) 
  // scene.add(objectMesh)

  const shaderMaterial = new THREE.ShaderMaterial()
  // GROUND
  const geometry = new THREE.PlaneGeometry(10, 10)
  const ground = new THREE.Mesh(geometry, shaderMaterial)
  ground.position.set(0, 0, 0)
  // ground.rotation.x = -Math.PI / 2
  ground.scale.set(100, 100, 100)
  ground.frustumCulled = false
  scene.add(ground)
}

function animate() {
  render()
  // shaderMaterial.uniforms.parameter.value += 0.01
}

function render() {
  const delta = clock.getDelta()
  renderer.clear()
  renderer.render(scene, camera)
  controls.update();
}
