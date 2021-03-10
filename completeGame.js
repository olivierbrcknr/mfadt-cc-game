let lamp = null;
let goal = null;
let level = null;

let currentScene = -1;
let fps = 60;
let currSec = 0;
let keyPressTimer = 0;

// for scene
let leftStep = false;
let pressEnterToggle = true;

let obstacles = [];

let localFC = 0; // localFrameCount
let goalIsReachedFlag = false;

const wallMargin = 20;
let pixelsInMeters = 100;
let lampTime = 2;

let pxlfont;
//Font Used:"Press Start 2P" by Cody "CodeMan38" Boisclair.
//Font Link:https://fonts.google.com/specimen/Press+Start+2P

let soundFiles = ['heartPiece', 'messageFinish', 'rupee', 'walkGrass', 'message', 'chestOpen', 'fire', 'tink', 'useKey', 'error'];
let sounds = [];
let musicFiles = ['01_start', '02_text', '03_game', '04_end'];
let music = [];

let imageNames = [
  // General
  'LampCharacter-off.png',
  'LampCharacter-on.png',
  'oli-back.png',
  'oli-front.png',
  'oli-left.png',
  'oli-right.png',
  'goal01.png',
  'goal02.png',
  'goal03.png',
  'Goodbye.png',
  'shopOwner.png',
  'IntroBG.jpg',
  // title
  'title_bg.png',
  'title_lamp.png',
  'title_text.png',
  // Gmünd
  'GmuendBG.jpg',
  'BedGmuend.png',
  'DeskGmuend.png',
  'ChairGmuend2.png',
  'ChairGmuend1.png',
  'BedsideTable.png',
  'ShelfGmuend.png',
  // Hamburg
  'HamburgBG.jpg',
  'BedHamburg.png',
  'DeskHamburg.png',
  'ShelfHamburg1.png',
  'ShelfHamburg2.png',
  'shoe1.png',
  'shoe2.png',
  'ChairHamburg.png',
  // Lund
  'LundBG.jpg',
  'BedLund.png',
  'book.png',
  'Magazine1.png',
  'Magazine2.png',
  // Munich
  'MunichBG.jpg',
  'chimney.png',
  'DeskMunich.png',
  'MunichBed.png',
  'MunichChair1.png',
  'MunichChair2.png',
  'ShelfMunich.png',
  'SofaPurple.png',
  'sofaTable3d.png',
  'SofaWhite.png',
  'VinylShelf.png'
];

let images = [];

function preload() {
  pxlfont = loadFont('pixelfont.ttf');

  soundFormats('wav');
  for (let i = 0; i < soundFiles.length; i++) {
    sounds.push({
      name: soundFiles[i],
      sound: loadSound('sounds/' + soundFiles[i] + '.wav'),
      isTimeout: false
    });
  }

  for (let i = 0; i < musicFiles.length; i++) {
    music.push(loadSound('music/' + musicFiles[i] + '.wav'));
  }

  for (let i = 0; i < imageNames.length; i++) {
    images.push({
      name: imageNames[i].replace('.jpg', '').replace('.png', ''),
      image: loadImage('images/' + imageNames[i]),
    });
  }
}

function setup() {
  createCanvas(600, 400);
  noSmooth();
  textFont(pxlfont);
  frameRate(fps);
}

let introSoundIsPlayed = false;

