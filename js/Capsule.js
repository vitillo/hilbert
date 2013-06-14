function CapsuleFactory(scene){
  this.scene = scene;
  this.sphereCache = {};
  this.cylinderCache = {};
  this.material = new THREE.MeshPhongMaterial({color: 0x00DD00});
}

CapsuleFactory.prototype = {
  create: function(radius, bottom, up, openBottom, openTop){
    var direction = up.clone().sub(bottom);
    var height = direction.length();
    var sphereGeo = this.sphereCache[radius];
    var cylinderGeo;

    if(!sphereGeo){
      sphereGeo = new THREE.SphereGeometry(radius, 32, 16);
      this.sphereCache[radius] = sphereGeo;
    }

    if(!(tmpCache = this.cylinderCache[radius]))
      tmpCache = this.cylinderCache[radius] = {};

    if(!(cylinderGeo = tmpCache[height])){
      cylinderGeo = new THREE.CylinderGeometry(radius, radius, height, 32, 1, false);
      tmpCache[height] = cylinderGeo;
    }

    var cap = new THREE.Mesh(cylinderGeo, this.material);
    var rotationAxis = direction.normalize().clone().cross(new THREE.Vector3(0, 1, 0));
    var rad = -Math.acos(direction.normalize().clone().dot(new THREE.Vector3(0, 1, 0)));

    if(rotationAxis.length() < 0.000001){
      rotationAxis.set(1, 0, 0);
    }

    var rotationMatrix = new THREE.Matrix4().makeRotationAxis(rotationAxis, rad);
    var translationMatrix = new THREE.Matrix4().makeTranslation(0, height/2, 0);

    cap.matrixAutoUpdate = false;
    cap.matrix.multiplyMatrices(rotationMatrix, translationMatrix);
    cap.matrix.multiplyMatrices(new THREE.Matrix4().makeTranslation(bottom.x, bottom.y, bottom.z), cap.matrix);

    if(!openTop){
      var sphere = new THREE.Mesh(sphereGeo, this.material);
      cap.add(sphere);
      sphere.position = new THREE.Vector3(0, height/2, 0);
    }

    if(!openBottom){
      var sphere = new THREE.Mesh(sphereGeo, this.material);
      cap.add(sphere);
      sphere.position = new THREE.Vector3(0, -height/2, 0);
    }

    scene.add(cap);
    return cap;
  }
}
