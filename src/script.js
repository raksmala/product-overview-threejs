import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Constants for materials
const SILVER_MATERIAL = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.5,
    roughness: 0.2
});

const SILVER_METAL_MATERIAL = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.8,
    roughness: 0.2
});

// Canvas and sizes
const canvas = document.querySelector('canvas.webgl');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Scene
const scene = new THREE.Scene();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
ambientLight.position.set(2, 2, 2);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight1.position.set(0.7, -0.5, 0);
directionalLight1.castShadow = true;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight2.position.set(-0.7, -0.5, 0);
directionalLight2.castShadow = true;
scene.add(directionalLight2);

// Camera and controls setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-2, 2, -2);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.target.set(0, 2, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// Load 3D model and apply materials
const loader = new GLTFLoader();
let customModel;

loader.load('/assets/cgaxis_airpods_max_silver_blender2.gltf', (gltf) => {
    customModel = gltf.scene;

    customModel.traverse((child) => {
        if (child.isMesh) {
            if (child.name === 'airpods_max_silver_sides') {
                child.material = SILVER_MATERIAL;
                child.castShadow = true;
                child.receiveShadow = true;
            } else if (child.name === 'airpods_max_silver_chrome') {
                child.material = SILVER_METAL_MATERIAL;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        }
    });

    const scaleFactor = 10;
    customModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
    customModel.position.set(0, 0, 0);
    customModel.castShadow = true;
    customModel.receiveShadow = true;
    scene.add(customModel);

    // Start animation after model is loaded
    animate();
});

// Handle window resize
function resizeRendererToDisplaySize() {
    const canvas = renderer.domElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    return needResize;
}

// Animation function
function animate() {
    if (resizeRendererToDisplaySize()) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    // Rotate the model around its Y-axis
    if (customModel) {
        customModel.rotation.y += 0.005; // Adjust the rotation speed as needed
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}