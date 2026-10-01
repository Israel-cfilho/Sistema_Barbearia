# 💈 Sistema Barbearia

Sistema web completo para **gerenciamento de uma barbearia**, desenvolvido com arquitetura separada entre frontend e backend.

O sistema permite administrar clientes, barbeiros, serviços e agendamentos, além de oferecer dashboards e relatórios específicos para os diferentes perfis de acesso.

---

## 🧩 Arquitetura

O projeto é dividido em duas aplicações principais:

```text
SistemaBarbearia/
│
├── frontend/     # Aplicação web
│
├── backend/      # API REST
│
└── README.md
```

### Frontend

Desenvolvido com:

* React
* Vite
* React Router
* CSS
* Lucide React
* React Toastify

### Backend

Desenvolvido com:

* Java 21
* Spring Boot
* Spring Web MVC
* Spring Data JPA
* Spring Security
* JWT
* PostgreSQL
* Lombok
* Spring Mail
* Maven

---

# 🚀 Funcionalidades

## 👤 Clientes

O sistema permite ao cliente:

* Criar uma conta
* Realizar login
* Recuperar senha
* Redefinir senha
* Visualizar serviços disponíveis
* Escolher barbeiro
* Realizar agendamentos
* Confirmar agendamentos
* Consultar seus agendamentos
* Atualizar seus dados pessoais

---

## 💈 Barbeiros

O perfil de barbeiro possui funcionalidades para:

* Visualizar dashboard
* Consultar agenda
* Acompanhar atendimentos
* Atualizar status dos atendimentos
* Consultar desempenho
* Gerenciar perfil

---

## 👑 Dono / Administrador

O perfil administrativo permite:

* Visualizar dashboard
* Gerenciar agendamentos
* Gerenciar barbeiros
* Gerenciar serviços
* Consultar relatórios
* Acompanhar informações do negócio

---

# 🔐 Segurança

A API utiliza **Spring Security** para controle de acesso e autenticação.

A autenticação é baseada em:

```text
JWT — JSON Web Token
```

O backend possui filtro próprio para validação dos tokens e configuração de segurança baseada nos papéis dos usuários.

---

# 🗂️ Estrutura do Backend

```text
backend/
└── src/
    └── main/
        ├── java/
        │   └── com/barbearia/sistema/
        │       │
        │       ├── config/
        │       │   ├── DataInitializer
        │       │   ├── JwtAuthFilter
        │       │   └── SecurityConfig
        │       │
        │       ├── controller/
        │       │   ├── AgendamentoController
        │       │   ├── AuthController
        │       │   ├── BarbeiroController
        │       │   ├── ClienteController
        │       │   ├── RelatorioController
        │       │   └── ServicoController
        │       │
        │       ├── dto/
        │       │
        │       ├── exception/
        │       │
        │       ├── model/
        │       │
        │       ├── repository/
        │       │
        │       ├── scheduler/
        │       │
        │       ├── service/
        │       │
        │       └── SistemaApplication
        │
        └── resources/
            ├── application.properties
            └── application-example.properties
```

---

# 🗃️ Principais entidades

O backend possui modelos relacionados a:

* Usuário
* Cliente
* Barbeiro
* Dono
* Serviço
* Agendamento
* Forma de pagamento
* Token de recuperação de senha

---

# 📡 API

A aplicação utiliza uma API REST para comunicação entre frontend e backend.

Os principais módulos da API são:

```text
/auth
/agendamentos
/barbeiros
/clientes
/servicos
/relatorios
```

Os endpoints são organizados por controllers e utilizam DTOs para entrada e saída de dados.

---

# 🛢️ Banco de dados

O projeto utiliza:

```text
PostgreSQL
```

Banco utilizado pelo projeto:

```text
barbearia_db
```

Configuração padrão:

```text
Host: localhost
Porta: 5432
Banco: barbearia_db
```

> **Importante:** as credenciais do banco devem ser configuradas localmente e não devem ser versionadas no Git.

---

# 📧 Recuperação de senha

O sistema possui integração com servidor SMTP para envio de e-mails.

A funcionalidade permite:

