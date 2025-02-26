let handPose;
let video;
let myFont;
let hands = [];
let w = 640;
let h = 480;
let wasPinched = false;
let delay = 0;
let delayMax = 30;
let letters = [];
let letterCircle = [];
let radius = 150;
let angleStep;
let rotationAngle = 0;
let selected = 0;

let options = {
  maxHands: 2,
  flipped: true,
  runtime: "mediapipe",
  modelType: "lite",
};

function preload() {
  // load the handPose model
  handPose = ml5.handPose(options);
  
  myFont = loadFont('Offside-Regular.ttf');
}

function setup() {
  createCanvas(w, h);
  rectMode(CENTER);
  
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  textFont(myFont);
  textAlign(CENTER, CENTER);
  angleStep = TWO_PI / letters.length;
  
  for(let i = 0; i < letters.length; i++){
    let angle = i * angleStep;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    
    letterCircle.push(new Letter(x, y, letters[i], 20, true));
  }
  
  // create the webcam video and hide it
  video = createCapture(VIDEO, { flipped: true });
  video.size(w, h);
  video.hide();
  
  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
}

function draw(){
  delay = constrain(delay - 1, 0, delayMax);
  
  // draw the webcam video
  image(video, 0, 0, width, height);

  let leftHand;
  let rightHand;
  let circleDistance = 600;
  if(hands.length > 1){
    if(hands[0].wrist.x < hands[1].wrist.x){
      leftHand = hands[0];
      rightHand = hands[1];
    } else {
      leftHand = hands[1];
      rightHand = hands[0];
    }
    circleDistance = constrain(dist(rightHand.index_finger_tip.x, rightHand.index_finger_tip.y, width * 0.9, height * 0.9) - radius, 0, 600);
    rotationAngle += map(circleDistance, 0, 600, 0, 0.02);
    if(circleDistance < 35){
      let closest = 0;
      let leastDistance = 600;
      for(let i = 0; i < letterCircle.length; i++){
        let newDistance = dist(rightHand.index_finger_tip.x, rightHand.index_finger_tip.y, letterCircle[i].x + width * 0.9, letterCircle[i].y + height * 0.9);
        if(newDistance < leastDistance){
          leastDistance = newDistance;
          closest = i;
        }
      }
      selected = closest;
    }
  } else {
    rotationAngle += 0.02;
    
    if(hands.length == 1){
      leftHand = hands[0];
    }
  }
  
  if(hands.length > 0){
    let fingerDistance = floor(dist(leftHand.thumb_tip.x, leftHand.thumb_tip.y, leftHand.index_finger_tip.x, leftHand.index_finger_tip.y))
    
    if(fingerDistance < 20){
      if(wasPinched == false && delay == 0){
        wasPinched = true;
        delay = delayMax;
        letters.push(new Letter(leftHand.index_finger_tip.x, leftHand.index_finger_tip.y, letterCircle[selected].type, 20, false));
      }
    } else if(fingerDistance >= 30 && wasPinched == true){
      wasPinched = false;
    }
  }
  
  for(let i = 0; i < letterCircle.length; i++){
    letterCircle[i].x = cos(i * angleStep + rotationAngle) * radius;
    letterCircle[i].y = sin(i * angleStep + rotationAngle) * radius;
  }
  
  for(let i = 0; i < letters.length; i++){
    fill(0);
    rect(letters[i].x, letters[i].y, 35, 35);
  }
  
  for(let i = 0; i < letters.length; i++){
    letters[i].display();
  }
  
  push();
  translate(width * 0.9, height * 0.9);
  fill(0);
  circle(0, 0, radius * 2.3);
  
  for(let i = 0; i < letterCircle.length; i++){
    letterCircle[i].display();
    if(i == selected){
      push();
      stroke(255);
      strokeWeight(4);
      noFill();
      circle(letterCircle[i].x, letterCircle[i].y, 45);
      pop();
    }
  }
  pop();
}

function keyPressed(){
  if(key == " "){
    print(hands);
  }
}

// callback function for when handPose outputs data
function gotHands(results){
  // save the output to the hands variable
  hands = results;
}

class Letter{
  constructor(x, y, type, size, onCircle){
    this.x = x;
    this.y = y;
    this.type = type;
    this.onCircle = onCircle;
  }
  
  display(){
    if(this.onCircle){
      fill(lerpColor(color('#ff5959'), color('#5959ff'), sin(frameCount * 0.05) * 0.5 + 0.5));
    } else {
      fill(255);
    }
    textSize(30);
    text(this.type, this.x, this.y);
  }
}