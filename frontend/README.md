# 💈 Sistema Barbearia — Frontend

Frontend do sistema de gerenciamento de barbearia, desenvolvido com **React** e **Vite**.

A aplicação possui interfaces específicas para clientes, barbeiros e administradores/donos da barbearia, permitindo realizar agendamentos, consultar serviços, acompanhar atendimentos e gerenciar informações do estabelecimento.

---

## 🚀 Tecnologias utilizadas

* **React 19**
* **Vite 8**
* **React Router DOM 7**
* **Tailwind CSS 4**
* **Lucide React**
* **React Toastify**
* **JavaScript (ES Modules)**
* **ESLint**

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

## 👥 Perfis do sistema

O frontend possui interfaces para diferentes tipos de usuários:

### 👤 Cliente

* Cadastro e login
* Visualização dos serviços
* Agendamento de serviços
* Confirmação de agendamento
* Consulta dos próprios agendamentos
* Atualização do perfil
* Recuperação e redefinição de senha

### 💈 Barbeiro

* Dashboard
* Visualização da agenda
* Gerenciamento dos atendimentos
* Acompanhamento do desempenho
* Gerenciamento do perfil

### 👑 Dono / Administrador

* Dashboard administrativo
* Gerenciamento de agendamentos
* Gerenciamento de barbeiros
* Gerenciamento de serviços
* Relatórios
* Acompanhamento das informações da barbearia

---

## ⚙️ Instalação

### 1. Instalar as dependências

Dentro da pasta `frontend`:

```bash
npm install
```

### 2. Executar em desenvolvimento

```bash
npm run dev
```

Após iniciar, o Vite disponibilizará a aplicação no endereço informado pelo terminal, normalmente:

```text
http://localhost:5173
```

---

## 🏗️ Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

Para visualizar o build localmente:

```bash
npm run preview
```

---

## 🧹 Lint

Para verificar problemas no código:

```bash
npm run lint
```

---

## 🔗 Integração com o Backend

O frontend se comunica com a API REST desenvolvida em **Spring Boot**.

Por padrão, o backend da aplicação utiliza:

```text
http://localhost:8080
```

O backend é responsável por autenticação, usuários, agendamentos, serviços, barbeiros, relatórios e persistência dos dados.

---

## 🔐 Autenticação

A autenticação da aplicação utiliza **JWT (JSON Web Token)**.

O sistema possui diferentes níveis de acesso de acordo com o perfil do usuário, permitindo direcionar cada usuário para as funcionalidades correspondentes.

---

## 🎨 Interface

A aplicação utiliza componentes próprios e estilos específicos para cada página, além de:

* Ícones com Lucide React
* Notificações com React Toastify
* Layouts específicos por perfil
* Design responsivo
* Imagens e elementos visuais próprios da barbearia

---

## 📌 Scripts disponíveis

| Comando           | Função                                |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Executa o servidor de desenvolvimento |
| `npm run build`   | Gera o build de produção              |
| `npm run preview` | Visualiza o build de produção         |
| `npm run lint`    | Executa o ESLint                      |

---

## 🔗 Backend

O backend deste projeto está localizado em:

```text
../backend
```

Para informações sobre a arquitetura completa do sistema, consulte o `README.md` localizado na raiz do projeto.
