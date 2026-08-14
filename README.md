# Zuba API

API do **Zuba**, uma aplicação de controle financeiro pessoal. Este serviço centraliza autenticação, transações, consolidação mensal do dashboard e envio de notificações de vencimento.

O projeto foi desenvolvido individualmente como parte de uma formação prática em desenvolvimento de software e evoluiu para um MVP full stack composto por [aplicação web](https://github.com/dev-nelsonjr/Zuba-web), [aplicativo mobile](https://github.com/dev-nelsonjr/zuba-mobile) e esta API.

## Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Atualização e remoção de conta
- Criação, listagem, edição e remoção de transações
- Filtro de transações por mês
- Cálculo de receitas, despesas e saldo mensal
- Rota BFF que reúne os dados necessários ao dashboard
- Notificações de vencimento com Firebase Cloud Messaging
- Job agendado com cron e Docker
- Testes de integração das rotas

## Tecnologias

- Node.js e Koa
- PostgreSQL e Prisma ORM
- JSON Web Token e bcrypt
- Firebase Admin SDK
- Jest e Supertest
- Docker e cron
- Swagger/OpenAPI

## Estrutura principal

```text
prisma/                  schema e migrações do banco
src/
  data/                  cliente do Prisma
  interfaces/firebase/   integração com Firebase Admin
  jobs/notifications/    execução das notificações
  middlewares/           autenticação e middlewares HTTP
  modules/               regras de usuários, transações e BFF
  routes.js               rotas da aplicação
```

## Como executar localmente

### Pré-requisitos

- Node.js 18 ou superior
- Yarn 1
- Docker Desktop

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/dev-nelsonjr/Zuba-api.git
cd Zuba-api
yarn
```

Crie um arquivo `.env` na raiz:

```env
SERVER_PORT=9900
JWT_SECRET=troque-por-uma-chave-segura

DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=zuba
DB_URL=postgresql://postgres:postgres@localhost:5432/zuba
```

Suba o PostgreSQL e prepare o banco:

```bash
docker compose up -d db
yarn prisma generate
yarn prisma migrate dev
```

Inicie a API:

```bash
yarn dev
```

Por padrão, o serviço ficará disponível em `http://localhost:9900`.

## Rotas principais

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verifica se a API está disponível |
| `POST` | `/signup` | Cria uma conta |
| `POST` | `/login` | Autentica um usuário |
| `PUT` | `/profile` | Atualiza a conta autenticada |
| `DELETE` | `/profile` | Remove a conta autenticada |
| `GET` | `/transactions?month=10` | Lista transações do mês |
| `POST` | `/transactions` | Cria uma transação |
| `PUT` | `/transactions/:id` | Atualiza uma transação |
| `DELETE` | `/transactions/:id` | Remove uma transação |
| `GET` | `/dashboard?month=10` | Retorna o resumo mensal e suas transações |

As rotas de perfil, transações e dashboard exigem o header `Authorization: Bearer <token>`.

## Notificações

Para testar as notificações, configure um projeto no Firebase e informe a credencial do Firebase Admin pela variável:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```

Use o JSON completo em uma única linha e mantenha essa variável somente no ambiente local ou no serviço de hospedagem. Nunca publique essa credencial.

Depois, gere o build e suba o job agendado:

```bash
yarn build
docker compose up --build cronjobs
```

## Testes

Com o banco de testes configurado, execute:

```bash
yarn test
```

## Status

O projeto está em estágio de MVP: os principais fluxos financeiros estão implementados e integrados com os clientes web e mobile. Os próximos passos incluem ampliar a cobertura de testes, automatizar integração contínua e preparar uma estratégia de deploy.
