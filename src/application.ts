import { Vector4 } from "./vector";
import { Matrix4 } from "./matrix";
import { Grid } from "./grid";
import { Boid } from "./boid";

var windowWidth = window.innerWidth,
  windowHeight = window.innerHeight,
  halfWindowWidth = Math.floor(windowWidth / 2),
  halfWindowHeight = Math.floor(windowHeight / 2),
  canvas = document.getElementById("canvas") as HTMLCanvasElement,
  context = canvas.getContext("2d")!,
  cameraPosition = new Vector4(0, 0, -450, 1),
  viewTransform = new Matrix4().setPosition(cameraPosition),
  projectionTransform = Matrix4.createPerspective(75, windowWidth / windowHeight, 1, 1000),
  viewProjectionTransform = projectionTransform.multiplyByMatrix4(viewTransform),
  grid = new Grid(100),
  boids: Boid[] = [];

function initialize() {
  var count = 1000;
  for (var i = 0; i < count; i++) {
    var hue = (i / count) * 360;
    boids[i] = new Boid(
      new Vector4(Math.random() * 400 - 200, Math.random() * 400 - 200, Math.random() * 400 - 200),
      new Vector4(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1),
      2,
      "hsl(" + hue + ", 80%, 75%)",
    );
  }
}

function projectPosition(x: number, y: number, z: number) {
  var position = new Vector4(x, y, z).multiplyByMatrix4(viewProjectionTransform);
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
  grid.clear();
  for (var i = 0; i < boids.length; i++) {
    grid.insert(boids[i]);
  }
  for (var i = 0; i < boids.length; i++) {
    var boid = boids[i];
    boid.update(grid.getNeighborCells(boid));
    var a = projectPosition(boid.position.x, boid.position.y, boid.position.z);
    var b = projectPosition(boid.position.x + boid.radius, boid.position.y, boid.position.z);
    var r = b.x - a.x;
    if (r <= 0) continue;
    context.fillStyle = boid.color;
    context.beginPath();
    context.arc(a.x, a.y, r, 0, 2 * Math.PI, false);
    context.fill();
  }
}

function resize() {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  halfWindowWidth = Math.floor(windowWidth / 2);
  halfWindowHeight = Math.floor(windowHeight / 2);
  canvas.setAttribute("width", String(windowWidth));
  canvas.setAttribute("height", String(windowHeight));
}

window.addEventListener("resize", resize);
resize();
initialize();
requestAnimationFrame(render);
