/**********************************************************
 * Helper functions and variables
 *********************************************************/
let getID = (id) => {
    return document.getElementById(id);
}

/* Returns the data from url and a function */
let fetchData = async (url, func) => {
    let res = await fetch(url);
    let data = await res.json();

    return func(data);
}

/* Returns the path to the file */
let getURL = (fileName) => {
    return `./data/${fileName}.json`;
}

// Variables 
let cardDisplayGrid = getID("card-display");
let resourceCardDisplayGrid = getID("resource-display");
let sidebar = getID("sidebar");

/*********************************************************** 
 * Render the sidebar and links onto the screen  
 * ********************************************************/

// Dynamically create the links and titles for the sidebar
let createSidebarContent = (data) => {
    let output = ""; 

    for(let i = 0; i < Object.keys(data).length; i++) {
        // Loop through the data and display the titles
        output += `
            <div class="sidebar-section">
                <h2>${Object.values(data)[i][0].title}</h2>
                <hr class="sidebar-hr">
        `;

        // Loop through the data and display the parent links
        for(let k = 0; k < Object.values(data)[i][0].links.length; k++) {
            output += `
                <div class="sidebar-nav">
                    <div class="sidebar-link accordion">
                        <span class="material-symbols-outlined">
                            ${Object.values(data)[i][0].links[k].icon}
                        </span>

                        <a href="${Object.values(data)[i][0].links[k].link}" id="${Object.values(data)[i][0].links[k].label}" target="_blank"><p>${Object.values(data)[i][0].links[k].label}</p></a>
                `;

                // If a sub link exists, add it underneath its parent link
                if (Object.values(data)[i][0].links[k].subcategories) {
                    output += `
                        <span class='see-more-plus-icon'>+</span>
                    
                        </div>
                        
                        <ul class="sub-categories panel">`;

                        for(let sc = 0; sc < Object.values(data)[i][0].links[k].subcategories.length; sc++) {
                            output += `
                                <li><a href="${Object.values(data)[i][0].links[k].subcategories[sc].subcatLink}" target="_blank">${Object.values(data)[i][0].links[k].subcategories[sc].subcatName}</a></li>
                            `;
                        }
                        
                        output += `</ul> </div>`;
                } else {
                    output += `
                        </div> </div>`;
                }   
            }  
            output += `</div>`;
        }
        output += `
        <div class="collapse-circle-tip">
            <span class="material-symbols-outlined collapse-circle" aria-placeholder="Collapse sidebar">
                arrow_circle_left
            </span>

            <span class="collapse-circle-tip-text">Collapse Sidebar</span>
        </div>

        <p class="current-date">Content Current as of <span id="footer-date"></span></p>
    `;
    
    sidebar.innerHTML = output;
}

// Change the open and close icons on the side
let togglePlusMinus = () => {
    let pluses = document.querySelectorAll(".see-more-plus-icon");

    pluses.forEach(plus => {
        plus.addEventListener("click", (e) => {
            if(e.target.innerHTML === "+") {
                e.target.innerHTML = "-";
            } else {
                e.target.innerHTML = "+";
            }
        })
    })
}

let createAccordionPanels = () => {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
        panel.style.display = "none";
        } else {
        panel.style.display = "block";
        }
    });
    }
}

/***********************************************************
 * Set the color and name of the card tags and render them
 * ********************************************************/

// Get the data attribute of each card
let getCardAttribute = (cardAttr) => {
    let cardType = cardAttr.getAttribute("data-category-type");

    return cardType;
}

// Set the color and title for each card tag
let setTagColor = () => {
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        if (getCardAttribute(card) == "GP") {
            card.lastElementChild.lastElementChild.style.background = "#FF8080";
            card.lastElementChild.lastElementChild.innerHTML = "Guides & Processes";
        } else if (getCardAttribute(card) == "Internal") {
            card.lastElementChild.lastElementChild.style.background = "#A0CCED";
            card.lastElementChild.lastElementChild.innerHTML = "Internal";
        } else if (getCardAttribute(card) == "Resources") {
            card.lastElementChild.lastElementChild.style.background = "#55C998";
            card.lastElementChild.lastElementChild.innerHTML = "Resources";
        } else {
            card.lastElementChild.lastElementChild.style.background = "#fff";
            card.lastElementChild.lastElementChild.innerHTML = "Other";
        }
    })
}

// Create and display a new card for each object in cardInfo
let createCard = (data) => {
    let output = ""; 

    for(let i = 0; i < data.cards.length; i++) {
        output += `
            <div class="card" data-category-type="${data.cards[i].category}">
                <div class="card-img">
                    <img src="${data.cards[i].image}" width="200px" height="100px">
                </div>

                <div class="card-info">
                    <p class="card-info-title">${data.cards[i].title}</p>
                    <p class="card-info-tag"></p>
                </div>
            </div>
        `;
    }
    
    cardDisplayGrid.innerHTML = output;
}

let createResourceCard = (data) => {
    let output = ""; 

    for(let i = 0; i < data.resources.length; i++) {
        output += `
            <div class="card" data-category-type="${data.resources[i].category}">
                <!--<div class="resource-img">
                    <img src="${data.resources[i].image}" width="150px" height="75px">
                </div>-->

                <div class="resource-info">
                    <p class="resource-info-title">${data.resources[i].name}</p>
                    <p class="resource-info-tag"></p>
                </div>
            </div>
        `;
    }
    
    resourceCardDisplayGrid.innerHTML = output;
}

/***********************************************************
 * Function Calls
 **********************************************************/

// Run the createSidebarContent function using the sidebarInfo data file
fetchData(getURL("sidebarInfo"), createSidebarContent);

// Run the createCard function using the data from the cardInfo data file
fetchData(getURL("cardInfo"), createCard);

// Run the createResourceCard function using the data from the resources data file
fetchData(getURL("resources"), createResourceCard);

// Run this function after the cards have had time to render on the page
setTimeout(setTagColor, 500);

// Run this function when the plus sign is clicked beside each link
setTimeout(createAccordionPanels, 500);

// Toggle the open and close icons 
setTimeout(togglePlusMinus, 500);

let getDate = () => {
    const d = new Date();
    let date = d.toDateString().substr(4);
    document.getElementById("footer-date").innerHTML = date;
}

setTimeout(getDate, 500);