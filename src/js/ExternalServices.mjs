const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ExternalServices {
  constructor() {}

  async getOrders() {
    // Simulación de llamada a la API
    const response = await fetch(`${baseURL}orders`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async saveOrder(orderData) {
    // Simulación de guardar orden
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
