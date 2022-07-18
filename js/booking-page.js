const campsiteListURI = "/data/campsite.json"
let nightlyRate = 47.50

let selectedCampsite = ""
let campsiteList = new Array();
let currCampsite = {}

const getCampsiteList = () => {

    fetch(campsiteListURI)
      .then(res => res.json())
      .then(data => {
        for(let i = 0 ;i < data.length ;i++){
            campsiteList.push(data[i])
            console.log(data[i])
        }
        searchBySiteNumber()
       })  
}

const searchBySiteNumber = () => {

    for(let i = 0 ;i < campsiteList.length ;i++) {

        // Check if the campsite passes the filter criteria or not
        if ( parseInt(campsiteList[i].siteNumber) === parseInt(selectedCampsite) ){
            currCampsite = campsiteList[i]
            // set the max limit for number of nights
            setMaxNights()
            displayCampsiteInfo(campsiteList[i])
            break
        }

    }

} 

const setMaxNights = () => {
    document.querySelector("#nights-input").setAttribute("max", parseInt(localStorage.getItem(currCampsite.siteNumber)) );
}

const displayCampsiteInfo = (currCampsiteInfo) => {

    console.log(currCampsiteInfo)

    // 1. Display campsite Info
    let campsiteInfoContainer = document.querySelector("#site-info")

    campsiteInfoContainer.innerHTML = ""

    campsiteInfoContainer.innerHTML += `
        <p class = "subsection-heading">1. site information</p>
        <p class = "site-details">Site: ${currCampsiteInfo.siteNumber}</p>
        <p class = "site-details">Equipment: ${currCampsiteInfo.equipment}</p>
        <div id = "feature-icons"></div>
        <p>Availability: ${localStorage.getItem(currCampsiteInfo.siteNumber)} of 10 days </p>
       
    `

    // 2. Display campsite features with icons
    let featureIconContainer = document.querySelector("#feature-icons")
    console.log(currCampsiteInfo.hasPower)
     // - clear the contents of the results container
     featureIconContainer.innerHTML = ""

     if(currCampsiteInfo.hasPower){
        featureIconContainer.innerHTML += `<i class="bi bi-plug-fill icon-large"></i>`
     }
     if(currCampsiteInfo.isPremium){
        featureIconContainer.innerHTML += `<i class="bi bi-star-fill icon-small"></i> `
     }
     if(!currCampsiteInfo.isRadioFree){
        featureIconContainer.innerHTML += `<i class="bi bi-broadcast-pin icon-large"></i>`
     }

     console.log(featureIconContainer)

}
const validateUserInfo = (name, email) => {

    let isValid = false

    if(name.trim() !== "" && email.trim() !== ""){
        isValid = true
    } else {
        let errorMsgContainer = document.querySelector("#error-msg")

        errorMsgContainer.innerHTML = ""
        errorMsgContainer.innerHTML += `
        <p>Error: Please provide valid values for Name & Email fields</p>`
    }

    return isValid

}
const generateReservationReceipt = (numberOfNights, name, email, cost) => {

    // 1. Adding heading for the reservation section
    let reservationHeadingElement = document.querySelector("#reservation-info")

    reservationHeadingElement.innerHTML = ""

    reservationHeadingElement.innerHTML += `
        <p class = "subsection-heading">2. Reservation details</p>
    `

    // 2. Adding Reservation Receipt Details
    let receiptNumber = Math.floor(1000 + Math.random() * 9000);

    reservationHeadingElement.innerHTML += `

    <div id = "receipt-container">

        <p class = "reservation-heading">Reservation #RES-${receiptNumber}</p>
        <p class = "field-name">Name: <span class = "field-value">${name.toUpperCase()}</span></p>
        <p class = "field-name">Email: <span class = "field-value">${email}</span></p>
        <p class = "field-name">Numuber of Nights: <span class = "field-value">${numberOfNights}</span></p>
        <p class = "field-name">Nightly Rate: <span class = "field-value">$${cost[0]}</span></p>
        <p class = "field-name">Subtotal: <span class = "field-value">$${cost[1]}</span></p>
        <p class = "field-name">Tax: <span class = "field-value">$${cost[2]}</span></p>
        <p class = "field-name">Total: <span class = "field-value">$${cost[3]}</span></p>

    </div> 

               
    `

    document.querySelector("#receipt-container").classList.add("reservation-receipt")

     // 3. Remove the guest-info section 
     document.querySelector("#guest-info").remove()
    

}
const calculateCost = (numberOfNights) => {

    let cost = new Array()

    if(currCampsite.isPremium || currCampsite.hasPower){

        if(currCampsite.isPremium && currCampsite.hasPower){
            nightlyRate = (nightlyRate*1.2) + 5
        } else{
            if(currCampsite.isPremium){
                nightlyRate = nightlyRate + (nightlyRate*0.2)

            } else if(currCampsite.hasPower){
                nightlyRate = nightlyRate + 5

            }
        }
    }
    console.log(`nightlyRate: ${nightlyRate}`)
    cost.push(nightlyRate)

    let subTotal = numberOfNights*nightlyRate
    cost.push(subTotal)

    let tax = 0.13 * subTotal
    cost.push(tax)

    let total = subTotal + tax
    cost.push(total)

    return cost
   

}
const removeFiltersFromLocalstorage = () => {
    console.log("removeFiltersFromLocalstorage() called")

    let EQUIPMENT_FILTER_KEY = "equipmentFilter"
    let NIGHT_FILTER_KEY = "nightFilter"

    if (localStorage.hasOwnProperty(EQUIPMENT_FILTER_KEY) === true){
        // Remove the equipment filter key-value(pair) from local storage
        localStorage.removeItem(EQUIPMENT_FILTER_KEY); 
    }
    if (localStorage.hasOwnProperty(NIGHT_FILTER_KEY) === true){
        // Remove the night filter key-value(pair) from local storage
        localStorage.removeItem(NIGHT_FILTER_KEY); 
    }
}

