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
    constructor(name, datatype) {
        this.name = name;
        this.datatype = datatype;
        this.isNull = false;
        this.isPrimaryKey = false;
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

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function replaceWithDots(text){
    if(text.length > 10){
        let showName = "";
        for(j = 0; j < 8; j++){
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

    for(i = 0; i < properties.length; i++) {
        let newParam = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        newParam.setAttribute("class", table.title);
        newParam.setAttribute("x", table.x + 40);
        newParam.setAttribute("y", 30 + table.y + 20*(i+1)); 
        let txt = document.createTextNode(replaceWithDots(properties[i].name));
        newParam.appendChild(txt);
        grp.appendChild(newParam);
        let newParam2 = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        newParam2.setAttribute("class", table.title);
        newParam2.setAttribute("x", (table.x + table.width/2));
        newParam2.setAttribute("y", 30 + table.y + 20*(i+1));
        let txt2 = document.createTextNode(properties[i].datatype);
        newParam2.appendChild(txt2);
        grp.appendChild(newParam2);
    }
    //#endregion
    tables.push(table);
}

function deleteTable(title){
    removeElementsByClass(title);
}

function processTheCommand(sqlCommand) {
    var re = new RegExp("((CREATE TABLE|create table)\\s*([a-zA-Z0-9_\\-\\.]+)\\s*\\(((\\s*[a-zA-Z0-9]+\\s[a-zA-Z0-9]+\\s*,)*\\s*[a-zA-Z0-9]+\\s[a-zA-Z0-9]+\\s*)\\))|((DROP TABLE|drop table)\\s*([a-zA-Z0-9_\\-\\.]+)\\s*)");
    const result = re.exec(sqlCommand);

    if (result[2] != null && result[2].toLowerCase() == "create table") {
        let propAreValid = true;
        let properties = [];
        let res = result[4].split(",");
        for(let i = 0; i < res.length; i++) {
            let isOk = true;
            let property = new Property(res[i].trim().split(" ")[0], res[i].trim().split(" ")[1]);
            properties.forEach(p => {
                if(isOk && p.name == property.name){
                    isOk = false;
                }
            });
            if(isOk){
                properties.push(property);
            } else {
                console.log("error , duplicate parameter name");
                propAreValid = false;
                break;
            }
        }
        if(propAreValid){
            createTable(result[3], properties);
        }
    }
    else {
        if (result[7] != null && result[7].toLowerCase() == "drop table") {
            deleteTable(result[8]);
        }
    }
}

processTheCommand("CREATE TABLE tabel1(numeeeeeee valoareeee, num1 valu2, num3 val4 )");

processTheCommand("CREATE TABLE tabel2(numelemeuecelmailung valoare, num1 valu2, num3 val4)");

processTheCommand("CREATE TABLE tabel3(nume valoare, num1 valu2, num3 val4)");

processTheCommand("DROP TABLE tabel1");