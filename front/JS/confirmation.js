const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

//  récupérer la valeur du paramètre 'id'
const orderId = urlParams.get('orderId');
console.log('orderId:', orderId);

document.getElementById("orderId").innerHTML=orderId;

// Il faut vider le panier
// Supprimer cart du localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
// Supprimer le panier du localStorage
localStorage.removeItem('cart');

