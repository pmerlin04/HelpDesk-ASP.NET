//const inputUsername = document.getElementById('usuario');
const btnLogin = document.getElementById('logar');

const msg = document.querySelector('.msg-erro');//pega a mensagem de erro
/*
btnLogin.addEventListener('click', function (e){
    e.preventDefault();
    //const valueUsername = inputUsername.value;
    const inputEmailUser = document.getElementById('email');
    const inputSenha = document.getElementById('senha');    
    const valueEmailUser = inputEmailUser.value;
    const valueSenha = inputSenha.value;

    if(valueEmailUser === "" && valueSenha ===""){
        msg.style.display = "block";// faz a mensagem de erro aparecer
        //inputUsername.style.border = "1px solid red";
        inputEmailUser.style.border = "1px solid red";
        inputSenha.style.border = "1px solid red";
        //desfaz as mudanças depois de 3 segundos
        setTimeout(() =>{
        msg.style.display = "none";
        inputEmailUser.style.border = "1px solid #3d444d";
        inputSenha.style.border = "1px solid #3d444d";
        }, 2000);

    }else if(valueEmailUser === "" && valueSenha != ""){
        msg.style.display = "block";// faz a mensagem de erro aparecer
        inputEmailUser.style.border = "1px solid red";
        //inputSenha.style.border = "1px solid red";
        //desfaz as mudanças depois de 3 segundos
        setTimeout(() =>{
        msg.style.display = "none";
        inputEmailUser.style.border = "1px solid #3d444d";
        }, 2000);

    }else if(valueEmailUser === ""){
        msg.style.display = "block";// faz a mensagem de erro aparecer
        inputEmailUser.style.border = "1px solid red";
        //desfaz as mudanças depois de 3 segundos
        setTimeout(() =>{
        msg.style.display = "none";
        inputEmailUser.style.border = "1px solid #3d444d";
        }, 2000);

    }else if(valueSenha === ""){
        msg.style.display = "block";// faz a mensagem de erro aparecer
        inputSenha.style.border = "1px solid red";
        //desfaz as mudanças depois de 3 segundos
        setTimeout(() =>{
        msg.style.display = "none";
        inputSenha.style.border = "1px solid #3d444d";
        }, 2000);

    }
    //console.log(inputUsername.value);
    console.log(inputEmailUser.value);
    console.log(inputSenha.value);
});
*/

/*
//desfaz as mudanças depois de 3 segundos
setTimeout(() =>{
msg.style.display = "none";
inputUsername.style.border = "1px solid #3d444d";
}, 3000);*/


const API_URL_SIGNIN = ' https://api-helpdesk-icom.onrender.com/api/usuarios/signin';

const formularioLogin = document.getElementById('loginForm');

/*
//se o usuário já tiver feito login
if(localStorage.getItem('accessToken')){
    window.location.href = 'chamados.html#novo-chamado';
}

formularioLogin.addEventListener('submit', async function(event){
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const dadosLogin = {
        emailUsuario: email,
        senhaUsuario: senha
    }

    try{
        const response = await fetch(API_URL_SIGNIN,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dadosLogin)
        }); 
        
        if(!response.ok){
            console.log(email);
            console.log(senha);
            throw new Error("Email ou senha inválidos");
        }

        const data = await response.json();

        //salva o token JWT no localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('usuarioEmail', JSON.stringify(dadosLogin));
        console.log(localStorage.getItem('usuarioEmail'));
        //redireciona o usuário para a página de abrir chamado
        window.location.href = 'chamados.html#novo-chamado';
        alert(`Bem vindo ${dadosLogin.emailUsuario}`)

    }catch(error){
        //alert("email ou senha incorretos")
        //msg.style.display = "block";// faz a mensagem de erro aparecer
        console.log("erro no catch ", error.message)
    }

})*/

async function manipularLoginGoogle(googleResponse){
    try{

        //pega o token gerado pelo google
        const idTokenGoogle = googleResponse.credential;

        //envia para o endpoint GoogleLogin
        const response = await fetch('https://api-helpdesk-icom.onrender.com/api/usuarios/google-login', {
            method: 'POST',
            headers :{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({idToken: idTokenGoogle})
        });

        if(!response.ok){
            throw new Error("Falha na autenticação com o Google");
        }

        const data = await response.json();

        //salva o token JWT no localStorage(igual com o login antigo com email e senha)
        localStorage.setItem('token', data.token.accessToken);
        localStorage.setItem('email', data.emailUsuario)
        const codigo = localStorage.getItem('token');
        const emailConta = localStorage.getItem('email');
        console.log("oi", codigo)
        console.log(emailConta)

        alert("Login com o google efetuado com sucesso");
        window.location.href = "chamados.html#novo-chamado";


    }catch(error){
        console.log("erro ao logar com o google ", error);
    }
}

