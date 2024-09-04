let things = [];

function setup(){
    createCanvas(windowWidth, windowHeight);
}

function draw(){
    background(66,166,166);

    for(let i = 0; i < things.length; i++){
        noStroke();
        fill(26,106,106);
        ellipse(things[i].x,things[i].y,things[i].size,things[i].size);
    }

    noStroke();
    fill(26,106,106);
    rect(0,0,width,250);
}

function mousePressed(){
    things[things.length] = new thing(mouseX, mouseY);
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
}

class thing{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = 50;
    }
}