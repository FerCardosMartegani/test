//----------------------------------------------Clase Mesas (clase hija de Aula)

//----------------------constructor
//arreglo de mesas x
//arreglo de mesas y
//crear mesas

//arreglo de sillas x
//arreglo de sillas y
//crear sillas en torno a las mesas


//----------------------método dibujar
//fill color
//dibujar mesa

//fill color
//dibujar sillas


//----------------------método devolver sillas x ( parámetros: índice de la silla )
//return X de la silla i

//----------------------método devolver sillas y ( parámetros: índice de la silla )
//return Y de la silla i



class Mesas {  //----------------------------------------------Clase Mesas (clase hija de Aula)

  constructor() {  //----------------------constructor
    this.mesasX = [];  //arreglo de mesas x
    this.mesasY = [];  //arreglo de mesas y
    this.mesasTX = 100;
    this.mesasTY = 50;

    for (let i=0; i<4; i++) {  //crear mesas
      this.mesasX[i] = width*1/4;
      this.mesasX[i+4] = width*3/4;
    }
    for (let i=0; i<4; i++) {
      this.mesasY[i] = height*(i+1)/5;
      this.mesasY[i+4] = height*(i+1)/5;
    }

    this.sillasX = [];  //arreglo de sillas x
    this.sillasY = [];  //arreglo de sillas y
    this.sillasT = 25;
    for (let m=0; m<this.mesasX.length; m++) {  //crear sillas en torno a las mesas
      this.sillasX.push(this.mesasX[m] - this.mesasTX/3);
      this.sillasY.push(this.mesasY[m] - this.mesasTY);

      this.sillasX.push(this.mesasX[m] + this.mesasTX/3);
      this.sillasY.push(this.mesasY[m] - this.mesasTY);

      this.sillasX.push(this.mesasX[m] - this.mesasTX/3);
      this.sillasY.push(this.mesasY[m] + this.mesasTY);

      this.sillasX.push(this.mesasX[m] + this.mesasTX/3);
      this.sillasY.push(this.mesasY[m] + this.mesasTY);
    }
  }

  dibujar() {  //----------------------método dibujar
    push();
    rectMode(CENTER);
    fill(0);  //fill color
    for (let i=0; i<this.sillasX.length; i++) {
      rect(this.sillasX[i], this.sillasY[i], this.sillasT);  //dibujar sillas
    }
    pop();

    push();
    rectMode(CENTER);
    fill(255);  //fill color
    for (let i=0; i<this.mesasX.length; i++) {
      rect(this.mesasX[i], this.mesasY[i], this.mesasTX, this.mesasTY);  //dibujar mesa
    }
    pop();
  }

  getSillaX(_i) {  //----------------------método devolver sillas x ( parámetros: índice de la silla )
    return this.sillasX[_i];  //return X de la silla i
  }
  getSillaY(_i) {  //----------------------método devolver sillas y ( parámetros: índice de la silla )
    return this.sillasY[_i];  //return Y de la silla i
  }
}
