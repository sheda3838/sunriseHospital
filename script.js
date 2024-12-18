//Clear cart at the beginning
function clearCart() {
    tbody.innerHTML = "";
    const text = document.getElementById("emptyText");
}

// Initializing cart clearing at page load
window.addEventListener('load', function () {
    clearCart();  
});

// Fetch data from json file
async function getData(){
    const resp = await fetch("./main.json")
    const data = await resp.json();
    return data.products;
}

const addCartBtn = document.querySelectorAll(".add-cart-btn");
const quanInput = document.querySelectorAll(".quantity-input");
const tbody = document.querySelector("table tbody");
const text = document.getElementById("emptyText");

// Add function to add cart button and fill the table
async function addToCart() {
    const data = await getData(); 

    function addItemToCart(index) {
        const quantity = parseInt(quanInput[index].value);

        if (quantity > 0) {
            addCartBtn[index].textContent = "Added to Cart 🛒 ";
            addCartBtn[index].style.backgroundColor = "rgb(76, 134, 215)";
            text.remove(); // Remove empty cart text if present

            const medicine = data[index];
            const category = medicine.category;
            const name = medicine.name;
            const price = medicine.price;
            const total = price * quantity;

            // Check if the medicine is already in the table
            let existingRow = null;
            tbody.querySelectorAll("tr").forEach(function (row) {
                const rowName = row.querySelector(".name")?.innerText;
                if (rowName === name) {
                    existingRow = row;
                }
            });

            if (existingRow) {
                existingRow.remove(); // Remove existing row to update it
            }

            const row = document.createElement("tr");

            const categoryColumn = document.createElement("td");
            categoryColumn.className = "category";
            categoryColumn.innerText = category;

            const nameColumn = document.createElement("td");
            nameColumn.className = "name";
            nameColumn.innerText = name;

            const priceColumn = document.createElement("td");
            priceColumn.className = "price";
            priceColumn.innerText = "Rs. " + price;

            const quantityColumn = document.createElement("td");
            quantityColumn.className = "quantity";
            quantityColumn.innerText = quantity;

            const totalColumn = document.createElement("td");
            totalColumn.className = "total";
            totalColumn.innerText = "Rs. " + (parseFloat(total)).toFixed(2);

            const removeColumn = document.createElement("td");
            const remBtn = document.createElement("p");
            remBtn.innerText = "❌";
            remBtn.style.cursor = "pointer" ;
            remBtn.addEventListener("click", function () {
                row.remove();
                calculateTotalSum();
            });
            removeColumn.appendChild(remBtn);


            row.appendChild(categoryColumn);
            row.appendChild(nameColumn);
            row.appendChild(priceColumn);
            row.appendChild(quantityColumn);
            row.appendChild(totalColumn);
            row.appendChild(removeColumn);

            tbody.appendChild(row);
            calculateTotalSum();

        } else {
            alert("Make sure to enter a valid quantity!!");
        }
    }

    addCartBtn.forEach(function (btn, index) {
        btn.addEventListener("click", function () {
            addItemToCart(index);
        });
    });

    quanInput.forEach(function (input, index) {
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                addItemToCart(index);
            }
        });
    });
}

addToCart();



//Function to clear data 
const clearBtn = document.getElementsByClassName("clear-btn")[0];

function clearData(){
    if (tbody.querySelectorAll("tr").length != 0){
        tbody.innerHTML = "";
        alert ("Cart cleard successfully!!")
        location.reload();
    };
}

clearBtn.addEventListener("click", clearData);

//Function to add favourite
function addFavurite(){

    if (tbody.querySelectorAll("tr").length === 0) {
        alert("Make sure your cart is not empty!!!");
        return; 
    }

    const cartName = prompt("Enter a name for your favorite cart:");
    if (!cartName) {
        alert("Cart name is required to save favorites!");
        return;
    }

    const existingCart = localStorage.getItem(cartName);
    if (existingCart) {
    const overwrite = confirm(`A cart with the name "${cartName}" already exists. Do you want to overwrite it?`);
    if (!overwrite) {
        alert("Save operation canceled. Choose a different name.");
        return;
        }
    }

    const tableData = [];
    
    const rows = tbody.querySelectorAll("tr");

    rows.forEach(function(row) {
        const category = row.querySelector(".category").innerText;
        const name = row.querySelector(".name").innerText;
        const price = row.querySelector(".price").innerText.replace("Rs. ", "").trim();
        const quantity = row.querySelector(".quantity").innerText;
        const total = row.querySelector(".total").innerText.replace("Rs. ", "").trim();

        const rowData = {
            category: category,
            name: name,
            price: price,
            quantity: quantity,
            total: total
        };

        tableData.push(rowData);
    });


    localStorage.setItem(cartName, JSON.stringify(tableData));

    alert("Favorites saved successfully! as " + cartName);
}

const addFavBtn = document.getElementsByClassName("add-fav-btn")[0];
addFavBtn.addEventListener("click", addFavurite);



// Function to apply favorites
const applyFavBtn = document.getElementsByClassName("apply-fav-btn")[0];
applyFavBtn.addEventListener("click", applyFavorites);

