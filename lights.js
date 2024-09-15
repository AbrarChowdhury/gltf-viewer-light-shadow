import * as THREE from "three";
import { ShadowMapViewer } from "three/addons/utils/ShadowMapViewer.js";

const SHADOW_MAP_WIDTH = 4096,
  SHADOW_MAP_HEIGHT = 4096;


function addLights(scene) {
    // AMBIENT LIGHT
    ambient = new THREE.AmbientLight(0xfffdfd, 1);
    scene.add(ambient);
  
    // DIRECTIONAL LIGHT
    directionalLight = new THREE.DirectionalLight(0xddebff, 2.7);
    directionalLight.position.set(-438, 1400, 620);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 2000;
    directionalLight.shadow.camera.bottom = -2000;
    directionalLight.shadow.camera.left = -2000;
    directionalLight.shadow.camera.right = 2000;
    directionalLight.shadow.camera.near = 1200;
    directionalLight.shadow.camera.far = 2500;
    directionalLight.shadow.bias = -0.01;
    directionalLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    directionalLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(directionalLight);

    // DIRECTIONAL LIGHT
    directionalLight2 = new THREE.DirectionalLight(0xddebff, 2.7);
    directionalLight2.position.set(438, 1400, 620);
    directionalLight2.castShadow = true;
    directionalLight2.shadow.camera.top = 2000;
    directionalLight2.shadow.camera.bottom = -2000;
    directionalLight2.shadow.camera.left = -2000;
    directionalLight2.shadow.camera.right = 2000;
    directionalLight2.shadow.camera.near = 1200;
    directionalLight2.shadow.camera.far = 2500;
    directionalLight2.shadow.bias = -0.01;
    directionalLight2.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    directionalLight2.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(directionalLight2);
  
    // POINT LIGHT 1 (Red)
    pointLight1 = new THREE.PointLight(0xff0000, 1, 50000);
    pointLight1.position.set(150, 46, 400);
    pointLight1.castShadow = false;
    pointLight1.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    pointLight1.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(pointLight1);
  
    // POINT LIGHT 2 (Green)
    pointLight2 = new THREE.PointLight(0x00ff00, 1, 50000);
    pointLight2.position.set(35, 46, 400);
    pointLight2.castShadow = false;
    pointLight2.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    pointLight2.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(pointLight2);
  
    // SPOTLIGHT (Blue)
    spotlight = new THREE.SpotLight(0x0000ff, 2500, 1000, 0.59, 0.2, 0);
    spotlight.position.set(0, 559, 0);
    spotlight.castShadow = false;
    spotlight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotlight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(spotlight);
  
    function addLightHelpers() {
      scene.traverse((child) => {
        if (child.isDirectionalLight) {
          const helper = new THREE.DirectionalLightHelper(child, 5);
          helper.isLightHelper = true;
          scene.add(helper);
        } else if (child.isPointLight) {
          const helper = new THREE.PointLightHelper(child, 5);
          helper.isLightHelper = true;
          scene.add(helper);
        } else if (child.isSpotLight) {
          const helper = new THREE.SpotLightHelper(child);
          helper.isLightHelper = true;
          scene.add(helper);
        }
      });
    }
    
    function toggleHelpers() {
        scene.traverse((child) => {
            if (child.isLightHelper) {
                child.visible = true;
            }
        });
    }
    
    addLightHelpers();
    toggleHelpers();
  }


  function createHUD() {
    lightShadowMapViewer = new ShadowMapViewer(directionalLight)
    lightShadowMapViewer.position.x = 10
    lightShadowMapViewer.position.y = SCREEN_HEIGHT - SHADOW_MAP_HEIGHT / 4 - 10
    lightShadowMapViewer.size.width = SHADOW_MAP_WIDTH / 4
    lightShadowMapViewer.size.height = SHADOW_MAP_HEIGHT / 4
    lightShadowMapViewer.update()
  }
  export {addLights, createHUD}