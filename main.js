import "./style.css"
import * as THREE from "three"
import Stats from "three/addons/libs/stats.module.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { onKeyDown, onMouseDown, onWindowResize } from "./eventHandlers"
import createInfoCard from "./infoCard"
import vertexShader from "./shaders/vertexShader"
import fragmentShader from "./shaders/fragmentShader"

const clock = new THREE.Clock()

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_lightPosition: { type: 'v3', value: new THREE.Vector3(0, 150, 0) },  // Light position
    u_objectPosition: { type: 'v3', value: new THREE.Vector3(0, 1, 0) }, // Object position
  },
})

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
  // Object that casts shadow (a sphere in this case)
  const objectGeometry = new THREE.SphereGeometry(30, 32, 32)
  const objectMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
  const objectMesh = new THREE.Mesh(objectGeometry, objectMaterial)
  objectMesh.position.set(0, 1, 0) // Position the object above the plane
  objectMesh.castShadow = true
  scene.add(objectMesh)

  // Light source (casting shadows)
  const lightSource = new THREE.DirectionalLight('white', 1,)
  lightSource.position.set(0, 150, 0) // Position the light above
  lightSource.castShadow = true
  scene.add(lightSource)
  const lightHelper = new THREE.DirectionalLightHelper(lightSource, 5);
  scene.add(lightHelper)
  // GROUND
  const geometry = new THREE.PlaneGeometry(100, 100)
  const ground = new THREE.Mesh(geometry, shaderMaterial)
  ground.position.set(0, -40, 0)
  ground.rotation.x = -Math.PI / 2
  ground.scale.set(100, 100, 100)

  ground.castShadow = false
  ground.receiveShadow = true

  scene.add(ground)
}

function animate() {
  render()
  // shaderMaterial.uniforms.parameter.value += 0.01
  stats.update()
}

function render() {
  const delta = clock.getDelta()
  mixer?.update(delta)
  renderer.clear()
  renderer.render(scene, camera)
}
