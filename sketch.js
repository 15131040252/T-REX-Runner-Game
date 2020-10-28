//Gives name to the Sprites
var message="Hello";
var trex ,trex_running, trex_collided;
var ground ,groundimage,invisibleground;
var clouds ,cloudimage ,cloudsgroup;
var obstacle ,obstacle1 ,obstacle2 ,obstacle3 ,obstacle4 ,obstacle5 ,obstacle6 ,obstaclesgroup;
var gameover ,gameoverimage;
var reset ,resetimage;

var checkpointsound, jumpsound, diesound;

var score=0;


//Gamestates
var PLAY=1;
var END =0;

var gamestate=PLAY;

//Preloads the Images
function preload()
{
 trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
 trex_collided = loadAnimation("trex_collided.png")
 groundimage = loadImage("ground2.png");
 cloudimage = loadImage("cloud.png");
 obstacle1 = loadImage("obstacle1.png");
 obstacle2 = loadImage("obstacle2.png");
 obstacle3 = loadImage("obstacle3.png");
 obstacle4 = loadImage("obstacle4.png");
 obstacle5 = loadImage("obstacle5.png");
 obstacle6 = loadImage("obstacle6.png");
 gameoverimage = loadImage("gameOver.png");
 resetimage = loadImage("restart.png");

 checkpointsound = loadSound("checkPoint.mp3");
 jumpsound = loadSound("jump.mp3")
 diesound = loadSound("die.mp3");
}

function setup()
{
  //Creates the background
  createCanvas(600,200)
  
  //create a Trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale=0.5;
  trex.debug = false;
  trex.setCollider("circle", 0, 0, 40);
  
  //Creates the Ground
  ground = createSprite(300, 180, 600, 20);
  ground.addImage("groundimage", groundimage);
  
  //Creates the invisible ground
  invisibleground = createSprite(300, 190, 600, 10);
  invisibleground.visible = false;
  
  //Clouds and Obstacles group variable
  cloudsgroup = new Group();
  obstaclesgroup = new Group();
  
  //Creates the gameover and restart
  gameover = createSprite(300, 80, 20, 20);
  gameover.addImage("gameoverimage", gameoverimage);
  gameover.scale=0.5;
  reset = createSprite(300, 120, 20, 20);
  reset.addImage("resetimage", resetimage);
  reset.scale=0.3;
  
}

function draw()
{
  //Gives colour to the background
  background("black");
  
  console.log(message);
  
  //Calculated the score
  textSize(20);
  text("Score : " + score, 300, 20);
    
  //Gives functions to perform as per the gamesatate
  if(gamestate===PLAY)
  {
    ground.velocityX=-(5+2*Math.round(score/250));
    score = score+Math.round(getFrameRate()/60);
    
    //Allows Trex to jump if Space key is pressed
    if(keyDown("space") && trex.y>150)
    {
    trex.velocityY=-10;
    jumpsound.play();
    }
  
    trex.velocityY=trex.velocityY+0.5;
    
    //Increase the ground to infinite space
    if(ground.x<0)
    {
      ground.x=ground.width/2;
    }
   
    spawnclouds();
    spawnobstacle();
    
    reset.visible=false;
    gameover.visible=false;
    
    if(score % 250===0 && score>0)
      {
        checkpointsound.play();
      }
    
     if(trex.isTouching(obstaclesgroup))
     {
      gamestate=END;
      diesound.play();
     }
  } 
  else
  if(gamestate===END)
  {
    ground.velocityX=0;
    cloudsgroup.setVelocityXEach(0);
    obstaclesgroup.setVelocityXEach(0);
    trex.velocityY = 0;
    
    cloudsgroup.setLifetimeEach(-1);
    obstaclesgroup.setLifetimeEach(-1);
    
    reset.visible=true;
    gameover.visible=true;
        
    trex.changeAnimation("collided" , trex_collided);
    
    if(mousePressedOver(reset))
    {
      restart();
    }

  }
  
  //Makes the Trex walk on the ground
  trex.collide(invisibleground);  

  //Draws the Sprites
  drawSprites();
  
}

//Function for creating the clouds
function spawnclouds()
{
  if(frameCount % 60===0)
  {
  cloud = createSprite(600, 20, 5, 2);  
  cloud.addImage(cloudimage);
  cloud.velocityX=-(5+2*Math.round(score/250));
  
  //Decreases the size of the clouds
  cloud.scale=0.5;
  
  //Makes the cloud.y at random position
  cloud.y=Math.round(random(10, 60));
  
  //Keeps the trex a frame ahead of the clouds
  trex.depth=cloud.depth;
  trex.depth=trex.depth+1;
  
  cloud.lifetime=140;  
  
  //Adding members to the group
  cloudsgroup.add(cloud);
  
  console.log(frameCount);
  }
}
 //Function for creating Cacti
 function spawnobstacle()
 {
   if(frameCount % 60===0)
   {
     obstacle = createSprite(600, 160, 10, 10);
     obstacle.velocityX=-(5+2*Math.round(score/250));
     
     var rand = Math.round(random(1,6));
     
     switch(rand)
    {
      case 1: obstacle.addImage(obstacle1);
      break;
      case 2: obstacle.addImage(obstacle2);
      break;
      case 3: obstacle.addImage(obstacle3);
      break;
      case 4: obstacle.addImage(obstacle4);
      break;
      case 5: obstacle.addImage(obstacle5);
      break;
      case 6: obstacle.addImage(obstacle6);
      break;
      default:break;
    }
     
    obstacle.scale=0.5;
    obstacle.lifetime=140;
    
    //Adding members to the group
    obstaclesgroup.add(obstacle); 
   }
 }

function restart()
{
      obstaclesgroup.destroyEach();
      cloudsgroup.destroyEach();
      score=0;
      trex.changeAnimation("running",trex_running);
      gamestate=PLAY;
}