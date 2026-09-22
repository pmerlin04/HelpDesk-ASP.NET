

//verifica se o usuário fez o login
const token = localStorage.getItem('token');
const emailConta = localStorage.getItem('email');
console.log("token: ", token)
console.log("email: ", emailConta)
//console.log(localStorage.getItem('email'));


//SEÇÕES DA PÁGINA
const mostrarChamados = document.querySelector('#todos-chamados'); 
const detalheChamado = document.querySelector('#detalhe-chamado');
const mostrarForm = document.querySelector('#novo-chamado');
const meusChamados = document.querySelector("#meus-chamados");


//manda o usuário pra página de login se não tiver feito o login
if(!token){
    window.location.href = 'index.html';
}else if(emailConta != "pedro.conceicao@icom.com.br"){
    console.log("login feito")
    mostrarForm.style.display = "block";
    mostrarChamados.style.display = "none";

}


//essa function faz a navegação da tela de "meus chamados" para as sections de "chamados"
//ele pega o parametro da function "todosChamados()" da tela de "meus-chamados"
const params = new URLSearchParams(window.location.search);
if(params.get('mostrar') === 'todos-chamados') {
    console.log("funcionou")
        const secaoTodosChamados = document.getElementById('todos-chamados');
        const secaoNovoChamado = document.getElementById('novo-chamado');
        if (secaoTodosChamados) {
            secaoTodosChamados.style.display = 'block';
            secaoNovoChamado.style.display = 'none';
        }
}

function obterHeaders(){
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
}




//FUNCTION DE ESTILO DO MENU
const btn = document.querySelectorAll('.cabecalho-menu-item');

btn.forEach(btnMenu =>{
        btnMenu.addEventListener('click', function(){
            //remove a classe active de todos os buttons
           btn.forEach(b => b.classList.remove('active'));

           //adiciona a classe no button clicado
           this.classList.add('active');

        });
});

//const API_BASE = ' https://api-helpdesk-icom.onrender.com';
const API_BASE = 'https://api-helpdesk-icom.onrender.com';
const API_URL_FINDALL = 'https://api-helpdesk-icom.onrender.com/api/chamados';
const API_URL_FINDWITHPAGED = 'https://api-helpdesk-icom.onrender.com/api/Chamados/10/1?sortDirection=desc';
/*FUNCTION PARA PEGAR OS CHAMADOS DO BACK END SEM PAGINAÇÃO
async function carregarChamados(){
    try{
        const response = await fetch(API_URL_FINDWITHPAGED, {
            method: 'GET',
            headers: obterHeaders()
        });

        //verifica se o access token não expirou (Unauthorized)
        if(response.status === 401){
            alert("Sessão expirada. Faça o login novamente.");
            logout();
            return;
        }

        if(!response.ok){
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const chamados = await response.json();
        console.log('Chamados recebidos: ', chamados);
        exibirChamados(chamados);

    }catch(error){

        console.error('Erro ao buscar chamados: ', error);
    }

}*/

//FUNCTION PARA CARREGAR CHAMADOS COM PAGINAÇÃO
// Variáveis para controlar o estado da paginação
let paginaAtual = 1;
let tamanhoPagina = 9;
let direcaoOrdenacao = 'desc'; // 'asc' ou 'desc'

