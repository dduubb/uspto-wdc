export let endpointConfig = {
    inventors: {
      title: "Inventors",
      docs:"https://www.patentsview.org/api/inventor.html",
      filename: "inventors",
      keyId: "inventor_id",
      group: "inventors",
      sort:"inventor_lastknown_city"
    },
    patents: {
      title: "Patents",
      docs:"https://www.patentsview.org/api/patent.html",
      filename: "patents",
      keyId: "patent_number",
      group: "patents",
      sort: "patent_firstnamed_inventor_city"
    },
    locations: {
      title: "Locations",
      docs:"https://www.patentsview.org/api/location.html",
      filename: "locations",
      keyId: "location_id",
      group: "locations",
      sort:"location_city"
    },
    assignees: {
      title: "Assignee",
      docs:"https://www.patentsview.org/api/assignee.html",
      filename: "assignee",
      keyId: "assignee_id",
      group: "assignees",
      sort:'assignee_lastknown_city'
    },
  }