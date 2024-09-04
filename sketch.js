function setup(){
    createCanvas(windowWidth, windowHeight);
    background(200,120,120);
}

function draw(){
    ellipse(mouseX,mouseY,mouseX,mouseY);
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
    background(200,120,120);
}