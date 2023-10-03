let cucas = [];

function setup() {
  createCanvas(displayWidth, displayHeight);
  colorMode(HSB,360,100,100,100);

  cucas.push(new Cuca(width/2, height/2));    //primera cuca al centro

}

function draw() {
  background(360);

  for(let i=0; i<cucas.length; i++){        //métodos de cucas
    cucas[i].calcular();
    cucas[i].mover();
    cucas[i].dibujar();

    console.log(cucas.length);
  }

}

function mouseClicked(){                      //al hacer clic...
  if(cucas.length==1){ cucas[0].quieto(); }
  else{
    for(let i=0; i<int(random(cucas.length)); i++){
      cucas[int(random(cucas.length))].quieto();          //...algunas cucas empiezan a moverse y otras dejan de hacerlo
    }
  }
}

function keyPressed(){    //al presionar una tecla...
  //nCucas++;
  cucas.push(new Cuca(random(0,width), random(0,height)));      //...crear una cuca nueva

}