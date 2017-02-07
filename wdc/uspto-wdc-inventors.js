(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var patentCols = [
            { id: "inventor_id", alias: "inventor_id", dataType: tableau.dataTypeEnum.string },
           { id: "patent_title", alias: "patent_title", dataType: tableau.dataTypeEnum.string },
           { id: "patent_number", alias: "patent_number", dataType: tableau.dataTypeEnum.string },
           { id: "patent_date", alias: "patent_date", dataType: tableau.dataTypeEnum.string },
           { id: "patent_abstract", alias: "patent_abstract", dataType: tableau.dataTypeEnum.string },
            
        ], inventorCols = [
            { id: "inventor_id", alias: "inventor_id", dataType: tableau.dataTypeEnum.string },
            { id: "inventor_last_name", alias: "inventor_last_name", dataType: tableau.dataTypeEnum.string },
            { id: "inventor_first_name", alias: "inventor_first_name", dataType: tableau.dataTypeEnum.string },
            { id: "inventor_longitude", alias: "latitude", columnRole: "dimension", dataType: tableau.dataTypeEnum.float },
            { id: "inventor_latitude", alias: "longitude", columnRole: "dimension", dataType: tableau.dataTypeEnum.float },
        ], assigneeCols = [
            { id: "patent_number", alias: "patent_number", dataType: tableau.dataTypeEnum.string },
            { id: "inventor_id", alias: "inventor_id", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_first_name", alias: "assignee_first_name", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_last_name", alias: "assignee_last_name", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_organization", alias: "assignee_organization", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_longitude", alias: "assignee_longitude", columnRole: "dimension", dataType: tableau.dataTypeEnum.float },
            { id: "assignee_latitude", alias: "assignee_latitude", columnRole: "dimension", dataType: tableau.dataTypeEnum.float },
        ], wipoCols = [
            { id: "inventor_id", alias: "inventor_id", dataType: tableau.dataTypeEnum.string },
            { id: "wipo_sector_title", alias: "wipo_sector_title", dataType: tableau.dataTypeEnum.string },
        ], uspcCols = [
            { id: "inventor_id", alias: "inventor_id", dataType: tableau.dataTypeEnum.string },
            { id: "uspc_mainclass_title", alias: "uspc_mainclass_title", dataType: tableau.dataTypeEnum.string },
        ], nberCols = [
            { id: "inventor_id", alias: "inventor_id", dataType: tableau.dataTypeEnum.string },
            { id: "nber_category_title", alias: "nber_category_title", dataType: tableau.dataTypeEnum.string },
        ], cpcCols = [
            { id: "inventor_id", alias: "inventor_id", dataType: tableau.dataTypeEnum.string },
            { id: "cpc_group_title", alias: "cpc_group_title", dataType: tableau.dataTypeEnum.string },
        ],
            inventorTableInfo = {
                id: "inventorData",
                alias: "US Inventors Data",
                columns: inventorCols
            }, patentTableInfo = {
                id: "patentData",
                alias: "US Patent Data",
                columns: patentCols,
            }, assigneeTableInfo = {
                id: "assigneeData",
                alias: "US Asignee Data",
                columns: assigneeCols
            }, wipoTableInfo = {
                id: "wipoData",
                alias: "US Wipo Data",
                columns: wipoCols
            }, uspcTableInfo = {
                id: "uspcData",
                alias: "US Uspc Data",
                columns: uspcCols
            }, nberTableInfo = {
                id: "nberData",
                alias: "US nber Data",
                columns: nberCols
            }, cpcTableInfo = {
                id: "cpcData",
                alias: "US cpc Data",
                columns: cpcCols
            };



        schemaCallback([patentTableInfo, inventorTableInfo, assigneeTableInfo, wipoTableInfo, uspcTableInfo, nberTableInfo, cpcTableInfo]);
    };

    myConnector.getData = function (table, doneCallback) {
        
        var queryObj = JSON.parse(tableau.connectionData);
        $.getJSON('http://www.patentsview.org/api/inventors/query?q={"' + queryObj.filterKey + '":"' + queryObj.filterValue+'"}&o={"page":'+queryObj.page + ',"per_page":' + queryObj.per_page + '}&f=["inventor_id","patent_abstract","assignee_id","assignee_latitude","assignee_longitude","assignee_last_name","assignee_first_name","patent_number","patent_title","patent_id","inventor_lastknown_latitude","inventor_lastknown_longitude","patent_date","assignee_organization","inventor_lastknown_city","inventor_last_name","inventor_first_name","wipo_sector_title","wipo_sector_title","wipo_sector_title","uspc_mainclass_title","inventor_lastknown_state","nber_category_title","inventor_lastknown_country","cpc_group_title"]&s=[{"' + queryObj.sortKey + '":"'+queryObj.sortValue+'"}]', function (resp) {

            var inventors = resp.inventors,
                tableData = [];

            // Iterate over the JSON object
            // These loops might be better handled with forin loops, I'd welcome that improvement
            for (var i = 0, leni = inventors.length; i < leni; i++) {
                if (table.tableInfo.id == "inventorData") {
                     tableData.push({                            
                            "inventor_id": inventors[i].inventor_id,
                            "inventor_last_name": inventors[i].inventor_last_name,
                            "inventor_first_name": inventors[i].inventor_first_name,
                            "inventor_latitude": inventors[i].inventor_lastknown_latitude,
                            "inventor_longitude": inventors[i].inventor_lastknown_longitude,
                        });
                }
                if (table.tableInfo.id == "patentData") {
                    for (var j = 0, lenj = inventors[i].patents.length; j < lenj; j++) {
                    tableData.push({
                        "inventor_id": inventors[i].inventor_id,
                        "patent_number": inventors[i].patents[j].patent_number,
                        "patent_title": inventors[i].patents[j].patent_title,
                        "patent_date": inventors[i].patents[j].patent_date,
                        "patent_abstract": inventors[i].patents[j].patent_abstract,           
                    });}
                }
                
                if (table.tableInfo.id == "assigneeData") {
                    for (var k = 0, lenk = inventors[i].assignees.length; k < lenk; k++) {
                        if (inventors[i].assignees[k].assignee_id) {
                            tableData.push({
                                "inventor_id": inventors[i].inventor_id,
                                "assignee_first_name": inventors[i].assignees[k].assignee_first_name,
                                "assignee_last_name": inventors[i].assignees[k].assignee_last_name,
                                "assignee_id": inventors[i].assignees[k].assignee_id,
                                "assignee_organization": inventors[i].assignees[k].assignee_organization,
                                "assignee_latitude": inventors[i].assignees[k].assignee_latitude,
                                "assignee_longitude": inventors[i].assignees[k].assignee_longitude,
                            });
                        }
                    }
                }
                if (table.tableInfo.id == "wipoData") {
                    for (var l = 0, lenl = inventors[i].wipos.length; l < lenl; l++) {
                        if (inventors[i].wipos[l].wipo_sector_title) {
                            tableData.push({
                                "inventor_id": inventors[i].inventor_id,
                                "wipo_sector_title": inventors[i].wipos[l].wipo_sector_title,
                            });
                        }
                    }
                }
                if (table.tableInfo.id == "uspcData") {
                    for (var m = 0, lenm = inventors[i].uspcs.length; m < lenm; m++) {
                        if (inventors[i].uspcs[m].uspc_mainclass_title) {
                            tableData.push({
                                "inventor_id": inventors[i].inventor_id,
                                "uspc_mainclass_title": inventors[i].uspcs[m].uspc_mainclass_title,
                            });
                        }
                    }
                }
                if (table.tableInfo.id == "nberData") {
                    for (var m = 0, lenm = inventors[i].nbers.length; m < lenm; m++) {
                        if (inventors[i].nbers[m].nber_category_title) {
                            tableData.push({
                                "inventor_id": inventors[i].inventor_id,
                                "nber_category_title": inventors[i].nbers[m].nber_category_title,
                            });
                        }
                    }
                }
                if (table.tableInfo.id == "cpcData") {
                    for (var m = 0, lenm = inventors[i].cpcs.length; m < lenm; m++) {
                        if (inventors[i].cpcs[m].cpc_group_title) {
                            tableData.push({
                                "inventor_id": inventors[i].inventor_id,
                                "cpc_group_title": inventors[i].cpcs[m].cpc_group_title,
                            });
                        }
                    }
                }
            }
            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);
})();

$(document).ready(function () {

    $("#submitButton").click(function () {
        var queryObj = {
            per_page: $('#per-page').val(),
            page: $('#page').val(),
            filterKey: $('#filter-key').val(),
            filterValue: $('#filter-value').val(),
            sortKey: $('#sort-key').val(),
            sortValue: $('#sort-value').val(),
        };

        tableau.connectionData = JSON.stringify(queryObj);
        tableau.connectionName = "Patent Feed";
        tableau.submit();
    });
});