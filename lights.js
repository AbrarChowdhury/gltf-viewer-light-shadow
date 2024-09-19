import * as THREE from "three";
import { ShadowMapViewer } from "three/addons/utils/ShadowMapViewer.js";

const lightHelpers = []


function addLights(scene) {
    // AMBIENT LIGHT
    ambient = new THREE.AmbientLight(0xfff5df, 4);
    scene.add(ambient);
  
    // DIRECTIONAL LIGHT
    directionalLight = new THREE.DirectionalLight(0xddebff, 1.5);
    directionalLight.position.set(-720, 750, 620);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 2000;
    directionalLight.shadow.camera.bottom = -2000;
    directionalLight.shadow.camera.left = -2000;
    directionalLight.shadow.camera.right = 2000;
    directionalLight.shadow.camera.near = 1000;
    directionalLight.shadow.camera.far = 2500;
    directionalLight.shadow.bias = -0.01;
    directionalLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    directionalLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(directionalLight);
    const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    dirLightHelper.isLightHelper = true;
    lightHelpers.push(dirLightHelper)
    scene.add(dirLightHelper)
    
    // DIRECTIONAL LIGHT
    directionalLight2 = new THREE.DirectionalLight(0xddebff, 0.5);
    directionalLight2.position.set(400, 1000, 350);
    directionalLight2.castShadow = true;
    directionalLight2.shadow.camera.top = 2000;
    directionalLight2.shadow.camera.bottom = -2000;
    directionalLight2.shadow.camera.left = -2000;
    directionalLight2.shadow.camera.right = 2000;
    directionalLight2.shadow.camera.near = 700;
    directionalLight2.shadow.camera.far = 2500;
    directionalLight2.shadow.bias = -0.01;
    directionalLight2.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    directionalLight2.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(directionalLight2);
    const dirLightHelper2 = new THREE.DirectionalLightHelper(directionalLight2, 5);
    dirLightHelper2.isLightHelper = true;
    lightHelpers.push(dirLightHelper2)
    scene.add(dirLightHelper2)
  
    // POINT LIGHT 1 (Red)
    pointLight1 = new THREE.PointLight(0xff0000, 1, 50000);
    pointLight1.position.set(150, 46, 400);
    pointLight1.castShadow = false;
    pointLight1.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    pointLight1.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(pointLight1);
    const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 5);
    pointLightHelper1.isLightHelper = true;
    lightHelpers.push(pointLightHelper1)
    scene.add(pointLightHelper1)
  
    // POINT LIGHT 2 (Green)
    pointLight2 = new THREE.PointLight(0x00ff00, 1, 50000);
    pointLight2.position.set(35, 46, 400);
    pointLight2.castShadow = false;
    pointLight2.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    pointLight2.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(pointLight2);
    const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 5);
    pointLightHelper2.isLightHelper = true;
    lightHelpers.push(pointLightHelper2)
    scene.add(pointLightHelper2)
  
    // SPOTLIGHT
    spotlight = new THREE.SpotLight(0xffffff, 2, 2000, 0.59, 0.2, 0);
    spotlight.position.set(-650, 520, -1200);
    spotlight.castShadow = false;
    spotlight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotlight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(spotlight);
    const spotLightHelper = new THREE.SpotLightHelper(spotlight, 5);
    spotLightHelper.isLightHelper = true;
    lightHelpers.push(spotLightHelper)
    scene.add(spotLightHelper)
    
    function toggleHelpers() {
        scene.traverse((child) => {
            if (child.isLightHelper) {
                child.visible = true;
            }
        });
    }
    
    // addLightHelpers();
    toggleHelpers();
  }

  function updateLightHelpers(){
    lightHelpers.forEach(helper=>helper.update())
  }
  function createHUD() {
    lightShadowMapViewer = new ShadowMapViewer(directionalLight)
    lightShadowMapViewer.position.x = 10
    lightShadowMapViewer.position.y = SCREEN_HEIGHT - SHADOW_MAP_HEIGHT / 4 - 10
    lightShadowMapViewer.size.width = SHADOW_MAP_WIDTH / 4
    lightShadowMapViewer.size.height = SHADOW_MAP_HEIGHT / 4
    lightShadowMapViewer.update()
  }
  export {addLights, createHUD, updateLightHelpers}