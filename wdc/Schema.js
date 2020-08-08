console.log("Schema init");
import { endpointConfig } from "./endpointConfig.js"

export default class EndpointProto {
    constructor(data, endpoint) {
        this.selectedEndpointObj = endpointConfig[endpoint];
        this.full = data
        this.tableauDatatypes = {
            "integer": tableau.dataTypeEnum.int,
            "int": tableau.dataTypeEnum.int,
            "float": tableau.dataTypeEnum.float,
            "string": tableau.dataTypeEnum.string,
            "full text": tableau.dataTypeEnum.string,
            "date": tableau.dataTypeEnum.date
        };
    };

    get filtered() {
        return this.full.filter(full => {
            return full.skip != true;
        }).map((line) => {
            delete line.skip
            return line
        })
    }

    get tableList() { return [...new Set(this.filtered.map(i => `${i.group}`))] };

    get usedColumns() { return [...new Set(this.filtered.map(i => `"${i.id}"`))] }

    get tables() {
        let tempTables = [];
        this.tableList.forEach(element => tempTables.push({
            id: element,
            alias: element,
            columns: this.filterByGroup(this.filtered, element)
        }))
        return tempTables;
    }



    filterByGroup(obj, groupName) {
        obj.map((i) => {
            i.dataType = this.tableauDatatypes[i.dataType]
            return i
        })
 
        return obj.filter(obj => obj.id === this.selectedEndpointObj.keyId ||obj.group === groupName  );
        //return obj.filter(obj => obj.group === groupName || obj.id === endpointConfig[this.selectedEndpointObj.keyId]);
    }


    prepareTables(resp, endpoint, table) {
        let tableData = [],
            subTable = (subTableValues, main_table) => {
                main_table[subTableValues].forEach((value) => {
                    value[this.selectedEndpointObj.keyId] = main_table[this.selectedEndpointObj.keyId];
                    tableData.push(value);
                })
            }
        resp.forEach(function (inventors) {
            if (table.tableInfo.id === endpoint[0]) {
                tableData.push(inventors);
            }
            else if (table.tableInfo.id !== "ipcsXX") {
                subTable(table.tableInfo.id, inventors);
            }
        });
        return tableData;
    }
} 