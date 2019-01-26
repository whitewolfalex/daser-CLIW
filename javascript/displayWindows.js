import * as script from "./script.js";
import * as btns from "./buttonsFunctionality.js";


var popUpWindows = ["createTableWindow", "alterTableWindow", "fkTableWindow", "deleteTableWindow"];
var tables;
{
  tables = script.tables;
}

//creare de tabele la nivel de front-end
window.displayCreateTable = function displayCreateTable() {
  var createTableWindow = document.getElementById("createTableWindow");

  if (createTableWindow.style.display == "block") {
    createTableWindow.style.display = "none";
  }
  else {
    createTableWindow.style.display = "block";
    closeInactivePopUps(createTableWindow);
  }
}

// display foreign key window
window.displayFkWindow = function displayFkWindow() {
  var window = document.getElementById('fkTableWindow');

  if (window.style.display == "block") {
    window.style.display = "none";

  } else {
    window.style.display = "block";
    closeInactivePopUps(window);
  }
  btns.renderFirstTablesWithPrimaryKey();
}

//modificare nume coloana a unui tabel deja existent la nivel de front-end
window.displayAlterTable = function displayAlterTable() {
  var alterTableWindow = document.getElementById("alterTableWindow");

  script.removeElementsByClass('column-selection');

  if (alterTableWindow.style.display == "block") {
    alterTableWindow.style.display = "none";
  }
  else {
    alterTableWindow.style.display = "block";
    closeInactivePopUps(alterTableWindow);
  }
  renderTablesSelection("table-options", "table-selection");
}

//stergerea unui tabel deja existent la nivel de front-end
window.displayDeleteWindow = function displayDeleteWindow() {
  var deleteTableWindow = document.getElementById("deleteTableWindow");

  if (deleteTableWindow.style.display == "block") {
    deleteTableWindow.style.display = "none";
  }
  else {
    deleteTableWindow.style.display = "block";
    closeInactivePopUps(deleteTableWindow);
  }
  renderTablesSelection("table-delete-options", "table-delete-selection");
}

//afisarea informatiilor despre aplicatia noastra minunata^^
window.displayInfoWindow = function displayInfoWindow() {
  var infoWindow = document.getElementById("infoWindow");

  if (infoWindow.style.display == "block") {
    infoWindow.style.display = "none";
  }
  else {
    infoWindow.style.display = "block";
    closeInactivePopUps(deleteTableWindow);
  }
}

//randarea tabelelor existente
window.renderTablesSelection = function renderTablesSelection(myclass, id) {

  script.removeElementsByClass(myclass);
  var selectElement = document.getElementById(id);

  for (let i = 0; i < tables.length; i++) {
    var optionElement = document.createElement("option");
    optionElement.setAttribute("class", myclass);
    var textNode = document.createTextNode(tables[i].title);
    optionElement.appendChild(textNode);
    selectElement.appendChild(optionElement);
  }
}

//randarea coloanelor tabelului selectat la alterTable
window.renderColumnSelection = function renderColumnSelection() {
  script.removeElementsByClass("column-options");

  var properties;
  var selectElement = document.getElementById('column-selection');
  var currentTable = document.getElementById('table-selection').value;

  for (let i = 0; i < tables.length; i++) {
    if (tables[i].title === currentTable) {
      properties = tables[i].properties;

      for (let j = 0; j < properties.length; j++) {
        var optionElement = document.createElement("option");
        optionElement.setAttribute("class", "column-options");
        var textNode = document.createTextNode(properties[j].name + ' ( ' + properties[j].datatype + ' )');
        optionElement.appendChild(textNode);
        selectElement.appendChild(optionElement);
      }
    }
  }
}


//schimbarea numelui/tipul coloanei tabelului selectat la alterTable
window.changeColumnName = function changeColumnName(event) {
  var properties;
  var coordinates = [];
  var references;

  var currentTable = document.getElementById('table-selection').value;
  var newColumnName = document.getElementById('new-column-name').value;
  var oldColumnNameVector = document.getElementById('column-selection').value;
  var selectedDatatype = document.getElementById('datatype-selection').value;
  var oldColumnName = oldColumnNameVector.split(' ')[0].trim();

  console.log(oldColumnName != 'none' && oldColumnName != undefined);

  if (oldColumnName != 'none' && newColumnName != '') {
    //obtinem proprietatile tabelului selectat
    for (let i = 0; i < tables.length; i++) {
      if (tables[i].title == currentTable) {
        properties = tables[i].properties;

        //get old references to pass to the new object created
        //coordonatele tmb
        references = tables[i].references;
        coordinates[0] = tables[i].x;
        coordinates[1] = tables[i].y;
      }
    }

    //check if datatype has changed and modify it
    if (selectedDatatype != undefined && selectedDatatype != 'none') {

      for (let j = 0; j < properties.length; j++) {
        if (properties[j].name == oldColumnName) {
          properties[j].datatype = selectedDatatype;
          alert(properties[j].datatype);
        }
      }
    }

    //check if new name is passed in
    if (newColumnName != undefined && newColumnName != '') {
      if (!isAForeignKey(oldColumnName)) {

        for (let index_props = 0; index_props < properties.length; index_props++) {
          if (properties[index_props].name === oldColumnName) {
            properties[index_props].name = newColumnName;
          }
        }
        //the column is foreign key
      } else {
        alert("You changed the data.");
      }
      //new column name is null or undefined
    }

    rebuildTable(currentTable, properties, references, coordinates);

    script.removeElementsByClass('column-options');
    closePopUp(event);
  } else {
    btns.displayValidateFieldsError();
  }
}

