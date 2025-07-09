let audios;

let mic, amp, VAD;
let nivelFondo = 0;
let vozActiva = false;
let nivelVoz = 0,
  nivelVozMax = 0;
let nivelDeCaos = 2;

const CAMBIONIVEL = 0.11;

let tiempo = 0;
const TIEMPO = 3;
let tiempoMax = TIEMPO;

let debug;

// --------------------------------------------------------------------------PRELOAD
function preload() {
  audios = [];
  for (let i = 0; i < 6; i++) {
    audios[i] = loadSound("./assets/" + i + ".mp3");
    // audios[i].setVolume(0.4);
  }
}

// --------------------------------------------------------------------------SETUP
async function setup() {
  createCanvas(400, 200);
  mic = new p5.AudioIn();
  mic.start();

  amp = new p5.Amplitude();
  amp.setInput(mic);

  VAD = await vad.MicVAD.new({
    onSpeechStart: () => (vozActiva = true),
    onSpeechEnd: () => (vozActiva = false),
  });

  VAD.start();
  textSize(16);

  debug = false;
}

// --------------------------------------------------------------------------DRAW
function draw() {
  background(220);

  // ---------------------------------------------------Reproducir ruido de fondo según nivel de caos
  nivelDeCaos = constrain(nivelDeCaos, 0, audios.length - 1);
  let nivelInt = int(nivelDeCaos);
  for (let i = 0; i < audios.length; i++) {
    if (i != nivelInt || debug) {
      audios[i].stop();
    } else {
      if (!audios[i].isPlaying()) {
        audios[i].loop();
      }
      break;
    }
  }

  let bocarriba = abs(rotationX) < 0.5 && abs(rotationY) < 0.5; //detectar si está en posición
  let iniciadio = mic != undefined && VAD != undefined; //detectar si todo inició correctamente
  if (bocarriba && iniciadio) {
    let nivelActual = amp.getLevel();

    if (!vozActiva) {
      nivelFondo = lerp(nivelFondo, nivelActual, 0.001); // ruido de fondo suavizado
      text("Ambiente (fondo): " + nf(nivelFondo, 1, 4), 10, 30);
      nivelVozMax = 0;
    } else {
      nivelVoz = nivelActual - nivelFondo; // Diferencia entre volumen actual y fondo → voz
      nivelVoz = max(nivelVoz, 0); // por si es negativa
      if (nivelVoz > nivelVozMax) {
        nivelVozMax = nivelVoz;
      }
      text("VOZ detectada. Nivel voz: " + nf(nivelVozMax, 1, 4), 10, 30);
      text("Umbral: " + nf(CAMBIONIVEL, 1, 4), 10, 50);
    }

    // Visualización
    fill(vozActiva ? "green" : "gray");
    rect(10, 60, nivelVoz * 300, 30);

    verificar();
  }
}

function touchStarted() {
  debug = !debug;
  getAudioContext().resume();
}

// --------------------------------------------------------------------------REINICIAR DETECTOR CADA TANTO
function verificar() {
  tiempo++;

  if (tiempo >= tiempoMax * frameRate()) {
    // ---------------------------------------------Pausar detector
    if (vozActiva) {
      VAD.pause();
      tiempoMax = 0.25;
      vozActiva = false;

      // ---------------------------------------------¿Hubo voz fuerte o débil?
      if (nivelVozMax > CAMBIONIVEL) {
        nivelCambio = +1;
      } else {
        nivelCambio = -float(1 / 3);
      }

      nivelDeCaos += nivelCambio;
    } else {
      // ---------------------------------------------Reiniciar detector
      VAD.start();
      tiempoMax = TIEMPO;
      nivelCambio = 0;
    }

    tiempo = 0;
  }
}
