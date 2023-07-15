let searchInputEl = document.getElementById("searchInput");

let searchResultsEl = document.getElementById("searchResults");

let spinnerEl = document.getElementById("spinner");

// fetching the each result from wikipedia and appending to a container
function createAndAppendSearchResult(result) {
    let { link, title, description } = result;
    // creating search result card
    let resultItemEl = document.createElement("li");
    resultItemEl.classList.add("result-item");

    //creating text link for each search result
    let titleEl = document.createElement("a");
    titleEl.href = link;
    titleEl.target = "_blank";
    titleEl.textContent = title;
    titleEl.classList.add("result-title");
    resultItemEl.appendChild(titleEl);

    let titleBreakEl = document.createElement("br");
    resultItemEl.appendChild(titleBreakEl);

    // creating url link for each search result
    let urlEl = document.createElement("a");
    urlEl.classList.add("result-url");
    urlEl.href = link;
    urlEl.target = "_blank";
    urlEl.textContent = link;
    resultItemEl.appendChild(urlEl);

    let linkBreakEl = document.createElement("br");
    resultItemEl.appendChild(linkBreakEl);

    // creating description for each search result
    let descriptionEl = document.createElement("p");
    descriptionEl.classList.add("link-description");
    descriptionEl.textContent = description;
    resultItemEl.appendChild(descriptionEl);

    searchResultsEl.appendChild(resultItemEl);
}
//function for creating each search result
function displayResults(searchResults) {
    spinnerEl.classList.add("d-none");

    for (let result of searchResults) {
        createAndAppendSearchResult(result);
    }
}

function searchWikipedia(event) {
    if (event.key === "Enter") {
        let searchInput = searchInputEl.value.trim();
        let searchOptionsNavBar = document.getElementsByClassName(
            "search-options-nav-bar"
        )[0];
        let searchNavBar = document.getElementsByClassName("search-navbar")[0];
        if (searchInput !== "") {
            searchOptionsNavBar.classList.add("d-none");
            searchResultsEl.textContent = "";
            searchNavBar.style.border = "none";
            let url = `https://apis.ccbp.in/wiki-search?search=${searchInput}`;
            let loadUrls = async () => {
                try {
                    const response = await fetch(url);
                    const jsonData = await response.json();
                    const { search_results } = jsonData;
                    console.log(jsonData);
                    if (search_results.length == 0) {
                        searchOptionsNavBar.classList.add("d-none");
                        searchNavBar.style.border = "none";
                        alert("No results found");
                    } else {
                        searchNavBar.style.borderBottom = "1px solid #edecec";
                        spinnerEl.classList.remove("d-none");
                        searchOptionsNavBar.classList.remove("d-none");
                        displayResults(search_results);
                    }
                } catch (e) {
                    console.log(`Error occured ${e.message}`);
                }
            };
            loadUrls();
        }
    }
}

searchInputEl.addEventListener("keydown", searchWikipedia);
