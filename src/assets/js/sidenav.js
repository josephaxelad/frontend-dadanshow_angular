 //document.getElementById("catagories-side-menu").style.display ="none";
 function openNav() {
  document.getElementById("catagories-side-menu").style.display ="block";
  document.getElementById("catagories-side-menu").style.width = "300px";
  document.getElementById("wrapper").style.opacity= '0.3';
  document.body.style.backgroundColor =  'rgba(0, 0, 0, 0.5)';
  //document.getElementById("wrapper").style.marginLeft = "300px";
  //document.getElementById("wrapper").style.color= '0.3';
  document.getElementById("catagories-side-menu").style.width = "300px";
  document.getElementById("wrapper").style.left = "300px";

}
function closeNav() {
  document.getElementById("catagories-side-menu").style.display ="none";
  document.getElementById("catagories-side-menu").style.width = "0";
  //document.getElementById("wrapper").style.marginLeft = "0";
  document.getElementById("wrapper").style.left = "0px";
  document.getElementById("wrapper").style.opacity= '1';
  document.body.style.backgroundColor =  'white';
  //document.getElementById("wrapper").style.backgroundColor = rgb(239, 239, 239);
}
