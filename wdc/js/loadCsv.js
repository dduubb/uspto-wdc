console.log("loadCSV init");
//import Papa from "papaparse";

export let loadCSV = async (url) => {
    return new Promise(async (resolve, reject) => {
        let data = await fetchCSV(url);
        let dataObj = await parsePromise(data);
        resolve(dataObj);
    })
}

const newHeaders = { "Skip": "skip", "API Field Name": "id", "Group": "group", "Common Name": "alias", "Type": "dataType", "Query": "query", "Description": "description" };

const parsePromise = function (file) {
    return new Promise(function (resolve, reject) {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            transformHeader: h => newHeaders[h],
            complete: results => {
                resolve(results.data)
            }
        });
    });
};

const fetchCSV = (url) => {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = () => req.status === 200 ? resolve(req.response) : reject(Error(req.statusText));
        req.onerror = (e) => reject(Error(`Network Error: ${e}`));
        req.send();
    });
};

