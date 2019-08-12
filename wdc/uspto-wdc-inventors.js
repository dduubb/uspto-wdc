(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var patentCols = [
            { id: "inventor_id", alias: "inventor_id", dataType: tableau.dataTypeEnum.string },
          { id: "patent_id", alias: "patent_id", dataType: tableau.dataTypeEnum.string },
            { id: "patent_title", alias: "patent_title", dataType: tableau.dataTypeEnum.string },
            { id: "patent_year", alias: "patent_year", dataType: tableau.dataTypeEnum.int },
            { id: "patent_abstract", alias: "patent_abstract", dataType: tableau.dataTypeEnum.string },
            { id: "patent_date", alias: "patent_date", dataType: tableau.dataTypeEnum.string },
            { id: "patent_type", alias: "patent_type", dataType: tableau.dataTypeEnum.string },
          
        ], inventorCols = [
            { id: "inventor_id", alias: "inventor_id", dataType: tableau.dataTypeEnum.string },
            { id: "inventor_county", alias: "inventor_county", dataType: tableau.dataTypeEnum.string },    
          //  { id: "inventor_county_fips", alias: "inventor_county_fips", dataType: tableau.dataTypeEnum.string },            
          //  { id: "inventor_state", alias: "inventor_state", dataType: tableau.dataTypeEnum.string },
         //   { id: "inventor_lastknown_city", alias: "inventor_lastknown_city", dataType: tableau.dataTypeEnum.string },
         //   { id: "inventor_lastknown_state", alias: "inventor_lastknown_state", dataType: tableau.dataTypeEnum.string },
        //    { id: "inventor_lastknown_country", alias: "inventor_lastknown_country", dataType: tableau.dataTypeEnum.string },
        //    { id: "inventor_last_name", alias: "inventor_last_name", dataType: tableau.dataTypeEnum.string },
       //     { id: "inventor_first_name", alias: "inventor_first_name", dataType: tableau.dataTypeEnum.string },
       //     { id: "inventor_lastknown_longitude", alias: "inventor_lastknown_longitude", columnRole: "dimension", dataType: tableau.dataTypeEnum.float },
       //     { id: "inventor_lastknown_latitude", alias: "inventor_lastknown_latitude", columnRole: "dimension", dataType: tableau.dataTypeEnum.float },
        ], assigneeCols = [
           { id: "inventor_id", alias: "inventor_id", dataType: tableau.dataTypeEnum.string },
             { id: "patent_number", alias: "patent_number", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_id", alias: "assignee_id", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_first_name", alias: "assignee_first_name", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_last_name", alias: "assignee_last_name", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_organization", alias: "assignee_organization", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_lastknown_longitude", alias: "assignee_lastknown_longitude", columnRole: "dimension", dataType: tableau.dataTypeEnum.float },
            { id: "assignee_lastknown_latitude", alias: "assignee_lastknown_latitude", columnRole: "dimension", dataType: tableau.dataTypeEnum.float },
            { id: "assignee_lastknown_city", alias: "assignee_lastknown_city", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
            { id: "assignee_lastknown_state", alias: "assignee_lastknown_state", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
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
        ], ipcCols = [
            { id: "patent_number", alias: "patent_number", dataType: tableau.dataTypeEnum.string },
            { id: "ipc_code", alias: "ipc_code", dataType: tableau.dataTypeEnum.string },
            { id: "cluster_by_ipc", alias: "cluster_by_ipc", dataType: tableau.dataTypeEnum.string },            
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
        $.getJSON('http://www.patentsview.org/api/inventors/query?q={"' + queryObj.filterKey + '":"' + queryObj.filterValue+'"}&o={"page":'+queryObj.page + ',"per_page":' + queryObj.per_page + '}&f=["patent_abstract","patent_type","patent_id","patent_date","patent_year","patent_number","patent_title","assignee_id","assignee_lastknown_latitude","assignee_lastknown_longitude","assignee_lastknown_city","assignee_lastknown_state","assignee_last_name","assignee_first_name","assignee_organization","inventor_id","inventor_lastknown_latitude","inventor_lastknown_longitude","inventor_lastknown_country","inventor_lastknown_city","inventor_lastknown_state","inventor_last_name","inventor_first_name","inventor_state","inventor_county","inventor_county_fips","wipo_sector_title", "nber_category_title", "uspc_mainclass_title","cpc_group_title","ipc_section","ipc_class","ipc_subclass"]&s=[{"' + queryObj.sortKey + '":"'+queryObj.sortValue+'"}]', function (resp) {

            var inventors = resp.inventors,
                tableData = [];

            // Iterate over the JSON object
            // These loops might be better handled with forin loops, I'd welcome that improvement
            for (var i = 0, leni = inventors.length; i < leni; i++) {
                if (table.tableInfo.id == "inventorData") {
                     tableData.push({                            
                            "inventor_id": inventors[i].inventor_id,
                            "inventor_county": patents[i].inventors[j].inventor_county,                      
                            //"inventor_state": patents[i].inventors[j].inventor_state,                                                       
                            //"inventor_county_fips": patents[i].inventors[j].inventor_county_fips,   
                           // "inventor_lastknown_city": patents[i].inventors[j].inventor_lastknown_city,                    
                           /// "inventor_lastknown_state": patents[i].inventors[j].inventor_lastknown_state,
                           // "inventor_lastknown_country": patents[i].inventors[j].inventor_lastknown_country,
                          //  "inventor_last_name": patents[i].inventors[j].inventor_last_name,
                          //  "inventor_first_name": patents[i].inventors[j].inventor_first_name,
                          //  "inventor_lastknown_latitude": patents[i].inventors[j].inventor_lastknown_latitude,
                          //  "inventor_lastknown_longitude": patents[i].inventors[j].inventor_lastknown_longitude,
                        });
                }
                if (table.tableInfo.id == "patentData") {
                    for (var j = 0, lenj = inventors[i].patents.length; j < lenj; j++) {
                    tableData.push({
                        "patent_number": patents[i].patent_number,
                        "patent_id": patents[i].patent_id,
                        "patent_title": patents[i].patent_title,                        
                        "patent_date": patents[i].patent_date,
                        "patent_year": patents[i].patent_year,
                        "patent_type": patents[i].patent_type,
                        "patent_abstract": patents[i].patent_abstract,
                    });}
                }
                
                if (table.tableInfo.id == "assigneeData") {
                    for (var k = 0, lenk = inventors[i].assignees.length; k < lenk; k++) {
                        if (inventors[i].assignees[k].assignee_id) {
                            tableData.push({
                                "inventor_id": inventors[i].inventor_id,
                                 "assignee_first_name": patents[i].assignees[k].assignee_first_name,
                                "assignee_last_name": patents[i].assignees[k].assignee_last_name,
                                "assignee_id": patents[i].assignees[k].assignee_id,
                                "assignee_organization": patents[i].assignees[k].assignee_organization,
                                "assignee_lastknown_latitude": patents[i].assignees[k].assignee_lastknown_latitude,
                                "assignee_lastknown_longitude": patents[i].assignees[k].assignee_lastknown_longitude,
                                "assignee_lastknown_city": patents[i].assignees[k].assignee_lastknown_city,
                                "assignee_lastknown_state": patents[i].assignees[k].assignee_lastknown_state,
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
                if (table.tableInfo.id == "ipcData") {
                    var ipcCode,
                        m = 0;
                    //for (var m = 0, lenm = patents[i].IPCs.length; m < lenm; m++) {
                    
                        if (patents[i].IPCs[m].ipc_section) {
                            ipcCode = patents[i].IPCs[m].ipc_section+patents[i].IPCs[m].ipc_class+patents[i].IPCs[m].ipc_subclass.toUpperCase();
                            tableData.push({
                                "inventor_id": inventors[i].inventor_id,
                                "ipc_code": ipcCode,
                                "cluster_by_ipc" : clusterLookup[ipcCode] ? clusterLookup[ipcCode].Cluster : "Unknown",
                            });
                        }
                    //}
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
