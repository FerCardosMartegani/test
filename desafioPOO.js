//declarar objeto Aula

//----------------------setup
//createCanvas
//instanciar Aula

//----------------------draw
//actualizar Aula
//dibujar Aula



let aula;  //declarar objeto Aula

function setup() {  //----------------------setup
  createCanvas(600, 800);  //createCanvas
  aula = new Aula();  //instanciar Aula
}

function draw() {  //----------------------draw
  aula.dibujar();  //dibujar Aula
}
