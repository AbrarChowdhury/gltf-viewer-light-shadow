import addGUI from "./controls"
import * as THREE from "three"

function loadModel(gltf) {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
        node.frustumCulled = false
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
    if(!newGltfLoaded){
      model.getObjectByName("Ch22_Hair").material.roughness=0.7
      model.getObjectByName("Ch22_Body").material.roughness=50
    }
    scene.add(model)
  
    // Add animations if present
    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model)
      animations = gltf.animations // Store animations
  
      // Choose a random animation from the list
      const randomIndex = Math.floor(Math.random() * animations.length)
      const randomAnimation = animations[newGltfLoaded?randomIndex:1]
  
      // Play the randomly selected animation
      activeAction = mixer.clipAction(randomAnimation)
      activeAction.play()
  
      // Store the name of the current animation
      currentAnimation = randomAnimation.name
    }
    newGltfLoaded = true
    addGUI()
  }

  function blurShadow(amount) {
    blurPlane.visible = true
  
    // blur horizontally and draw in the renderTargetBlur
    blurPlane.material = horizontalBlurMaterial
    blurPlane.material.uniforms.tDiffuse.value = renderTarget.texture
    horizontalBlurMaterial.uniforms.h.value = (amount * 1) / 256
  
    renderer.setRenderTarget(renderTargetBlur)
    renderer.render(blurPlane, shadowCamera)
  
    // blur vertically and draw in the main renderTarget
    blurPlane.material = verticalBlurMaterial
    blurPlane.material.uniforms.tDiffuse.value = renderTargetBlur.texture
    verticalBlurMaterial.uniforms.v.value = (amount * 1) / 256
  
    renderer.setRenderTarget(renderTarget)
    renderer.render(blurPlane, shadowCamera)
  
    blurPlane.visible = false
  }
  

export {loadModel,blurShadow}