const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

function resize(){
  canvas.width=innerWidth;
  canvas.height=innerHeight;
}
resize();

addEventListener("resize",resize);

/* TEXTURE */
const ground=new Image();
ground.src="ground.jpg";

/* PLAYER */
const player={
  x:500,
  y:500,
  r:16,
  speed:3,
  inside:false,
  hp:100
};

/* CAMERA */
const cam={
  x:0,
  y:0
};

/* HOUSES */
const houses=[];

for(let i=0;i<6;i++){

  houses.push({
    x:300+i*250,
    y:300+(i%2)*300,
    w:180,
    h:160,
    barricaded:false
  });

}

/* ZOMBIES */
const zombies=[];

for(let i=0;i<25;i++){

  zombies.push({
    x:Math.random()*2000,
    y:Math.random()*2000,
    r:14
  });

}

/* INPUT */
const keys={};

addEventListener("keydown",e=>{
  keys[e.key.toLowerCase()]=true;
});

addEventListener("keyup",e=>{
  keys[e.key.toLowerCase()]=false;
});

/* JOYSTICK */
let joyX=0;
let joyY=0;

const joy=document.getElementById("joy");
const stick=document.getElementById("stick");

joy.addEventListener("touchmove",e=>{

  e.preventDefault();

  const t=e.touches[0];
  const r=joy.getBoundingClientRect();

  let dx=t.clientX-(r.left+r.width/2);
  let dy=t.clientY-(r.top+r.height/2);

  const max=40;

  dx=Math.max(-max,Math.min(max,dx));
  dy=Math.max(-max,Math.min(max,dy));

  joyX=dx/max;
  joyY=dy/max;

  stick.style.transform=
  `translate(${dx*0.3}px,${dy*0.3}px)`;

});

joy.addEventListener("touchend",()=>{

  joyX=0;
  joyY=0;

  stick.style.transform=
  "translate(0px,0px)";

});

/* COLLISION */
function move(nx,ny){

  for(let h of houses){

    if(
      nx>h.x &&
      nx<h.x+h.w &&
      ny>h.y &&
      ny<h.y+h.h &&
      !player.inside
    ){
      return;
    }
  }

  player.x=nx;
  player.y=ny;
}

/* ENTER HOUSE */
function interact(){

  for(let h of houses){

    const d=Math.hypot(
      player.x-(h.x+h.w/2),
      player.y-(h.y+h.h/2)
    );

    if(d<120){

      if(!h.barricaded){

        player.inside=!player.inside;

      }

      return;
    }
  }
}

/* BARRICADE */
function toggleBarricade(){

  for(let h of houses){

    const d=Math.hypot(
      player.x-(h.x+h.w/2),
      player.y-(h.y+h.h/2)
    );

    if(d<120){

      h.barricaded=!h.barricaded;

      return;
    }
  }
}

/* FULLSCREEN */
function toggleFullscreen(){

  if(!document.fullscreenElement){

    document.documentElement
    .requestFullscreen();

  }else{

    document.exitFullscreen();

  }
}

/* UPDATE */
function update(){

  let dx=
  (keys["d"]?1:0)-
  (keys["a"]?1:0)+joyX;

  let dy=
  (keys["s"]?1:0)-
  (keys["w"]?1:0)+joyY;

  if(dx||dy){

    const l=Math.hypot(dx,dy);

    dx/=l;
    dy/=l;

    move(
      player.x+dx*player.speed,
      player.y+dy*player.speed
    );
  }

  for(let z of zombies){

    const a=Math.atan2(
      player.y-z.y,
      player.x-z.x
    );

    z.x+=Math.cos(a)*0.8;
    z.y+=Math.sin(a)*0.8;

    if(
      Math.hypot(player.x-z.x,player.y-z.y)
      < 18
    ){
      player.hp-=0.1;
    }
  }

  cam.x=player.x-canvas.width/2;
  cam.y=player.y-canvas.height/2;

  document.getElementById("hp")
  .innerText=Math.floor(player.hp);

  document.getElementById("status")
  .innerText=
  player.inside
  ?"INSIDE"
  :"OUTSIDE";
}

/* DRAW */
function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  /* GROUND */
  ctx.drawImage(
    ground,
    0,
    0,
    canvas.width,
    canvas.height
  );

  /* HOUSES */
  for(let h of houses){

    ctx.fillStyle=
    h.barricaded
    ?"#5c4033"
    :"#333";

    ctx.fillRect(
      h.x-cam.x,
      h.y-cam.y,
      h.w,
      h.h
    );

    /* DOOR */
    ctx.fillStyle="#8b5a2b";

    ctx.fillRect(
      h.x+h.w/2-15-cam.x,
      h.y+h.h-10-cam.y,
      30,
      10
    );
  }

  /* ZOMBIES */
  for(let z of zombies){

    ctx.fillStyle="green";

    ctx.beginPath();

    ctx.arc(
      z.x-cam.x,
      z.y-cam.y,
      z.r,
      0,
      Math.PI*2
    );

    ctx.fill();
  }

  /* PLAYER */
  ctx.fillStyle="red";

  ctx.beginPath();

  ctx.arc(
    player.x-cam.x,
    player.y-cam.y,
    player.r,
    0,
    Math.PI*2
  );

  ctx.fill();
}

/* LOOP */
function loop(){

  update();
  draw();

  requestAnimationFrame(loop);
}

loop();
