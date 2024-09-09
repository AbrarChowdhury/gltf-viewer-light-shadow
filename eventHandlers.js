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

  function onMouseDown(event) {
    if (event.button === 1) {
      console.log("mouse D")
      middleMouseDown = !middleMouseDown
    }
  }

  export {onWindowResize, onKeyDown, onMouseDown}