function draw() {
  background(0);

  let startingScene = currentScene;
  localFC++;
  currSec = localFC / fps;

  switch (currentScene) {

    // Add Developer Logo in the beginning as well?
    case -1:
      // Startup
      background(0);

      if (currSec > 1) {
        fill(255);
        textAlign(CENTER);
        text('-EinUndZwanzig-', width / 2, height / 2);
        text('presents', width / 2, height / 2 + 20);
        if (!introSoundIsPlayed) {
          playSound('rupee');
          introSoundIsPlayed = true;
        }
      }
      if (currSec > 3) {
        currentScene++;
      }

      break;
    case 0:
      // display intro video
      titleIntro();
      break;
    case 1:
      // display story piece
      // Star wars style text?
      introText();
      break;
    case 2:
      // display story piece #2
      // "it's dangerous to go alone"
      storyIntro();
      break;
    case 3:
      // display first level
      // setup level
      if (localFC === 1) {

        playMusic(3);

        // create firs obstacle
        obstacles.push(new Obstacle(110, 50, 80, 80, 'ChairGmuend2'));
        obstacles.push(new Obstacle(0, 0, 300, 80, 'DeskGmuend'));
        obstacles.push(new Obstacle(10, 150, 50, 60, 'BedsideTable'));
        obstacles.push(new Obstacle(0, height, 240, 160, 'BedGmuend'));
        obstacles.push(new Obstacle(320, 200, 80, 80, 'ChairGmuend1'));
        obstacles.push(new Obstacle(width, 40, 80, 200, 'ShelfGmuend'));

        level = new Level('Schwäbisch Gmünd', false, 'GmuendBG');
        lamp = new LampProtagonist(width, height - 150, 340, height, 5.8);
        goal = new Goal(0, 100);
      } else {

        level.build();
      }
      break;
    case 4:
      // display second level
      if (localFC === 1) {

        // create firs obstacle
        obstacles.push(new Obstacle(0, 0, 260, 90, 'wall', true));
        obstacles.push(new Obstacle(270, 0, 280, 100, 'BedHamburg'));
        obstacles.push(new Obstacle(90, 110, 80, 80, 'ChairHamburg'));
        obstacles.push(new Obstacle(50, 90, 180, 70, 'DeskHamburg'));

        obstacles.push(new Obstacle(150, height, 160, 80, 'ShelfHamburg1'));
        obstacles.push(new Obstacle(320, height, 80, 100, 'ShelfHamburg2'));
        obstacles.push(new Obstacle(60, height, 80, 100, 'ShelfHamburg2'));

        obstacles.push(new Obstacle(300, 200, 20, 40, 'shoe1'));
        obstacles.push(new Obstacle(340, 170, 40, 20, 'shoe2'));

        obstacles.push(new Obstacle(width, 170, 100, 20, 'door', true));

        level = new Level('Hamburg', true, 'HamburgBG');
        lamp = new LampProtagonist(width, height, width, height, 6.8);
        goal = new Goal(0, height);
      } else {

        level.build();
      }
      break;
    case 5:
      // display third level
      if (localFC === 1) {
        obstacles.push(new Obstacle(180, 60, 80, 200, 'BedLund'));
        obstacles.push(new Obstacle(90, 40, 20, 30, 'book'));
        obstacles.push(new Obstacle(50, 130, 30, 40, 'Magazine1'));
        obstacles.push(new Obstacle(80, 240, 30, 40, 'Magazine2'));

        obstacles.push(new Obstacle(width, height, 200, 60, 'shelf', true));

        obstacles.push(new Obstacle(360, 0, 20, 180, 'wall', true));
        obstacles.push(new Obstacle(width, 160, 120, 20, 'wall', true));

        level = new Level('Lund', true, 'LundBG');
        lamp = new LampProtagonist(width, 0, width, 0, 8);
        goal = new Goal(0, 0);
      } else {
        level.build();
      }
      break;
    case 6:
      // display fourth level
      // display third level
      if (localFC === 1) {
        obstacles.push(new Obstacle(0, 0, 180, 120, 'MunichBed'));

        obstacles.push(new Obstacle(250, 60, 60, 60, 'MunichChair2'));
        obstacles.push(new Obstacle(190, 0, 180, 80, 'DeskMunich'));

        obstacles.push(new Obstacle(0, 160, 50, 70, 'chimney'));
        obstacles.push(new Obstacle(150, 190, 60, 60, 'MunichChair1'));
        obstacles.push(new Obstacle(350, 160, 50, 50, 'sofaTable3d'));

        obstacles.push(new Obstacle(180, height, 60, 50, 'ShelfMunich'));
        obstacles.push(new Obstacle(300, height, 180, 80, 'SofaWhite'));
        obstacles.push(new Obstacle(width, 120, 80, 150, 'SofaPurple'));

        obstacles.push(new Obstacle(450, 80, 30, 50, 'VinylShelf'));
        obstacles.push(new Obstacle(width, 0, 80, 120, 'wall', true));

        level = new Level('München', true, 'MunichBG');
        lamp = new LampProtagonist(0, height - 80, 0, height, 6.5);
        goal = new Goal(430, 0);
      } else {
        level.build();
      }
      break;
    case 7:
      // display the final story piece
      storyOutro();
      break;
  }

  if (keyIsPressed && keyPressTimer < 0) {
    checkMove();
    keyPressTimer = 2;
  }
  keyPressTimer--;

  if (startingScene !== currentScene) {
    localFC = 0;
  }
}

