import * as THREE from "../libs/three.module.js";
import { OrbitControls } from "../libs/OrbitControls.js";
import { VRButton } from "../webxr/VRButton.js";
import { XRControllerModelFactory } from "../webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from "../webxr/XRHandModelFactory.js";
import { BoxLineGeometry } from "../libs/BoxLineGeometry.js";
import { GLTFLoader } from "../libs/GLTFLoader.js";
import { DRACOLoader } from "../libs/DRACOLoader.js";

let container;
let camera, scene, renderer;
let hand1, hand2;
let controller1, controller2;
let controllerGrip1, controllerGrip2;

let room;

const tmpVector1 = new THREE.Vector3();

let controls;

let object;
let grabbingControllers = [];
let grabbing = false;
const scaling = {
  active: false,
  initialDistance: 0,
  object: null,
  initialScale: 1,
  element1: null,
  element2: null
};

init();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x444444);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10
  );
  camera.position.set(0, 1.6, 3);
  controls = new OrbitControls(camera, container);
  controls.target.set(0, 1.6, 0);
  controls.enableDamping = true;
  controls.update();

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(4, 4);
  const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x156289 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Room
  room = new THREE.LineSegments(
    new BoxLineGeometry(6, 6, 6, 10, 10, 10),
    new THREE.LineBasicMaterial({ color: 0x808080 })
  );
  room.geometry.translate(0, 3, 0);
  scene.add(room);

  // Lights
  const hemisphereLight = new THREE.HemisphereLight(0x808080, 0x606060);
  scene.add(hemisphereLight);

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 6, 0);
  light.castShadow = true;
  light.shadow.camera.top = 2;
  light.shadow.camera.bottom = -2;
  light.shadow.camera.right = 2;
  light.shadow.camera.left = -2;
  light.shadow.mapSize.set(2048, 2048);
  scene.add(light);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;

  container.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));

  // Controllers
  controller1 = renderer.xr.getController(0);
  
  scene.add(controller1);

  controller2 = renderer.xr.getController(1);
  scene.add(controller2);

  const controllerModelFactory = new XRControllerModelFactory();
  const handModelFactory = new XRHandModelFactory();

  // Hand1
  controllerGrip1 = renderer.xr.getControllerGrip(0);
  controllerGrip1.add(
    controllerModelFactory.createControllerModel(controllerGrip1)
  );
  controllerGrip1.addEventListener( 'selectstart', onSelectStart );
  controllerGrip1.addEventListener( 'selectend', onSelectEnd );
  scene.add(controllerGrip1);

  hand1 = renderer.xr.getHand(0);
  hand1.addEventListener("pinchstart", onPinchStart);
  hand1.addEventListener("pinchend", onPinchEnd);
  hand1.add(handModelFactory.createHandModel(hand1, "mesh"));
  scene.add(hand1);

  // Hand2
  controllerGrip2 = renderer.xr.getControllerGrip(1);
  controllerGrip2.add(
    controllerModelFactory.createControllerModel(controllerGrip2)
  );
  controllerGrip2.addEventListener( 'selectstart', onSelectStart );
  controllerGrip2.addEventListener( 'selectend', onSelectEnd );
  scene.add(controllerGrip2);

  hand2 = renderer.xr.getHand(1);
  hand2.addEventListener("pinchstart", onPinchStart);
  hand2.addEventListener("pinchend", onPinchEnd);
  hand2.add(handModelFactory.createHandModel(hand2, "mesh"));
  scene.add(hand2);

  window.addEventListener("resize", onWindowResize);
  
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.4.3/"
  );
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    "https://cdn.glitch.me/17bb60ae-af43-49cc-b695-875b21ab0b82%2Fdna.gltf?v=1636364482351",
    function(glb) {
      glb.scene.scale.set(0.3, 0.3, 0.3);
      glb.scene.position.set(0, 1.4, -0.5);
      object = glb.scene;
      scene.add(object);

      animate();
    }
  );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  controls.update();

  if (scaling.active) {
    const indexTip1Pos = scaling.element1.position;
    const indexTip2Pos = scaling.element2.position;
    const distance = indexTip1Pos.distanceTo(indexTip2Pos);
    const newScale = scaling.initialScale * distance / scaling.initialDistance;
    scaling.object.scale.setScalar(newScale);
  }

  renderer.render(scene, camera);
}

function collideObject(indexTip) {
  const indexPos = indexTip.getWorldPosition(tmpVector1);
  const myBox = new THREE.Box3().setFromObject(object);

  if (myBox.containsPoint(indexPos)) {
    return object;
  }
  return null;
}

function onPinchEnd(event) {
  const controller = event.target;
  const id = controller.id;

  const index2 = grabbingControllers.indexOf(id);
  grabbingControllers.splice(index2, 1);

  scaling.active = false;
  scaling.element1 = null;
  scaling.element2 = null;

  if (grabbingControllers.length === 0) {
    scene.attach(object);
    grabbing = false;
  }
}

function onPinchStart(event) {
  const controller = event.target;
  const id = controller.id;
  const indexTip = controller.joints["index-finger-tip"];
  const otherIndexTip = controller === hand1 ? hand2 : hand1;
  const object = collideObject(indexTip);

  if (object && grabbing) {
    grabbingControllers.push(controller.id);
  }

  if (object && !grabbing) {
    indexTip.attach(object);
    grabbing = true;
    grabbingControllers.push(controller.id);
  }

  if (object && grabbingControllers.length === 2) {
    scaling.active = true;
    scaling.object = object;
    scaling.initialScale = object.scale.x;
    scaling.initialDistance = indexTip.position.distanceTo(
      otherIndexTip.joints["index-finger-tip"].position
    );
    
    scaling.element1 = indexTip;
    scaling.element2 = otherIndexTip.joints["index-finger-tip"]
  }
}

function onSelectStart(event) {
  const controller = event.target;
  const id = controller.id;
  
  const otherController = controller === controllerGrip1 ? controllerGrip2 : controllerGrip1;
  
  const object = collideObject(controller);
  
  if (object && grabbing) {
    grabbingControllers.push(controller.id);
  }

  if (object && !grabbing) {
    controller.attach(object);
    grabbing = true;
    grabbingControllers.push(controller.id);
  }

  if (object && grabbingControllers.length === 2) {
    scaling.active = true;
    scaling.object = object;
    scaling.initialScale = object.scale.x;
    scaling.initialDistance = controller.position.distanceTo(
      otherController.position
    );
    scaling.element1 = controller;
    scaling.element2 = otherController;
  }
}

function onSelectEnd(event) {
  const controller = event.target;
  const id = controller.id;
  
  const index2 = grabbingControllers.indexOf(id);
  grabbingControllers.splice(index2, 1);
  
  scaling.active = false;
  scaling.element1 = null;
  scaling.element2 = null;
  
  if (grabbingControllers.length === 0) {
    scene.attach(object);
    grabbing = false;
  }
}