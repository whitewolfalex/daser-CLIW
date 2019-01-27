import * as script from './script.js';

var schemaSVG = document.getElementById("schema-svg");
var groupSVG = document.getElementById("group-svg");
var tableSVG;
var cursorClickPositionX = 0, cursorClickPositionY = 0, currentPositionX = 0, currentPositionY = 0, lastPositionX = 0, lastPositionY = 0;
var xOffset = 23;
var yOffset = 195;
var moveTable = false;
var tableToMove;
schemaSVG.onmousedown = dragMouseDown;

function dragMouseDown(e) 
{
    console.log(e.clientX-xOffset, e.clientY-yOffset);
    e = e || window.event;
    e.preventDefault();
    cursorClickPositionX = e.clientX;
    cursorClickPositionY = e.clientY;

    script.tables.forEach(table =>{
        if(table.x <= e.clientX-xOffset && e.clientX-xOffset <= table.x + table.width){
            if(table.y <= e.clientY-yOffset && e.clientY-yOffset <= table.y + table.height){
                moveTable = true;
                tableToMove = "group-" + table.title;
                tableSVG = document.getElementById(tableToMove);     
            }
        }
    });

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
}

function elementDrag(e) 
{
    e = e || window.event;
    e.preventDefault();
    currentPositionX = lastPositionX + e.clientX - cursorClickPositionX;
    currentPositionY = lastPositionY + e.clientY - cursorClickPositionY;
    if(moveTable){
        tableSVG.setAttribute('x', currentPositionX);
        tableSVG.setAttribute('y', currentPositionY);
    }
    else{
        groupSVG.setAttribute('x', currentPositionX);
        groupSVG.setAttribute('y', currentPositionY);
    }
}

function closeDragElement() 
{
    moveTable = false;
    lastPositionX = currentPositionX;
    lastPositionY = currentPositionY;
    document.onmouseup = null;
    document.onmousemove = null;
}