function titleIntro() {
  push();

  if (localFC === 1) {
    playMusic(1);
  }

  let opacityVal = int(currSec * 4) / 2 - 1;

  background(0);

  if (currSec > 3) {
    let titleBG = getImageAsset('title_bg');
    image(titleBG, 0, 0, width, height);

    let bgTransitionOpacity = map(opacityVal, 6, 7, 255, 0); //map(currSec, 3, 5, 255, 0);
    if (bgTransitionOpacity > 0) {
      background(0, bgTransitionOpacity);
    }
  }

  let titleLamp = getImageAsset('title_lamp');
  image(titleLamp, 0, 0, width, height);

  let transitionOpacity = map(opacityVal, 0, 4, 255, 0);

  if (transitionOpacity > 0) {
    background(0, transitionOpacity);
  }

  if (currSec > 3) {
    let titleText = getImageAsset('title_text');
    image(titleText, 0, 0, width, height);
  }

  textAlign(CENTER);

  if (localFC % 20 === 0) {
    pressEnterToggle = !pressEnterToggle;
  }
  if (currSec > 5 && pressEnterToggle) {
    textSize(16);
    fill('#2fc2f2');
    stroke('#238fb2');
    strokeWeight(2);
    text("Press Enter", width / 2, height - 90);
  }

  noStroke();
  textSize(8);
  fill(255);
  text("© Olivier Brückner 2020", width / 2, height - 10);

  pop();
}


function introText() {
  let posTop = height - localFC;

  if (localFC === 1) {
    playMusic(2);
  }

  push();

  background(0)
  let s = `Once upon a time, there was a guy. He moved quite often and wherever he went, he took his lamp. In the journey they passed various places so far, but they have one goal: finally reaching New York City!

This is the story. No, not of the guy, the Lamp!`;
  fill(255);
  textSize(14);
  textLeading(26);
  textAlign(LEFT);
  translate(-150, 0);
  text(s, width / 2, posTop, 300, 600);

  pop();

  // if (posTop < -380) {
  if (currSec > 14) {
    playSound('messageFinish', true);
    currentScene++;
  }
}

let TextVar = 0;

function storyIntro() {

  let titleLamp = getImageAsset('IntroBG');
  image(titleLamp, 0, 0, width, height);

  if (localFC === 1) {
    lamp = new LampProtagonist(wallMargin, height / 2, 100, 200, 10);
  }

  let guyPosTop = height - localFC;
  let guyPhoto = null;

  let isWithLamp = false;

  if (guyPosTop <= height / 2 + 40) {
    guyPosTop = height / 2 + 40;
    guyPhoto = getImageAsset('oli-back');
  } else {
    if ((localFC / 8) % 2 == 0) {
      leftStep = !leftStep;
      playSound('walkGrass', true);
    }
    if (leftStep) {
      guyPhoto = getImageAsset('oli-left');
    } else {
      guyPhoto = getImageAsset('oli-right');
    }
  }

  if (currSec > 7) {
    isWithLamp = true;
    guyPhoto = getImageAsset('oli-front');
  }

  if (currSec > 10) {
    playSound('messageFinish', true);
    currentScene++;
  }

  push();

  textAlign(LEFT);
  textSize(16);
  fill(0);

  if (currSec > 2) {

    let wholeText = "It's dangerous to go alone.\nTake this!";
    let displayText = wholeText.substring(0, TextVar);

    if (TextVar < wholeText.length && (localFC / 2) % 2 == 0) {
      TextVar++;
      if (TextVar === wholeText.length - 1) {
        playSound('messageFinish', true);
      } else {
        playSound('message', true);
      }
    }

    text(displayText, 40, 80);
  }

  // shop owner
  let shopOwnerPhoto = getImageAsset('shopOwner');
  image(shopOwnerPhoto, width / 2 - 16, 120, 32, 48)

  // guy
  image(guyPhoto, width / 2 - 16, guyPosTop, 32, 48)

  // lamp
  let lampTop = height / 2 - 30;
  if (isWithLamp) {
    lampTop = height / 2 - 10;
  }
  lamp.story(width / 2, lampTop, isWithLamp);

  pop();
}

function storyOutro() {
  push();

  if (localFC === 1) {
    playMusic(4);
  }

  let endImg = getImageAsset('Goodbye');

  image(endImg, 0, 0, width, height);

  fill(0);
  textAlign(RIGHT);
  textSize(24);
  text("Off to the next\nadventure!", width - 30, 60);

  textSize(10);
  text("Press Enter to play again", width - 30, 140);

  pop();
}

