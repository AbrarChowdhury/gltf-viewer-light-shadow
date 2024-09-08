import * as THREE from "three"
import Stats from "three/addons/libs/stats.module.js"
import "./style.css"
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { ShadowMapViewer } from "three/addons/utils/ShadowMapViewer.js"
import { GUI } from "dat.gui"

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
let lady
const morphs = []
let ambient
let light, light1, light2, light3
let lightShadowMapViewer

const clock = new THREE.Clock()

let showHUD = false
let middleMouseDown = false

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
  ambient = new THREE.AmbientLight(0xfffdfd, 4.1)
  scene.add(ambient)

  light = new THREE.DirectionalLight(0xddebff, 2.7)
  light.position.set(-438, 1400, 620)
  light.castShadow = true
  light.shadow.camera.top = 2000
  light.shadow.camera.bottom = -2000
  light.shadow.camera.left = -2000
  light.shadow.camera.right = 2000
  light.shadow.camera.near = 1200
  light.shadow.camera.far = 2500
  light.shadow.bias = -0.01

  light.shadow.mapSize.width = SHADOW_MAP_WIDTH
  light.shadow.mapSize.height = SHADOW_MAP_HEIGHT
  scene.add(light)

  // Add three more lights to the scene
  light1 = new THREE.PointLight(0xff0000, 1, 50000) // Red light
  light1.position.set(150, 46, 400)
  light1.castShadow = true
  light1.shadow.mapSize.width = SHADOW_MAP_WIDTH
  light1.shadow.mapSize.height = SHADOW_MAP_HEIGHT
  scene.add(light1)

  light2 = new THREE.PointLight(0x00ff00, 1, 50000) // Green light
  light2.position.set(35, 46, 400)
  light2.castShadow = true
  light2.shadow.mapSize.width = SHADOW_MAP_WIDTH
  light2.shadow.mapSize.height = SHADOW_MAP_HEIGHT
  scene.add(light2)

  light3 = new THREE.SpotLight(0x0000ff, 50000) // Blue spotlight
  light3.position.set(0, 200, 0)
  light3.castShadow = true
  light3.shadow.mapSize.width = SHADOW_MAP_WIDTH
  light3.shadow.mapSize.height = SHADOW_MAP_HEIGHT
  scene.add(light3)

  function addLightHelpers() {
    scene.traverse((child) => {
      if (child.isDirectionalLight) {
        const helper = new THREE.DirectionalLightHelper(child, 5);
        helper.isLightHelper = true; // Mark it for toggling
        scene.add(helper);
      } else if (child.isPointLight) {
        const helper = new THREE.PointLightHelper(child, 5);
        helper.isLightHelper = true; // Mark it for toggling
        scene.add(helper);
      } else if (child.isSpotLight) {
        const helper = new THREE.SpotLightHelper(child);
        helper.isLightHelper = true; // Mark it for toggling
        scene.add(helper);
      }
      // Add more light types as needed
    });
  }
  function toggleHelpers() {
    scene.traverse((child) => {
      if (child.isLightHelper) {
        child.visible = true;
      }
    });
  }
  addLightHelpers()
  toggleHelpers()
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
  controls.movementSpeed = 100
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
        // Set roughness close to 1
        // if (node.material) {
        //   node.material.roughness = 1
        // }
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

function createGUI() {
  const gui = new GUI()

  // Directional Light Controls
  const lightFolder = gui.addFolder("Directional Light")
  lightFolder.add(light, "visible").name("Toggle Light")
  lightFolder.add(light.position, "x", -2000, 2000).name("Position X")
  lightFolder.add(light.position, "y", 0, 3000).name("Position Y")
  lightFolder.add(light.position, "z", -2000, 2000).name("Position Z")
  lightFolder.add(light, "intensity", 0, 10).name("Intensity")
  lightFolder.add(light.shadow.camera, "near", 0.1, 3000).name("Shadow Near")
  lightFolder.add(light.shadow.camera, "far", 0.1, 5000).name("Shadow Far")
  lightFolder.add(light.shadow.camera, "top", -3000, 3000).name("Shadow Top")
  lightFolder
    .add(light.shadow.camera, "bottom", -3000, 3000)
    .name("Shadow Bottom")
  lightFolder.add(light.shadow.camera, "left", -3000, 3000).name("Shadow Left")
  lightFolder
    .add(light.shadow.camera, "right", -3000, 3000)
    .name("Shadow Right")
  lightFolder.add(light.shadow, "bias", -0.01, 0.01).name("Shadow Bias")
  lightFolder
    .add(light.shadow.mapSize, "width", 512, 8192)
    .name("Shadow Map Width")
    .onChange(updateShadowMap)
  lightFolder
    .add(light.shadow.mapSize, "height", 512, 8192)
    .name("Shadow Map Height")
    .onChange(updateShadowMap)
  lightFolder
    .addColor({ color: light.color.getHex() }, "color")
    .name("Light Color")
    .onChange((val) => light.color.setHex(val))

  // lightFolder.open()

  // Add controls for Light 1
  const light1Folder = gui.addFolder("Red Light")
  light1Folder.add(light1.position, "x", -2000, 2000).name("Position X")
  light1Folder.add(light1.position, "y", -1000, 3000).name("Position Y")
  light1Folder.add(light1.position, "z", -2000, 2000).name("Position Z")
  light1Folder.add(light1, "intensity", 0, 100000).name("Intensity")
  light1Folder
    .add(light1, "castShadow")
    .name("Cast Shadow")
    .onChange(updateShadowMap)
  light1Folder.add(light1, "visible").name("Toggle Light")

  // Add controls for Light 2
  const light2Folder = gui.addFolder("Green Light")
  light2Folder.add(light2.position, "x", -2000, 2000).name("Position X")
  light2Folder.add(light2.position, "y", -1000, 3000).name("Position Y")
  light2Folder.add(light2.position, "z", -2000, 2000).name("Position Z")
  light2Folder.add(light2, "intensity", 0, 100000).name("Intensity")
  light2Folder
    .add(light2, "castShadow")
    .name("Cast Shadow")
    .onChange(updateShadowMap)
  light2Folder.add(light2, "visible").name("Toggle Light")


  // Add controls for Light 3
  const light3Folder = gui.addFolder("Blue Spotlight")
  light3Folder.add(light3.position, "x", -2000, 2000).name("Position X")
  light3Folder.add(light3.position, "y", -1000, 3000).name("Position Y")
  light3Folder.add(light3.position, "z", -2000, 2000).name("Position Z")
  light3Folder.add(light3, "intensity", 0, 100000).name("Intensity")
  light3Folder
    .add(light3, "castShadow")
    .name("Cast Shadow")
    .onChange(updateShadowMap)
  light3Folder.add(light3, "visible").name("Toggle Light")

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

function updateShadowMap() {
  light.shadow.mapSize.width = SHADOW_MAP_WIDTH
  light.shadow.mapSize.height = SHADOW_MAP_HEIGHT
  light.shadow.map.dispose() // Dispose previous shadow map
  light.shadow.map = null // Set map to null to trigger reallocation
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
