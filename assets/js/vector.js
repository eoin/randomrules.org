function Vector4(x, y, z, w) {
  this.set(x, y, z, w);
}

Vector4.prototype.set = function (x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w || 1;
  return this;
};

Vector4.prototype.add = function (vector4) {
  this.x += vector4.x;
  this.y += vector4.y;
  this.z += vector4.z;
  return this;
};

Vector4.prototype.addScaled = function (vector4, scalar) {
  this.x += vector4.x * scalar;
  this.y += vector4.y * scalar;
  this.z += vector4.z * scalar;
  return this;
};

Vector4.prototype.divideScalar = function (scalar) {
  var inverse = 1 / scalar;
  this.x *= inverse;
  this.y *= inverse;
  this.z *= inverse;
  return this;
};

Vector4.prototype.distanceToSquared = function (vector4) {
  var dx = this.x - vector4.x;
  var dy = this.y - vector4.y;
  var dz = this.z - vector4.z;
  return dx * dx + dy * dy + dz * dz;
};

Vector4.prototype.length = function () {
  return Math.sqrt(
    this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w,
  );
};

Vector4.prototype.multiplyByMatrix4 = function (matrix4) {
  var x = this.x,
    y = this.y,
    z = this.z,
    w = this.w,
    e = matrix4.elements;
  return new Vector4(
    e[0] * x + e[4] * y + e[8] * z + e[12] * w,
    e[1] * x + e[5] * y + e[9] * z + e[13] * w,
    e[2] * x + e[6] * y + e[10] * z + e[14] * w,
    e[3] * x + e[7] * y + e[11] * z + e[15] * w,
  );
};

Vector4.prototype.avoid = function (target, acc, strength) {
  var dsq = this.distanceToSquared(target);
  var s = strength / dsq;
  acc.x += (this.x - target.x) * s;
  acc.y += (this.y - target.y) * s;
  acc.z += (this.z - target.z) * s;
};