//sterg tabelul si il creez cu noile proprietati la aceleasi coordonate
function rebuildTable(currentTable, properties, references, coordinates) {
  //delete the table
  script.temporaryRemoveTable(currentTable);

  //create the table with new properties
  var newTable = script.createTable(currentTable, properties, references, coordinates);
  tables = script.tables;
}

//verific daca este foreignKey
function isAForeignKey(key) {
  for (let i = 0; i < tables.length; i++) {
    var references = tables[i].references;

    for (let j = 0; j < references.length; j++) {
      var refCols = references[j].referencedColumns;

      for (let k = 0; k < refCols.length; k++) {
        if (refCols[k] == key)
          return true;
      }
    }
  }
  return false;
}

//afisez referintele tabelului selectat pentru stergere la nivel de front-end
window.renderReferencedTables = function renderReferencedTables() {
  script.removeElementsByClass("table-name-paragraf");
  var referencedContainer = document.getElementById('referencedTables');
  var tableSelection = document.getElementById('table-delete-selection').value;

  var references = getTableReferences(tableSelection);

  for (let index = 0; index < references.length; index++) {
    var tableName = document.createElement('p');
    tableName.setAttribute("class", "table-name-paragraf");
    var text = document.createTextNode(references[0].referencedTable);
    tableName.appendChild(text);
    referencedContainer.appendChild(tableName);
  }
}

//returnarea tabelului ales ca si obiect
function getSelectedTable(numeTabel) {
  for (let index = 0; index < tables.length; index++) {
    if (tables[index].title == numeTabel) {
      return tables[index];
    }
  }
}

//returneaza referintele tabelului selectat
function getTableReferences(tableSelection) {
  var tabel = getSelectedTable(tableSelection);
  var references = tabel.references;

  return references;
}

//verific daca tabelul are referinte, apelez cele doua functii de confirm si cancel, daca nu atunci sterg tabelul selectat
window.requestDelete = function requestDelete() {
  var tableSelection = document.getElementById('table-delete-selection').value;

  if (tableSelection != 'none') {
    var references = getTableReferences(tableSelection);

    if (references.length > 0) {
      var confirmare = document.getElementById('delete-pop-up-window');
      confirmare.style.display = 'block';
    }
    else {
      deleteTableSelection(tableSelection);
    }
  }else{
    btns.displayValidateFieldsError();
  }
}

//stergerea tabelului selectat
function deleteTableSelection(tableSelection) {
  script.deleteTable(tableSelection);
  script.removeElementsByClass("table-name-paragraf");

  tables = script.getTables();

  var popUp = document.getElementById('deleteTableWindow');
  popUp.style.display = 'none';

  var deletepopup = document.getElementById('delete-pop-up-window');
  deletepopup.style.display = 'none';
}

//stergerea referintelor tabelului selectat -- CONFIRM
window.confirmDelete = function confirmDelete() {
  var tableSelection = document.getElementById('table-delete-selection').value;

  var references = getTableReferences(tableSelection);

  for (let index = 0; index < references.length; index++) {
    script.deleteTable(references[index].referencedTable);
  }

  deleteTableSelection(tableSelection);
}

//anulare comanda de stergere a unui tabel cu referinte
window.cancelDelete = function cancelDelete() {
  var deletepopup = document.getElementById('delete-pop-up-window');
  deletepopup.style.display = 'none';
}

//inchiderea ferestei de creare/alter/delete tabel la nivel de front-end
window.closePopUp = function closePopUp(event) {
  var closeBtn = document.getElementById(event.target.parentNode.parentNode.parentNode.id);
  if (closeBtn.style.display == 'none') {
    closeBtn.style.display = 'block';
  } else {
    closeBtn.style.display = 'none';
  }
}

// close all pop ups excluding the selected one 
function closeInactivePopUps(activePopUp) {
  var elem = activePopUp;
  var id = activePopUp.id;

  for (let i = 0; i < popUpWindows.length; i++) {
    if (popUpWindows[i] != id) {
      var toCloseElement = document.getElementById(popUpWindows[i]);
      if (toCloseElement.style.display == 'block')
        toCloseElement.style.display = 'none';
    }
  }
}

export default closePopUp;