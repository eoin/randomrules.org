function Matrix4(elements) {
  this.set(elements);
}

Matrix4.prototype.set = function(elements) {
  var e = elements || [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
  this.elements = new Float32Array([
    e[0], e[4], e[8], e[12],
    e[1], e[5], e[9], e[13],
    e[2], e[6], e[10], e[14],
    e[3], e[7], e[11], e[15]
  ]);
  return this;
};

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

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}
