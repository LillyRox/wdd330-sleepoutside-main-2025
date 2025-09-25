import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

document.querySelector("#zip").addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

document.querySelector("#checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const form = e.target; 
  const isValid = form.checkValidity();
  form.reportValidity();

  if (isValid) {
    checkout.checkout(form);
  }
});
