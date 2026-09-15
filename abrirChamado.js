//SEÇÕES DA PÁGINA
const mostrarChamados = document.querySelector('#todos-chamados'); 
const detalheChamado = document.querySelector('#detalhe-chamado');
const mostrarForm = document.querySelector('#novo-chamado');
const meusChamados = document.querySelector("#meus-chamados");

//identificação dos campos do formulário
const inputNome = document.getElementById('nome_solicitante');
const inputEmail = document.getElementById('email_solicitante');
const inputSetor = document.getElementById('setor_solicitante');
const inputCategoria = document.querySelectorAll('.btn-categoria');
const inputHidden = document.getElementById('categoria_selecionada');
const inputDescricao = document.getElementById('descricao');
const inputImg = document.getElementById('img_chamado');
const buttonChamado = document.getElementById('enviar-chamado');

const btn = document.querySelectorAll('.cabecalho-menu-item');

const arquivo = inputImg.files[0];


btn.forEach(btnCategoria =>{
        btnCategoria.addEventListener('click', function(){
            //remove a classe active de todos os buttons
           btn.forEach(b => b.classList.remove('active'));

           //adiciona a classe no button clicado
           this.classList.add('active');


           //console.log(inputHidden.value);

        });
});


inputCategoria.forEach(btnCategoria =>{
        btnCategoria.addEventListener('click', function(){
            //remove a classe active de todos os buttons
           inputCategoria.forEach(b => b.classList.remove('active'));

           //adiciona a classe no button clicado
           this.classList.add('active');

           //coloca o valor do button clicado no input
           inputHidden.value = this.getAttribute('data-value');

           //console.log(inputHidden.value);

        });
});


/*
//função do formulário
buttonChamado.addEventListener('click', function(event){
    event.preventDefault();//serve pra não recarregar a página
    
    try{
        const response = 
    }






});
*/


//função para alterar a cor do botão de categoria
const categoriaSelecionada = "Hardware";

const botoes = document.querySelectorAll('.btn-categoria');

botoes.forEach(botao =>{
    botao.addEventListener('click', ()=>{

        //remove a classe 'active' dos botoes
        botoes.forEach(b => b.classList.remove('active'));

        //adiciona a classe 'active' no botão que foi clicado
        botao.classList.add('active');

        //atualiza o valor da variavel com o valor de 'data-category'
        //o data-category serve pro js ler oq está escrito no button
        categoriaSelecionada = botao.getAttribute('data-category');

        console.log('categoria selecionada', categoriaSelecionada);
        
    });
});

