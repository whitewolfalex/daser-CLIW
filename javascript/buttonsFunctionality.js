import * as script from "./script.js";
import closePopUp, * as popUps from "./displayWindows.js";

var tables = [];
var tablePksMap = new Map();
var currentRadioColumnName;
var foreignKeys = {};

//prevent back button
{
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        document.getElementById('alert8').style.display = 'block';
        setTimeout(function() {
            document.getElementById("alert8").style.display = 'none';
        }, 2000);
        history.go(1);
    };
}

//Initialize Data
{
    tables = script.getTables();
    window.onbeforeunload = function () {
        return "You will lost your data";
    }
    document.getElementById('sql-command').focus();
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
                //console.log(references[0].referencedColumns);
                content += references[0].referencedColumns[m];
                //console.log("am adaugat foreign " + references[0].referencedColumns[m]);

                if (m < references[0].referencedColumns.length - 1) {
                    content += ', ';
                }else{
                    content += ')';
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
        //.log(content);
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

export function renderFirstTablesWithPrimaryKey() {
    script.removeElementsByClass('table-selections-fk');
    script.removeElementsByClass('first-fk-columns-span');

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
window.renderSecondTablesWithPrimaryKey = function renderSecondTablesWithPrimaryKey(event) {
    //clear the options before rendering new options 
    script.removeElementsByClass('table-selections-fk2');

    //get the name of the selected column to search in the second table the column with the same datatype
    var selectedRadioColumnName = event.target.nextSibling.nodeValue;
    currentRadioColumnName = selectedRadioColumnName;

    //get the select element of tables option
    var selectElement = document.getElementById("table-selection-fk2");

    //get the first table selection to exclude it from second choice of foreign key
    var firstSelectedTableElement = document.getElementById('table-selection-fk').value;

    //iterate through tables and render them if contains primary key and not selected in the first input
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].title != firstSelectedTableElement) {
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
    //clear checkboxes
    script.removeElementsByClass('first-fk-columns-span');
    //table name from DOM
    var tableName = document.getElementById("table-selection-fk").value;
    //get the div container for columns
    var spanContainer = document.getElementById('first-fk-columns-container');

    //get the columns of the tabel
    var cols = getPrimaryKeysOfTable(tableName);

    //refresh second columns
    script.removeElementsByClass('second-fk-columns-container-span');

    //render the columns as inputs checkbox
    for (let i = 0; i < cols.length; i++) {
        //create span element
        var span = document.createElement('span');
        span.setAttribute('class', 'first-fk-columns-span');

        //create input type radio
        var input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'fk-primary-key-radio');
        input.setAttribute('class', 'fk-primary-key-radio-class');
        input.style.width = '20px';
        input.addEventListener('change', renderSecondTablesWithPrimaryKey, true);

        //attach input to span
        span.appendChild(input);

        //create text node
        var text = document.createTextNode(cols[i]);
        //add text to span
        span.appendChild(text);

        //create br element
        var br = document.createElement('br');
        span.appendChild(br);

        //attach the span to container
        spanContainer.appendChild(span);

    }
}

//render column of the second selected table
window.renderColumnSelectionFk2 = function renderColumnSelectionFk2() {
    //clear the options for the column rendered before
    script.removeElementsByClass('column-option-fk2');

    //first table name
    var firstTableName = document.getElementById('table-selection-fk').value;

    //second table name
    var tableName = document.getElementById("table-selection-fk2").value;

    //get container id to populate the columns of the second table selected
    var columnsContainer = document.getElementById("second-fk-columns-container");

    // take the column name selected by the user
    var currentRadioColumnNames = document.getElementsByClassName('fk-primary-key-radio-class');

    // get the radio selected
    var currentRadioColumnName;
    for (let i = 0; i < currentRadioColumnNames.length; i++) {
        if (currentRadioColumnNames[i].checked == true) {
            currentRadioColumnName = currentRadioColumnNames[i].nextSibling.nodeValue;
            console.log("am luat coloana ", currentRadioColumnName, "de la tabelul ", tableName);
        }
    }

    //get the datatype that respect the datatype of first column selected above
    var datatype = getDataTypeOfColumn(firstTableName, currentRadioColumnName);

    //get the columns of second selected table based on datatype
    var cols = getColumnsOfATablesByDataType(tableName, datatype);

    //render the columns of the table
    for (let i = 0; i < cols.length; i++) {
        //console.log("columns are: ", cols[i]);
        //create span element
        var span = document.createElement('span');
        span.setAttribute('class', 'second-fk-columns-container-span');

        //create input element of type checkbox
        var input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('class', 'second-fk-columns-container-span_input');
        input.setAttribute('name', 'fk-foreign-key-radio');
        input.style.width = '20px';

        //add input to span
        span.appendChild(input);

        //create text node
        var text = document.createTextNode(cols[i]);
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

//function that creates foreign key
window.requestCreateForeignKey = function requestCreateForeignKey() {
    // parent pop up
    var popUp = document.getElementById('fkTableWindow');


    // first table selected
    var firstTable = document.getElementById('table-selection-fk').value;

    // array with radio buttons for first columns of the first table 
    var firstColumns = document.getElementsByClassName('fk-primary-key-radio-class');
    var firstColumn;

    // get the second table selected if the first column was selected
    var secondTable = document.getElementById('table-selection-fk2').value;

    if (secondTable != 'none') {

        // array with radio buttons for first columns of the first table 
        var secondColumns = document.getElementsByClassName('second-fk-columns-container-span_input');
        var secondColumn;

        // get the first column - radio button that is checked by the user 
        for (let i = 0; i < firstColumns.length; i++) {
            if (firstColumns[i].checked == true) {
                firstColumn = firstColumns[i].nextSibling.nodeValue;
                break;
            }
        }

        //get the second column - radion button that is checked by the user
        for (let i = 0; i < secondColumns.length; i++) {
            if (secondColumns[i].checked == true) {
                secondColumn = secondColumns[i].nextSibling.nodeValue;
                break;
            }
        }

        // check if there already exists a foreign key 
        var foreignKeysKeys = Object.keys(foreignKeys);
        //get the value from dictionary that has my currentkey

        if (foreignKeys[secondTable + secondColumn] != firstTable + firstColumn) {
            // now we create the foreign key between selected tables / columns 
            var firstTableObject = getTableByName(firstTable);

            var ftReferences = new script.References();
            ftReferences.referencedTable = secondTable;
            ftReferences.currentColumns.push(firstColumn);
            ftReferences.referencedColumns.push(secondColumn);

            firstTableObject.references.push(ftReferences);

            // store primary keys in a structure to check if there is already a foreign key created
            foreignKeys[firstTable + firstColumn] = secondTable + secondColumn;
            console.log(foreignKeys);
            script.removeElementsByClass('table-selections-fk2');
            script.removeElementsByClass('second-fk-columns-container-span');
            popUp.style.display = 'none';
            console.log(tables);

            script.drawLine(script.getTable(firstTable),script.getTable(secondTable));

        } else {
            showFkBanner();
        }

    } else {
        showErrorBanner();
    }
}

// function that changes the tabs from alter table pop up
window.requestAlterNameDatatype = function requestAlterNameDatatype() {
    // get the tab to display 
    var columnsBody = document.getElementById('columns-body');
    var keyBody = document.getElementById('key-body');

    var columnsTab = document.getElementById('column-tab');
    var keysTab = document.getElementById('key-tab-active');

    columnsTab.setAttribute('id', 'column-tab-active');
    keysTab.setAttribute('id', 'key-tab');

    if (keyBody.style.display != undefined && keyBody.style.display == 'block') {
        keyBody.style.display = 'none';
        columnsBody.style.display = 'block';
    } else {
        columnsBody.style.display = 'block';
    }
}

// same function for primary key tab
window.requestAlterPrimaryKey = function requestAlterPrimaryKey() {
    // get the tab to display 
    var columnsBody = document.getElementById('columns-body');
    var keyBody = document.getElementById('key-body');

    var columnsTab = document.getElementById('column-tab-active');
    var keysTab = document.getElementById('key-tab');

    keysTab.removeAttribute('id');
    keysTab.setAttribute('id', 'key-tab-active');
    columnsTab.removeAttribute('id');
    columnsTab.setAttribute('id', 'column-tab');

    if (columnsBody.style.display != undefined && columnsBody.style.display == 'block') {
        columnsBody.style.display = 'none';
        keyBody.style.display = 'block';
    } else {
        keyBody.style.display = 'block';
    }

    renderTablesAlterPrimaryKey();
}

// render the tables for pk alter keys
window.renderTablesAlterPrimaryKey = function renderTablesAlterPrimaryKey() {
    var selectElement = document.getElementById('table-selection-pk');

    script.removeElementsByClass('option-element-tables-pk');

    for (let i = 0; i < tables.length; i++) {
        // create an option element to add to the select element
        var optionElement = document.createElement('option');
        optionElement.setAttribute('class', 'option-element-tables-pk');
        optionElement.setAttribute('value', tables[i].title);

        // create text node to add to option element with table name
        var text = document.createTextNode(tables[i].title);

        // add text to option element
        optionElement.appendChild(text);

        // now we add the option element to the select element
        selectElement.appendChild(optionElement);
    }

}

// function that renders columns from alter table primary keys
window.renderPkColumnSelection = function renderPkColumnSelection() {
    // get the name of the selected table 
    var tableName = document.getElementById('table-selection-pk').value;

    // get the primary keys columns of the table
    var columns = getPrimaryKeysOfTable(tableName);
    console.log('cheile primare : ', columns);

    // get the select element to add options 
    var selectElement = document.getElementById('column-selection-pk');

    script.removeElementsByClass('option-element-tables-columns-pk');

    //render the columns
    for (let i = 0; i < columns.length; i++) {
        // create an option element to add to the select element
        var optionElement = document.createElement('option');
        optionElement.setAttribute('id', 'option-pk-choice');
        optionElement.setAttribute('class', 'option-element-tables-columns-pk');
        optionElement.setAttribute('value', columns[i]);

        // create text node to add to option element with table name
        var text = document.createTextNode(columns[i]);

        // add text to option element
        optionElement.appendChild(text);

        // now we add the option element to the select element
        selectElement.appendChild(optionElement);
    }

    // render the non pks also
    renderNonPkColumnSelection();
}

// function that renders columns from alter table non primary keys
window.renderNonPkColumnSelection = function renderNonPkColumnSelection() {
    // get the name of the selected table 
    var tableName = document.getElementById('table-selection-pk').value;

    // get the primary keys columns of the table
    var columns = getNonPrimaryKeysOfTable(tableName);
    console.log('cheile neprimare : ', columns);

    // get the select element to add options 
    var selectElement = document.getElementById('column-selection-non-pk');

    script.removeElementsByClass('option-element-tables-columns-non-pk');

    //render the columns
    for (let i = 0; i < columns.length; i++) {
        // create an option element to add to the select element
        var optionElement = document.createElement('option');
        optionElement.setAttribute('id', 'option-non-pk-choice');
        optionElement.setAttribute('class', 'option-element-tables-columns-non-pk');
        optionElement.setAttribute('value', columns[i]);

        // create text node to add to option element with table name
        var text = document.createTextNode(columns[i]);

        // add text to option element
        optionElement.appendChild(text);

        // now we add the option element to the select element
        selectElement.appendChild(optionElement);
    }

}

//set a column to primary key
window.setPrimary = function setPrimary() {
    // get the table name 
    var tableName = document.getElementById('table-selection-pk').value;

    //get the non primary key and set it to primary key
    var nonPkKeyName = document.getElementById('option-non-pk-choice');

    if (nonPkKeyName != undefined && nonPkKeyName.value != '') {

        //get the table object to change properties
        var tableObect = getTableByName(tableName);

        // change the column chosen to be primary key
        var props = tableObect.properties;

        for (let i = 0; i < props.length; i++) {
            if (props[i].name == nonPkKeyName.value) {
                props[i].isPrimaryKey = true;
                console.log('am pus proprietatea ', props[i]);

            }
        }

        showConfirmBanner();
    } else {
        showErrorBanner();
    }
    script.removeElementsByClass('option-element-tables-columns-non-pk');
}

//unset a column from primary key to simple column
window.unsetPrimary = function unsetPrimary() {
    // get the table name 
    var tableName = document.getElementById('table-selection-pk').value;

    //get the non primary key and set it to primary key
    var pkKeyName = document.getElementById('option-pk-choice');

    if (pkKeyName != undefined && pkKeyName.value != '') {
        var tableObect = getTableByName(tableName);

        // change the column chosen to be primary key
        var props = tableObect.properties;

        for (let i = 0; i < props.length; i++) {
            if (props[i].name == pkKeyName.value) {
                props[i].isPrimaryKey = false;
                console.log('am pus proprietatea ', props[i]);

            }
        }
        showConfirmBanner();
    } else {
        showErrorBanner();
    }
}

export function showConfirmBanner() {
    // confirm banner 
    document.getElementById('alert9').style.display = 'block';
    setTimeout(function() {
        document.getElementById("alert9").style.display = 'none';
    }, 2000);
}

export function showErrorBanner() {
    // confirm banner 
    document.getElementById('alert7').style.display = 'block';
    setTimeout(function() {
        document.getElementById("alert7").style.display = 'none';
    }, 2000);
}

function showFkBanner() {
    document.getElementById('alert10').style.display = 'block';
    setTimeout(function() {
        document.getElementById("alert10").style.display = 'none';
    }, 2000);
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

//get the pkeys of a table
function getPrimaryKeysOfTable(table) {
    var keys = [];

    for (let i = 0; i < tables.length; i++) {
        console.log(tables[i]);
        if (table == tables[i].title) {
            var props = tables[i].properties;
            for (let j = 0; j < props.length; j++) {
                if (props[j].isPrimaryKey) {
                    keys.push(props[j].name);
                }
            }
        }
    }
    return keys;
}

//get the pkeys of a table
function getNonPrimaryKeysOfTable(table) {
    var keys = [];

    for (let i = 0; i < tables.length; i++) {
        console.log(tables[i]);
        if (table == tables[i].title) {
            var props = tables[i].properties;
            for (let j = 0; j < props.length; j++) {
                if (!props[j].isPrimaryKey) {
                    keys.push(props[j].name);
                }
            }
        }
    }
    return keys;
}

//get all columns of a table
function getColumnsOfATable(tableName) {
    var columnNames = [];
    var props = [];

    for (let i = 0; i < tables.length; i++) {
        if (tables[i].title == tableName) {
            props = tables[i].properties;
            for (let j = 0; j < props.length; j++) {
                columnNames.push(props[j].name);
            }
        }
    }

    return columnNames;
}

//get columns of a table based on a table and a datatype
function getColumnsOfATablesByDataType(tableName, datatype) {
    var cols = [];
    console.log(tableName, datatype);

    for (let i = 0; i < tables.length; i++) {

        if (tables[i].title == tableName) {
            var props = tables[i].properties;
            for (let j = 0; j < props.length; j++) {
                if (props[j].datatype == datatype) {
                    cols.push(props[j].name);
                }
            }
        }
    }

    return cols;
}

//get datatype based on the name of the table and column
function getDataTypeOfColumn(tableName, columnName) {

    console.log('caut in tabelul ', tableName, ' coloana ', columnName);

    for (let i = 0; i < tables.length; i++) {
        console.log(tables[i].title, tables[i].title == tableName)
        if (tables[i].title == tableName) {
            console.log("am gasit tabelul ", tables[i]);
            var props = tables[i].properties;
            for (let j = 0; j < props.length; j++) {
                if (props[j].name == columnName) {
                    return props[j].datatype;
                }
            }
        }
    }

}