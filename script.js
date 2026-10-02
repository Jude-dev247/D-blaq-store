/* Cart elements */

const cartIcon = document.getElementById("cart-icon");
const closeIcon = document.getElementById("close-icon");
const cart = document.getElementById("cart");

const cartItemsContainer = document.querySelector(".cart-items");
const totalPriceElement = document.getElementById("total-price");
const cartNumber = document.querySelector(".circle");

const productCards = document.querySelectorAll(".product-card");


/* Load cart from localStorage */

let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];


/* Open cart */

if (cartIcon) {
    cartIcon.addEventListener("click", function () {
        cart.classList.add("show");
    });
}


/* Close cart */

if (closeIcon) {
    closeIcon.addEventListener("click", function () {
        cart.classList.remove("show");
    });
}


/* Add products to cart */

productCards.forEach(function (card) {

    const cartButton = card.querySelector(".cart-btn");

    if (!cartButton) {
        return;
    }

    cartButton.addEventListener("click", function () {

        const image = card.querySelector("img").src;
        const name = card.querySelector("h3").textContent.trim();
        const description = card.querySelector("p").textContent.trim();
        const priceText = card.querySelector(".price").textContent.trim();

        const price = Number(
            priceText.replace(/[₦,]/g, "")
        );


        /* Check if product already exists */

        const existingProduct = cartItems.find(function (item) {
            return (
                item.name === name &&
                item.price === price &&
                item.image === image
            );
        });


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cartItems.push({
                image: image,
                name: name,
                description: description,
                price: price,
                quantity: 1
            });

        }


        /* Save cart */

        saveCart();

        updateCart();

    });

});


/* Save cart */

function saveCart() {

    localStorage.setItem(
        "cartItems",
        JSON.stringify(cartItems)
    );

}


/* Update cart */

function updateCart() {

    if (!cartItemsContainer) {
        return;
    }

    cartItemsContainer.innerHTML = "";


    /* Empty cart */

    if (cartItems.length === 0) {

        cartItemsContainer.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        if (totalPriceElement) {
            totalPriceElement.textContent = "₦0";
        }

        if (cartNumber) {
            cartNumber.textContent = "0";
        }

        return;
    }


    /* Display cart products */

    cartItems.forEach(function (item, index) {

        const cartItem = document.createElement("div");

        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <div class="cart-img">
                <img src="${item.image}" alt="${item.name}">
            </div>

            <div class="cart-details">

                <h4>${item.name}</h4>

                <p>${item.description}</p>

                <h4>₦${item.price.toLocaleString()}</h4>

                <div class="delete-btn">
                    <i class="fa-solid fa-trash-can"></i>
                </div>

                <div class="cart-quantity">

                    <div class="remove">-</div>

                    <div class="quantity">
                        ${item.quantity}
                    </div>

                    <div class="add">+</div>

                </div>

                <div class="line"></div>

            </div>
        `;


        cartItemsContainer.appendChild(cartItem);


        /* Delete product */

        const deleteButton =
            cartItem.querySelector(".delete-btn");

        deleteButton.addEventListener("click", function () {

            cartItems.splice(index, 1);

            saveCart();

            updateCart();

        });


        /* Increase quantity */

        const addButton =
            cartItem.querySelector(".add");

        addButton.addEventListener("click", function () {

            cartItems[index].quantity++;

            saveCart();

            updateCart();

        });


        /* Decrease quantity */

        const removeButton =
            cartItem.querySelector(".remove");

        removeButton.addEventListener("click", function () {

            if (cartItems[index].quantity > 1) {

                cartItems[index].quantity--;

            } else {

                cartItems.splice(index, 1);

            }

            saveCart();

            updateCart();

        });

    });


    updateTotal();

    updateCartNumber();

}


/* Calculate total price */

function updateTotal() {

    if (!totalPriceElement) {
        return;
    }

    let total = 0;


    cartItems.forEach(function (item) {

        total += item.price * item.quantity;

    });


    totalPriceElement.textContent =
        "₦" + total.toLocaleString();

}


/* Update cart number */

function updateCartNumber() {

    if (!cartNumber) {
        return;
    }

    let totalItems = 0;


    cartItems.forEach(function (item) {

        totalItems += item.quantity;

    });


    cartNumber.textContent = totalItems;

}


/* Back to top */

const backToTop =
    document.getElementById("backToTop");


if (backToTop) {

    window.addEventListener("scroll", function () {

        if (window.scrollY > 400) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    });


    backToTop.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* Load cart when page opens */

updateCart();