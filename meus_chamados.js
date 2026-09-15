//verifica se o usuário fez o login
const token = localStorage.getItem('token');
const emailConta = localStorage.getItem('email');


//manda o usuário pra página de login se não tiver feito o login
if(!token){
    window.location.href = 'index.html';
}

function obterHeaders(){
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
}

//FUNCTION PARA EXIBIR MEUS CHAMADOS
const API_URL_FINDALL = ' https://api-helpdesk-icom.onrender.com/api/chamados';

async function carregarMeusChamados(){
    try{
        const response = await fetch(API_URL_FINDALL, {
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

        const meusChamados = await response.json();
        console.log('Chamados recebidos: ', meusChamados);

        exibirMeusChamados(meusChamados);
    }catch(error){

        console.error('Erro ao buscar chamados: ', error);
    }

}

function logout(){
    localStorage.removeItem('accessToken');
    window.location.href = 'index.html';
}


//FUNCTION PARA EXIBIR MEUS  CHAMADOSs
function exibirMeusChamados(meusChamados){
    const lista = document.querySelector('.container');
    lista.innerHTML = ''; //limpou o container

    meusChamados.forEach(chamado =>{  

        if(chamado.emailUsuario == emailConta){
            const itemChamado = document.createElement('div'); //div de chamados
            itemChamado.classList.add('chamados');
    
            itemChamado.innerHTML = `
            
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
            `;
    
            //item.textContent += "<button>VerDeatlhes</button>"
            
            lista.appendChild(itemChamado);
        } 

       
        
    });
}


const mostrarChamados = document.querySelector('.mostrarChamados');
const detalheChamado = document.querySelector('#detalhe-chamado');
const API_BASE = ' https://api-helpdesk-icom.onrender.com'
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
        detalheChamado.style.display = "flex";//faz os containers ficarem lado a lado

        const detalheContainer = document.querySelector('.detalhe-container');

        detalheContainer.innerHTML = `
            <div class="detalhe-card">
                <div class="detalhe-comeco-chamado">
                    <p class="detalhe-id-chamado">ICOM - ${chamado.id}</p>
                    <p class="detalhe-categoria-chamado">${chamado.categoria}</p>
                    <p class="detalhe-status-chamado">${chamado.statusChamado}</p>
                </div>

               <h3 class="detalhe-titulo-chamado">${chamado.tituloChamado}</h3>

                <hr style="height:0.5px;border-width:0;color:#334155;background-color:#334155">
                
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
 
            </div>



        `;

        const solucaoContainer = document.querySelector('.container-solucao');

        if(chamado.solucaoChamado == null){
            //faz o fieldset da solução aparecer, mas vazio
            console.log("Sem solução");
            solucaoContainer.style.display = "none";
            solucaoContainer.innerHTML = "";
        }else{
            solucaoContainer.style.display = "block";
            solucaoContainer.innerHTML = `
            <div class = "solucao">
                <h3 class="titulo-resposta">Solução encontrada:</h3>
                <hr class="linha-resposta" style="height:0.5px;border-width:0;color:#334155;background-color:#334155;">
                <p class = "resposta">
                    ${chamado.solucaoChamado}
                </p>
            </div>
            </div>`;
            
        }
     

    }catch(error){
        console.log('Erro ao buscar detalhe do chamado: ', error);
    }
}

function voltarMeusChamados(){
    mostrarChamados.style.display = "block";
    detalheChamado.style.display = "none";
}

function mostrarFormChamado(){
    window.location.href = "chamados.html#novo-chamado";
}


function todosChamados(){
    if(emailConta != "pedro.conceicao@icom.com.br"){
        window.location.href = "chamados.html#novo-chamado";

    }else{
        window.location.href = "chamados.html?mostrar=todos-chamados";
    }
}


carregarMeusChamados();