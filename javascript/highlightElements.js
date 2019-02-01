function HighlightElementOn(idOfTheElement){
    document.getElementById(idOfTheElement).style.boxShadow = "inset 0px 0px 0px 4px red";
}

function HighlightElementOff(idOfTheElement){
    document.getElementById(idOfTheElement).style.boxShadow = "none";
}

var input = document.getElementById("sql-command");
input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("element3").click();
  }
});

var body = document.getElementsByTagName("body")[0];
body.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key === "Escape") {
        document.getElementById("createTableWindow").style.display = "none";
        document.getElementById("alterTableWindow").style.display = "none";
        document.getElementById("fkTableWindow").style.display = "none";
        document.getElementById("deleteTableWindow").style.display = "none";
        document.getElementById("infoWindow").style.display = "none";
        document.getElementById("alert").style.display = "none";
        document.getElementById("alert2").style.display = "none";
        document.getElementById("alert3").style.display = "none";
        document.getElementById("alert4").style.display = "none";
        document.getElementById("alert5").style.display = "none";
        document.getElementById("alert6").style.display = "none";
        document.getElementById("alert7").style.display = "none";
        document.getElementById("alert8").style.display = "none";
        document.getElementById("alert9").style.display = "none";
        document.getElementById("alert10").style.display = "none";
        document.getElementById("alert11").style.display = "none";
    }
  });