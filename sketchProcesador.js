let mic, speaking, VAD;
let audios, cantAudios, nivelDeCaos, nivelCambio;
let debug, permisoDeSensor;
let amplitudMax,
  amplitudCambio,
  amplitudes,
  amplitudPromedioVoz,
  amplitudPromedioFondo;
const CAMBIONIVEL = 0.035;

let tiempo, tiempoMax;
const TIEMPO = 3;

// --------------------------------------------------------------------------PRELOAD
function preload() {
  audios = [];
  for (let i = 0; i < 7; i++) {
    audios[i] = loadSound("./assets/nivel" + i + ".mp3");
    audios[i].setVolume(1);
  }
}

// -------------------------------------------------------------------------- SETUP
function setup() {
  createCanvas(windowWidth, windowHeight);

  speaking = false;
  tiempo =
    amplitudMax =
    amplitudCambio =
    amplitudPromedioVoz =
    amplitudPromedioFondo =
      -1;
  amplitudes = [];
  tiempoMax = TIEMPO * frameRate();
  nivelDeCaos = 4;
  nivelCambio = 0;
  debug = permisoDeSensor = false;

  initVAD();
}

// --------------------------------------------------------------------------DRAW
function draw() {
  background(255);

  text("ROTATION", width/2, height/2);

  // ---------------------------------------------------Reproducir ruido de fondo según nivel de caos
  nivelDeCaos = constrain(nivelDeCaos, 0, audios.length);
  let nivelInt = int(nivelDeCaos);
  for (let i = 0; i < audios.length; i++) {
    if (i != nivelInt || debug) {
      audios[i].stop();
    } else {
      if (!audios[i].isPlaying()) {
        audios[i].loop();
      }
    }
  }

  if (
    mic != undefined &&
    VAD != undefined &&
    abs(rotationX) < 0.5 &&
    abs(rotationY) < 0.5
  ) {
    verificar();

    // -------------------------------------------------Cálculos con la amplitud registrada
    let amplitudCruda = mic.getLevel();
    amplitudMax = lerp(amplitudMax, amplitudCruda, 0.05); //el máximo suavizado
    amplitudes.push(amplitudMax);

    if (speaking) {
      amplitudPromedioVoz = promedio(amplitudes);
      amplitudCambio = abs(amplitudPromedioVoz - amplitudPromedioFondo);
    } else {
      amplitudPromedioFondo = promedio(amplitudes);
      amplitudCambio = 0;
    }
    

    push();
    textAlign(LEFT, CENTER);
    text("fondo: " + amplitudPromedioFondo, 10, 10);
    text("total: " + amplitudPromedioVoz, 10, 30);
    text("diferencia: " + amplitudCambio, 10, 50);
    text("Umbral: " + CAMBIONIVEL, 10, 70);
    text(speaking ? "Habla" : "No habla", 10, 90);
    text("nivel: " + nivelDeCaos + " + " + nivelCambio, 10, 110);

    // -------------------------------------------------Rotación del teléfono
    textAlign(RIGHT, CENTER);
    text("Rotación X: " + nf(rotationX, 1, 2), width - 10, 10);
    text("Rotación Y: " + nf(rotationY, 1, 2), width - 10, 30);
    text("Rotación Z: " + nf(rotationZ, 1, 2), width - 10, 50);
    text("Permiso: " + permisoDeSensor, width - 10, 70);
    if (abs(rotationX) < 0.5 && abs(rotationY) < 0.5) {
      text("Bocarriba", width - 10, 90);
    }
  }
  pop();
}

// --------------------------------------------------------------------------DETECTOR DE VOZ
async function initVAD() {
  mic = new p5.AudioIn();
  mic.start();
  await mic.stream; // asegurar que el mic esté listo

  VAD = await vad.MicVAD.new({
    onSpeechStart: () => {
      console.log("Voz detectada"); //Cuando detecta voz
      speaking = true;
    },
    onSpeechEnd: () => {
      console.log("Fin de voz"); //Cuando deja de detectar voz
      speaking = false;
      nivelVoz();
    },
  });

  VAD.start();
}

// --------------------------------------------------------------------------REINICIAR DETECTOR CADA TANTO
function verificar() {
  tiempo++;

  if (tiempo >= tiempoMax * frameRate()) {
    // ---------------------------------------------Pausar detector
    if (speaking) {
      VAD.pause();
      tiempoMax = 0.25;
      speaking = false;

      nivelVoz();
      nivelDeCaos += nivelCambio;

      // ---------------------------------------------Reiniciar detector
    } else {
      VAD.start();
      tiempoMax = TIEMPO;
      nivelCambio = 0;
    }

    if (tiempoMax >= TIEMPO) {
      amplitudes = [];
    }
    tiempo = 0;
  }
}

// --------------------------------------------------------------------------MOUSE
function mouseClicked() {
  console.log("Clicked");

  debug = !debug;
}

function touchStarted() {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          console.log("Permiso de movimiento");
          permisoDeSensor = true;
        } else {
          console.log("SIN permiso de movimiento");
          permisoDeSensor = false;
        }
      })
      .catch(console.error);
  } else {
    // En otros navegadores (como Android Firefox o computadoras), no se necesita
    console.log("Permiso no necesario en este navegador");
  }

  // También activamos audio si es necesario
  getAudioContext().resume();
}

// --------------------------------------------------------------------------PROMEDIAR ARRAY
function promedio(a_) {
  let suma = 0;
  for (let i = 0; i < a_.length; i++) {
    suma += float(a_[i]);
  }
  let resultado = suma / a_.length;
  return resultado;
}

// --------------------------------------------------------------------------¿Hubo voz fuerte o débil?
function nivelVoz() {

  if (amplitudCambio > CAMBIONIVEL) {
    nivelCambio = +1;
  } else {
    nivelCambio = -float(1/3);
  }
}
