import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const subCubes = [];  // Store all sub-cubes for reference

// Create each sub-cube with a colored face for the Rubik's Cube
function createSubCube(x, y, z) {
  const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9); // Smaller than 1 for spacing

  const materials = [
    new THREE.MeshBasicMaterial({ color: 'red' }),
    new THREE.MeshBasicMaterial({ color: 'green' }),
    new THREE.MeshBasicMaterial({ color: 'blue' }),
    new THREE.MeshBasicMaterial({ color: 'yellow' }),
    new THREE.MeshBasicMaterial({ color: 'white' }),
    new THREE.MeshBasicMaterial({ color: 'orange' }),
  ];

  const subCube = new THREE.Mesh(geometry, materials);
  subCube.position.set(x, y, z);
  scene.add(subCube);
  subCubes.push(subCube);
  return subCube;
}

// Create a 3x3x3 grid of sub-cubes
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      createSubCube(x, y, z);
    }
  }
}

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas.threejs'),
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
controls.autoRotate = true

// Rotate layers
function rotateLayer(layerCubes, axis, angle) {
  layerCubes.forEach(cube => {
    cube.position.applyAxisAngle(axis, angle);
    cube.rotateOnAxis(axis, angle);
  });
}

function rotateFrontLayer() {
  const frontLayerCubes = subCubes.filter(cube => cube.position.z > 0.5);
  rotateLayer(frontLayerCubes, new THREE.Vector3(0, 0, 1), Math.PI / 2);
}

function rotateMidLayer() {
  const midLayerCubes = subCubes.filter(cube => cube.position.y > 0.5);
  rotateLayer(midLayerCubes, new THREE.Vector3(0, 1, 0), Math.PI / 2);
}

function rotateBackLayer() {
  const backLayerCubes = subCubes.filter(cube => cube.position.x > 0.5);
  rotateLayer(backLayerCubes, new THREE.Vector3(1, 0, 0), Math.PI / 2);
}

// Variables to store interval IDs
let frontLayerInterval, midLayerInterval, backLayerInterval;

function startSimulation() {
  // Start rotating layers with intervals
  frontLayerInterval = setInterval(rotateFrontLayer, 2000);
  midLayerInterval = setInterval(rotateMidLayer, 1500);
  backLayerInterval = setInterval(rotateBackLayer, 1000);
}

function resetCube() {
  // Clear intervals to stop rotations
  clearInterval(frontLayerInterval);
  clearInterval(midLayerInterval);
  clearInterval(backLayerInterval);
  
  // Reset cube positions and rotations
  subCubes.forEach(cube => {
    cube.position.set(Math.round(cube.position.x), Math.round(cube.position.y), Math.round(cube.position.z));
    cube.rotation.set(0, 0, 0);
  });
}

// Event listeners for buttons
document.getElementById('simulateButton').addEventListener('click', startSimulation);
document.getElementById('resetButton').addEventListener('click', resetCube);

const renderloop = () => {
  controls.update();  
  renderer.render(scene, camera);
  requestAnimationFrame(renderloop);
};

// Start the render loop
renderloop();
