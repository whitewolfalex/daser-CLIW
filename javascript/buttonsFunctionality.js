import * as script from "./script.js";
import * as popUps from "./displayWindows.js";

var tables = [];
var exportText = '';
var tablePksMap = new Map();

//Initialize Data
{
    tables = script.getTables();
}

window.exportSqlCommands = function exportSqlCommands() {
    var ddlCommand = "CREATE TABLE ";

    var primaryKeys = [];
    var references = [];
    var contentToWrite = '';

    for (let i = 0; i < tables.length; i++) {

        //CREATE TABLE 
        var content = ddlCommand;

        //write the title so far we have CREATE TABLE NAME(
        content += tables[i].title + '(';
        var properties = tables[i].properties;

        //write the columns with their properties CREATE TABLE NAME(name datatype properties
        for (let j = 0; j < properties.length; j++) {
            var property = properties[j];

            content += property.name + ' ' + property.datatype + ' ';

            //verify nullable element
            if (property.notNull)
                content += 'NOT NULL';

            //put comma between columns
            if (j < properties.length - 1)
                content += ', '

            //create array with primary keys as in the end to create the command for pks
            if (property.isPrimaryKey)
                primaryKeys.push(property.name);

        }//end of properties building index j

        //get the array with foreign keys as in the end to create the command for fks
        references = tables[i].references;

        //check if we have primary keys and concat them to table create command
        if (primaryKeys.length != 0) {
            content += ', PRIMARY KEY(';

            //get the columns that compose the primary key
            for (let k = 0; k < primaryKeys.length; k++) {
                content += primaryKeys[k];

                if (k < primaryKeys.length - 1) {
                    content += ', ';
                }

            }
            //close pk group
            content += ')';
        }
        primaryKeys = [];

        if (references.length > 0) {
            content += ', FOREIGN KEY(';

            //get the columns that compose the primary key
            for (let k = 0; k < references[0].currentColumns.length; k++) {
                content += references[0].currentColumns[k];

                if (k < references[0].currentColumns.length - 1) {
                    content += ', ';
                }

            }
            //close fk group
            content += ') REFERENCES ';

            //generate referenced table and its columns eg references table(col, col)
            content += references[0].referencedTable + '(';

            //generate the referenced columns from the other table
            for (let m = 0; m < references[0].referencedColumns.length; m++) {
                console.log(references[0].referencedColumns);
                content += references[0].referencedColumns[m];
                //console.log("am adaugat foreign " + references[0].referencedColumns[m]);

                if (m < references[0].referencedColumns.length - 1) {
                    content += ', ';
                }

            }
        }

        references = [];

        //close last parantheses
        content += ")";

        //adding new line and a slash
        content += "\n";
        content += "/";

        //add new line after slash
        content += "\n";
        console.log(content);
        contentToWrite += content;
        content = '';

    }//end of tables building index i

    download("daser-schema.sql", contentToWrite);

}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

window.displayFkWindow = function displayFkWindow() {
    var window = document.getElementById('fkTableWindow');

    if (window.style.display == "block") {
        window.style.display = "none";

    } else {
        window.style.display = "block";
    }
    renderFirstTablesWithPrimaryKey();
}

function renderFirstTablesWithPrimaryKey() {
    script.removeElementsByClass('table-selections-fk');
    script.removeElementsByClass('column-option-fk');
    var selectElement = document.getElementById("table-selection-fk");

    //iterate through tables and render them if contains primary keys
    for (let i = 0; i < tables.length; i++) {

        if (tablesHasPK(tables[i])) {
            //create option element and assign a class
            var option = document.createElement('option');
            option.setAttribute('class', 'table-selections-fk');
            //create text node with table name
            var text = document.createTextNode(tables[i].title);
            //add text to option element
            option.appendChild(text);
            //add option to select element
            selectElement.appendChild(option);
        }
    }

}

//render the tables of the second inpput selection
window.renderSecondTablesWithPrimaryKey = function renderSecondTablesWithPrimaryKey() {
    //clear the options before rendering new options 
    script.removeElementsByClass('table-selections-fk2');
    // script.removeElementsByClass('column-option-fk2');

    //get the select element of tables option
    var selectElement = document.getElementById("table-selection-fk2");
    //get the first table selection to exclude it from second choice of foreign key
    var firstSelectedTableElement = document.getElementById('table-selection-fk').value;

    //iterate through tables and render them if contains primary key and not selected in the first input
    for (let i = 0; i < tables.length; i++) {
        if (tablesHasPK(tables[i]) && tables[i].title != firstSelectedTableElement) {
            var option = document.createElement('option');
            option.setAttribute('class', 'table-selections-fk2');
            //create text node with table name
            var text = document.createTextNode(tables[i].title);
            //add text to option element
            option.appendChild(text);
            //add option to select element
            selectElement.appendChild(option);
        }
    }
}

//render the primary key(s) of selectedFkTable
window.renderColumnSelectionFk = function renderColumnSelectionFk() {
    script.removeElementsByClass('column-option-fk');
    var tableName = document.getElementById("table-selection-fk").value;
    var selectedPKElement = document.getElementById('column-selection-fk');
    var pks = '';

    for (let i = 0; i < tables.length; i++) {
        if (tables[i].title == tableName) {
            pks = getPrimaryKeysOfTable(tables[i]);
            i = tables.length;
            //create option element and assign a class
            var option = document.createElement('option');
            option.setAttribute('class', 'column-option-fk');
            //create text node with table name
            var text = document.createTextNode(pks);
            //add text to option element
            option.appendChild(text);
            //add option to select element
            selectedPKElement.appendChild(option);
        }
    }
}

//render column of the second selected table
window.renderColumnSelectionFk2 = function renderColumnSelectionFk2(){
    //clear the options for the column rendered before
    script.removeElementsByClass('column-option-fk2');

    //second table name
    var tableName = document.getElementById("table-selection-fk2").value;
    

    //get container id to populate the columns of the second table selected
    var columnsContainer = document.getElementById("second-fk-columns-container");
    
    //get the columns of the selected table
    var columns = getColumnsOfATable(tableName);

    //render the columns of the table
    for(let i = 0; i < columns.length; i++){
        console.log("columns are: " , columns[i]);
        //create span element
        var span = document.createElement('span');
        span.setAttribute('class', 'second-fk-columns-container-span');

        //create input element of type checkbox
        var input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('class', 'second-fk-columns-container-span_input');
        input.setAttribute('name', columns[i]);
        input.style.width = '20px';

        //add input to span
        span.appendChild(input);

        //create text node
        var text = document.createTextNode(columns[i]);
        //add text to span
        span.appendChild(text);

        //create br element
        var br = document.createElement('br');
        span.appendChild(br);
        
        //add span to container
        columnsContainer.appendChild(span);
    }
    
    
    console.log("the map is: ", tablePksMap);
}



//get table object by name
function getTableByName(name) {
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].title == name)
            return tables[i];
    }
    return null;
}

//check if a table has primary keys
function tablesHasPK(table) {
    var properties = table.properties;

    for (let i = 0; i < properties.length; i++) {
        if (properties[i].isPrimaryKey) {
            return true;
        }
    }

    return false;
}

//get the pkeys of a table concatenated eg. ( pk, pk )
function getPrimaryKeysOfTable(table) {
}

//get columns of a table
function getColumnsOfATable(tableName){
    var columnNames = [];
    var props = [];

    for(let i = 0; i < tables.length; i++){
        if (tables[i].title == tableName){ 
            props = tables[i].properties;
            for(let j = 0; j < props.length; j++){
                columnNames.push(props[j].name);
            }
        }
    }
    
    return columnNames;
}