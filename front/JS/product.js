const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

//  récupérer la valeur du paramètre 'id'
const id = urlParams.get('id');
console.log('ID:', id);
// fetch et console du json récupéré 
const URL = 'http://localhost:3000/api/products/' + id;
console.log('URL:', URL);
fetch(URL)
    .then(reponse => reponse.json())
    .then((data) => {
        let canape = data

        //afficher l'image
        let itemIMgHTML = `<img src="${canape.imageUrl}" alt="${canape.altTxt}">`
        document.getElementsByClassName("item__img")[0].innerHTML = itemIMgHTML;
        //afficher le nom
        let titleHTML = `${canape.name}`
        document.getElementById("title").innerHTML = titleHTML;
        //afficher le nom
        let priceHTML = `${canape.price}`
        document.getElementById("price").innerHTML = priceHTML;
        let descriptionHTML = `${canape.description}`
        document.getElementById("description").innerHTML = descriptionHTML;
        const colors = canape.colors
        console.log("color" + colors);
        const selectElement = document.getElementById('colors');

        let options = '';
        for (let color of colors) {
            options += `<option value="${color}">${color}</option>`;

        }
        selectElement.innerHTML += options;

        // 
        const colorSelect = document.getElementById('colors');
        const quantityInput = document.getElementById("quantity");
        
        //déclarer un objet 
        //avec trois attributs:
        //id,quantity,color
        let product = {
            id: id,
            quantity: quantityInput.value, // ou tout autre nombre initial
            color: colorSelect.value,
            price: canape.price,
            title: canape.name,
            imageUrl:canape.imageUrl,
            allText:canape.altTxt
            


        };
         


        // ajout evenement à chaque fois on change la couleur on modifier la couleur dans product

        colorSelect.addEventListener('change', function () {
            product.color = this.value;
 
        });

        // ajout evenement à chaque fois on change la quantité on modifier la quantité dans product

        quantityInput.addEventListener('change', function () {
            product.quantity = this.value;
            
        });

        //  ajouter evenment quand on clique sur addToCart
        const addToCartButton = document.getElementById('addToCart');
        addToCartButton.addEventListener('click', function () {
            console.log(product);
            // ajouter au panier si couleur n'est vide et que la quantité est supérieur à 0
            if (product.color.length > 0 && product.quantity>0) {
                // 1 //  Récupérer le panier existant ou créer un nouveau tableau
                 
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
                // Ajouter le nouveau produit au panier   sans les duplications du meme produit et meme couleur 

                if (cart.length === 0) {
                    
                    cart.push(product);

                } else {
                    
                    let cartMap = new Map(cart.map(p => [p.id + "-" + p.color, p]));
                    // récupérer le canapé avec la couleur dans la map 
                    let selectdCanape = cartMap.get(product.id + "-" + product.color, product);
                    // S'assurer que la quantité du nouveau produit est aussi un nombre
                    product.quantity = Number(product.quantity);


                    if (selectdCanape == null) {
                        // il ne se trouve  pas dans le panier 
                        cartMap.set(product.id + "-" + product.color, product);
                    } else {
                        // le produit existe dans le panier
                        selectdCanape.quantity = Number(selectdCanape.quantity);
                        selectdCanape.quantity += product.quantity;
                        cartMap.set(product.id + "-" + product.color, selectdCanape);

                    }
                    // retrnasformer la map en tableau
                    cart = Array.from(cartMap.values());
                }

                // Sauvegarder le panier mis à jour dans le localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
            }
        })
    })
    .catch(error => console.error("error", error))
//remplir product.html
