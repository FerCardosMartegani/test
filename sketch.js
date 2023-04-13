let cucas = [];
let nCucas = 3;   //cantidad inicial de cucas

function setup() {
  createCanvas(displayWidth, displayHeight);
  colorMode(HSB,360,100,100,100);

  for(let i=0; i<nCucas; i++){
    cucas[i] = new Cuca(random(0,width), random(0,height));    //cada cuca aparece en un punto random.
  }

}

function draw() {
  background(360);

  for(let i=0; i<nCucas; i++){        //métodos de cucas
    cucas[i].calcular();
    cucas[i].mover();
    cucas[i].dibujar();
  }

}

function mouseClicked(){                      //al hacer clic...
  for(let i=0; i<int(random(nCucas)); i++){  
    cucas[i].quieto();                        //...algunas cucas empiezan a moverse y otras dejan de hacerlo
  }

}

function keyPressed(){    //al presionar una tecla...
  nCucas++;
  cucas[(nCucas-1)] = new Cuca(random(0,width), random(0,height));      //...crear una cuca nueva
  console.log(nCucas);

}