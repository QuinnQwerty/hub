let Engine = Matter.Engine;
let World = Matter.World;
let Body = Matter.Body;
let Bodies = Matter.Bodies;
let Composite = Matter.Composite;
let Composites = Matter.Composites;
let Constraint = Matter.Constraint;
let Collision = Matter.Collision;

let engine;
let world;
let foods = [];
let creatures = [];
let grounds = [];
let worldw = 2000;
let worldh = 2000;
let bound = 40;

let focus;
let zoom = 0.4;
let simspeeds = [1, 3, 6, 10, 20];
let cspeed = 0;

let outline = 3;
let time = 0;
let mode = "free";
let mainguy;
let allinfo = false;

let goal = 0;
let goalgap = 160;
let foodmax = 100;

let coolmax = 300;
let birthmax = 400;
let mutate = 0.15;

function setup(){
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  focus = createVector(worldw / 2, worldh / 2);
  angleMode(DEGREES);
  
  engine.gravity.y = 0;
  
  grounds.push(new Boundary(-bound / 2, worldh / 2, bound, worldh + bound * 2));
  grounds.push(new Boundary(worldw + bound / 2, worldh / 2, bound, worldh + bound * 2));
  grounds.push(new Boundary(worldw / 2, -bound / 2, worldw + bound * 2, bound));
  grounds.push(new Boundary(worldw / 2, worldh + bound / 2, worldw + bound * 2, bound));
  World.add(world, grounds);
  
  for(let i = 0; i < 50; i++){
    grow([]);
  }
  
  for(let i = 0; i < 50; i++){
    populate([]);
  }
  
  mainguy = creatures[int(random(creatures.length))];
}

