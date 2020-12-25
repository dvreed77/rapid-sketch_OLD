import { canvasSketch } from "rapid-sketch";
import { random } from "rapid-sketch-utils";
import * as THREE from "three";
import * as d3 from "d3";
import palettes from "nice-color-palettes";
import SimplexNoise from "simplex-noise";

const simplex = new SimplexNoise();
// console.log(randomNoise);

const randomGaussian = random.randomGaussian();

canvasSketch(
  ({ context, width, height }) => {
    console.log("init");
    const renderer = new THREE.WebGLRenderer({
      context,
    });

    const palette = random.randomPick(palettes);

    // WebGL background color
    renderer.setClearColor("hsl(0, 0%, 95%)", 1);

    const aspect = width / height;
    const zoom = 1.85;
    // Setup a camera, we will update its settings on resize
    const camera = new THREE.OrthographicCamera(
      -zoom * aspect,
      zoom * aspect,
      zoom,
      -zoom,
      -100,
      100
    );

    // Setup your scene
    const scene = new THREE.Scene();

    // Get a palette for our scene
    // const palette = random.pick(palettes);

    // Randomize mesh attributes
    const randomizeMesh = (mesh) => {
      // Choose a random point in a 3D volume between -1..1
      const point = new THREE.Vector3(
        Math.random() - 1,
        Math.random() - 1,
        Math.random() - 1
      );

      mesh.position.copy(point);
      mesh.originalPosition = mesh.position.clone();

      // Choose a color for the mesh material
      mesh.material.color.set(random.randomPick(palette));

      // Randomly scale each axis
      mesh.scale.set(randomGaussian(), randomGaussian(), randomGaussian());

      // Do more random scaling on each axis
      if (random.randomChance(0.5)) mesh.scale.x *= randomGaussian();
      if (random.randomChance(0.5)) mesh.scale.y *= randomGaussian();
      if (random.randomChance(0.5)) mesh.scale.z *= randomGaussian();

      // Further scale each object
      mesh.scale.multiplyScalar(randomGaussian() * 0.25);
    };

    // A group that will hold all of our cubes
    const container = new THREE.Group();

    // Re-use the same Geometry across all our cubes
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // The # of cubes to create
    const chunks = 50;

    // Create each cube and return a THREE.Mesh
    const meshes = Array.from(new Array(chunks)).map(() => {
      // Basic "unlit" material with no depth
      const material = new THREE.MeshBasicMaterial({
        // Avoid popping
        depthTest: false,
        color: "blue",
      });

      // Create the mesh
      const mesh = new THREE.Mesh(geometry, material);

      // Randomize it
      randomizeMesh(mesh);

      return {
        originalPosition: mesh.position.clone(),
        mesh,
      };
    });

    // Add meshes to the group
    meshes.forEach((m) => container.add(m.mesh));

    // Then add the group to the scene
    scene.add(container);

    renderer.setPixelRatio(2);
    renderer.setSize(width, height);

    camera.position.set(zoom, zoom, zoom);
    camera.lookAt(1, 1, 0);

    // Update camera properties
    camera.updateProjectionMatrix();

    return ({ frame }) => {
      meshes.forEach(({ originalPosition, mesh }) => {
        const f = 0.5;
        mesh.position.x =
          originalPosition.x +
          0.25 *
            simplex.noise4D(
              originalPosition.x * f,
              originalPosition.y * f,
              originalPosition.z * f,
              frame * 0.01
            );
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
