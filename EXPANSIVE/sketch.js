let ratio, focus;
let borderratio = 0.06;
let windows = [];
let buttons = [];
let outline = 2;
let captions = true;

function setup(){
  createCanvas(windowWidth, windowHeight);
  ratio = height / width;
  focus = [0];
  windows[0] = new Window("universe", [], 0);
  update();
  
  textAlign(LEFT, CENTER);
  textFont('Courier New');
}

function draw(){
  background(0);
  
  for(let i = 0; i < windows.length; i++){
    windows[i].show();
  }
  for(let i = 0; i < buttons.length; i++){
    buttons[i].show();
  }
}

function mouseClicked(){
  let clicked = null;
  for(let i = 0; i < buttons.length; i++){
    b = buttons[i];
    if(hover(b.x, b.y, b.w, b.h)){
      clicked = i;
    }
  }
  
  if(clicked != null){
    buttons[clicked].activate();
  }
}

function update(){
  buttons = [];
  for(let i = 0; i < windows.length; i++){
    windows[i].cleardisplay();
  }
  
  let w = windows[focus[0]];
  for(let i = 0; i < focus.length - 1; i++){
    w = w.children[focus[i+1]];
  }
  w.updatedisplay(width, 0, 0);
}

function hover(x, y, w, h){
  let result = false;
  if(mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h){
    result = true;
  }
  return result;
}

class Button{
  constructor(type, x, y, w, h, identity){
    this.type = type;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.identity = [];
    for(let i = 0; i < identity.length; i++){
      this.identity[i] = identity[i];
    }
  }
  
  activate(){
    if(this.type == "expand" || this.type == "shrink"){
      let w = windows[focus[0]];
      for(let i = 0; i < this.identity.length - 1; i++){
        w = w.children[this.identity[i+1]];
      }
      if(this.type == "expand"){
        w.mode = "contents";
      }
      if(this.type == "shrink"){
        w.mode = "name";
      }
      update();
    }
    if(this.type == "zoomin"){
      focus = this.identity;
      update();
    }
    if(this.type == "zoomout"){
      this.identity.splice(this.identity.length - 1, 1);
      focus = this.identity;
      update();
    }
  }
  
  show(){
    if(this.type == "expand" || this.type == "shrink" || this.type == "zoomin" || this.type == "zoomout"){
      noStroke();
      
      if(this.type == "shrink" || this.type == "zoomin" || this.type == "zoomout"){
        stroke(255);
        strokeWeight(outline);
      }
      let ishover = hover(this.x, this.y, this.w, this.h);
      
      fill(40);
      if(ishover){
        fill(100);
      }
      rect(this.x + outline/2, this.y + outline/2, this.w - outline, this.h - outline);
      
      noStroke();
      fill(150);
      if(ishover){
        fill(255);
      }
      if(this.type == "expand" || this.type == "shrink"){
        rect(this.x + this.w * 0.2, this.y + this.h * 0.4, this.w * 0.6, this.h * 0.2);
      }
      if(this.type == "expand"){
        rect(this.x + this.w * 0.4, this.y + this.h * 0.2, this.w * 0.2, this.h * 0.6);
      }
      if(this.type == "zoomin"){
        triangle(this.x + this.w * 0.5, this.y + this.h * 0.2, this.x + this.w * 0.2, this.y + this.h * 0.8, this.x + this.w * 0.8, this.y + this.h * 0.8);
      }
      if(this.type == "zoomout"){
        triangle(this.x + this.w * 0.5, this.y + this.h * 0.8, this.x + this.w * 0.2, this.y + this.h * 0.2, this.x + this.w * 0.8, this.y + this.h * 0.2);
      }
    }
  }
}

