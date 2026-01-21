let cart = [];
let couponDiscount = 0;

/* Add product */
function addProduct(name, category, price) {
  const item = cart.find(p => p.name === name);
  if (item) {
    item.qty++;
  } else {
    cart.push({ name, category, price, qty: 1 });
  }
  renderCart();
}

/* Remove product */
function removeProduct(name) {
  cart = cart.filter(p => p.name !== name);
  renderCart();
}

/* Update quantity */
function updateQty(name, qty) {
  const item = cart.find(p => p.name === name);
  if (item && qty > 0) {
    item.qty = qty;
  }
  renderCart();
}

/* Coupon validation */
function applyCoupon() {
  const code = document.getElementById("coupon").value.trim().toUpperCase();

  if (code === "SAVE10") couponDiscount = 10;
  else if (code === "SAVE20") couponDiscount = 20;
  else {
    alert("Invalid coupon code");
    couponDiscount = 0;
  }
  renderCart();
}

/* Discounts */
function calculateDiscount(subtotal) {
  let discount = 0;

  // Bulk discount
  cart.forEach(item => {
    if (item.qty >= 3) discount += item.price * item.qty * 0.1;
  });

  // Category discount
  cart.forEach(item => {
    if (item.category === "books") {
      discount += item.price * item.qty * 0.05;
    }
  });

  // Coupon discount
  discount += subtotal * (couponDiscount / 100);

  return discount;
}

/* Render cart */
function renderCart() {
  const body = document.getElementById("cartBody");
  body.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {
    const total = item.price * item.qty;
    subtotal += total;

    body.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>
          <input class="qty" type="number" value="${item.qty}"
            onchange="updateQty('${item.name}',this.value)">
        </td>
        <td>₹${total.toFixed(2)}</td>
        <td><button class="remove" onclick="removeProduct('${item.name}')">X</button></td>
      </tr>
    `;
  });

  const discount = calculateDiscount(subtotal);
  const finalTotal = subtotal - discount;

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("discount").textContent = discount.toFixed(2);
  document.getElementById("total").textContent = finalTotal.toFixed(2);
}