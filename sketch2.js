let audios;

let mic, amp, VAD;
let nivelFondo = 0;
let vozActiva = false;
let nivelVoz = 0,
  nivelVozMax = 0;
let nivelDeCaos = 2;

const CAMBIONIVEL = 0.1;

let tiempo = 0;
const TIEMPO = 3;
let tiempoMax = TIEMPO;

let debug;

// --------------------------------------------------------------------------PRELOAD
function preload() {
  audios = [];
  for (let i = 0; i < 6; i++) {
    audios[i] = loadSound("./assets/" + i + ".mp3");
    audios[i].setVolume(0.4);
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
  if (mic != undefined && VAD != undefined) {
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
      }
    }

    let nivelActual = amp.getLevel();

    if (!vozActiva) {
      // Promediamos lentamente para suavizar el fondo
      nivelFondo = lerp(nivelFondo, nivelActual, 0.01);
      text("Ambiente (fondo): " + nf(nivelFondo, 1, 4), 10, 30);
      nivelVozMax = 0;
    } else {
      // Diferencia entre volumen actual y fondo → voz
      nivelVoz = nivelActual - nivelFondo;
      nivelVoz = max(nivelVoz, 0); // por si es negativa
      if (nivelVoz > nivelVozMax) {
        nivelVozMax = nivelVoz;
      }
      text("VOZ detectada. Nivel voz: " + nf(nivelVozMax, 1, 4), 10, 30);
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
      if (nivelVoz > CAMBIONIVEL) {
        nivelCambio = +1;
      } else {
        nivelCambio = -0.5;
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