class Window{
  constructor(name, parent, id){
    this.name = name;
    this.parent = parent;
    this.identity = [];
    for(let i = 0; i < this.parent.length; i++){
      this.identity[i] = this.parent[i];
    }
    if(this.parent.length == 0){
      this.biggest = true;
    } else {
      this.biggest = false;
    }
    this.identity.push(id);
    this.children = [];
    this.mode = "name";
    this.caption = null;
    
    this.showing = false;
    this.showsize = 0;
    this.x = 0;
    this.y = 0;
    
    let newchildren = [];
    if(this.name == "universe"){
      newchildren.push("supercluster");
    }
    if(this.name == "supercluster"){
      newchildren.push("galaxy");
    }
    if(this.name == "galaxy"){
      newchildren.push("black hole");
      newchildren.push("dark matter");
      newchildren.push("solar system");
    }
    if(this.name == "black hole"){
      newchildren.push("dense matter");
      newchildren.push("singularity");
    }
    if(this.name == "dense matter"){
      newchildren.push("???");
    }
    if(this.name == "singularity"){
      newchildren.push("???");
    }
    if(this.name == "dark matter"){
      newchildren.push("???");
    }
    if(this.name == "solar system"){
      newchildren.push("gas giant");
      newchildren.push("ice giant");
      newchildren.push("planet");
      newchildren.push("sun");
    }
    if(this.name == "gas giant"){
      newchildren.push("helium");
      newchildren.push("hydrogen");
      newchildren.push("rings");
    }
    if(this.name == "helium"){
      newchildren.push("electron");
      newchildren.push("neutron");
      newchildren.push("proton");
    }
    if(this.name == "electron"){
      newchildren.push("???");
    }
    if(this.name == "neutron"){
      newchildren.push("down quark");
      newchildren.push("up quark");
    }
    if(this.name == "down quark"){
      newchildren.push("???");
    }
    if(this.name == "up quark"){
      newchildren.push("???");
    }
    if(this.name == "proton"){
      newchildren.push("down quark");
      newchildren.push("up quark");
    }
    if(this.name == "hydrogen"){
      newchildren.push("electron");
      newchildren.push("proton");
    }
    if(this.name == "rings"){
      newchildren.push("ice");
      newchildren.push("rock");
    }
    if(this.name == "ice"){
      newchildren.push("water");
    }
    if(this.name == "water"){
      newchildren.push("hydrogen");
      newchildren.push("oxygen");
    }
    if(this.name == "oxygen"){
      newchildren.push("electron");
      newchildren.push("neutron");
      newchildren.push("proton");
    }
    if(this.name == "rock"){
      newchildren.push("oxygen");
      newchildren.push("silicon");
    }
    if(this.name == "silicon"){
      newchildren.push("electron");
      newchildren.push("neutron");
      newchildren.push("proton");
    }
    if(this.name == "ice giant"){
      newchildren.push("ice");
    }
    if(this.name == "planet"){
      newchildren.push("cold landmass");
      newchildren.push("grassy landmass");
      newchildren.push("ocean");
      newchildren.push("rocky landmass");
      newchildren.push("sandy landmass");
      newchildren.push("sky");
    }
    if(this.name == "cold landmass"){
      newchildren.push("frigid waters");
      newchildren.push("tundra");
    }
    if(this.name == "frigid waters"){
      newchildren.push("abyss");
      newchildren.push("beluga");
      newchildren.push("fish");
      newchildren.push("iceberg");
      newchildren.push("walrus");
      newchildren.push("water");
    }
    if(this.name == "abyss"){
      newchildren.push("jellyfish");
      newchildren.push("octopus");
      newchildren.push("phytoplankton");
      newchildren.push("sponge");
    }
    if(this.name == "jellyfish"){
      newchildren.push("bell");
      newchildren.push("tentacle");
    }
    if(this.name == "bell"){
      newchildren.push("animal cells");
      newchildren.push("nerves");
    }
    if(this.name == "animal cells"){
      newchildren.push("dna");
      newchildren.push("membrane");
      newchildren.push("mitochondria");
    }
    if(this.name == "dna"){
      newchildren.push("proteins");
    }
    if(this.name == "proteins"){
      newchildren.push("carbon");
      newchildren.push("hydrogen");
      newchildren.push("nitrogen");
      newchildren.push("oxygen");
    }
    if(this.name == "carbon"){
      newchildren.push("electron");
      newchildren.push("neutron");
      newchildren.push("proton");
    }
    if(this.name == "nitrogen"){
      newchildren.push("electron");
      newchildren.push("neutron");
      newchildren.push("proton");
    }
    if(this.name == "membrane"){
      newchildren.push("proteins");
    }
    if(this.name == "mitochondria"){
      newchildren.push("proteins");
    }
    if(this.name == "nerves"){
      newchildren.push("animal cells");
    }
    if(this.name == "tentacle"){
      newchildren.push("nerves");
    }
    if(this.name == "octopus"){
      newchildren.push("gilled head");
      newchildren.push("guts");
      newchildren.push("ink sac");
      newchildren.push("tentacle");
    }
    if(this.name == "gilled head"){
      newchildren.push("brain");
      newchildren.push("eye");
      newchildren.push("gills");
      newchildren.push("mouth");
    }
    if(this.name == "brain"){
      newchildren.push("nerves");
      newchildren.push("neurons");
      newchildren.push("synapses");
    }
    if(this.name == "neurons"){
      newchildren.push("animal cells");
    }
    if(this.name == "synapses"){
      newchildren.push("animal cells");
    }
    if(this.name == "eye"){
      newchildren.push("animal cells");
      newchildren.push("nerves");
    }
    if(this.name == "gills"){
      newchildren.push("animal cells");
    }
    if(this.name == "mouth"){
      newchildren.push("muscle");
    }
    if(this.name == "muscle"){
      newchildren.push("nerves");
    }
    if(this.name == "guts"){
      newchildren.push("heart");
      newchildren.push("muscle");
    }
    if(this.name == "heart"){
      newchildren.push("blood");
      newchildren.push("oxygen");
    }
    if(this.name == "blood"){
      newchildren.push("proteins");
      newchildren.push("water");
    }
    if(this.name == "ink sac"){
      newchildren.push("ink");
      newchildren.push("muscle");
    }
    if(this.name == "ink"){
      newchildren.push("proteins");
    }
    if(this.name == "phytoplankton"){
      newchildren.push("animal cells");
    }
    if(this.name == "sponge"){
      newchildren.push("animal cells");
      newchildren.push("pores");
    }
    if(this.name == "pores"){
      newchildren.push("water");
    }
    if(this.name == "beluga"){
      newchildren.push("body");
      newchildren.push("fins");
      newchildren.push("head");
      newchildren.push("tail");
    }
    if(this.name == "body"){
      newchildren.push("guts");
      newchildren.push("muscle");
      newchildren.push("skeleton");
    }
    if(this.name == "skeleton"){
      newchildren.push("bone");
      newchildren.push("skull");
    }
    if(this.name == "bone"){
      newchildren.push("calcium");
    }
    if(this.name == "calcium"){
      newchildren.push("electron");
      newchildren.push("neutron");
      newchildren.push("proton");
    }
    if(this.name == "skull"){
      newchildren.push("bone");
    }
    if(this.name == "fins"){
      newchildren.push("muscle");
    }
    if(this.name == "head"){
      newchildren.push("brain");
      newchildren.push("eye");
      newchildren.push("mouth");
    }
    if(this.name == "tail"){
      newchildren.push("muscle");
    }
    if(this.name == "fish"){
      newchildren.push("body");
      newchildren.push("fins");
      newchildren.push("gilled head");
      newchildren.push("tail");
    }
    if(this.name == "iceberg"){
      newchildren.push("ice");
      newchildren.push("penguin");
    }
    if(this.name == "penguin"){
      newchildren.push("bird body");
      newchildren.push("bird head");
    }
    if(this.name == "bird body"){
      newchildren.push("feathers");
      newchildren.push("guts");
      newchildren.push("leg");
      newchildren.push("muscle");
      newchildren.push("skeleton");
      newchildren.push("wing");
    }
    if(this.name == "feathers"){
      newchildren.push("keratin");
    }
    if(this.name == "keratin"){
      newchildren.push("proteins");
    }
    if(this.name == "leg"){
      newchildren.push("foot");
      newchildren.push("muscle");
    }
    if(this.name == "foot"){
      newchildren.push("toe");
    }
    if(this.name == "toe"){
      newchildren.push("bone");
      newchildren.push("muscle");
    }
    if(this.name == "wing"){
      newchildren.push("bone");
      newchildren.push("feathers");
      newchildren.push("muscle");
    }
    if(this.name == "bird head"){
      newchildren.push("beak");
      newchildren.push("brain");
      newchildren.push("eye");
      newchildren.push("feathers");
    }
    if(this.name == "beak"){
      newchildren.push("keratin");
      newchildren.push("mouth");
    }
    if(this.name == "walrus"){
      newchildren.push("body");
      newchildren.push("flipper");
      newchildren.push("head");
      newchildren.push("tail");
      newchildren.push("tusks");
    }
    if(this.name == "flipper"){
      newchildren.push("muscle");
    }
    if(this.name == "tusks"){
      newchildren.push("calcium");
    }
    if(this.name == "tundra"){
      newchildren.push("bear");
      newchildren.push("fox");
      newchildren.push("grass");
      newchildren.push("gull");
      newchildren.push("hare");
      newchildren.push("moose");
      newchildren.push("moss");
      newchildren.push("owl");
      newchildren.push("wolf");
    }
    if(this.name == "bear"){
      newchildren.push("claws");
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
    }
    if(this.name == "claws"){
      newchildren.push("keratin");
    }
    if(this.name == "fur"){
      newchildren.push("hair");
    }
    if(this.name == "hair"){
      newchildren.push("keratin");
    }
    if(this.name == "quadruped body"){
      newchildren.push("guts");
      newchildren.push("leg");
      newchildren.push("muscle");
      newchildren.push("skeleton");
    }
    if(this.name == "fox"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "grass"){
      newchildren.push("plant cells");
    }
    if(this.name == "plant cells"){
      newchildren.push("dna");
      newchildren.push("membrane");
      newchildren.push("mitochondria");
    }
    if(this.name == "gull"){
      newchildren.push("bird body");
      newchildren.push("bird head");
    }
    if(this.name == "hare"){
      newchildren.push("ears");
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "ears"){
      newchildren.push("muscle");
    }
    if(this.name == "moose"){
      newchildren.push("antlers");
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
    }
    if(this.name == "antlers"){
      newchildren.push("bone");
    }
    if(this.name == "moss"){
      newchildren.push("plant cells");
    }
    if(this.name == "owl"){
      newchildren.push("bird body");
      newchildren.push("bird head");
    }
    if(this.name == "wolf"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "grassy landmass"){
      newchildren.push("bog");
      newchildren.push("plains");
      newchildren.push("rainforest");
      newchildren.push("woods");
    }
    if(this.name == "bog"){
      newchildren.push("alligator");
      newchildren.push("frog");
      newchildren.push("lake");
      newchildren.push("mosquito");
    }
    if(this.name == "alligator"){
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("scales");
      newchildren.push("tail");
    }
    if(this.name == "scales"){
      newchildren.push("animal cells");
    }
    if(this.name == "frog"){
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("tongue");
    }
    if(this.name == "tongue"){
      newchildren.push("muscle");
      newchildren.push("nerves");
    }
    if(this.name == "lake"){
      newchildren.push("beaver");
      newchildren.push("dragonfly");
      newchildren.push("duck");
      newchildren.push("fish");
      newchildren.push("flamingo");
      newchildren.push("lily pad");
      newchildren.push("otter");
      newchildren.push("water");
    }
    if(this.name == "beaver"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "dragonfly"){
      newchildren.push("head");
      newchildren.push("insect body");
      newchildren.push("tail");
    }
    if(this.name == "insect body"){
      newchildren.push("guts");
      newchildren.push("insect wing");
      newchildren.push("leg");
      newchildren.push("muscle");
    }
    if(this.name == "insect wing"){
      newchildren.push("nerves");
      newchildren.push("proteins");
    }
    if(this.name == "duck"){
      newchildren.push("bird body");
      newchildren.push("bird head");
    }
    if(this.name == "flamingo"){
      newchildren.push("bird body");
      newchildren.push("bird head");
      newchildren.push("neck");
    }
    if(this.name == "neck"){
      newchildren.push("bone");
      newchildren.push("muscle");
    }
    if(this.name == "lily pad"){
      newchildren.push("flower");
      newchildren.push("leaf");
    }
    if(this.name == "flower"){
      newchildren.push("petal");
    }
    if(this.name == "petal"){
      newchildren.push("plant cells");
    }
    if(this.name == "leaf"){
      newchildren.push("plant cells");
    }
    if(this.name == "otter"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "mosquito"){
      newchildren.push("head");
      newchildren.push("insect body");
      newchildren.push("proboscis");
    }
    if(this.name == "proboscis"){
      newchildren.push("nerves");
    }
    if(this.name == "plains"){
      newchildren.push("bison");
      newchildren.push("fox");
      newchildren.push("grass");
      newchildren.push("hare");
      newchildren.push("mouse");
      newchildren.push("snake");
    }
    if(this.name == "bison"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("horns");
      newchildren.push("quadruped body");
    }
    if(this.name == "horns"){
      newchildren.push("bone");
    }
    if(this.name == "mouse"){
      newchildren.push("ears");
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "snake"){
      newchildren.push("body");
      newchildren.push("head");
      newchildren.push("scales");
      newchildren.push("tongue");
    }
    if(this.name == "rainforest"){
      newchildren.push("butterfly");
      newchildren.push("flower");
      newchildren.push("frog");
      newchildren.push("monkey");
      newchildren.push("parrot");
      newchildren.push("sloth");
      newchildren.push("snake");
      newchildren.push("toucan");
      newchildren.push("tree");
    }
    if(this.name == "butterfly"){
      newchildren.push("antennae");
      newchildren.push("head");
      newchildren.push("insect body");
    }
    if(this.name == "antennae"){
      newchildren.push("nerves");
    }
    if(this.name == "monkey"){
      newchildren.push("biped body");
      newchildren.push("hair");
      newchildren.push("head");
      newchildren.push("tail");
    }
    if(this.name == "biped body"){
      newchildren.push("arm");
      newchildren.push("guts");
      newchildren.push("leg");
      newchildren.push("muscle");
      newchildren.push("skeleton");
    }
    if(this.name == "arm"){
      newchildren.push("hand");
      newchildren.push("muscle");
    }
    if(this.name == "hand"){
      newchildren.push("finger");
    }
    if(this.name == "finger"){
      newchildren.push("bone");
      newchildren.push("muscle");
    }
    if(this.name == "parrot"){
      newchildren.push("bird body");
      newchildren.push("bird head");
    }
    if(this.name == "sloth"){
      newchildren.push("biped body");
      newchildren.push("hair");
      newchildren.push("head");
    }
    if(this.name == "toucan"){
      newchildren.push("bird body");
      newchildren.push("bird head");
    }
    if(this.name == "tree"){
      newchildren.push("branch");
      newchildren.push("leaf");
      newchildren.push("tree trunk");
    }
    if(this.name == "branch"){
      newchildren.push("wood");
    }
    if(this.name == "wood"){
      newchildren.push("plant cells");
    }
    if(this.name == "tree trunk"){
      newchildren.push("wood");
    }
    if(this.name == "woods"){
      newchildren.push("bear");
      newchildren.push("deer");
      newchildren.push("fox");
      newchildren.push("owl");
      newchildren.push("porcupine");
      newchildren.push("raccoon");
      newchildren.push("squirrel");
      newchildren.push("tree");
      newchildren.push("woodpecker");
    }
    if(this.name == "deer"){
      newchildren.push("antlers");
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
    }
    if(this.name == "porcupine"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("quills");
    }
    if(this.name == "quills"){
      newchildren.push("keratin");
    }
    if(this.name == "raccoon"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "squirrel"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "woodpecker"){
      newchildren.push("bird body");
      newchildren.push("bird head");
    }
    if(this.name == "ocean"){
      newchildren.push("abyss");
      newchildren.push("beluga");
      newchildren.push("coral");
      newchildren.push("dolphin");
      newchildren.push("fish");
      newchildren.push("shark");
      newchildren.push("starfish");
      newchildren.push("water");
    }
    if(this.name == "coral"){
      newchildren.push("calcium");
      newchildren.push("muscle");
      newchildren.push("nerves");
    }
    if(this.name == "dolphin"){
      newchildren.push("body");
      newchildren.push("fins");
      newchildren.push("head");
      newchildren.push("tail");
    }
    if(this.name == "shark"){
      newchildren.push("body");
      newchildren.push("fins");
      newchildren.push("gilled head");
      newchildren.push("tail");
    }
    if(this.name == "starfish"){
      newchildren.push("mouth");
      newchildren.push("muscle");
      newchildren.push("nerves");
    }
    if(this.name == "rocky landmass"){
      newchildren.push("cave");
      newchildren.push("mountains");
    }
    if(this.name == "cave"){
      newchildren.push("bat");
      newchildren.push("olm");
      newchildren.push("spider");
      newchildren.push("stalagmite");
    }
    if(this.name == "bat"){
      newchildren.push("bat wing");
      newchildren.push("body");
      newchildren.push("ears");
      newchildren.push("head");
      newchildren.push("leg");
    }
    if(this.name == "bat wing"){
      newchildren.push("bone");
      newchildren.push("muscle");
    }
    if(this.name == "olm"){
      newchildren.push("gilled head");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "spider"){
      newchildren.push("body");
      newchildren.push("head");
      newchildren.push("leg");
      newchildren.push("silk");
    }
    if(this.name == "silk"){
      newchildren.push("proteins");
    }
    if(this.name == "stalagmite"){
      newchildren.push("rock");
      newchildren.push("water");
    }
    if(this.name == "mountains"){
      newchildren.push("eagle");
      newchildren.push("goat");
      newchildren.push("llama");
      newchildren.push("rock");
      newchildren.push("sheep");
      newchildren.push("snow");
      newchildren.push("wolf");
    }
    if(this.name == "eagle"){
      newchildren.push("bird body");
      newchildren.push("bird head");
    }
    if(this.name == "goat"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("horns");
      newchildren.push("quadruped body");
    }
    if(this.name == "llama"){
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("wool");
    }
    if(this.name == "wool"){
      newchildren.push("fur");
    }
    if(this.name == "sheep"){
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("wool");
    }
    if(this.name == "snow"){
      newchildren.push("ice");
    }
    if(this.name == "sandy landmass"){
      newchildren.push("beach");
      newchildren.push("desert");
      newchildren.push("savanna");
    }
    if(this.name == "beach"){
      newchildren.push("crab");
      newchildren.push("gull");
      newchildren.push("sand");
      newchildren.push("turtle");
    }
    if(this.name == "crab"){
      newchildren.push("body");
      newchildren.push("head");
      newchildren.push("leg");
      newchildren.push("seashell");
    }
    if(this.name == "seashell"){
      newchildren.push("calcium");
    }
    if(this.name == "sand"){
      newchildren.push("rock");
    }
    if(this.name == "turtle"){
      newchildren.push("body");
      newchildren.push("flipper");
      newchildren.push("head");
      newchildren.push("scales");
      newchildren.push("shell");
    }
    if(this.name == "shell"){
      newchildren.push("bone");
      newchildren.push("keratin");
    }
    if(this.name == "desert"){
      newchildren.push("camel");
      newchildren.push("gila monster");
      newchildren.push("jerboa");
      newchildren.push("sand");
      newchildren.push("scorpion");
      newchildren.push("spider");
      newchildren.push("vulture");
    }
    if(this.name == "camel"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("hump");
      newchildren.push("neck");
      newchildren.push("quadruped body");
    }
    if(this.name == "hump"){
      newchildren.push("muscle");
      newchildren.push("proteins");
    }
    if(this.name == "gila monster"){
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("scales");
      newchildren.push("tail");
      newchildren.push("tongue");
    }
    if(this.name == "jerboa"){
      newchildren.push("ears");
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "scorpion"){
      newchildren.push("body");
      newchildren.push("claws");
      newchildren.push("head");
      newchildren.push("leg");
      newchildren.push("stinger");
    }
    if(this.name == "stinger"){
      newchildren.push("muscle");
      newchildren.push("venom");
    }
    if(this.name == "venom"){
      newchildren.push("proteins");
    }
    if(this.name == "vulture"){
      newchildren.push("bird body");
      newchildren.push("bird head");
    }
    if(this.name == "savanna"){
      newchildren.push("elephant");
      newchildren.push("hyena");
      newchildren.push("giraffe");
      newchildren.push("grass");
      newchildren.push("lion");
      newchildren.push("sand");
      newchildren.push("vulture");
      newchildren.push("zebra");
    }
    if(this.name == "elephant"){
      newchildren.push("ears");
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("trunk");
    }
    if(this.name == "trunk"){
      newchildren.push("muscle");
    }
    if(this.name == "hyena"){
      newchildren.push("ears");
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
    }
    if(this.name == "giraffe"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("neck");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "lion"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("mane");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "mane"){
      newchildren.push("hair");
    }
    if(this.name == "zebra"){
      newchildren.push("fur");
      newchildren.push("head");
      newchildren.push("quadruped body");
      newchildren.push("tail");
    }
    if(this.name == "sky"){
      newchildren.push("clouds");
      newchildren.push("hawk");
    }
    if(this.name == "clouds"){
      newchildren.push("water");
    }
    if(this.name == "hawk"){
      newchildren.push("bird body");
      newchildren.push("bird head");
    }
    if(this.name == "sun"){
      newchildren.push("helium");
      newchildren.push("hydrogen");
    }
    
    newchildren = sort(newchildren);
    for(let i = 0; i < newchildren.length; i++){
      this.children.push(new Window(newchildren[i], this.identity, i));
    }
  }
  
