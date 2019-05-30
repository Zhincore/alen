//
// Config
//
const conf = {
  c:{ // Center
    x: 449,
    y: 257
  },
  lenHeight: 256,
}
const defConf = Object.assign({}, conf);

let radius = 64;
let realRadius = 64;
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

let lang;

//
// Functions
//

//////
/// GENERATE
function genLen(r){
  let obj = new Path2D();
  const E = ((r < 0) * 2) - 1;
  realRadius = vectorLength(conf.c.x+r, conf.c.y, conf.c.x, conf.c.y-conf.lenHeight/2);
  obj.arc(
    conf.c.x+r, //x
    conf.c.y, //y  
    realRadius, //r
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
  obj.arc(conf.c.x+r, conf.c.y, 6, 0, Math.PI*2);
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
  return [v, h1, m];
}

//////
/// DRAW
function drawCenterLine(ctx){
  ctx.strokeStyle = "rgba(255, 255, 255, .25)";
  ctx.fillStyle = "rgba(255, 255, 255, .25)";
  ctx.lineWidth = 4;
  ctx.stroke(midline);
}
function updateCenterLine(){
  midline = new Path2D();
  midline.moveTo(0, conf.c.y);
  midline.lineTo(canvas.width, conf.c.y);
}
function drawLen(ctx){
  ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
  ctx.lineWidth = 4;
  lenline = new Path2D();
  lenline.moveTo(conf.c.x, 0);
  lenline.lineTo(conf.c.x, canvas.height);
  ctx.stroke(lenline);
  
  
  ctx.strokeStyle = "rgba(0, 255, 255, 0.75)";
  ctx.lineWidth = 3;
  ctx.fillStyle = "rgba(0, 127, 255, 0.25)";
  ctx.stroke(lenLeft);
  ctx.fill(lenLeft);
  ctx.stroke(lenRight);
  ctx.fill(lenRight);
  
  if($("#opt-show-lenCircles")[0].checked){
    ctx.strokeStyle = $("#opt-show-lenCircles").css("border-left-color");
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.stroke(lenCircleLeft);
    ctx.stroke(lenCircleRight);
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
  
  let showLenLeftPoints = $("#opt-show-lenPointsLeft")[0].checked;
  if($("#opt-show-lenFocus")[0].checked){
    ctx.fillStyle = $("#opt-show-lenFocus").css("border-left-color");
    ctx.fill(lenFocusLeft);
    ctx.fillText('F', lenFocusLeft.pos.x+8, lenFocusLeft.pos.y+16);
    if(showLenLeftPoints){
      ctx.globalAlpha = 0.5;
      ctx.fill(lenFocusRight);
      ctx.fillText('F\'', lenFocusRight.pos.x+8, lenFocusRight.pos.y+16);
      ctx.globalAlpha = 1;
    }
  }
  
  if($("#opt-show-lenCenter")[0].checked){
    ctx.fillStyle = $("#opt-show-lenCenter").css("border-left-color");
    ctx.fill(lenCenterLeft);
    ctx.fillText('S', lenCenterLeft.pos.x+8, lenCenterLeft.pos.y+16);
    if(showLenLeftPoints){
      ctx.globalAlpha = 0.5;
      ctx.fill(lenCenterRight);
      ctx.fillText('S\'', lenCenterRight.pos.x+8, lenCenterRight.pos.y+16);
      ctx.globalAlpha = 1;
    }
  }
}


function updateLen(r){  
  radius = r;
  lenLeft = genLen(r);
  lenCircleLeft = genLenCircle(r);
  lenFocusLeft = genLenPoint(r/2);
  lenCenterLeft = genLenPoint(r);
  
  lenRight = genLen(-r);
  lenCircleRight = genLenCircle(-r);
  lenFocusRight = genLenPoint(-r/2);
  lenCenterRight = genLenPoint(-r);  
  
  $("#inputgroup-lenradius").css("left", conf.c.x-32-87);
  
  $("#output-radius").text(realRadius.toFixed(2));
  $("#output-focus").text((radius/2).toFixed(2));
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


function getObject(){
  let image = $("#img-tree")[0];
  $("#input-objectposx").css("top", conf.c.y-6.5);
  let objPos = [objectPosX+image.naturalWidth, conf.c.y-objectPosY];
  return {
    pos: objPos,
    img: image,
    width: image.naturalWidth,
    height: image.naturalHeight
  };
}

function round(num){
  return Math.floor(num*100) / 100;
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
  
  
  $(".trn").translate(lang);
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  $("#input-lenradius").val($("#input-lenradius-num").val());
  radius = 2*parseFloat($("#inputgroup-lenradius")
    .children("#input-lenradius")
    .val()
  );
  
  $("#inputgroup-rays")
    .css("top", conf.c.y-$("#inputgroup-rays").height()*1.5)
  ;
  /*objectPosY = parseInt($("#input-objectposy")
    .css("top", conf.c.y-32-127)
    .val()
  );*/
  objectPosX = parseFloat($("#input-objectposx").val());
  
  $("#opt-center").on("change input", () =>{
    if($("#opt-center")[0].checked){
      conf.c.x = canvas.width / 2;
      conf.c.y = canvas.height / 2;
    }else{
      conf.c = defConf.c;
    }
    updateLen(radius);
    updateCenterLine();
  });

  updateCenterLine();
  updateLen(radius);

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
    let obj = getObject();
    ctx.drawImage(obj.img, obj.pos[0]-obj.width/2, obj.pos[1]-obj.height, obj.width, obj.height);
    let image = genImage(
      radius/2, //f
      -conf.c.x+obj.pos[0], //u
      obj.height //h0
    );
    image.pos = [conf.c.x+image[0]-obj.width/2, conf.c.y+objectPosY];
    image.height = image[1]-objectPosY;
    let canRender = obj.pos[0] < lenFocusRight.pos.x;
    
    $("#output-objpos").text((conf.c.x-obj.pos[0]).toFixed(2));
    $("#output-imgpos").text(canRender ? (image[0]).toFixed(2) : "???");
    $("#output-magnif").text(canRender ? (image[2]).toFixed(2) : "???");

    // Don't let the image of object teleport to outer space
    if(canRender){
      if(image[1] < 0) ctx.scale(1, -1);// It is expected that the image will always be flipped
      ctx.globalAlpha = 0.75; 
      ctx.drawImage($("#img-tree")[0], image.pos[0], -image.pos[1], obj.width, image.height);
      ctx.globalAlpha = 1;
      if(image[1] < 0) ctx.scale(1, -1);
      
      //////
      /// Visualization
      ctx.lineWidth = 2;
      // Rays
      if($("#input-rayR")[0].checked){
        ctx.strokeStyle = "rgba(255, 0, 0, .5)";
        ctx.beginPath();
        ctx.moveTo(obj.pos[0], obj.pos[1]-obj.height+2);
        ctx.lineTo(conf.c.x, obj.pos[1]-obj.height+2);
        ctx.lineTo(image.pos[0]+obj.width/2, image.pos[1]-image.height-2);
        ctx.stroke();
      }
      
      if($("#input-rayG")[0].checked){
        ctx.strokeStyle = "rgba(0, 255, 0, .5)";
        ctx.beginPath();
        ctx.moveTo(obj.pos[0], obj.pos[1]-obj.height+2);
        ctx.lineTo(image.pos[0]+obj.width/2, image.pos[1]-image.height-2);
        ctx.stroke();
      }
      
      if($("#input-rayB")[0].checked){
        ctx.strokeStyle = "rgba(0, 0, 255, .5)";
        ctx.beginPath();
        ctx.moveTo(image.pos[0]+obj.width/2, image.pos[1]-image.height-2);
        ctx.lineTo(conf.c.x, image.pos[1]-image.height-2);
        ctx.lineTo(obj.pos[0], obj.pos[1]-obj.height+2);
        ctx.stroke();
      }
      
      if($("#opt-show-radius")[0].checked){
        let pp = rotateVector([realRadius, 0], Math.PI/4);
        ctx.fillStyle = ctx.strokeStyle = $("#opt-show-radius").css("border-left-color");
        ctx.beginPath();
        ctx.moveTo(lenCenterLeft.pos.x, lenCenterLeft.pos.y);
        ctx.lineTo(lenCenterLeft.pos.x+pp[0], lenCenterLeft.pos.y+pp[1]);
        ctx.stroke();
        ctx.fillText('r', lenCenterLeft.pos.x+pp[0]/2-16, lenCenterLeft.pos.y+pp[1]/2+16);

        ctx.beginPath();
        ctx.moveTo(lenCenterRight.pos.x, lenCenterRight.pos.y);
        ctx.lineTo(lenCenterRight.pos.x+pp[0], lenCenterRight.pos.y+pp[1]);
        ctx.stroke();
        ctx.fillText('r\'', lenCenterRight.pos.x+pp[0]/2-16, lenCenterRight.pos.y+pp[1]/2+16);
      }
      
      if($("#opt-show-focus")[0].checked){
        ctx.fillStyle = ctx.strokeStyle = $("#opt-show-focus").css("border-left-color");
        ctx.beginPath();
        ctx.moveTo(lenFocusLeft.pos.x, lenFocusLeft.pos.y);
        ctx.lineTo(conf.c.x, conf.c.y);
        ctx.stroke();
        ctx.fillText('f', conf.c.x+(lenFocusLeft.pos.x-conf.c.x)/2, conf.c.y+16);

        ctx.beginPath();
        ctx.moveTo(lenFocusRight.pos.x, lenFocusRight.pos.y);
        ctx.lineTo(conf.c.x, conf.c.y);
        ctx.stroke();
        ctx.fillText('f\'', conf.c.x+(lenFocusRight.pos.x-conf.c.x)/2, conf.c.y+16);
      }
      
      if($("#opt-show-objpos")[0].checked){
        ctx.fillStyle = ctx.strokeStyle = $("#opt-show-objpos").css("border-left-color");
        ctx.beginPath();
        ctx.moveTo(obj.pos[0], obj.pos[1]);
        ctx.lineTo(conf.c.x, conf.c.y);
        ctx.stroke();
        ctx.fillText('a', conf.c.x+(obj.pos[0]-conf.c.x)/2, conf.c.y+16);
      }
      
      if($("#opt-show-imgpos")[0].checked){
        ctx.fillStyle = ctx.strokeStyle = $("#opt-show-imgpos").css("border-left-color");
        ctx.beginPath();
        ctx.moveTo(image.pos[0]+obj.width/2, image.pos[1]);
        ctx.lineTo(conf.c.x, conf.c.y);
        ctx.stroke();
        ctx.fillText('a\'', conf.c.x+(image.pos[0]-conf.c.x)/2, conf.c.y+16);
      }
      
    }else{
      ctx.fillStyle = "red";
      let text = $('<span data-trn="imageCreationError"></span>').translate(lang).text();
      ctx.fillText(text, conf.c.x+32, conf.c.y+32);
    }
    
    //////
    /// Len
    drawLen(ctx);
    
    window.requestAnimationFrame(update);
  }
  
  update();
  
});

$("#info-toggler").click(() =>{
  $("#info").stop().slideToggle();
});


$("#input-lang").on("input change", ()=>{
  lang = $("#input-lang").val();
  $(".trn").translate(lang);
}).trigger("change");

$("#input-lenradius-num").on("input change", ()=>{
  let r = parseFloat($("#input-lenradius").val($("#input-lenradius-num").val()).val())*2;
  updateLen(r);
});
$("#input-lenradius").on("input change", ()=>{
  let r = parseFloat($("#input-lenradius-num").val($("#input-lenradius").val()).val())*2;
  updateLen(r);
});

/*$("#input-objectposy").on("input change", ()=>{
  let y = parseInt($("#input-objectposy").val());
  objectPosY = y;
});*/
$("#input-objectposx").on("input change", ()=>{
  let x = parseFloat($("#input-objectposx").val());
  objectPosX = x;
});

