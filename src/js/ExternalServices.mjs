const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json(); 
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse }; 
  }
}

export default class ExternalServices {
  constructor() {}

  async getOrders() {
    const response = await fetch(`${baseURL}orders`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(orderData) {
    const response = await fetch(`${baseURL}checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    const data = await convertToJson(response);
    return data;
  }
}