function draw(){
  for(let i = 0; i < simspeeds[cspeed]; i++){
    if(time == goal){
      goal += goalgap;
      goalgap += 0;
      populate([]);
    }
    if(foods.length < foodmax){
      grow([]);
    }
    
    for(let j = 0; j < creatures.length; j++){
      creatures[j].update();
      if(creatures[j].fullbody.birth == 1){
        populate([creatures[j], creatures[j].fullbody.mate]);
        creatures[j].fullbody.mate = null;
      }
      if(creatures[j].fullbody.dead){
        Composite.clear(creatures[j].fullbody.chain);
        creatures.splice(j, 1);
        j--;
      }
    }
    
    for(let j = 0; j < creatures.length; j++){
      let highest = null;
      let highc = 0;
      for(let k = 0; k < foods.length; k++){
        let coll = Collision.collides(creatures[j].fullbody.chain.bodies[0], foods[k].body);
        if(coll != null){
          let intensity = createVector(coll.penetration.x, coll.penetration.y).mag();
          if(intensity > highc){
            highc = intensity;
            highest = k;
          }
        }
      }
      
      if(highest != null){
        if(highest > 0.1 && creatures[j].brain.aggro > 0.25){
          let chance = 0.2;
          chance += map(constrain(highc, 0, 1), 0.1, 1, 0, 0.4);
          chance += map(creatures[j].brain.aggro, 0.25, 1, 0, 0.4);
          if(random(1) < chance){
            creatures[j].fullbody.energy = constrain(creatures[j].fullbody.energy + foods[highest].body.mass / 2, 0, creatures[j].fullbody.energymax);
            Composite.remove(world, foods[highest].body);
            foods.splice(highest, 1);
          }
        }
      }
    }
    
    for(let j = 1; j < creatures.length; j++){
      for(let k = 0; k < j; k++){
        let highest = 0;
        for(let l = 0; l < creatures[j].fullbody.chain.bodies.length; l++){
          for(let m = 0; m < creatures[k].fullbody.chain.bodies.length; m++){
            let coll = Collision.collides(creatures[j].fullbody.chain.bodies[l], creatures[k].fullbody.chain.bodies[m]);
            if(coll != null){
              let intensity = createVector(coll.penetration.x, coll.penetration.y).mag();
              if(intensity > highest){
                highest = intensity;
              }
            }
          }
        }
        if(highest > 0.1 && creatures[j].fullbody.cooldown == 0 && creatures[k].fullbody.cooldown == 0 && creatures[j].fullbody.birth == 0 && creatures[k].fullbody.birth == 0){
          if(creatures[j].fullbody.eggs > 0 && creatures[k].fullbody.eggs > 0 && creatures[j].brain.aggro < 0.75 && creatures[k].brain.aggro < 0.75){
            let chance = 0.5;
            chance += map(constrain(highest, 0, 1), 0.1, 1, 0, 0.3);
            chance += map(creatures[j].brain.aggro, 0, 0.75, 0.1, 0);
            chance += map(creatures[k].brain.aggro, 0, 0.75, 0.1, 0);
            if(random(1) < chance){
              let parent1, parent2;
              if(random(1) > 0.5){
                parent1 = j;
                parent2 = k;
              } else {
                parent1 = k;
                parent2 = j;
              }
              creatures[parent1].fullbody.eggs--;
              creatures[parent2].fullbody.eggs--;
              creatures[parent1].fullbody.birth = birthmax;
              creatures[parent2].fullbody.cooldown = coolmax;
              creatures[parent1].fullbody.mate = creatures[parent2];
            }
          }
        }
      }
    }
    
    Engine.update(engine);
    time++;
  }
  
  if(mainguy.fullbody.dead){
    mainguy = creatures[int(random(creatures.length))];
  }
  
  if(mouseIsPressed && mode == "free"){
    focus.x -= (mouseX - pmouseX) / zoom;
    focus.y -= (mouseY - pmouseY) / zoom;
  }
  if(mode == "auto" && !mainguy.fullbody.dead){
    focus.x = mainguy.fullbody.chain.bodies[0].position.x;
    focus.y = mainguy.fullbody.chain.bodies[0].position.y;
  }
  
  background(255);
  
  push();
  let zoomt = zoom;
  if(mode == "auto"){
    zoomt = 1;
  }
  scale(zoomt);
  translate((width / zoomt) / 2 - focus.x, (height / zoomt) / 2 - focus.y);
  
  fill(0);
  for(let ground of grounds){
    ground.show();
  }
  
  for(let food of foods){
    food.show();
  }
  
  for(let creature of creatures){
    creature.show();
  }
  
  if(mode == "auto"){
    mainguy.fullbody.showinfo();
  }
  if(allinfo){
    for(let creature of creatures){
      creature.fullbody.showinfo();
    }
  }

  pop();
}

function keyPressed(){
  if(keyCode == UP_ARROW && mode == "free"){
    zoom *= 1.2;
  }
  
  if(keyCode == DOWN_ARROW && mode == "free"){
    zoom /= 1.2;
  }
  
  if(keyCode == LEFT_ARROW){
    cspeed = constrain(cspeed - 1, 0, simspeeds.length - 1);
  }
  
  if(keyCode == RIGHT_ARROW){
    cspeed = constrain(cspeed + 1, 0, simspeeds.length - 1);
  }
  
  if(key == 'a' || key == 'A'){
    mode = "auto";
  }
  
  if(key == 'f' || key == 'F'){
    mode = "free";
  }
  
  if(key == 'r' || key == 'R'){
    mainguy = creatures[int(random(creatures.length))];
  }
  
  if(key == 's' || key == 'S'){
    allinfo = !allinfo;
  }
}

