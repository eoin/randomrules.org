function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function Boid(position, radius) {
  this.position = position;
  this.radius = radius;
}

Boid.prototype.update = function() {

};

function Vector4(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w || 1;
}

Vector4.prototype.multiplyByMatrix4 = function(matrix4) {
  var x = this.x, y = this.y, z = this.z, w = this.w, e = matrix4.elements;
  return new Vector4(
    e[0] * x + e[4] * y + e[8] * z + e[12] * w,
    e[1] * x + e[5] * y + e[9] * z + e[13] * w,
    e[2] * x + e[6] * y + e[10] * z + e[14] * w,
    e[3] * x + e[7] * y + e[11] * z + e[15] * w);
};

function Matrix4(elements) {
  var e = elements || [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
  this.elements = new Float32Array([
    e[0], e[4], e[8], e[12],
    e[1], e[5], e[9], e[13],
    e[2], e[6], e[10], e[14],
    e[3], e[7], e[11], e[15]
  ]);
}

Matrix4.prototype.setPosition = function(vector4) {
  this.elements[12] = vector4.x;
  this.elements[13] = vector4.y;
  this.elements[14] = vector4.z;
  return this;
};

Matrix4.prototype.multiplyByMatrix4 = function(matrix4) {
  var a = this.elements, b = matrix4.elements;
  return new Matrix4([
    a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3],
    a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7],
    a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11],
    a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15],
    a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3],
    a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7],
    a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11],
    a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15],
    a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3],
    a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7],
    a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11],
    a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15],
    a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3],
    a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7],
    a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11],
    a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15],
  ]);
};

Matrix4.createFrustum = function(left, right, bottom, top, near, far) {
  var x = 2 * near / (right - left);
  var y = 2 * near / (top - bottom);
  var a = (right + left) / (right - left);
  var b = (top + bottom) / (top - bottom);
  var c = -(far + near) / (far - near);
  var d = -2 * far * near / (far - near);
  return new Matrix4([ x, 0, a,  0, 0, y, b,  0, 0, 0, c, d, 0, 0,  -1,  0 ]);
};

Matrix4.createPerspective = function(fov, aspect, near, far) {
  var ymax = near * Math.tan(degToRad(fov * 0.5));
  var ymin = - ymax;
  var xmin = ymin * aspect;
  var xmax = ymax * aspect;
  return Matrix4.createFrustum(xmin, xmax, ymin, ymax, near, far);
};

var windowWidth = window.innerWidth,
  windowHeight = window.innerHeight,
  halfWindowWidth = Math.floor(windowWidth / 2),
  halfWindowHeight = Math.floor(windowHeight / 2),
  canvas = document.getElementById('canvas'),
  context = canvas.getContext('2d'),
  cameraPosition = new Vector4(0, 0, -500, 1),
  viewTransform = new Matrix4().setPosition(cameraPosition),
  projectionTransform = Matrix4.createPerspective(
    75, windowWidth / windowHeight, 1, 1000),
  viewProjectionTransform = projectionTransform
    .multiplyByMatrix4(viewTransform),
  boids = [];

function initialize() {
  for (var i = 0; i < 200; i++) {
    boids[i] = new Boid(new Vector4(
      Math.random() * 400 - 200,
      Math.random() * 400 - 200,
      Math.random() * 400 - 200), 2)
  }
}

function projectPosition(x, y, z) {
  var position = new Vector4(x, y, z)
    .multiplyByMatrix4(viewProjectionTransform);
  var w = 1 / position.w;
  position.x *= w;
  position.y *= w;
  position.z *= w;
  position.w *= w;
  position.x *= halfWindowWidth;
  position.y *= halfWindowHeight;
  position.x += halfWindowWidth;
  position.y += halfWindowHeight;
  return position;
}

function render() {
  requestAnimationFrame(render);
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var i=0; i<boids.length; i++) {
    var boid = boids[i];
    boid.update();
    var a = projectPosition(boid.position.x, boid.position.y, boid.position.z);
    var b = projectPosition(boid.position.x + boid.radius, boid.position.y, boid.position.z);
    var r = b.x - a.x;
    context.beginPath();
    context.arc(a.x, a.y, r, 0, 2 * Math.PI, false);
    context.fillStyle = 'gray';
    context.fill();
  }
}

function resize() {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  halfWindowWidth = Math.floor(windowWidth / 2);
  halfWindowHeight = Math.floor(windowHeight / 2);
  canvas.setAttribute('width', windowWidth);
  canvas.setAttribute('height', windowHeight);
}

window.addEventListener('resize', resize);
resize();
initialize();
requestAnimationFrame(render);