class Level {
  constructor(placeName = '', isDark = false, bgImage = false) {
    this.isDark = isDark;
    this.name = placeName;
    this.bg = getImageAsset(bgImage);
    this.isAboutToEnd = false;
  }

  build() {

    if (this.bg) {
      image(this.bg, 0, 0, width, height);
    }

    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].place();
    }

    if (!lamp.isOn) {
      goal.place();
    }

    if (this.isDark) {
      push();
      blendMode(DARKEST);
      if (lamp.isOn || this.isAboutToEnd) {
        noStroke();
        fill(0, 220);
        beginShape();
        vertex(0, 0);
        vertex(width, 0);
        vertex(width, height);
        vertex(0, height);

        beginContour();
        // this part is from
        // https://stackoverflow.com/questions/18260325/draw-perfect-ellipsecircle-using-beginshape-in-processing
        let sides = 40;
        let r = 100
        if (this.isAboutToEnd) {
          let levelFC = localFC - this.isAboutToEnd;
          if (lamp.isOn) {
            r = map(levelFC, 0, 1.5 * fps, 100, 1000);
          } else if (!lamp.isOn) {
            r = map(levelFC, 0, 1.5 * fps, 0, 1000);
          }
        }

        let angle = 360 / sides;
        for (let i = 0; i < sides; i++) {
          let x = cos(radians(-i * angle)) * r;
          let y = sin(radians(-i * angle)) * r;
          vertex(lamp.x + lamp.width / 2 + x, lamp.y + lamp.height / 2 + y);
        }
        endContour();

        endShape(CLOSE);

      } else {
        fill(0, 245);
        rect(0, 0, width, height);
      }
      pop();
    }

    if (lamp.isOn) {
      goal.place();
    }
    lamp.stand();

    renderStats(lamp.lenghtLeft, lamp.time, this.name)

    if (goalIsReachedFlag && !this.isAboutToEnd) {
      this.isAboutToEnd = localFC;
    }

    let timeToEnd = fps * 3; // 3sec
    const timeToFade = fps / 2;
    if (!level.isDark) {
      timeToEnd = fps;
    }
    if (this.isAboutToEnd && (localFC - this.isAboutToEnd) > timeToEnd) {
      let levelFC = localFC - this.isAboutToEnd - timeToEnd;
      let fadeOpacity = map(levelFC, 0, timeToFade, 0, 255);
      background(0, fadeOpacity);
    }

    if (this.isAboutToEnd && (localFC - this.isAboutToEnd) > (timeToEnd + timeToFade)) {
      this.end();
    }
  }

  end() {
    lamp = null;
    obstacles = [];
    goal = null;
    goalIsReachedFlag = false;
    currentScene++;
  }

}

class Obstacle {

  constructor(x, y, w = 50, h = 50, l = '', shouldNotDisplay = false) {
    this.x = (x + w >= width) ? x - wallMargin - w : x + wallMargin;
    this.y = (y + h >= height) ? y - wallMargin - h : y + wallMargin;
    this.height = h;
    this.width = w;
    this.label = l;
    // this.isDark = false;
    let objectImage = images.find(el => el.name == l);
    this.img = (objectImage ? objectImage : false);
    this.notDisplay = shouldNotDisplay;
  }

  place() {
    if (this.img) {
      image(this.img.image, this.x, this.y, this.width, this.height);
    } else if (!this.notDisplay) {
      push();
      noStroke();
      fill(200);
      rect(this.x, this.y, this.width, this.height);
      fill(0);
      textAlign(CENTER);
      text(this.label, this.x + this.width / 2, this.y + this.height / 2);
      pop();
    }
  }
}


class Goal {
  constructor(x, y) {
    const size = 50;
    this.x = (x + size >= width) ? x - wallMargin - size : x + wallMargin;
    this.y = (y + size >= height) ? y - wallMargin - size : y + wallMargin;
    this.height = size;
    this.width = size;
    this.image = 1;
  }
  place() {
    push();
    let goalImage = getImageAsset('goal0' + this.image);

    if ((localFC / 8) % 2 == 0) {
      this.image = this.image + 1;
      if (this.image > 3) {
        this.image = 1;
      }
    }

    blendMode(LIGHTEST);
    image(goalImage, this.x, this.y, this.width, this.height)
    pop();
  }
}


