
$(document).ready(function() {
var c = document.getElementById("canvasBoard");
var ctx = c.getContext("2d");
var canvasOffset=$("#canvasBoard").offset();
var offsetX=canvasOffset.left;
var offsetY=canvasOffset.top;
var canvasWidth=c.width;
var canvasHeight=c.height;

var startX=0;
var startY=0;
var sizeCellX=10;
var sizeCellY=10;
var startDownX;
var startDownY;
var zoom=1;
var isDragging=false;
var sizeTabX=canvasWidth/sizeCellX;
var sizeTabY=canvasHeight/sizeCellY;
var pause=false;
var table=initialiseTable();
drawBoard(sizeCellX,sizeCellY,0,0);


while(!pause){

  swapTable();
  $("#canvasBoard").mousedown(function(e){handleMouseDown(e);});
$("#canvasBoard").mousemove(function(e){handleMouseMove(e);});
$("#canvasBoard").mouseup(function(e){handleMouseUp(e);});
$("#canvasBoard").mouseout(function(e){handleMouseOut(e);});
$('#sliderZoom').on("change mousemove", function() {
  updateZoom();
});
}
function drawBoard(w,h,x,y){
   
    var cellX=(x-x%w)-x;
    var cellY=(y-y%h)-y;
    ctx.beginPath();
    var change=false;
    for(i=cellX;i<canvasWidth;i+=w){
        
        for(j=cellY;j<canvasHeight;j+=h){
            coor=translateCoordinate(i+x,j+y);
            tmp=table[coor.x+coor.y*sizeTabX];
            ctx.fillStyle='rgb(' + tmp + ',0' + ','+(255-tmp)+')';
            ctx.fillRect(i,j,w,h);

        }
        change=!change;
    }
    ctx.stroke();
}

function handleMouseDown(e){
    startDownX=parseInt(e.clientX-offsetX);
    startDownY=parseInt(e.clientY-offsetY);

    // set the drag flag
    isDragging=true;
   
  }

  function handleMouseUp(e){
    canMouseX=parseInt(e.clientX-offsetX);
    canMouseY=parseInt(e.clientY-offsetY);
    // clear the drag flag
    startX=(startX-Math.floor((canMouseX-startDownX)/2));
    startY=(startY-Math.floor((canMouseY-startDownY)/2));
    endY=canvasHeight*zoom-canvasHeight;
    endX=canvasWidth*zoom-canvasWidth;
    if(startX>endX){
      startX=endX;
    }
    if(startY>endY){
      startY=endY;
    }
    if(startY<0){
      startY=0;
    }
    if(startX<0){
      startX=0;
    }
    isDragging=false;
  }

  function handleMouseOut(e){
    // canMouseX=parseInt(e.clientX-offsetX);
    // canMouseY=parseInt(e.clientY-offsetY);
    // // user has left the canvas, so clear the drag flag
    isDragging=false;
  }

  function handleMouseMove(e){
    canMouseX=parseInt(e.clientX-offsetX);
    canMouseY=parseInt(e.clientY-offsetY);
    // if the drag flag is set, clear the canvas and draw the image
    if(isDragging){
        console.log("start")
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        currPostX=(startX-Math.floor((canMouseX-startDownX)/2));
        currPostY=(startY-Math.floor((canMouseY-startDownY)/2));
        endY=canvasHeight*zoom-canvasHeight;
        endX=canvasWidth*zoom-canvasWidth;
        if(currPostX<0){
          currPostX=0;
        }
        if(currPostX>endX){
          currPostX=endX;
        }
        if(currPostY>endY){
          currPostY=endY;
        }
        if(currPostY<0){
          currPostY=0;
        }
        drawBoard(sizeCellX*zoom,sizeCellY*zoom,currPostX,currPostY);
        console.log("end")

    }
  }
  function updateZoom(){
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    zoom=$("#sliderZoom").val();
    drawBoard(sizeCellX*zoom,sizeCellY*zoom,startX,startY);        
  }

  function translateCoordinate(coorx,coory){
    x=Math.floor(coorx/(sizeCellX*zoom));
    y=Math.floor(coory/(sizeCellY*zoom));
    return{x,y};
  }
  function initialiseTable(){
    var tab=[];
    
    for(i=0;i<sizeTabX;i++){
      for(j=0;j<sizeTabY;j++){
        tab.push(Math.random() * 255);
      }
    }
    return tab;
  }
  function swapTable(){
    for(i=0;i<sizeTabX;i++){
      for(j=0;j<sizeTabY;j++){
        tab[coor.x+coor.y*sizeTabX]=Math.random() * 255;
      }
    }
  }
});
