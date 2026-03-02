paper.setup('myCanvas');

const tool = new paper.Tool();
let path;
const baseThickness = { value: 2 }; // Default pen thickness
const penColor = { value: '#000000' }; // Default pen color
const velocityFactor = 50; // Higher value = smoother velocity-based thickness

let lastPoint, lastTime;

// Event: On mouse down, start a new path
tool.onMouseDown = (event) => {
  path = new paper.Path({
    strokeColor: penColor.value,
    strokeWidth: baseThickness.value,
    strokeCap: 'round',
    strokeJoin: 'round',
  });

  // Add the first point
  path.add(event.point);
  lastPoint = event.point;
  lastTime = event.timeStamp;
};

// Event: On mouse drag, add points and smooth them
tool.onMouseDrag = (event) => {
  const currentTime = event.timeStamp;
  const deltaTime = (currentTime - lastTime) / 1000; // Time in seconds
  const distance = event.point.getDistance(lastPoint);

  // Calculate velocity
  const velocity = distance / deltaTime;

  // Adjust stroke width based on velocity (inverse relationship)
  path.strokeWidth = Math.max(
    baseThickness.value / 2,
    Math.min(baseThickness.value * 2, baseThickness.value + velocityFactor / velocity)
  );

  // Smooth input: Use a midpoint to smooth sharp transitions
  const midpoint = event.middlePoint;
  path.add(midpoint);

  lastPoint = event.point;
  lastTime = currentTime;
};

// Event: On mouse up, simplify and smooth the path
tool.onMouseUp = () => {
  path.simplify(10); // Simplifies the path with a tolerance for smoother curves
};

// Update pen color
document.getElementById('colorPicker').addEventListener('input', (e) => {
  penColor.value = e.target.value;
  document.getElementById('colorValue').textContent = e.target.value;
});

// Update pen thickness
document.getElementById('thickness').addEventListener('input', (e) => {
  baseThickness.value = parseInt(e.target.value, 10);
});


// Clear the canvas
document.getElementById('clear').addEventListener('click', () => {
  paper.project.activeLayer.removeChildren(); // Remove all paths
  paper.view.draw(); // Redraw the canvas
});

// Download the canvas as a PNG
document.getElementById('download').addEventListener('click', () => {
  const canvas = document.getElementById('myCanvas');
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'signature.png';
  link.href = dataURL;
  link.click();
});
