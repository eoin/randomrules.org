var _wallTarget = new Vector4(0, 0, 0);
var _neighborRadiusSq = 100 * 100;

function Boid(position, velocity, radius) {
  this.position = position;
  this.velocity = velocity;
  this.radius = radius;
  this.acceleration = new Vector4(0, 0, 0);
}

Boid.prototype.update = function (neighbors) {
  this.avoidWalls();
  this.flock(neighbors);
  this.move();
  return this;
};

Boid.prototype.avoidWalls = function () {
  var p = this.position,
    acc = this.acceleration;
  _wallTarget.set(-500, p.y, p.z);
  p.avoid(_wallTarget, acc, 5);
  _wallTarget.set(500, p.y, p.z);
  p.avoid(_wallTarget, acc, 5);
  _wallTarget.set(p.x, -450, p.z);
  p.avoid(_wallTarget, acc, 5);
  _wallTarget.set(p.x, 450, p.z);
  p.avoid(_wallTarget, acc, 5);
  _wallTarget.set(p.x, p.y, -450);
  p.avoid(_wallTarget, acc, 5);
  _wallTarget.set(p.x, p.y, 450);
  p.avoid(_wallTarget, acc, 5);
};

Boid.prototype.flock = function (neighbors) {
  var alignX = 0,
    alignY = 0,
    alignZ = 0;
  var cohX = 0,
    cohY = 0,
    cohZ = 0;
  var sepX = 0,
    sepY = 0,
    sepZ = 0;
  var count = 0;
  var px = this.position.x,
    py = this.position.y,
    pz = this.position.z;

  for (var i = 0, len = neighbors.length; i < len; i++) {
    var boid = neighbors[i];
    if (boid === this) continue;
    var dx = boid.position.x - px;
    var dy = boid.position.y - py;
    var dz = boid.position.z - pz;
    var distSq = dx * dx + dy * dy + dz * dz;
    if (distSq > _neighborRadiusSq || distSq === 0) continue;

    count++;

    // alignment: accumulate neighbor velocities
    alignX += boid.velocity.x;
    alignY += boid.velocity.y;
    alignZ += boid.velocity.z;

    // cohesion: accumulate neighbor positions
    cohX += boid.position.x;
    cohY += boid.position.y;
    cohZ += boid.position.z;

    // separation: normalized direction / dist² = direction / distSq
    sepX += -dx / distSq;
    sepY += -dy / distSq;
    sepZ += -dz / distSq;
  }

  var acc = this.acceleration;

  if (count > 0) {
    // alignment: average velocity, clamped to 0.1
    alignX /= count;
    alignY /= count;
    alignZ /= count;
    var alignLen = Math.sqrt(
      alignX * alignX + alignY * alignY + alignZ * alignZ,
    );
    if (alignLen > 0.1) {
      var s = 0.1 / alignLen;
      alignX *= s;
      alignY *= s;
      alignZ *= s;
    }
    acc.x += alignX;
    acc.y += alignY;
    acc.z += alignZ;

    // cohesion: steer toward average position, clamped to 0.1
    cohX = cohX / count - px;
    cohY = cohY / count - py;
    cohZ = cohZ / count - pz;
    var cohLen = Math.sqrt(cohX * cohX + cohY * cohY + cohZ * cohZ);
    if (cohLen > 0.1) {
      var s = 0.1 / cohLen;
      cohX *= s;
      cohY *= s;
      cohZ *= s;
    }
    acc.x += cohX;
    acc.y += cohY;
    acc.z += cohZ;
  }

  // separation (applied even with count=0, sum will be zero)
  acc.x += sepX;
  acc.y += sepY;
  acc.z += sepZ;

  return this;
};

Boid.prototype.move = function () {
  this.velocity.add(this.acceleration);
  var vx = this.velocity.x,
    vy = this.velocity.y,
    vz = this.velocity.z;
  var length = Math.sqrt(vx * vx + vy * vy + vz * vz);
  if (length > 4) {
    this.velocity.divideScalar(length / 4);
  }
  this.position.add(this.velocity);
  this.acceleration.set(0, 0, 0);
  return this;
};