class LampProtagonist {

  constructor(socketX, socketY, posX, posY, maxLength) {

    const lampWidth = 50;
    const lampHeight = 70;

    this.isOn = false;
    // this.x = posX;
    // this.y = posY;
    this.x = (posX + lampWidth >= width) ? posX - wallMargin - lampWidth : posX + wallMargin;
    this.y = (posY + lampHeight >= height) ? posY - wallMargin - lampHeight : posY + wallMargin;
    this.width = lampWidth;
    this.height = lampHeight; //80;
    this.cableShiftX = 18;
    this.cableShiftY = 20;
    this.maxLength = maxLength;
    this.lenghtLeft = this.maxLength;
    this.cablePoints = [{
      x: (socketX + wallMargin >= width) ? socketX - wallMargin : socketX + wallMargin,
      y: (socketY >= height) ? socketY - wallMargin : socketY + wallMargin
    }];
    this.time = lampTime * fps;
    this.isDisplayingError = false;
  }

  stand() {
    // build cable
    let calcLength = 0;
    push();

    noFill();
    if (this.isOn) {
      stroke(30);
    } else {
      stroke(10);
    }
    strokeWeight(4);
    strokeJoin(ROUND);
    beginShape();

    for (var i = 0; i < this.cablePoints.length; i++) {
      vertex(this.cablePoints[i].x, this.cablePoints[i].y);

      if (i < this.cablePoints.length - 1) {
        calcLength += dist(this.cablePoints[i].x, this.cablePoints[i].y, this.cablePoints[i + 1].x, this.cablePoints[i + 1].y)
      }
    }
    vertex(this.x + this.cableShiftX, this.y + this.cableShiftY);
    endShape();

    calcLength += dist(this.cablePoints[this.cablePoints.length - 1].x, this.cablePoints[this.cablePoints.length - 1].y, this.x + this.cableShiftX, this.y + this.cableShiftY)

    pop();

    // save cable length
    this.lenghtLeft = round(((this.maxLength * pixelsInMeters - calcLength) / pixelsInMeters), 1);

    // build lamp
    push();

    let lampImg = null;
    if (this.isOn) {
      fill(255)
      // build glow
      if (!level.isDark) {
        push();
        noStroke();
        blendMode(SCREEN);
        fill(255, 100);
        circle(this.x + this.width / 2, this.y + this.height / 2, 200);
        pop();
      }

      lampImg = getImageAsset('LampCharacter-on');
      this.time = this.time - 1;
      if (this.time <= 0) {
        this.toggleLight();
      }

    } else {
      lampImg = getImageAsset('LampCharacter-off');
      if (this.time < lampTime * fps) {
        this.time++;
      }
    }
    image(lampImg, this.x, this.y, this.width, this.height);
    pop();
  }

  story(x, y, withLamp) {
    push();
    let size = 0.5;
    if (withLamp) {
      size = 1;
      y = y - 30;
    }
    let w = this.width * size;
    let h = this.height * size;
    let lampImg = getImageAsset('LampCharacter-off');
    image(lampImg, x - w / 2, y, w, h);
    pop();
  }

  toggleLight() {
    if (level && !level.isAboutToEnd) {
      if (this.isOn) {
        playSound('useKey', true);
      } else {
        playSound('tink', true);
      }
      this.isOn = !this.isOn;
    }
  }

