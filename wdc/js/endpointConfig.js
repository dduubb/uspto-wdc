export let endpointConfig = {
    inventors: {
      title: "Inventors",
      docs:"https://www.patentsview.org/api/inventor.html",
      filename: "inventors",
      keyId: "inventor_id",
      group: "inventors"
    },
    patents: {
      title: "Patents",
      docs:"https://www.patentsview.org/api/patent.html",
      filename: "patents",
      keyId: "patent_number",
      group: "patents"
    },
    locations: {
      title: "Locations",
      docs:"https://www.patentsview.org/api/location.html",
      filename: "locations",
      keyId: "location_id",
      group: "locations"
    },
    cpc: {
      title: "CPC Subsection",
      docs:"https://www.patentsview.org/api/cpc_subsection.html",
      filename: "cpc_subsection",
      keyId: "cpc_group_id",
      group: "cpc_subgroups"
    },
    assignees: {
      title: "Assignee",
      docs:"https://www.patentsview.org/api/assignee.html",
      filename: "assignee",
      keyId: "assignee_id",
      group: "assignees"
    },
    nber: {
      title: "NBER Subcategory",
      docs:"https://www.patentsview.org/api/nber_subcat.html",
      filename: "nber_subcat",
      keyId: "nber_category_id",
      group: "nber_subcategories"
    }
  }