async function carregarChamadosPaginados(pagina = 1){
    paginaAtual = pagina;

    //monta a URL do endpoint GetPaged do C#
    const url = `${API_URL_FINDALL}/${tamanhoPagina}/${paginaAtual}?sortDirection=${direcaoOrdenacao}`;
    //é a mesma coisa de: https://localhost:7140/api/Chamados/5/1?sortDirection=desc

     try{
        const response = await fetch(url, {
            method: 'GET',
            headers: obterHeaders()
        });

        //verifica se o access token não expirou (Unauthorized)
        if(response.status === 401){
            alert("Sessão expirada. Faça o login novamente.");
            logout();
            return;
        }

        if(!response.ok){
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const chamados = await response.json();
        console.log('Chamados recebidos: ', chamados.list);
        exibirChamados(chamados.list);

        atualizarBotoesPagina(chamados);
    }catch(error){

        console.error('Erro ao buscar chamados: ', error);
    }


}




//FUNCTION DO BOTÃO DE "SAIR" NO MENU
function logout(){
    localStorage.removeItem('accessToken');
    localStorage.removeItem('emailConta');
    window.location.href = 'index.html';
}


//FUNCTION PARA EXIBIR TODOS OS CHAMADOS
const containerAcesso = document.getElementById('acessoAdmin');

function exibirChamados(chamados){
    const lista = document.querySelector('.container');
    lista.innerHTML = ''; //limpou o container

    //paginacao
    const containerPaginacao = document.getElementById('paginacao');
    containerPaginacao.style.display = "block";

    //imagem
    const containerImg = document.getElementById('container-imagem');
    const imgElement = document.getElementById('imagem-chamado');

    //verifica se o email logado é de um administrador
    if(emailConta == "pedro.conceicao@icom.com.br" || emailConta == "appsheet@icom.com.br"){

        chamados.forEach(chamado =>{        
        const itemChamado = document.createElement('div'); //div de chamados
        itemChamado.classList.add('chamados');
            
        /*
        if((chamado.categoria == "Suporte para o B.I" || chamado.categoria == "Suporte para automação") && (emailConta == "appsheet@icom.com.br")){*/
             itemChamado.innerHTML += `
            
            <div class="comeco-chamado">
                <p class="id-chamado">TI - ${chamado.id}</p> 
                <p class="categoria-chamado">${chamado.categoria}</p> 
            </div>

            <div class="meio-chamado">
                <h3 class="titulo-chamado">${chamado.tituloChamado}</h3>
                <p class="descricao-chamado">${chamado.descricao}</p>
                
            </div>

            <div class="linha">
                <hr style="height:0.5px;border-width:0;color:#334155;background-color:#334155">
            </div>

            <div class="final-chamado">
                <p>${chamado.emailUsuario}</p>
                
            <p>${chamado.statusChamado}</p>
                
                <button onclick="exibirDetalhes(${chamado.id})" id="detalhes">Detalhes</button>
            </div>
            `;

            lista.appendChild(itemChamado);

        /*}else if((emailConta == "pedro.conceicao@icom.com.br") && (chamado.categoria != "Suporte para automação" && chamado.categoria != "Suporte para o B.I")){
            //console.log("oi")
            itemChamado.innerHTML += `

            <div class="comeco-chamado">
                <p class="id-chamado">TI - ${chamado.id}</p> 
                <p class="categoria-chamado">${chamado.categoria}</p> 
            </div>

            <div class="meio-chamado">
                <h3 class="titulo-chamado">${chamado.tituloChamado}</h3>
                <p class="descricao-chamado">${chamado.descricao}</p>
                
            </div>

            <div class="linha">
                <hr style="height:0.5px;border-width:0;color:#334155;background-color:#334155">
            </div>

            <div class="final-chamado">
                <p>${chamado.emailUsuario}</p>
                
            <p>${chamado.statusChamado}</p>
                
                <button onclick="exibirDetalhes(${chamado.id})" id="detalhes">Detalhes</button>
            </div>

            `;
            lista.appendChild(itemChamado);

        }*/

           
        
        
    });
    //essa parte não aparece porque a opção "Todos chamados" no menu só aparece pra emails selecionados
    }else{
        const filtroChamados = document.querySelector('.filtro');
        filtroChamados.style.display = "none";
        console.log("acesso negado")
        
        containerAcesso.style.display = "flex";

        const divAcesso = document.querySelector('.acesso');

        divAcesso.innerHTML =`
            <svg class="icone-vermelho" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <h3>Acesso restrito: apenas administradores</h3>
            <p class="erro">Esta tela é restrita à equipe de suporte técnico e aos gestores de TI do Grupo Icom.</p>
        `;



       
    }
    

}

function atualizarBotoesPagina(chamados){
    const containerPaginacao = document.getElementById('paginacao');

    //Pega as propriedades do PagedSearch do C#
    const paginaATual = chamados.currentPage;
    const tamanhoPagina = chamados.pageSize;
    const totalChamados = chamados.totalResults;
    console.log("Página atual: ", paginaAtual)
    console.log("Total de chamados na página: ", tamanhoPagina)
    console.log("Total de chamados: ", totalChamados)


    //calcula o total de páginas
    const totalPaginas = Math.ceil(totalChamados / tamanhoPagina);

    // Se só tiver 1 página ou nenhuma, não precisa exibir os botões de paginação
    if (totalPaginas <= 1) {
        containerPaginacao.innerHTML = `
        
        `;
        return;
    }

    // Monta o HTML dos botões
    containerPaginacao.innerHTML = `
        <button id ="btn-anterior"
        ${paginaAtual <=0 ? 'disabled' : ''}
            onclick="carregarChamadosPaginados(${paginaAtual - 1})">
            &laquo; Anterior
        </button>

        <span>Página ${paginaAtual} de ${totalPaginas} (Total: ${totalChamados} chamados)</span>

        <button id = "btn-proximo"
            ${paginaAtual === totalPaginas ? 'disabled' : ''} 
            onclick="carregarChamadosPaginados(${paginaAtual + 1})">
            Próximo &raquo;
        </button>
    `;

}


async function exibirDetalhes(id){
    try{
        const response = await fetch(`${API_URL_FINDALL}/${id}`, {
            method: 'GET',
            headers: obterHeaders()
        });

        if(!response.ok){
            throw new Error('Chamado não encontrado');
        }

        const chamado = await response.json();

        //data formatada
        const dataComIntl = new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'long'
        });


        mostrarChamados.style.display = "none";
        detalheChamado.style.display = "block";

        const containerPaginacao = document.getElementById('paginacao');

        containerPaginacao.style.display = "none";


        const detalheContainer = document.querySelector('.detalhe-container');

        detalheContainer.innerHTML = `
            <div class="detalhe-card">
                <div class="detalhe-comeco-chamado">
                    <p class="detalhe-id-chamado">ICOM - ${chamado.id}</p>
                    <p class="detalhe-categoria-chamado">${chamado.categoria}</p>
                    <p class="detalhe-status-chamado">${chamado.statusChamado}</p>
                </div>

               <h3 class="detalhe-titulo-chamado">${chamado.tituloChamado}</h3>

                <hr class="detalhe-linha" style="height:0.5px;border-width:0;color:#334155;background-color:#334155;">

                <div class="detalhe-informacao-chamado">
                   <p>${chamado.emailUsuario}</p>
                    <p>Setor</p>
                    <p>${dataComIntl.format(new Date(chamado.dataAbertura))}</p>
                </div>
            

                <div class="detalhe-meio-chamado">
                    <textarea class="detalhe-descricao-chamado"readonly>
                    ${chamado.descricao}
                    </textarea>
                </div>

                <div id ="detalhe-container-imagem">
                    <img id="imagem-chamado" src="${API_BASE}${chamado.imagem}" alt="Este chamado não contém imagem">
                </div>


            </div><!--final detalhe card-->

            <div class="form-fechamento">
                <div class="comeco-fechamento">
                    <h3 class="titulo-fechamento">Gestão do Chamado</h3>
                    <hr class="linha-fechamento" style="height:0.5px;border-width:0;color:#334155;background-color:#334155">
                </div>

                <div class="meio-fechamento">
                <label for="usuarioEmail" id="status">EMAIL SOLICITANTE:</label>
                <input type="text" class="emailChamado" name="usuarioEmail" disabled value="${chamado.emailUsuario}">

                <!--
                <label for="usuarioEmail" id="status">EMAIL ATENDENTE:</label>
                <input type="text" class="emailChamado" name="usuarioEmail" disabled value="${chamado.emailAtendente}">-->

                <label for="atendente" id="atendente">EMAIL ATENDENTE:</label>
                <select name="atendente" id="opt-atendente">
                    <option value="abraao.silva@icom.com.br">Abraão Salazar</option>
                    <option value="gabriel.vespasiano@icom.com.br">Gabriel Vespasiano</option>
                    <option value="lucas.marques@icom.com.br">Lucas Marques</option>
                    <option value="pedro.conceicao@icom.com.br">Pedro Merlin</option> 
                </select>

                <label for="status" id="status">STATUS ATUAL:</label>
                <select name="status" id="opt-status">
                    <option value="Aberto">Aberto</option>
                    <option value="Em análise">Em análise</option>
                    <option value="Desenvolvimento">Em desenvolvimento</option>
                    <option value="Resolvido">Resolvido</option>
                    <option value="Cancelado">Cancelado</option>
                </select>

                <div class="tipo-atendimento">
                    <label for="atendimento" id="lbl-atendimento">TIPO DE ATENDIMENTO:</label></br>
                    <select name="atendimento" id="opt-atendimento">
                        <option value="Presencial">Presencial</option>
                        <option value="Remoto">Remoto</option>
                    </select>
                </div>

                <label for="solucao" id="lbl-solucao">SOLUÇÃO: </label>
                <textarea name="solucao" id="inp-solucao" placeholder="Digite a solução do chamado" maxlength="100" required></textarea>

                <button type="submit" id="btn-atualizar" onclick="atualizarChamado(${chamado.id})">Atualizar chamado</button>
                
    
            </div><!--final form-fechamento-->
        `;
        const containerSolucao = document.querySelector('.container-solucao');


        //mostra a div de solução se o chamado for resolvido
        if(chamado.solucaoChamado != null && chamado.solucaoChamado != ""){

            containerSolucao.style.display = "block";
            containerSolucao.innerHTML = `
                <div class = "solucao">
                    <h3 class="titulo-resposta">Solução encontrada:</h3>
                    <hr class="linha-resposta" style="height:0.5px;border-width:0;color:#334155;background-color:#334155;">
                    <p class = "resposta">
                        ${chamado.solucaoChamado}
                    </p>
                </div>
            
            
            `;
                //console.log(chamado.id)
        }else{
            containerSolucao.style.display = "none";
            containerSolucao.innerHTML = "";
        }

    }catch(error){
        console.log('Erro ao buscar detalhe do chamado: ', error);
    }

}
   



