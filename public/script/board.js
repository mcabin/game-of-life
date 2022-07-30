
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
var maxCell=3;
var minCell=2;
var BirthCell=3

var table=[];
initialiseTable()
var oldTable=[].concat(table);
eventListers();
var intervalId = window.setInterval(function(){
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
    drawBoard(sizeCellX*zoom,sizeCellY*zoom,startX,startY);
    if(!pause){
      oldTable=[].concat(table);
      NextTurn();
    }
}, 10);


function drawBoard(w,h,x,y){
   
    var cellX=(x-x%w)-x;
    var cellY=(y-y%h)-y;
    ctx.beginPath();
    var change=false;
    ctx.fillStyle='rgb(206, 91, 15 )';

    for(i=cellX;i<canvasWidth;i+=w){
        
        for(j=cellY;j<canvasHeight;j+=h){
            change=!change;
            if(change){
              ctx.rect(i,j,w,h);
            }
            coor=translateCoordinate(i+x,j+y);
            tmp=CellLive(coor.x,coor.y);
            if(tmp){
              ctx.fillRect(i,j,w,h);
            }
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
    // startX=(startX-Math.floor((canMouseX-startDownX)/2));
    // startY=(startY-Math.floor((canMouseY-startDownY)/2));
    // endY=canvasHeight*zoom-canvasHeight;
    // endX=canvasWidth*zoom-canvasWidth;
    // if(startX>endX){
    //   startX=endX;
    // }
    // if(startY>endY){
    //   startY=endY;
    // }
    // if(startY<0){
    //   startY=0;
    // }
    // if(startX<0){
    //   startX=0;
    // }
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
        // console.log("start")
        // ctx.clearRect(0,0,canvasWidth,canvasHeight);
        currPostX=(startX-Math.floor((canMouseX-startDownX)/15));
        currPostY=(startY-Math.floor((canMouseY-startDownY)/15));
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
        startX=currPostX;
        startY=currPostY;
        // drawBoard(sizeCellX*zoom,sizeCellY*zoom,currPostX,currPostY);
        // console.log("end")

    }
  }
  function updateZoom(){
    // ctx.clearRect(0,0,canvasWidth,canvasHeight);
    zoom=$("#sliderZoom").val();
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
    // drawBoard(sizeCellX*zoom,sizeCellY*zoom,startX,startY);        
  }

  function translateCoordinate(coorx,coory){
    x=Math.floor(coorx/(sizeCellX*zoom));
    y=Math.floor(coory/(sizeCellY*zoom));
    return{x,y};
  }
  function initialiseTable(){
    for(i=0;i<sizeTabX;i++)
      for(j=0;j<sizeTabY;j++){
        table[i+j*sizeTabX]=0x00;
      }

    for(i=0;i<sizeTabX;i++){
      for(j=0;j<sizeTabY;j++){

        if(Math.floor(Math.random() * 2)){
          CellBirth(i,j);
        }
      }
    }
  }
  async function eventListers(){
    $("#canvasBoard").mousedown(function(e){handleMouseDown(e);});
    $("#canvasBoard").mousemove(function(e){handleMouseMove(e);});
    $("#canvasBoard").mouseup(function(e){handleMouseUp(e);});
    $("#canvasBoard").mouseout(function(e){handleMouseOut(e);});
    $('#sliderZoom').on("change mousemove", function() {
  updateZoom();
});

}

function CellBirth(x,y){
  var cellCord=x+y*sizeTabX;
  var xLeft = (x == 0) ? sizeTabX - 1 : -1;
	var xRight = (x == sizeTabX - 1) ? -(sizeTabX - 1) : +1;
	var yUp = (y == 0) ? (sizeTabY * sizeTabX) - sizeTabX : -sizeTabX;
	var yDown = (y == sizeTabY-1) ? -((sizeTabY * sizeTabX) - sizeTabX) : +sizeTabX;
  table[cellCord] |=0x01;
  
  table[cellCord+xLeft]+=0x02;
  
  table[cellCord+xRight]+=0x02;
  table[cellCord+yUp]+=0x02;
  table[cellCord+yDown]+=0x02;
  table[cellCord+xLeft+yUp]+=0x02;
  table[cellCord+xLeft+yDown]+=0x02;
  table[cellCord+xRight+yUp]+=0x02;
  table[cellCord+xRight+yDown]+=0x02;
}
function CellDeath(x,y){
  var cellCord=x+y*sizeTabX;
  var xLeft = (x == 0) ? sizeTabX - 1 : -1;
	var xRight = (x == sizeTabX - 1) ? -(sizeTabX - 1) : +1;
	var yUp = (y == 0) ? (sizeTabY * sizeTabX) - sizeTabX : -sizeTabX;
	var yDown = (y == sizeTabY-1) ? -((sizeTabY * sizeTabX) - sizeTabX) : +sizeTabX;

  table[cellCord] &= ~0x01;
  table[cellCord+xLeft]-=0x02;
  table[cellCord+xRight]-=0x02;
  table[cellCord+yUp]-=0x02;
  table[cellCord+yDown]-=0x02;
  table[cellCord+xLeft+yUp]-=0x02;
  table[cellCord+xLeft+yDown]-=0x02;
  table[cellCord+xRight+yUp]-=0x02;
  table[cellCord+xRight+yDown]-=0x02;
  

}

function CellNeighbors(x,y){
  return oldTable[x+y*sizeTabX]>>1;
}

function NextTurn(){
  var x, y, count;
  for (y = 0; y < sizeTabY; y++) {
		for (x = 0; x < sizeTabX; x++) {
			var tmp= oldTable[x+y*sizeTabX];
			if (tmp!= 0) {
				count = CellNeighbors(x, y);
				if (CellLive( x,  y)) {
					if (count > maxCell || count < minCell) {
						CellDeath(x, y);

					}
				}
				else if (count == BirthCell) {
					CellBirth(x, y);
				}
			}
		}
	}

}

function CellLive(x,y){
  return oldTable[x+y*sizeTabX]&0x01;
}

  
});
