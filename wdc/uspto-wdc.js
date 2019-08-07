(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var patentCols = [
            { id: "patent_title", alias: "patent_title", dataType: tableau.dataTypeEnum.string },
            { id: "lastId", alias: "lastId", dataType: tableau.dataTypeEnum.string },
            { id: "patent_number", alias: "patent_number", dataType: tableau.dataTypeEnum.string },
            { id: "patent_year", alias: "patent_year", dataType: tableau.dataTypeEnum.string },
            { id: "patent_abstract", alias: "patent_abstract", dataType: tableau.dataTypeEnum.string },
            
        ], inventorCols = [
            { id: "patent_number", alias: "patent_number", dataType: tableau.dataTypeEnum.string },
            { id: "inventor_id", alias: "inventor_id", dataType: tableau.dataTypeEnum.string },
            { id: "inventor_last_name", alias: "inventor_last_name", dataType: tableau.dataTypeEnum.string },
            { id: "inventor_first_name", alias: "inventor_first_name", dataType: tableau.dataTypeEnum.string },
            { id: "inventor_longitude", alias: "latitude", columnRole: "dimension", dataType: tableau.dataTypeEnum.float },
            { id: "inventor_latitude", alias: "longitude", columnRole: "dimension", dataType: tableau.dataTypeEnum.float },
        ], assigneeCols = [
            { id: "patent_number", alias: "patent_number", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_id", alias: "assignee_id", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_first_name", alias: "assignee_first_name", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_last_name", alias: "assignee_last_name", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_organization", alias: "assignee_organization", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_longitude", alias: "assignee_longitude", columnRole: "dimension", dataType: tableau.dataTypeEnum.float },
            { id: "assignee_latitude", alias: "assignee_latitude", columnRole: "dimension", dataType: tableau.dataTypeEnum.float },
        ], wipoCols = [
            { id: "patent_number", alias: "patent_number", dataType: tableau.dataTypeEnum.string },
            { id: "wipo_sector_title", alias: "wipo_sector_title", dataType: tableau.dataTypeEnum.string },
        ], uspcCols = [
            { id: "patent_number", alias: "patent_number", dataType: tableau.dataTypeEnum.string },
            { id: "uspc_mainclass_title", alias: "uspc_mainclass_title", dataType: tableau.dataTypeEnum.string },
        ], nberCols = [
            { id: "patent_number", alias: "patent_number", dataType: tableau.dataTypeEnum.string },
            { id: "nber_category_title", alias: "nber_category_title", dataType: tableau.dataTypeEnum.string },
        ], cpcCols = [
            { id: "patent_number", alias: "patent_number", dataType: tableau.dataTypeEnum.string },
            { id: "cpc_group_title", alias: "cpc_group_title", dataType: tableau.dataTypeEnum.string },
        ], ipcCols = [
            { id: "patent_number", alias: "patent_number", dataType: tableau.dataTypeEnum.string },
            { id: "ipc_class", alias: "ipc_class", dataType: tableau.dataTypeEnum.string },
        ],
            patentTableInfo = {
                id: "patentData",
                alias: "US Patent Data",
                columns: patentCols,
                incrementColumnId: "patent_number"
            }, inventorTableInfo = {
                id: "inventorData",
                alias: "US Inventors Data",
                columns: inventorCols
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
            }, ipcTableInfo = {
                id: "ipcData",
                alias: "US ipc Data",
                columns: ipcCols
            };



        schemaCallback([patentTableInfo, inventorTableInfo, assigneeTableInfo, wipoTableInfo, uspcTableInfo, nberTableInfo, cpcTableInfo, ipcTableInfo]);
    };

    myConnector.getData = function (table, doneCallback) {
        
        var queryObj = JSON.parse(tableau.connectionData);
        $.getJSON('http://www.patentsview.org/api/patents/query?q={"' + queryObj.filterKey + '":"' + queryObj.filterValue + '"}&o={"page":' + queryObj.page + ',"per_page":' + queryObj.per_page + '}&f=["patent_abstract", "assignee_id","assignee_latitude","assignee_longitude","assignee_last_name","assignee_first_name","patent_number","patent_title","inventor_id","patent_id","inventor_latitude","inventor_longitude", "patent_year",  "assignee_organization","inventor_city","inventor_last_name","inventor_first_name","wipo_sector_title", "uspc_mainclass_title", "inventor_state", "nber_category_title","inventor_country","cpc_group_title"]&s=[{"' + queryObj.sortKey + '":"'+queryObj.sortValue+'"}]', function (resp) {

            var patents = resp.patents,
                tableData = [];

            // Iterate over the JSON object
            // These loops might be better handled with forin loops, I'd welcome that improvement
            for (var i = 0, leni = patents.length; i < leni; i++) {
                if (table.tableInfo.id == "patentData") {
                    tableData.push({
                        "lastId":patents[i].patent_id,
                        "patent_number": patents[i].patent_number,
                        "patent_title": patents[i].patent_title,
                        "patent_year": patents[i].patent_year,
                        "patent_abstract": patents[i].patent_abstract,


                    });
                }
                if (table.tableInfo.id == "inventorData") {
                    for (var j = 0, lenj = patents[i].inventors.length; j < lenj; j++) {
                        tableData.push({
                            "patent_number": patents[i].patent_number,
                            "inventor_id": patents[i].inventors[j].inventor_id,
                            "inventor_last_name": patents[i].inventors[j].inventor_last_name,
                            "inventor_first_name": patents[i].inventors[j].inventor_first_name,
                            "inventor_latitude": patents[i].inventors[j].inventor_latitude,
                            "inventor_longitude": patents[i].inventors[j].inventor_longitude,
                        });
                    }
                }
                if (table.tableInfo.id == "assigneeData") {
                    for (var k = 0, lenk = patents[i].assignees.length; k < lenk; k++) {
                        if (patents[i].assignees[k].assignee_id) {
                            tableData.push({
                                "patent_number": patents[i].patent_number,
                                "assignee_first_name": patents[i].assignees[k].assignee_first_name,
                                "assignee_last_name": patents[i].assignees[k].assignee_last_name,
                                "assignee_id": patents[i].assignees[k].assignee_id,
                                "assignee_organization": patents[i].assignees[k].assignee_organization,
                                "assignee_latitude": patents[i].assignees[k].assignee_latitude,
                                "assignee_longitude": patents[i].assignees[k].assignee_longitude,
                            });
                        }
                    }
                }
                if (table.tableInfo.id == "wipoData") {
                    for (var l = 0, lenl = patents[i].wipos.length; l < lenl; l++) {
                        if (patents[i].wipos[l].wipo_sector_title) {
                            tableData.push({
                                "patent_number": patents[i].patent_number,
                                "wipo_sector_title": patents[i].wipos[l].wipo_sector_title,
                            });
                        }
                    }
                }
                if (table.tableInfo.id == "uspcData") {
                    for (var m = 0, lenm = patents[i].uspcs.length; m < lenm; m++) {
                        if (patents[i].uspcs[m].uspc_mainclass_title) {
                            tableData.push({
                                "patent_number": patents[i].patent_number,
                                "uspc_mainclass_title": patents[i].uspcs[m].uspc_mainclass_title,
                            });
                        }
                    }
                }
                if (table.tableInfo.id == "nberData") {
                    for (var m = 0, lenm = patents[i].nbers.length; m < lenm; m++) {
                        if (patents[i].nbers[m].nber_category_title) {
                            tableData.push({
                                "patent_number": patents[i].patent_number,
                                "nber_category_title": patents[i].nbers[m].nber_category_title,
                            });
                        }
                    }
                }
                if (table.tableInfo.id == "cpcData") {
                    for (var m = 0, lenm = patents[i].cpcs.length; m < lenm; m++) {
                        if (patents[i].cpcs[m].cpc_group_title) {
                            tableData.push({
                                "patent_number": patents[i].patent_number,
                                "cpc_group_title": patents[i].cpcs[m].cpc_group_title,
                            });
                        }
                    }
                }
                if (table.tableInfo.id == "ipcData") {
                    for (var n = 0, lenn = patents[i].ipcs.length; n < lenn; n++) {
                        if (patents[i].ipcs[n].ipc_class) {
                            tableData.push({
                                "patent_number": patents[i].patent_number,
                                "ipc_class": patents[i].ipcs[n].ipc_class,
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