const API_URL_ENCERRARCHAMADO = ' https://api-helpdesk-icom.onrender.com/api/chamados/EncerrarChamado';

async function atualizarChamado(id){


    const valueStatus = document.getElementById('opt-status');
    //const inputStatus = document.getElementById('inp-status');
    const valueEmail = document.querySelector('.emailChamado');
    const valueAtendimento = document.getElementById('opt-atendimento');
    const valueAtendente = document.getElementById('opt-atendente');
    const valueSolucao = document.getElementById('inp-solucao');

    const enviarPara = valueEmail;
    let tituloMensagem = "";
    let mensagem = "";
    if(valueStatus.value == "Resolvido"){
        tituloMensagem = (`Chamado Resolvido`);
        mensagem = (`O operador ${valueAtendente.value}, encerrou o seu chamado com a solução: ${valueSolucao.value}`);
    }else{
        tituloMensagem = (`Status do chamado atualizado`);
        mensagem = (`O operador ${valueAtendente.value}, atualizou o status do seu chamado para ${valueStatus.value}`);
    }


    console.log(valueEmail.value);
    console.log(valueStatus.value);
    console.log(valueAtendimento.value);
    console.log("email atendente: ", valueAtendente.value);
    console.log(valueSolucao.value);
    
    //os nomes das variaveis tem q ser iguais as do CloseTicket
    const dadosParaAtualizar = {
        StatusChamado: valueStatus.value,
        tipoAtendimento: valueAtendimento.value,
        EmailUsuario: valueEmail.value,
        EmailAtendente: valueAtendente.value,
        SolucaoChamado: valueSolucao.value,
        To : enviarPara.value,
        Subject: tituloMensagem,
        Body: mensagem
    };

    try{
        const responseUpdate = await fetch(`${API_URL_ENCERRARCHAMADO}/${id}`, {
            method: 'PATCH',
            headers: obterHeaders(),
            body: JSON.stringify({
            //os nomes das variaveis tem q ser iguais as do CloseTicket no Postman
                statusChamadoDTO: valueStatus.value,
                tipoAtendimentoDTO: valueAtendimento.value,
                emailUsuarioDTO: valueEmail.value,
                emailAtendenteDTO: valueAtendente.value,
                solucaoChamadoDTO: valueSolucao.value,
                To : enviarPara.value,
                Subject: tituloMensagem,
                Body: mensagem

            })
        });

        if(!responseUpdate.ok){
            throw new Error('Chamado não encontrado');
        }

        alert(`Chamado com id ${id} atualizado`);

        carregarChamadosPaginados(1);//CARREGA OS CHAMADOS DA PÁGINA 1
        exibirDetalhes(id);

    }catch(error){
        console.log("erro na requisição ", error)
    }
}







