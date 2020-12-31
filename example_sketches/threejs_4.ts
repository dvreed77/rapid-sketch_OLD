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

    renderer.setClearColor("black");

    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(3, 3, -5);
    camera.lookAt(new THREE.Vector3());

    const controls = new OrbitControls(camera, context.canvas);

    const scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(1, 32, 16);

    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load("assets/earth.jpg", () =>
      renderer.render(scene, camera)
    );
    const moonTexture = loader.load("assets/moon.jpg", () =>
      renderer.render(scene, camera)
    );

    const material = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      map: earthTexture,
    });

    const moonGroup = new THREE.Group();
    const moonMaterial = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      map: moonTexture,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const moonMesh = new THREE.Mesh(geometry, moonMaterial);
    moonMesh.position.set(1.5, 1, 0);
    moonMesh.scale.setScalar(0.25);
    moonGroup.add(moonMesh);

    scene.add(moonGroup);

    const light = new THREE.PointLight("white", 2);
    light.position.set(0, 2, 0);
    scene.add(light);

    scene.add(new THREE.PointLightHelper(light, 0.1));
    scene.add(new THREE.GridHelper(5, 20));
    scene.add(new THREE.AxesHelper(5));

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(viewportWidth, viewportHeight);

    camera.updateProjectionMatrix();

    // renderer.render(scene, camera);
    controls.addEventListener("change", () => renderer.render(scene, camera));
    return ({ frame }) => {
      mesh.rotation.y += 0.01;
      moonMesh.rotation.y += 0.005;
      moonGroup.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
  },
  {
    dimensions: [1080, 1080],
    name: "sketch1",
    context: "webgl",
    animation: true,
    totalFrames: 500,
  }
);
