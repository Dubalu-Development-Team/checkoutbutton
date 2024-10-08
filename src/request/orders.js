import qs from 'qs';
const ordersUrl = 'https://orders-api.dubalu.io/';

function callApi(url, method, body, headers = {}) {
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json', // Cabecera indicando que el cuerpo de la solicitud es JSON
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined, // Convertir los datos a JSON
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Aquí puedes manipular los datos de la respuesta y actualizar el DOM
      return data;
    })
    .catch(error => {
      console.error(
        'There was a problem with the fetch operation:',
        url,
        error,
      );
    });
}

export const getProduct = (mashupID, productID) => {
  const url = `${ordersUrl}${mashupID}/public/products/${productID}`;
  return callApi(url, 'GET');
};

export const getProducts = (mashupID, query) => {
  let url = `${ordersUrl}${mashupID}/public/products`;
  if (query) {
    url = `${url}?${qs.stringify(query)}`;
  }
  return callApi(url, 'GET');
};
