var tables = [];
var svg = document.getElementById("schema-svg");
var grp = document.getElementById("group-svg-objects");

class Table {
    constructor(width, height, title, properties, references) {
        this.width = width;
        this.height = height;
        let position = getRandomPosition(this.width, this.height);
        this.x = position[0];
        this.y = position[1];
        this.title = title;
        this.properties = properties;
        this.references = references;
    }
}

class References {
    constructor() {
        this.referencedTable = '';
        this.currentColumns = [];
        this.referencedColumns = [];
    }
}

class Property {
    constructor(name, datatype, notNull, isPrimaryKey) {
        this.name = name;
        this.datatype = datatype;
        this.notNull = notNull;
        this.isPrimaryKey = isPrimaryKey;
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPosition(width, height) {
    let isOk = true;
    do {
        var tempX = getRndInteger(0, parseInt(getComputedStyle(svg).width) - width);
        var tempY = getRndInteger(0, parseInt(svg.getAttribute("height")) - height);
        isOk = true;
        tables.forEach(table => {
            if (isOk) {
                if (tempX >= table.x && tempX <= (table.x + table.width) && tempY >= table.y && (tempY <= table.y + table.height)) {
                    isOk = false;
                }
                if ((tempX + width) >= table.x && (tempX + width) <= (table.x + table.width) && tempY >= table.y && (tempY <= table.y + table.height)) {
                    isOk = false;
                }
                if (tempX >= table.x && tempX <= (table.x + table.width) && (tempY + height) >= table.y && ((tempY + height) <= table.y + table.height)) {
                    isOk = false;
                }
                if ((tempX + width) >= table.x && (tempX + width) <= (table.x + table.width) && (tempY + height) >= table.y && ((tempY + height) <= table.y + table.height)) {
                    isOk = false;
                }
                if (table.x >= tempX && table.x <= (tempX + width) && table.y >= tempY && (table.y <= tempY + height)) {
                    isOk = false;
                }
                if ((table.x + table.width) >= tempX && (table.x + table.width) <= (tempX + width) && table.y >= tempY && (table.y <= tempY + height)) {
                    isOk = false;
                }
                if (table.x >= tempX && table.x <= (tempX + width) && (table.y + table.height) >= tempY && ((table.y + table.height) <= tempY + height)) {
                    isOk = false;
                }
                if ((table.x + table.width) >= tempX && (table.x + table.width) <= (tempX + width) && (table.y + table.height) >= tempY && ((table.y + table.height) <= tempY + height)) {
                    isOk = false;
                }
            }
        });
    } while (!isOk);
    return [tempX, tempY];
}


function replaceWithDots(text) {
    if (text.length > 10) {
        let showName = "";
        for (let j = 0; j < 8; j++) {
            showName += text[j];
        }
        showName += "...";
        return showName;
    }
    return text;
}

export function createTable(title, properties, references) {
    let noOfParams = properties.length;
    let table = new Table(260, 60 + noOfParams * 20, title, properties, references);
    //#region DrawTheTable 
    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    newElement.setAttribute("class", table.title);
    newElement.setAttribute("x", table.x);
    newElement.setAttribute("y", table.y);
    newElement.setAttribute("rx", "10");
    newElement.setAttribute("ry", "10");
    newElement.setAttribute("width", table.width);
    newElement.setAttribute("height", table.height);
    grp.appendChild(newElement);

    let newElementTitle = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    newElementTitle.setAttribute("class", table.title);
    newElementTitle.setAttribute("x", table.x + table.width / 2);
    newElementTitle.setAttribute("y", table.y + 20);
    newElementTitle.setAttribute("dominant-baseline", "middle");
    newElementTitle.setAttribute("text-anchor", "middle");
    let txt = document.createTextNode(table.title);
    newElementTitle.appendChild(txt);
    grp.appendChild(newElementTitle);

    for (let i = 0; i < properties.length; i++) {
        let newParam = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        newParam.setAttribute("class", table.title);
        newParam.setAttribute("x", table.x + 40);
        newParam.setAttribute("y", 30 + table.y + 20 * (i + 1));
        let txt = document.createTextNode(replaceWithDots(properties[i].name));
        newParam.appendChild(txt);
        grp.appendChild(newParam);
        let newParam2 = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        newParam2.setAttribute("class", table.title);
        newParam2.setAttribute("x", (table.x + table.width / 2));
        newParam2.setAttribute("y", 30 + table.y + 20 * (i + 1));
        let txt2 = document.createTextNode(properties[i].datatype);
        newParam2.appendChild(txt2);
        grp.appendChild(newParam2);
    }
    //#endregion
    tables.push(table);
}

export function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

export function deleteTable(title) {
    removeElementsByClass(title);
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].title == title) {
            tables.splice(i, 1);
            break;
        }
    }
}

function JavaSplit(string, separator, n) {
    var split = string.split(separator);
    if (split.length <= n)
        return split;
    var out = split.slice(0, n - 1);
    out.push(split.slice(n - 1).join(separator));
    return out;
}

function showProperties() {
    tables.forEach(table => {
        console.log(table.properties);
    });
}

export function getTables() {
    return tables;
}

function formatSqlInput(text) {
    //var input = document.getElementById('sql-command').value;
    var input = text;
    var textFormatted = '';
    var count = 0;
    var split = true;

    for (let i = 0; i < input.length; i++) {
        textFormatted += input[i];

        if (input[i] === '(' && count > 0) {
            split = false;
        }

        if (input[i] === ')' && count > 0) {
            split = true;
        }

        if (input[i] === '(' && count < 1) {
            textFormatted += '\n';
            count++;
        }

        if (input[i] === ',' && split) {
            textFormatted += '\n';
        }
    }
    return textFormatted;
}