//PARTE QUE PEGA O VALOR DOS BOTÕES DO FILTRO DE STATUS E USA NA FUNCTION exibirChamadosPorStatus
const btnsStatus = document.querySelectorAll('.btn-status');
const inputStatus = document.querySelector('.inputValueStatus');

btnsStatus.forEach(btnStatus =>{
    btnStatus.addEventListener('click', function(){
        inputStatus.value = this.getAttribute('data-value');
        console.log(inputStatus.value);
    })
})

//FUNCTION DE FILTRO DE STATUS
async function exibirChamadosPorStatus(){
    const lista = document.querySelector('.container');
    lista.innerHTML = ''; //limpou o container
    try{
        const response = await fetch(`${API_URL_FINDALL}`, {
            method: 'GET',
            headers: obterHeaders()
        });

        if(!response.ok){
            throw new Error('Chamados não encontrados');
        }

        const chamados = await response.json();
        chamados.forEach(chamado =>{
            if(chamado.statusChamado == inputStatus.value){
                const itemChamado = document.createElement('div'); //div de chamados
                itemChamado.classList.add('chamados');

                const containerPaginacao = document.getElementById('paginacao');
                containerPaginacao.style.display = "none";

                itemChamado.innerHTML += `
        
                <div class="comeco-chamado">
                    <p class="id-chamado">TI - ${chamado.id}</p> 
                    <p class="categoria-chamado">${chamado.categoria}</p> 
                </div>

                <div class="meio-chamado">
                    <h3 class="titulo-chamado">${chamado.tituloChamado}</h3>
                    <p class="descricao-chamado">${chamado.descricao}</p>
                </div>

                <div class="linha">
                    <hr style="height:0.5px;border-width:0;color:#334155;background-color:#334155">
                </div>

                <div class="final-chamado">
                    <p>${chamado.emailUsuario}</p>
                    
                <p>${chamado.statusChamado}</p>
                    
                    <button onclick="exibirDetalhes(${chamado.id})" id="detalhes">Detalhes</button>
                </div>
                `;

                //item.textContent += "<button>VerDeatlhes</button>"
                
                lista.appendChild(itemChamado);
            }})

    }catch(error){
        console.log("Erro ao puxar chamados", error);
    }

}

