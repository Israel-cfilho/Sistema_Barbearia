# 💈 Sistema Barbearia — Frontend

Frontend do **Sistema Barbearia**, desenvolvido com **React** e **Vite**, responsável pela interface web utilizada por clientes, barbeiros e administradores.

A aplicação possui páginas e funcionalidades específicas para cada perfil de usuário, incluindo autenticação, agendamentos, serviços, gerenciamento de perfil, dashboards e relatórios.

---

## 🚀 Tecnologias utilizadas

* **React**
* **Vite**
* **JavaScript**
* **React Router DOM**
* **CSS3**
* **Lucide React**
* **React Toastify**
* **ESLint**

O projeto utiliza **CSS puro**, organizado em arquivos próprios para estilização dos componentes e páginas.

---

## 📁 Estrutura do projeto

```text
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │   ├── cortes/
│   │   ├── barbeariaVilaBranca.png
│   │   └── logo.png
│   │
│   ├── Components/
│   │   ├── BarbeiroSidebar/
│   │   ├── ClienteHeader/
│   │   └── DonoSidebar/
│   │
│   ├── pages/
│   │   ├── Agendamentos/
│   │   ├── Barbeiro/
│   │   ├── Cadastro/
│   │   ├── ConfirmarAgendamento/
│   │   ├── Dono/
│   │   ├── EscolherAcesso/
│   │   ├── EsqueciSenha/
│   │   ├── Login/
│   │   ├── MeusAgendamentos/
│   │   ├── NotFound/
│   │   ├── PerfilCliente/
│   │   ├── RedefinirSenha/
│   │   └── Servicos/
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── eslint.config.js
```

---

## 👥 Perfis de acesso

O frontend possui interfaces específicas para os diferentes perfis do sistema.

### 👤 Cliente

O cliente pode:

* Criar uma conta;
* Realizar login;
* Recuperar a senha;
* Redefinir a senha;
* Visualizar os serviços disponíveis;
* Escolher barbeiro;
* Realizar agendamentos;
* Confirmar agendamentos;
* Consultar seus agendamentos;
* Visualizar informações do perfil;
* Atualizar seus dados.

### 💈 Barbeiro

O barbeiro possui acesso a:

* Dashboard;
* Agenda de atendimentos;
* Visualização dos agendamentos;
* Acompanhamento dos atendimentos;
* Informações de desempenho;
* Gerenciamento do perfil.

### 👑 Dono / Administrador

O perfil administrativo possui funcionalidades para:

* Visualizar dashboard;
* Gerenciar agendamentos;
* Gerenciar barbeiros;
* Gerenciar serviços;
* Consultar relatórios;
* Acompanhar informações da barbearia.

---

## 🎨 Estilização

A interface utiliza **CSS3 puro**, sem frameworks de estilização.

Os estilos são organizados junto às páginas e componentes da aplicação, permitindo personalização completa da identidade visual da barbearia.

Entre os recursos utilizados estão:

* CSS responsivo;
* Flexbox;
* CSS Grid;
* Media Queries;
* Animações e transições;
* Variáveis CSS;
* Efeitos de hover;
* Layouts adaptáveis para diferentes tamanhos de tela.

---

## 🧭 Navegação

A navegação entre as páginas é realizada utilizando **React Router DOM**.

O sistema possui rotas destinadas aos diferentes fluxos da aplicação, incluindo:

```text
Login
Cadastro
Serviços
Agendamentos
Confirmação de agendamento
Meus agendamentos
Perfil
Dashboard do barbeiro
Dashboard administrativo
Recuperação de senha
Redefinição de senha
Página não encontrada
```

---

## 🔐 Autenticação

O frontend realiza a autenticação através da API REST disponibilizada pelo backend.

Após o login, o usuário recebe as informações necessárias para autenticação das requisições e acesso às funcionalidades correspondentes ao seu perfil.

O controle de acesso é integrado ao sistema de segurança implementado no backend com **JWT e Spring Security**.

---

## 🔗 Comunicação com o Backend

O frontend se comunica com o backend através de requisições HTTP para a API REST.

Em ambiente local, o backend é executado normalmente em:

```text
http://localhost:8080
```

Enquanto o frontend é executado pelo Vite em:

```text
http://localhost:5173
```

Fluxo da aplicação:

```text
┌─────────────────────────┐
│        React            │
│       Frontend          │
│                         │
│   localhost:5173        │
└────────────┬────────────┘
             │
             │ HTTP / REST
             ▼
┌─────────────────────────┐
│     Spring Boot         │
│        Backend          │
│                         │
│   localhost:8080        │
└─────────────────────────┘
```

---

## 📦 Instalação

Primeiramente, entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

---

## ▶️ Executando em desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço da aplicação, normalmente:

```text
http://localhost:5173
```

---

## 🏗️ Build de produção

Para gerar a versão otimizada para produção:

```bash
npm run build
```

O resultado será disponibilizado na pasta:

```text
dist/
```

Para visualizar o build localmente:

```bash
npm run preview
```

---

## 🧹 ESLint

Para verificar possíveis problemas no código:

```bash
npm run lint
```

---

## 🖥️ Responsividade

A aplicação foi desenvolvida para funcionar em diferentes tamanhos de tela, utilizando CSS responsivo.

São considerados diferentes formatos de dispositivos, como:

* Computadores;
* Notebooks;
* Tablets;
* Smartphones.

---

## 🔔 Notificações

O projeto utiliza **React Toastify** para exibição de mensagens e notificações ao usuário.

Exemplos:

* Sucesso;
* Erros;
* Avisos;
* Confirmações;
* Feedback de operações.

---

## 🎨 Ícones

Os ícones utilizados na interface são fornecidos pelo **Lucide React**, permitindo uma utilização consistente dos elementos visuais da aplicação.

---

## 📌 Scripts disponíveis

| Comando           | Descrição                            |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Inicia o ambiente de desenvolvimento |
| `npm run build`   | Gera o build de produção             |
| `npm run preview` | Executa uma prévia do build          |
| `npm run lint`    | Verifica problemas com ESLint        |

---

## 🔗 Backend

O backend do sistema está localizado em:

```text
../backend
```

Ele é responsável pelas regras de negócio, autenticação, banco de dados, agendamentos, usuários, serviços, barbeiros e relatórios.

Consulte o `README.md` da pasta `backend` para mais informações.

---

## 📄 Licença

Projeto desenvolvido para fins de estudo e/ou utilização no gerenciamento de uma barbearia.
