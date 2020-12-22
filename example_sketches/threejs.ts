import { canvasSketch } from "rapid-sketch";
import * as THREE from "three";

canvasSketch(
  ({ context, width, height }) => {
    const renderer = new THREE.WebGLRenderer({
      context,
    });
    // WebGL background color
    renderer.setClearColor("#fff", 1);

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(0, 0, -4);
    camera.lookAt(new THREE.Vector3());

    // Setup your scene
    const scene = new THREE.Scene();

    // Setup a geometry
    const geometry = new THREE.SphereGeometry(1, 32, 16);

    // Setup a material
    const material = new THREE.MeshBasicMaterial({
      color: "red",
      wireframe: true,
    });

    // Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer.setPixelRatio(1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // renderer.render(scene, camera);

    return ({ frame }) => {
      // console.log("AAAAss", a);

      mesh.rotation.x = 0.01 * frame;
      mesh.rotation.y = 0.01 * frame;
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
