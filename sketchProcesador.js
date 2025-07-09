let mic, amp, VAD;
let nivelFondo = 0;
let vozActiva = false;
let nivelVoz = 0;

const CAMBIONIVEL = 0.2;

let tiempo, tiempoMax;
const TIEMPO = 3;

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
}

function draw() {
  background(220);
  let nivelActual = amp.getLevel();

  if (!vozActiva) {
    // Promediamos lentamente para suavizar el fondo
    nivelFondo = lerp(nivelFondo, nivelActual, 0.01);
    text("Ambiente (fondo): " + nf(nivelFondo, 1, 4), 10, 30);
  } else {
    // Diferencia entre volumen actual y fondo → voz
    nivelVoz = nivelActual - nivelFondo;
    nivelVoz = max(nivelVoz, 0); // por si es negativa
    text("VOZ detectada. Nivel voz: " + nf(nivelVoz, 1, 4), 10, 30);
  }

  // Visualización
  fill(vozActiva ? "green" : "gray");
  rect(10, 60, nivelVoz * 300, 30);

  verificar();
}

function touchStarted() {
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

      // nivelVoz();
      nivelDeCaos += nivelCambio;

      // ---------------------------------------------Reiniciar detector
    } else {
      VAD.start();
      tiempoMax = TIEMPO;
      nivelCambio = 0;
    }

    tiempo = 0;
  }
}
