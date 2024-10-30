let offsetx;
let offsety;
let time = 0;
let linesize = 3;
let creatures = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  
  offsetx = 0;
  offsety = height / 4;
}

function draw() {
  background(255);
  
  for(let i = 0; i < 1; i++){
    if(time % 80 == 0){
      creatures[creatures.length] = new creature(createVector(0,0));
      creatures[creatures.length - 1].position.x = width / 2 + creatures[creatures.length - 1].fulllength / 2 + linesize;
    }
  
    for(let i = 0; i < creatures.length; i++){
      if(creatures[i].position.x < width * -0.5 - creatures[i].fulllength / 2 - linesize){
        creatures.splice(i, 1);
        i--;
      } else {
        creatures[i].move();
      }
    }
    time++;
  }
  
  push();
  translate(offsetx, offsety);
  for(let i = 0; i < creatures.length; i++){
    creatures[i].display();
  }
  pop();
}

class creature{
  constructor(position){
    this.position = position;
    this.segments = [];
    this.maxsize = random(30,90);
    
    let legnum = [1,1,1,2,2,3];
    this.legs = legnum[int(random(legnum.length))];
    this.legplaces = [];
    
    let necknum = [0,0,0,1,1,2];
    this.necks = necknum[int(random(necknum.length))];
    
    let tailnum = [1,1,1,2,2,3];
    this.tails = tailnum[int(random(tailnum.length))];
    
    this.allbits = ["head"];
    for(let i = 0; i < this.necks; i++){
      this.allbits[this.allbits.length] = "neck";
    }
    for(let i = 0; i < this.legs; i++){
      if(i != 0){
        let extranum = [0,0,0,1,1,2];
        let extra = extranum[int(random(extranum.length))];
        for(let j = 0; j < extra; j++){
          this.allbits[this.allbits.length] = "middle";
        }
      }
      this.legplaces[this.legplaces.length] = this.allbits.length;
      this.allbits[this.allbits.length] = "anchor";
    }
    for(let i = 0; i < this.tails; i++){
      this.allbits[this.allbits.length] = "tail";
    }
    this.mainsegment = this.legplaces[int(random(this.legs))];
    
    let current = createVector(0,0);
    for(let i = 0; i < this.allbits.length; i++){
      let tempsize = 0;
      if(this.allbits[i] == "head" || this.allbits[i] == "anchor"){
        if(i == this.mainsegment){
          tempsize = this.maxsize;
        } else {
          tempsize = random(this.maxsize * 0.6, this.maxsize * 0.9);
        }
      } else if(this.allbits[i] == "middle" || this.allbits[i] == "neck"){
        tempsize = random(this.maxsize * 0.5, this.maxsize * 0.8);
      } else {
        tempsize = random(this.maxsize * 0.2, this.maxsize * 0.5);
      }
      
      if(i != 0){
        let minlength = tempsize / 2;
        if(this.segments[this.segments.length - 1].size / 2 > minlength){
          minlength = this.segments[this.segments.length - 1].size / 2;
        }
        
        let tempv;
        if(this.allbits[i] == "anchor" || this.allbits[i] == "middle" || this.allbits[i] == "neck"){
          tempv = createVector(random(0.5,1),random(-0.9,0.9));
          tempv.setMag(random(minlength, minlength * 2.5));
        } else {
          tempv = createVector(random(0.1,1),random(-0.9,0.9));
          tempv.setMag(random(minlength * 1.5, minlength * 4));
        }
        current.add(tempv);
      }
      
      this.segments[this.segments.length] = new segment(createVector(current.x,current.y), tempsize);
    }
    
    let lowest = this.segments[0].size / 2;
    for(let i = 1; i < this.segments.length; i++){
      if(this.segments[i].position.y + this.segments[i].size / 2 > lowest){
        lowest = this.segments[i].position.y + this.segments[i].size / 2;
      }
    }
    this.above = random(this.maxsize * 0.2, this.maxsize * 1);
    lowest += this.above;
    
    this.fulllength = current.x + this.segments[0].size / 2 + this.segments[this.segments.length - 1].size / 2;
    
    let base = createVector((current.x + this.segments[0].size / 2 + this.segments[this.segments.length - 1].size / 2) / 2 - this.segments[0].size / 2, lowest);
    for(let i = 0; i < this.segments.length; i++){
      this.segments[i].position.sub(base);
    }
    
    for(let i = 0; i < this.legs; i++){
      let legsegment = this.segments[this.legplaces[i]];
      let leglength = -legsegment.position.y / 2;
      let legwidth = random(legsegment.size / 6, legsegment.size / 4);
      for(let j = 0; j < 2; j++){
        let legpos = createVector(legsegment.position.x - (legsegment.size / 2 - legwidth / 2) * -j, legsegment.position.y);
        legsegment.legs[j] = new leg(createVector(legpos.x, legpos.y), createVector(legpos.x, legpos.y + leglength), createVector(legpos.x, legpos.y + leglength * 2), leglength, legwidth);
      }
    }
    
    this.walking = true;
    this.leftup = false;
    this.cycle = random(10,25);
    this.cyclenow = 0;
    let shortleg = this.segments[this.legplaces[0]].legs[0].length;
    for(let i = 1; i < this.legs; i++){
      if(this.segments[this.legplaces[i]].legs[0].length < shortleg){
        shortleg = this.segments[this.legplaces[i]].legs[0].length;
      }
    }
    shortleg = shortleg * 2;
    this.maxspeed = sqrt(sq(shortleg) - sq(shortleg - this.above)) / this.cycle;
    this.speed = random(this.maxspeed/2, this.maxspeed);
    
    this.mycolors = [];
    let colorgens = [];
    let tinttypes = [];
    let colornum = constrain(int(random(1,4)), 1, int(this.segments.length / 2));
    for(let i = 0; i < colornum; i++){
      let colorratio = [];
      let colortotal = 0;
      for(let j = 0; j < 3; j++){
        colorratio[j] = random(0.1,1);
        colortotal += colorratio[j];
      }
      for(let j = 0; j < 3; j++){
        colorratio[j] = colorratio[j] / colortotal;
      }
      let intensity = random(200,255);
      
      this.mycolors[i] = color(colorratio[0] * intensity, colorratio[1] * intensity, colorratio[2] * intensity);
      colorgens[i] = new ColorGenerator(this.mycolors[i]);
      tinttypes[i] = 2;
    }
    for(let i = 0; i < this.segments.length - colornum * 2; i++){
      tinttypes[int(random(tinttypes.length))]++;
    }
    
    this.tints = [];
    let colortypes = ["tint", "tintr", "tintr", "shade", "shade", "shade"];
    let typechoice = colortypes[int(random(colortypes.length))];
    for(let i = 0; i < colornum; i++){
      let tinttemp = [];
      if(typechoice == "tint"){
        tinttemp = colorgens[i].getTints(tinttypes[i]);
      }
      if(typechoice == "tintr"){
        tinttemp = colorgens[i].getTints(tinttypes[i]);
        reverse(tinttemp);
      }
      if(typechoice == "shade"){
        tinttemp = colorgens[i].getShades(tinttypes[i] + 1);
      }
      for(let j = 0; j < tinttypes[i]; j++){
        this.tints[this.tints.length] = tinttemp[j];
      }
    }
  }
  