  show(){
    if(this.showing){
      fill(0);
      stroke(255);
      strokeWeight(outline);
      let borderx = this.showsize * borderratio;
      let bordery = this.showsize * ratio * borderratio;
      rect(this.x + outline/2, this.y + outline/2, this.showsize - outline, this.showsize * ratio - outline);
      
      if(this.mode == "name"){
        fill(255)
        noStroke();
        textSize(borderx * 1.5);
        textAlign(CENTER, CENTER);
        text(this.name, this.x + this.showsize * 0.5, this.y + (this.showsize * ratio) * 0.3);
      }
    
      if(this.mode == "contents"){
        rect(this.x + borderx + outline/2, this.y + bordery + outline/2, this.showsize - outline - borderx * 2, this.showsize * ratio - outline - bordery * 2);
        
        fill(255)
        noStroke();
        textSize(borderx * 0.5);
        textAlign(LEFT, CENTER);
        text(this.name, this.x + borderx * 0.3, this.y + bordery * 0.54);
      }
    }
    
    for(let i = 0; i < this.children.length; i++){
      this.children[i].show();
    }
  }
  
  cleardisplay(){
    this.showing = false;
    this.showsize = 0;
    this.x = 0;
    this.y = 0;
    
    for(let i = 0; i < this.children.length; i++){
      this.children[i].cleardisplay();
    }
  }
  
