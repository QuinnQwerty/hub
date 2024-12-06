let gridsize = 20;
let gridx = 10;
let gridy = 20;
let grid = [];
let words = [];
let foundwords = [];
let totalwords;
let maxdisplay;
let stuffwidth;
let minletters = 3;
let maxletters = 6;
let longword = '';
let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let chances = true;
let since = 0;

function preload(){
  words = loadStrings('words_alpha.txt');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(15);
  fill(255);
  
  maxdisplay = int(height / gridsize - 3);
  stuffwidth = gridsize * (gridx + 3) + 255;
  
  for(let i = 0; i < words.length; i++){
    if(words[i].length < minletters || words[i].length > maxletters){
      words.splice(i, 1);
      i--;
    }
  }
  totalwords = words.length;

  for(let i = 0; i < gridx; i++){
    grid[i] = [];
    for(let j = 0; j < gridy; j++){
      grid[i][j] = '';
    }
  }
  
  if(chances){
    letters[letters.length] = 'v';
    letters[letters.length] = 'b';
    letters[letters.length] = 'y';
    letters[letters.length] = 'w';
    letters[letters.length] = 'g';
    for(let i = 0; i < 2; i++){
      letters[letters.length] = 'p';
      letters[letters.length] = 'f';
      letters[letters.length] = 'm';
      letters[letters.length] = 'u';
    }
    for(let i = 0; i < 3; i++){
      letters[letters.length] = 'c';
      letters[letters.length] = 'd';
    }
    for(let i = 0; i < 4; i++){
      letters[letters.length] = 'l';
    }
    for(let i = 0; i < 5; i++){
      letters[letters.length] = 'h';
    }
    for(let i = 0; i < 6; i++){
      letters[letters.length] = 'r';
      letters[letters.length] = 's';
    }
    for(let i = 0; i < 7; i++){
      letters[letters.length] = 'n';
      letters[letters.length] = 'i';
      letters[letters.length] = 'o';
    }
    for(let i = 0; i < 8; i++){
      letters[letters.length] = 'a';
    }
    for(let i = 0; i < 9; i++){
      letters[letters.length] = 't';
    }
    for(let i = 0; i < 12; i++){
      letters[letters.length] = 'e';
    }
  }
}

function draw(){
  background(0);
  
  since++;
  
  if(frameCount % 1 == 0){
    for(let i = 0; i < 1; i++){
      move();
    }
  }
  
  push();
  translate((width - stuffwidth) / 2, 0)
  
  textAlign(CENTER,CENTER);
  for(let i = 0; i < gridx; i++){
    for(let j = 0; j < gridy; j++){
      text(grid[i][j], i * gridsize + (gridsize / 2), j * gridsize + (gridsize / 2) + (height - gridsize * gridy));
    }
  }
  
  textAlign(LEFT,CENTER);
  text("FOUND WORDS: " + foundwords.length + " OUT OF " + totalwords, gridsize * (gridx + 3), gridsize / 2);
  text("LONGEST WORD: " + longword, gridsize * (gridx + 3), gridsize + gridsize / 2);
  let display = 0;
  if(foundwords.length > maxdisplay){
    display = foundwords.length - maxdisplay;
  }
  for(let i = display; i < foundwords.length; i++){
    text(foundwords[i], gridsize * (gridx + 3), gridsize * (i - display + 3) + (gridsize / 2));
  }
  
  pop();
}

function move(){
  let moved = false;
  
  for(let i = 0; i < gridx; i++){
    for(let j = gridy - 2; j > -1; j--){
      if(grid[i][j] != '' && grid[i][j+1] == ''){
        grid[i][j+1] = grid[i][j];
        grid[i][j] = '';
        moved = true;
      }
    }
  }
  
  if(!moved){
    let possible = [];
    for(let i = 0; i < gridx; i++){
      if(grid[i][0] == ''){
        possible[possible.length] = i;
      }
    }
    
    if(possible.length == 0){
      reset();
    } else {
      grid[possible[int(random(possible.length))]][0] = letters[int(random(letters.length))];
    }
  }
  
  check();
}

function check(){
  let founds = [];
  
  for(let i = 0; i < gridy; i++){
    for(let j = 0; j < gridx - 1; j++){
      if(grid[j][i] != '' && grid[j + 1][i] != ''){
        let maxlength = gridx - j;
        for(let k = j + 2; k < gridx; k++){
          if(grid[k][i] == ''){
            maxlength = k - j;
            k = gridx;
          }
        }
        let maybe = [];
        for(let k = 0; k < words.length; k++){
          if(words[k][0] == grid[j][i] && words[k].length <= maxlength){
            maybe[maybe.length] = words[k];
          }
        }
        
        for(let k = minletters; k < maxlength + 1; k++){
          let couldbe = '';
          for(let l = 0; l < k; l++){
            couldbe += grid[j + l][i];
          }
          for(let l = 0; l < maybe.length; l++){
            if(maybe[l] == couldbe){
              print(couldbe + " (took " + since + " frames to find, " + frameCount + " in total)");
              since = 0;
              foundwords[foundwords.length] = couldbe;
              if(couldbe.length >= longword.length){
                longword = couldbe;
              }
              for(let m = 0; m < words.length; m++){
                if(words[m] == couldbe){
                  words.splice(m, 1);
                  m = words.length;
                }
              }
              for(let m = 0; m < couldbe.length; m++){
                founds[founds.length] = [j + m, i];
              }
            }
          }
        }
      }
    }
  }
  
  for(let i = 0; i < gridx; i++){
    for(let j = 0; j < gridy - 1; j++){
      if(grid[i][j] != '' && grid[i][j + 1] != ''){
        let maxlength = gridy - j;
        for(let k = j + 2; k < gridy; k++){
          if(grid[i][k] == ''){
            maxlength = k - j;
            k = gridy;
          }
        }
        let maybe = [];
        for(let k = 0; k < words.length; k++){
          if(words[k][0] == grid[i][j] && words[k].length <= maxlength){
            maybe[maybe.length] = words[k];
          }
        }
        
        for(let k = minletters; k < maxlength + 1; k++){
          let couldbe = '';
          for(let l = 0; l < k; l++){
            couldbe += grid[i][j + l];
          }
          for(let l = 0; l < maybe.length; l++){
            if(maybe[l] == couldbe){
              print(couldbe + " (took " + since + " frames to find, " + frameCount + " in total)");
              since = 0;
              foundwords[foundwords.length] = couldbe;
              if(couldbe.length >= longword.length){
                longword = couldbe;
              }
              for(let m = 0; m < words.length; m++){
                if(words[m] == couldbe){
                  words.splice(m, 1);
                  m = words.length;
                }
              }
              for(let m = 0; m < couldbe.length; m++){
                founds[founds.length] = [i, j + m];
              }
            }
          }
        }
      }
    }
  }
  
  for(let i = 0; i < founds.length; i++){
    grid[founds[i][0]][founds[i][1]] = '';
  }
}

function reset(){
  for(let i = 0; i < gridx; i++){
    for(let j = 0; j < gridy; j++){
      grid[i][j] = '';
    }
  }
}

function keyPressed(){
  if(key == 'r'){
    reset();
  }
  
  if(key == 'm'){
    print(words);
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}