const API_URL_SEARCH = ' https://api-helpdesk-icom.onrender.com/api/chamados/search';
//FUNCTION DE FILTRO DE PESQUISA
async function pesquisar(){
    const lista = document.querySelector('.container');
    const termo = document.querySelector('.pesquisa');
    const valueTermo = termo.value;
    console.log(valueTermo);
    if(valueTermo == ""){
        termo.style.borderTop = "1px solid red";
        termo.style.borderLeft = "1px solid red";
        termo.style.borderBottom = "1px solid red";

        //alert("oi")
        setTimeout(() =>{
        termo.style.border = "none";
        }, 2000);

    }else{
        lista.innerHTML = '';

        try{
            const response = await fetch(`${API_URL_SEARCH}/${valueTermo}`, {
                method: 'GET',
                headers: obterHeaders()
            });

            if(!response.ok){
                throw new Error('Chamados não encontrados');
            }

            const chamadosPesquisa = await response.json();
            chamadosPesquisa.forEach(chamado =>{
                    const itemChamado = document.createElement('div'); //div de chamados
                    itemChamado.classList.add('chamados');

                    const containerPaginacao = document.getElementById('paginacao');
                    containerPaginacao.style.display = "none";

                    itemChamado.innerHTML += `
            
                    <div class="comeco-chamado">
                        <p class="id-chamado">TI - ${chamado.id}</p> 
                        <p class="categoria-chamado">${chamado.categoria}</p> 
                    </div>

                    <div class="meio-chamado">
                        <h3 class="titulo-chamado">${chamado.tituloChamado}</h3>
                        <p class="descricao-chamado">${chamado.descricao}</p>
                    </div>

                    <div class="linha">
                        <hr style="height:0.5px;border-width:0;color:#334155;background-color:#334155">
                    </div>

                    <div class="final-chamado">
                        <p>${chamado.emailUsuario}</p>
                        
                    <p>${chamado.statusChamado}</p>
                        
                        <button onclick="exibirDetalhes(${chamado.id})" id="detalhes">Detalhes</button>
                    </div>
                    `;

                    //item.textContent += "<button>VerDeatlhes</button>"
                    
                    lista.appendChild(itemChamado);
                })

        }catch(error){
            console.log("Erro ao puxar chamados", error);
        }
    }
    
    
}



