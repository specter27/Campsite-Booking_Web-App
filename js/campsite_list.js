const campSiteListURI = "/data/campsite.json"
const equipmentsFilter = ["Show All","Single Tent", "3 Tents", "Trailer upto 18ft"]
const nightFilter = ["Show All","1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
const defaultAvailability = 10;
let campSiteList = new Array();
let filteredCampsiteList = new Array();

let filteredListBySelectedEquipment = new Array();

let selectedEquipmentFilter = ""
let selectedNightFilter = ""

let isFilterCriteriaAvailable = false

class Campsite{
    constructor(siteNumber, equipment, hasPower, isPremium, isRadioFree, availability, image){
        this.siteNumber = siteNumber;
        this.equipment = equipment;
        this.hasPower = hasPower;
        this.isPremium = isPremium;
        this.isRadioFree = isRadioFree;
        this.availability = availability;
        this.image = image
    }

    toString(){
        return `siteNumber : ${this.siteNumber} equipment : ${this.equipment} image : ${this.image}`;
    }
}

const populateFilters = () => {

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

const populateCampSiteList = () => {

    fetch(campSiteListURI)
      .then(res => res.json())
      .then(data => {
        for(let i = 0 ;i < data.length ;i++){
            // let currCampSite = new Campsite(data[i].siteNumber, data[i].equipment,
            //      data[i].hasPower, data[i].isPremium, data[i].isRadioFree, data[i].availability, data[i].image)

            campSiteList.push(data[i])
        }

        // 1. Set default availability for the campsites 
        addAvailabilityInLocalStorage()

        // 2. Display the camplist 
        if(isFilterCriteriaAvailable){
            getFilteredCamsiteList()
            console.log("getFilteredCamsiteList()")

        } else{
            console.log("displayCampsiteList()")
            displayCampsiteList(campSiteList)
        }
        
       })   
}

const addAvailabilityInLocalStorage = () => {

    for(let i = 0 ;i < campSiteList.length ;i++){
        if (localStorage.hasOwnProperty(campSiteList[i].siteNumber) === false){

            // Adding the default availability(10 days) for every site in the campSiteList
            localStorage.setItem(campSiteList[i].siteNumber, defaultAvailability);
        }
    }

}


const getFilteredCamsiteList = () => {

    // Clear the filtered list 
    filteredListBySelectedEquipment.splice(0, filteredListBySelectedEquipment.length)

    // filtering by selectedEquipmentFilter
    for(let i = 0 ;i < campSiteList.length ;i++) {

        // Check if the campsite passes the filter criteria or not
        if ( campSiteList[i].equipment.includes(selectedEquipmentFilter) || selectedEquipmentFilter === "Show All" ){
            filteredListBySelectedEquipment.push(campSiteList[i])
        }

    }

     // Clear the filtered list 
     filteredCampsiteList.splice(0, filteredCampsiteList.length)

    // filtering by selectedNightFilter
    for(let i = 0 ;i < filteredListBySelectedEquipment.length ;i++) {

        // - Get the availability for the campsite from the browser localStorage
        currCampsiteAvailability = localStorage.getItem(filteredListBySelectedEquipment[i].siteNumber)

       // Check if the campsite passes the filter criteria or not
       if ( parseInt(selectedNightFilter) <= parseInt(currCampsiteAvailability) || selectedNightFilter === "Show All" ){
            filteredCampsiteList.push(filteredListBySelectedEquipment[i])
       }

   }

    // Update the CampList UI
    displayCampsiteList(filteredCampsiteList)
    

    

}

const displayCampsiteList = (campSiteList) => {
    
    let listContainerElement = document.querySelector("#campsite-list")

    // - clear the contents of the results container
    listContainerElement.innerHTML = ""
    
    for(let i = 0 ;i < campSiteList.length ;i++){

        listContainerElement.innerHTML += ` 
        <div class = "campsite-card">
            <img src=${campSiteList[i].image}>
            <div class = "campsite-details">

                <p class = "campsite-number">Site ${campSiteList[i].siteNumber}</p>
                <p>Equipment: ${campSiteList[i].equipment}</p>

                <p class = "campsite-availability-header">availability:
                    <span class = "campsite-availability">${localStorage.getItem(campSiteList[i].siteNumber)} OF 10 DAYS</span>
                </p>
                <div id = "availability-icons"></div>    
                <p class = "campsite-features">site features</p>
                <div id = "feature-icons"></div>

            </div> 
            <button data-site-no="${campSiteList[i].siteNumber}">Book Site</button>
         </div>
`   
}
    // console.log(listContainerElement)
    displayAvailabilityIcon(campSiteList)
    displayFeatureIcon(campSiteList)
}

const displayAvailabilityIcon = (campSiteList) => {

    let availabilityIconContainers = document.querySelectorAll("#availability-icons")

    for(let i = 0 ;i < campSiteList.length ;i++){

        // - Get the availability for the campsite from the browser localStorage
        currCampsiteAvailability = localStorage.getItem(campSiteList[i].siteNumber)

        // - clear the contents of the availabilityIconContainers
        availabilityIconContainers[i].innerHTML = ""

        for (let j = 0; j < 10; j++) {
            if(j < parseInt(currCampsiteAvailability)){
                availabilityIconContainers[i].innerHTML += ` <i class="bi bi-check-circle open"></i>`
            } else{
                availabilityIconContainers[i].innerHTML += ` <i class="bi bi-dash-circle closed"></i>`
            }
        }

    }
}

const displayFeatureIcon = (campSiteList) => {
    let featureIconContainers = document.querySelectorAll("#feature-icons")
    
    for(let i = 0 ;i < campSiteList.length ;i++) {

        // - clear the contents of the results container
        featureIconContainers[i].innerHTML = ""

            if(campSiteList[i].hasPower){
                featureIconContainers[i].innerHTML += `<i class="bi bi-plug-fill icon-large"></i>`
            }
            if(campSiteList[i].isPremium){
                featureIconContainers[i].innerHTML += `<i class="bi bi-star-fill icon-small"></i> `
            }
            if(!campSiteList[i].isRadioFree){
                featureIconContainers[i].innerHTML += `<i class="bi bi-broadcast-pin icon-large"></i>`
            }
    }
}


const filterListByEquipment = (event) => {

    console.log("filterListByEquipment: "+event.target.value)

    // Clear the filtered list 
    filteredCampsiteList.splice(0, filteredCampsiteList.length)

    for(let i = 0 ;i < campSiteList.length ;i++) {

        // Check if the campsite passes the filter criteria or not
        if (campSiteList[i].equipment.includes(event.target.value) || event.target.value === "Show All"){
            filteredCampsiteList.push(campSiteList[i])
        }

    }

    // Update the CampList UI
    displayCampsiteList(filteredCampsiteList)
    
}

const filterListByNights = (event) => {

    console.log("filterListByNights: "+event.target.value)

     // Clear the filtered list 
     filteredCampsiteList.splice(0, filteredCampsiteList.length)

    for(let i = 0 ;i < campSiteList.length ;i++) {

         // - Get the availability for the campsite from the browser localStorage
         currCampsiteAvailability = localStorage.getItem(campSiteList[i].siteNumber)

        // Check if the campsite passes the filter criteria or not
        if ( parseInt(event.target.value) <= parseInt(currCampsiteAvailability) || event.target.value === "Show All" ){
            filteredCampsiteList.push(campSiteList[i])
        }

    }

    // Update the CampList UI
    displayCampsiteList(filteredCampsiteList)

}

const campsiteListClicked = (evt) => {

    const elementClicked = evt.target
    if (elementClicked.tagName === "BUTTON") {
        console.log("Book Site Button clicked")
        const siteNumber = elementClicked.getAttribute("data-site-no")
        console.log(siteNumber)
        
        // - find the position of the site in the array(campSiteList)        
        let pos = -1
        for (let i = 0; i < campSiteList.length; i++) {
            if (parseInt(campSiteList[i].siteNumber) === parseInt(siteNumber)) {
                // Redirect to the booking page
                window.location.href = `booking-page.html?site=${siteNumber}`

                // found a result so no need to continue searching
                break
            }
        }
        if (pos === -1) {
            // Could not find the id
            console.log("Could not find the position of the id")
            return
        }
    }

}

const setSelectElement = (id, valueToSelect, filterType) => {    
    console.log("updating the filter value")
    let selectElement = document.getElementById(id);
    let indexOfValue = 0

    if(filterType === "equipment"){

        indexOfValue = equipmentsFilter.indexOf(valueToSelect.toString())
        console.log(`equipment filter value provided by user:${equipmentsFilter[indexOfValue]}`)
       
    } else{
       
        indexOfValue = nightFilter.indexOf(valueToSelect.toString())
        console.log(`equipment filter value provided by user:${equipmentsFilter[indexOfValue]}`)

    } 
     // setting the select option for the filter in UI
    selectElement.options[indexOfValue].selected = true
}

const pageLoaded = () => {

     // 1. Get the search or filter criteria from the local storage
     if(localStorage.hasOwnProperty("equipmentFilter") === true && localStorage.hasOwnProperty("nightFilter") === true){

        selectedEquipmentFilter = localStorage.getItem("equipmentFilter")
        selectedNightFilter = localStorage.getItem("nightFilter")

        // update isFilterCriteriaAvailable
        isFilterCriteriaAvailable = true

     } else{

        // If the user arrives by directly typing the page url or using the navigation bar link
        console.log("No filter selected by the user")
        selectedEquipmentFilter = "Show All"
        selectedNightFilter = "Show All"

     }

    // 2. populate the intial campsite list from the json file
    populateCampSiteList()

    // 3. populate the filters option for the equipment & night filters
    populateFilters()

    // 4. Make the highlight current page in the navigation bar
    let naviagtionBarElements = document.querySelectorAll(".navigation-indicator")
    let navLinks = document.querySelectorAll("#nav-links")
  
    naviagtionBarElements[0].classList.add("active-page")
    navLinks[0].classList.add("active-link")

     // 5. set equipment & night filter options
     setSelectElement("equipment-filter", selectedEquipmentFilter, "equipment")
     setSelectElement("nights-filter", selectedNightFilter, "night")
    
}

// listener for the pageload
document.addEventListener("DOMContentLoaded", pageLoaded)

// listener for the equipment filter
document.querySelector("#equipment-filter").addEventListener("change", filterListByEquipment)

// listener for the nights filter
document.querySelector("#nights-filter").addEventListener("change", filterListByNights)

// listener for the book-site button
document.querySelector("#campsite-list").addEventListener("click", campsiteListClicked)
