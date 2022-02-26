function setup() {
  canvasHeight = 700;
  canvasWidth = 1500;
  
  armX = 480;
  armY = 410;
  
  theta1 = 0;
  theta2 = 0;
  
  thetaSum = 0;
  
  axX = 0
  axY = 100
  
  armed = 0
  
  dud = 0
  
  target = 0
  
  hit1 = 0
  hit2 = 0
  
  dubBonus = 0
  
  hitGround = 1
  
  scoreUpdate = 0
  
  printColor = 0
  
  bullsEye = 0
  targetH = 400
  
  wallSet = 0
  wallX = 1350
  
  axTheta = 0
  deltaTheta = 0
  velX = 0
  velY = 0
  axXprev = 0
  axYprev = 0
  thetaPrev = 0
  
  firstTime = 1
  firstCheck = 0
  
  handPosX = armX
  handPosY = armY
  
  handXprev = 0
  handYprev = 0
  
  drift1 = 400
  drift2 = 900
  drift3 = 1300
  drift4 = drift1 - canvasWidth*1.6
  drift5 = drift2 - canvasWidth*1.4
  drift6 = drift3 - canvasWidth*1.5
  
  handX = 0
  handY = 0
  
  wait = 0
  
  throwOk = 1
  
  miss = 0
  
  beard = 0
  buttonX = 5
  buttonY = 87
  
  g = 0.1;
  
  timeToRest = 0
  
  mouseJustPressed = 0
  
  clicked = 0
  
  score = 0
  
  let sty = getComputedStyle(document.querySelector("canvas"));
  console.log(sty.getPropertyValue('--height')); // #999999
  
  createCanvas(canvasWidth, canvasHeight);
}

