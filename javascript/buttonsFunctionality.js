import * as script from "./script.js";
import * as popUps from "./displayWindows.js";

var tables = [];
var exportText = '';

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
                content += references[0].referencedColumns[m];

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

    //download("daser-schema.sql", contentToWrite);

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

