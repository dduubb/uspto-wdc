/*global tableau, $*/
import { loadCSV } from "./js/loadCsv.js"
import { endpointConfig } from "./js/endpointConfig.js"
import EndpointProto from "./js/Schema.js"
import { layout } from "./js/layout.js"
const urlHash = (window.location.hash.split("#")[1]) ? window.location.hash.split("#")[1] : "inventors";
const myEndpoint = endpointConfig[urlHash];
let myConnector = {}
const url = `../endpoints/${myEndpoint['filename']}.csv`
console.log(url)
let usedColumns, endpointInst, tables
init(url)

async function init(url) {
    let dataObj = await loadCSV(url)
    endpointInst = new EndpointProto(dataObj, myEndpoint['filename']);
    layout.renderTable(endpointInst.full)
    layout.addOptions(endpointInst.filtered, "inventor_lastknown_city")
    layout.events(myEndpoint['title'], myEndpoint['docs'])
    usedColumns = endpointInst.usedColumns
    tables = endpointInst.tables
}

(() => {
    myConnector = tableau.makeConnector();
    myConnector.getSchema = (schemaCallback) => {
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
    let TCD = {
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
    tableau.connectionData = JSON.stringify(TCD);
    tableau.submit();
});


