import * as script from "./script.js";
import * as btns from "./buttonsFunctionality.js";

var tables = [];
var properties = [];

function getTables() {
  tables = script.getTables();
}
getTables();

//creare de tabele la nivel de front-end
window.displayCreateTable = function displayCreateTable() {
  var createTable = document.getElementById("createTableWindow");
  if (createTable.style.display == "block") {
    createTable.style.display = "none";
  }
  else {
    createTable.style.display = "block";
  }
}

//modificare nume coloana a unui tabel deja existent la nivel de front-end
window.displayAlterTable = function displayAlterTable() {
  var alterTable = document.getElementById("alterTableWindow");
  if (alterTable.style.display == "block") {
    alterTable.style.display = "none";
  }
  else {
    alterTable.style.display = "block";
  }
  renderTablesSelection("table-options", "table-selection");
}

//stergerea unui tabel deja existent la nivel de front-end
window.displayDeleteWindow = function displayDeleteWindow() {
  var deleteTableWindow = document.getElementById("deleteTableWindow");
  if (deleteTableWindow.style.display == "block") {
    delteTableWindow.style.display = "none";
  }
  else {
    deleteTableWindow.style.display = "block";
  }
  renderTablesSelection("table-delete-options", "table-delete-selection");
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

//schimbarea numelui coloanei tabelului selectat la alterTable
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

//afisez referintele tabelului selectat pentru stergere la nivel de front-end
window.renderReferencedTables = function renderReferencedTables(){
  script.removeElementsByClass("table-name-paragraf");
  var referencedContainer = document.getElementById('referencedTables');
  var tableSelection = document.getElementById('table-delete-selection').value;
  
  var references = getTableReferences(tableSelection);

  for(let index = 0; index < references.length; index++){
    var tableName = document.createElement('p');
    tableName.setAttribute("class", "table-name-paragraf");
    var text = document.createTextNode(references[0].referencedTable);
    tableName.appendChild(text);
    referencedContainer.appendChild(tableName);
  }
}

//returnarea tabelului ales ca si obiect
function getSelectedTable(numeTabel){
  for(let index = 0; index < tables.length; index++){
    if (tables[index].title == numeTabel){
      return tables[index];
    }
  }
}

//returneaza referintele tabelului selectat
function getTableReferences(tableSelection){
  var tabel = getSelectedTable(tableSelection);
  var references = tabel.references;

  return references;
}

//verific daca tabelul are referinte, apelez cele doua functii de confirm si cancel, daca nu atunci sterg tabelul selectat
window.requestDelete = function requestDelete(){
  var tableSelection = document.getElementById('table-delete-selection').value;
  
  var references = getTableReferences(tableSelection);

  if(references.length > 0){
    var confirmare = document.getElementById('delete-pop-up-window');
    confirmare.style.display = 'block';
  }
  else{
    deleteTableSelection(tableSelection);
  }

}

//stergerea tabelului selectat
function deleteTableSelection(tableSelection){
  script.deleteTable(tableSelection);
  script.removeElementsByClass("table-name-paragraf");
  
  tables = script.getTables();

  var popUp = document.getElementById('deleteTableWindow');
  popUp.style.display = 'none';

  var deletepopup = document.getElementById('delete-pop-up-window');
  deletepopup.style.display = 'none';
}

//stergerea referintelor tabelului selectat -- CONFIRM
window.confirmDelete = function confirmDelete(){
  var tableSelection = document.getElementById('table-delete-selection').value;
  
  var references = getTableReferences(tableSelection);

  for(let index = 0; index < references.length; index++){
    script.deleteTable(references[index].referencedTable);
  }

  deleteTableSelection(tableSelection);
}

//anulare comanda de stergere a unui tabel cu referinte
window.cancelDelete = function cancelDelete(){
  var deletepopup = document.getElementById('delete-pop-up-window');
  deletepopup.style.display = 'none';
}

//inchiderea ferestei de creare/alter/delete tabel la nivel de front-end
window.closePopUp = function closePopUp(event) {
  var closeBtn = document.getElementById(event.target.parentNode.parentNode.parentNode.id);
  if(closeBtn.style.display == 'none'){
    closeBtn.style.display = 'block';
  }else{
    closeBtn.style.display = 'none';
  }
}

export default closePopUp;