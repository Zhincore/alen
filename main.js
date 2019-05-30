//
// conf
//
const conf = {
  c:{ // Center
    x: 449,
    y: 257
  },
  lenHeight: 256,
}

let radius = 64;
let objectPosY = 0;
let objectPosX = 0;
let midline = new Path2D();
let lenline = new Path2D();
let lenLeft;
let lenCircleLeft;
let lenFocusLeft;
let lenCenterLeft;

let lenRight;
let lenCircleRight;
let lenFocusRight;
let lenCenterRight;


//
// Functions
//

//////
/// GENERATE
function genLen(r){
  let obj = new Path2D();
  const E = ((r < 0) * 2) - 1;
  obj.arc(
    conf.c.x+r, //x
    conf.c.y, //y  
    vectorLength(conf.c.x+r, conf.c.y, conf.c.x, conf.c.y-conf.lenHeight/2), //r
    vectorAngle(conf.c.x+r, conf.c.y, conf.c.x, conf.c.y-conf.lenHeight/2)*E, //startAngle
    vectorAngle(conf.c.x+r, conf.c.y, conf.c.x, conf.c.y+conf.lenHeight/2)*E // endAngle
  );
  
  return obj;
}

function genLenCircle(r){
  let obj = new Path2D();
  obj.arc(conf.c.x+r, conf.c.y, vectorLength(conf.c.x+r, conf.c.y, conf.c.x, conf.c.y-conf.lenHeight/2), 0, Math.PI*2);
  
  return obj;
}
function genLenPoint(r){
  let obj = new Path2D();
  obj.arc(conf.c.x+r, conf.c.y, 8, 0, Math.PI*2);
  obj.pos = {
    x: conf.c.x+r,
    y: conf.c.y
  };
  return obj;
}

function genImage(f, u, h0){
  let v = 1/(1/f + 1/u);
  let m = v / u;
  let h1 = m * h0;
  return [v, h1];
}

//////
/// DRAW
function drawCenterLine(ctx){
  ctx.strokeStyle = "rgba(255, 255, 255, .25)";
  ctx.fillStyle = "rgba(255, 255, 255, .25)";
  ctx.lineWidth = 4;
  ctx.stroke(midline);
}
function drawLen(ctx){
  ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
  ctx.lineWidth = 4;
  ctx.stroke(lenline);
  
  
  ctx.strokeStyle = "rgba(0, 255, 255, 0.75)";
  ctx.lineWidth = 3;
  ctx.fillStyle = "rgba(0, 127, 255, 0.25)";
  ctx.stroke(lenLeft);
  ctx.fill(lenLeft);
  ctx.stroke(lenRight);
  ctx.fill(lenRight);
  
  ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 8]);
  ctx.stroke(lenCircleLeft);
  ctx.stroke(lenCircleRight);
  ctx.setLineDash([]);
  
  
  ctx.fillStyle = "rgba(255, 64, 0, 1)";
  ctx.fill(lenFocusLeft);
  ctx.fillText('F', lenFocusLeft.pos.x+8, lenFocusLeft.pos.y+16);
  ctx.fillStyle = "rgba(255, 64, 0, 0.5)";
  ctx.fill(lenFocusRight);
  ctx.fillText('F\'', lenFocusRight.pos.x+8, lenFocusRight.pos.y+16);
  
  ctx.fillStyle = "rgba(0, 96, 255, 1)";
  ctx.fill(lenCenterLeft);
  ctx.fillText('S', lenCenterLeft.pos.x+8, lenCenterLeft.pos.y+16);
  ctx.fillStyle = "rgba(0, 96, 255, 0.5)";
  ctx.fill(lenCenterRight);
  ctx.fillText('S\'', lenCenterRight.pos.x+8, lenCenterRight.pos.y+16);
}


function vectorAngle(ax, ay, bx, by){
  return Math.atan2(by - ay, bx - ax);
}
function vectorLength(ax, ay, bx, by){
  let a = ax - bx;
  let b = ay - by;

  return Math.sqrt( a*a + b*b );
}
function rotateVector(vec, ang){
  var cos = Math.cos(ang);
  var sin = Math.sin(ang);
  return new Array(Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000, Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000);
}


