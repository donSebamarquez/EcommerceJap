let loginBlock = document.querySelector(".login");
let btnLogin = loginBlock.querySelector(".login__button");
let userNameField = loginBlock.querySelector(".user__input");
let userPassField = loginBlock.querySelector(".password__input");
let errorAlert = loginBlock.querySelector(".login__error");
let alertText = ``;

let userName = "";
let userPassword = "";

function userSession(user,password){

    if(user && password){
        localStorage.setItem("userName",user)

        /* Si vas a trabajar en local descomentar el localhost y comenta el location hacia el github*/
        window.location.href = "http://127.0.0.1:5500/";

        /*Si vas a subir el archivo comenta el localhost y descomenta el location de abajo*/ 
        //window.location.href = "https://donsebamarquez.github.io/EcommerceJap/";

        resetValues();
        errorAlert.innerHTML = "";
    }

}

function user(user){
    if(user.length < 6){
console.log ("error")
        errorMessage("usuario", 6);
        resetValues();
        return;
    }

    return user;

}

function password(pass){
    if(pass.length < 6){
        errorMessage("contraseña", 6);
        resetValues();
        return;
    }

    return true;

}

function errorMessage(field,length){
    
    alertText = `
            <p>El campo de ${field} no puede ser inferior a ${length} caracteres <br></p>
        `
        errorAlert.innerHTML = alertText
}

function resetValues(){
    userNameField.value = "";
    userPassField.value = "";
}

btnLogin.addEventListener("click",()=>{

    userName = userNameField.value
    userPassword = userPassField.value

    userSession(user(userName),password(userPassword));

})
