let walkers = [];
let foods = [];
let foodenergy = 10;
let foodcount = 100;
let time = 0;
let screenscale = 0.4;
let simspeed = 1;
let gridx = 1600;
let gridy = 1200;

let offsetx = 0;
let offsety = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  
  for(let i = 0; i < 20; i++){
    walkers[walkers.length] = new walker(createVector(random(gridx),random(gridy)));
  }
  
  for(let i = 0; i < foodcount; i++){
    foods[foods.length] = new food(createVector(random(gridx),random(gridy)));
  }
}

function draw() {
  background(255);
  
  for(let i = 0; i < simspeed; i++){
    for(let j = 0; j < walkers.length; j++){
      if(walkers[j].dead){
        walkers.splice(j, 1);
      } else {
        walkers[j].move();
      }
    }
    
    for(let j = 0; j < foods.length; j++){
      if(foods[j].energy == 0){
        foods.splice(j, 1);
        j--;
      }
    }
    
    if(time % 300 == 0 && walkers.length > 1){
      let possibles = [];
      for(let j = 0; j < walkers.length; j++){
        possibles[possibles.length] = j;
      }
      for(let j = 0; j < walkers.length - 2; j++){
        possibles.splice(int(random(possibles.length)),1);
      }
      let parent1 = walkers[possibles[0]];
      let parent2 = walkers[possibles[1]];
      
      let child = new walker(createVector(random(gridx),random(gridy)));
      
      child.timermove = random(parent1.timermove,parent2.timermove) * random(0.9,1.1);
      child.speed = random(parent1.speed,parent2.speed) * random(0.9,1.1);
      
      child.hues = [];
      for(let j = 0; j < 3; j++){
        child.hues[j] = constrain(random(parent1.hues[j],parent2.hues[j]) * random(0.9,1.1),0,1);
      }
    
      child.highhue = 0;
      for(let j = 1; j < 3; j++){
        if(child.hues[j] > child.hues[child.highhue]){
          child.highhue = j;
        }
      }
    
      child.upper = constrain(random(parent1.upper,parent2.upper) * random(0.9,1.1),200,250);
      child.lower = constrain(random(parent1.lower,parent2.lower) * random(0.9,1.1),150,190);
      
      child.acceleration.setMag(random(parent1.acceleration.mag(), parent2.acceleration.mag()) * random(0.9,1.1));
      
      child.segments = [];
      let childpos = createVector(random(gridx),random(gridy));
      child.segments[0] = new segment(childpos, random(parent1.segments[0].size, parent2.segments[0].size) * random(0.9,1.1), 0);
    
      let extras = int(random(parent1.segments.length - 1, parent2.segments.length - 1));
      if(random(1) < 0.05){
        extras++;
      }
      for(let j = 0; j < extras; j++){
        let bodysize = int(random(parent1.segments[int(random(1, parent1.segments.length))].size, parent2.segments[int(random(1, parent2.segments.length))].size) * random(0.9,1.1));
        let lengthmin = (child.segments[j].size / 2) + (bodysize / 2);
        child.segments[j + 1] = new segment(createVector(childpos.x,childpos.y),bodysize,int(random(lengthmin,lengthmin + 30)));
      }
    
      child.energymax = 0;
      for(let j = 0; j < child.segments.length; j++){
        child.energymax += (child.segments[j].size / 2) * (child.segments[j].size / 2) * PI;
        child.energymax += child.segments[j].body * child.segments[j].size / 2;
      }
      child.energy = child.energymax / 2;
      child.cost = child.energymax / 10000;
      
      walkers[walkers.length] = child;
    }
    
    if(random(1) < 0.01 && foods.length < foodcount){
      foods[foods.length] = new food(createVector(random(gridx),random(gridy)));
    }
    
    time += 1;
  }
  
  if(mouseIsPressed){
    offsetx += mouseX - pmouseX;
    offsety += mouseY - pmouseY;
  }
  
  push();
  scale(screenscale);
  translate(((width - gridx * screenscale) / 2) / screenscale, ((height - gridy * screenscale) / 2) / screenscale);
  translate(offsetx, offsety);
  
  for(let i = 0; i < foods.length; i++){
    foods[i].display();
  }
  
  for(let i = 0; i < walkers.length; i++){
    walkers[i].display();
  }
  
  rectMode(CENTER);
  stroke(0);
  strokeWeight(3);
  noFill();
  rect(gridx / 2, gridy / 2, gridx, gridy);
  
  pop();
}

class walker{
  constructor(position){
    this.timer = random(10000);
    this.timermove = random(0.01,0.1);
    this.age = 0;
    this.death = 0;
    this.dead = false;
    this.speed = random(1.5,8);
    
    this.hues = [];
    for(let i = 0; i < 3; i++){
      this.hues[i] = random(1);
    }
    
    this.highhue = 0;
    for(let i = 1; i < 3; i++){
      if(this.hues[i] > this.hues[this.highhue]){
        this.highhue = i;
      }
    }
    
    this.upper = random(200,250);
    this.lower = random(150,190);
    
    this.velocity = createVector(0,0);
    this.direction = createVector(0,0);
    this.acceleration = createVector(random(-1,1),random(-1,1));
    this.acceleration.setMag(random(0.15,0.35));
    
    this.segments = [];
    this.segments[0] = new segment(position, random(20,50), 0);
    
    let extras = int(random(1,4));
    for(let i = 0; i < extras; i++){
      let bodysize = int(random(10,30));
      let lengthmin = (this.segments[i].size / 2) + (bodysize / 2);
      this.segments[i + 1] = new segment(createVector(position.x,position.y),bodysize,int(random(lengthmin,lengthmin + 30)));
    }
    
    this.energymax = 0;
    for(let i = 0; i < this.segments.length; i++){
      this.energymax += (this.segments[i].size / 2) * (this.segments[i].size / 2) * PI;
      this.energymax += this.segments[i].body * this.segments[i].size / 2;
    }
    this.energy = this.energymax / 2;
    this.cost = this.energymax / 10000;
  }
  
