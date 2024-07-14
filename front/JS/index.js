let URL = "http://localhost:3000/api/products";
fetch(URL)
    .then((response) => response.json())
    .then((data) => {
        let canapes = data;
        let itemsHTLM = ''; //html de tous les articles sous la section items
        for (const canape of canapes) {
            //html de chaque article 
            let itemHTML = `
            <a href="./product.html?id=${canape._id}">
                <article>
                    <img src="${canape.imageUrl}" alt="${canape.altTxt}">
                      <h3 class="productName">"${canape.name}"</h3>
                    <p class="productDescription">"${canape.description}"</p>
                </article>
            </a>
            `
            itemsHTLM += itemHTML;
        }
        document.getElementById("items").innerHTML = itemsHTLM;
    })
    .catch(error => console.error("error", error))
   
