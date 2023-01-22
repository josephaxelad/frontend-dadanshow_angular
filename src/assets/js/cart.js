document.getElementById("_body_").style.overflow = "visible";
function showCart() {
  document.getElementById("cart").style.display ="block";
  document.getElementById("cart").style.width ="100%";
  document.getElementById("cart").style.backgroundColor = "rgba(0,0,0,.5)";
  const element = document.querySelector('#cart_');
  element.classList.add('animate__animated', 'animate__slideInRight');
  element.addEventListener('animationend', () => {
    document.getElementById("cart").style.display ="block";
    document.getElementById("cart").style.width ="100%";
    document.getElementById("cart").style.backgroundColor = "rgba(0,0,0,.5)";
  });
  document.getElementById("_body_").style.overflow = "hidden";
  // var cartList = document.getElementsByClassName("cart-list");
  // for (let i = 0; i < cartList.length; i++) {
  //   cartList[i].style.display="block";
  // }
}
function hideCart() {
  const elementt = document.querySelector('#cart_');
  // element.classList.remove('animate__animated', 'animate__slideInRight');
  elementt.classList.add('animate__animated', 'animate__slideOutRight');
  elementt.addEventListener('animationend', () => {
    elementt.classList.remove('animate__animated', 'animate__slideOutRight','animate__slideInRight');
    document.getElementById("cart").style.display ="none";
  });
  document.getElementById("_body_").style.overflow = "visible";
  // document.getElementById("cart").style.width ="0";
  // document.getElementById("cart").style.display ="none";
  // var cartList = document.getElementsByClassName("cart-list");
  // for (let i = 0; i < cartList.length; i++) {
  //   cartList[i].style.display="none";
  // }

}

function itemAdded() {
  const element = document.querySelector('.cart_button_mobile');
  element.classList.add('animate__animated', 'animate__bounce');
  element.addEventListener('animationend', () => {
    element.classList.remove('animate__animated', 'animate__bounce');
  });
  const e2 = document.querySelector('.cart_button');
  e2.classList.add('animate__animated', 'animate__bounce');
  e2.addEventListener('animationend', () => {
    e2.classList.remove('animate__animated', 'animate__bounce');
  });
}
// $( "#add_to_cart_button" ).click(function() {animate__backOutUp
//   const elementttt = document.querySelector('#cart_button');
//   elementttt.classList.add('animate__animated', 'animate__bounce');
// });
