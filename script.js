// 1. მთავარი გვერდი (index.html): პროდუქტის კალათაში შენახვა

const addButtons = document.querySelectorAll('.add-btn');
addButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const productCard = event.target.closest('.product-card');  
        const name = productCard.querySelector('h3').textContent.trim();
        const priceText = productCard.querySelector('.price').textContent.trim();
        const price = parseFloat(priceText.replace('₾', ''));
        const img = productCard.querySelector('.product-img img').getAttribute('src');

        let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

        const existingProduct = cart.find(item => item.name === name);

        if (existingProduct) {  
            existingProduct.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                img: img,
                quantity: 1
            });
        }

        localStorage.setItem('coffeeCart', JSON.stringify(cart));

        alert(`${name} წარმატებით დაემატა კალათაში!`);
    });
});


// 2. კალათის გვერდი (cart.html): პროდუქტების გამოჩენა და მართვა

const cartItemsContainer = document.querySelector('.cart-items-list');
if (cartItemsContainer) {
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; padding: 20px;">თქვენი კალათა ცარიელია</p>';
            updateSummary(0);
            return;
        }

        cartItemsContainer.innerHTML = '';

        cart.forEach((item, index) => {
            const totalPrice = (item.price * item.quantity).toFixed(2);
            const itemHTML = `
                <div class="cart-item-card" data-index="${index}">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-desc">არომატული ყავა</p>
                        <div class="quantity-selector">
                            <button class="qty-btn minus-btn">−</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn plus-btn">+</button>
                        </div>
                    </div>
                    <span class="cart-item-price">${totalPrice} ₾</span>
                    <button class="remove-btn">✕</button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        setupCartEventListeners();
        calculateTotal(cart);
    }


    function setupCartEventListeners() {
        let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
        const itemCards = document.querySelectorAll('.cart-item-card');
        itemCards.forEach(card => {
            const index = card.getAttribute('data-index');
            const plusBtn = card.querySelector('.plus-btn');
            const minusBtn = card.querySelector('.minus-btn');
            const removeBtn = card.querySelector('.remove-btn');

            plusBtn.addEventListener('click', () => {
                cart[index].quantity += 1;
                localStorage.setItem('coffeeCart', JSON.stringify(cart));
                renderCart();
            });

            minusBtn.addEventListener('click', () => {
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    localStorage.setItem('coffeeCart', JSON.stringify(cart));
                    renderCart();
                }
            });

            removeBtn.addEventListener('click', () => {
                cart.splice(index, 1);
                localStorage.setItem('coffeeCart', JSON.stringify(cart));
                renderCart();
            });
        });
    }


    function calculateTotal(cart) {
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        updateSummary(subtotal);
    }


    function updateSummary(subtotal) {
        let deliveryCost = subtotal > 0 ? 5.00 : 0.00;
        let finalTotal = subtotal + deliveryCost;

        const subtotalElement = document.querySelector('.checkout-summary-card .summary-row:nth-of-type(1) span:last-child');
        const deliveryElement = document.querySelector('.checkout-summary-card .summary-row:nth-of-type(2) span:last-child');
        const totalElement = document.querySelector('.checkout-summary-card .total-row span:last-child');

        if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)} ₾`;
        if (deliveryElement) deliveryElement.textContent = `${deliveryCost.toFixed(2)} ₾`;
        if (totalElement) totalElement.textContent = `${finalTotal.toFixed(2)} ₾`;
    }

    renderCart();
}

// 3.  ბურგერი, ქუქიები და FETCH

document.addEventListener("DOMContentLoaded", () => {
    
    const burgerToggle = document.getElementById("burgerToggle");
    const navLinks = document.querySelector(".nav-links");

    if (burgerToggle && navLinks) {
        burgerToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            burgerToggle.classList.toggle("active");
        });
    }


    const cookieBanner = document.getElementById("cookieBanner");
    const acceptCookiesBtn = document.getElementById("acceptCookies");

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem("cookieAccepted")) {
            cookieBanner.classList.remove("hidden");
        }

        acceptCookiesBtn.addEventListener("click", () => {
            localStorage.setItem("cookieAccepted", "true");
            cookieBanner.classList.add("hidden");
        });
    }


    async function getCoffeeData() {
        try {
            const response = await fetch('https://api.sampleapis.com/coffee/hot');
            if (!response.ok) throw new Error("სერვერიდან მონაცემები ვერ წამოვიდა");
            const data = await response.json();
            console.log("--- სერვერიდან წამოღებული ინფორმაცია (GET Method) ---");
            console.log("დღის გემრიელი ყავაა:", data[0]?.title);
        } catch (error) {
            console.error("Fetch შეცდომა:", error);
        }
    }
    
    getCoffeeData();
});