  move(dir) {
    // only move if cable is left
    // if( this.lenghtLeft > 0 ){

    let newX = this.x;
    let newY = this.y;

    const moveSpeed = 10;

    switch (dir) {
      case 'right':
        newX += moveSpeed;
        break;
      case 'left':
        newX -= moveSpeed;
        break;
      case 'up':
        newY -= moveSpeed;
        break;
      case 'down':
        newY += moveSpeed;
        break;
    }

    obstacles.forEach(obst => {

      // prevent from going over x
      if (newX + this.width > obst.x &&
        newX < obst.x + obst.width &&
        newY < obst.y + obst.height &&
        newY + this.height > obst.y) {
        newX = this.x;
      }
      // prevent from going over y
      if (newY + this.height > obst.y &&
        newY < obst.y + obst.height &&
        newX < obst.x + obst.width &&
        newX + this.width > obst.x
      ) {
        newY = this.y;
      }

      // the currently last point
      let lastPt = this.cablePoints[this.cablePoints.length - 1];

      let cx1 = lastPt.x;
      let cy1 = lastPt.y;
      let cx2 = newX + this.cableShiftX;
      let cy2 = newY + this.cableShiftY;

      // top left
      let bx1 = obst.x;
      let by1 = obst.y;
      // top right
      let bx2 = obst.x + obst.width;
      let by2 = obst.y;
      // bottom right
      let bx3 = obst.x + obst.width;
      let by3 = obst.y + obst.height;
      // bottom left
      let bx4 = obst.x;
      let by4 = obst.y + obst.height;

      if ((cx1 === bx1 && cy1 === by1) ||
        (cx1 === bx2 && cy1 === by2) ||
        (cx1 === bx3 && cy1 === by3) ||
        (cx1 === bx4 && cy1 === by4)) {

        // the point before the last point
        let prevPt = this.cablePoints[this.cablePoints.length - 2];

        let px1 = prevPt.x;
        let py1 = prevPt.y;

        let oldEdges = checkEdges(px1, py1, cx2, cy2, bx1, by1, bx2, by2, bx3, by3, bx4, by4);

        let slipsOver = checkSlipping(px1, py1, cx1, cy1, cx2, cy2, bx1, by1, bx2, by2, bx3, by3, bx4, by4);

        if (!oldEdges && !slipsOver) {
          this.cablePoints.pop();
        }
      }

      let newCornerPoint = checkCorners(cx1, cy1, cx2, cy2, bx1, by1, bx2, by2, bx3, by3, bx4, by4);

      if (newCornerPoint) {
        this.cablePoints.push(newCornerPoint)
      }

    });

    // prevent from walls
    if (newY < wallMargin || newY + this.height > height - wallMargin) {
      newY = this.y;
    }
    if (newX < wallMargin || newX + this.width > width - wallMargin) {
      newX = this.x;
    }

    // check if is in goal
    const goalMargin = 10; // needing to go deeper into the goal
    if (goal &&
      newX + this.width / 2 > goal.x + goalMargin &&
      newX + this.width / 2 < goal.x + goal.width - goalMargin &&
      newY + this.height / 2 > goal.y + goalMargin &&
      newY + this.height / 2 < goal.y + goal.height - goalMargin) {
      // level completed
      console.log('🎉 Goal Reached:', level.name);
      playSound('heartPiece');
      goalIsReachedFlag = true;
    }

    // calculate the length the cable now would have
    let pseudoCalcLength = 0;

    for (var i = 0; i < this.cablePoints.length - 1; i++) {
      pseudoCalcLength += dist(this.cablePoints[i].x, this.cablePoints[i].y, this.cablePoints[i + 1].x, this.cablePoints[i + 1].y)
    }
    pseudoCalcLength += dist(this.cablePoints[this.cablePoints.length - 1].x, this.cablePoints[this.cablePoints.length - 1].y, newX, newY + this.cableShiftY);

    let pseudoCableLeft = this.maxLength * pixelsInMeters - pseudoCalcLength;

    // only allow everything if this would actually be possible
    if (pseudoCableLeft >= 0) {
      this.x = newX;
      this.y = newY;
      playSound('walkGrass');
    } else {
      playSound('error');
      this.isDisplayingError = true;
      setTimeout(() => {
        this.isDisplayingError = false;
      }, 500);
    }
  }
}

function renderStats(cableLength, time, title = '') {
  push();

  let statOpacity = 255;

  if (level.isAboutToEnd) {
    let levelFC = localFC - level.isAboutToEnd;
    statOpacity = map(levelFC, 0, 1 * fps, 255, 0);
  }

  noStroke();
  fill(0, statOpacity);
  if (level.isDark) {
    fill(255, statOpacity);
  }

  push();
  if (lamp.isDisplayingError) {
    fill('red');
  }
  textAlign(LEFT);
  text(cableLength + ' meters left', 10, 20);
  pop();

  // text(time + 's', 10, 40);
  let timerLength = map(time, 0, lampTime * fps, 0, 100);
  rect(10, 30, timerLength, 6);

  textAlign(RIGHT)
  text(title, width - 10, 20);
  pop();
}

function playSound(name, playAnyway = false) {
  let playSound = sounds.find(s => s.name === name);
  // only play sound if not currently playing
  if (playSound.isTimeout === false || playAnyway) {
    playSound.sound.play();
    playSound.isTimeout = true;
    setTimeout(() => {
      playSound.isTimeout = false;
    }, playSound.sound.duration() * 1000);
  }
}

