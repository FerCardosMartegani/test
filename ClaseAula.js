//----------------------------------------------Clase Aula (clase madre)

//----------------------constructor
//hora
//puerta x,y

//objeto mesas
//arreglo de objetos estudiantes


//----------------------método actualizar
//avanzar hora
//si llega a tal hora, reiniciar

//actualizar estudiantes[]


//----------------------método dibujar
//dibujar piso
//dibujar paredes?
//dibujar pizarrón
//dibujar proyector
//dibujar profe?

//dibujar mesas
//dibujar estudiantes[]



class Aula {  //----------------------------------------------Clase Aula (clase madre)

  constructor() {//----------------------constructor
    this.mesas = new Mesas();  //objeto mesas

    this.estudiantes = [];  //arreglo de objetos estudiantes
    for (let i=0; i<this.mesas.sillasX.length; i++) {
      let asientoX = this.mesas.getSillaX(i);
      let asientoY = this.mesas.getSillaY(i);
      this.estudiantes[i] = new Estudiante(asientoX, asientoY);
    }
  }

  dibujar() {//----------------------método dibujar
    push();  //dibujar paredes
    fill(100);
    stroke(200);
    strokeWeight(10);
    rectMode(CORNERS);
    rect(0, 0, width, height);

    stroke(160, 60, 0);  //dibujar puertas
    strokeWeight(30);
    line(width, height/2-20, width, height/2+20);
    pop();

    this.mesas.dibujar();  //dibujar mesas
    
    for (let i=0; i<this.estudiantes.length; i++) {  //dibujar estudiantes[]
      this.estudiantes[i].dibujar();
    }
  }
}
