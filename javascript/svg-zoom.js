var SvgGroup = document.getElementById("group-svg-objects");
var SvgGroupSize = 1;
var SvgGroupVariation = 0.1;

function zoomIn()
{
    SvgGroupSize += SvgGroupVariation;
    SvgGroup.style.transform = "scale("+ SvgGroupSize +")";
}


function zoomOut()
{
    SvgGroupSize -= SvgGroupVariation;
    SvgGroup.style.transform = "scale("+ SvgGroupSize +")";
}