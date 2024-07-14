//on doit afficher les produits depuis produits se trouvont localstorage("cart")
// récuperer les produits dans cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartMap = new Map(cart.map(p => [p.id + "-" + p.color, p]));
console.log(cart);
let canapes = cart;
let itemsHTML = '';
for (const canape of canapes) {
  let itemHTML = `
      <article class="cart__item" data-id="${canape.id}" data-color="${canape.color}">
                <div class="cart__item__img">
                  <img src="${canape.imageUrl}" alt="${canape.alt}">
                </div>                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${canape.title}</h2>
                    <p>${canape.color}</p>
                    <p>${canape.price}</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${canape.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>

  `;
  itemsHTML += itemHTML;
}
document.getElementById("cart__items").innerHTML = itemsHTML;
// calcul total
var total = cart.reduce((sum, cur) => {

  return sum += cur.price * cur.quantity;
}, 0);


document.getElementById("totalQuantity").textContent = total.toFixed(2);

// ajout evenement à chaque fois on change la couleur on modifier la couleur dans product



document.querySelectorAll('.itemQuantity').forEach(input => {
  input.addEventListener('change', function () {
    updateTotalPrice();
    const quantity = parseInt(this.value);

    const article = this.closest('.cart__item');
    const dataId = article.getAttribute('data-id');
    const dataColor = article.getAttribute('data-color');
    // récupérer le canapé avec la couleur dans la map 
    let selectdCanape = cartMap.get(dataId + "-" + dataColor);
    //met a jour  la quantite
    selectdCanape.quantity = quantity;
    //remettre le ca nape dans le panier
    cartMap.set(dataId + "-" + dataColor, selectdCanape);
    // retrnasformer la map en tableau
    cart = Array.from(cartMap.values());
    // Sauvegarder le panier mis à jour dans le localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  });
});
function updateTotalPrice() {
  let totalPrice = 0;
  document.querySelectorAll('.cart__item').forEach(item => {
    // rechercher toutes les balise p sous la classe cart__item__content__description .
    // il renvoie un tableau de deux valeurs correspondant à   <p>couleur </p> et <p> prix</p>
    // je récupère la deuxième avec l'indice 1
    const price = parseFloat(item.querySelectorAll('.cart__item__content__description p')[1].textContent);
    // recherche du premier element avec la classe itemQuantity
    const quantity = parseInt(item.querySelector('.itemQuantity').value);
    totalPrice += price * quantity;

  });
  document.getElementById("totalQuantity").textContent = totalPrice.toFixed(2);
}

//ajout evenement bouton supprimer
document.querySelectorAll('.deleteItem ').forEach(input => {
  input.addEventListener('click', function () {
    // supprimer l'element du html 
    // récuperer le parent 
    const article = this.closest('.cart__item');
    // supprimer l'article
    article.remove();
    // supprimer du cart 
    const dataId = article.getAttribute('data-id');
    const dataColor = article.getAttribute('data-color');
    // identifiant des articles dans le panier id-color
    // supprimer de la map des articless
    cartMap.delete(dataId + "-" + dataColor); // Removes the element with key 'key1'
    // retrnasformer la map en tableau
    cart = Array.from(cartMap.values());
    // Sauvegarder le panier mis à jour dans le localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(dataId + "-" + dataColor); // Map(1) { 'key2' => 'value2' }
    updateTotalPrice();

  });
});

const orderP = document.getElementById("order");


orderP.addEventListener('click', function () {
  const firstNameP = document.getElementById("firstName");
  const lastNameP = document.getElementById("lastName");
  const addressP = document.getElementById("address");
  const cityP = document.getElementById("city");
  const emailP = document.getElementById("email");
  //verifier le forma du mail

  const errorMessage = validerChamps(firstNameP.value, lastNameP.value, lastNameP.value, cityP.value, emailP.value);
  if (errorMessage) {
    alert(errorMessage);

  }
  else {
    // le formulaire est valide
    // Construire un objet 

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIds = cart.map(product => product.id);


    const data = {
      contact: {
        firstName: firstNameP.value,
        lastName: lastNameP.value,
        address: addressP.value,
        city: cityP.value,
        email: emailP.value
      },
      products: productIds
    };

    console.log(JSON.stringify(data));

    // SOUMETTRE LE FOMULAIRE
    document.querySelector('.cart__order__form').addEventListener('submit', function (event) {
      event.preventDefault();
      console.log('Sending data:', data); // Log the data being sent

      fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          console.log('Response status:', response.status); // Log the response status
          if (!response.ok) {
            console.error('Response not ok:', response); // Log the entire response if not ok
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Response data:', data); // Log the response data
          // récupérer l'orderId
          // Vérifiez que data.orderId existe
          if (data.orderId) {
            // Redirection vers la page de confirmation avec l'ID de la commande
            window.location.href = `./confirmation.html?orderId=${data.orderId}`;
          } else {
            throw new Error('Order ID not found in response');
          }
        })
        .catch(error => {
          console.error('Fetch error:', error); // Log the error object
          alert(`An error occurred: ${error.message}`);

          if (error.response) {
            console.error('Response status:', error.response.status);
            error.response.text().then(text => {
              console.error('Response text:', text);
            });
          }
        });
    });
  }
})
/*
valider que le texte est saisi
*/
function validerTexte(texte) {
  return texte.trim() !== "";
}
/*
Valider tous les champs saisis
*/
function validerChamps(firstName, lastName, address, city, email) {
  if (!validerTexte(firstName)) {
    return "Le prénom n'est pas valide";
  }
  if (!validerTexte(lastName)) {
    return "Le nom n'est pas valide";
  }
  if (!validerTexte(address)) {
    return "L'adresse n'est pas valide";
  }
  if (!validerTexte(city)) {
    return "La ville n'est pas valide";
  }
  if (!validerEmail(email)) {
    return "L'adresse email n'est pas valide";
  }
  return null;
}
function validerEmail(email) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}



