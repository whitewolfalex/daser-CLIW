import * as script from './script.js';

var schemaSVG = document.getElementById("schema-svg");
var groupSVG = document.getElementById("group-svg");
var tableSVG;
var cursorClickPositionX = 0, cursorClickPositionY = 0, currentPositionX = 0, currentPositionY = 0, lastPositionX = 0, lastPositionY = 0;
var xOffset = 23;
var yOffset = 195;
var moveTable = false;
var tableToMove;
var groupSVGx = 0;
var groupSVGy = 0;
schemaSVG.onmousedown = dragMouseDown;

function dragMouseDown(e) 
{
    e = e || window.event;
    e.preventDefault();
    cursorClickPositionX = e.clientX;
    cursorClickPositionY = e.clientY;

    groupSVGx = parseInt(groupSVG.getAttribute('x'));
    groupSVGy = parseInt(groupSVG.getAttribute('y'));
    if(!groupSVGx)
        groupSVGx = 0;
    if(!groupSVGy)
        groupSVGy = 0;
    script.tables.forEach(table =>{
        if(table.x + table.lastPositionX + groupSVGx <= e.clientX-xOffset && e.clientX-xOffset <= table.x + table.lastPositionX + groupSVGx + table.width){
            if(table.y + table.lastPositionY + groupSVGy <= e.clientY-yOffset && e.clientY-yOffset <= table.y + table.lastPositionY + groupSVGy + table.height){
                moveTable = true;
                tableToMove = table.title;
                tableSVG = document.getElementById("group-" + tableToMove);
            }
        }
    });

    if(moveTable){
        lastPositionX = parseInt(tableSVG.getAttribute('x'));
        lastPositionY = parseInt(tableSVG.getAttribute('y'));
        if(!lastPositionX)
            lastPositionX = 0
        if(!lastPositionY)
            lastPositionY = 0
    }else{
        lastPositionX = parseInt(groupSVG.getAttribute('x'));
        lastPositionY = parseInt(groupSVG.getAttribute('y'));    
    }

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
    if(moveTable){
        let tableToUpdate = script.getTable(tableToMove);
        tableToUpdate.lastPositionX = currentPositionX;
        tableToUpdate.lastPositionY = currentPositionY;
    }
    moveTable = false;
    lastPositionX = currentPositionX;
    lastPositionY = currentPositionY;
    document.onmouseup = null;
    document.onmousemove = null;
}