function playMusic(id) {
  // pause old track
  for (let i = 0; i < music.length; i++) {
    music[i].pause();
    if( id === 4 && i === 3){
      music[3].setVolume(0.1);
      music[3].play(0);
    }else if( i === id-1 ){
      music[i].setVolume(0.1);
      music[i].loop(0);
    }
  }
}

function getImageAsset(name) {

  let img = images.find(el => el.name == name);

  if (img) {
    return img.image;
  } else {
    return false;
  }

}

function checkMove() {
  if (lamp && level && !level.isAboutToEnd) {
    switch (keyCode) {
      case DOWN_ARROW:
        lamp.move('down');
        break;
      case UP_ARROW:
        lamp.move('up');
        break;
      case LEFT_ARROW:
        lamp.move('left');
        break;
      case RIGHT_ARROW:
        lamp.move('right');
        break;
    }
  }
}

function keyPressed() {

  // delete drawing
  switch (keyCode) {
    case 32: // space
      if (lamp) {
        lamp.toggleLight();
      }
      break;
      /*
   case DOWN_ARROW:
      if (lamp) {
        lamp.move('down');
      }
      break;
    case UP_ARROW:
      if (lamp) {
        lamp.move('up');
      }
      break;
    case LEFT_ARROW:
      if (lamp) {
        lamp.move('left');
      }
      break;
    case RIGHT_ARROW:
      if (lamp) {
        lamp.move('right');
      }
      break;
  */
    case ENTER:
    case RETURN:
      if (currentScene === 0) {
        currentScene++;
        localFC = 0;
        playSound('rupee');
      } else if( currentScene === 1 || currentScene === 2 ){
        currentScene = 3;
        localFC = 0;
        playSound('rupee');
      }else if (currentScene === 7) {
        currentScene = 0;
        localFC = 0;
        playSound('rupee');
      }
      break;
  }

  // prevent default
  return false;
}

// really prevent default!!
window.addEventListener("keydown", function(e) {
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

// this function is from
// http://www.jeffreythompson.org/collision-detection/line-rect.php
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {

  // calculate the direction of the lines
  let uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  let uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  } else {
    return false;
  }
}

// this function is from
// http://www.jeffreythompson.org/collision-detection/line-point.php
function linePoint(x1, y1, x2, y2, px, py) {

  let d1 = dist(px, py, x1, y1);
  let d2 = dist(px, py, x2, y2);
  let lineLen = dist(x1, y1, x2, y2);
  let buffer = 0.1;
  if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
    return true;
  }
  return false;
}

function checkSlipping(px1, py1, cx1, cy1, cx2, cy2, bx1, by1, bx2, by2, bx3, by3, bx4, by4) {

  let slipsOver = false;
  let slipCount = 0;

  // last point was top right
  if (cx1 === bx2 && cy1 === by2) {
    if (
      (
        // check if is going lower
        lineLine(px1, py1, cx2, cy2, bx2, by2, bx3, by3 + height) ||
        // check if going left
        lineLine(px1, py1, cx2, cy2, bx2, by2, bx1 - width, by1)
      ) && (
        (px1 !== bx1 && py1 != by1) &&
        (px1 !== bx3 && py1 != by3)
      )
    ) {
      slipsOver = true;
    }

  }

  // last point was top left
  if (cx1 === bx1 && cy1 === by1) {
    if (
      (
        // check if is going lower
        lineLine(px1, py1, cx2, cy2, bx1, by1, bx4, by4 + height) ||
        // check if going right
        lineLine(px1, py1, cx2, cy2, bx1, by1, bx2 + width, by2)
      ) && (
        (px1 !== bx4 && py1 != by4) &&
        (px1 !== bx2 && py1 != by2)
      )
    ) {
      slipsOver = true;
    }

  }

  // last point was bottom left
  if (cx1 === bx4 && cy1 === by4) {
    if (
      (
        // check if is going over
        lineLine(px1, py1, cx2, cy2, bx4, by4, bx1, by1 - height) ||
        // check if going right
        lineLine(px1, py1, cx2, cy2, bx4, by4, bx3 + width, by3)
      ) && (
        (px1 !== bx1 && py1 != by1) &&
        (px1 !== bx3 && py1 != by3)
      )
    ) {
      slipsOver = true;
    }

  }

  // last point was bottom right
  if (cx1 === bx3 && cy1 === by3) {
    if (
      (
        // check if is going over
        lineLine(px1, py1, cx2, cy2, bx3, by3, bx2, by2 - height) ||
        // check if going right
        lineLine(px1, py1, cx2, cy2, bx3, by3, bx4 - width, by4)
      ) && (
        (px1 !== bx2 && py1 != by2) &&
        (px1 !== bx4 && py1 != by4)
      )
    ) {
      slipsOver = true;
    }

  }

  return slipsOver;
}


