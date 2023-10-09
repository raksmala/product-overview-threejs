import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
ambientLight.position.set(2, 2, 2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
directionalLight.position.set(0.7, -0.5, 0)
directionalLight.castShadow = true
scene.add(directionalLight)

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.2)
directionalLight2.position.set(-0.7, -0.5, 0)
directionalLight2.castShadow = true
scene.add(directionalLight2)

/**
 * Object (Custom 3D Model)
 */
const loader = new GLTFLoader()
let customModel

loader.load('/assets/cgaxis_airpods_max_silver_blender.gltf', (gltf) => {
    customModel = gltf.scene
    
    // Constants for materials
    const SIDES_MATERIAL = new THREE.MeshStandardMaterial({
        color: 0xd4d5d4,
        metalness: 0.5,
        roughness: 0.1
    });

    const CHROME_MATERIAL = new THREE.MeshStandardMaterial({
        color: 0xdcdbd7,
        metalness: 0.8,
        roughness: 0.1
    });

    // Traverse through the model and apply materials based on object names or other criteria
    customModel.traverse((child) => {
        if (child.isMesh) {
            // Check if the mesh belongs to the ear sides
            if (child.name === 'airpods_max_silver_sides') {
                child.material = SIDES_MATERIAL;
                child.castShadow = true;
                child.receiveShadow = true;
            } else if (child.name === 'airpods_max_silver_chrome') {
                child.material = CHROME_MATERIAL;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        }
    });

    // Scale the model up by a factor (e.g., 10)
    const scaleFactor = 10
    customModel.scale.set(scaleFactor, scaleFactor, scaleFactor)

    // Set the model's position if needed
    customModel.position.set(0, 0, 0)

    customModel.castShadow = true
    customModel.receiveShadow = true
    scene.add(customModel)
});

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -2
camera.position.y = 2
camera.position.z = -2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false;  // Disable zooming in and out
controls.enablePan = false;   // Disable panning (dragging)
controls.target.set(0, 2, 0) // Set the target to the center of the scene

/**
 * Renderer with Shadows
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true // Set alpha to true for a transparent background
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.setClearColor(0x000000, 0); // The default

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Rotate the model around its Y-axis
    if (customModel) {
        customModel.rotation.y = elapsedTime * 0.2; // Adjust the rotation speed as needed
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()