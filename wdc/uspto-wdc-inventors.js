/*global tableau,document,Papa, $*/
(function () {
  "use strict";

  let myConnector = tableau.makeConnector(),csvResult = [],usedColumns = [],tableList = [],tables = [],userObj=[], useLocalFile = false;
  
  var objectSet = {
    dataTypes: {
      "integer": tableau.dataTypeEnum.int,
      "int": tableau.dataTypeEnum.int,
      "float": tableau.dataTypeEnum.float,
      "string": tableau.dataTypeEnum.string,
      "full text": tableau.dataTypeEnum.string,
      "date": tableau.dataTypeEnum.date
    },
    full: [],
    filtered: [],
    newHeaders: { "Skip": "skip", "API Field Name": "id", "Group": "group", "Common Name": "alias", "Type": "dataType", "Query": "query", "Description": "description" },
    filteredMot: (function () {
      let filtered = this.full.filter(fullObj => (fullObj.skip !== "#"));
      filtered.forEach(a => a.dataType = this.dataTypes[a.dataType]);
      this.tupe = filtered;
      return filtered
    }),
    tableList : function() {return [...new Set(objectSet.filteredMot().map(i => `${i.group}`))]},
    usedColumns :function() { return [...new Set(objectSet.filtered.map(i => `"${i.id}"`))]},
    filterByGroup : function (obj, groupName) {
      return obj.filter(obj => {
        return obj.group === groupName || obj.id === selectedEndpoint.keyId;
      });
    },
    tables: function (){ 
      let tempTables = [];
      this.tableList().forEach(element => tempTables.push({
        id: element,
        alias: element,
        columns: objectSet.filterByGroup(objectSet.filteredMot(), element)
      }))
      return tempTables;
    }
};
  
  //////////////////////////////////////////////////////////////////////////////
  // End point configuration
  const endpointConfig = {
    inventors: {
      fileName: "inventors",
      keyId: "inventor_id",
      group: "inventors"
    },
    patents: {
      fileName: "patent",
      keyId: "patent_number",
      group: "patents"
    },
    locations: {
      fileName: "locations",
      keyId: "location_id",
      group: "locations"
    },
    cpc: {
      fileName: "cpc_subsection",
      keyId: "cpc_group_id",
      group: "cpc_subgroups"
    },
    assignees: {
      fileName: "assignee",
      keyId: "assignee_id",
      group: "assignees"
    },
    nber: {
      fileName: "nber_subcat",
      keyId: "nber_category_id",
      group: "nber_subcategories"
    }
  };
  let selectedEndpoint = (endpointConfig[window.location.hash.split("#")[1]] ? endpointConfig[window.location.hash.split("#")[1]] : endpointConfig.inventors);

  //////////////////////////////////////////////////////////////////////////////////
  // Get cluster codes from server csv file and create cluster results NOT DOING ANYTHING NOW
  $.get("endpoints/clusterCodes.csv", (data) => {
    var csvdata = Papa.parse(data);
    csvResult = new Map(csvdata.data.map((i) => [i[0], i[1]]));
  });

  ////////////////////////////////////////////////////////////////////////////////////
  // Get the data endpoint data from csv and create JSON name obj  < CHANGE THIS VARIABLE
  $.get(`endpoints/${selectedEndpoint.fileName}.csv`, (data) => {
    Papa.parse(data, {
      skipEmptyLines: true,
      header: true,
      transformHeader:function(h) {
        return objectSet.newHeaders[h]
      }, 
      complete: function(results) {
        objectSet.full = results.data;
      }
    });

    ////////////////////////////////////////////////////////////////////////////////
    // Changes the data type in each row from the USPTO type to the tableau object 
    $("#csv-file").change(handleFileSelect);

    insertHTML(objectSet.filteredMot(), objectSet.full, selectedEndpoint, endpointConfig);
  });

  //////////////////////////////////////////////////////////////////////////////////
  // GET A CSV FROM THE USER
  var data;
  function handleFileSelect(evt) {
    var file = evt.target.files[0];    
    Papa.parse(file, {
      header: true,
      transformHeader:function(h) {
        return objectSet.newHeaders[h]
      },
      complete: function(results) {
        document.getElementById("usptoRows").innerHTML = ""
        objectSet.full = results.data;
        objectSet.full.forEach((a, i) => {          
          document.getElementById("usptoRows").innerHTML += `<tr><th scope="row">${checkBox(a.skip)}</th><td>${a.id}<td>${a.description}</td></tr>`;
        });
        
        myConnector.getSchema = function (schemaCallback) {
          //appendRows(objectSet.tables())
          schemaCallback(objectSet.tables());
        };
      }
    });    
  };

  myConnector.getSchema = function (schemaCallback) {
    schemaCallback(objectSet.tables());
  };


  myConnector.getData = function (table, doneCallback) {
    
     ////////////////////////////////////////////////////////////////////////////////////
    // Creates arrays for the columns and the tables (groups) 
    let usedColumns = objectSet.usedColumns();
    
    var queryObj = JSON.parse(tableau.connectionData),
      filter = queryObj.customFilter || '"' + queryObj.filterKey + '":"' + queryObj.filterValue + '"',
      finalURL = `https://www.patentsview.org/api/${selectedEndpoint.group}/query?q={${filter}}&o={"page":${queryObj.page},"per_page":${queryObj.per_page}}&f=[${[...usedColumns]}]`
    if (queryObj.sortValue !== "false") {
      finalURL += `&s=[{"${queryObj.sortKey}":"${queryObj.sortValue}"}]`
    };


    //////////////////////////////////////////////////////////////////////
    // Retreve data from url
    $.getJSON(encodeURI(finalURL), function (resp) {
console.dir(table)
      prepareTables(resp, selectedEndpoint, table);
      doneCallback();
    });
  };

  tableau.registerConnector(myConnector);
  $(document).ready(function () {

    // ////////////////////////////////////////////////////
    // Get query values from html on submit button click
    $("#submitButton").click(function () {
      const queryObj = {
        per_page: $('#per-page').val(),
        page: $('#page').val(),
        filterKey: $('#filter-key').val(),
        filterValue: $('#filter-value').val(),
        customFilter: $('#custom-filter').val(),
        sortKey: $('#sort-key').val(),
        sortValue: $('#sort-value').val()
      };
      tableau.connectionData = JSON.stringify(queryObj);
      tableau.connectionName = "Inventor Feed";
      tableau.submit(); 
    });
  });

    function checkBox(a) {
      return `<div class="form-check">
        <input class="form-check-input" type="checkbox" ${a ? "" : "checked"} value="${a ? "" : "checked"}" id="defaultCheck1">
      </div>`
    }


  function insertHTML(obj, fullObj, selectedEndpoint, endpointConfig) {
    /////////////////////////////////////////////////////////////////////////////////
    // Modify the HTML with data from the this script
    var innerHtml = "",
      innerTableHtml = "";
    obj.forEach((a) => {innerHtml += `<option value='${a.id}'>${a.id}</option>`;});

    $("#dummyButton").click(function () {
      fullObj[0].skip = "";
      objectSet.filtered.push(fullObj[0]);
      console.dir(objectSet.filtered);
    });

    fullObj.forEach((a, i) => {
      document.getElementById("usptoRows").innerHTML += `<tr><th scope="row">${checkBox(a.skip)}</th><td>${a.id}<td>${a.description}</td></tr>`;
    });
    document.getElementById("filter-key").innerHTML = innerHtml;
    document.getElementById("sort-key").innerHTML = innerHtml;
    document.getElementById("sort-key").innerHTML = innerHtml;
    document.getElementById("title").innerHTML = `USPTO ${selectedEndpoint.group.toUpperCase()[0] + selectedEndpoint.group.substr(1)} Endpoint`;
    document.getElementById("description").innerHTML = `This connector allows you to load data from the USPTO PatentsView API, Specifically the Inventors Endpoint as documented at <a href="http://www.patentsview.org/api/${selectedEndpoint.fileName}.html">http://www.patentsview.org/api/${selectedEndpoint.fileName}.html</a>.\n`;
    document.getElementById("description").innerHTML += `Other possible endpoints are available at #${Object.keys(endpointConfig).join(", #")}`;
    document.getElementById("filter-key").childNodes.forEach(s => {
      if (s.value === "inventor_lastknown_city") {s.setAttribute('selected', true);}
    });

  }

  function prepareTables(resp, selectedEndpoint,table) {
    var keyTable = resp[selectedEndpoint.group], 
      tableData = [],
      subTable = function (subTableValues, main_table) {
        try {
          main_table[subTableValues].forEach(function (values) {
            var value = values;
            value[selectedEndpoint.keyId] = main_table[selectedEndpoint.keyId];
            tableData.push(value);
          });
        }
        catch (err) {
          tableau.log(err);
        }
      };
    keyTable.forEach(function (inventors) {
      if (table.tableInfo.id === selectedEndpoint.group) {
        tableData.push(inventors);
      }
      else if (table.tableInfo.id !== "ipcsXX") {
        subTable(table.tableInfo.id, inventors);
      }
  
    });
    table.appendRows(tableData);
  }
  
}());


