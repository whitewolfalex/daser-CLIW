var moveTool = false;
var moveToolOn = false;

var currentGx = 0;
var currentGy = 0;

function canMove(){
    moveTool = !moveTool;
    if(moveTool){
        svgContainer.style.cursor = "move";
    }
    else{
        svgContainer.style.cursor = "initial";
    }
        console.log(moveTool);
}

svgContainer = document.getElementById("schema-svg");
groupContainer = document.getElementById("group-svg");

var mousePositionX;
var mousePositionY;

function setMouseMoveHandler(event){
    if(moveToolOn){
        moveToolOn = false;
        var difX = event.clientX - mousePositionX;
        var difY = event.clientY - mousePositionY;
        currentGx = currentGx + difX;
        currentGy = currentGy + difY;
        console.log("difX" + difX + "/ difY" + difY);
        groupContainer.style.transform = "translate(" + currentGx + "px," + currentGy + "px)"; 
    }
    else{
        if(moveTool){
            mousePositionX = event.clientX;
            mousePositionY = event.clientY;
            moveToolOn = true;
        }
    }
}

svgContainer.addEventListener('click',function(evt){
    setMouseMoveHandler(evt);
},false);