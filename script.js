const CURRENCIES = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' }
];

// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertedAmount = document.getElementById('converted-amount');
const amountText = document.getElementById('amount-text');
const swapBtn = document.getElementById('swap-btn');
const refreshBtn = document.getElementById('refresh-btn');
const lastUpdated = document.getElementById('last-updated');

// Populate currency dropdowns
function populateCurrencyDropdowns() {
    CURRENCIES.forEach(currency => {
        const option1 = new Option(`${currency.code} - ${currency.name}`, currency.code);
        const option2 = new Option(`${currency.code} - ${currency.name}`, currency.code);
        fromCurrency.add(option1);
        toCurrency.add(option2);
    });

    // Set default values
    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';
}

// Fetch exchange rate and update UI
async function fetchExchangeRate() {
    const amount = amountInput.value;
    const from = fromCurrency.value;
    const to = toCurrency.value;

    // Show loading state
    convertedAmount.textContent = 'Loading...';
    refreshBtn.querySelector('svg').classList.add('loading');

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        const data = await response.json();
        const rate = data.rates[to];
        const converted = (amount * rate).toFixed(2);

        // Update UI
        amountText.textContent = `${amount} ${from} =`;
        convertedAmount.textContent = `${converted} ${to}`;
        lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        convertedAmount.textContent = 'Error fetching rates';
        console.error('Error:', error);
    } finally {
        refreshBtn.querySelector('svg').classList.remove('loading');
    }
}

// Event Listeners
amountInput.addEventListener('input', fetchExchangeRate);
fromCurrency.addEventListener('change', fetchExchangeRate);
toCurrency.addEventListener('change', fetchExchangeRate);
refreshBtn.addEventListener('click', fetchExchangeRate);

swapBtn.addEventListener('click', () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    fetchExchangeRate();
});

// Initialize
populateCurrencyDropdowns();
fetchExchangeRate();