function checkEdges(cx1, cy1, cx2, cy2, bx1, by1, bx2, by2, bx3, by3, bx4, by4) {
  let hitBoxLeft = lineLine(cx1, cy1, cx2, cy2, bx1, by1, bx4, by4);
  let hitBoxRight = lineLine(cx1, cy1, cx2, cy2, bx2, by2, bx3, by3);
  let hitBoxTop = lineLine(cx1, cy1, cx2, cy2, bx1, by1, bx2, by2);
  let hitBoxBottom = lineLine(cx1, cy1, cx2, cy2, bx4, by4, bx3, by3);

  // adjust depending on corners

  // top left
  if (linePoint(cx1, cy1, cx2, cy2, bx1, by1)) {
    hitBoxLeft = true;
    hitBoxTop = true;
  }
  // top right
  if (linePoint(cx1, cy1, cx2, cy2, bx2, by2)) {
    hitBoxRight = true;
    hitBoxTop = true;
  }
  // bottom right
  if (linePoint(cx1, cy1, cx2, cy2, bx3, by3)) {
    hitBoxRight = true;
    hitBoxBottom = true;
  }
  // bottom left
  if (linePoint(cx1, cy1, cx2, cy2, bx4, by4)) {
    hitBoxLeft = true;
    hitBoxBottom = true;
  }

  if (hitBoxRight && cx1 !== bx2) {
    return true;
  }
  if (hitBoxLeft && cx1 !== bx1) {
    return true;
  }
  if (hitBoxTop && cy1 !== by1) {
    return true;
  }
  if (hitBoxBottom && cy1 !== by4) {
    return true;
  }
  return false;
}

function checkCorners(cx1, cy1, cx2, cy2, bx1, by1, bx2, by2, bx3, by3, bx4, by4) {
  let hitBoxLeft = lineLine(cx1, cy1, cx2, cy2, bx1, by1, bx4, by4);
  let hitBoxRight = lineLine(cx1, cy1, cx2, cy2, bx2, by2, bx3, by3);
  let hitBoxTop = lineLine(cx1, cy1, cx2, cy2, bx1, by1, bx2, by2);
  let hitBoxBottom = lineLine(cx1, cy1, cx2, cy2, bx4, by4, bx3, by3);

  // corners

  // top left
  if (linePoint(cx1, cy1, cx2, cy2, bx1, by1)) {
    hitBoxLeft = true;
    hitBoxTop = true;
  }
  // top right
  if (linePoint(cx1, cy1, cx2, cy2, bx2, by2)) {
    hitBoxRight = true;
    hitBoxTop = true;
  }
  // bottom right
  if (linePoint(cx1, cy1, cx2, cy2, bx3, by3)) {
    hitBoxRight = true;
    hitBoxBottom = true;
  }
  // bottom left
  if (linePoint(cx1, cy1, cx2, cy2, bx4, by4)) {
    hitBoxLeft = true;
    hitBoxBottom = true;
  }

  // add new corner points
  if (hitBoxLeft && hitBoxTop && (cx1 !== bx1 || cy1 !== by1)) {
    return ({
      x: bx1,
      y: by1
    });
  } else if (hitBoxRight && hitBoxTop && (cx1 !== bx2 || cy1 !== by2)) {
    return ({
      x: bx2,
      y: by2
    });
  } else if (hitBoxRight && hitBoxBottom && (cx1 !== bx3 || cy1 !== by3)) {
    return ({
      x: bx3,
      y: by3
    });
  } else if (hitBoxLeft && hitBoxBottom && (cx1 !== bx4 || cy1 !== by4)) {
    return ({
      x: bx4,
      y: by4
    });
  }

  // special cases
  if (hitBoxLeft && hitBoxRight) {
    if (cy1 < by1 && cy1 < by2 && cx2 > bx2) {
      return ({
        x: bx2,
        y: by2
      });
    }

  }
  return false;
}