//FUNCTION DE FILTRO DE STATUS MARCADO "TODOS"
async function exibirChamadosNoFiltro(){
    const lista = document.querySelector('.container');
    lista.innerHTML = ''; //limpou o container
    try{
        const response = await fetch(`${API_URL_FINDALL}`, {
            method: 'GET',
            headers: obterHeaders()
        });

        if(!response.ok){
            throw new Error('Chamados não encontrados');
        }

        const chamados = await response.json();
        chamados.forEach(chamado =>{
                const itemChamado = document.createElement('div'); //div de chamados
                itemChamado.classList.add('chamados');

                const containerPaginacao = document.getElementById('paginacao');
                containerPaginacao.style.display = "none";

                itemChamado.innerHTML += `
        
                <div class="comeco-chamado">
                    <p class="id-chamado">TI - ${chamado.id}</p> 
                    <p class="categoria-chamado">${chamado.categoria}</p> 
                </div>

                <div class="meio-chamado">
                    <h3 class="titulo-chamado">${chamado.tituloChamado}</h3>
                    <p class="descricao-chamado">${chamado.descricao}</p>
                </div>

                <div class="linha">
                    <hr style="height:0.5px;border-width:0;color:#334155;background-color:#334155">
                </div>

                <div class="final-chamado">
                    <p>${chamado.emailUsuario}</p>
                    
                <p>${chamado.statusChamado}</p>
                    
                    <button onclick="exibirDetalhes(${chamado.id})" id="detalhes">Detalhes</button>
                </div>
                `;

                //item.textContent += "<button>VerDeatlhes</button>"
                
                lista.appendChild(itemChamado);
            })

    }catch(error){
        console.log("Erro ao puxar chamados", error);
    }

}


//FUNCTION PARA VOLTAR PARA A PÁGINA DOS CHAMADOS DO DETALHE DO CHAMADO
function voltarPaginaChamados(){
    mostrarChamados.style.display = "block";
    detalheChamado.style.display = "none";

}

//CARREGA OS CHAMADOS DA PÁGINA 1
carregarChamadosPaginados(1);


