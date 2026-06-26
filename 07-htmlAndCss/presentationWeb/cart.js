// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || []

function addToCart(id, name, price, image) {
  const existingItem = cart.find((item) => item.id === id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: 1,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  showAddToCartMessage(name)
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  loadCartItems()
}

function updateQuantity(id, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(id)
    return
  }

  const item = cart.find((item) => item.id === id)
  if (item) {
    item.quantity = newQuantity
    localStorage.setItem("cart", JSON.stringify(cart))
    loadCartItems()
    updateCartCount()
  }
}

function clearCart() {
  if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
    cart = []
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()
    loadCartItems()
  }
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartCountElements = document.querySelectorAll("#cart-count")
  cartCountElements.forEach((element) => {
    element.textContent = totalItems
    element.style.display = totalItems > 0 ? "inline" : "none"
  })
}

function getCart() {
  return cart
}

function loadCartItems() {
  const cartItemsContainer = document.getElementById("cart-items")
  const emptyCartDiv = document.getElementById("empty-cart")

  if (!cartItemsContainer) return

  if (cart.length === 0) {
    cartItemsContainer.style.display = "none"
    if (emptyCartDiv) emptyCartDiv.style.display = "block"
    updateCartSummary()
    return
  }

  cartItemsContainer.style.display = "block"
  if (emptyCartDiv) emptyCartDiv.style.display = "none"

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-total">
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">×</button>
        </div>
    `,
    )
    .join("")

  updateCartSummary()
}

function updateCartSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = cart.length > 0 ? 9.99 : 0
  const tax = subtotal * 0.16
  const total = subtotal + shipping + tax

  const subtotalElement = document.getElementById("cart-subtotal")
  const shippingElement = document.getElementById("cart-shipping")
  const taxElement = document.getElementById("cart-tax")
  const totalElement = document.getElementById("cart-total")

  if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`
  if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`
  if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`
  if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`
}

function showAddToCartMessage(productName) {
  // Create a temporary notification
  const notification = document.createElement("div")
  notification.className = "cart-notification"
  notification.textContent = `${productName} agregado al carrito`
  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Hide and remove notification
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 2000)
}
