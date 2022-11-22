import products from "./data.json" assert { type: "json" };

let carts =
  document.querySelectorAll(
    ".add-cart"
  ); /* selection de tout les produits avec la classe add-cart*/

/* event listner click sur produits*/
for (let i = 0; i < carts.length; i++) {
  carts[i].addEventListener("click", () => {
    cartNumbers(products[i]);
    totalcost(products[i]);
  });
}

/* Fonction recharge cart numbers */
function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");

  if (productNumbers) {
    document.querySelector(".cart span").textContent = productNumbers;
  }
}
/* fonction nombre des produits selectionnés dans cart*/
function cartNumbers(product, action) {
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers);
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (action == "deduce") {
    localStorage.setItem("cartNumbers", parseInt(productNumbers) - 1);
    document.querySelector(".cart span").textContent =
      parseInt(productNumbers) - 1;
  } else if (productNumbers) {
    localStorage.setItem("cartNumbers", parseInt(productNumbers) + 1);
    document.querySelector(".cart span").textContent =
      parseInt(productNumbers) + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart span").textContent = 1;
  }

  setItems(product);
}
/* fonction mettre a jour produits selectionné dans l'objet*/
function setItems(product) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (cartItems != null) {
    if (cartItems[product.tag] == undefined) {
      cartItems = {
        ...cartItems,
        [product.tag]: product,
      };
    }
    cartItems[product.tag].incart += 1;
  } else {
    product.incart = 1;
    cartItems = {
      [product.tag]: product,
    };
  }

  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalcost(product, action) {
  let cartcost = localStorage.getItem("totalcost");

  if (action == "deduce") {
    cartcost = parseInt(cartcost);

    localStorage.setItem("totalcost", cartcost - parseInt(product.price));
  } else if (cartcost != null) {
    cartcost = parseInt(cartcost);
    localStorage.setItem("totalcost", cartcost + parseInt(product.price));
  } else {
    localStorage.setItem("totalcost", parseInt(product.price));
  }
}
/* fonction afficher les produits achetés sur la page cart*/

function displayCart() {
  let cartItems = localStorage.getItem("productsInCart");
  let cartcost = localStorage.getItem("totalcost");
  cartItems = JSON.parse(cartItems);
  let productContainer = document.querySelector(".products");
  if (cartItems && productContainer) {
    productContainer.innerHTML = "";
    Object.values(cartItems).map((item) => {
      productContainer.innerHTML += `
            <div class="product">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" id="del-btn" class="bi bi-x-circle-fill close" viewBox="0 0 16 16" title="close">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg>
            <img src="./img/${item.tag}.jpg" title="${item.tag}">
            <span  class="name-product">${item.name}</span>
            </div>
            <span class="cost">${item.price},00</span>
            <div class="product-incart">
            <ion-icon name="caret-up-outline" class="add-product"></ion-icon>
            <span>${parseInt(item.incart)}</span>
            <ion-icon name="caret-down-outline" class="deduce-product" title="Deduce Product"></ion-icon>
            </div>
            <div class="total-product">
            €${item.incart * item.price},00
            </div>

            `;
    });

    productContainer.innerHTML += `
        <div class="cartTotalContainer">
            <h4 class="cartTotalTitle">
                Total
            </h4>
            <h4 class="cartTotal">
            €${cartcost}.00
            </h4>

        `;
  }
  deleteButtons();
  manageQuantity();
}
/* Fonction Supprimer Produits*/
function deleteButtons() {
  let deleteButtons = document.querySelectorAll(".product svg");
  let productName;
  let productNumbers = localStorage.getItem("cartNumbers");
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let cartcost = localStorage.getItem("totalcost");

  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", () => {
      const res = window.confirm("voulez vous supprimer ce produit");
      if (res) {
        productName = deleteButtons[i].parentElement.textContent.trim();
        // console.log(cartItems[productName].name + " " + cartItems[productName].incart);
        localStorage.setItem(
          "cartNumbers",
          productNumbers - cartItems[productName].incart
        );

        localStorage.setItem(
          "totalcost",
          cartcost -
            cartItems[productName].price * cartItems[productName].incart
        );
        delete cartItems[productName];
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));
        displayCart();
        onLoadCartNumbers();
      }
    });
  }
}

/* Fonction Modifier Quantité */

function manageQuantity() {
  let deduceButtons = document.querySelectorAll(".deduce-product");
  let addButtons = document.querySelectorAll(".add-product");
  let currentQuantity = 0;
  let currentProduct = "";
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  for (let i = 0; i < deduceButtons.length; i++) {
    deduceButtons[i].addEventListener("click", () => {
      currentQuantity =
        deduceButtons[i].parentElement.querySelector("span").textContent;
      currentProduct =
        deduceButtons[
          i
        ].parentElement.previousElementSibling.previousElementSibling.querySelector(
          "span"
        ).textContent;
      if (cartItems[currentProduct].incart > 1) {
        cartItems[currentProduct].incart -= 1;
        cartNumbers(cartItems[currentProduct], "deduce");
        totalcost(cartItems[currentProduct], "deduce");
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));
        displayCart();
      }
    });
  }

  for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener("click", () => {
      currentQuantity =
        addButtons[i].parentElement.querySelector("span").textContent;

      currentProduct =
        addButtons[
          i
        ].parentElement.previousElementSibling.previousElementSibling.querySelector(
          "span"
        ).textContent;
      let incart = parseInt(cartItems[currentProduct].incart);
      cartItems[currentProduct].incart = incart + 1;
      cartNumbers(cartItems[currentProduct]);
      totalcost(cartItems[currentProduct]);
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));
      displayCart();
    });
  }
}

let confirmed =
  document.getElementById(
    "confirm"
  ); /* selection bouton confirmer la commande*/

/* event listner click sur le bouton*/

confirmed.addEventListener("click", () => {
  let isEmpty = localStorage.getItem("cartNumbers");

  if (!isEmpty) {
    toastr.warning("Vous devez choisir un produit", "Alert", {
      positionClass: "toast-top-full-width",
      tapToDismiss: true,
    });
  } else {
    let isConfirmed = confirm("Êtes vous sûr de confirmer la commande ?");

    if (isConfirmed) {
      localStorage.clear();
      window.location = "/index.html";
      toastr.success("Commande confirmée", "Alert", {
        positionClass: "toast-top-full-width",
        escapeHtml: true,
        tapToDismiss: true,
        fadeAway: 1000,
      });
    }
  }
});

onLoadCartNumbers();
displayCart();
