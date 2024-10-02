import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { onWindowResize } from "./eventHandlers"

let container, camera, scene, renderer, controls, plane
const clock = new THREE.Clock()
// const mouse = new THREE.Vector2()

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

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
  window.addEventListener("mousemove", onMouseMove, false)
}

function createScene() {

  const shaderMaterial = new THREE.ShaderMaterial()

  // Plane
  const geometry = new THREE.PlaneGeometry(10, 10)
  plane = new THREE.Mesh(geometry, shaderMaterial)
  plane.position.set(0, 0, 0)
  plane.scale.set(100, 100, 100)
  plane.frustumCulled = false
  scene.add(plane)
}

// Handle mouse movement
function onMouseMove(event) {
  // // Update the mouse position
  // mouse.x = event.clientX
  // mouse.y = event.clientY

  // // Normalize mouse coordinates and update the shader uniform
  // plane.material.uniforms.u_mouse.value.x = mouse.x
  // plane.material.uniforms.u_mouse.value.y = window.innerHeight - mouse.y // Invert Y-coordinate for WebGL
}

function animate() {
  render()
}

function render() {
  // const time = clock.getElapsedTime()
  // plane.material.uniforms.u_time.value = time
  renderer.clear()
  renderer.render(scene, camera)
  controls.update()
}
