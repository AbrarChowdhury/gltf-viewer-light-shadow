import { GUI } from "dat.gui"
import * as THREE from "three"

function addGUI() {
  const gui = new GUI()

  // Fog toggle
  gui
    .add(fogParams, "enableFog")
    .name("Fog On")
    .onChange((value) => {
      if (value) {
        scene.fog = new THREE.Fog(0x808080, 2000, FAR)
        // renderer.render(scene, camera);
      } else {
        scene.fog = null // Disable fog
      }
    })

  // Ambient Light Controls
  const ambientFolder = gui.addFolder("Ambient Light")
  ambientFolder.add(ambient, "visible").name("Light On")
  ambientFolder.add(ambient, "intensity", 0, 10).name("Intensity")
  ambientFolder
    .addColor({ color: ambient.color.getHex() }, "color")
    .name("Light Color")
    .onChange((val) => ambient.color.setHex(val))

  // Directional Light Controls
  const directionalLightFolder = gui.addFolder("Directional Light")
  directionalLightFolder.add(directionalLight, "visible").name("Light On")
  directionalLightFolder.add(directionalLight, "castShadow").name("Cast Shadow")
  directionalLightFolder
    .add(directionalLight, "intensity", 0, 10)
    .name("Intensity")
  directionalLightFolder
    .add(directionalLight.position, "x", -2000, 2000)
    .name("Position X")
  directionalLightFolder
    .add(directionalLight.position, "y", 0, 3000)
    .name("Position Y")
  directionalLightFolder
    .add(directionalLight.position, "z", -2000, 2000)
    .name("Position Z")
  directionalLightFolder
    .add(directionalLight.shadow.camera, "near", 0.1, 3000)
    .name("Shadow Near")
    .onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder
    .add(directionalLight.shadow.camera, "far", 0.1, 5000)
    .name("Shadow Far")
    .onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder
    .add(directionalLight.shadow.camera, "top", -3000, 3000)
    .name("Shadow Top")
    .onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder
    .add(directionalLight.shadow.camera, "bottom", -3000, 3000)
    .name("Shadow Bottom")
    .onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder
    .add(directionalLight.shadow.camera, "left", -3000, 3000)
    .name("Shadow Left")
    .onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder
    .add(directionalLight.shadow.camera, "right", -3000, 3000)
    .name("Shadow Right")
    .onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder
    .add(directionalLight.shadow, "bias", -1, 1)
    .name("Shadow Bias")
    .step(0.001)
    .onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder
    .add(directionalLight.shadow.mapSize, "width", 512, 8192)
    .name("S-Map W")
    .onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder
    .add(directionalLight.shadow.mapSize, "height", 512, 8192)
    .name("S-Map H")
    .onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder
    .addColor({ color: directionalLight.color.getHex() }, "color")
    .name("Light Color")
    .onChange((val) => directionalLight.color.setHex(val))

  // Directional Light 2 Controls
  const directionalLightFolder2 = gui.addFolder("Directional Light 2")
  directionalLightFolder2.add(directionalLight2, "visible").name("Light On")
  directionalLightFolder2
    .add(directionalLight2, "castShadow")
    .name("Cast Shadow")
  directionalLightFolder2
    .add(directionalLight2, "intensity", 0, 10)
    .name("Intensity")
  directionalLightFolder2
    .add(directionalLight2.position, "x", -2000, 2000)
    .name("Position X")
  directionalLightFolder2
    .add(directionalLight2.position, "y", 0, 3000)
    .name("Position Y")
  directionalLightFolder2
    .add(directionalLight2.position, "z", -2000, 2000)
    .name("Position Z")
  directionalLightFolder2
    .add(directionalLight2.shadow.camera, "near", 0.1, 3000)
    .name("Shadow Near")
    .onChange(() => {
      directionalLight2.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder2
    .add(directionalLight2.shadow.camera, "far", 0.1, 5000)
    .name("Shadow Far")
    .onChange(() => {
      directionalLight2.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder2
    .add(directionalLight2.shadow.camera, "top", -3000, 3000)
    .name("Shadow Top")
    .onChange(() => {
      directionalLight2.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder2
    .add(directionalLight2.shadow.camera, "bottom", -3000, 3000)
    .name("Shadow Bottom")
    .onChange(() => {
      directionalLight2.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder2
    .add(directionalLight2.shadow.camera, "left", -3000, 3000)
    .name("Shadow Left")
    .onChange(() => {
      directionalLight2.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder2
    .add(directionalLight2.shadow.camera, "right", -3000, 3000)
    .name("Shadow Right")
    .onChange(() => {
      directionalLight2.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder2
    .add(directionalLight2.shadow, "bias", -1, 1)
    .name("Shadow Bias")
    .step(0.001)
    .onChange(() => {
      directionalLight2.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder2
    .add(directionalLight2.shadow.mapSize, "width", 512, 8192)
    .name("S-Map Width")
    .onChange(() => {
      directionalLight2.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder2
    .add(directionalLight2.shadow.mapSize, "height", 512, 8192)
    .name("S-Map Height")
    .onChange(() => {
      directionalLight2.shadow.camera.updateProjectionMatrix()
    })
  directionalLightFolder2
    .addColor({ color: directionalLight2.color.getHex() }, "color")
    .name("Light Color")
    .onChange((val) => directionalLight2.color.setHex(val))

  // Spotlight Controls
  const spotlightFolder = gui.addFolder("Spotlight")
  spotlightFolder.add(spotlight, "castShadow").name("Cast Shadow")
  spotlightFolder.add(spotlight, "intensity", 0, 5000).name("Intensity")
  spotlightFolder.add(spotlight.position, "x", -2000, 2000).name("Position X")
  spotlightFolder.add(spotlight.position, "y", -1000, 3000).name("Position Y")
  spotlightFolder.add(spotlight.position, "z", -2000, 2000).name("Position Z")
  spotlightFolder.add(spotlight, "distance", 0, 2000).name("Distance")
  spotlightFolder.add(spotlight, "angle", 0, Math.PI / 2).name("Angle")
  spotlightFolder.add(spotlight, "penumbra", 0, 1).name("Penumbra")
  spotlightFolder.add(spotlight, "decay", 0, 2).name("Decay")
  spotlightFolder
    .addColor({ color: spotlight.color.getHex() }, "color")
    .name("Light Color")
    .onChange((val) => spotlight.color.setHex(val))

  // Point Light 1 Controls
  const pointLight1Folder = gui.addFolder("Red Point Light")
  pointLight1Folder.add(pointLight1, "castShadow").name("Cast Shadow")
  pointLight1Folder.add(pointLight1, "intensity", 0, 100000).name("Intensity")
  pointLight1Folder
    .add(pointLight1.position, "x", -2000, 2000)
    .name("Position X")
  pointLight1Folder
    .add(pointLight1.position, "y", -1000, 3000)
    .name("Position Y")
  pointLight1Folder
    .add(pointLight1.position, "z", -2000, 2000)
    .name("Position Z")
  pointLight1Folder
    .addColor({ color: pointLight1.color.getHex() }, "color")
    .name("Light Color")
    .onChange((val) => pointLight1.color.setHex(val))

  // Point Light 2 Controls
  const pointLight2Folder = gui.addFolder("Green Point Light")
  pointLight2Folder.add(pointLight2, "castShadow").name("Cast Shadow")
  pointLight2Folder.add(pointLight2, "intensity", 0, 100000).name("Intensity")
  pointLight2Folder
    .add(pointLight2.position, "x", -2000, 2000)
    .name("Position X")
  pointLight2Folder
    .add(pointLight2.position, "y", -1000, 3000)
    .name("Position Y")
  pointLight2Folder
    .add(pointLight2.position, "z", -2000, 2000)
    .name("Position Z")
  pointLight2Folder
    .addColor({ color: pointLight2.color.getHex() }, "color")
    .name("Light Color")
    .onChange((val) => pointLight2.color.setHex(val))

  // ANIMATIONS
  const animationFolder = gui.addFolder("Animations")

  // Create dropdown for animations
  const animationNames = animations.map((animation) => animation.name)
  const animationController = animationFolder.add(
    { animation: currentAnimation },
    "animation",
    animationNames
  )

  animationController.onChange((selectedAnimation) => {
    // Switch to selected animation
    switchAnimation(selectedAnimation)
  })

  const transformFolder = gui.addFolder("Transform")

  // Scale controls
  transformFolder
    .add(modelTransform, "scale", 0, 500)
    .name("Scale")
    .onChange(() => {
      modelTransform.scaleX = modelTransform.scale
      modelTransform.scaleY = modelTransform.scale
      modelTransform.scaleZ = modelTransform.scale
      updateModelTransform(model)
    })
  transformFolder
    .add(modelTransform, "scaleX", 0, 500)
    .name("Scale X")
    .onChange(() => updateModelTransform(model))
  transformFolder
    .add(modelTransform, "scaleY", 0, 500)
    .name("Scale Y")
    .onChange(() => updateModelTransform(model))
  transformFolder
    .add(modelTransform, "scaleZ", 0, 500)
    .name("Scale Z")
    .onChange(() => updateModelTransform(model))

  // Position controls
  transformFolder
    .add(modelTransform, "posX", -1000, 1000)
    .name("Position X")
    .onChange(() => updateModelTransform(model))
  transformFolder
    .add(modelTransform, "posY", -500, 500)
    .name("Position Y")
    .onChange(() => updateModelTransform(model))
  transformFolder
    .add(modelTransform, "posZ", -1000, 1000)
    .name("Position Z")
    .onChange(() => updateModelTransform(model))

  // Rotation controls
  transformFolder
    .add(modelTransform, "rotX", -Math.PI, Math.PI)
    .name("Rotation X")
    .onChange(() => updateModelTransform(model))
  transformFolder
    .add(modelTransform, "rotY", -Math.PI, Math.PI)
    .name("Rotation Y")
    .onChange(() => updateModelTransform(model))
  transformFolder
    .add(modelTransform, "rotZ", -Math.PI, Math.PI)
    .name("Rotation Z")
    .onChange(() => updateModelTransform(model))

  const shadowFolder = gui.addFolder("shader shadow")
  shadowFolder.open()

  shadowFolder.add(state.shadow, "blur", 0, 15, 0.1)
  shadowFolder.add(state.shadow, "darkness", 1, 5, 0.1).onChange(function () {
    depthMaterial.userData.darkness.value = state.shadow.darkness
  })
  shadowFolder.add(state.shadow, "opacity", 0, 1, 0.01).onChange(function () {
    plane.material.opacity = state.shadow.opacity
  })
}

function updateModelTransform(model) {
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
}

function switchAnimation(animationName) {
  if (activeAction) {
    activeAction.stop() // Stop the current animation
  }
  const selectedAnimation = animations.find(
    (clip) => clip.name === animationName
  )
  activeAction = mixer.clipAction(selectedAnimation)
  activeAction.play()
}
export default addGUI
