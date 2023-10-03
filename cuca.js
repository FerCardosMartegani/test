class Cuca{

    constructor(startX, startY){
        this.posX=startX; this.posY=startY;
        this.ang=0; this.dis=0;
        this.vel=0; this.acel=random(5,30);     //cada cuca se mueve a una velocidad distinta
        this.dx=0; this.dy=0;
        this.canMove=false;
        this.matiz=random(360);         //cada cuca es de un color distinto

    }

    calcular(){
        this.dis = dist(this.posX,this.posY, mouseX,mouseY);        //distancia entre cuca y cursor
        this.vel = this.dis/(this.acel);                            //velocidad de la cuca
        this.ang = atan2(mouseY-this.posY, mouseX-this.posX);       //ángulo entre cuca y cursor
        this.dx = this.vel*cos(this.ang);                           //movimiento que debe hacer para ir al cursor
        this.dy = this.vel*sin(this.ang);
    }

    mover(){
        if(this.canMove){               //moverse hacia el cursor
            this.posX += this.dx;
            this.posY += this.dy;
        }
    }

    dibujar(){
        push();
            translate(this.posX,this.posY);
            rotate(this.ang);
            if(this.dis < 50){
                fill(this.matiz,5,50);       //pierde saturación cuando toca el cursor.
            }else{
                fill(this.matiz,100,50);
            }
            ellipse(0,0, 100,50);                   //cuerpo de cuca
            fill(map(this.dis, 0,width, 0,360));
            ellipse(30,0, 40,40);                   //cabeza de cuca. Se oscurece cuando se le acerca el cursor
        pop();
    }

    quieto(){
        this.canMove=!this.canMove;         //hacer que se mueva o deje de moverse
    }

}