function processTheCommand(tempText) {
    //format the input to be easier to parse the sql command
    var text = formatSqlInput(tempText);

    //split by new line
    var splittedText = text.split('\n');
    //take ddl command to check if create or drop etc...
    var firstElement = splittedText[0];


    if (firstElement.includes("CREATE")) {
        createSqlCommand(splittedText);
    }
    if (firstElement.includes("DROP")) {
        firstElement = firstElement.split(' ');
        deleteTable(firstElement[2].trim());
    }

    
}

function getTableNameFromSplittedText(text) {
    var index = 2;
    var tokens = text.split(' ');
    var tableName = tokens[index];
    while (tableName == '') {
        tableName = tokens[++index];
    }
    tableName = tableName.substring(0, tableName.length - 1)
    return tableName;
}

function createSqlCommand(mytext) {
    var properties = [];
    var globalReferences = [];
    var primaryKeys = [];
    var tableName = getTableNameFromSplittedText(mytext[0]);
    console.log("1table name: " + tableName);

    for (let i = 1; i < mytext.length; i++) {

        //split text to take every column name with its properties
        var tokens = mytext[i].split('\n');
        var subtokens = tokens[0].trim();

        //create new property
        var property = new Property();

        var title = subtokens.split(' ')[0];
        var datatype = subtokens.split(' ')[1];
        var nullable = subtokens.split(' ')[2];

        //check if we have primary key at the end of query
        if (title != undefined && !title.includes("PRIMARY") && !title.includes("FOREIGN")) {
            property.name = title.trim();
            if (datatype != undefined) {
                if (datatype.substring(datatype.length - 1, datatype.length) === ',')
                    datatype = datatype.substring(0, datatype.length - 1);

                property.datatype = datatype;
            }
            if (nullable != undefined && nullable == "NOT") {
                property.notNull = true;
            } else {
                property.notNull = false;
            }
            properties.push(property);
        } else {
            if (title.includes("PRIMARY")) {
                var pKeysTokens = subtokens.split(',');

                //get the first key from tokens
                var firstKey = pKeysTokens[0];
                firstKey = firstKey.split('(')[1].trim();
                firstKey = firstKey.split(')')[0].trim();
                primaryKeys.push(firstKey);

                //get the rest of the keys from tokens
                for (let j = 1; j < pKeysTokens.length - 1; j++) {
                    primaryKeys.push(pKeysTokens[j].trim());
                }

                //get the last keys from token
                var lastKey = pKeysTokens[pKeysTokens.length - 1];
                primaryKeys.push(lastKey.split(')')[0].trim());
            } else {
                //get the first keys from tokens
                var firstKey = subtokens;
                var references = new References();
                firstKey = firstKey.split('(')[1].trim();
                firstKey = firstKey.split(')')[0].trim();
                firstKey = firstKey.split(',');

                firstKey.forEach(fk => {
                    references.currentColumns.push(fk.trim());
                });

                //get referenced table name
                firstKey = subtokens;
                firstKey = firstKey.split(')')[1].trim();
                firstKey = firstKey.split(' ')[1];
                firstKey = firstKey.split('(')[0].trim();

                references.referencedTable = firstKey;

                //get referenced columns keys
                firstKey = subtokens;
                firstKey = firstKey.split('(')[2].trim();
                firstKey = firstKey.split(')')[0].trim();
                firstKey = firstKey.split(',');

                var refTable = getTable(references.referencedTable);
                

                if (refTable != undefined) {
                    var allKeysPrimary = true;
                    for (let i = 0; i < firstKey.length; i++) {
                        var ok = false;
                        for (let j = 0; j < refTable.properties.length; j++) {
                            if (refTable.properties[j].name == firstKey[i].trim() && refTable.properties[j].isPrimaryKey) {
                                references.referencedColumns.push(firstKey[i].trim());
                                ok = true;
                            }
                        }
                        if (!ok)
                            allKeysPrimary = false;
                    }
                    if (allKeysPrimary) {
                       globalReferences.push(references);
                    }
                }

            }
        }
    }

    //define primary key for properties
    for (let i = 0; i < properties.length; i++) {
        properties[i].isPrimaryKey = false;

        if (primaryKeys.includes(properties[i].name)) {
            properties[i].notNull = true;
            properties[i].isPrimaryKey = true;
        }
    }

    createTable(tableName, properties, globalReferences);
    console.log(tables);
}

function getTable(tableName) {
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].title == tableName) {
            return tables[i];
        }
    }
}

processTheCommand("CREATE TABLE          tabel1(       nume valoareeee NOT NULL, num1 valu2, num3 val4, PRIMARY KEY(num1, nume));");

processTheCommand("CREATE TABLE tabel2(numelemeuecelmailung valoare NOT NULL, num1 valu2, num3 val4, FOREIGN KEY(num1, num3) REFERENCES tabel1(nume, num1))");

processTheCommand("CREATE TABLE tabel3(nume valoare, num1 valu2 NOT NULL, num3 val4 NOT NULL)");

processTheCommand("CREATE TABLE Persons (ID int NOT NULL, LastName varchar(255) NOT NULL, FirstName varchar(255), Age int, PRIMARY KEY(FirstName, LastName));");

//processTheCommand("DROP TABLE tabel1");

showProperties();

export default getTables;