  updatedisplay(showsize, x, y){
    this.showing = true;
    this.showsize = showsize;
    this.x = x;
    this.y = y;
    
    if(this.mode == "name" && this.children.length > 0){
      buttons.push(new Button("expand", this.x + this.showsize * 0.35, this.y + this.showsize * ratio * 0.45, this.showsize * 0.3, this.showsize * ratio * 0.35, this.identity));
    }
    
    if(this.mode == "contents"){
      buttons.push(new Button("shrink", this.x + this.showsize * (1 - borderratio) - outline, this.y, this.showsize * borderratio + outline, this.showsize * ratio * borderratio + outline, this.identity));
      if(this.showsize != width){
        buttons.push(new Button("zoomin", this.x + this.showsize * (1 - borderratio * 2) - outline, this.y, this.showsize * borderratio + outline, this.showsize * ratio * borderratio + outline, this.identity));
      } else if(!this.biggest){
        buttons.push(new Button("zoomout", this.x + this.showsize * (1 - borderratio * 2) - outline, this.y, this.showsize * borderratio + outline, this.showsize * ratio * borderratio + outline, this.identity));
      }
      
      let bwidth = this.showsize * (1 - borderratio * 2);
      let bx = this.x + this.showsize * borderratio;
      let by = this.y + this.showsize * ratio * borderratio;
      if(this.children.length == 1){
        this.children[0].updatedisplay(bwidth, bx, by);
      } else if(this.children.length > 1 && this.children.length < 5){
        for(let i = 0; i < 2; i++){
          for(let j = 0; j < 2; j++){
            if(this.children.length > i * 2 + j){
              this.children[i * 2 + j].updatedisplay(bwidth / 2 + outline / 2, bx + ((bwidth - outline) / 2) * j, by + ((bwidth * ratio - outline) / 2) * i);
            }
          }
        }
      } else if(this.children.length > 4){
        for(let i = 0; i < 3; i++){
          for(let j = 0; j < 3; j++){
            if(this.children.length > i * 3 + j){
              this.children[i * 3 + j].updatedisplay(bwidth / 3 + outline * 2/3, bx + (bwidth / 3 - outline * 1/3) * j, by + (bwidth * ratio / 3 - outline * 1/3) * i);
            }
          }
        }
      }
    }
  }
}