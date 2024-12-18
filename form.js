
// Track the total and subtotal
const total = parseFloat(localStorage.getItem("totalSum"));
let subTotal = total;
let lastDeliveryAmount = 0;

// Add the "Original Price"
function addTotal() {
    const totalText = document.getElementById("original-price");
    totalText.innerHTML = "Original Price:   Rs. " + total.toFixed(2);
    displaySubTotal();
}

addTotal();

// Calculate Discount
function applyDiscount() {
    let discount = 0;

    if (total > 10000) discount = 0.25;
    else if (total > 7500) discount = 0.20;
    else if (total > 5000) discount = 0.15;
    else if (total > 2500) discount = 0.10;

    const discountAmount = total * discount;
    const discountText = document.getElementById("discount-price");
    discountText.innerHTML = "Discount Amount:   Rs. " + discountAmount.toFixed(2);

    subTotal = total - discountAmount; // Apply discount
    displaySubTotal();
}

applyDiscount();

// Handle Delivery Method

const deliveryMethodDropdown = document.getElementById("delivery-method");
const deliveryContainer = document.querySelector(".delivery-container");
const deliveryAmount = document.getElementById("deliver-price");
const deliveryOptions = document.querySelectorAll("input[name='deliver-option']");

deliveryMethodDropdown.addEventListener("change", function () {
    if (deliveryMethodDropdown.value === "delivery") {
        deliveryContainer.style.display = "block";
        subTotal = total; 
        applyDiscount(); 
    } else {
        deliveryContainer.style.display = "none";
        deliveryAmount.innerText = "";
        lastDeliveryAmount = 0;
        subTotal = total; 
        applyDiscount(); 
    }
});

let DELAMOUNT = 0; // Declare it globally with let
let DELCHECKED = false;

// Calculate Delivery Amount
function calDelAmount() {
    let delAmount = 0;
    let isAnyDeliveryOptionChecked = false;

    deliveryOptions.forEach(delivery => {
        if (delivery.checked) {
            delAmount = parseFloat(delivery.value);
            isAnyDeliveryOptionChecked = true;
        }
    });

    if (isAnyDeliveryOptionChecked) {
        // Subtract the last applied delivery amount
        subTotal -= lastDeliveryAmount;

        // Add the new delivery amount
        subTotal += delAmount;

        // Update the last applied delivery amount
        lastDeliveryAmount = delAmount;

        deliveryAmount.innerText = "Delivery: Rs. " + delAmount.toFixed(2);
    } else {
        deliveryAmount.innerText = ""; // Clear delivery text
        subTotal -= lastDeliveryAmount; // Remove the last delivery amount
        lastDeliveryAmount = 0; // Reset the last delivery amount
        resetSubTotal(); // Reset subtotal
        return;
    }


    displaySubTotal();
    DELAMOUNT = delAmount; // Update global variables
    DELCHECKED = isAnyDeliveryOptionChecked;

    return { delAmount, isAnyDeliveryOptionChecked };
}

// Add event listener to delivery options
deliveryOptions.forEach(option => option.addEventListener("change", calDelAmount));

// Display Subtotal
function displaySubTotal() {
    let subTotalText = document.getElementById("subtotal-text");

    // Create element if it doesn't exist
    if (!subTotalText) {
        subTotalText = document.createElement("p");
        subTotalText.id = "subtotal-text";
        subTotalText.style.fontWeight = "bolder";
        subTotalText.style.fontSize = "17px";
        subTotalText.style.color = "Red";
        document.querySelector(".details-container").appendChild(subTotalText);
    }

    subTotalText.innerText = "Sub Total: Rs.  " + subTotal.toFixed(2);
}

// Reset Subtotal
function resetSubTotal() {
    subTotal = total; // Reset to total
    lastDeliveryAmount = 0; // Reset the last delivery amount
    applyDiscount(); // Apply discount again
}


// Payment Method Handling (Toggling payment method details)
const paymentMethods = document.getElementsByName("payment-method");
const cardDetails = document.getElementById("card-details");
const bankDetails = document.getElementById("bank-details");
const insuranceDetails = document.getElementById("insurance-details");

function handlePaymentMethodChange() {
    // Hide all details sections first
    cardDetails.style.display = "none";
    bankDetails.style.display = "none";
    insuranceDetails.style.display = "none";

    // Show the relevant details based on the selected payment method
    paymentMethods.forEach(method => {
        if (method.checked) {
            if (method.value === "card") {
                cardDetails.style.display = "block";
            } else if (method.value === "deposits") {
                bankDetails.style.display = "block";
            } else if (method.value === "insurance") {
                insuranceDetails.style.display = "block";
            }
        }
    });
}

// Add event listeners for payment method changes
paymentMethods.forEach(method => method.addEventListener("change", handlePaymentMethodChange));

handlePaymentMethodChange();


const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const citySelect = document.getElementById("city");
const streetInput = document.getElementById("street");
const houseNumberInput = document.getElementById("house-number");
const paymentMethodInputs = document.querySelectorAll("input[name='payment-method']");
const subBtn = document.getElementById("submit-btn");

subBtn.addEventListener("click", validation);


