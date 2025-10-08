# 🏨 Roomly - Sistema de Reservas de Salas

Um sistema completo de gerenciamento de reservas de salas desenvolvido com **Node.js**, **TypeScript**, **Prisma**, **PostgreSQL** e **React**.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Qualidade de Código](#-qualidade-de-código)
- [Logs](#-logs)
- [Contribuição](#-contribuição)

## 🎯 Visão Geral

O Roomly é uma aplicação full-stack que permite:

- **👥 Gerenciamento de Usuários**: Criação, autenticação e controle de acesso
- **🏢 Gerenciamento de Salas**: Cadastro e configuração de salas disponíveis
- **📅 Sistema de Reservas**: Agendamento e controle de reservas
- **🔐 Autenticação JWT**: Sistema seguro de login e autorização
- **📊 Logs Estruturados**: Monitoramento e debugging avançado

## 🛠 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Winston** - Sistema de logging
- **JWT** - Autenticação
- **bcrypt** - Criptografia de senhas

### Frontend
- **React** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Material-UI** - Componentes de UI
- **React Router** - Roteamento
- **Axios** - Cliente HTTP

### DevOps & Qualidade
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Git** - Controle de versão

## 🏗 Arquitetura

O projeto segue os princípios de **Clean Architecture** e **SOLID**:

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (React)       │◄──►│   (Node.js)     │
│                 │    │                 │
│   - Components  │    │   - Controllers │
│   - Services    │    │   - Services    │
│   - Pages       │    │   - Repositories│
└─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Database       │
                       │   (PostgreSQL)   │
                       │                 │
                       │   - Users        │
                       │   - Rooms        │
                       │   - Reservations │
                       └─────────────────┘
```

### Padrões Implementados

- **Repository Pattern** - Separação entre lógica de negócio e acesso a dados
- **Service Layer** - Encapsulamento da lógica de negócio
- **Controller Pattern** - Separação de responsabilidades HTTP
- **Dependency Injection** - Injeção de dependências via construtores

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **PostgreSQL** (versão 13 ou superior)
- **Git**

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd boaspraticas
```

### 2. Instale as dependências

```bash
# Backend
cd server
npm install

# Frontend
cd ../front
npm install
```

### 3. Configure o banco de dados

```bash
# Crie um banco PostgreSQL
createdb roomly

# Configure as variáveis de ambiente
cp server/.env.example server/.env
```

### 4. Configure as variáveis de ambiente

Edite o arquivo `server/.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/roomly"
JWT_SECRET="seu-jwt-secret-aqui"
PORT=3000
LOG_LEVEL="info"
NODE_ENV="development"
```

## ⚙️ Configuração

### Banco de Dados

```bash
cd server

# Execute as migrações
npx prisma migrate dev

# Gere o cliente Prisma
npx prisma generate
```

### Frontend

```bash
cd front

# Configure a URL da API
echo "VITE_API_URL=http://localhost:3000" > .env
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento

#### Backend
```bash
cd server
npm run dev
```

#### Frontend
```bash
cd front
npm run dev
```

### Produção

#### Backend
```bash
cd server
npm run build
npm start
```

#### Frontend
```bash
cd front
npm run build
npm run preview
```

## 📁 Estrutura do Projeto

```
boaspraticas/
├── server/                 # Backend (Node.js + TypeScript)
│   ├── src/
│   │   ├── controllers/    # Controladores HTTP
│   │   ├── services/       # Lógica de negócio
│   │   ├── repositories/   # Acesso a dados
│   │   ├── models/         # Interfaces e tipos
│   │   ├── middlewares/    # Middlewares do Express
│   │   ├── helpers/        # Utilitários
│   │   ├── utils/          # Utilitários (Logger)
│   │   ├── config/         # Configurações
│   │   └── routes/         # Rotas da API
│   ├── prisma/            # Schema e migrações
│   ├── logs/              # Arquivos de log
│   └── refactoring/       # Documentação de refatoração
├── front/                 # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── service/       # Serviços de API
│   │   └── assets/        # Recursos estáticos
└── README.md
```

## 🔌 API Endpoints

### Autenticação
- `POST /auth/login` - Login do usuário
- `POST /auth/register` - Registro de usuário

### Usuários
- `GET /users` - Listar usuários
- `GET /users/:id` - Buscar usuário por ID
- `POST /users` - Criar usuário
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

### Salas
- `GET /rooms` - Listar salas
- `GET /rooms/:id` - Buscar sala por ID
- `POST /rooms` - Criar sala
- `PUT /rooms/:id` - Atualizar sala
- `DELETE /rooms/:id` - Deletar sala

### Reservas
- `GET /reservations` - Listar reservas
- `GET /reservations/:id` - Buscar reserva por ID
- `POST /reservations` - Criar reserva
- `PUT /reservations/:id` - Atualizar reserva
- `DELETE /reservations/:id` - Deletar reserva

### Health Check
- `GET /health-check` - Status da aplicação

## 🎯 Qualidade de Código

O projeto implementa rigorosos padrões de qualidade:

### Métricas de Qualidade
- **Score**: 8.5/10
- **Complexidade Ciclomática**: Baixa (1-3)
- **Cobertura de Testes**: Em implementação
- **Code Smells**: Identificados e corrigidos

### Refatorações Realizadas
1. ✅ **Remoção de tipos `any`** - Segurança de tipos
2. ✅ **Substituição de `console.log`** - Logging estruturado
3. ✅ **Extração de métodos longos** - Responsabilidade única
4. ✅ **Remoção de código morto** - Limpeza de código

### Padrões de Código
- **Nomenclatura**: PascalCase para classes, camelCase para métodos
- **Funções**: 3-8 linhas em média (excelente)
- **Formatação**: 2 espaços, aspas duplas
- **Arquitetura**: Repository + Service + Controller

## 📊 Logs

O sistema implementa logging estruturado com Winston:

### Níveis de Log
- **error** - Erros críticos
- **warn** - Avisos
- **info** - Informações gerais
- **debug** - Debugging detalhado

### Arquivos de Log
- `logs/combined.log` - Todos os logs
- `logs/error.log` - Apenas erros

### Exemplo de Log
```json
{
  "level": "info",
  "message": "✅ Servidor rodando em http://localhost:3000",
  "service": "roomly-api",
  "timestamp": "2025-09-29 21:17:24"
}
```

## 🧪 Testando a API

### Health Check
```bash
curl http://localhost:3000/health-check
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm start           # Executar em produção
npm run lint        # Verificar código
npm run type-check  # Verificar tipos
```

### Frontend
```bash
npm run dev         # Desenvolvimento
npm run build       # Build para produção
npm run preview     # Preview da build
npm run lint        # Verificar código
```

## 📚 Documentação Adicional

- [Relatório de Qualidade](./server/refactoring/quality-report.md)
- [Code Smells Identificados](./server/refactoring/code-smells-identified.md)
- [Log de Refatorações](./server/refactoring/refactoring-log.md)
- [Exemplos Antes-Depois](./server/refactoring/before-after-examples/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Pedro Paulo** - *Desenvolvimento* - [GitHub](https://github.com/pedropaulocg)

## 🙏 Agradecimentos

- Comunidade TypeScript
- Equipe do Prisma
- Desenvolvedores do React
- Comunidade Node.js

---

**Desenvolvido com ❤️ e boas práticas de desenvolvimento**
