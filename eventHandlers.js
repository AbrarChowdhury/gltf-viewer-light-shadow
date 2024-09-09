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
  }
}

window.addEventListener("mousedown", onMouseDown)
function onMouseDown(event) {
  if (event.button === 1) {
    middleMouseDown = !middleMouseDown
  }
}

export { onWindowResize, onKeyDown, onMouseDown }
