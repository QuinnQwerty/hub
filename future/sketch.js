let visualsW = 150;
let visualsH = 100;
let realW = 150;
let realH = 100;
let border = 0.1;
let borderSize = 10;
let slide = 0;
let wasPressed = false;
let selecting = false;
let sprites = [];
let imgQwerty;

function preload(){
  imgQwerty = loadImage("Qwerty V2.png");
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  imageMode(CENTER);
  angleMode(DEGREES);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textFont('Courier New');
  
  let mainThings = [[], [["Animation I: Drawing For Animation", color(65,130,115)], ["Meeting With Urban Arts", color(70,145,55)], ["Obtain Driver's License!", color(180,75,125)]], [["Intro To Experimental 3D", color(65,130,115)], ["Cinema Histories", color(85,80,135)], ["Digital Music", color(65,130,115)], ["The Art Of Rational Thinking", color(155,145,70)], ["Professional Practice: Web Art", color(65,130,115)]], [["Relax :)", color(180,75,125)], ["Build Up Portfolio!", color(70,145,55)]], [["Code Sourcery: Algorithmic Practices", color(65,130,115)], ["Introduction To Philosophy", color(85,80,135)], ["Video Game Music Composition", color(65,130,115)], ["Animal Behavior?", color(85,80,135)]], [["Urban Arts Internship?", color(70,145,55)], ["Big Blue Bubble Internship?", color(70,145,55)], ["Begin A Large Project?", color(70,145,55)]], [["Art Games", color(65,130,115)], ["Ethics", color(85,80,135)], ["Virtual Reality?", color(65,130,115)], ["Anti-Art", color(85,80,135)]], [["Relax :)", color(180,75,125)], ["Build Up Portfolio!", color(70,145,55)]], [["Senior Capstone", color(65,130,115)], ["Existentalism", color(85,80,135)], ["Experimental Game Lab", color(65,130,115)], ["Philosophy Of Online Interactions", color(85,80,135)]], [["Graduation!", color(70,145,55)], ["Start A Major Game Project...", color(70,145,55)], ["Career At Big Blue Bubble?", color(70,145,55)]]];
  let thLength = 1/mainThings.length;
  for(let i = 0; i < mainThings.length; i++){
    let divide = 0.84/mainThings[i].length;
    for(let j = 0; j < mainThings[i].length; j++){
      let w = 150;
      let h = 100;
      let newY = 0.16+(divide*(0.5+j))+random(-divide/5, divide/5);
      let timeLength = random(0.5, 1)*thLength;
      let startT = random(thLength*i, (thLength*(i+1))-timeLength);
      let endT = startT+timeLength;
      sprites.push(new Sprite(new Visual("TextSquare", [mainThings[i][j][0], mainThings[i][j][1], w, h]), -0.1, newY, 0.18, 0, [new Behavior("Show", startT, endT, []), new Behavior("Move", startT, endT, ["Normal", 1.2, 0, 1, 0])]));
    }
  }
  sprites.push(new Sprite(new Visual("Image", [imgQwerty]), 0.5, 0.835, 0.13, 0, [new Behavior("Show", 0, 1, []), new Behavior("Move", 0, 0.5, ["Exponential", -0.3, -0.2, 0.7, -10]), new Behavior("Move", 0.5, 1, ["Still", -0.3, -0.2, 0.7, -10])]));
  let titles = ["THE PRESENT", "SUMMER 2025", "FALL 2025", "WINTER 2026", "SPRING 2026", "SUMMER 2026", "FALL 2026", "WINTER 2027", "SPRING 2027", "ONWARDS..."];
  for(let i = 0; i < titles.length; i++){
    let newBehaviors = [];
    let tLength = 1/titles.length;
    newBehaviors.push(new Behavior("Show", tLength*i, tLength*(i+1), []));
    if(i != 0){
      newBehaviors.push(new Behavior("Move", tLength*i, tLength*(i+0.2), ["ExponentialReverse", 0, -0.16, 1, 0]));
    }
    if(i != titles.length-1){
      newBehaviors.push(new Behavior("Move", tLength*(i+0.8), tLength*(i+1), ["Exponential", 0, -0.16, 1, 0]));
    }
    sprites.push(new Sprite(new Visual("Text", [titles[i]]), 0.5, 0.08, 1, 0, newBehaviors));
  }
}

