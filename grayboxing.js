let table = null;
let lamp = null;
let goal = null;
let level = null;

let currentScene = -1;
let fps = 60;
let currSec = 0;
let keyPressTimer = 0;

let obstacles = [];

let localFC = 0; // localFrameCount
let goalIsReachedFlag = false;

const wallMargin = 20;
let pixelsInMeters = 100;

function setup() {
  createCanvas(600, 400);
  noSmooth();
}

function draw() {
  background(245);

  let startingScene = currentScene;
  localFC++;
  currSec = localFC / 30;


  switch (currentScene) {

    // Add Developer Logo in the beginning as well?
    case -1:
      // Startup
      background( 0 );
      
      if( currSec > 1 ){
        fill(255);
        textAlign(CENTER);
        textStyle(BOLD);
        text('-OliFour-', width/2, height/2);
        textStyle(NORMAL);
        text('presents', width/2, height/2+20);
      }
      if( currSec > 4 ){
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

        // create firs obstacle
        obstacles.push(new Obstacle(0, 0, 300, 80, 'desk'));
        obstacles.push(new Obstacle(160, 80, 80, 50, 'chair'));
        obstacles.push(new Obstacle(0, height, 240, 160, 'bed'));
        obstacles.push(new Obstacle(30, 150, 50, 50, 'bedside table'));
        obstacles.push(new Obstacle(320, 180, 80, 80, 'chair'));
        obstacles.push(new Obstacle(width, 40, 80, 200, 'shelf'));

        level = new Level('Schwäbisch Gmünd', false);
        lamp = new LampProtagonist(width, height - 150, width, height, 6);
        goal = new Goal(0, 100);
      } else {

        level.build();
      }
      break;
    case 4:
      // display second level
      if (localFC === 1) {

        // create firs obstacle
        obstacles.push(new Obstacle(0, 0, 260, 90, 'wall'));
        obstacles.push(new Obstacle(270, 0, 280, 100, 'bed'));
        obstacles.push(new Obstacle(50, 90, 180, 70, 'table'));

        obstacles.push(new Obstacle(0, height, 160, 80, 'shelf'));
        obstacles.push(new Obstacle(170, height, 180, 60, 'shelf'));

        obstacles.push(new Obstacle(300, 200, 20, 40, 'shoe'));
        obstacles.push(new Obstacle(340, 170, 40, 20, 'shoe'));

        obstacles.push(new Obstacle(width, 170, 100, 20, 'door'));

        level = new Level('Hamburg', true);
        lamp = new LampProtagonist(width, height, width, height, 7);
        goal = new Goal(0, 90);
      } else {

        level.build();
      }
      break;
    case 5:
      // display third level
      if (localFC === 1) {
        obstacles.push(new Obstacle(180, 60, 80, 200, 'bed'));
        obstacles.push(new Obstacle(90, 40, 20, 30, 'book'));
        obstacles.push(new Obstacle(50, 130, 30, 40, 'magazine'));
        obstacles.push(new Obstacle(80, 240, 30, 40, 'magazine'));

        obstacles.push(new Obstacle(width, height, 200, 60, 'shelf'));

        obstacles.push(new Obstacle(360, 0, 20, 180, 'wall'));
        obstacles.push(new Obstacle(width, 160, 120, 20, 'wall'));

        level = new Level('Lund', true);
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
        obstacles.push(new Obstacle(0, 0, 180, 120, 'bed'));
        obstacles.push(new Obstacle(190, 0, 180, 60, 'desk'));
        obstacles.push(new Obstacle(250, 80, 60, 60, 'chair'));

        obstacles.push(new Obstacle(0, 160, 50, 70, 'chimney'));
        obstacles.push(new Obstacle(150, 200, 60, 60, 'chair'));
        obstacles.push(new Obstacle(350, 160, 50, 50, 'table'));

        obstacles.push(new Obstacle(180, height, 60, 30, 'shelf'));
        obstacles.push(new Obstacle(300, height, 180, 80, 'sofa'));
        obstacles.push(new Obstacle(width, 120, 80, 150, 'sofa'));

        level = new Level('München', true);
        lamp = new LampProtagonist(0, height - 80, 0, height, 6.2);
        goal = new Goal(width, 0);
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

  fill(0, localFC - 2 * fps);
  textAlign(CENTER);
  textSize(16);
  text("The Legend of", width / 2, 140);
  textSize(64);
  text("Lamp", width / 2, 200);

  if (localFC > 4 * fps) {
    textSize(16);
    text("Press Enter", width / 2, height - 140);
  }

  textSize(12);
  fill(0)
  text("© Olivier Brückner 2020", width / 2, height-20);
  
  pop();
}


function introText() {
  let posTop = height - localFC;

  push();

  background(0)
  let s = `Once upon a time, there was a guy. He moved quite often, but wherever he went, he took his lamp. In the journey they passed various places so far, but they have one goal: finally reaching New York City.

This is the story. No, not of the guy, the Lamp!`;
  fill(255);
  textSize(24);
  translate(-150, 0);
  text(s, width / 2, posTop, 300, 600);

  pop();

  if (posTop < -340) {
    currentScene++;
  }
}

function storyIntro() {

  if (localFC === 1) {
    lamp = new LampProtagonist(wallMargin, height / 2, 100, 200, 10);
  }

  let guyPosTop = height - localFC;
  let isWithLamp = false;

  if (guyPosTop <= height / 2 + 40) {
    guyPosTop = height / 2 + 40;
    isWithLamp = true;
  }

  if (currSec > 8) {
    currentScene++;
  }

  push();

  textAlign(CENTER);

  if (currSec > 2) {
    textSize(24);
    fill(0);
    text("It's dangerous to go alone. Take this!", width / 2, 100);
  }

  // wise man 
  rect(width / 2 - 20, 120, 40, 40);

  // guy
  rect(width / 2 - 20, guyPosTop, 40, 40);

  // lamp
  lamp.story(width / 2, height / 2, isWithLamp);

  pop();
}

function storyOutro() {
  push();
  fill(0);
  textAlign(CENTER);
  textSize(24);
  text("On our way to New York", width / 2, 100);

  textSize(16);
  text("Press Enter to Start Again", width / 2, height - 50);

  pop();
}

class Level {
  constructor(placeName = '', isDark = false) {
    this.isDark = isDark;
    this.name = placeName;
  }

  build() {
    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].place();
    }
    goal.place();

    if (this.isDark) {
      push();
      blendMode(DARKEST);
      if (lamp.isOn) {
        noStroke();
        fill(0, 220);
        beginShape();
        vertex(0, 0);
        vertex(width, 0);
        vertex(width, height);
        vertex(0, height);

        beginContour();
        /*
          vertex(lamp.x + lamp.width / 2, lamp.y - 100 + lamp.height / 2);
          vertex(lamp.x - 100 + lamp.width / 2, lamp.y + lamp.height / 2);
          vertex(lamp.x + lamp.width / 2, lamp.y + 100 + lamp.height / 2);
          vertex(lamp.x + 100 + lamp.width / 2, lamp.y + lamp.height / 2);
        */
        // this part is from 
        // https://stackoverflow.com/questions/18260325/draw-perfect-ellipsecircle-using-beginshape-in-processing
        let sides = 40;
        let r = 100
        let angle = 360 / sides;
        for (let i = 0; i < sides; i++) {
          let x = cos(radians(-i * angle)) * r;
          let y = sin(radians(-i * angle)) * r;
          vertex(lamp.x + lamp.width/2 + x, lamp.y + lamp.height / 2 + y);
        }
        endContour();

        endShape(CLOSE);

      } else {
        fill(0, 230);
        rect(0, 0, width, height);
      }
      pop();
    }

    lamp.stand();

    renderStats(lamp.lenghtLeft, this.name)

    if (goalIsReachedFlag) {
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

  constructor(x, y, w = 50, h = 50, l = '') {
    this.x = (x + w >= width) ? x - wallMargin - w : x + wallMargin;
    this.y = (y + h >= height) ? y - wallMargin - h : y + wallMargin;
    this.height = h;
    this.width = w;
    this.label = l;
    // this.isDark = false;
  }

  place() {
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


class Goal {
  constructor(x, y) {
    this.x = (x + 50 >= width) ? x - wallMargin - 50 : x + wallMargin;
    this.y = (y + 50 >= height) ? y - wallMargin - 50 : y + wallMargin;
    this.height = 50;
    this.width = 50;
  }
  place() {
    push();
    noStroke();
    fill("#93D9A7");
    rect(this.x, this.y, this.width, this.height);
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
    this.cableShiftY = 20;
    this.maxLength = maxLength;
    this.lenghtLeft = this.maxLength;
    this.cablePoints = [{
      x: (socketX + wallMargin >= width) ? socketX - wallMargin : socketX + wallMargin,
      y: (socketY >= height) ? socketY - wallMargin : socketY + wallMargin
    }];
  }

  stand() {
    // build cable
    let calcLength = 0;
    push();

    noFill();
    stroke(20);
    strokeWeight(4);
    strokeJoin(ROUND);
    beginShape();

    for (var i = 0; i < this.cablePoints.length; i++) {
      vertex(this.cablePoints[i].x, this.cablePoints[i].y);

      if (i < this.cablePoints.length - 1) {
        calcLength += dist(this.cablePoints[i].x, this.cablePoints[i].y, this.cablePoints[i + 1].x, this.cablePoints[i + 1].y)
      }
    }
    vertex(this.x, this.y + this.cableShiftY);
    endShape();

    calcLength += dist(this.cablePoints[this.cablePoints.length - 1].x, this.cablePoints[this.cablePoints.length - 1].y, this.x, this.y + this.cableShiftY)

    pop();

    // save cable length
    this.lenghtLeft = round(((this.maxLength * pixelsInMeters - calcLength) / pixelsInMeters), 1);

    // build lamp
    push();
    noStroke();
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
    } else {
      fill(160);
    }
    rect(this.x, this.y, this.width, this.height);
    pop();
  };

  story(x, y, withLamp) {
    push();
    let size = 30;
    if (withLamp) {
      size = 60;
    }
    rect(x - size / 2, y, size, size);
    pop();
  }

  toggleLight() {
    this.isOn = !this.isOn;
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
      let cx2 = newX;
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
    if (goal &&
      newX + this.width / 2 > goal.x &&
      newX + this.width / 2 < goal.x + goal.width &&
      newY + this.height / 2 > goal.y &&
      newY + this.height / 2 < goal.y + goal.height) {
      // level completed
      console.log('🎉');
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
    }
  }
}

function renderStats(cableLength, title = '') {
  push();
  fill(0);
  if( level.isDark ){
    fill(255);
  }
  
  textAlign(LEFT);
  text(cableLength + ' meters left', 10, 20);

  textAlign(RIGHT)
  text(title, width - 10, 20);
  pop();
}

function checkMove() {
  if (lamp) {
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
      if (currentScene === 0 || currentScene === 1 || currentScene === 2) {
        currentScene++;
        localFC = 0;
      } else if (currentScene === 7) {
        currentScene = 0;
      }
      break;
  }
  
  // prevent default
  return false;
}

// really prevent default!!
window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
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