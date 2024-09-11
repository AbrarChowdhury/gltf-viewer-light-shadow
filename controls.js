import { GUI } from "dat.gui";
function addGUI() {
  const gui = new GUI()
  // Directional Light Controls
  const directionalLightFolder = gui.addFolder("Directional Light")
  directionalLightFolder.add(directionalLight, "visible").name("Toggle Light")
  directionalLightFolder.add(directionalLight, "castShadow").name("Cast Shadow")
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
    .add(directionalLight, "intensity", 0, 10)
    .name("Intensity")
  directionalLightFolder
    .add(directionalLight.shadow.camera, "near", 0.1, 3000)
    .name("Shadow Near")
  directionalLightFolder
    .add(directionalLight.shadow.camera, "far", 0.1, 5000)
    .name("Shadow Far")
  directionalLightFolder
    .add(directionalLight.shadow.camera, "top", -3000, 3000)
    .name("Shadow Top")
  directionalLightFolder
    .add(directionalLight.shadow.camera, "bottom", -3000, 3000)
    .name("Shadow Bottom")
  directionalLightFolder
    .add(directionalLight.shadow.camera, "left", -3000, 3000)
    .name("Shadow Left")
  directionalLightFolder
    .add(directionalLight.shadow.camera, "right", -3000, 3000)
    .name("Shadow Right")
  directionalLightFolder
    .add(directionalLight.shadow, "bias", -0.01, 0.01)
    .name("Shadow Bias")
  directionalLightFolder
    .add(directionalLight.shadow.mapSize, "width", 512, 8192)
    .name("Shadow Map Width")
    .onChange(updateShadowMap)
  directionalLightFolder
    .add(directionalLight.shadow.mapSize, "height", 512, 8192)
    .name("Shadow Map Height")
    .onChange(updateShadowMap)
  directionalLightFolder
    .addColor({ color: directionalLight.color.getHex() }, "color")
    .name("Light Color")
    .onChange((val) => directionalLight.color.setHex(val))

  // Point Light 1 Controls
  const pointLight1Folder = gui.addFolder("Red Point Light")
  pointLight1Folder.add(pointLight1, "castShadow").name("Cast Shadow")
  pointLight1Folder
    .add(pointLight1.position, "x", -2000, 2000)
    .name("Position X")
  pointLight1Folder
    .add(pointLight1.position, "y", -1000, 3000)
    .name("Position Y")
  pointLight1Folder
    .add(pointLight1.position, "z", -2000, 2000)
    .name("Position Z")
  pointLight1Folder.add(pointLight1, "intensity", 0, 100000).name("Intensity")
  pointLight1Folder
    .addColor({ color: pointLight1.color.getHex() }, "color")
    .name("Light Color")

  // Point Light 2 Controls
  const pointLight2Folder = gui.addFolder("Green Point Light")
  pointLight2Folder.add(pointLight2, "castShadow").name("Cast Shadow")
  pointLight2Folder
    .add(pointLight2.position, "x", -2000, 2000)
    .name("Position X")
  pointLight2Folder
    .add(pointLight2.position, "y", -1000, 3000)
    .name("Position Y")
  pointLight2Folder
    .add(pointLight2.position, "z", -2000, 2000)
    .name("Position Z")
  pointLight2Folder.add(pointLight2, "intensity", 0, 100000).name("Intensity")
  pointLight2Folder
    .addColor({ color: pointLight2.color.getHex() }, "color")
    .name("Light Color")

  // Spotlight Controls
  const spotlightFolder = gui.addFolder("Blue Spotlight")
  spotlightFolder.add(spotlight, "castShadow").name("Cast Shadow")
  spotlightFolder.add(spotlight.position, "x", -2000, 2000).name("Position X")
  spotlightFolder.add(spotlight.position, "y", -1000, 3000).name("Position Y")
  spotlightFolder.add(spotlight.position, "z", -2000, 2000).name("Position Z")
  spotlightFolder.add(spotlight, "intensity", 0, 5000).name("Intensity")
  spotlightFolder.add(spotlight, "distance", 0, 2000).name("Distance")
  spotlightFolder.add(spotlight, "angle", 0, Math.PI / 2).name("Angle")
  spotlightFolder.add(spotlight, "penumbra", 0, 1).name("Penumbra")
  spotlightFolder.add(spotlight, "decay", 0, 2).name("Decay")
  spotlightFolder
    .addColor({ color: spotlight.color.getHex() }, "color")
    .name("Light Color")

  // Ambient Light Controls
  const ambientFolder = gui.addFolder("Ambient Light")
  ambientFolder.add(ambient, "visible").name("Toggle Light")
  ambientFolder.add(ambient, "intensity", 0, 10).name("Intensity")
  ambientFolder
    .addColor({ color: ambient.color.getHex() }, "color")
    .name("Light Color")
    .onChange((val) => ambient.color.setHex(val))

  // // The model
  // const modelFolder = gui.addFolder("Model")
  // console.log("gui: ", lady)
  // modelFolder.add(lady.rotation, "z", 0, Math.PI * 2, 0.1).name("Z Rotation")
}
function updateShadowMap() {
  directionalLight.shadow.mapSize.width = SHADOW_MAP_WIDTH
  directionalLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT
  directionalLight.shadow.map.dispose() // Dispose previous shadow map
  directionalLight.shadow.map = null // Set map to null to trigger reallocation
}
export default addGUI