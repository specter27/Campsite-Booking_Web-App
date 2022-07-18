const equipmentsFilter = ["Show All","Single Tent", "3 Tents", "Trailer upto 18ft"]
const nightFilter = ["Show All","1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

let selectedFilterForNight = "Show All"
let selectedFilterForEquipments = "Show All"

const populateFilters = () => {
    console.log("loading filters")

    // 1. populating the options for the equipment filter
    let equipmentFilterContainer = document.querySelector("#equipment-filter")

    // - clear the contents of the container
    equipmentFilterContainer.innerHTML = ""
    
    for(let i = 0 ;i < equipmentsFilter.length ;i++){

        equipmentFilterContainer.innerHTML += ` 
            <option>${equipmentsFilter[i]}</option>
        `

    }

    // 2. populating the options for the nights filter
    let nightsFilterContainer = document.querySelector("#nights-filter")

    // - clear the contents of the container
    nightsFilterContainer.innerHTML = ""
    
    for(let i = 0 ;i < nightFilter.length ;i++){

        nightsFilterContainer.innerHTML += ` 
            <option>${nightFilter[i]}</option>
        `
    }
    
}

const filterListByEquipment = (event) => {

    console.log("filterListByEquipment: "+event.target.value)

     // Update the value for the selectedFilterForEquipments
     selectedFilterForEquipments = event.target.value
}

const filterListByNights = (event) => {

    console.log("filterListByNights: "+event.target.value)

     // Update the value for the selectedFilterForNight
     selectedFilterForNight = event.target.value
}


const reserveButtonClicked = () => {
    console.log("reserveButtonClicked ---> redirecting to the campsite-list page")

    // 1. Update the filters in the local storage
    localStorage.setItem("equipmentFilter", selectedFilterForEquipments);
    localStorage.setItem("nightFilter", selectedFilterForNight);

    // 2. Redirecting user to the campsite_list-page.html
    /* if back tracking is not required use the replace() */
    // window.location.replace(`campsite_list-page.html`)
    window.location.href = `campsite_list-page.html`
    
}

const pageLoaded = () => {
    // 1. populate the filters option for the equipment & night filters
    populateFilters()
}

// listener for the pageload
document.addEventListener("DOMContentLoaded", pageLoaded)

// listener for the equipment filter
document.querySelector("#equipment-filter").addEventListener("change", filterListByEquipment)

// listener for the nights filter
document.querySelector("#nights-filter").addEventListener("change", filterListByNights)

// listener for the reserve button
document.querySelector("#reserve-button").addEventListener("click", reserveButtonClicked)