var windowWidth = window.innerWidth,
  windowHeight = window.innerHeight,
  halfWindowWidth = Math.floor(windowWidth / 2),
  halfWindowHeight = Math.floor(windowHeight / 2),
  canvas = document.getElementById('canvas'),
  context = canvas.getContext('2d'),
  cameraPosition = new Vector4(0, 0, -450, 1),
  viewTransform = new Matrix4().setPosition(cameraPosition),
  projectionTransform = Matrix4.createPerspective(
    75, windowWidth / windowHeight, 1, 1000),
  viewProjectionTransform = projectionTransform
    .multiplyByMatrix4(viewTransform),
  boids = [];

function initialize() {
  for (var i = 0; i < 200; i++) {
    boids[i] = new Boid(
      new Vector4(
        Math.random() * 400 - 100,
        Math.random() * 400 - 100,
        Math.random() * 400 - 100),
      new Vector4(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1),
      2, 'gray')
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
    if (r <= 0) continue;
    context.beginPath();
    context.arc(a.x, a.y, r, 0, 2 * Math.PI, false);
    context.fillStyle = boid.color;
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
