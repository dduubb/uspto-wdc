/*global tableau*/
import { loadCSV } from "./js/loadCsv.js"
import { endpointConfig } from "./js/endpointConfig.js"
import EndpointProto from "./js/Schema.js"
import { layout } from "./js/layout.js"
const urlHash = (window.location.hash.split("#")[1]) ? window.location.hash.split("#")[1] : "inventors"
const myEndpoint = endpointConfig[urlHash]
const url = `./endpoints/${myEndpoint['filename']}.csv`
let myConnector = {}
<<<<<<< HEAD
let usedColumns, endpointInst
=======
const url = `./endpoints/${myEndpoint['filename']}.csv`
console.log(url)
let usedColumns, endpointInst, tables
>>>>>>> 75296768ffaf42b7989be419b2d486543e353658
init(url)

async function init(url) {
    let dataObj = await loadCSV(url)
    endpointInst = new EndpointProto(dataObj, myEndpoint['filename'])
    layout.renderTable(endpointInst.full)
    layout.addOptions(endpointInst.filtered, "inventor_lastknown_city")
    layout.events(myEndpoint['title'], myEndpoint['docs'])
    usedColumns = endpointInst.usedColumns
    submitButton.removeAttribute("disabled")
}

tableauInit()
function tableauInit() {
    myConnector = tableau.makeConnector()
    myConnector.getSchema = (schemaCallback) => {
        console.log(endpointInst.tables)
        schemaCallback(endpointInst.tables)
    }
    myConnector.getData = (table, doneCallback) => {
        let queryObj = JSON.parse(tableau.connectionData),
            filter = queryObj.customFilter || '"' + queryObj.filterKey + '":"' + queryObj.filterValue + '"',
            finalURL = `https://www.patentsview.org/api/${myEndpoint['filename']}/query?q={${filter}}&o={"page":${queryObj.page},"per_page":${queryObj.per_page}}&f=[${[...usedColumns]}]`

        fetch(finalURL).then((response) => {
            response.json().then((json) => {
                let feat = json[myEndpoint['group']],
                    tableData = endpointInst.prepareTables(feat, [myEndpoint['group']], table)
                table.appendRows(tableData, [myEndpoint['group']])
                doneCallback()
            })
        }).catch((err) => console.error(`Error ${err}`))
    }
    tableau.registerConnector(myConnector)
}

layout.elements.homeTab.addEventListener('click', () => {
    console.log(endpointInst, endpointInst.tables)
    console.log(myConnector)
})

submitButton.addEventListener('click', () => {
    let TCD = {
        page: document.getElementById('page').value,
        per_page: document.getElementById('per-page').value,
        page: document.getElementById('page').value,
        filterKey: document.getElementById('filter-key').value,
        filterValue: document.getElementById('filter-value').value,
        customFilter: document.getElementById('custom-filter').value,
        sortKey: document.getElementById('sort-key').value,
        sortValue: document.getElementById('sort-value').value,
        connectionData: usedColumns,
        tables: endpointInst.tables
    }

    tableau.connectionName = "Patent Connector"
    tableau.connectionData = JSON.stringify(TCD)
    tableau.submit()
})