import * as script from "./script.js";

const crossBtn = document.getElementById("add-btn");
const popupBody = document.getElementById("pop-up-body");
const runBtn = document.getElementById("run-btn");

crossBtn.addEventListener("click", function () {
    var newTableProperty = document.createElement("DIV");
    newTableProperty.className = "table-property";
    var columnNameDiv = document.createElement("DIV");
    columnNameDiv.textContent = "Column name";
    var columnNameInput = document.createElement("INPUT");
    columnNameInput.setAttribute("type", "text");

    columnNameInput.setAttribute("pattern","[A-Z]+");
    columnNameInput.setAttribute("title","Use only letters");    

    columnNameDiv.appendChild(columnNameInput);
    newTableProperty.appendChild(columnNameDiv);
    
    var datatypeDiv = document.createElement("DIV");
    datatypeDiv.textContent = "Datatype";
    var datatypeSelect = document.createElement("SELECT");

    var array = ["tinyint","smallint","mediumint","bigint","int","date","datetime","timestamp","time","tinytext","mediumtext","longtext","text","tinyblob","mediumblob","longblob","blob","enum","char","varchar"];

    for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.value = array[i];
        option.text = array[i].toUpperCase();
        datatypeSelect.appendChild(option);
    }
    datatypeDiv.appendChild(datatypeSelect);
    newTableProperty.appendChild(datatypeDiv);

    var datatypeValueDiv = document.createElement("DIV");
    datatypeValueDiv.textContent = "Datatype value";
    var datatypeValueInput = document.createElement("INPUT");
    datatypeValueInput.setAttribute("type", "text");
    datatypeValueDiv.appendChild(datatypeValueInput);
    newTableProperty.appendChild(datatypeValueDiv);

    popupBody.appendChild(newTableProperty);
});

runBtn.addEventListener("click", function(){
    var tableName = document.getElementById("table-name");
    var tableProperties = document.getElementsByClassName("table-property");
    for(var i=0; i<tableProperties.length; ++i){
        var columnName = tableProperties[i].getElementsByTagName("input")[0];
        console.log(columnName.value);
    }
});
