function Boid(position, velocity, radius, color) {
  this.position = position;
  this.velocity = velocity;
  this.radius = radius;
  this.color = color;
  this.acceleration = new Vector4(0, 0, 0);
}

Boid.prototype.update = function() {
  this.avoidWalls();
  this.flock();
  this.move();
  return this;
};

Boid.prototype.avoidWalls = function() {
  var left = this.position.avoid(
    new Vector4(-500, this.position.y, this.position.z)).multiplyScalar(5);
  var right = this.position.avoid(
    new Vector4(500, this.position.y, this.position.z)).multiplyScalar(5);
  var bottom = this.position.avoid(
    new Vector4(this.position.x, -450, this.position.z)).multiplyScalar(5);
  var top = this.position.avoid(
    new Vector4(this.position.x, 450, this.position.z)).multiplyScalar(5);
  var back = this.position.avoid(
    new Vector4(this.position.x, this.position.y, -450)).multiplyScalar(5);
  var front = this.position.avoid(
    new Vector4(this.position.x, this.position.y, 450)).multiplyScalar(5);
  this.acceleration = this.acceleration.add(left)
    .add(right).add(top).add(bottom).add(back).add(front);
};

Boid.prototype.flock = function() {
  this.acceleration = this.acceleration
    .add(this.alignment())
    .add(this.cohesion())
    .add(this.separation());
  return this;
};

Boid.prototype.alignment = function() {
  var sum = new Vector4(0, 0, 0), count = 0;
  for (var i = 0; i < boids.length; i++) {
    var boid = boids[i], distance = boid.position.distanceTo(this.position);
    if (distance > 0 && distance <= 100) {
      sum = sum.add(boid.velocity);
      count++;
    }
  }
  if (count <= 0) {
    return sum;
  }
  sum = sum.divideScalar(count);
  var length = sum.length();
  if (length > 0.1) {
    sum = sum.divideScalar(length / 0.1);
  }
  return sum;
};

Boid.prototype.cohesion = function() {
  var steer = new Vector4(0, 0, 0),
    sum = new Vector4(0, 0, 0),
    count = 0;
  for (var i = 0; i < boids.length; i++) {
    var boid = boids[i], distance = boid.position.distanceTo(this.position);
    if (distance > 0 && distance <= 100) {
      sum = sum.add(boid.position);
      count++;
    }
  }
  if (count > 0) {
    sum = sum.divideScalar(count);
  }
  steer = sum.subtract(this.position);
  var length = steer.length();
  if (length > 0.1) {
    steer = steer.divideScalar(length / 0.1);
  }
  return steer;
};

Boid.prototype.separation = function() {
  var sum = new Vector4(0, 0, 0);
  for (var i = 0; i < boids.length; i++) {
    var boid = boids[i], distance = boid.position.distanceTo(this.position);
    if (distance > 0 && distance <= 100) {
      var repulse = this.position
        .subtract(boid.position)
        .normalize()
        .divideScalar(distance);
      sum = sum.add(repulse);
    }
  }
  return sum;
};

Boid.prototype.move = function() {
  this.velocity = this.velocity.add(this.acceleration);
  var length = this.velocity.length();
  if (length > 4) {
    this.velocity = this.velocity.divideScalar(length / 4);
  }
  this.position = this.position.add(this.velocity);
  this.acceleration.set(0, 0, 0);
  return this;
};
