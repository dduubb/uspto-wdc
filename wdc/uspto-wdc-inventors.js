/*global tableau,document,Papa, $*/
(function () {
  "use strict";


  let csvResult = []; let obj = []; let usedColumns = []; let tableList = []; let tables = [];

  const endpointConfig = {
    inventors: {fileName:"endpoints/inventors.csv", keyId:"inventor_id", group:"inventors"},
    patents: {fileName:"endpoints/patents.csv", keyId:"patents_id", group:"patents"},
    locations: {fileName:"endpoints/locations.csv", keyId:"locations_id", group:"locations"}
  }
  const selectedEndpoint = endpointConfig.inventors; 

  
  //////////////////////////////////////////////////////////////////////////////////
  // Get cluster codes from csv file and create cluster results NOT DOING ANYTHING NOW
  $.get("endpoints/clusterCodes.txt", (data) => {
    var csvdata = Papa.parse(data);
    csvResult = new Map(csvdata.data.map((i) => [i[0], i[1]]));
  });

////////////////////////////////////////////////////////////////////////////////////
// Get the data endpoint data from csv and create JSON name obj  < CHANGE THIS VARIABLE
  $.get(selectedEndpoint.fileName, (data) => {
    var csvdata = Papa.parse(data, {
      skipEmptyLines: true
    });
    obj = csvdata.data.slice(1).map(([id, group, alias, dataType, n, description]) => {
      return (
        { id, group, alias, dataType, description })
    });
////////////////////////////////////////////////////////////////////////////////////
// Creates arrays for the columns and the tables (groups) 
    usedColumns = [...new Set(obj.map(i => `"${i.id}"`))];
    tableList = [...new Set(obj.map(i => `${i.group}`))];

////////////////////////////////////////////////////////////////////////////////////
// Deduplicates the table names (groups) 
  function filterByGroup(obj, groupName) {
    return obj.filter(obj => {
      return obj.group === groupName || obj.id === selectedEndpoint.keyId;
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Changes the data type in each row from the USPTO type to the tableau object 
    obj.forEach((a) => {
      switch (a.dataType) {
        case "int":
          return a.dataType = tableau.dataTypeEnum.int
        case "string":
          return a.dataType = tableau.dataTypeEnum.string
        case "full text":
          return a.dataType = tableau.dataTypeEnum.string
        case "date":
          return a.dataType = tableau.dataTypeEnum.date
        default:
          return a.dataType = tableau.dataTypeEnum.string
      }
    }
    );
////////////////////////////////////////////////////////////////////////////////
// Creates the Tableau Tables list
    tableList.forEach(element => tables.push({ id: element, alias: element, columns: filterByGroup(obj, element) }));

/////////////////////////////////////////////////////////////////////////////////
// Modify the HTML with data from the this script
    var innerHtml = "";
    obj.forEach((a) => {
      innerHtml += `<option value='${a.id}'>${a.id}</option>`;
      console.log(innerHtml)
    });
    document.getElementById("filter-key").innerHTML = innerHtml;
    document.getElementById("sort-key").innerHTML = innerHtml;
    document.getElementById("sort-key").innerHTML = innerHtml;

    document.getElementById("filter-key").childNodes.forEach(s => {
         if (s.value === "inventor_lastknown_city"){
          s.setAttribute('selected',true);; //attr('selected', true);//alert('is htere'+s);
       } });


      })


 

  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    schemaCallback(tables);
  };
  myConnector.getData = function (table, doneCallback) {

    var queryObj = JSON.parse(tableau.connectionData),
      filter = queryObj.customFilter || '"' + queryObj.filterKey + '":"' + queryObj.filterValue + '"',
      finalURL = `https://www.patentsview.org/api/${selectedEndpoint.group}/query?
      q={${filter}}
      &o={"page":${queryObj.page},"per_page":${queryObj.per_page}}
      &f=[${[...usedColumns]}]`
      if (queryObj.sortValue !== "false") {finalURL += `&s=[{"${queryObj.sortKey}":"${queryObj.sortValue}"}]`};

      // inventors: {fileName:"endpoints/inventors.csv", keyId:"inventor_id", group:"inventors"},
      // patents: {fileName:"endpoints/patents.csv", keyId:"patents_id", group:"patents"},

//////////////////////////////////////////////////////////////////////
// Retreve data from csv
      $.getJSON(finalURL, function (resp) {
      var inventors = resp.inventors,
        tableData = [],
        subTable = function (subTableValues, main_table) {
          try {
            main_table[subTableValues].forEach(function (values) {
              var value = values;
              value.inventor_id = main_table.inventor_id;
              tableData.push(value);
            });
          } catch (err) {
            tableau.log(err);
          }
        };
      inventors.forEach(function (inventors) {
        if (table.tableInfo.id === "inventors") {
          tableData.push(inventors);
        } else if (table.tableInfo.id !== "ipcsXX") {
          subTable(table.tableInfo.id, inventors);
        }

      });
      table.appendRows(tableData);
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
}());