  move(){
    if(this.walking){
      let span = this.cycle * this.speed;
      let downleg = 0;
      let upleg = 1;
      if(this.leftup){
        downleg = 1;
        upleg = 0;
      }
      for(let i = 0; i < this.legs; i++){
        let legsegment = this.segments[this.legplaces[i]];
        
        legsegment.legs[downleg].pos2.x = legsegment.legs[downleg].pos1.x - span / 4 + this.speed / 2 * this.cyclenow;
        legsegment.legs[downleg].pos2.y = - legsegment.legs[downleg].length;
        legsegment.legs[downleg].pos3.x = legsegment.legs[downleg].pos1.x - span / 2 + this.speed * this.cyclenow;
        legsegment.legs[downleg].pos3.y = 0;
        
        legsegment.legs[upleg].pos2.x = legsegment.legs[upleg].pos1.x + span / 4 - this.speed / 2 * this.cyclenow;
        legsegment.legs[upleg].pos2.y = - legsegment.legs[upleg].length * (1 + 0.5 * (1 - abs(this.cycle / 2 - this.cyclenow) / (this.cycle / 2)));
        legsegment.legs[upleg].pos3.x = legsegment.legs[upleg].pos1.x + span / 2 - this.speed * this.cyclenow;
        legsegment.legs[upleg].pos3.y = - legsegment.legs[upleg].length * (0.5 * (1 - abs(this.cycle / 2 - this.cyclenow) / (this.cycle / 2)));
      }
      this.position.x -= this.speed;
      this.cyclenow++;
      if(this.cyclenow >= this.cycle){
        this.cyclenow = 0;
        this.leftup = !this.leftup;
      }
    }
  }
  
