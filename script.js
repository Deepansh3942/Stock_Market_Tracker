document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('live-stocks')) initializeLiveStocks();
    if (document.getElementById('cart-items')) displayCart();
    if (document.getElementById('from-currency')) initializeCurrencyConverter();
    if (document.getElementById('calculate-btn')) {
        document.getElementById('calculate-btn').addEventListener("click", calculateCompoundInterest);
    }
});

/*          LIVE STOCKS          */
const stocks = [
    { name: "Reliance Industries", price: 2500 },
    { name: "Tata Consultancy", price: 3800 },
    { name: "HDFC Bank", price: 1600 },
    { name: "Infosys", price: 1500 },
    { name: "ICICI Bank", price: 950 },
    { name: "Larsen & Toubro", price: 2900 },
    { name: "Bajaj Finance", price: 7100 },
    { name: "Maruti Suzuki", price: 9800 },
    { name: "Tata Motors", price: 680 },
    { name: "Wipro", price: 450 },
    { name: "Adani Enterprises", price: 800 },
    { name: "Hindustan Unilever", price: 690 }
];

function initializeLiveStocks() {
    let stockContainer = document.getElementById("live-stocks");

    if (!stockContainer) {
        console.error("Stock container not found!");
        return;
    }

    stockContainer.innerHTML = ""; // to clear previous data

    stocks.forEach(stock => {
        let stockElement = document.createElement("div");
        stockElement.classList.add("stock-item");
        stockElement.innerHTML = `
            <p><strong>${stock.name}</strong> - ₹${stock.price}</p>
            <button onclick="addToCart('${stock.name}', ${stock.price})">Add to Cart</button>
        `;
        stockContainer.appendChild(stockElement);
    });

    console.log("✅ Live stocks loaded successfully.");
}

/*         ADD TO CART           */
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));

    // Show pop-up message
    let popup = document.createElement("div");
    popup.classList.add("popup-message");
    popup.innerText = "Added to Cart!";
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 1500);

    displayCart(); // Refresh cart
}


/*     CURRENCY CONVERTER        */
const currencies = [
    "USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD", "CNY", "CHF", "SGD",
    "HKD", "NZD", "KRW", "BRL", "ZAR", "RUB", "MXN", "MYR", "IDR", "THB"
];

function initializeCurrencyConverter() {
    let fromDropdown = document.getElementById("from-currency");
    let toDropdown = document.getElementById("to-currency");

    currencies.forEach(currency => {
        let option1 = document.createElement("option");
        let option2 = document.createElement("option");
        option1.value = option2.value = currency;
        option1.textContent = option2.textContent = currency;
        fromDropdown.appendChild(option1);
        toDropdown.appendChild(option2);
    });

    fromDropdown.value = "USD";
    toDropdown.value = "INR";

    document.getElementById("convert-btn").addEventListener("click", convertCurrency);
}

async function convertCurrency() {
    let amount = parseFloat(document.getElementById("amount").value);
    let fromCurrency = document.getElementById("from-currency").value;
    let toCurrency = document.getElementById("to-currency").value;
    let resultDisplay = document.getElementById("conversion-result");

    if (isNaN(amount) || amount <= 0) {
        resultDisplay.innerText = "Please enter a valid amount.";
        return;
    }

    let url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        let rate = data.rates[toCurrency];

        if (rate) {
            let convertedAmount = (amount * rate).toFixed(2);
            resultDisplay.innerHTML = `<strong>${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}</strong>`;
        } else {
            resultDisplay.innerText = "Conversion rate not available.";
        }
    } catch (error) {
        resultDisplay.innerText = "Error fetching exchange rates.";
    }
}

/*  COMPOUND INTEREST CALCULATOR */
function calculateCompoundInterest() {
    let principal = parseFloat(document.getElementById("principal").value);
    let rate = parseFloat(document.getElementById("rate").value);
    let time = parseFloat(document.getElementById("time").value);
    let frequency = parseInt(document.getElementById("frequency").value);
    let resultDisplay = document.getElementById("interest-result");

    if (isNaN(principal) || principal <= 0 || isNaN(rate) || rate <= 0 || isNaN(time) || time <= 0 || isNaN(frequency) || frequency <= 0) {
        resultDisplay.innerText = "Please enter valid numbers for all fields.";
        return;
    }

    let r = rate / 100;
    let amount = principal * Math.pow(1 + (r / frequency), frequency * time);
    let interest = (amount - principal).toFixed(2);

    resultDisplay.innerHTML = `<strong>Interest Earned: ₹${interest}</strong><br>Total Amount: ₹${amount.toFixed(2)}`;
}