1. Solicitar recuperação de senha;
2. Gerar token de recuperação;
3. Enviar e-mail;
4. Acessar o processo de redefinição;
5. Definir uma nova senha.

---

# ⏰ Agendamentos

O sistema possui gerenciamento completo de agendamentos.

O fluxo principal é:

```text
Cliente
   ↓
Escolhe serviço
   ↓
Escolhe barbeiro
   ↓
Escolhe data/horário
   ↓
Confirma agendamento
   ↓
Agendamento registrado
   ↓
Barbeiro acompanha na agenda
   ↓
Atendimento realizado
```

O backend também possui um scheduler para processamento relacionado aos agendamentos.

---

# ⚙️ Configuração do Backend

Entre na pasta:

```bash
cd backend
```

Configure o arquivo:

```text
src/main/resources/application.properties
```

Exemplo de configuração do banco:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/barbearia_db
spring.datasource.username=postgres
spring.datasource.password=SUA_SENHA

server.port=8080
```

Também devem ser configuradas as informações relacionadas ao JWT e ao serviço de e-mail.

---

# ▶️ Executando o Backend

Com o Java 21 instalado:

### Linux / macOS

```bash
./mvnw spring-boot:run
```

### Windows

```bash
mvnw.cmd spring-boot:run
```

Ou utilizando o Maven instalado:

```bash
mvn spring-boot:run
```

A API ficará disponível, por padrão, em:

```text
http://localhost:8080
```

---

# ▶️ Executando o Frontend

Abra outro terminal e entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
npm run dev
```

O Vite disponibilizará a aplicação no endereço apresentado pelo terminal, normalmente:

```text
http://localhost:5173
```

---

# 🔄 Executando o projeto completo

Para executar o sistema localmente:

### Terminal 1 — Backend

```bash
cd backend
mvnw.cmd spring-boot:run
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Com os dois serviços ativos:

```text
┌─────────────────────────────┐
│          FRONTEND           │
│       React + Vite          │
│                             │
│     localhost:5173          │
└──────────────┬──────────────┘
               │
               │ HTTP / REST
               ▼
┌─────────────────────────────┐
│           BACKEND           │
│     Java + Spring Boot      │
│                             │
│     localhost:8080          │
└──────────────┬──────────────┘
               │
               │ JPA / Hibernate
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
│                             │
│       barbearia_db          │
└─────────────────────────────┘
```

---

# 🧪 Testes

O backend possui estrutura para testes automatizados utilizando o ecossistema de testes do Spring Boot.

Para executar:

```bash
mvn test
```

---

# 📦 Build

## Frontend

```bash
npm run build
```

## Backend

```bash
mvn clean package
```

O artefato gerado pelo Maven poderá ser executado com:

```bash
java -jar target/sistema-0.0.1-SNAPSHOT.jar
```

---

# 🔒 Boas práticas de segurança

Nunca publique no GitHub ou compartilhe publicamente:

* Senhas do PostgreSQL
* Senhas de e-mail
* Chaves secretas JWT
* Tokens
* Credenciais de produção
* Variáveis de ambiente sensíveis

Recomenda-se utilizar variáveis de ambiente ou arquivos de configuração locais para essas informações.

---

# 📌 Tecnologias

| Camada                        | Tecnologia      |
| ----------------------------- | --------------- |
| Frontend                      | React           |
| Build                         | Vite            |
| Estilização                   | CSS             |
| Roteamento                    | React Router    |
| Ícones                        | Lucide React    |
| Notificações                  | React Toastify  |
| Backend                       | Java            |
| Framework                     | Spring Boot     |
| Segurança                     | Spring Security |
| Autenticação                  | JWT             |
| Persistência                  | Spring Data JPA |
| ORM                           | Hibernate       |
| Banco de dados                | PostgreSQL      |
| E-mail                        | Spring Mail     |
| Gerenciamento de dependências | Maven           |

---

# 📄 Licença

Este projeto foi desenvolvido para fins de estudo e/ou utilização no gerenciamento de uma barbearia.

Consulte os responsáveis pelo projeto antes de utilizar, modificar ou distribuir o sistema em outros ambientes.
