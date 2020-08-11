export const layout = {
    elements: {
        filterKey: document.getElementById("filter-key"),
        sortKey: document.getElementById("sort-key"),
        title: document.getElementById("title"),
        description: document.getElementById("description"),
        submitButton: document.querySelector('#submitButton'),
        tableRows: document.getElementById("usptoRows"),
        homeTab: document.querySelector("#home-tab")
    },
    
    events(endpoint, docsURL) {
        title.innerHTML = `USPTO ${endpoint} endpoint`
        description.innerHTML = `This connector allows you to load data from the USPTO PatentsView API, Specifically the ${endpoint} endpoint as documented at <a href="${docsURL}" target="_blank">patentsview.org</a>`
    },

    renderTable(full) {
        full.forEach((a, i) => {
            document.getElementById("usptoRows").innerHTML += `<tr><th scope="row">${this.checkBox(a.skip, i)}</th><td>${a.id}<td>${a.description}</td></tr>`
        })
        document.querySelectorAll("#default-check").forEach((e) => e.addEventListener("click", (e) => {
            full[e.target.value].skip = !full[e.target.value].skip
        }))
    },

    checkBox(a, i) {
        return `<div class="form-check">
          <input class="form-check-input" type="checkbox" ${a ? "" : "checked"} value="${i}" id="default-check">
        </div>`
    },

    addOptions(list, def) {
        let innerHtml = ''
        list.forEach((a) => { innerHtml += `<option ${a.id == def ? 'selected' : ''} value='${a.id}'>${a.id}</option>` })
        this.elements.filterKey.innerHTML = innerHtml
        this.elements.sortKey.innerHTML = innerHtml
        this.elements.filterKey.innerHTML = innerHtml

    }

}