function validation(event) {
    event.preventDefault();
    const errorMessages = []; // Reset error messages at the start

    // Validate Name
    if (nameInput.value == "") {
        errorMessages.push("Customer Name is missing!!");
    }

    // Validate Phone Number
    if (!phoneInput.value){
        errorMessages.push("Phone number is missing!!");
    }

    else if (phoneInput.value.length !== 10) {
        errorMessages.push("Phone number must be exactly 10 digits!!");
    }

    //Validat Gmail
    if (!emailInput.value){
        errorMessages.push("Gmail is missing");
    }

    else if (!emailInput.value.includes('@gmail.com')){
        errorMessages.push("Invalid Email Address!!");
    }

    // Validate City
    if (!citySelect.value) {
        errorMessages.push("City is missing!!");
    }

    // Validate Street
    if (streetInput.value == "") {
        errorMessages.push("Street is missing!!");
    }

    // Validate House Number
    if (houseNumberInput.value == "") {
        errorMessages.push("House number is missing!!");
    }

    else if (!/\d/.test(houseNumberInput.value)){
        errorMessages.push("Invalid House number!!");
    }

    // Validate Delivery Method
    if (!deliveryMethodDropdown.value) {
        errorMessages.push("Delivery method is missing!!");
    }

    // Validate Payment Method
    let paymentMethodSelected = false; 
    let selectedPaymentMethod = ""; 
    
    for (let i = 0; i < paymentMethodInputs.length; i++) {
        const input = paymentMethodInputs[i]; 
    
        if (input.checked) {
            paymentMethodSelected = true; 
            selectedPaymentMethod = input.value; 
            break; 
        }
    }
    
    if (!paymentMethodSelected) {
        errorMessages.push("Payment method is missing!!");
    } else {
        if (selectedPaymentMethod === "card") {
            const cardNumberInput = document.getElementById("card-number");
            const cvvInput = document.getElementById("cvv");
    
            if (!cardNumberInput.value) {
                errorMessages.push("Card number is missing!!");
            }

            else if (cardNumberInput.value.length !== 16 ){
                errorMessages.push("Card number is invalid!! Must be atleast 16 characters");
            }
    
            if (!cvvInput.value ) {
                errorMessages.push("CVV is missing!!");
            }
            else if (cvvInput.value.length !== 3 ){
                errorMessages.push("CVV is invalid!! Must be atleast 3 characters!!");
            }
        } else if (selectedPaymentMethod === "deposits") {
            const referenceNumberInput = document.getElementById("reference-number");
    
            if (!referenceNumberInput.value ) {
                errorMessages.push("Reference number is missing!!");
            }
        } else if (selectedPaymentMethod === "insurance") {
            const policyNumberInput = document.getElementById("policy-number");
            const insurerNameInput = document.getElementById("insurer-name");
    
            
            if (!policyNumberInput.value) {
                errorMessages.push("Policy number is missing!");
            }
    
            
            if (!insurerNameInput.value) {
                errorMessages.push("Insurer name is missing!");
            }
        }
    }
    
        
    if (errorMessages.length > 0) {
        alert("Form submission failed for the following reasons:\n\n" + errorMessages.join("\n"));
        return;
    } 
    
    else if (!DELCHECKED) {
        localStorage.setItem("finalImage", "Images/Pickupicon.jpg");
        localStorage.setItem("finalText", "Your order will be prepared and ready for collection by tomorrow at SUNRISE HOSPITAL.");
        window.location.href = "final.html";

    } else if (DELCHECKED && DELAMOUNT > 700) {
        localStorage.setItem("finalImage", "Images/ExpressDelivery.jpg");
        localStorage.setItem("finalText", "Your order will be delivered to No. "+ houseNumberInput.value + ", " + streetInput.value + ", " + citySelect.value +   " in 3 days.");
        window.location.href = "final.html";

    } else if (DELCHECKED && DELAMOUNT <= 700) {
        localStorage.setItem("finalImage", "Images/standard.jpg");
        localStorage.setItem("finalText", "Your order will be delivered to No. "+ houseNumberInput.value + ", " + streetInput.value + ", " + citySelect.value +   " in 5 days.");
        window.location.href = "final.html";
    }
    
}


window.addEventListener('load', function() {
    const cartData = JSON.parse(localStorage.getItem("cartName"));
    const cartTableBody = document.getElementById("cartBody");

    if (cartData && cartData.length > 0) {

        cartData.forEach(function(item) {
            const row = document.createElement("tr");

            const categoryCell = document.createElement("td");
            categoryCell.innerText = item.category;

            const nameCell = document.createElement("td");
            nameCell.innerText = item.name;

            const priceCell = document.createElement("td");
            priceCell.innerText = "Rs. " + item.price;

            const quantityCell = document.createElement("td");
            quantityCell.innerText = item.quantity;

            const totalCell = document.createElement("td");
            totalCell.innerText = "Rs. " + item.total;

            row.appendChild(categoryCell);
            row.appendChild(nameCell);
            row.appendChild(priceCell);
            row.appendChild(quantityCell);
            row.appendChild(totalCell);

            cartTableBody.appendChild(row);
        });

    } else {
        alert("Your cart is empty.");
    }
});
