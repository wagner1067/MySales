# 🛒 MySales API

<p align="center">
  <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="Maintained">
  <img src="https://img.shields.io/badge/License-ISC-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/Node.js-v18%2B-green" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-6.0-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Tests-Jest%20%7C%20Supertest-red" alt="Jest">
</p>

## 📋 Sobre o Projeto

O **MySales** é uma API RESTful robusta desenvolvida para o gerenciamento de vendas, produtos, clientes e controle de acessos. O projeto foi construído seguindo os princípios de **Clean Architecture**, **DDD (Domain-Driven Design)** e **SOLID**, garantindo que a aplicação seja altamente testável, escalável e de fácil manutenção.

A API conta com autenticação JWT, controle de taxa de requisições (Rate Limiting) para segurança, cache em memória com Redis para otimização de performance, envio de e-mails para recuperação de senhas, além de uma cobertura completa de testes unitários e de integração utilizando Jest e Supertest.

---

## 🚀 Tecnologias e Ferramentas Utilizadas

O projeto utiliza as melhores práticas e bibliotecas modernas para o ecossistema Node.js com TypeScript:

- **Linguagem Principal**: [TypeScript](https://www.typescriptlang.org/) (v6.0)
- **Framework Web**: [Express](https://expressjs.com/) (v5.2)
- **Banco de Dados & ORM**: [PostgreSQL](https://www.postgresql.org/) com [TypeORM](https://typeorm.io/) (com suporte nativo a Migrations)
- **Cache & Rate Limiting**: [Redis](https://redis.io/) (`ioredis` & `rate-limiter-flexible`)
- **Injeção de Dependência**: [TSyringe](https://github.com/microsoft/tsyringe)
- **Testes Automáticos**: [Jest](https://jestjs.io/) e [Supertest](https://github.com/ladjs/supertest) para testes de integração
- **Validação de Dados**: [Celebrate](https://github.com/arb/celebrate) / [Joi](https://joi.dev/)
- **Segurança & Criptografia**: [BCrypt](https://github.com/kelektiv/node.bcrypt.js) e [JSON Web Token (JWT)](https://jwt.io/)
- **Upload de Arquivos**: [Multer](https://github.com/expressjs/multer)
- **Serviço de E-mail**: [Nodemailer](https://nodemailer.com/)

---

## 🛠️ Arquitetura e Estrutura do Projeto

A estrutura de pastas segue os padrões de uma arquitetura modular orientada a domínios e separada por camadas de infraestrutura compartilhada:

```text
src/
 ├── modules/                 # Domínios de negócio da aplicação (ex: products, customers, sales, users)
 │    ├── services/           # Regras de negócio e casos de uso (Use Cases)
 │    ├── infra/              # Implementações específicas de infraestrutura do módulo
 │    │    └── http/          # Controllers e Rotas específicas do módulo
 │    └── repositories/       # Contratos/Interfaces e implementações de repositórios (TypeORM ou Mocks)
 └── shared/                  # Recursos compartilhados globalmente
      ├── errors/             # Tratamento global de exceções (AppError)
      ├── container/          # Configuração do TSyringe para Injeção de Dependência
      └── infra/              # Infraestrutura global
           ├── http/          # Servidor Express, middlewares centrais e rotas globais
           └── typeorm/       # Configurações do Data Source, migrations e modelos de entidades
```
📖 Documentação da API (Postman)
Todas as rotas, exemplos de payload, parâmetros de URL e respostas esperadas estão documentadas publicamente. Você pode visualizar a documentação completa ou importá-la para o seu Postman pelo link abaixo:

🔗 [Acessar a Documentação Oficial do MySales no Postman](https://documenter.getpostman.com/view/38603911/2sBXwqqqMq)

⚙️ Configuração e Instalação
Pré-requisitos
Antes de iniciar, certifique-se de ter instalado em sua máquina:

Node.js (versão 18 ou superior)

Gerenciador de pacotes NPM ou Yarn

Instâncias do PostgreSQL e Redis ativas (pode ser via Docker)

Passo a Passo
Clonar o Repositório:
```
git clone https://github.com/wagner1067/MySales.git
cd MySales
```
Instalar as Dependências:
```
Bash
npm install
```
Variáveis de Ambiente:
Crie um arquivo .env na raiz do projeto e configure suas credenciais de acesso:
```
PORT=3333
APP_SECRET=sua_chave_secreta_jwt
APP_API_URL=http://localhost:3333

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=my_sales

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```
Executar as Migrations do Banco de Dados:
Para criar a estrutura de tabelas no PostgreSQL:
```
npm run migration:run
```
Iniciar a Aplicação em Modo de Desenvolvimento:
```
npm run dev
```
O servidor iniciará na porta configurada (padrão: http://localhost:3333).

🧪 Testes Automatizados (Jest & Supertest)
O projeto possui foco em qualidade de software e resiliência, isolando o banco de dados principal através de configurações específicas controladas via cross-env NODE_ENV=test.

Para rodar os testes de integração com sucesso, garanta que seu banco de dados de testes esteja configurado e execute:

```
# 1. Execute as migrations no banco de dados de teste
npm run migration:run:test

# 2. Execute a suíte de testes com Jest
npm run test
```
Os testes de integração simulam requisições HTTP reais completas usando o Supertest, batendo diretamente nos endpoints da aplicação, validando os middlewares de validação do Celebrate, as regras de negócios dos services e persistindo dados temporariamente no banco isolado para garantir o funcionamento ponta a ponta (E2E).

🛡️ Funcionalidades e Diferenciais Implementados

Autenticação Segura: Geração de tokens JWT e criptografia forte de senhas com bcrypt.

Validação Rigorosa: Middlewares do celebrate/joi validam o corpo da requisição, parâmetros de rotas e query strings antes de atingir os controllers.

Injeção de Dependências Dinâmica: Desacoplamento total utilizando @tsyringe para injetar repositórios e instanciar serviços.

Upload de Arquivos: Upload de avatares de usuários ou imagens de produtos usando o multer.

Recuperação de Senha: Fluxo de geração de tokens e envio automatizado de e-mails utilizando o nodemailer.

Segurança Contra Ataques: Limitação de chamadas de API por IP (rate-limiter-flexible) para prevenir ataques de força bruta ou DoS.

Performance Aprimorada: Cache inteligente de listagens volumosas (ex: produtos) utilizando redis e ioredis.

✒️ Autor
Desenvolvido com 💻 por Wagner.

Este projeto está sob a licença ISC.
