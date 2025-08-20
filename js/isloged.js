const session = localStorage.getItem("userName")


document.addEventListener("DOMContentLoaded",function(){
        
        if(!session){
            /* Si vas a trabajar en local descomentar el localhost y comenta el location hacia el github*/
            /*window.location.href = "http://127.0.0.1:5500/";*/

            /*Si vas a subir el archivo comenta el localhost y descomenta el location de abajo*/ 
            window.location.href = "https://donsebamarquez.github.io/EcommerceJap/login.html";
        }

})