function populate(info){
  let border = 20;
  
  if(info.length == 0){
    creatures.push(new Creature(worldw / 2, worldh / 2, []));
    Composite.rotate(creatures[creatures.length - 1].fullbody.chain, random(360), createVector(worldw / 2, worldh / 2));
    
    let lowx = worldw * 2;
    let highx = worldw * -2;
    let lowy = worldh * 2;
    let highy = worldh * -2;
    for(let j = 0; j < creatures[creatures.length - 1].fullbody.chain.bodies.length; j++){
      let chainpart = creatures[creatures.length - 1].fullbody.chain.bodies[j];
      let chainw = creatures[creatures.length - 1].fullbody.widths[j];
      
      if(chainpart.position.x - chainw / 2 < lowx){
        lowx = chainpart.position.x - chainw / 2;
      }
      if(chainpart.position.x + chainw / 2 > highx){
        highx = chainpart.position.x + chainw / 2;
      }
      if(chainpart.position.y - chainw / 2 < lowy){
        lowy = chainpart.position.y - chainw / 2;
      }
      if(chainpart.position.y + chainw / 2 > highy){
        highy = chainpart.position.y + chainw / 2;
      }
    }
    Composite.translate(creatures[creatures.length - 1].fullbody.chain, createVector(random(-lowx + border, worldw - highx - border), random(-lowy + border, worldh - highy - border)));
  }
  
  if(info.length == 2){
    creatures.push(new Creature(info[0].fullbody.chain.bodies[0].x, info[0].fullbody.chain.bodies[0].y, [info[0], info[1]]));
    Composite.rotate(creatures[creatures.length - 1].fullbody.chain, random(360), createVector(worldw / 2, worldh / 2));
    
    let lowx = worldw * 2;
    let highx = worldw * -2;
    let lowy = worldh * 2;
    let highy = worldh * -2;
    for(let j = 0; j < creatures[creatures.length - 1].fullbody.chain.bodies.length; j++){
      let chainpart = creatures[creatures.length - 1].fullbody.chain.bodies[j];
      let chainw = creatures[creatures.length - 1].fullbody.widths[j];
      
      if(chainpart.position.x - chainw / 2 < lowx){
        lowx = chainpart.position.x - chainw / 2;
      }
      if(chainpart.position.x + chainw / 2 > highx){
        highx = chainpart.position.x + chainw / 2;
      }
      if(chainpart.position.y - chainw / 2 < lowy){
        lowy = chainpart.position.y - chainw / 2;
      }
      if(chainpart.position.y + chainw / 2 > highy){
        highy = chainpart.position.y + chainw / 2;
      }
    }
    
    Composite.translate(creatures[creatures.length - 1].fullbody.chain, createVector(constrain(random(-30, 30), -lowx + border, worldw - highx - border), constrain(random(-30, 30), -lowy + border, worldh - highy - border)));
  }
}

function grow(info){
  let fsize = random(20, 30);
  foods.push(new Food(random(fsize/2, worldw - fsize/2), random(fsize/2, worldh - fsize/2), fsize/2));
}

class Creature{
  constructor(x, y, parents){
    this.fullbody = new Chain(x, y, parents);
    this.brain = new Brain(parents);
  }
  
  update(){
    this.fullbody.update();
    this.brain.update(this.fullbody);
  }
  
  show(){
    this.fullbody.show();
  }
}

