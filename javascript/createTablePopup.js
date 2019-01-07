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
        option.value = array[i].toUpperCase();
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

    var notNullAndUniqueDiv = document.createElement("DIV");
    var notNullParagraph = document.createElement("P");
    notNullParagraph.textContent = "Not Null";
    var firstCheckbox = document.createElement("input");
    firstCheckbox.setAttribute("type","checkbox");
    firstCheckbox.setAttribute("class","checkbox");
    notNullAndUniqueDiv.appendChild(notNullParagraph);
    notNullAndUniqueDiv.appendChild(firstCheckbox);
    newTableProperty.appendChild(notNullAndUniqueDiv);

    popupBody.appendChild(newTableProperty);
});

runBtn.addEventListener("click", function(){
    var tableName = document.getElementById("table-name").value;
    var tableProperties = document.getElementsByClassName("table-property");
    var sqlCommand = "CREATE TABLE ";
    
    // table name validation
    if(!tableName.toUpperCase().match(/[A-Z]+$/)){
        document.getElementById("alert3").style.display = 'block';
        return;
    }
    
    sqlCommand += tableName.toUpperCase() + "(";
    for(var i=0; i<tableProperties.length; ++i){
        var columnName = tableProperties[i].getElementsByTagName("input")[0].value;
        // column name validation
        if(!columnName.toUpperCase().match(/[A-Z]+$/)){
            document.getElementById("alert4").style.display = 'block';
            return;
        }
        sqlCommand += columnName.toUpperCase() + " ";
        var datatype = tableProperties[i].getElementsByTagName("select")[0];
        var datatype = datatype.options[datatype.selectedIndex].value;
        var datatypeValue = tableProperties[i].getElementsByTagName("input")[1];
        
        // datatype validation
        if(datatypeValue.value !='' && !(datatype.toUpperCase() == "CHAR" || datatype.toUpperCase() == "VARCHAR")){
            document.getElementById("alert5").style.display = 'block';
            return;
        }
        if((datatypeValue.value < 1 || datatypeValue.value > 255)  && (datatype.toUpperCase() == "CHAR" || datatype.toUpperCase() == "VARCHAR")){
            document.getElementById("alert6").style.display = 'block';
            return;
        }
        sqlCommand += datatype.toUpperCase(); 
        if(datatypeValue.value != ''){
            sqlCommand += "(" + datatypeValue.value + ")";
        }

        var checkboxes = tableProperties[i].getElementsByClassName("checkbox");
        if(checkboxes[0].checked){
            sqlCommand += " NOT NULL";
        }

        if(i != tableProperties.length - 1){
            sqlCommand += ",";
        } else {
            sqlCommand += ");";
        }
    }
    script.processTheCommand(sqlCommand);
});
