// Oscar Saharoy 2022

import fragmentShader from './shader.glsl.js';
import * as THREE from './three.module.js';

const canvas = document.querySelector('#shader-canvas');
const renderer = new THREE.WebGLRenderer({canvas: canvas, preserveDrawingBuffer: true });
renderer.autoClearColor = false;

const camera = new THREE.OrthographicCamera(
    -1, // left
     1, // right
     1, // top
    -1, // bottom
    -1, // near,
     1, // far
);

const scene = new THREE.Scene();
const plane = new THREE.PlaneGeometry(2, 2);
const dpr   = window.devicePixelRatio;

const uniforms = {
    uTime:          { value: 0 },
    uResolution:    { value: new THREE.Vector2() },
};

const material = new THREE.ShaderMaterial({
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    transparent: true,
    precision: "highp",
});

scene.add(new THREE.Mesh(plane, material));


function resizeRendererToDisplaySize( renderer ) {

    const width   = canvas.clientWidth;
    const height  = canvas.clientHeight;

    renderer.setSize( width*dpr, height*dpr, false );
    uniforms.uResolution.value.set( width * dpr, height * dpr );
	renderer.render(scene, camera);
}

new ResizeObserver( () => resizeRendererToDisplaySize(renderer) ).observe( canvas );


function render( time ) {

    renderer.render(scene, camera);

    uniforms.uTime.value = time * 0.001;

    requestAnimationFrame(render);
}

requestAnimationFrame(render);


function download() {

    const link = document.createElement("a");
    
    link.href = renderer.domElement.toDataURL( "image/jpeg", 0.92 );
    link.download = "image.jpg";
    link.click();
}

