import { canvasSketch } from "rapid-sketch";
import { random, color } from "rapid-sketch-utils";
import * as THREE from "three";
import SimplexNoise from "simplex-noise";
import { RedIntegerFormat } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

canvasSketch(
  ({ context, width, height, viewportWidth, viewportHeight, pixelRatio }) => {
    const renderer = new THREE.WebGLRenderer({
      context,
    });

    renderer.setClearColor("white");

    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(0, 0, -4);
    camera.lookAt(new THREE.Vector3());

    const controls = new OrbitControls(camera, context.canvas);

    const scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(1, 32, 16);

    const material = new THREE.MeshBasicMaterial({
      color: "red",
      wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(viewportWidth, viewportHeight);

    camera.updateProjectionMatrix();
    controls.addEventListener("change", () => renderer.render(scene, camera));
    return ({ frame }) => {
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
  },
  {
    dimensions: [800, 800],
    name: "sketch1",
    context: "webgl",
    animation: true,
    totalFrames: 500,
  }
);
