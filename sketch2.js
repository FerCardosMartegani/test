let audios;

let mic, amp, VAD;
let nivelFondo = 0;
let vozActiva = false;
let nivelVoz = 0,
  nivelVozMax = 0;
const NIVEL_INICIAL = 2;
let nivelDeCaos = NIVEL_INICIAL,
  nivelCambio = 0;
let nivelAlcanzado = false;

let UMBRAL;
const UMBRAL1 = 0.15;
const UMBRAL2 = 0.35;

let tiempo = 0;
const TIEMPO = 3;
let tiempoMax = TIEMPO;

let tiempoStart = 0;

let debug = false;
let bocabajo = false;
let preBocabajo = false;

// --------------------------------------------------------------------------PRELOAD
function preload() {
  audios = [];
  for (let i = 0; i < 6; i++) {
    audios[i] = loadSound("./assets/" + i + ".mp3");
    // audios[i].setVolume(0.5);
  }
}

// --------------------------------------------------------------------------SETUP
async function setup() {
  createCanvas(windowWidth, windowHeight);
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
}

// --------------------------------------------------------------------------DRAW
function draw() {
  background(220);

  // ---------------------------------------------------Reproducir ruido de fondo según nivel de caos
  nivelDeCaos = constrain(nivelDeCaos, 0, audios.length - 1);
  let nivelInt = ceil(nivelDeCaos);
  for (let i = 0; i < audios.length; i++) {
    if (i != nivelInt || debug) {
      audios[i].stop();
    } else {
      if (!audios[i].isPlaying()) {
        audios[i].loop();
      }
    }
    // text("Suena: " + i + " " + audios[i].isPlaying(), 10, 100 + 10 * i);
  }
  UMBRAL = constrain(map(nivelDeCaos, NIVEL_INICIAL, audios.length-1, UMBRAL1, UMBRAL2), UMBRAL1, UMBRAL2);

  text(
    nf(rotationX, 1, 2) +
      " , " +
      nf(rotationY, 1, 2) +
      " , " +
      nf(rotationZ, 1, 2),
    10,
    90
  );
  bocabajo = abs(rotationX) > 2.7 && abs(rotationY) < 0.2; //detectar si está bocabajo
  if (bocabajo && !preBocabajo) {
    doDebug();
  }
  preBocabajo = bocabajo;

  let bocarriba = abs(rotationX) < 0.5 && abs(rotationY) < 0.5; //detectar si está bocarriba
  let iniciadio = mic != undefined && VAD != undefined; //detectar si todo inició correctamente
  if (bocarriba && iniciadio) {
    verificar();

    let nivelActual = amp.getLevel();

    // ---------------------------------------------------Si NO hay voz...
    if (!vozActiva) {
      nivelFondo = lerp(nivelFondo, nivelActual, 0.001); // ruido de fondo suavizado
      text("Ambiente (fondo): " + nf(nivelFondo, 1, 4), 10, 30);
      nivelVozMax = 0;

      // ---------------------------------------------------Si hay voz
    } else {
      nivelVoz = nivelActual - nivelFondo; // Diferencia entre volumen actual y fondo → voz
      nivelVoz = max(nivelVoz, 0); // por si es negativa
      if (nivelVoz > nivelVozMax) {
        nivelVozMax = nivelVoz;
      }
      text("VOZ detectada. Nivel voz: " + nf(nivelVozMax, 1, 4), 10, 30);
      text("Umbral: " + nf(UMBRAL, 1, 4), 10, 50);
    }
    text(
      "Nivel: " + nf(nivelDeCaos, 1,2) + (vozActiva ? " + " + nivelCambio : ""),
      10,
      70
    );
  }
}

function touchStarted() {
  doDebug();
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
      if (nivelDeCaos > 0 && !debug) {
        if (nivelDeCaos > nivelAlcanzado) {
          nivelAlcanzado = nivelDeCaos;
        }
        if (nivelVozMax > UMBRAL) {
          nivelCambio = +1;
        } else {
          nivelCambio = nivelAlcanzado >= audios.length-1 ? -1 : -float(1 / 2);
        }

        nivelDeCaos += nivelCambio;
      }
    } else {
      // ---------------------------------------------Reiniciar detector
      VAD.start();
      tiempoMax = TIEMPO;
      nivelCambio = 0;
    }

    tiempo = 0;
  }
}

// --------------------------------------------------------------------------AGITAR PARA DESMUTEAR
function doDebug() {
  debug = !debug;
}