  display(){
    push();
    translate(this.position);
    for(let i = 0; i < 2; i++){
      if(i == 0){
        stroke(0);
        strokeWeight(linesize * 2);
      } else {
        noStroke();
      }
      
      for(let j = this.segments.length - 1; j > -1; j--){
        if(this.segments[j].legs.length > 0){
          let colorgen = new ColorGenerator(this.tints[j]);
          fill(colorgen.getShades(3)[1]);
          this.segments[j].legs[0].display();
        }
      }
    
      for(let j = this.segments.length - 1; j > -1; j--){
        fill(this.tints[j]);
      
        ellipse(this.segments[j].position.x, this.segments[j].position.y, this.segments[j].size, this.segments[j].size);
      
        if(j != 0){
          let x1 = this.segments[j].position.x;
          let y1 = this.segments[j].position.y;
          let x2 = this.segments[j-1].position.x;
          let y2 = this.segments[j-1].position.y;
          let tilt = createVector(x2 - x1, y2 - y1);
          tilt.rotate(90);
          tilt.setMag(1);
        
          quad(x1 + (this.segments[j].size / 2) * tilt.x, y1 + (this.segments[j].size / 2) * tilt.y, x1 - (this.segments[j].size / 2) * tilt.x, y1 - (this.segments[j].size / 2) * tilt.y, x2 - (this.segments[j-1].size / 2) * tilt.x, y2 - (this.segments[j-1].size / 2) * tilt.y, x2 + (this.segments[j-1].size / 2) * tilt.x, y2 + (this.segments[j-1].size / 2) * tilt.y);
        }
      }
      
      for(let j = this.segments.length - 1; j > -1; j--){
        if(this.segments[j].legs.length > 0){
          fill(this.tints[j]);
          this.segments[j].legs[1].display();
        }
      }
    }
    
    pop();
  }
}

class segment{
  constructor(position, size){
    this.position = position;
    this.size = size;
    this.legs = [];
  }
}

class leg{
  constructor(pos1,pos2,pos3,length,size){
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.pos3 = pos3;
    this.length = length;
    this.size = size;
  }
  
  display(){
    let x1 = this.pos1.x;
    let y1 = this.pos1.y;
    let x2 = this.pos2.x;
    let y2 = this.pos2.y;
    for(let i = 0; i < 2; i++){
      if(i == 1){
        x1 = this.pos2.x;
        y1 = this.pos2.y;
        x2 = this.pos3.x;
        y2 = this.pos3.y;
      }
      
      ellipse(x1, y1, this.size, this.size);
      let tilt = createVector(x2 - x1, y2 - y1);
      tilt.rotate(90);
      tilt.setMag(1);
      if(i == 0){
        quad(x1 + (this.size / 2) * tilt.x, y1 + (this.size / 2) * tilt.y, x1 - (this.size / 2) * tilt.x, y1 - (this.size / 2) * tilt.y, x2 - (this.size / 2) * tilt.x, y2 - (this.size / 2) * tilt.y, x2 + (this.size / 2) * tilt.x, y2 + (this.size / 2) * tilt.y);
      } else {
        quad(x1 + (this.size / 2) * tilt.x, y1 + (this.size / 2) * tilt.y, x1 - (this.size / 2) * tilt.x, y1 - (this.size / 2) * tilt.y, x2 + (this.size / 2), y2, x2 - (this.size / 2), y2);
      }
    }
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}