  move(){
    this.energy = constrain(this.energy - this.age / 10000, 0, this.energymax);
    
    this.acceleration.rotate(map(noise(this.timer),0,1,-15,15));
    
    this.velocity.setMag(constrain(this.velocity.mag() - 0.1, 0, this.speed));
    if(this.acceleration.mag() * this.cost < this.energy){
      this.energy -= this.velocity.mag() * this.cost;
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.speed);
    }
    
    this.segments[0].position.add(this.velocity);
    this.segments[0].position.x = constrain(this.segments[0].position.x, this.segments[0].size / 2, gridx - this.segments[0].size / 2);
    this.segments[0].position.y = constrain(this.segments[0].position.y, this.segments[0].size / 2, gridy - this.segments[0].size / 2);
    
    for(let i = 1; i < this.segments.length; i++){
      let x1 = this.segments[i].position.x;
      let y1 = this.segments[i].position.y;
      let x2 = this.segments[i-1].position.x;
      let y2 = this.segments[i-1].position.y;
      
      let currentdist = createVector(x1 - x2, y1 - y2);
      currentdist.limit(this.segments[i].body);
      this.segments[i].position = createVector(x2,y2);
      this.segments[i].position.add(currentdist);
    }
    
    if(this.velocity.x != 0 && this.velocity.y != 0){
      this.direction.x = this.velocity.x;
      this.direction.y = this.velocity.y;
      this.direction.setMag(1);
    }
    
    if(this.energymax - this.energy > foodenergy){
      for(let i = 0; i < foods.length; i++){
        if(foods[i].energy > 0){
          let posx = this.segments[0].position.x;
          let posy = this.segments[0].position.y;
          let foodx = foods[i].position.x;
          let foody = foods[i].position.y;
          let foodsize = foods[i].size / 2;
          if(abs(posx - foodx) < foodsize && abs(posy - foody) < foodsize){
            foods[i].energy--;
            this.energy = constrain(this.energy + foodenergy, 0, this.energymax);
          }
        }
      }
    }
    
    if(this.energy == 0){
      this.death++;
    } else {
      this.death = 0;
    }
    if(this.death >= 100){
      this.dead = true;
    }
    
    this.age++;
    this.timer += this.timermove;
  }
  
  display(){
    for(let i = 0; i < 2; i++){
      if(i == 0){
        stroke(0);
        strokeWeight(6);
      } else {
        noStroke(0);
      }
      for(let j = this.segments.length - 1; j > -1; j--){
        let basehue = this.upper - (this.upper - this.lower) / (this.segments.length - 1) * j;
        let newhues = [];
        for(let i = 0; i < 3; i++){
          newhues[i] = basehue * this.hues[i] / this.hues[this.highhue];
          newhues[i] = constrain(newhues[i],0,255);
        }
        fill(newhues[0],newhues[1],newhues[2]);
        if(j > 0){
          let x1 = this.segments[j].position.x;
          let y1 = this.segments[j].position.y;
          let x2 = this.segments[j-1].position.x;
          let y2 = this.segments[j-1].position.y;
          let tilt = createVector(x1 - x2, y1 - y2);
          tilt.rotate(90);
          tilt.setMag(1);
        
          quad(x1 + (this.segments[j].size / 2) * tilt.x, y1 + (this.segments[j].size / 2) * tilt.y, x1 - (this.segments[j].size / 2) * tilt.x, y1 - (this.segments[j].size / 2) * tilt.y, x2 - (this.segments[j-1].size / 2) * tilt.x, y2 - (this.segments[j-1].size / 2) * tilt.y, x2 + (this.segments[j-1].size / 2) * tilt.x, y2 + (this.segments[j-1].size / 2) * tilt.y);
        }
        this.segments[j].display();
      }
    }
    
    let mouth = createVector(this.direction.x, this.direction.y);
    mouth.setMag(this.segments[0].size / 2);
    mouth.rotate(90);
    stroke(0);
    strokeWeight(3);
    line(this.segments[0].position.x - mouth.x, this.segments[0].position.y - mouth.y, this.segments[0].position.x + mouth.x, this.segments[0].position.y + mouth.y);
  }
}

class segment{
  constructor(position,size,body){
    this.position = position;
    this.size = size;
    this.body = body;
  }
  
  display(){
    ellipse(this.position.x,this.position.y,this.size,this.size);
  }
}

class food{
  constructor(position){
    this.position = position;
    this.size = random(30,60);
    this.position.x = constrain(this.position.x,this.size / 2, gridx - this.size / 2);
    this.position.y = constrain(this.position.y,this.size / 2, gridy - this.size / 2);
    this.energy = 100;
  }
  
  display(){
    rectMode(CENTER);
    noStroke();
    fill(250 - this.energy / 2);
    rect(this.position.x,this.position.y,this.size,this.size);
  }
}

function keyPressed(){
  if(keyCode == UP_ARROW){
    screenscale *= 1.1;
  }
  
  if(keyCode == DOWN_ARROW){
    screenscale *= 0.9;
  }
  
  if(keyCode == LEFT_ARROW){
    simspeed = constrain(simspeed - 1, 1, 10);
  }
  
  if(keyCode == RIGHT_ARROW){
    simspeed = constrain(simspeed + 1, 1, 10);
  }

  if(key == 'a' || key == 'A'){
    walkers[walkers.length] = new walker(createVector(random(gridx),random(gridy)));
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}