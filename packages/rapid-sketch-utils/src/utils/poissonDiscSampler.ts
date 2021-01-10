export function poissonDiscSamplerCenter(width, height, radius) {
  var k = 30, // maximum number of samples before rejection
    radius2 = radius * radius,
    R = 3 * radius2,
    cellSize = radius * Math.SQRT1_2,
    gridWidth = Math.ceil(width / cellSize),
    gridHeight = Math.ceil(height / cellSize),
    grid = new Array(gridWidth * gridHeight),
    queue = [],
    queueSize = 0,
    sampleSize = 0;

  return function () {
    if (!sampleSize)
      return sample(Math.random() * width, Math.random() * height);

    // Pick a random existing sample and remove it from the queue.
    while (queueSize) {
      var i = (Math.random() * queueSize) | 0,
        s = queue[i];

      // Make a new candidate between [radius, 2 * radius] from the existing sample.
      for (var j = 0; j < k; ++j) {
        var a = 2 * Math.PI * Math.random(),
          r = Math.sqrt(Math.random() * R + radius2),
          x = s[0] + r * Math.cos(a),
          y = s[1] + r * Math.sin(a);

        // Reject candidates that are outside the allowed extent,
        // or closer than 2 * radius to any existing sample.
        if (0 <= x && x < width && 0 <= y && y < height && far(x, y))
          return sample(x, y);
      }

      queue[i] = queue[--queueSize];
      queue.length = queueSize;
    }
  };

  function far(x, y) {
    var i = (x / cellSize) | 0,
      j = (y / cellSize) | 0,
      i0 = Math.max(i - 2, 0),
      j0 = Math.max(j - 2, 0),
      i1 = Math.min(i + 3, gridWidth),
      j1 = Math.min(j + 3, gridHeight);

    for (j = j0; j < j1; ++j) {
      var o = j * gridWidth;
      for (i = i0; i < i1; ++i) {
        if ((s = grid[o + i])) {
          var s,
            dx = s[0] - x,
            dy = s[1] - y;
          if (dx * dx + dy * dy < radius2) return false;
        }
      }
    }

    return true;
  }

  function sample(x, y) {
    var s = [x, y];
    queue.push(s);
    grid[gridWidth * ((y / cellSize) | 0) + ((x / cellSize) | 0)] = s;
    ++sampleSize;
    ++queueSize;
    return s;
  }
}

export function* poissonDiscSampler([x0, y0, x1, y1], n, k = 30) {
  const width = x1 - x0;
  const height = y1 - y0;
  const radius2 = (width * height) / (n * 1.5);
  const radius = Math.sqrt(radius2);
  const radius2_3 = 3 * radius2;
  const cellSize = radius * Math.SQRT1_2;
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);
  const grid = new Array(gridWidth * gridHeight);
  const queue = [];

  // Pick the first sample.
  yield sample(
    width / 2 + Math.random() * radius,
    height / 2 + Math.random() * radius
  );

  // Pick a random existing sample from the queue.
  pick: while (queue.length) {
    const i = (Math.random() * queue.length) | 0;
    const parent = queue[i];

    // Make a new candidate between [radius, 2 * radius] from the existing sample.
    for (let j = 0; j < k; ++j) {
      const a = 2 * Math.PI * Math.random();
      const r = Math.sqrt(Math.random() * radius2_3 + radius2);
      const x = parent[0] + r * Math.cos(a);
      const y = parent[1] + r * Math.sin(a);

      // Accept candidates that are inside the allowed extent
      // and farther than 2 * radius to all existing samples.
      if (0 <= x && x < width && 0 <= y && y < height && far(x, y)) {
        yield sample(x, y);
        continue pick;
      }
    }

    // If none of k candidates were accepted, remove it from the queue.
    const r = queue.pop();
    if (i < queue.length) queue[i] = r;
  }

  function far(x, y) {
    const i = (x / cellSize) | 0;
    const j = (y / cellSize) | 0;
    const i0 = Math.max(i - 2, 0);
    const j0 = Math.max(j - 2, 0);
    const i1 = Math.min(i + 3, gridWidth);
    const j1 = Math.min(j + 3, gridHeight);
    for (let j = j0; j < j1; ++j) {
      const o = j * gridWidth;
      for (let i = i0; i < i1; ++i) {
        const s = grid[o + i];
        if (s) {
          const dx = s[0] - x;
          const dy = s[1] - y;
          if (dx * dx + dy * dy < radius2) return false;
        }
      }
    }
    return true;
  }

  function sample(x, y) {
    queue.push(
      (grid[gridWidth * ((y / cellSize) | 0) + ((x / cellSize) | 0)] = [x, y])
    );
    return [x + x0, y + y0];
  }
}
