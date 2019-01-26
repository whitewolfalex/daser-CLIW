var schemaSVG = document.getElementById("schema-svg");
var SvgGroup = document.getElementById("group-svg-objects");
var SvgGroupSize = 1;
var SvgGroupVariation = 0.01;
//SvgGroup.style.transformOrigin = "0 0";

function zoomIn() {
    SvgGroupSize < 3.5 ? SvgGroupSize += SvgGroupVariation : SvgGroupSize;
    SvgGroup.style.transform = "scale(" + SvgGroupSize + ")";
}


function zoomOut() {
    SvgGroupSize > 0.2 ? SvgGroupSize -= SvgGroupVariation : SvgGroupSize;
    SvgGroup.style.transform = "scale(" + SvgGroupSize + ")";
}

function zoomInOut(e) {
    var evt = window.event || e //equalize event object
    var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta //check for detail first so Opera uses that instead of wheelDelta
    /*let rect = evt.target.getBoundingClientRect();
    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;
    SvgGroup.style.transformOrigin = x + "px " + y + "px";
    */
    if (delta > 30) {
        zoomIn();
    }
    if (delta < -30) {
        zoomOut();
    }
}

var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x

if (schemaSVG.attachEvent) //if IE (and Opera depending on user setting)
    schemaSVG.attachEvent("on" + mousewheelevt, zoomInOut)
else if (schemaSVG.addEventListener) //WC3 browsers
    schemaSVG.addEventListener(mousewheelevt, zoomInOut, false)