let lamp = null;

let fps = 60;
let currSec = 0;
let keyPressTimer = 0;

let obstacles = [];

let localFC = 0; // localFrameCount

const wallMargin = 20;
let pixelsInMeters = 100;

let isSlipCheck = true;

function setup() {
  createCanvas(600, 400);
  noSmooth();

  obstacles.push(new Obstacle(100, 100, 60, 60, 'box'));
  obstacles.push(new Obstacle(300, 200, 60, 60, 'box'));

  lamp = new LampProtagonist(0, 50, 220, 150, 10);
}

function draw() {
  background(245);

  localFC++;
  currSec = localFC / 30;

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].place();
  }
  lamp.stand();
  lamp.check();
  renderStats(lamp.lenghtLeft, 'Slip Check ' + (isSlipCheck ? 'on' : 'off'));

  if (keyIsPressed && keyPressTimer < 0) {
    checkMove();
    keyPressTimer = 2;
  }
  keyPressTimer--;
}


function mousePressed(){
  
  if( mouseX > 500 && mouseX < width && mouseY < 30 && mouseY >= 0 ){
    isSlipCheck = !isSlipCheck;
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
    pop();
  }
}


class LampProtagonist {

  constructor(socketX, socketY, posX, posY, maxLength) {

    const lampWidth = 50;
    const lampHeight = 70;

    this.isOn = false;
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
    }, {
      x: 180,
      y: 120
    }];
  }

  stand() {
    // build cable
    let calcLength = 0;
    push();

    noFill();
    
    // let redValue = 20;
    
    if( this.lenghtLeft <= 0.1 ){
      // redValue = map( this.lenghtLeft, 1,0, 20, 255 );
      stroke('red');
    }else{
      stroke(20);
    }
    //stroke(redValue,20,20);
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
    } else {
      fill(160);
    }

    // build display things



    rect(this.x, this.y, this.width, this.height);
    pop();
  }
  
  check() {
    push();
    // the currently last point 
    if (this.cablePoints.length > 1) {
      let lastPt = this.cablePoints[this.cablePoints.length - 1];

      let cx1 = lastPt.x;
      let cy1 = lastPt.y;
      let cx2 = this.x;
      let cy2 = this.y + this.cableShiftY;

      let prevPt = this.cablePoints[this.cablePoints.length - 2];

      let px1 = prevPt.x;
      let py1 = prevPt.y;

      stroke('blue')
      line(px1, py1, cx2, cy2)

      obstacles.forEach(obst => {


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

        let CurrentCornerPt = checkCorners(cx1, cy1, cx2, cy2, bx1, by1, bx2, by2, bx3, by3, bx4, by4);

        push();
        noStroke();
        rectMode(CENTER);
        fill(0, 0, 255, 180);
        circle(cx1, cy1, 10);
        pop();
        
        checkEdges(px1, py1, cx2, cy2, bx1, by1, bx2, by2, bx3, by3, bx4, by4, true);  
        
        if( isSlipCheck ){
          checkSlipping(px1, py1, cx1, cy1, cx2, cy2, bx1, by1, bx2, by2, bx3, by3, bx4, by4, true);
        }

      });

    }
    pop();
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

        let slipsOver = false;
        
        if( isSlipCheck ){
          slipsOver = checkSlipping(px1, py1, cx1, cy1, cx2, cy2, bx1, by1, bx2, by2, bx3, by3, bx4, by4);
        }
      
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

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// this function is from 
// http://www.jeffreythompson.org/collision-detection/line-rect.php
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4, isVis = false) {

  // calculate the direction of the lines
  let uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  let uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    if (isVis) {
      push();
      let intersectionX = x1 + (uA * (x2 - x1));
      let intersectionY = y1 + (uA * (y2 - y1));
      noStroke();
      rectMode(CENTER);
      fill(255, 0, 0, 180);
      circle(intersectionX, intersectionY, 10);
      pop();
    }
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

function checkSlipping(px1, py1, cx1, cy1, cx2, cy2, bx1, by1, bx2, by2, bx3, by3, bx4, by4, isVis = false) {

  push();
  stroke('red');
  
  let slipsOver = false;
  let slipCount = 0;

  // last point was top right
  if (cx1 === bx2 && cy1 === by2) {

    if (isVis) {
      line(bx2, by2, bx1 - width, by1);
      line(bx2, by2, bx3, by3 + height)
    }

    if (
      (
        // check if is going lower
        lineLine(px1, py1, cx2, cy2, bx2, by2, bx3, by3 + height, isVis) ||
        // check if going left
        lineLine(px1, py1, cx2, cy2, bx2, by2, bx1 - width, by1, isVis)
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
    
    if (isVis) {
      line(bx1, by1, bx4, by4 + height);
      line(bx1, by1, bx2 + width, by2)
    }
    
    if (
      (
        // check if is going lower
        lineLine(px1, py1, cx2, cy2, bx1, by1, bx4, by4 + height, isVis) ||
        // check if going right
        lineLine(px1, py1, cx2, cy2, bx1, by1, bx2 + width, by2, isVis)
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
    
    if (isVis) {
      line(bx4, by4, bx1, by1 - height);
      line(bx4, by4, bx3 + width, by3)
    }
    
    if (
      (
        // check if is going over
        lineLine(px1, py1, cx2, cy2, bx4, by4, bx1, by1 - height, isVis) ||
        // check if going right
        lineLine(px1, py1, cx2, cy2, bx4, by4, bx3 + width, by3, isVis)
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
    
    if (isVis) {
      line(bx3, by3, bx2, by2 - height);
      line(bx3, by3, bx4 - width, by4)
    }
    
    if (
      (
        // check if is going over
        lineLine(px1, py1, cx2, cy2, bx3, by3, bx2, by2 - height, isVis) ||
        // check if going right
        lineLine(px1, py1, cx2, cy2, bx3, by3, bx4 - width, by4, isVis)
      ) && (
        (px1 !== bx2 && py1 != by2) &&
        (px1 !== bx4 && py1 != by4)
      )
    ) {
      slipsOver = true;
    }

  }

  pop();
  
  return slipsOver;
}


function checkEdges(cx1, cy1, cx2, cy2, bx1, by1, bx2, by2, bx3, by3, bx4, by4, isVis = false) {
  let hitBoxLeft = lineLine(cx1, cy1, cx2, cy2, bx1, by1, bx4, by4, isVis);
  let hitBoxRight = lineLine(cx1, cy1, cx2, cy2, bx2, by2, bx3, by3, isVis);
  let hitBoxTop = lineLine(cx1, cy1, cx2, cy2, bx1, by1, bx2, by2, isVis);
  let hitBoxBottom = lineLine(cx1, cy1, cx2, cy2, bx4, by4, bx3, by3, isVis);

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