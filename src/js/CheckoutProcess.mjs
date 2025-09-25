import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
    this.calculateOrderTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.FinalPrice * item.Qty,
      0
    );
    document.querySelector(`${this.outputSelector} #subtotal`).innerText =
      this.itemTotal.toFixed(2);
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(`${this.outputSelector} #tax`).innerText =
      this.tax.toFixed(2);
    document.querySelector(`${this.outputSelector} #shipping`).innerText =
      this.shipping.toFixed(2);
    document.querySelector(`${this.outputSelector} #cart-total`).innerText =
      this.orderTotal.toFixed(2);
  }

  packageItems() {
    return this.list.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.Qty
    }));
  }

  async checkout(form) {
    const formData = new FormData(form);
    const order = {};
    formData.forEach((value, key) => (order[key] = value));

    order.orderDate = new Date().toISOString();
    order.items = this.packageItems();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping;

    const services = new ExternalServices();

    try {
      const response = await services.checkout(order);
      console.log("Server response:", response);

      localStorage.removeItem(this.key);
      window.location.href = "success.html";
    } catch (err) {
      console.error("Checkout error:", err);
      import("./utils.mjs").then(utils => {
        utils.alertMessage(
          `Checkout failed: ${
            typeof err.message === "object"
              ? JSON.stringify(err.message)
              : err.message
          }`
        );
      });
    }
  }
}
