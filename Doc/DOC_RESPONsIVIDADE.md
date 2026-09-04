## Documentação de Responsividade Integrada (`cadastro.html`, `login.html`, `recuperar-senha.html`, `index.html`)

A responsividade destas páginas é estruturada para garantir uma experiência de navegação consistente e acessível em qualquer dispositivo. O maior foco das adaptações ocorre na **barra de navegação (Navbar)**, que utiliza um menu hambúrguer para se adequar de forma inteligente a telas menores, otimizando o espaço visual do usuário, e nas caixas de **Formulários**, que se moldam para garantir uma boa usabilidade.

---

### **1. Estrutura de Responsividade Fluida (Global)**

Antes dos pontos de quebra específicos, o layout já se ajusta de forma contínua através do uso de unidades relativas de medida.

**Unidades Relativas (`vw`, `%`, `rem`)**

* **Contêineres e Elementos Principais:** O uso de classes como `.content-block` (com `max-width: 75%`) e botões como `.main-button` (com `min-width: 20%`) garante que a largura desses elementos se adapte automaticamente. Eles encolhem ou esticam naturalmente de acordo com a largura total da tela do navegador, impedindo que o layout quebre.

---

### **2. Estrutura Principal dos Formulários (CSS Específico)**

Enquanto o CSS Global define a base de todo o site (fontes, barra de navegação, botões gerais e rodapé), o código Cadastro/Login/Recuperação foca exclusivamente em estruturar, embelezar e adaptar a caixa do formulário de entrada de dados.

**Estrutura Principal do Formulário**

* **`form`:** Introduz o uso de CSS Grid (`display: grid`) com um espaçamento (`gap`) de `1.5rem` para separar cada bloco de dados do usuário.
* **`#form-box`:** Cria um contêiner escuro (`background-color: #333`) com bordas arredondadas (`30px`), centralizado na tela (`justify-self: center`) e limitando a largura inicial a `60%`.
* **`.campo`:** Aplica Flexbox (`display: flex`) para organizar cada dupla de "texto + campo de digitação", usando `justify-content: space-between` para empurrar um para cada lado.
* **`#form-confirm`:** Garante que o botão final de enviar/confirmar fique centralizado.

**Estilização Interna (Textos e Inputs)**

* **Textos (`#form-box h1`, `p`, `label`):** Define tamanhos específicos, travando o título em `3rem` e as *labels* e parágrafos descritivos em `22px`.
* **Campos de digitação (`input`):** Remove as bordas padrão (`border: none`), arredonda os cantos (`30px`) e aplica um `padding` de `0.7rem` para criar uma área de clique mais confortável.

---

### **3. Pontos de Quebra e Adaptação de Layout (Media Queries)**

O código CSS utiliza regras de `@media` para alterar radicalmente a exibição de elementos quando a tela atinge larguras específicas, criando a transição perfeita do desktop para o mobile.

#### **Adaptações da Navegação e Layout Geral**

* **Limpeza Visual (Até 776px)**
* `@media screen and (max-width: 776px):` Em telas que começam a ficar estreitas, o sistema oculta detalhes secundários, como o ícone (`i`) que acompanha o título (`.tittle`), priorizando o espaço para elementos essenciais da barra superior.
* **Transição Principal do Menu (Até 720px)**
* `@media screen and (max-width: 720px):` Este é o *breakpoint* (ponto de quebra) mais importante da navegação. O sistema oculta os botões fixos de login e cadastro na barra superior (`#auth-buttons { display: none; }`). No lugar deles, passa a exibir a estrutura do **menu hambúrguer** lateral (`#nav-drawer-container { display: flex; }`), adaptando a navegação de forma ideal para tablets e dispositivos móveis.
* **Ajustes Proporcionais (Até 470px)**
* `@media screen and (max-width: 470px):` Afeta telas menores, ajustando o tamanho da fonte do título principal na barra de navegação (`nav h1`) e do ícone do menu hambúrguer (`#nav-drawer i`). A transição utiliza a unidade fluida `vw` (Viewport Width), permitindo que os elementos escalem perfeitamente.
* **Otimização para Smartphones Menores (Até 428px)**
* `@media screen and (max-width: 428px):` Focado em smartphones de tela pequena. O sistema reduz o espaçamento interno (`padding`) de seções como o rodapé/contato (`#contato`). Além disso, altera dinamicamente o tamanho das fontes dos títulos e textos usando `vw`, fazendo com que a tipografia diminua ou aumente de forma estritamente proporcional à largura exata da tela do dispositivo, evitando cortes de texto ou quebras indesejadas.

#### **Regras de Responsividade Específicas dos Formulários**

* **Trava de Crescimento (`min-width: 430px` e `900px`):** Protege o formulário em telas maiores. Em monitores (acima de `900px`), o formulário para de crescer usando porcentagem e trava em exatos `600px` de largura, evitando que os campos fiquem esticados e difíceis de ler.
* **Mudança para Empilhamento (`max-width: 688px`):** O Flexbox da classe `.campo` muda de linha para `flex-direction: column`. Isso faz com que as *labels* fiquem em cima e os *inputs* embaixo, o que é essencial para formulários em celulares.
* **Otimização para Celulares (`max-width: 475px` e `428px`):** O `#form-box` perde as margens laterais e passa a ocupar `95%` da tela. O `padding` e o tamanho da fonte da *label* passam a usar a unidade `vw`, garantindo que os elementos escalem proporcionalmente na tela pequena sem quebrar o layout.