//FUNCTION PARA IR DA TELA DE ABERTURA DE CHAMADOS ATÉ TODOS OS CHAMADOS
function mostrarTodosChamados(){
    mostrarForm.style.display = "none";
    if(emailConta == "pedro.conceicao@icom.com.br"){
        //exibe a tela com todos os chamados
        mostrarChamados.style.display = "block";
        console.log("acesso permitido")
    }else{
        //exibe a mensagem de acesso restrito
        mostrarChamados.style.display = "none";
        console.log("acesso negado")
        containerAcesso.style.display = "flex";
    }

    
}

//FUNCTION PARA MOSTRAR MEUS CHAMADOS
function exibirMeusChamados(){
   window.location.href = "meus_chamados.html";

}

//FUNCTION PARA MOSTRAR A SEÇÃO NA PÁGINA DE ABRIR CHAMADO
function mostrarFormChamado(){
    //if(emailConta != "pedro.conceicao@icom.com.br"){
        console.log("oi", emailConta)
        mostrarForm.style.display = "block";
        mostrarChamados.style.display = "none";
        detalheChamado.style.display = "none";
        containerAcesso.style.display = "none";
    //}
}





/*--------------------------------------------------------------------------------

                    JS DE ABRIR CHAMADO

----------------------------------------------------------------------------------*/
//identificação dos campos do formulário
const inputTitulo = document.getElementById('titulo_chamado');
//const inputEmail = document.getElementById('email_solicitante');
const inputSetor = document.getElementById('setor_solicitante');
const inputCategoria = document.querySelectorAll('.btn-categoria');
const inputHidden = document.getElementById('categoria_selecionada');
const inputDescricao = document.getElementById('descricao');
const inputImg = document.getElementById('img_chamado');
const buttonChamado = document.getElementById('enviar-chamado');

//cria o objeto FormData pra pegar a imagem
//se não tivesse imagem, seria JSON
const formData = new FormData();


document.getElementById('email_solicitante').value = emailConta;

const formularioChamado = document.getElementById('formChamado');

formularioChamado.addEventListener('submit', async function(e){
    e.preventDefault();

    console.log(inputTitulo.value);
    //console.log(inputEmail.value);
    console.log(inputSetor.value);
    console.log(inputHidden.value);
    console.log(inputDescricao.value);
    console.log(inputImg.value);

    formData.append('tituloChamado', inputTitulo.value);
    formData.append('setor', inputTitulo.value);
    formData.append('categoria', inputHidden.value);
    formData.append('descricao', inputDescricao.value);
    formData.append('statusChamado', "Aberto");
    formData.append('emailUsuario', emailConta);
    formData.append('to', "pedro.conceicao@icom.com.br");
    formData.append('subject', "Chamado aberto");
    formData.append('body', `O colaborador ${emailConta} abriu um chamado sobre ${inputHidden.value}`);
    console.log(Object.fromEntries(formData));


    if(inputImg.isDefaultNamespace.length > 0){
        //'arquivoImagem' é o parâmetro no controller IFormFile
        formData.append('arquivoImagem', inputImg.files[0]);
    }
    /*
    const novoChamado = {
        tituloChamado: inputTitulo.value,
        setor: inputSetor.value,
        categoria: inputHidden.value,
        descricao: inputDescricao.value,
        statusChamado: "Aberto",
        emailUsuario: posicaoOriginal.emailUsuario

    };*/

    try{
        const response = await fetch(API_URL_FINDALL,{
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
           // body: JSON.stringify(novoChamado)//converte o objeto JSON em texto
        })

        if(!response.ok){
            throw new Error(`Erro ao criar um chamado:  ${response.status}`)

            
        }

        const chamadoCriado = await response.json();

        //mensagem de sucesso
        alert(`Chamado criado: ${chamadoCriado.tituloChamado}`);
        console.log(inputHidden.value);

    }catch(error){
        alert("Por favor, selecione uma categoria")
        console.log("Erro na requisição: ", error);
        console.log(inputHidden.value);


    }

})

   




//FUNCTION PARA PEGAR O VALOR DA CATEGORIA SELECIONADA NA ABERTURA DE CHAMADO
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



