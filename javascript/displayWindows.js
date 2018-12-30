import * as script from "./script.js";

var tables = [];
var properties = [];

function getTables() {
  tables = script.getTables();
}
getTables();


window.displayCreateTable = function displayCreateTable() {
  var createTable = document.getElementById("createTableWindow");
  if (createTable.style.display == "block") {
    createTable.style.display = "none";
  }
  else {
    createTable.style.display = "block";
  }
}

window.displayAlterTable = function displayAlterTable() {
  var alterTable = document.getElementById("alterTableWindow");
  if (alterTable.style.display == "block") {
    alterTable.style.display = "none";
  }
  else {
    alterTable.style.display = "block";
  }
  renderTablesSelection();
}

window.renderTablesSelection = function renderTablesSelection() {
  script.removeElementsByClass("table-options");
  var selectElement = document.getElementById('table-selection');

  for (let i = 0; i < tables.length; i++) {
    var optionElement = document.createElement("option");
    optionElement.setAttribute("class", "table-options");
    var textNode = document.createTextNode(tables[i].title);
    optionElement.appendChild(textNode);
    selectElement.appendChild(optionElement);
  }
}

window.renderColumnSelection = function renderColumnSelection() {
  script.removeElementsByClass("column-options");

  var selectElement = document.getElementById('column-selection');
  var currentTable = document.getElementById('table-selection').value;

  for (let i = 0; i < tables.length; i++) {
    if (tables[i].title === currentTable) {
      properties = tables[i].properties;

      for (let j = 0; j < properties.length; j++) {
        var optionElement = document.createElement("option");
        optionElement.setAttribute("class", "column-options");
        var textNode = document.createTextNode(properties[j].name);
        optionElement.appendChild(textNode);
        selectElement.appendChild(optionElement);
      }
    }
  }
}

window.changeColumnName = function changeColumnName() {
  var currentTable = document.getElementById('table-selection').value;
  var newColumnName = document.getElementById('new-column-name').value;
  var oldColumnName = document.getElementById('column-selection').value;

  var x;
  var y;

  for (let i = 0; i < tables.length; i++) {
    if (tables[i].title === currentTable) {
      x = tables[i].x;
      y = tables[i].y;
      console.log("primele coordonate " + tables[i].getX());
    }

    script.deleteTable(currentTable);

    for (let j = 0; j < properties.length; j++) {
      if (properties[j].name === oldColumnName) {
        properties[j].name = newColumnName;
        console.log("am schimbat coloana in : " + properties[j].name);
      }
    }
    

    script.createTable(currentTable, properties);

    for (let i = 0; i < tables.length; i++) {
      if (tables[i].title === currentTable) {
        tables[i].x=x;
        tables[i].y=y;
        console.log("am gasit tabelul cu numele " + tables[i].title);
        console.log("coordonate " + tables[i].x + " " + tables[i].y);
      }
    }
  }

  closePopUpAlter();
}

window.closePopUp = function closePopUp() {
  var element = document.getElementById("createTableWindow");
  if (element.style.display == "block") {

  }
  element.style.display = "none";

}

window.closePopUpAlter = function closePopUpAlter() {
  var element = document.getElementById("alterTableWindow");
  if (element.style.display == "block") {
    element.style.display = "none";
  }
}

export default closePopUp;