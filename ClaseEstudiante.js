//----------------------------------------------Clase Estudiante (clase hija de Aula)

//----------------------constructor ( parámetros: x puerta, y puerta, x silla, y silla )
//posX = x puerta (posición inicial)
//posY = y puerta (posición inicial)
//x destino = x silla
//y destino = y silla
//color
//hora de llegada
//hora de salida


//----------------------método actualizar ( parámetro: hora del aula )
//-----------si la hora del aula pasó su hora de llegada y no su hora de salida:
//mover hacia su silla asignada

//-----------si la hora del aula pasó su hora de salida:
//mover hacia la puerta


//----------------------método dibujar
//fill color
//dibujar forma



class Estudiante {  //----------------------------------------------Clase Estudiante (clase hija de Aula)

  constructor(sx, sy) {  //----------------------constructor ( parámetros: x silla, y silla )
    this.posX = sx;  //posX = x puerta (posición inicial)
    this.posY = sy;  //posY = y puerta (posición inicial)
    this.tam = random(15, 30);
    this.colorFill = color(random(0, 255), random(0, 255), random(0, 255));  //color
  }

  dibujar() {  //----------------------método dibujar
    push();
    fill(this.colorFill);  //fill color
    ellipse(this.posX, this.posY, this.tam);  //dibujar forma
  }
}