class Chain{
  constructor(x, y, parents){
    this.mainsize = random(20, 40);
    this.bdensity = random(0.1, 0.9);
    this.cdensity = this.bdensity;
    this.stiffness = random(0.1, 0.9);
    this.speed = random(0.01, 0.07);
    
    this.hues = [];
    this.upper = 225;
    this.lower = 170;
    this.colors = [];
    
    this.eggs = int(random(2, 6));
    this.cooldown = coolmax;
    this.birth = 0;
    this.mate = null;
    this.age = 0;
    this.dead = false;
    
    this.widths = [];
    this.mainseg = 0;
    
    if(parents.length == 0){
      this.upper = random(200,250);
      this.lower = random(150,190);
      for(let i = 0; i < 3; i++){
        this.hues[i] = random(1);
      }
      
      let segtotal = int(random(2,5));
      this.mainseg = int(random(segtotal));
      for(let i = 0; i < segtotal; i++){
        let w;
        if(i == this.mainseg){
          w = this.mainsize;
        } else {
          w = random(this.mainsize * 0.5, this.mainsize);
        }
        this.widths[this.widths.length] = w;
      }
    }
    if(parents.length == 2){
      this.mainsize = random(parents[0].fullbody.mainsize, parents[1].fullbody.mainsize) * random(1-mutate, 1+mutate);
      this.bdensity = constrain(random(parents[0].fullbody.bdensity, parents[1].fullbody.bdensity) * random(1-mutate, 1+mutate), 0.1, 0.9);
      this.cdensity = this.bdensity;
      this.stiffness = constrain(random(parents[0].fullbody.stiffness, parents[1].fullbody.stiffness) * random(1-mutate, 1+mutate), 0.1, 0.9);
      this.speed = random(parents[0].fullbody.speed, parents[1].fullbody.speed) * random(1-mutate, 1+mutate);
      
      this.upper = constrain(random(parents[0].upper, parents[1].upper) * random(1-mutate, 1+mutate), 200, 250);
      this.lower = constrain(random(parents[0].lower, parents[1].lower) * random(1-mutate, 1+mutate), 150, 190);
      for(let i = 0; i < 3; i++){
        this.hues[i] = constrain(random(parents[0].fullbody.hues[i], parents[1].fullbody.hues[i]) * random(1-mutate, 1+mutate), 0, 1);
      }
      
      let segtotal = int(random(parents[0].fullbody.widths.length, parents[1].fullbody.widths.length));
      if(random(1) < mutate && segtotal > 2){
        segtotal--;
      }
      if(random(1) < mutate){
        segtotal++;
      }
      if(random(1) > 0.5){
        this.mainseg = parents[0].fullbody.mainseg;
      } else {
        this.mainseg = parents[1].fullbody.mainseg;
      }
      if(random(1) < mutate){
        this.mainseg = int(random(segtotal));
      }
      for(let i = 0; i < segtotal; i++){
        let w;
        if(i == this.mainseg){
          w = this.mainsize;
        } else {
          w = random(this.mainsize * 0.5, this.mainsize);
        }
        this.widths[this.widths.length] = w;
      }
    }
    
    this.highhue = 0;
    for(let i = 1; i < 3; i++){
      if(this.hues[i] > this.hues[this.highhue]){
        this.highhue = i;
      }
    }
    for(let i = 0; i < this.widths.length; i++){
      let basehue = this.upper - (this.upper - this.lower) / (this.widths.length - 1) * i;
      let newhues = [];
      for(let j = 0; j < 3; j++){
        newhues[j] = basehue * this.hues[j] / this.hues[this.highhue];
        newhues[j] = constrain(newhues[j],0,255);
      }
      this.colors[i] = color(newhues[0],newhues[1],newhues[2]);
    }
    
    let tempmass = 0;
    let group = Body.nextGroup(true);
    
    this.chain = Composite.create();
    for(let i = 0; i < this.widths.length; i++){
      let options = {
        friction: 0.2,
        restitution: 0.6,
        density: this.bdensity
      };
      let body = Bodies.circle(0, 0, this.widths[i] / 2, options);
      tempmass += body.mass;
      Composite.add(this.chain, body);
      
      if(i != 0){
        let options = {
          bodyA: this.chain.bodies[i-1],
          bodyB: this.chain.bodies[i],
          pointA: createVector(this.widths[i-1] / 3, this.widths[i-1] / 3),
          pointB: createVector(this.widths[i] / -3, this.widths[i] / -3),
          length: 1,
          stiffness: this.stiffness
        };
        let constraint = Constraint.create(options);
        Composite.add(this.chain, constraint);
      }
    }
    this.energy = tempmass;
    this.energymax = this.energy * 2;
    Composite.translate(this.chain, createVector(x, y));
    
    World.add(world, this.chain);
  }
  
