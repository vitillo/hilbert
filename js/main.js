var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000); 
var renderer = new THREE.WebGLRenderer({clearColor: 0x87CEEB, clearAlpha: 1, antialias: true}); 

renderer.setSize(window.innerWidth, window.innerHeight); 
document.body.appendChild(renderer.domElement); 

var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(1, 1, 0);
scene.add(light);

//var lsystem = new LSystem("F-F-F-F", {"F": "F-F+F+FF-F-F+F"});
//var lsystem = new LSystem("A", {"A": "-BF+AFA+FB-", "B": "+AF-BFB-FA+"}) //HILBERT 2D
var lsystem = new LSystem("X", {"X": "^<XF^<XFX-F^>>XFX&F+>>XFX-F>X->"})
var lturtle = new LTurtle(Math.PI/2, 10, new THREE.Vector3(0, 0, 0));

lturtle.chomp(lsystem.getExpansion(3));
camera.position = lturtle.getCenter();
camera.position.z += 100;

var controls = new THREE.OrbitControls(camera);
controls.addEventListener('change', render);
controls.center = lturtle.getCenter();

function animate(){
  requestAnimationFrame(animate);
  controls.update();
}

function render() { 
  renderer.render(scene, camera); 
}; 

animate();
