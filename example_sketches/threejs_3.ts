import { canvasSketch } from "rapid-sketch";
import { random, color } from "rapid-sketch-utils";
import * as THREE from "three";
import SimplexNoise from "simplex-noise";

const mainColor = color.Color("red");
const simplex = new SimplexNoise();
const palettes = color.palettes;

const randomGaussian = random.randomGaussian();

const colorMap = {
  "1,0,0": (c) => c.darken(0.5).toString(),
  "0,1,0": (c) => c.lighten(0.3).toString(),
  "0,0,1": (c) => c.toString(),
};

canvasSketch(
  ({ context, width, height, viewportWidth, viewportHeight }) => {
    const renderer = new THREE.WebGLRenderer({
      context,
    });

    // WebGL background color
    renderer.setClearColor("#fff", 1);

    const palette = random.randomPick(palettes);

    const aspect = width / height;
    const zoom = 2;
    // Setup a camera, we will update its settings on resize
    const f = 0.707;
    const camera = new THREE.OrthographicCamera(
      -zoom * f,
      zoom * f,
      zoom * f,
      -zoom * f,
      -100,
      100
    );

    camera.position.set(1, 1, 1);
    camera.lookAt(new THREE.Vector3());

    // Setup your scene
    const scene = new THREE.Scene();

    const directionalLight = new THREE.DirectionalLight("white", 1.1);
    scene.add(directionalLight);

    const light = new THREE.DirectionalLight("white", 1);
    light.position.set(1, 0, 0);
    light.target.position.set(0, 0, 0);
    scene.add(light);
    scene.add(light.target);

    const lightB = new THREE.DirectionalLight("white", 0.9);
    lightB.position.set(0, 0, 1);
    lightB.target.position.set(0, 0, 0);
    scene.add(lightB);
    scene.add(lightB.target);

    // A grid
    // scene.add(
    //   new THREE.GridHelper(2, 10, "hsl(0, 0%, 50%)", "hsl(0, 0%, 70%)")
    // );

    const container = new THREE.Group();
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const meshes = [];

    const rows = 20;
    const dt = 2 / rows;
    console.log(dt);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < rows; j++) {
        const material = new THREE.MeshStandardMaterial({
          // Avoid popping
          depthTest: false,
          color: "blue",
        });

        // Create the mesh
        const mesh = new THREE.Mesh(geometry, material);

        const point = new THREE.Vector3(i * dt, 1, j * dt);

        mesh.position.copy(point);

        // Choose a color for the mesh material
        mesh.material.color.set(random.randomPick(palette));

        // Randomly scale each axis
        mesh.scale.set(dt, dt, dt);
        meshes.push({ mesh, dt: random.randomFloat(0.01, 0.011) });
      }
    }

    // Add meshes to the group
    meshes.forEach((m) => container.add(m.mesh));

    // Then add the group to the scene
    scene.add(container);

    renderer.setPixelRatio(2);
    renderer.setSize(viewportWidth, viewportHeight);

    camera.updateProjectionMatrix();

    return ({ frame }) => {
      // console.log(frame);
      meshes.forEach(({ mesh, dt }) => {
        let ny = mesh.position.y - dt;
        if (ny < -3) {
          ny = 3;
        }
        mesh.position.y = ny;
      });

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
