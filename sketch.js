// ------------------------------------------------------------------------------------------------------DECLARACIÓN
let lastAngle = 0

// ------------------------------------------------------------------------------------------------------SETUP
function setup() {
  createCanvas(400, 400);

  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    createButton('Activar sensores').mousePressed(() => {
      DeviceOrientationEvent.requestPermission().then(response => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleRotation);
        }
      });
    });
  } else {
    window.addEventListener('deviceorientation', handleRotation);
  }
}

// ------------------------------------------------------------------------------------------------------DRAW
function draw() {
  background(220);

  text(lastAngle, width/2, height/2);
}

// ------------------------------------------------------------------------------------------------------ROTATION
function handleRotation(e) {
  let angle = e.gamma; // rotación izquierda/derecha
  if (Math.abs(angle - lastAngle) > 30) { // umbral
    navigator.vibrate(100);
    lastAngle = angle;
  }
}
