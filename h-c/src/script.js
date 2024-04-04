import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import GSAP from 'gsap'
import { Plane } from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';


// Texture loader
const textureLoader = new THREE.TextureLoader()

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ color: 0x1F51FF })


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Lights
 */
 const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
 scene.add(ambientLight)
 
 const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
 directionalLight.castShadow = true
 directionalLight.shadow.mapSize.set(1024, 1024)
 directionalLight.shadow.camera.far = 15
 directionalLight.shadow.camera.left = - 7
 directionalLight.shadow.camera.top = 7
 directionalLight.shadow.camera.right = 7
 directionalLight.shadow.camera.bottom = - 7
 directionalLight.position.set(5, 5, 5)
 scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', ()=>{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick',()=>{

    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement){       
        if(canvas.requestFullscreen){
            canvas.requestFullscreen()
        }else if (canvas.webkitRequestFullscreen){
            canvas.webkitRequestFullscreen()
        } 
    }else{
        if(document.exitFullscreen){
            document.exitFullscreen()
        } else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen()
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
camera.position.set(-4.6420, 20.9263, -29.4932)
scene.add(camera)

// Load the environment map
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
    '/px.png',
    '/nx.png',
    '/py.png',
    '/ny.png',
    '/pz.png',
    '/nz.png'
]);

// Apply the environment map to the scene background
scene.background = environmentMap;


const planeGeometry = new THREE.PlaneGeometry(100, 100); // Width and height of the plane
// Material
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080, // Gray color, adjust as needed
    side: THREE.DoubleSide // Render both sides of the plane
});

// Create the plane mesh
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

// Rotate the plane to make it horizontal
plane.rotation.x = -Math.PI / 2; // Rotates the plane to be flat on the X axis

// Optionally, set the plane's position
plane.position.set(0, 0, 0); // Adjust as needed

// Add the plane to the scene
//scene.add(plane);
// Enable the plane to receive shadows
plane.receiveShadow = true;

// Ensure your directional light casts shadows
directionalLight.castShadow = true;

// You might need to adjust the shadow settings for your light source as well
directionalLight.shadow.mapSize.width = 2048; // Increase for better shadow resolution
directionalLight.shadow.mapSize.height = 2048;

let model = null
/**
 * Model
 */

let position = 0

function displaySecretMessage() {
  // Check if the message is already displayed to avoid duplicates
  if (!document.getElementById('secretMessage')) {
    // Create the message element as an anchor for clickable functionality
    const message = document.createElement('a');
    message.id = 'secretMessage'; // Assign an ID for potential styling or removal
    message.innerText = 'Click Here to Reveal the Secrets!'; // Your message
    message.href = 'https://snake-game-seven-nu.vercel.app/'; // URL to navigate to
    message.style.position = 'fixed'; // Use fixed or absolute as per your layout
    message.style.top = '50%'; // Center vertically
    message.style.left = '50%'; // Center horizontally
    message.style.transform = 'translate(-50%, -50%)'; // Ensure centering is accurate
    message.style.fontSize = '5em'; // Example styling, adjust as needed
    message.style.color = '#00ff00'; // Text color
    message.style.fontFamily = "input-mono", 'monospace';
    message.style.fontWeight = '400';
    message.style.fontStyle= 'normal';
    message.style.textDecoration = 'none'; // Remove default underline of an anchor tag
    document.body.appendChild(message); // Add the message to the document

    // Style for hover effect to underline the text
    message.addEventListener('mouseover', () => {
      message.style.textDecoration = 'underline';
    });

    // Remove underline when not hovered
    message.addEventListener('mouseout', () => {
      message.style.textDecoration = 'none';
    });

    // Prevent default navigation and open the URL in a new tab on click
    message.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent the default anchor behavior
      window.open('https://snake-game-seven-nu.vercel.app/', '_blank'); // Open the URL in a new tab
    });
  }
}


 gltfLoader.load(
    '/models/harmless_communication.glb',
    (gltf) => {
        model = gltf.scene
        model.scale.set (1.5, 1.5, 1.5)
        scene.add(model)

        window.addEventListener('mouseup', function() {
          switch(position){
            case 0:
              moveCamera( 50, 30, 30)
              //rotateCamera(0, 0.1 , 0)
              position = 1;
              break
            case 1:
              moveCamera(-10, 30, 90)
              //rotateCamera(0, 0.1 , 0)
              position = 2;
              break
            case 2:
              moveCamera(-4, 50, 3.4)
              //rotateCamera(-7.5, 49.9, 3.4)
              position = 3;
              break
            case 3:
              moveCamera( -7, 20, -15)
              //rotateCamera(0, 0.1 , 0)
              position = 4;
              break
            case 4:
              rotateCamera(0, 90 * Math.PI , 0.1)
              position = 5;
              break
            case 5:
              // Call a function to display the message
              displaySecretMessage();
              break;
          }
      })
    }
)

function moveCamera(x, y, z){
  gsap.to(camera.position, {
    x,
    y,
    z,
    duration:3
  })
}

function rotateCamera(x, y, z){
  gsap.to(camera.rotation, {
    x,
    y,
    z,
    duration:3
  })
}

scene.fog = new THREE.FogExp2(0xDFE9F3, 0.009);


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enabled= false
//controls.enableDamping = true

/**
 * Renderer
 */
 const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()