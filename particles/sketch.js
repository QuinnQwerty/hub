let particles = [];
let particlemax = 200;
let defaultsize = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  
  for(let i = 0; i < 1; i++){
    let newsize = defaultsize;
    let pos = createVector(random(newsize/2, width - newsize/2), random(newsize/2, height - newsize/2));
    particles[particles.length] = new Particle(newsize, pos);
  }
}

function draw() {
  //background(255);
  
  if(frameCount % 30 == 0 && frameCount > 0 && particles.length < particlemax){
    let newsize = defaultsize;
    let rparticle = particles[int(random(particles.length))];
    let pos = createVector(rparticle.position.x, rparticle.position.y);
    particles[particles.length] = new Particle(newsize, pos);
  }
  
  for(let i = 0; i < particles.length; i++){
    particles[i].update();
  }
  
  for(let i = 0; i < particles.length; i++){
    particles[i].show();
  }
}

class Particle{
  constructor(size, position){
    this.drawblack = true;
    this.age = 0;
    this.size = size;
    this.position = position;
    this.velocity = createVector(random(-1,1), random(-1,1));
    this.velocity.setMag(3);
  }
  
  update(){
    let bounce = false;
    if(this.position.y < this.size/2){
      this.velocity.y *= -1;
      bounce = true;
    }
    if(this.position.y > height - this.size/2){
      this.velocity.y *= -1;
      bounce = true;
    }
    if(this.position.x < this.size/2){
      this.velocity.x *= -1;
      bounce = true;
    }
    if(this.position.x > width - this.size/2){
      this.velocity.x *= -1;
      bounce = true;
    }
    if(bounce){
      this.drawblack = !this.drawblack;
    }
    
    this.position.add(this.velocity);
    this.age++;
  }
  
  show(){
    if(this.drawblack){
      fill(0);
      stroke(0);
    } else {
      fill(255);
      stroke(255);
    }
    strokeWeight(2);
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}