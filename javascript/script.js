var tables = [];
var svg = document.getElementById("schema-svg");
var grp = document.getElementById("group-svg-objects");

class Table {
    constructor(width, height, title, properties) {
        this.width = width;
        this.height = height;
        let position = getRandomPosition(this.width, this.height);
        this.x = position[0];
        this.y = position[1];
        this.title = title;
        this.properties = properties;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
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

export function createTable(title, properties) {
    let noOfParams = properties.length;
    let table = new Table(260, 60 + noOfParams * 20, title, properties);
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

// function processTheCommand(sqlCommand) {
//     var re = new RegExp("((CREATE TABLE|create table)\\s*([a-zA-Z0-9_\\-\\.]+)\\s*\\(((\\s*[a-zA-Z0-9]+\\s[a-zA-Z0-9]+(\\([0-9]+\\))?\\s*(NOT NULL|PRIMARY KEY)?( NOT NULL| PRIMARY KEY)?\\s*,)*\\s*(([a-zA-Z0-9]+\\s[a-zA-Z0-9]+(\\([0-9]+\\))?\\s*(NOT NULL|PRIMARY KEY)?( NOT NULL| PRIMARY KEY)?)|(PRIMARY KEY\\s*\\(\\s*[a-zA-Z0-9]+\\s*(,\\s*[a-zA-Z0-9]+\\s*)*\\))|(\\s*CONSTRAINT\\s*[a-zA-Z0-9_]+\\s*PRIMARY KEY\\(\\s*[a-zA-Z0-9]+\\s*(,\\s*[a-zA-Z0-9]+\\s*)*\\))))\s*\\));?|((DROP TABLE|drop table)\\s*([a-zA-Z0-9_\\-\\.]+)\\s*);?");
//     const result = re.exec(sqlCommand);

//     if (result[2] != null && result[2].toLowerCase() == "create table") {
//         let propAreValid = true;
//         let properties = [];
//         let res;
//         let stopIndex = result[4].indexOf("PRIMARY KEY(");
//         if (stopIndex != -1) {
//             let noCommas = 0;
//             for (let i = 0; i < stopIndex; i++) {
//                 if (result[4][i] == ",") {
//                     noCommas++;
//                 }
//             }
//             res = JavaSplit(result[4], ",", noCommas + 1);
//         } else {
//             res = result[4].split(",");
//         }
//         console.log(res);
//         for (let i = 0; i < res.length; i++) {
//             let isOk = true;
//             let attributes = res[i].trim().split(" ");
//             let property;
//             if (attributes[0] != "PRIMARY" && attributes[0] != "CONSTRAINT") {

//                 if (attributes[2] != null && attributes[3] != null && attributes[2] == "PRIMARY" && attributes[3] == "KEY" ||
//                     attributes[4] != null && attributes[5] != null && attributes[4] == "PRIMARY" && attributes[5] == "KEY") {
//                     property = new Property(attributes[0], attributes[1], true, true);
//                 } else {
//                     if (attributes[2] != null && attributes[3] != null && attributes[2] == "NOT" && attributes[3] == "NULL") {
//                         property = new Property(attributes[0], attributes[1], true, false);
//                     } else {
//                         property = new Property(attributes[0], attributes[1], false, false);
//                     }
//                 }
//                 properties.forEach(p => {
//                     if (isOk && p.name == property.name) {
//                         isOk = false;
//                     }
//                 });
//                 if (isOk) {
//                     properties.push(property);
//                 } else {
//                     console.log("error , duplicate parameter name");
//                     propAreValid = false;
//                     break;
//                 }

//             } else {
//                 console.log(attributes[0], "<<<<");
//                 let columnNames;
//                 if (attributes[0] == "PRIMARY") {
//                     columnNames = JavaSplit(res[i].trim(), " ", 2)[1];
//                 } else {

//                     columnNames = JavaSplit(res[i].trim(), " ", 4)[3]; // (nume de coloane) se afla dupa Constraint nume_pk primary, index 3 deci
//                 }
//                 console.log(columnNames);
//                 let columnNamesWP = columnNames.split("(")[1].split(")")[0];
//                 console.log(columnNamesWP);
//                 let columnNamesArray = columnNamesWP.split(",");
//                 for (let index = 0; index < columnNamesArray.length; index++) {
//                     properties.forEach(p => {
//                         if (p.name == columnNamesArray[index].trim()) {
//                             p.isPrimaryKey = true;
//                             p.notNull = true;
//                         }
//                     });
//                 }
//             }
//         }
//         if (propAreValid) {
//             createTable(result[3], properties);
//         }
//     }
//     else {
//         if (result[19] != null && result[19].toLowerCase() == "drop table") {
//             deleteTable(result[20]);
//         }
//     }
// }

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
    var tokens = text.split(' ');
    var tableName = tokens[2];
    tableName = tableName.substring(0, tableName.length - 1)
    return tableName;
}

function getAttributesFromSplittedText(mytext) {
    var properties = [];
    var primaryKeys = [];

    for (let i = 1; i < mytext.length; i++) {

        //split text to take every column name with its properties
        var tokens = mytext[i].split('\n');
        var subtokens = tokens[0].trim();

        //create new property
        var property = new Property();

        var title = subtokens.split(' ')[0].trim();
        var datatype = subtokens.split(' ')[1];
        var nullable = subtokens.split(' ')[2];

        //check if we have primary key at the end of query
        if (title != undefined && !title.includes("PRIMARY")) {
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

            var pKeysTokens = subtokens.split(',');

            //get the first key from tokens
            var firstKey = pKeysTokens[0];
            firstKey = firstKey.split('(')[1].trim();
            primaryKeys.push(firstKey);

            //get the rest of the keys from tokens
            for (let j = 1; j < pKeysTokens.length - 1; j++) {
                primaryKeys.push(pKeysTokens[j].trim());
            }

            //get the last keys from token
            var lastKey = pKeysTokens[pKeysTokens.length - 1];
            primaryKeys.push(lastKey.split(')')[0].trim());
        }
    }

    //define primary key for properties
    for (let i = 0; i < properties.length; i++) {
        if (primaryKeys.includes(properties[i].name))
            console.log(properties[i].name);
        properties[i].isPrimaryKey = true;
    }


    return properties;
}

function createSqlCommand(command) {

    var tableName = getTableNameFromSplittedText(command[0]);
    console.log("table name: " + tableName);
    var properties = getAttributesFromSplittedText(command);

    createTable(tableName, properties);
}

processTheCommand("CREATE TABLE tabel1(numeeeeeee valoareeee NOT NULL, num1 valu2, num3 val4 );");

processTheCommand("CREATE TABLE tabel2(numelemeuecelmailung valoare NOT NULL, num1 valu2, num3 val4)");

processTheCommand("CREATE TABLE tabel3(nume valoare PRIMARY KEY, num1 valu2 PRIMARY KEY NOT NULL, num3 val4 NOT NULL PRIMARY KEY)");

processTheCommand("CREATE TABLE Persons (ID int NOT NULL, LastName varchar(255) NOT NULL, FirstName varchar(255), Age int, PRIMARY KEY(ID, FirstName, LastName));");

processTheCommand("DROP TABLE tabel1");

showProperties();

export default getTables;