let walkers = [];
let paints = [];
let fadeout = 100;
let death = fadeout + 200;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  
  walkers[0] = new walker(width/2,height/2);
}

function draw() {
  background(255);
  
  for(let i = 0; i < paints.length; i++){
    paints[i].move();
    if(paints[i].age >= death){
      paints.splice(i,1);
      i--;
    }
  }
  
  for(let i = 0; i < walkers.length; i++){
    walkers[i].move();
  }
  
  for(let i = 0; i < paints.length; i++){
    paints[i].display();
  }
  
  for(let i = 0; i < walkers.length; i++){
    walkers[i].display();
  }
  
  time += 0.05;
}

class walker{
  constructor(x,y){
    this.timer = random(1000);
    this.segments = [];
    this.segments[0] = new segment(x,y,random(20,40),0);
    let extras = int(random(2,5));
    for(let i = 1; i < extras; i++){
      let bodysize = int(random(10,25));
      let lengthmin = (this.segments[i-1].size / 2) + (bodysize / 2);
      this.segments[i] = new segment(x,y,bodysize,int(random(lengthmin,lengthmin + 20)))
    }
    this.speed = random(2,6);
    this.mycolor = color(random(150,220),random(150,220),random(150,220));
  }
  
  move(){
    this.segments[0].x += this.speed * cos(this.segments[0].direction);
    this.segments[0].y += this.speed * sin(this.segments[0].direction);
    
    if(this.segments[0].x - (this.segments[0].size / 2) < 0){
      this.segments[0].direction = random(-90,90);
    }
    if(this.segments[0].x + (this.segments[0].size / 2) > width){
      this.segments[0].direction = random(90,270);
    }
    if(this.segments[0].y - (this.segments[0].size / 2) < 0){
      this.segments[0].direction = random(0,180);
    }
    if(this.segments[0].y + (this.segments[0].size / 2) > height){
      this.segments[0].direction = random(180,360);
    }
    
    for(let i = 1; i < this.segments.length; i++){
      let x1 = this.segments[i].x;
      let y1 = this.segments[i].y;
      let x2 = this.segments[i-1].x;
      let y2 = this.segments[i-1].y;
      this.segments[i].direction = atan((y2 - y1) / (x2 - x1));
      
      if((x2 - x1) < 0){
        this.segments[i].direction = 180 + this.segments[i].direction;
      }
      
      let currentdist = dist(this.segments[i].x,this.segments[i].y,this.segments[i-1].x,this.segments[i-1].y);
      if(currentdist > this.segments[i].body){
        this.segments[i].x += (currentdist - this.segments[i].body) * cos(this.segments[i].direction);
        this.segments[i].y += (currentdist - this.segments[i].body) * sin(this.segments[i].direction);
      }
    }
    
    this.segments[0].direction += map(noise(time + this.timer),0,1,-20,20);
    
    paints[paints.length] = new paint(this.segments[0].x,this.segments[0].y,this.segments[0].size,this.mycolor);
  }
  
  display(){
    for(let i = 0; i < this.segments.length; i++){
      if(i > 0){
        noStroke();
        fill(0);
        let tilt = this.segments[i].direction + 90;
        quad(this.segments[i].x + (this.segments[i].size / 2) * cos(tilt), this.segments[i].y + (this.segments[i].size / 2) * sin(tilt),this.segments[i].x - (this.segments[i].size / 2) * cos(tilt), this.segments[i].y - (this.segments[i].size / 2) * sin(tilt),this.segments[i-1].x - (this.segments[i-1].size / 2) * cos(tilt), this.segments[i-1].y - (this.segments[i-1].size / 2) * sin(tilt),this.segments[i-1].x + (this.segments[i-1].size / 2) * cos(tilt), this.segments[i-1].y + (this.segments[i-1].size / 2) * sin(tilt));
      }
      this.segments[i].display();
    }
  }
}

class segment{
  constructor(x,y,size,body){
    this.x = x;
    this.y = y;
    this.size = size;
    this.body = body;
    this.direction = random(360);
  }
  
  display(){
    noStroke();
    fill(0);
    ellipse(this.x,this.y,this.size,this.size);
  }
}

class paint{
  constructor(x,y,size,mycolor){
    this.x = x;
    this.y = y;
    this.size = size;
    this.mycolor = mycolor;
    this.age = 0;
    this.fade = 255;
  }
  
  move(){
    this.age++;
    if(this.age > fadeout){
      this.fade = map(this.age - fadeout,0,death-fadeout,255,0);
    }
  }
  
  display(){
    noStroke();
    this.mycolor.setAlpha(this.fade);
    fill(this.mycolor);
    ellipse(this.x,this.y,this.size,this.size);
  }
}

function mousePressed(){
  walkers[walkers.length] = new walker(mouseX,mouseY);
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
}