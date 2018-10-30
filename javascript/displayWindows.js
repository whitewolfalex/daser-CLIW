function displayCreateTable()
{
    var createTable = document.getElementById("createTableWindow");
    if(createTable.style.display == "block")
    {
      createTable.style.display = "none";
    }
    else
    {
      createTable.style.display = "block";
    }
}

function closePopUp(){
  var element = document.getElementById("createTableWindow");
    if (element.style.display == "block") {

    }
    element.style.display = "none";

}
