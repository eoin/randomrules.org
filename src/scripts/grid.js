// Spatial hash that partitions 3D space into uniform cells for fast neighbor lookups.
export class Grid {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.inverseCellSize = 1 / cellSize;
    this.cells = {};
  }

  clear() {
    this.cells = {};
  }

  key(cx, cy, cz) {
    return cx + "," + cy + "," + cz;
  }

  insert(boid) {
    var cx = Math.floor(boid.position.x * this.inverseCellSize);
    var cy = Math.floor(boid.position.y * this.inverseCellSize);
    var cz = Math.floor(boid.position.z * this.inverseCellSize);
    var k = this.key(cx, cy, cz);
    if (this.cells[k]) {
      this.cells[k].push(boid);
    } else {
      this.cells[k] = [boid];
    }
  }

  getNeighborCells(boid) {
    var result = [];
    var cx = Math.floor(boid.position.x * this.inverseCellSize);
    var cy = Math.floor(boid.position.y * this.inverseCellSize);
    var cz = Math.floor(boid.position.z * this.inverseCellSize);
    for (var dx = -1; dx <= 1; dx++) {
      for (var dy = -1; dy <= 1; dy++) {
        for (var dz = -1; dz <= 1; dz++) {
          var cell = this.cells[this.key(cx + dx, cy + dy, cz + dz)];
          if (cell) {
            for (var i = 0, len = cell.length; i < len; i++) {
              result.push(cell[i]);
            }
          }
        }
      }
    }
    return result;
  }
}
