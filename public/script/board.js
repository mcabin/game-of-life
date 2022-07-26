
$(document).ready(function() {
let c = document.getElementById("canvasBoard");
let ctx = c.getContext("2d");
let canvasOffset=$("#canvasBoard").offset();
let offsetX=canvasOffset.left;
let offsetY=canvasOffset.top;
let canvasWidth=c.width;
let canvasHeight=c.height;

let startX=0;
let startY=0;
let sizeCellX=10;
let sizeCellY=10;
let startDownX;
let startDownY;
let zoom=1;
let isDragging=false;
let sizeTabX=canvasWidth/sizeCellX;
let sizeTabY=canvasHeight/sizeCellY;
let pause=false;
let maxCell=3;
let minCell=2;
let BirthCell=3;
let directionX;
let directionY;
let table=[];
initialiseTable()
let oldTable=[].concat(table);
eventListers();
let intervalId = window.setInterval(function(){
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
    drawBoard(sizeCellX*zoom,sizeCellY*zoom,startX,startY);
    if(!pause){
      oldTable=[].concat(table);
      NextTurn();
    }
}, 10);


function drawBoard(w,h,x,y){
   
    let cellX=(x-x%w)-x;
    let cellY=(y-y%h)-y;
    ctx.beginPath();
    let change=false;
    ctx.fillStyle='rgb(206, 91, 15 )';
    for(i=cellX;i<canvasWidth;i+=w){
      change=!change;
        for(j=cellY;j<canvasHeight;j+=h){
            coor=translateCoordinate(i+x,j+y);
            if(coor.y%2==change){
              ctx.rect(i,j,w,h);
            }
            if(CellLive(coor.x,coor.y)){
              ctx.fillRect(i,j,w,h);
            }
        }

    }
    ctx.stroke();
}

function handleMouseDown(e){
    startDownX=parseInt(e.clientX-offsetX);
    startDownY=parseInt(e.clientY-offsetY);
    // set the drag flag
    isDragging=true;
    directionX=0;
    directionY=0;
  }

  function handleMouseUp(e){
    isDragging=false;
  }

  function handleMouseOut(e){
    isDragging=false;
  }

  function handleMouseMove(e){
    canMouseX=parseInt(e.clientX-offsetX);
    canMouseY=parseInt(e.clientY-offsetY);
    // if the drag flag is set, clear the canvas and draw the image
    if(isDragging){
        currPostX=(startX-Math.floor((canMouseX-startDownX)/10));
        currPostY=(startY-Math.floor((canMouseY-startDownY)/10));
        curDirX=Math.floor((canMouseX-startDownX)/10)>=0;
        curDirY=Math.floor((canMouseY-startDownY)/10)>=0;
        if(curDirX!=directionX ){
          console.log("Changement de cote")
          directionX=curDirX;
          startDownX=canMouseX;
        }
        if( curDirY!=directionY){
          startDownY=canMouseY;
          directionY=curDirY;
        }
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
  let cellCord=x+y*sizeTabX;
  let xLeft = (x == 0) ? sizeTabX - 1 : -1;
	let xRight = (x == sizeTabX - 1) ? -(sizeTabX - 1) : +1;
	let yUp = (y == 0) ? (sizeTabY * sizeTabX) - sizeTabX : -sizeTabX;
	let yDown = (y == sizeTabY-1) ? -((sizeTabY * sizeTabX) - sizeTabX) : +sizeTabX;
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
  let cellCord=x+y*sizeTabX;
  let xLeft = (x == 0) ? sizeTabX - 1 : -1;
	let xRight = (x == sizeTabX - 1) ? -(sizeTabX - 1) : +1;
	let yUp = (y == 0) ? (sizeTabY * sizeTabX) - sizeTabX : -sizeTabX;
	let yDown = (y == sizeTabY-1) ? -((sizeTabY * sizeTabX) - sizeTabX) : +sizeTabX;

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
  let x, y, count;
  for (y = 0; y < sizeTabY; y++) {
		for (x = 0; x < sizeTabX; x++) {
			let tmp= oldTable[x+y*sizeTabX];
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