function draw() {
  
  axXprev = axX
  axYprev = axY
  thetaPrev = thetaSum
  
  handXprev = handX
  handYprev = handY
  
  theta1  = -4
  theta2 = 2.5
  
  if (keyIsDown(RIGHT_ARROW) & armX < 490){
    armX += 3
  }
  if (keyIsDown(LEFT_ARROW) & armX > 100){
    armX -= 3
  }
  
  
  // Sky
  background(240-20,255-20,255-20)
  
  drift1 += 0.1
  drift2 += 0.1
  drift3 += 0.1
  drift4 += 0.1
  drift5 += 0.1
  drift6 += 0.1
  
  if (1290 -375 + drift3/4 - 800 > canvasWidth + 200){
    drift3 = - 800
  }
  if (1290 -175+drift2/2 - 800 > canvasWidth + 500){
    drift2 = -900
  }
  if (400+drift1 - 800 > canvasWidth + 900){
    drift1 = - 1000
  }
  if (1290 -375 + drift6/4 - 800 > canvasWidth + 200){
    drift6 = - 800
  }
  if (1290 -175+drift5/2 - 800 > canvasWidth + 500){
    drift5 = -900
  }
  if (400+drift4 - 800 > canvasWidth + 900){
    drift4 = - 1000
  }
  
  fill(241)
  ellipse(1290 -375 + drift3/4 - 800,280 + 75,150, 50)
  circle(1200-350 + drift3/4 - 800,270+75, 35)
  circle(1250-375 + drift3/4+20 - 800, 260+75+5, 73)
  circle(1300-375 +20 +  drift3/4 - 800,240+95, 55)
  circle(1350-375+ drift3/4 - 800,250+90 , 35)
  
  fill(243)
  ellipse(1290 -175+drift2/2 - 800,280,250, 100)
  circle(1200-175 + drift2/2 - 800,270, 75)
  circle(1250-175 + drift2/2 - 800, 260, 85)
  circle(1300-175 + drift2/2 - 800,240, 70)
  circle(1350-175+drift2/2 - 800,250, 70)
  
  fill(245)
  ellipse(400+drift1 - 800,170,500, 200)
  circle(220+drift1 - 800,150, 150)
  circle(350+drift1 - 800, 90, 190)
  circle(475+drift1 - 800,100, 140)
  circle(590+drift1 - 800,150, 140)
  
  // 2nd Set
  fill(241)
  ellipse(1290 -375 + drift6/4 - 800,280 + 75,150, 50)
  circle(1200-350 + drift6/4 - 800,270+75, 35)
  circle(1250-375 + drift6/4+20 - 800, 260+75+5, 73)
  circle(1300-375 +20 +  drift6/4 - 800,240+95, 55)
  circle(1350-375+ drift6/4 - 800,250+90 , 35)
  
  fill(243)
  ellipse(1290 -175+drift5/2 - 800,280,250, 100)
  circle(1200-175 + drift5/2 - 800,270, 75)
  circle(1250-175 + drift5/2 - 800, 260, 85)
  circle(1300-175 + drift5/2 - 800,240, 70)
  circle(1350-175+drift5/2 - 800,250, 70)
  
  fill(245)
  ellipse(400+drift4 - 800,170,500, 200)
  circle(220+drift4 - 800,150, 150)
  circle(350+drift4 - 800, 90, 190)
  circle(475+drift4 - 800,100, 140)
  circle(590+drift4 - 800,150, 140)
  
  
  fill(100)
  textSize(32);
  text((wallX - armX)/100 + "yds", 10, 30);
  fill (150)
  if (clicked == 0){
  text("Click and use the Arrow keys to move.", 450, 30)
  }

  // Ground
  fill(104, 199, 124)
  ellipse(canvasWidth-200, canvasHeight - 50, 1000, 300)
  fill(84,189,84)
  // Hill
  ellipse(canvasWidth/3, canvasHeight, 1400,400)
  
  //fill(200, 100, 100)
  //rect(canvasWidth - 300, canvasHeight - 230, 40, 40)
  //triangle(canvasWidth-300, canvasHeight-230, canvasWidth-300 + 40, canvasHeight-230, canvasWidth-300 + 20, canvasHeight-230 - 20) 

  
  fill(84,189,84)
  strokeWeight(0)
  rect(0, canvasHeight*4/5, canvasWidth, canvasHeight*1/5)
  
  
  // Head
  fill(255,235,205)
  headX = armX+7
  headY = armY-45
  circle(headX, headY, 60)  
  
  // Beard Button
  if (beard == 0){
    fill(139, 69, 19)
  }
  else{
    fill(250)
  }
  
  rect(buttonX, buttonY, 100, 30)
  fill(240 - beard*200)
  if (beard == 1){
    text("Shave", buttonX + 7, buttonY + 26)
  }
  else {
    text("Beard", buttonX + 7, buttonY + 26)
  }
  
  
  // Beard 
  if (beard == 1){
    fill(139,69,19)
    rect(headX-20, headY+15, 50,30)
    rect(headX - 15, headY-10, 10,30)
  }
  //ellipse(headX+5, headY + 32,50,41) 

  
  // Eye
  fill(255,255,255)
  circle(armX+8 + 15, armY-45 + 1, 12) 
  
  // Eyeball
  fill(0)
  circle(armX+8 + 17, armY-45 + 1, 6)
  
  // Hat
  fill(120,120,120)
  quad(headX-30, headY - 6, headX-30, headY-30, headX+30, headY-30, headX + 30, headY - 6)
  fill(100,100,100)
  strokeWeight(0)
  ellipse(headX - 30, headY + 20, 20, 70)
  
  //Body
  fill(128,14,14)
  quad(armX-20, armY, armX - 20, armY + 100, armX + 20, armY + 100, armX + 20, armY)
  
  // Legs
  // Back Leg
  fill(110,110,0)
  quad(armX - 20, armY + 100, armX + 20, armY + 100, armX - 20, armY + 100 + 80, armX - 50, armY + 100 + 80)
  // Front Leg
  fill(128,128,0)
  quad(armX - 20, armY + 100, armX + 20, armY + 100, armX + 70, armY + 100 + 80, armX + 40, armY + 100 + 80)
  
  // Boots
  fill(160,130,90)
  rect(armX + 40, armY + 100 + 80, 40, 20)
  rect(armX - 50, armY + 100 + 80, 40, 20)
  
  // Shoulder
  fill(178,34,34)
  circle(armX,armY, 30)
  fill(178,34,34)
  
  
  handPosX = handPosX + (mouseX - armX)
  handPosY = handPosY + (mouseY - armY)
  
  handPosX = handPosX/2
  handPosY = handPosY/2
  
  
  
  // Inverse Kinematics
  if (sqrt(handPosX*handPosX + handPosY*handPosY) > 60+60){
    theta1 = -atan2(handPosY, handPosX) +PI*3/2
    theta2 = 0
  }
  else{
    c = sqrt(handPosX*handPosX + handPosY*handPosY)
    C = acos((60*60 + 60*60 - c*c)/(2*60*60))
    theta2 = PI - C
    theta1 = -atan2(handPosY, handPosX) - (PI - C)/2 - PI/2
    if (mouseX > 0 & firstTime ==1){
      firstTime = 0
    }
  }
  
  // Upper arm
  quad(armX - 10*cos(theta1), armY + 10*sin(theta1), armX + 10*cos(theta1), armY - 10*sin(theta1), armX + 10*cos(theta1) - 60*sin(theta1), armY - 10*sin(theta1) - 60*cos(theta1), armX - 10*cos(theta1) - 60*sin(theta1), armY + 10*sin(theta1) - 60*cos(theta1)) 
  
  // Elbow
  newArmX = armX - 60*sin(theta1)
  newArmY = armY - 60*cos(theta1)
  thetaSum = theta1 + theta2
  circle(newArmX,newArmY, 24)
  
  
  len = 85
  
  handX = newArmX - 68*sin(thetaSum)
  handY = newArmY - 68*cos(thetaSum)
  
  if (velY ==0 & wait > 5){
    throwOk = 1
  }
  else if(velY == 0){
    if (hitGround == 1){
      wait += 0.125
    }
    if (hit1+hit2 > 0){
      wait += 0.125
    }
  }
  else {
    thowOk = 0
    wait = 0
  }
  
  if (firstTime != 0){
    armed = 0
  }
  else if (firstCheck == 0){
    throwOk = 1
    firstCheck = 1
  }
  
  

  
  // Hatchet ballistics
  if (sqrt(handPosX*handPosX + handPosY*handPosY) < 60+60 & throwOk == 1 ){
    if (bullsEye == 1){
      bullsEye = 0
      targetH = random(200, 475)
    }
    armed = 1
    timeToRest = 0
    axTheta = thetaSum
    axX = handX - 80*cos(axTheta)
    axY = handY + 80*sin(axTheta)
    velX = axX - axXprev
    velY = -(axY - axYprev)
    
    velX = (velX + handX - handXprev)/2.2
    velY = (velY - handY + handYprev)/2.2

    
    deltaTheta = 0.7*(thetaSum - thetaPrev)
    g = 0.1
    dud = 0
    target = 0
    hit1 = 0
    hit2 = 0
    hitGround = 0
    dubBonus = 0
  }
  else if (armed == 1 ){
    throwOk = 0
    axTheta += deltaTheta
    axX += velX
    velY -= 5*g
    axY -= velY
  }
  else if (armed == 0){
    throwOk = 0
    axTheta = thetaSum
    axX = handX - 80*cos(axTheta)
    axY = handY + 80*sin(axTheta)
    velX = axX - axXprev
    velY = -(axY - axYprev)
    
    velX = (velX + handX - handXprev)/2
    velY = (velY - handY + handYprev)/2
    
    deltaTheta = thetaSum - thetaPrev
  }
  
  if (velX > 40){
      velX = 40
    }
    if (velY > 40 ){
      velY = 40
    }
  
  
  // Hatchet
  strokeWeight(8)
  stroke(222,184,135)
  
  // Handle
  handleTopX = axX - 42*cos(axTheta);
  handleTopY = axY + 42*sin(axTheta)
  handleBotX = axX + 85*cos(axTheta);
  handleBotY = axY - 85*sin(axTheta)
  line(handleBotX, handleBotY, handleTopX, handleTopY )
  strokeWeight(0)
  
  if (timeToRest > 3 & abs(handleBotY - handleTopY) < 7) {
    deltaTheta = 0
    axTheta = 0
    velY = 0
    velX = 0
    axY = (armY+200) -3
    hitGround = 1
  }
  
  if (handleBotY < armY+200){
    handleBotY -= armY + 200 +1
  }
  if (handleTopY < armY+200){
    handleTopY -= armY + 200 +1
  }
  
  // Blade 
  // Top of blade
  bladeTopX = axX - 50*cos(axTheta) - 30*sin(axTheta)
  bladeTopY = axY +50*sin(axTheta) - 30*cos(axTheta)
  // Bottom of blade
  bladeBotX = axX - 10*cos(axTheta) - 30*sin(axTheta)
  bladeBotY = axY +10*sin(axTheta) - 30*cos(axTheta)
  //Draw blade
  fill(140)
  quad(axX - 45*cos(axTheta), axY +45*sin(axTheta), axX - 15*cos(axTheta), axY +15*sin(axTheta), bladeBotX, bladeBotY, bladeTopX, bladeTopY)
  
  
  // wallX = 1600
  
  // Tree trunk
  fill(139+25,69+25,19+25)
  rect(wallX, 0, 100, canvasHeight-100)
  
  // Target
  
  
  fill(255)
  arc(wallX, targetH, 70, 210, 3*PI/2, PI/2); 
  fill(255, 0, 0)
  arc(wallX, targetH, 30, 90, 3*PI/2, PI/2); 
  
  
  
  // If top of blade hits tree
  if (bladeTopX > wallX & dud == 0 & (bladeTopY +bladeBotY)/2 > 50){
    if(handleTopX > wallX ){
      axX -= handleTopX - wallX 
      velX = -0.5*velX
    }
    else{
      velX = 0
      velY = 0
      deltaTheta = 0
      g = 0
      hit1 = 1
    }
    hit1 = 1
  }
  // If bottom of blade hits tree
  if (bladeBotX > wallX & dud == 0 & (bladeTopY +bladeBotY)/2 > 50){
    if(axX + 95*cos(axTheta) > wallX){
      axX -= handleBotX - wallX
      deltaTheta = deltaTheta*(handleTopY - handleBotY)/(95+45)
      velX = -velX*0.5*abs(1-abs(handleTopY - handleBotY)/(95+45))
    }
    else{
      velX = 0
      velY = 0
      deltaTheta = 0
      g = 0
      hit2 = 1
    }
    hit2 = 1
  }
  // If the bottom of handle hits tree
  if(handleBotX > wallX )  {
    dud = 1
    axX -= handleBotX - wallX + 3
    deltaTheta = -deltaTheta*(handleTopY - handleBotY)/(95+45)
    velX = -abs(velX)*0.5*abs(1-abs(handleTopY - handleBotY)/(95+45))
  }
  // If the top of handle hits tree
  else if(handleTopX > wallX){
    dud = 1
    velX = -0.5*velX
    axX -= handleTopX - wallX + 3
  }

  
  
  
  // If top of blade hits ground
  if (bladeTopY > armY+200){
    
    if(handleTopY > armY+200){
      timeToRest += 1
      deltaTheta = 0.1*(handleTopX - handleBotX)/(95+45)
      velY = -velY*0.5*abs(1-abs(handleTopX - handleBotX)/(95+45))
      velX = 0
      axY -= handleTopY - (armY+200) + 1
      hitGround = 1
    }
    else {
      velX = 0
      velY = 0
      deltaTheta = 0
      g = 0
      hitGround = 1
      hit1 = 0
      hit2 = 0
    }
  }
  // If bottom of blade hits ground
  else if (bladeBotY > armY+200){
    
      velX = 0
      velY = 0
      deltaTheta = 0
      g = 0
      hitGround = 1
      hit1 = 0
      hit2 = 0
      
  }
  // If the bottom of handle hits ground
  else if(handleBotY > armY+200 & timeToRest <=3)  {
    timeToRest += 1
    axY -= handleBotY - (armY+200) + 1
    deltaTheta = -0.1*(handleTopX - handleBotX)/(95+45)
    hitGround = 1
    if (abs(deltaTheta) < 0.01) {
      deltaTheta = deltaTheta*10
    }
    velY = -velY*0.5*abs(1-abs(handleTopX - handleBotX)/(95+45))
    velX = 0
    hit1 = 0
    hit2 = 0
  }
  // If the top of handle hits ground
  else if(handleTopY > armY+200 & timeToRest <=3){
    timeToRest += 1
    hitGround = 1
    deltaTheta = 0.1*(handleTopX - handleBotX)/(95+45)
    if (abs(deltaTheta) < 0.01) {
      deltaTheta = deltaTheta*10
    }
    velY = -velY*0.5*abs(1-abs(handleTopX - handleBotX)/(95+45))
    velX = 0
    axY -= handleTopY - (armY+200) + 1
    hit1 = 0 
    hit2 = 0
  }
 
  
  // Bullseye Detection
  if (hit1 == 0 & hit2 == 1 & g == 0){
    if (bladeBotY > targetH - 46 & bladeBotY < targetH + 46){
      fill(100)
      textSize(52);
      text("+50", wallX - 100, bladeTopY-20);
      textSize(72);
      text("BULLSEYE!", 400,200)
      if (wait == 5){
        score += 50
        bullsEye = 1
        miss = 0
      }
      target = 1
    }
  }
  if (hit1 == 1 & hit2 == 0 & g == 0){
    if (bladeTopY > targetH - 46 & bladeTopY < targetH + 46){
      fill(100)
      textSize(52);
      text("+50", wallX - 100, bladeTopY-20);
      textSize(72);
      text("BULLSEYE!", 400,200)
      if (wait == 5){
        score += 50
        bullsEye = 1
        miss = 0
      }
      target = 1
    }
  }
  if (hit1 == 1 & hit2 == 1 & g == 0){
    if (bladeTopY > targetH - 46 & bladeTopY < targetH + 46 & bladeBotY > targetH - 46 & bladeBotY < targetH + 46){
      fill(100)
      textSize(52);
      text("+50", wallX - 100, bladeTopY-20);
      textSize(72);
      text("BULLSEYE!", 400,200)
      if (wait == 5){
        score += 50
        miss = 0
        bullsEye = 1
      }
      target = 1
    }
  }
  
  // White detection
  if (hit1 == 0 & hit2 == 1 & g == 0){
    if (bladeBotY < targetH - 46 & bladeBotY > targetH - 105){
      fill(100)
      textSize(52);
      text("+10", wallX - 100, bladeTopY);
      if (wait == 5){
        score += 10
        miss = 0
      }
      target = 1
    }
    if (bladeBotY > targetH + 46 & bladeBotY < targetH + 105){
      fill(100)
      textSize(52);
      text("+10", wallX - 100, bladeTopY);
      if (wait == 5){
        score += 10
        miss = 0
      }
      target = 1
    }
  }
  if (hit1 == 1 & hit2 == 0 & g == 0){
    if (bladeTopY > targetH + 46 & bladeTopY < targetH + 105){
      fill(100)
      textSize(52);
      text("+10", wallX - 100, bladeTopY);
      if (wait == 5){
        score += 10
        miss = 0
      }
      target = 1
    }
    if (bladeTopY < targetH - 46 & bladeTopY > targetH - 105){
      fill(100)
      textSize(52);
      text("+10", wallX - 100, bladeTopY);
      if (wait == 5){
        score += 10
        miss = 0
      }
      target = 1
    }
  }
  if (hit1 == 1 & hit2 == 1 & g == 0){
    if (bladeTopY > targetH + 46 & bladeTopY < targetH + 105){
      fill(100)
      textSize(52);
      text("+10", wallX - 100, bladeTopY);
      if (wait == 5){
        score += 10
        miss = 0
      }
      target = 1
    }
    if (bladeBotY > targetH + 46 & bladeBotY < targetH + 105){
      fill(100)
      textSize(52);
      text("+10", wallX - 100, bladeTopY);
      if (wait == 5){
        score += 10
        miss = 0
      }
      target = 1
    }
    if (bladeBotY < targetH - 46 & bladeBotY > targetH - 105){
      fill(100)
      textSize(52);
      text("+10", wallX - 100, bladeTopY);
      if (wait == 5){
        score += 10
        miss = 0
      }
      target = 1
    }
    if (bladeTopY < targetH - 46 & bladeTopY > targetH - 105){
      fill(100)
      textSize(52);
      text("+10", wallX - 100, bladeTopY);
      if (wait == 5){
        score += 10
        miss = 0
      }
      target = 1
    }
  }
  
  if (target == 0 & hit1+hit2 > 0 & g == 0){
    fill(100)
    textSize(52);
    text("+3", wallX - 100, bladeTopY);
    if (wait == 5){
        score += 3
        miss = 0
      }
  }
  
  // Hand
  fill(255,235,205)
  circle(newArmX - 68*sin(thetaSum),newArmY - 68*cos(thetaSum), 25)
  fill(178,34,34)
  
  if (hitGround == 1 & hit1+hit2 == 0){
    fill(100)
    textSize(52);
    if (wait <= 5 & firstTime == 0){
      text(-7*miss, (bladeTopX+bladeBotX)/2 - 15, (bladeTopY+bladeBotY)/2 - 50);
    }
    else if(firstTime == 0){
      text(-7*miss+7, (bladeTopX+bladeBotX)/2 - 15, (bladeTopY+bladeBotY)/2 - 50);
    }
    if (wait == 5){
        score -= 7*miss
        miss += 1
      }
    
  }
  else if (velY == 0 & bladeBotX < wallX - 50){
    fill(100)
    textSize(52);
    if (wait <= 5 & firstTime == 0){
      text(-7*miss, (bladeTopX+bladeBotX)/2 - 15, (bladeTopY+bladeBotY)/2 - 50);
    }
    else if (firstTime == 0){
      text(-7*miss+7, (bladeTopX+bladeBotX)/2 - 15, (bladeTopY+bladeBotY)/2 - 50);
    }
    if (wait == 5){
        score -= 7*miss
     miss += 1
    }
  }
  
  

 
  // Forearm
  fill(140,130,40)
  quad(newArmX - 10*cos(thetaSum), newArmY + 10*sin(thetaSum), newArmX + 10*cos(thetaSum), newArmY - 10*sin(thetaSum), newArmX + 10*cos(thetaSum) - 60*sin(thetaSum), newArmY - 10*sin(thetaSum) - 60*cos(thetaSum), newArmX - 10*cos(thetaSum) - 60*sin(thetaSum), newArmY + 10*sin(thetaSum) - 60*cos(thetaSum)) 
  
  // Tree canopy
  fill(34,139,34)
  circle(wallX+50, -200, 500)
  
  // Ground for Axe to sink into
  // Ground
  fill(84,189,84)
  strokeWeight(0)
  rect(0, armY+200, canvasWidth, canvasHeight*1/5)
  
  
  
 
  
  if (hit1+hit2 > 0 & axTheta < -10 & dubBonus == 0 & velY == 0){
    score += 200
    dubBonus = 1
  }
  if (dubBonus == 1){
    textSize(100)
    fill(100)
    text("Double Flip +200!", 250, 300)
  }
  // Score text
  if (score >= 0){
    fill(100)
  }
  else {
    fill(200,0,0)
  }
  textSize(32);
  text("Score: "+score, 10, 70)
  
}

function mouseClicked() {
  armed = 1
  clicked = 1
  if (mouseX > buttonX & mouseX < buttonX +100 & mouseY >buttonY & mouseY < buttonY + 30){
  if (beard == 1) {
    beard = 0;
  } else {
    beard = 1;
  }
  }
}