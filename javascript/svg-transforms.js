var schemaSVG = document.getElementById("schema-svg");
var groupSVG = document.getElementById("group-svg");
var cursorClickPositionX = 0, cursorClickPositionY = 0, currentPositionX = 0, currentPositionY = 0, lastPositionX = 0, lastPositionY = 0;
schemaSVG.onmousedown = dragMouseDown;

function dragMouseDown(e) 
{
    e = e || window.event;
    e.preventDefault();
    cursorClickPositionX = e.clientX;
    cursorClickPositionY = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
}

function elementDrag(e) 
{
    e = e || window.event;
    e.preventDefault();
    currentPositionX = lastPositionX + e.clientX - cursorClickPositionX;
    currentPositionY = lastPositionY + e.clientY - cursorClickPositionY;
    groupSVG.setAttribute('x', currentPositionX);
    groupSVG.setAttribute('y', currentPositionY);
}

function closeDragElement() 
{
    lastPositionX = currentPositionX;
    lastPositionY = currentPositionY;
    document.onmouseup = null;
    document.onmousemove = null;
}
