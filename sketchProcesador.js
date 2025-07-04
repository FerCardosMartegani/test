let mic, speaking, VAD;
let audios, cantAudios, nivelDeCaos, nivelCambio;
let debug;
let amplitudMax, amplitudCambio, amplitudes, amplitudPromedio;
const CAMBIONIVEL = 0.2;

let tiempo, tiempoMax;
const TIEMPO = 3;

// --------------------------------------------------------------------------PRELOAD
function preload() {
  audios = [];
  for (let i = 0; i < 7; i++) {
    audios[i] = loadSound("./assets/nivel" + i + ".mp3");
    audios[i].setVolume(0.4);
  }
}

// -------------------------------------------------------------------------- SETUP
function setup() {
  createCanvas(windowWidth, windowHeight);

  speaking = false;
  tiempo = amplitudMax = amplitudCambio = amplitudPromedio = -1;
  amplitudes = [];
  tiempoMax = TIEMPO * frameRate();
  nivelDeCaos = 3;
  nivelCambio = 0;
  debug = false;

  initVAD();
}

// --------------------------------------------------------------------------DRAW
function draw() {
  background(255);

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

  push();
  if (mic != undefined && VAD != undefined) {
    verificar();

    // -------------------------------------------------Cálculos con la amplitud registrada
    let amplitudCruda = mic.getLevel();
    if (amplitudCruda > amplitudMax) {
      amplitudMax = amplitudCruda;
    } else {
      amplitudMax = lerp(amplitudMax, amplitudCruda, 0.05); //el máximo se reduce de a poco
    }
    amplitudPromedio = promedio(amplitudes);

    text("crudo: " + amplitudCruda, 10, 10);
    text("max: " + amplitudMax, 10, 30);
    text("promedio: " + amplitudPromedio, 10, 50);
    text(speaking ? "Habla" : "No habla", 10, 70);
    text("nivel: " + nivelDeCaos + " + " + nivelCambio, 10, 90);
    text("output: " + getOutputVolume(), 10, 110);

    // -------------------------------------------------Rotación del teléfono
    text("Rotación X: " + rotationX, 10, height - 50);
    text("Rotación Y: " + rotationY, 10, height - 30);
    text("Rotación Z: " + rotationZ, 10, height - 10);

    if (speaking) {
      fill(200);

      // amplitudCambio = nf(amplitudMax - amplitudCruda, 1, 5);
    } else {
      fill(0);
    }
  }
  ellipse(mouseX, mouseY, width / 10);
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

    tiempo = 0;
  } else {
    // ---------------------------------------------Registrar volumen para promediar
    if (speaking) {
      amplitudes.push(nf(amplitudMax, 1, 3));
    } else {
      amplitudes = [];
    }
  }
}

// --------------------------------------------------------------------------MOUSE
function mouseClicked() {
  console.log("Clicked");

  debug = !debug;

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
  let incremento = 0.5;

  if (amplitudPromedio > CAMBIONIVEL) {
    nivelCambio = +incremento;
  } else {
    nivelCambio = -incremento;
  }
}
