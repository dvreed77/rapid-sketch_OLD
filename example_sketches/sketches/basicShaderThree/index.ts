import { canvasSketch } from "rapid-sketch";
import { color, random, utils, drawTools } from "rapid-sketch-utils";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { vertexShader, fragmentShader } from "./shader";

const cWidth = 800;

canvasSketch(
  ({ context, width: W, height: H, pixelRatio }) => {
    // Initialize the WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      context,
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(W, H);
    renderer.setClearColor("hsl(0, 0%, 95%)", 1);

    // Initialize the scenes
    const scene = new THREE.Scene();

    // Initialize the camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Create the plane geometry
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    // Define the shader uniforms
    const uniforms = {
      u_time: {
        type: "f",
        value: 0.0,
      },
      u_frame: {
        type: "f",
        value: 0.0,
      },
      u_resolution: {
        type: "v2",
        value: new THREE.Vector2(
          window.innerWidth,
          window.innerHeight
        ).multiplyScalar(window.devicePixelRatio),
      },
      u_texture: {
        type: "t",
        value: null,
      },
    };

    // Create the shader material
    const material = new THREE.ShaderMaterial({
      // uniforms: uniforms,
      vertexShader,
      fragmentShader,
    });

    // Create the meshes and add them to the scenes
    var mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    renderer.render(scene, camera);
    return ({ frame, time }) => {};
  },
  {
    dimensions: [cWidth, cWidth],
    name: "sketch1",
    context: "webgl",
    // animation: true,
  }
);
