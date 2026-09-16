# Zuba API

API do **Zuba**, um MVP de controle financeiro pessoal. O serviço concentra autenticação, contas de usuário, transações, consolidação mensal do dashboard e envio de lembretes de vencimento.

O projeto foi desenvolvido individualmente e integra a [aplicação web](https://github.com/dev-nelsonjr/Zuba-web) e o [aplicativo mobile](https://github.com/dev-nelsonjr/zuba-mobile).

**API em produção:** [zuba-api-jvzt.onrender.com](https://zuba-api-jvzt.onrender.com/health)

## Funcionalidades

- Cadastro e autenticação com JWT
- Atualização e remoção de conta
- Criação, consulta, edição e exclusão de transações
- Controle de transações pendentes e concluídas
- Consulta por mês e ano
- Consolidação de receitas, despesas e saldo mensal
- Endpoint dedicado ao dashboard dos clientes
- Lembretes de vencimento com Firebase Cloud Messaging
- Job de notificações executado por cron em container
- Validação de entrada e tratamento centralizado de erros
- Contrato HTTP documentado com OpenAPI
- Testes unitários e de integração das rotas

## Tecnologias

- Node.js e Koa
- PostgreSQL e Prisma ORM
- JSON Web Token e bcrypt
- Firebase Admin SDK
- Zod
- Jest e Supertest
- Docker e cron
- OpenAPI

## Arquitetura

```text
prisma/                  schema e migrações do banco
DOCS/                    definição e contrato OpenAPI gerado
src/
  data/                  acesso ao Prisma
  interfaces/firebase/   integração com Firebase Admin
  jobs/notifications/    job de lembretes de vencimento
  middlewares/           autenticação, validação e erros HTTP
  modules/               regras de usuários, transações e dashboard
  routes.js              contrato e composição das rotas
```

As rotas recebem e validam a requisição, os módulos concentram as regras de negócio e a camada de dados isola o acesso ao PostgreSQL. O dashboard funciona como uma composição dos dados mensais consumidos pelos clientes Web e Mobile.

## Executando localmente

### Pré-requisitos

- Node.js e Yarn
- Docker Desktop

```bash
git clone https://github.com/dev-nelsonjr/Zuba-api.git
cd Zuba-api
yarn install
```

Copie `.env.example` para `.env` e ajuste os valores:

```env
SERVER_PORT=9900
JWT_SECRET=change-me
CORS_ORIGIN=http://localhost:5173

DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=zuba
DB_URL=postgresql://postgres:postgres@localhost:5432/zuba
```

Suba o banco, gere o cliente do Prisma e aplique as migrações:

```bash
docker compose up -d db
yarn prisma generate
yarn db:migrate
```

Inicie a API:

```bash
yarn dev
```

O serviço ficará disponível em `http://localhost:9900`.

## Rotas principais

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verifica a disponibilidade da API |
| `POST` | `/signup` | Cria uma conta |
| `POST` | `/login` | Autentica um usuário |
| `PUT` | `/profile` | Atualiza a conta autenticada |
| `DELETE` | `/profile` | Remove a conta autenticada |
| `GET` | `/transactions?month={month}&year={year}` | Lista as transações do período |
| `POST` | `/transactions` | Cria uma transação |
| `PUT` | `/transactions/:id` | Atualiza uma transação |
| `DELETE` | `/transactions/:id` | Exclui uma transação |
| `GET` | `/dashboard?month={month}&year={year}` | Retorna o resumo e as transações do período |

As rotas de perfil, transações e dashboard exigem `Authorization: Bearer <token>`. O contrato completo é mantido em [`DOCS/openapi.json`](DOCS/openapi.json) e pode ser atualizado com:

```bash
yarn docs:generate
```

## Notificações

Configure um projeto no Firebase e forneça a credencial administrativa somente por variável de ambiente:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```

O valor deve conter o JSON completo em uma única linha. Essa credencial não deve ser adicionada ao repositório.

Para montar a aplicação e executar o job localmente:

```bash
yarn build
docker compose up --build cronjobs
```

## Qualidade

Os testes utilizam uma base separada derivada de `DB_URL`; mantenha o PostgreSQL disponível antes de executá-los.

```bash
yarn test
yarn lint:all
yarn build
```

## Deploy

O arquivo [`render.yaml`](render.yaml) descreve o serviço da API. Em produção, configure `DB_URL`, `CORS_ORIGIN` e `FIREBASE_SERVICE_ACCOUNT` no provedor de hospedagem. As migrações são aplicadas antes da inicialização do servidor.

## Escopo do MVP

O fluxo principal está completo: criar uma conta, autenticar, administrar transações e consultar o resultado mensal nos clientes Web e Mobile. Integração contínua, recuperação de senha e observabilidade mais detalhada permanecem como evoluções futuras.
