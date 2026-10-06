# Sistema de Helpdesk & Chamados
 
 Uma aplicação full-stack desenvolvida para facilitar a abertura, triagem e acompanhamento de chamados e suporte interno de equipes.

Clique aqui para ver o sistema ao vivo: (https://help-desk-asp-net.vercel.app)

---

## 📌 Sobre o Projeto

Este projeto nasceu da necessidade de criar uma ferramenta prática e moderna para gerenciar solicitações internas de suporte. 

A aplicação conta com autenticação segura, envio de anexos/imagens e acompanhamento em tempo real do status de cada solicitação.

---

## 🚀 Funcionalidades Principais

- 🔐 **Login com a Google:** Acesso rápido e seguro utilizando a conta Google do usuário.
- 📝 **Abertura de Chamados:** Formulário intuitivo para registrar solicitações com:
  - Título e setor do solicitante
  - Categorização do problema
  - Descrição detalhada
  - Envio de imagem/anexo para demonstrar o problema
- 📋 **Painel Geral de Chamados:** Visualização de todos os tickets abertos no sistema.
- 👤 **Meus Chamados:** Aba exclusiva para o usuário acompanhar o histórico e o status dos seus próprios chamados.
- 📧 **Notificação por E-mail:** Integração automática para avisar os responsáveis assim que um novo chamado é registrado.

---

## 🛠️ Tecnologias e Ferramentas

O sistema foi construído de forma **desacoplada**, separando a interface visual do servidor e do banco de dados, seguindo padrões modernos da indústria:

### **Front-end (Interface Visual)**
- **HTML5 & CSS3:** Estrutura semântica e estilização visual com layout responsivo.
- **JavaScript (Vanilla):** Lógica da aplicação, integração com a API.

### **Back-end (Regras de Negócio e API)**
- **C# / ASP.NET Core:** Construção de uma Web API rápida para gerenciar os chamados e regras do sistema.

### **Banco de Dados**
- **MySQL (TiDB Cloud):** Banco de dados relacional hospedado na nuvem, garantindo disponibilidade.

### **Infraestrutura e Nuvem**
- **Docker:** Empacotamento da aplicação para rodar de forma padronizada e segura em qualquer servidor.
- **Render:** Hospedagem da API e do contêiner Docker na nuvem.
- **Vercel:** Hospedagem rápida e segura do front-end com certificado SSL (HTTPS).
- **Google Cloud Platform:** Configuração e segurança da autenticação OAuth 2.0.
- **Resend:** Serviço em nuvem para envio confiável de e-mails transacionais.
- **Git & GitHub:** Versionamento de código e fluxo de publicação contínua (CI/CD).
