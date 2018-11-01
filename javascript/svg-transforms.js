var moveToolIsOn = false;
var schemaSVG = document.getElementById("schema-svg");
var groupSVG = document.getElementById("group-svg");


function canMove()
{
    moveToolIsOn = !moveToolIsOn;
    if(moveToolIsOn)
    {
        schemaSVG.style.cursor = "grab";
    } 
    else
    {
        schemaSVG.style.cursor = "context-menu";
    }
}

dragElement(groupSVG,schemaSVG);

function dragElement(elmnt,elmnt2)
{
    var cursorClickPositionX = 0, cursorClickPositionY = 0, currentPositionX = 0, currentPositionY = 0, lastPositionX = 0, lastPositionY = 0;
    elmnt2.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) 
    {
        if(moveToolIsOn)
        {
            e = e || window.event;
            e.preventDefault();
            cursorClickPositionX = e.clientX;
            cursorClickPositionY = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
    }
    
    function elementDrag(e) 
    {
        e = e || window.event;
        e.preventDefault();
        currentPositionX = lastPositionX + e.clientX - cursorClickPositionX;
        currentPositionY = lastPositionY + e.clientY - cursorClickPositionY;
        elmnt.setAttribute('x', currentPositionX);
        elmnt.setAttribute('y', currentPositionY);
    }
    
    function closeDragElement() 
    {
        lastPositionX = currentPositionX;
        lastPositionY = currentPositionY;
        document.onmouseup = null;
        document.onmousemove = null;
    }

}