function draw(){
  if(height > width){
    borderSize = width*border;
  } else {
    borderSize = height*border;
  }
  if(width-(borderSize*2) > (height-(borderSize*2))*(visualsW/visualsH)){
    realW = (height-(borderSize*2))*(visualsW/visualsH);
    realH = height-(borderSize*2);
  } else {
    realW = width-(borderSize*2);
    realH = (width-(borderSize*2))*(visualsH/visualsW);
  }
  let sliderSize = borderSize*0.1;
  let dragSize = borderSize*0.35;
  let sliderLength = width-borderSize-sliderSize;
  let dragX = (borderSize+sliderSize)/2+(sliderLength*slide);
  let dragY = height-(borderSize/2);
  
  let hover = false;
  if(dist(mouseX, mouseY, dragX, dragY) < dragSize/2){
    hover = true;
    if(mouseIsPressed && !wasPressed){
      selecting = true;
    }
  }
  if(!mouseIsPressed && selecting){
    selecting = false;
  }
  if(selecting){
    dragX = constrain(mouseX, (borderSize+sliderSize)/2, (borderSize+sliderSize)/2+sliderLength);
    slide = (dragX-((borderSize+sliderSize)/2))/sliderLength*0.999;
  }
  wasPressed = mouseIsPressed;
  
  background(24);
  push();
  translate(width/2, height/2);
  for(let i = 0; i < sprites.length; i++){
    sprites[i].display();
  }
  pop();
  
  fill(18);
  noStroke();
  let borderW = (width-realW)/2;
  let borderH = (height-realH)/2;
  rect(width/2, borderH/2, width, borderH);
  rect(width/2, height-(borderH/2), width, borderH);
  rect(borderW/2, height/2, borderW, height);
  rect(width-(borderW/2), height/2, borderW, height);
  
  fill(12);
  rect(width/2, borderSize/2, width, borderSize);
  rect(width/2, height-(borderSize/2), width, borderSize);
  rect(borderSize/2, height/2, borderSize, height);
  rect(width-(borderSize/2), height/2, borderSize, height);
  
  fill(255);
  rect(width/2, height-(borderSize/2), sliderLength, sliderSize);
  ellipse((width/2)-(sliderLength/2), height-(borderSize/2), sliderSize, sliderSize);
  ellipse((width/2)+(sliderLength/2), height-(borderSize/2), sliderSize, sliderSize);
  let newDragSize = dragSize;
  if(hover && !selecting){
    newDragSize = dragSize*1.5;
  }
  ellipse(dragX, dragY, newDragSize, newDragSize);
  
  textSize(20);
  text("Drag the slider below to move through the future!", width/2, borderSize/2);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

class Sprite{
  constructor(visual, xRatio, yRatio, scaleBy, rotation, behaviors){
    this.visual = visual;
    this.xRatio = xRatio;
    this.yRatio = yRatio;
    this.scaleBy = scaleBy;
    this.rotation = rotation;
    this.behaviors = behaviors;
  }
  
  display(){
    let show = false;
    for(let i = 0; i < this.behaviors.length; i++){
      let choose = this.behaviors[i];
      if(choose.start <= slide && choose.end > slide){
        if(choose.type == "Show"){
          show = true;
        }
      }
    }
    
    if(show){
      push();
      let newXRatio = this.xRatio;
      let newYRatio = this.yRatio;
      let newScaleBy = this.scaleBy;
      let newRotation = this.rotation;
      for(let i = 0; i < this.behaviors.length; i++){
        let choose = this.behaviors[i];
        if(choose.start <= slide && choose.end > slide){
          if(choose.type == "Move"){
            newXRatio += choose.getValue("X", map(slide, choose.start, choose.end, 0, 1));
            newYRatio += choose.getValue("Y", map(slide, choose.start, choose.end, 0, 1));
            newScaleBy *= choose.getValue("Scale", map(slide, choose.start, choose.end, 0, 1));
            newRotation += choose.getValue("Rotation", map(slide, choose.start, choose.end, 0, 1));
          }
        }
      }
      
      translate((newXRatio-0.5)*realW, (newYRatio-0.5)*realH);
      scale(newScaleBy*(realW/visualsW));
      rotate(newRotation);
      this.visual.display();
      pop();
    }
  }
}

class Visual{
  constructor(type, details){
    this.type = type;
    this.details = details;
  }
  
  display(){
    if(this.type == "Image"){
      image(this.details[0], 0, 0);
    }
    if(this.type == "Text"){
      textSize(10);
      text(this.details[0], 0, 0);
    }
    if(this.type == "TextSquare"){
      fill(this.details[1]);
      noStroke(0);
      rect(0, 0, this.details[2], this.details[3]);
      fill(255);
      textSize(20);
      text(this.details[0], 0, 0, this.details[2], this.details[3]);
    }
  }
}

class Behavior{
  constructor(type, start, end, details){
    this.type = type;
    this.start = start;
    this.end = end;
    this.details = details;
  }
  
  getValue(type, time){
    let response = 0;
    let interval = time;
    if(this.details[0] == "Reverse"){
      interval = 1-time;
    }
    if(this.details[0] == "Exponential"){
      interval = 1-pow(1-time, 2.5);
    }
    if(this.details[0] == "ExponentialReverse"){
      interval = pow(1-time, 2.5);
    }
    if(this.details[0] == "Still"){
      interval = 1;
    }
    if(type == "X"){
      response = map(interval, 0, 1, 0, this.details[1]);
    }
    if(type == "Y"){
      response = map(interval, 0, 1, 0, this.details[2]);
    }
    if(type == "Scale"){
      response = map(interval, 0, 1, 1, this.details[3]);
    }
    if(type == "Rotation"){
      response = map(interval, 0, 1, 0, this.details[4]);
    }
    return response;
  }
}