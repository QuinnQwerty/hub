let bx = 0;
let by = 0;
let current = 0;
let bsize = 100;
let curtain = 250;
let things = [];

function setup(){
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
}

function draw(){
    background(66,166,166);

    for(let i = 0; i < things.length; i++){
        things[i].age += 1;
        if(things[i].age > 1000){
            things.splice(i,1);
        }
    }

    for(let i = 0; i < things.length; i++){
        things[i].x += things[i].speed * cos(things[i].direction);
        things[i].y += things[i].speed * sin(things[i].direction);
    }

    if(mouseY > curtain){
        if(bx != mouseX || by != mouseY){
            things[things.length] = new thing(mouseX, mouseY, bsize / (1 + (dist(bx, by, mouseX, mouseY) / 10)));
        }
    }

    for(let i = 0; i < things.length; i++){
        noStroke();
        fill(26,106,106);
        ellipse(things[i].x,things[i].y,things[i].size,things[i].size);
    }

    noStroke();
    fill(26,106,106);
    rect(0,0,width,curtain);

    current = (current + 10)%360;

    bx = mouseX;
    by = mouseY;
}

function mousePressed(){
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
}

class thing{
    constructor(x,y,size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.age = 0;
        this.direction = current;
        this.speed = 3;
    }
}