  update(){
    this.cooldown = constrain(this.cooldown-1, 0, coolmax);
    this.birth = constrain(this.birth-1, 0, birthmax);
    
    this.cdensity = map(this.energy, 0, this.energymax, this.bdensity * 0.5, this.bdensity * 1.5);
    for(let i = 0; i < this.chain.bodies.length; i++){
      this.chain.bodies[i].density = this.cdensity;
    }
    this.energy -= this.age * 0.0001;
    this.energy = constrain(this.energy, 0, this.energymax);
    if(this.energy == 0){
      this.dead = true;
    }
    this.age++;
  }
  
  show(){
    for(let i = 0; i < 2; i++){
      if(i == 0){
        stroke(0);
        strokeWeight(outline * 2);
      } else {
        noStroke();
      }
      for(let j = this.chain.bodies.length - 1; j > -1; j--){
        let pos = this.chain.bodies[j].position;
        let angle = this.chain.bodies[j].angle;
      
        fill(this.colors[j]);
        
        if(j != this.chain.bodies.length - 1){
          let pos2 = this.chain.bodies[j+1].position;
          let tilt = createVector(pos2.x - pos.x, pos2.y - pos.y);
          tilt.rotate(90);
          tilt.setMag(1);
          quad(pos.x + tilt.x * (this.widths[j] / 2 - outline), pos.y + tilt.y * (this.widths[j] / 2 - outline), pos.x - tilt.x * (this.widths[j] / 2 - outline), pos.y - tilt.y * (this.widths[j] / 2 - outline), pos2.x - tilt.x * (this.widths[j+1] / 2 - outline), pos2.y - tilt.y * (this.widths[j+1] / 2 - outline), pos2.x + tilt.x * (this.widths[j+1] / 2 - outline), pos2.y + tilt.y * (this.widths[j+1] / 2 - outline));
        }
        
        push();
        translate(pos.x, pos.y);
        rotate(degrees(angle));
        ellipse(0, 0, this.widths[j] - outline * 2);
        pop();
      }
    }
    
    let pos = this.chain.bodies[0].position;
    let pos2 = this.chain.bodies[1].position;
    let mouth = createVector(pos2.x - pos.x, pos2.y - pos.y);
    mouth.setMag(this.widths[0] / 2 - outline);
    mouth.rotate(90);
    stroke(0);
    strokeWeight(outline);
    line(this.chain.bodies[0].position.x - mouth.x, this.chain.bodies[0].position.y - mouth.y, this.chain.bodies[0].position.x + mouth.x, this.chain.bodies[0].position.y + mouth.y);
  }
  
  showinfo(){
    noStroke();
    rectMode(CENTER);
    fill(0);
    rect(this.chain.bodies[0].position.x, this.chain.bodies[0].position.y - 50, 70, 25);
    fill(255, 0, 0);
    rect(this.chain.bodies[0].position.x, this.chain.bodies[0].position.y - 50, 60, 15);
    fill(0, 255, 0);
    let bar = (this.energy / this.energymax) * 60;
    rect(this.chain.bodies[0].position.x - 30 + bar / 2, this.chain.bodies[0].position.y - 50, bar, 15);
    
    if(this.birth > 0){
      fill(0);
      rect(this.chain.bodies[0].position.x, this.chain.bodies[0].position.y - 65, 70, 25);
      fill(255, 0, 0);
      rect(this.chain.bodies[0].position.x, this.chain.bodies[0].position.y - 65, 60, 15);
      fill(0, 0, 255);
      let bar = ((birthmax - this.birth) / birthmax) * 60;
      rect(this.chain.bodies[0].position.x - 30 + bar / 2, this.chain.bodies[0].position.y - 65, bar, 15);
    }
  }
}

