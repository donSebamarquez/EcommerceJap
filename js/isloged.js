const session = localStorage.getItem("userName")


document.addEventListener("DOMContentLoaded",function(){
        
        if(!session){
            window.location.href = "http://127.0.0.1:5500/login.html";
        }

})