/*global tableau, $*/
import { loadCSV } from "./loadCsv.js"
import { endpointConfig } from "./endpointConfig.js"
import EndpointProto from "./Schema.js"
import { layout } from "./layout.js"
const urlHash = (window.location.hash.split("#")[1]) ? window.location.hash.split("#")[1] : "inventors";
const myEndpoint = endpointConfig[urlHash];
let myConnector = {}
const url = `endpoints/${myEndpoint['filename']}.csv`
let usedColumns, myTable, endpointInst, tables
init(url)

async function init(url) {
    let dataObj = await loadCSV(url)
    endpointInst = new EndpointProto(dataObj, myEndpoint['filename']);
    window.test = endpointInst
    layout.renderTable(endpointInst.full)
    layout.addOptions(endpointInst.filtered, "inventor_lastknown_city")
    layout.events(myEndpoint['title'], myEndpoint['docs'])
    usedColumns = endpointInst.usedColumns
    myTable = endpointInst.tables,
        tables = endpointInst.tables

}

(() => {
    myConnector = tableau.makeConnector();
    myConnector.getSchema = (schemaCallback) => {
        //console.log("TABLE------", tables)
        schemaCallback(tables)
    };

    myConnector.getData = (table, doneCallback) => {
        let queryObj = JSON.parse(tableau.connectionData),
            filter = queryObj.customFilter || '"' + queryObj.filterKey + '":"' + queryObj.filterValue + '"',
            finalURL = `https://www.patentsview.org/api/${myEndpoint['filename']}/query?q={${filter}}&o={"page":${queryObj.page},"per_page":${queryObj.per_page}}&f=[${[...usedColumns]}]`;

        fetch(finalURL).then((response) => {
            response.json().then((json) => {
                let feat = json[myEndpoint['group']],
                    tableData = endpointInst.prepareTables(feat, [myEndpoint['group']], table);
                table.appendRows(tableData, [myEndpoint['group']]);
                doneCallback();
            })
        }).catch((err) => console.error(`Error ${err}`))
    };

    tableau.registerConnector(myConnector);
})();

submitButton.addEventListener('click', () => {
    myConnector.getSchema = (schemaCallback) => {
        
        schemaCallback(endpointInst.tables)
    };
    let tcd = {
        page: document.getElementById('page').value,
        per_page: document.getElementById('per-page').value,
        page: document.getElementById('page').value,
        filterKey: document.getElementById('filter-key').value,
        filterValue: document.getElementById('filter-value').value,
        customFilter: document.getElementById('custom-filter').value,
        sortKey: document.getElementById('sort-key').value,
        sortValue: document.getElementById('sort-value').value,
        connectionData: usedColumns
    }
    tableau.connectionName = "Patent Connector";
    tableau.connectionData = JSON.stringify(tcd);
    tableau.submit();
});


