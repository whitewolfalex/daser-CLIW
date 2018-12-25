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
}

class Property {
    constructor(name, datatype, notNull, isPrimaryKey) {
        this.name = name;
        this.datatype = datatype;
        this.notNull = notNull;
        this.isPrimaryKey = isPrimaryKey;
    }

    isPrimaryKey(){
        this.isPrimaryKey = true;
        this.notNull = true;
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
        for (j = 0; j < 8; j++) {
            showName += text[j];
        }
        showName += "...";
        return showName;
    }
    return text;
}

function createTable(title, properties) {
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

    for (i = 0; i < properties.length; i++) {
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

function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function deleteTable(title) {
    removeElementsByClass(title);
    for (i = 0; i < tables.length; i++) {
        if (tables[i].title == title) {
            tables.splice(i, 1);
            break;
        }
    }
}

function processTheCommand(sqlCommand) {
    var re = new RegExp("((CREATE TABLE|create table)\\s*([a-zA-Z0-9_\\-\\.]+)\\s*\\(((\\s*[a-zA-Z0-9]+\\s[a-zA-Z0-9]+(\\([0-9]+\\))?\\s*(NOT NULL|PRIMARY KEY)?( NOT NULL| PRIMARY KEY)?\\s*,)*\\s*(([a-zA-Z0-9]+\\s[a-zA-Z0-9]+(\\([0-9]+\\))?\\s*(NOT NULL|PRIMARY KEY)?( NOT NULL| PRIMARY KEY)?)|(PRIMARY KEY\\s*\\(\\s*[a-zA-Z0-9]+\\s*(,\\s*[a-zA-Z0-9]+\\s*)*\\))|(\\s*CONSTRAINT\\s*[a-zA-Z0-9_]+\\s*PRIMARY KEY\\s*\\(\\s*[a-zA-Z0-9]+\\s*(,\\s*[a-zA-Z0-9]+\\s*)*\\))))\s*\\));?|((DROP TABLE|drop table)\\s*([a-zA-Z0-9_\\-\\.]+)\\s*);?");
    const result = re.exec(sqlCommand);

    if (result[2] != null && result[2].toLowerCase() == "create table") {
        let propAreValid = true;
        let properties = [];
        let res = result[4].split(",");
        for (let i = 0; i < res.length; i++) {
            let isOk = true;
            let attributes = res[i].trim().split(" ");
            let property;
            if(attributes[0] != "PRIMARY" && attributes[0] != "CONSTRAINT"){

                if (attributes[2] != null && attributes[3] != null && attributes[2] == "PRIMARY" && attributes[3] == "KEY" || 
                attributes[4] != null && attributes[5] != null && attributes[4] == "PRIMARY" && attributes[5] == "KEY") {
                    property = new Property(attributes[0], attributes[1], true, true);
                } else {
                    if (attributes[2] != null && attributes[3] != null && attributes[2] == "NOT" && attributes[3] == "NULL"){
                        property = new Property(attributes[0], attributes[1], true, false);
                    } else {
                        property = new Property(attributes[0], attributes[1], false, false);
                    }
                }
                properties.forEach(p => {
                    if (isOk && p.name == property.name) {
                        isOk = false;
                    }
                });
                if (isOk) {
                    properties.push(property);
                } else {
                    console.log("error , duplicate parameter name");
                    propAreValid = false;
                    break;
                }
                
            } else {
                let columnNames;
                if(attributes[0] == "PRIMARY"){
                    columnNames = attributes[2];
                } else {
                    columnNames = attributes[4]; // (nume de coloane) se afla dupa Constraint nume_pk primary key, index 4 deci
                }
                console.log(columnNames);
            }
        }
        if (propAreValid) {
            createTable(result[3], properties);
        }
    }
    else {
        if (result[19] != null && result[19].toLowerCase() == "drop table") {
            deleteTable(result[20]);
        }
    }
}

function showProperties() {
    tables.forEach(table => {
        console.log(table.properties);
    });
}

processTheCommand("CREATE TABLE tabel1(numeeeeeee valoareeee NOT NULL, num1 valu2, num3 val4 )");

processTheCommand("CREATE TABLE tabel2(numelemeuecelmailung valoare NOT NULL, num1 valu2, num3 val4)");

processTheCommand("CREATE TABLE tabel3(nume valoare PRIMARY KEY, num1 valu2 PRIMARY KEY NOT NULL, num3 val4 NOT NULL PRIMARY KEY)");

processTheCommand("CREATE TABLE Persons (ID int NOT NULL, LastName varchar(255) NOT NULL, FirstName varchar(255), Age int, CONSTRAINT PK_Person PRIMARY KEY (ID));");

processTheCommand("DROP TABLE tabel1");

showProperties();