function LTurtle(defaultAngle, defaultLength, startPosition){
  this.minCoords = new THREE.Vector3(0, 0, 0);
  this.maxCoords = new THREE.Vector3(0, 0, 0);

  this.angle = defaultAngle;
  this.length = defaultLength;

  this.position = startPosition;
  this.orientation = new THREE.Quaternion();
  this.capsuleFactory = new CapsuleFactory(scene);
}

LTurtle.prototype = {
  chomp: function(input){
    lastF = input.lastIndexOf("F");

    for(var i = 0; i < input.length; i++){
      switch(input[i]){
      case '+':
        this._rotate("y", this.angle);
        break;
      case '-':
        this._rotate("y", -this.angle);
        break;
      case '&':
        this._rotate("x", -this.angle);
        break;
      case '^':
        this._rotate("x", this.angle);
        break;
      case '<':
        this._rotate("z", this.angle);
        break;
      case '>':
        this._rotate("z", -this.angle);
        break;
      case '|':
        this._rotate("y", Math.PI);
        break;
      case 'f':
        this.forwardNodraw();
        break;
      case 'F':
        this.forwardDraw(i == lastF);
        break;
      default:
        //console.log("Unknown input \"" + input[i] + "\"");
        break;
      }
    }
  },

  _rotate: function(axis, angle){
    var euler = new THREE.Vector3(0, 0, 0);

    switch(axis){
      case "x":
        euler.x = angle;
        break;
      case "y":
        euler.y = angle;
        break;
      case "z":
        euler.z = angle;
        break;
    }

    var o = new THREE.Quaternion().setFromEuler(euler);
    this.orientation.multiply(o);
    this.orientation.normalize();
  },

  forwardDraw: function(last){
    var bottom = this.position.clone();
    var matrix = new THREE.Matrix4().makeRotationFromQuaternion(this.orientation);
    var forward = new THREE.Vector3(0, 0, this.length).applyMatrix4(matrix);
    var top = this.position.add(forward);
    this.capsuleFactory.create(1, bottom, top, false, !last);

    if(this.position.x < this.minCoords.x)
      this.minCoords.x = this.position.x;

    if(this.position.y < this.minCoords.y)
      this.minCoords.y = this.position.y;

    if(this.position.z < this.minCoords.z)
      this.minCoords.z = this.position.z;

    if(this.position.x > this.maxCoords.x)
      this.maxCoords.x = this.position.x;

    if(this.position.y > this.maxCoords.y)
      this.maxCoords.y = this.position.y;

    if(this.position.z > this.maxCoords.z)
      this.maxCoords.z = this.position.z;
  },

  getCenter: function(){
    return new THREE.Vector3().addVectors(this.minCoords, this.maxCoords).multiplyScalar(0.5);
  }
};

