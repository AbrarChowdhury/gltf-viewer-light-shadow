import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import Stats from "three/addons/libs/stats.module.js"
import { HorizontalBlurShader } from "three/addons/shaders/HorizontalBlurShader.js"
import { VerticalBlurShader } from "three/addons/shaders/VerticalBlurShader.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { addLights } from "./lights"
import { loadModel, blurShadow } from "./utils"

const clock = new THREE.Clock()

init()

function init() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(0.5, 1, 2)

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  addLights(scene)
  stats = new Stats()
  document.body.appendChild(stats.dom)

  window.addEventListener("resize", onWindowResize)

  const loader = new GLTFLoader()
  loader.load("lady.glb", function (gltf) {
    loadModel(gltf)
  })
  // the container, if you need to move the plane just move this
  shadowGroup = new THREE.Group()
  shadowGroup.position.y = -0.3
  scene.add(shadowGroup)

  // the render target that will show the shadows in the plane texture
  renderTarget = new THREE.WebGLRenderTarget(512, 512)
  renderTarget.texture.generateMipmaps = false

  // the render target that we will use to blur the first render target
  renderTargetBlur = new THREE.WebGLRenderTarget(512, 512)
  renderTargetBlur.texture.generateMipmaps = false

  // make a plane and make it face up
  const planeGeometry = new THREE.PlaneGeometry(
    PLANE_WIDTH,
    PLANE_HEIGHT
  ).rotateX(Math.PI / 2)
  const planeMaterial = new THREE.MeshBasicMaterial({
    map: renderTarget.texture,
    opacity: state.shadow.opacity,
    transparent: true,
    depthWrite: false,
  })
  plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.castShadow = false
  plane.receiveShadow = true
  // make sure it's rendered after the fillPlane
  plane.renderOrder = 1
  shadowGroup.add(plane)

  // the y from the texture is flipped!
  plane.scale.y = -1

  // the plane onto which to blur the texture
  blurPlane = new THREE.Mesh(planeGeometry)
  blurPlane.visible = false
  shadowGroup.add(blurPlane)

  // the plane with the color of the ground
  const fillPlaneMaterial = new THREE.MeshBasicMaterial({
    color: "#ffffff",
    opacity: 1,
    transparent: true,
    depthWrite: false,
  })
  fillPlane = new THREE.Mesh(planeGeometry, fillPlaneMaterial)
  fillPlane.rotateX(Math.PI)
  shadowGroup.add(fillPlane)
  // the camera to render the depth material from
  shadowCamera = new THREE.OrthographicCamera(
    -PLANE_WIDTH / 2,
    PLANE_WIDTH / 2,
    PLANE_HEIGHT / 2,
    -PLANE_HEIGHT / 2,
    0,
    Shadow_Source_Height
  )
  // shadowCamera.rotation.x = Math.PI / 2 // get the camera to look up

  shadowCamera.position.set(shadowCameraTransform.posX, shadowCameraTransform.posY, shadowCameraTransform.posZ); 
  shadowCamera.rotation.x = shadowCameraTransform.rotX// get the camera to look up
  // shadowCamera.lookAt(new THREE.Vector3(-5, 10, 0));
  shadowCameraHelper = new THREE.CameraHelper(shadowCamera)
  scene.add(shadowCameraHelper)
  shadowGroup.add(shadowCamera)

  cameraHelper = new THREE.CameraHelper(shadowCamera)

  depthMaterial = new THREE.MeshDepthMaterial()
  depthMaterial.userData.darkness = { value: state.shadow.darkness }
  depthMaterial.onBeforeCompile = function (shader) {
    shader.uniforms.darkness = depthMaterial.userData.darkness
    shader.fragmentShader = /* glsl */  `
      uniform float darkness;
      ${shader.fragmentShader.replace(
        "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );",
        "gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );"
      )}
    `
  }

  depthMaterial.depthTest = false
  depthMaterial.depthWrite = false

  horizontalBlurMaterial = new THREE.ShaderMaterial(HorizontalBlurShader)
  horizontalBlurMaterial.depthTest = false

  verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader)
  verticalBlurMaterial.depthTest = false

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(animate)
  document.body.appendChild(renderer.domElement)



  new OrbitControls(camera, renderer.domElement)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  // remove the background
  const initialBackground = scene.background
  scene.background = null

  // force the depthMaterial to everything
  cameraHelper.visible = false
  scene.overrideMaterial = depthMaterial

  // set renderer clear alpha
  const initialClearAlpha = renderer.getClearAlpha()
  renderer.setClearAlpha(0)

  // render to the render target to get the depths
  renderer.setRenderTarget(renderTarget)
  renderer.render(scene, shadowCamera)

  // and reset the override material
  scene.overrideMaterial = null
  cameraHelper.visible = true

  blurShadow(state.shadow.blur)

  // a second pass to reduce the artifacts
  // (0.4 is the minimum blur amout so that the artifacts are gone)
  blurShadow(state.shadow.blur * 0.4)

  // reset and render the normal scene
  renderer.setRenderTarget(null)
  renderer.setClearAlpha(initialClearAlpha)
  scene.background = initialBackground

  renderer.render(scene, camera)
  stats.update()
  const delta = clock.getDelta()

  mixer?.update(delta)

  // if (!middleMouseDown || useOrbitControls) {
  //   controls.update(delta)
  // }

  renderer.clear()
  renderer.render(scene, camera)

  // Render debug HUD with shadow map
  if (showHUD) {
    lightShadowMapViewer.render(renderer)
  }
  // updateLightHelpers()
}
