import "./style.css"
import * as THREE from "three"
import Stats from "three/addons/libs/stats.module.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { addLights, createHUD } from "./lights"
import addGUI from "./controls"
import { onKeyDown, onMouseDown, onWindowResize } from "./eventHandlers"

const clock = new THREE.Clock()

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
  scene.fog = new THREE.Fog(0x808080, 1000, FAR)
  addLights(scene)
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
  controls = new OrbitControls(camera, renderer.domElement)

  // STATS
  stats = new Stats()
  container.appendChild(stats.dom)

  // Event Listeners
  window.addEventListener("resize", onWindowResize)
  window.addEventListener("keydown", onKeyDown)
  window.addEventListener("mousedown", onMouseDown)
  // Drag and Drop File Upload Setup
  window.addEventListener("dragover", function (event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  })

  window.addEventListener("drop", function (event) {
    event.preventDefault()
    if (event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]
      const reader = new FileReader()
      reader.onload = function (e) {
        const arrayBuffer = e.target.result
        const loader = new GLTFLoader()
        loader.parse(arrayBuffer, "", function (gltf) {
          loadModel(gltf)
        })
      }
      reader.readAsArrayBuffer(file)
    }
  })
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
}

function animate() {
  render()
  stats.update()
}

function render() {
  const delta = clock.getDelta()

  mixer?.update(delta)

  if (!middleMouseDown || useOrbitControls) {
    controls.update(delta)
  }

  renderer.clear()
  renderer.render(scene, camera)

  // Render debug HUD with shadow map
  if (showHUD) {
    lightShadowMapViewer.render(renderer)
  }
}

function loadModel(gltf) {
  gltf.scene.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true
      node.receiveShadow = true
    }
  })

  model = gltf.scene
  model.scale.set(
    modelTransform.scaleX,
    modelTransform.scaleY,
    modelTransform.scaleZ
  )
  model.position.set(
    modelTransform.posX,
    modelTransform.posY,
    modelTransform.posZ
  )
  model.rotation.set(
    modelTransform.rotX,
    modelTransform.rotY,
    modelTransform.rotZ
  )
  scene.add(model)

  // Add animations if present
  if (gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(model)
    animations = gltf.animations // Store animations

    // Play the first animation by default
    activeAction = mixer.clipAction(animations[0])
    activeAction.play()

    currentAnimation = animations[0].name
  }

  addGUI()
}