function applyFavorites() {
    const cart = prompt("Enter the name of the favorite cart to apply:");

    // Check if cart name is valid and exists in local storage
    if (!cart || !localStorage.getItem(cart)) {
        alert("Invalid cart name! Please select a valid cart.");
        return;
    }

    // Fetching data from local storage
    const favorites = JSON.parse(localStorage.getItem(cart));

    if (!favorites || favorites.length === 0) {
        alert("No items found in the selected favorites!");
        return;
    }
    
    
    tbody.innerHTML = "";

   
    favorites.forEach(function (item) {
        const row = document.createElement("tr");

        const categoryColumn = document.createElement("td");
        categoryColumn.className = "category";
        categoryColumn.innerText = item.category;

        const nameColumn = document.createElement("td");
        nameColumn.className = "name";
        nameColumn.innerText = item.name;

        const priceColumn = document.createElement("td");
        priceColumn.className = "price";
        priceColumn.innerText = "Rs. " + item.price;

        const quantityColumn = document.createElement("td");
        quantityColumn.className = "quantity";
        quantityColumn.innerText = item.quantity;

        const totalColumn = document.createElement("td");
        totalColumn.className = "total";
        totalColumn.innerText = "Rs. " + (parseFloat(item.total)).toFixed(2);

        const removeColumn = document.createElement("td");
        const remBtn = document.createElement("p");
        remBtn.innerText = "❌";
        remBtn.style.cursor = "pointer" ;
        remBtn.addEventListener("click", function () {
            row.remove();
            calculateTotalSum();
        });
        removeColumn.appendChild(remBtn);

        row.appendChild(categoryColumn);
        row.appendChild(nameColumn);
        row.appendChild(priceColumn);
        row.appendChild(quantityColumn);
        row.appendChild(totalColumn);
        row.appendChild(removeColumn);

        tbody.appendChild(row);
        calculateTotalSum();
    });

    alert(`Favorites from "${cart}" applied successfully!`);
}


// Table PoP Up
const modal = document.getElementById("cartModal");
const viewCartBtn = document.querySelector(".view-cart-btn");
const closeModalBtn = document.querySelector(".close-btn");


viewCartBtn.addEventListener("click", function () {
    modal.style.display = "block";
});


closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


// To make the checkout Button linked to form page
const checkBtn = document.getElementsByClassName("checkout-btn")[0];
checkBtn.addEventListener("click", function () {
    const totalSum = calculateTotalSum();  
    
    if (totalSum > 0) {

        localStorage.setItem('totalSum', totalSum);  
            const checkoutConfirm = confirm("Please confirm your items. Changes won’t be allowed on the checkout page!!");

        if (checkoutConfirm){
            const tableData = [];
    
            const rows = tbody.querySelectorAll("tr");
        
            rows.forEach(function(row) {
                const category = row.querySelector(".category").innerText;
                const name = row.querySelector(".name").innerText;
                const price = row.querySelector(".price").innerText.replace("Rs. ", "").trim();
                const quantity = row.querySelector(".quantity").innerText;
                const total = row.querySelector(".total").innerText.replace("Rs. ", "").trim();
        
                const rowData = {
                    category: category,
                    name: name,
                    price: price,
                    quantity: quantity,
                    total: total
                };
        
                tableData.push(rowData);
            });
        
        
            localStorage.setItem("cartName", JSON.stringify(tableData));

            changePage();
        }
        else{
            alert ("Make your changes wisely before proceeding to checkout.")
        }
    } 
    
    else {

        alert("Please add at least one item to your cart before proceeding.");
    }
});

function changePage() {
    window.location.href = "form.html";
}

function calculateTotalSum() {
    let totalSum = 0;
    const rows = tbody.querySelectorAll("tr");

    rows.forEach(function (row) {
        const totalValueText = row.querySelector(".total").innerText;
        const totalValue = parseFloat(totalValueText.replace("Rs. ", "").trim());

        if (!isNaN(totalValue)) {
            totalSum += totalValue;
        } else {
            console.error("Invalid total value:", totalValueText);
            return;
        }
    });

    const subTotaltext = document.getElementById("subtotal");
    subTotaltext.innerText = "Subtotal: Rs. " + totalSum.toFixed(2);
    

    const discountText = document.getElementById("discountText");

    if (totalSum > 10000) discountText.innerText = "A 25% discount will be applied to purchases exceeding Rs. 10 000.";
    else if (totalSum > 7500) discountText.innerText = "A 20% discount will be applied to purchases exceeding Rs. 7500.";
    else if (totalSum > 5000) discountText.innerText = "A 15% discount will be applied to purchases exceeding Rs. 5000.";

    else if (totalSum > 2500) { 
        discountText.innerText = "A 10% discount will be applied to purchases exceeding Rs. 2500.";
    }
    
    else if (totalSum < 2500) {
        discountText.innerText = "No discounts are applied to purchases below Rs. 2500.";
    }

    if (totalSum > 2500) {
        discountText.style.color = "rgb(88, 159, 234)";
        discountText.style.border = "1px solid rgb(87, 190, 221)" ;
    }

    else{
        discountText.style.color = " #d9534f";
        discountText.style.border = "1px solid rgb(229, 76, 76)" ;
    }

    return totalSum.toFixed(2);
}

//Search Bar
const searchBar = document.getElementById("search-bar")

searchBar.addEventListener("input", function() {
    const searchQuery = searchBar.value.toLowerCase();
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(function(card) {
        const productName = card.querySelector("h3").textContent.toLowerCase();

        if (productName.includes(searchQuery) ) {
            card.style.display = "block"; 
        } else {
            card.style.display = "none"; 
        }
    });
});


