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

            //get the array with foreign keys as in the end to create the command for fks
            references = tables[i].references;

        }//end of properties building index j

        //check if we have primary keys and concat them to table create command
        if (primaryKeys.length != 0){
            content += ', PRIMARY KEY(';

            //get the columns that compose the primary key
            for (let k = 0; k < primaryKeys.length; k++){
                content += primaryKeys[k];

                if( k < primaryKeys.length - 1){
                    content += ', ';
                }

            }
            //close pk group
            content += ')';
        }


        primaryKeys = [];

        //close last parantheses
        content += ")";

        //adding new line and a slash
        content += "\n";
        content += "/";

        //add new line after slash
        content += "\n";
        console.log(content);
        content = '';

    }//end of tables building index i

    //var uriContent = "data:application/text," + encodeURIComponent(content);
    //var newWindow = window.open(uriContent, "newDoc");

}