class Brain{
  constructor(parents){
    this.in1 = ["Energy", "Speed", "Cycle", "Constant", "Noise"];
    this.in2 = ["Random", "Aggro"];
    this.in3 = ["North", "South", "West", "East"];
    this.inputs = [];
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < this.in1.length; j++){
        this.inputs[this.inputs.length] = this.in1[j];
      }
      if(i > 0){
        for(let j = 0; j < this.in2.length; j++){
          this.inputs[this.inputs.length] = this.in2[j];
        }
        if(i > 1){
          for(let j = 0; j < this.in3.length; j++){
            this.inputs[this.inputs.length] = this.in3[j];
          }
        }
      }
    }
    
    this.out1 = ["Move"];
    this.out2 = ["RotateLeft", "RotateRight", "RaiseAggro", "LowerAggro"];
    this.out3 = [];
    this.outputs = [];
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < this.out1.length; j++){
        this.outputs[this.outputs.length] = this.out1[j];
      }
      if(i > 0){
        for(let j = 0; j < this.out2.length; j++){
          this.outputs[this.outputs.length] = this.out2[j];
        }
        if(i > 1){
          for(let j = 0; j < this.out3.length; j++){
            this.outputs[this.outputs.length] = this.out3[j];
          }
        }
      }
    }
    this.varnum = int(random(1,4));
    this.connections = [];
    this.variables = [];
    
    this.seed = random(100000);
    this.rate = random(0.01, 0.1);
    this.cycle = int(random(60, 600));
    this.current = 0;
    this.flip = false;
    this.aggro = 0.5;
    
    if(parents.length == 0){
      let adds = int(random(6, 12));
      for(let i = 0; i < adds; i++){
        let newinput;
        let newoutput;
        if(random(1) < 0.75){
          newinput = this.inputs[int(random(this.inputs.length))];
        } else {
          newinput = "Variable";
        }
        if(random(1) < 0.75){
          newoutput = this.outputs[int(random(this.outputs.length))];
        } else {
          newoutput = "Variable";
        }
        
        let inn = 0;
        let outn = 0;
        if(newinput == "Variable"){
          inn = int(random(this.varnum + 1));
        }
        if(newoutput == "Variable"){
          outn = int(random(this.varnum + 1));
        }
        
        this.connections.push(new Connection(newinput, newoutput, inn, outn, random(-2, 2)));
      }
    }
    
    if(parents.length == 2){
      this.varnum = int(random(parents[0].brain.varnum, parents[0].brain.varnum));
      if(random(1) < mutate && this.varnum > 1){
        this.varnum--;
      }
      if(random(1) < mutate){
        this.varnum++;
      }
      
      this.rate = constrain(random(parents[0].brain.rate, parents[1].brain.rate) * random(1-mutate, 1+mutate), 0.01, 0.1);
      this.cycle = constrain(int(random(parents[0].brain.cycle, parents[1].brain.cycle) * random(1-mutate, 1+mutate)), 60, 600);
      
      let adds = int(random(parents[0].brain.connections.length, parents[1].brain.connections.length));
      if(random(1) < mutate && adds > 1){
        adds--;
      }
      if(random(1) < mutate){
        adds++;
      }
      
      for(let i = 0; i < adds; i++){
        if(random(1) < mutate){
          let newinput;
          let newoutput;
          if(random(1) < 0.75){
            newinput = this.inputs[int(random(this.inputs.length))];
          } else {
            newinput = "Variable";
          }
          if(random(1) < 0.75){
            newoutput = this.outputs[int(random(this.outputs.length))];
          } else {
            newoutput = "Variable";
          }
        
          let inn = 0;
          let outn = 0;
          if(newinput == "Variable"){
            inn = int(random(this.varnum + 1));
          }
          if(newoutput == "Variable"){
            outn = int(random(this.varnum + 1));
          }
        
          this.connections.push(new Connection(newinput, newoutput, inn, outn, random(-2, 2)));
        } else {
          let maybes = [];
          for(let j = 0; j < parents[0].brain.connections.length; j++){
            maybes.push(0);
          }
          for(let j = 0; j < parents[1].brain.connections.length; j++){
            maybes.push(1);
          }
          let choice = maybes[int(random(maybes.length))];
          let clone = parents[choice].brain.connections[ int(random(parents[choice].brain.connections.length)) ];
          this.connections.push(new Connection(clone.cinput, clone.coutput, clone.inn, clone.outn, constrain(clone.strength * random(1-mutate, 1+mutate), -2, 2)));
        }
      }
    }
    
    for(let i = 0; i < this.varnum; i++){
      this.variables[i] = 0;
    }
  }
  
  update(body){
    if(!this.flip){
      this.current++;
      if(this.current == this.cycle){
        this.flip = true;
      }
    } else {
      this.current--;
      if(this.current == 0){
        this.flip = false;
      }
    }
    
    let tempouts = [];
    let tempvar = [];
    for(let i = 0; i < this.outputs.length; i++){
      tempouts[i] = 0;
    }
    for(let i = 0; i < this.varnum; i++){
      tempvar[i] = this.variables[i];
    }
    
    for(let i = 0; i < this.connections.length; i++){
      let inp = 0;
      
      if(this.connections[i].cinput == "North"){
        let angle = degrees(body.chain.bodies[0].angle);
        angle = (angle + 90) % 360;
        inp = map(180 - abs(180 - angle), 0, 180, 0, 1);
      }
      if(this.connections[i].cinput == "South"){
        let angle = degrees(body.chain.bodies[0].angle);
        angle = (angle - 90) % 360;
        inp = map(180 - abs(180 - angle), 0, 180, 0, 1);
      }
      if(this.connections[i].cinput == "West"){
        let angle = degrees(body.chain.bodies[0].angle);
        inp = map(180 - abs(180 - angle), 0, 180, 0, 1);
      }
      if(this.connections[i].cinput == "East"){
        let angle = degrees(body.chain.bodies[0].angle);
        angle = (angle + 180) % 360;
        inp = map(180 - abs(180 - angle), 0, 180, 0, 1);
      }
      if(this.connections[i].cinput == "Energy"){
        inp = map(body.energy, 0, body.energymax, 0, 1);
      }
      if(this.connections[i].cinput == "Speed"){
        inp = map(Body.getSpeed(body.chain.bodies[0]), 0, 4, 0, 1);
      }
      if(this.connections[i].cinput == "Cycle"){
        inp = map(this.current, 0, this.cycle, 0, 1);
      }
      if(this.connections[i].cinput == "Noise"){
        inp = map(noise(body.age * this.rate + this.seed), 0, 1, 0, 1);
      }
      if(this.connections[i].cinput == "Aggro"){
        inp = this.aggro;
      }
      if(this.connections[i].cinput == "Random"){
        inp = random(1);
      }
      if(this.connections[i].cinput == "Constant"){
        inp = 1;
      }
      if(this.connections[i].cinput == "Variable"){
        inp = this.variables[this.connections[i].inn];
      }
      
      inp *= this.connections[i].strength;
      
      if(this.connections[i].coutput == "Variable"){
        tempvar[this.connections[i].outn] += inp;
      } else {
        for(let j = 0; j < tempouts.length; j++){
          if(this.outputs[j] == this.connections[i].coutput){
            tempouts[j] += inp;
          }
        }
      }
    }
    
    for(let i = 0; i < this.varnum; i++){
      this.variables[i] = constrain(tempvar[i], -1, 1);
    }
    for(let i = 0; i < tempouts.length; i++){
      tempouts[i] = constrain(tempouts[i], -1, 1);
    }
    
    let actions = [];
    let moved = false;
    for(let i = 0; i < tempouts.length; i++){
      if(this.outputs[i] == "Move"){
        if(tempouts[i] > 0.5){
          actions[actions.length] = "Move";
          moved = true;
        }
      }
      if(this.outputs[i] == "RotateLeft"){
        if(tempouts[i] > 0.5){
          actions[actions.length] = "RotateLeft";
        }
      }
      if(this.outputs[i] == "RotateRight"){
        if(tempouts[i] > 0.5){
          actions[actions.length] = "RotateRight";
        }
      }
      if(this.outputs[i] == "RaiseAggro"){
        if(tempouts[i] > 0.5){
          actions[actions.length] = "RaiseAggro";
        }
      }
      if(this.outputs[i] == "LowerAggro"){
        if(tempouts[i] > 0.5){
          actions[actions.length] = "LowerAggro";
        }
      }
    }
    if(moved){
      for(let i = 0; i < actions.length; i++){
        if(actions[i] == "RotateLeft" || actions[i] == "RotateRight"){
          actions.splice(i,1);
          i--;
        }
      }
    }
    
    for(let i = 0; i < actions.length; i++){
      if(actions[i] == "Move"){
        let chain1 = createVector(body.chain.bodies[0].position.x, body.chain.bodies[0].position.y);
        let chain2 = createVector(body.chain.bodies[1].position.x - chain1.x, body.chain.bodies[1].position.y - chain1.y);
        chain2.setMag(30);
        chain2.add(chain1);
        let force = createVector(chain1.x - chain2.x, chain1.y - chain2.y);
        force.setMag(body.speed);
        Body.applyForce(body.chain.bodies[0], chain2, force);
          
        body.energy -= body.speed * 3;
      }
      if(actions[i] == "RotateLeft"){
        let chain1 = createVector(body.chain.bodies[0].position.x, body.chain.bodies[0].position.y);
        let chain2 = createVector(body.chain.bodies[1].position.x - chain1.x, body.chain.bodies[1].position.y - chain1.y);
        chain2.setMag(30);
        chain2.rotate(270);
        chain2.add(chain1);
        let force = createVector(chain1.x - chain2.x, chain1.y - chain2.y);
        force.setMag(body.speed / 2);
        Body.applyForce(body.chain.bodies[0], chain2, force);
          
        body.energy -= body.speed * 1.5;
      }
      if(actions[i] == "RotateRight"){
        let chain1 = createVector(body.chain.bodies[0].position.x, body.chain.bodies[0].position.y);
        let chain2 = createVector(body.chain.bodies[1].position.x - chain1.x, body.chain.bodies[1].position.y - chain1.y);
        chain2.setMag(30);
        chain2.rotate(90);
        chain2.add(chain1);
        let force = createVector(chain1.x - chain2.x, chain1.y - chain2.y);
        force.setMag(body.speed / 2);
        Body.applyForce(body.chain.bodies[0], chain2, force);
          
        body.energy -= body.speed * 1.5;
      }
      if(actions[i] == "RaiseAggro"){
        this.aggro = constrain(this.aggro + 0.05, 0, 1);
      }
      if(actions[i] == "LowerAggro"){
        this.aggro = constrain(this.aggro - 0.05, 0, 1);
      }
    }
  }
}

class Connection{
  constructor(cinput, coutput, inn, outn, strength){
    this.cinput = cinput;
    this.coutput = coutput;
    this.inn = inn;
    this.outn = outn;
    this.strength = strength;
  }
}

class Food{
  constructor(x, y, r){
    let options = {
      friction: 0.2,
      restitution: 0.6,
      density: 0.5
    };
    this.body = Bodies.circle(x, y, r, options);
    this.r = r;
    World.add(world, this.body);
  }

  show(){
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(degrees(angle));
    noStroke();
    fill(200);
    ellipse(0, 0, this.r * 2);
    pop();
  }
}

class Boundary{
  constructor(x, y, w, h){
    let options = {
      friction: 0.3,
      restitution: 0.6,
      isStatic: true,
    };
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    World.add(world, this.body);
  }

  show(){
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(degrees(angle));
    rectMode(CENTER);
    noStroke();
    rect(0, 0, this.w, this.h);
    pop();
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}