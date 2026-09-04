## Documentação e Fluxo da Página de Login (`login.html`)

## O arquivo `login.html` atua como a página de autenticação e acesso à plataforma. Sua estrutura é desenhada para garantir uma entrada rápida e segura para os usuários, guiando-os desde o preenchimento dos dados até a validação do sistema.


### **1. Estrutura Visual (`<body>`)**

Contém os elementos essenciais de interface com os quais o usuário interage para validar sua identidade.

**Formulário de Autenticação (`<form>`)**

* **Identificação do Usuário:** O campo principal oferece flexibilidade de acesso, permitindo que o usuário insira tanto o seu **Nome de usuário** quanto o seu **E-mail** cadastrado.
* **Credencial de Segurança:** Logo em seguida, apresenta-se o campo obrigatório para a inserção da **senha**.
* **Ação Principal:** Um botão de submissão (ex: "Entrar" ou "Login") que o usuário clica para confirmar o envio dos dados.

---

### **2. Fluxo de Interação do Usuário (User Flow)**

O fluxo descreve a jornada passo a passo do usuário ao tentar acessar sua conta, englobando as ações dele e as respostas do sistema:

* **Passo 1: Acesso e Inicialização**
O usuário acessa a página de login (geralmente vindo da página inicial `index.html` ou da página de cadastro `cadastro.html`). A interface aguarda a inserção dos dados.
* **Passo 2: Preenchimento de Dados**
O usuário preenche o primeiro campo com seu Nome de Usuário ou E-mail e o segundo campo com a sua Senha secreta.
* **Passo 3: Submissão (Ação do Usuário)**
O usuário clica no botão de Login para enviar o formulário. Neste momento, os dados são enviados para o sistema validar.
* **Passo 4: Validação (Resposta do Sistema)**
O sistema processa as informações e decide qual caminho seguir:
* **Cenário de Sucesso:** Se o e-mail/usuário e a senha estiverem corretos, o acesso é autorizado e o usuário é **redirecionado** automaticamente para a área logada da plataforma (como o painel de cursos ou dashboard).
* **Cenário de Falha:** Se as credenciais não baterem, o sistema bloqueia o acesso e o fluxo é interrompido. A página exibe uma **mensagem de erro** visual (ex: "Usuário ou senha incorretos"), solicitando que ele corrija os dados e tente novamente.


* **Passo 5: Rotas Alternativas (Escape)**
Caso o usuário perceba que não tem uma conta ao chegar nessa tela, o fluxo deve prever um link para redirecioná-lo para a página de criação de conta (`cadastro.html`), ou uma opção de recuperação de senha (caso tenha esquecido).