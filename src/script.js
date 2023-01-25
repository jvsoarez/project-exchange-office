import './style.css';
import Swal from 'sweetalert2';

const input = document.querySelector('#currency-input');
const button = document.querySelector('#find-button');
const container = document.querySelector('#container');
const containerTitle = document.querySelector('#currency-container-title');

const addCurrenciesInContainer = (currencies) => {
  const createCurrencyContainer = document.createElement('div');
  createCurrencyContainer.setAttribute('id', 'currency-container');
  container.appendChild(createCurrencyContainer);
  currencies.forEach(([ currency, value]) => {
    containerTitle.innerText = `Valores referentes a 1 ${input.value.toUpperCase()}`;
    const icon = document.createElement('span');
    icon.setAttribute('class', 'fa-sharp fa-solid fa-coins haha');
    const valueDiv = document.createElement('div');
    valueDiv.setAttribute('class', 'value');
    const currencyDiv = document.createElement('div');
    currencyDiv.setAttribute('class', 'cod-currency');
    valueDiv.innerText = value.toFixed(3);
    currencyDiv.innerText = currency;
    const currencyAndValueDiv = document.createElement('div');
    currencyAndValueDiv.appendChild(icon);
    currencyAndValueDiv.appendChild(currencyDiv);
    currencyAndValueDiv.appendChild(valueDiv);
    currencyAndValueDiv.setAttribute('class', 'currency');
    createCurrencyContainer.appendChild(currencyAndValueDiv);
  });
};

const verifyInput = (currencies) => {
  const verifyCurrency = currencies.some((currencyArray) => currencyArray.includes(input.value.toUpperCase()));
  if (input.value === '') {
    throw new Error('Sem código de moeda');
  } else if (verifyCurrency === false) {
    throw new Error('Moeda inválida');
  }
};

button.addEventListener('click', () => {
  const currencyContainer = document.querySelector('#currency-container');
  fetch(`https://api.exchangerate.host/latest?base=${input.value}`)
    .then((response) => response.json())
    .then(({ rates }) => {
      const allCurrencies = Object.entries(rates);
      verifyInput(allCurrencies);
      if (currencyContainer) {
        container.removeChild(currencyContainer);
        addCurrenciesInContainer(allCurrencies);
      } else {
        addCurrenciesInContainer(allCurrencies);
      }
    })
    .catch((error) => {
      if (error.stack.includes('Sem código de moeda')) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Você precisa passar o código de uma moeda',
        });
      }
      if (error.stack.includes('Moeda inválida')) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Este código de moeda não existe',
        });
      }
    });
});