const reserveButtonClicked = () => {
    console.log("reserveButtonClicked ---> generating a user-specific reservation receipt")

    // 1. Get the no.of nights, name, email from the input

    let numberOfNights = document.querySelector("#nights-input").value
    console.log(numberOfNights)
    
    let username = document.querySelector("#name").value
    console.log(username)

    let useremail = document.querySelector("#email").value
    console.log(useremail)

    if(validateUserInfo(username, useremail)){
        let cost = calculateCost(numberOfNights)
        generateReservationReceipt(numberOfNights, username, useremail, cost)

        // Update the nights availability for reserved campsite
        let currAvailability = localStorage.getItem(currCampsite.siteNumber)
        let updatedAvailability = parseInt(currAvailability) - parseInt(numberOfNights)
        localStorage.setItem(currCampsite.siteNumber, updatedAvailability);

    } else{
        console.log("user provided invalid inputs")
    }
}

const pageLoaded = () => {

    // 1. Get the siteNumber from the query string
    const queryString = location.search;
    console.log(`Query String : ${queryString}`);

    selectedCampsite = queryString.substring(queryString.indexOf("=")+1);
    console.log(`Selected site number : ${selectedCampsite}`);

    // 2. Remove the equipments & nights filters from the localstorage
    removeFiltersFromLocalstorage()


    // 3. Fetch & Display the details of the corrosponding campsite
    getCampsiteList()

    // 4. Highlight current page in the navigation bar
    let naviagtionBarElements = document.querySelectorAll(".navigation-indicator")
    let navLinks = document.querySelectorAll("#nav-links")

    naviagtionBarElements[1].classList.add("active-page")
    navLinks[1].classList.add("active-link")

    
}

// listener for the pageload
document.addEventListener("DOMContentLoaded", pageLoaded)

// listener for the reserve button
document.querySelector("#reserve-button").addEventListener("click", reserveButtonClicked)