//
// App
//
$(document).ready(() => {
  //
  // Init
  //
  const canvas = $("canvas#canvas").get(0);
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  radius = parseInt($("#input-lenradius")
    .css("left", conf.c.x-32-87)
    .val()
  );
  /*objectPosY = parseInt($("#input-objectposy")
    .css("top", conf.c.y-32-127)
    .val()
  );*/
  objectPosX = parseInt($("#input-objectposx")
    .css("top", conf.c.y-6.5)
    .val()
  );
    
  midline.moveTo(0, conf.c.y);
  midline.lineTo(canvas.width, conf.c.y);

  lenline.moveTo(conf.c.x, 0);
  lenline.lineTo(conf.c.x, canvas.height);

  lenLeft = genLen(radius);
  lenCircleLeft = genLenCircle(radius);
  lenFocusLeft = genLenPoint(radius/2);
  lenCenterLeft = genLenPoint(radius);

  lenRight = genLen(-radius);
  lenCircleRight = genLenCircle(-radius);
  lenFocusRight = genLenPoint(-radius/2);
  lenCenterRight = genLenPoint(-radius);
  
  //
  // Update
  //
  function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //////
    /// Midline
    ctx.font = '16px sans-serif';
    drawCenterLine(ctx);
    ctx.fillText('O', conf.c.x+4, conf.c.y+16);
    
    //////
    /// Object and its image
    ctx.drawImage($("#img-tree")[0], objectPosX, conf.c.y-64-objectPosY, 32, 64);
    let image = genImage(
      radius/2, //f
      -conf.c.x+objectPosX+16, //u
      64 //h0
    );

    // Don't let the image of object teleport to outer space
    if(objectPosX+16 < lenFocusRight.pos.x){
      if(image[1] < 0) ctx.scale(1, -1);// It is expected that the image will always be flipped
      ctx.globalAlpha = 0.75;
      ctx.drawImage($("#img-tree")[0], conf.c.x-16+image[0], -conf.c.y-objectPosY, 32, image[1]-objectPosY);
      ctx.globalAlpha = 1;
      if(image[1] < 0) ctx.scale(1, -1);
      
      //////
      /// Rays
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 0, 0, .5)";
      ctx.beginPath();
      ctx.moveTo(objectPosX+16, conf.c.y-64-objectPosY+2);
      ctx.lineTo(conf.c.x, conf.c.y-64-objectPosY+2);
      ctx.lineTo(conf.c.x+image[0], conf.c.y-image[1]+objectPosY*2-2);
      ctx.stroke();
      
      ctx.strokeStyle = "rgba(0, 255, 0, .5)";
      ctx.beginPath();
      ctx.moveTo(objectPosX+16, conf.c.y-64-objectPosY+2);
      ctx.lineTo(conf.c.x+image[0], conf.c.y-image[1]+objectPosY*2-2);
      ctx.stroke();
      
      ctx.strokeStyle = "rgba(0, 0, 255, .5)";
      ctx.beginPath();
      ctx.moveTo(conf.c.x+image[0], conf.c.y-image[1]+objectPosY*2-2);
      ctx.lineTo(conf.c.x, conf.c.y-image[1]+objectPosY-2);
      ctx.lineTo(objectPosX+16, conf.c.y-64-objectPosY+2);
      ctx.stroke();
      
    }else{
      ctx.fillStyle = "red";
      ctx.fillText('Cannot create image', conf.c.x+32, conf.c.y+32);
    }
    
    //////
    /// Len
    drawLen(ctx);
    
    window.requestAnimationFrame(update);
  }
  
  update();
  
});


$("#input-lenradius").on("input change", ()=>{
  let r = parseInt($("#input-lenradius").val());
  radius = r;
  lenLeft = genLen(r);
  lenCircleLeft = genLenCircle(r);
  lenFocusLeft = genLenPoint(r/2);
  lenCenterLeft = genLenPoint(r);
  
  lenRight = genLen(-r);
  lenCircleRight = genLenCircle(-r);
  lenFocusRight = genLenPoint(-r/2);
  lenCenterRight = genLenPoint(-r);
});

$("#input-objectposy").on("input change", ()=>{
  let y = parseInt($("#input-objectposy").val());
  objectPosY = y;
});
$("#input-objectposx").on("input change", ()=>{
  let x = parseInt($("#input-objectposx").val());
  objectPosX = x;
});

