import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
    case 32: // Spacebar key
      middleMouseDown = !middleMouseDown
      break
    case 67: // C key to toggle controls
      toggleControls();
      console.log("C key pressed, toggling controls");
      break;
  }
}

window.addEventListener("mousedown", onMouseDown)
function onMouseDown(event) {
  if (event.button === 1) {
    middleMouseDown = !middleMouseDown
  }
}


function toggleControls() {
  if (useOrbitControls) {
    // Switch to FirstPersonControls
    controls.dispose(); 
    controls = new FirstPersonControls(camera, renderer.domElement);
    controls.lookSpeed = 0.02;
    controls.movementSpeed = 100;
    controls.lookVertical = true;
    controls.lookAt(scene.position);
  } else {
    // Switch back to OrbitControls
    controls.dispose(); 
    controls = new OrbitControls(camera, renderer.domElement);
  }
  useOrbitControls = !useOrbitControls; 
}
export { onWindowResize, onKeyDown, onMouseDown }
