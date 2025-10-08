# 📡 API Documentation - Roomly

## Base URL
```
http://localhost:3000
```

## 🔐 Autenticação

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "user@example.com",
    "role": "CLIENT"
  }
}
```

## 👥 Usuários

### Listar Usuários
```http
GET /users
Authorization: Bearer <token>
```

### Buscar Usuário
```http
GET /users/:id
Authorization: Bearer <token>
```

### Criar Usuário
```http
POST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "password123",
  "role": "CLIENT"
}
```

### Atualizar Usuário
```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "João Silva Santos",
  "email": "joao.santos@example.com"
}
```

### Deletar Usuário
```http
DELETE /users/:id
Authorization: Bearer <token>
```

## 🏢 Salas

### Listar Salas
```http
GET /rooms
```

### Buscar Sala
```http
GET /rooms/:id
```

### Criar Sala
```http
POST /rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sala de Reunião A",
  "capacity": 10,
  "location": "Andar 1",
  "pricePerHour": 50.00,
  "pricePerDay": 400.00,
  "photo": "https://example.com/photo.jpg",
  "ownerId": 1
}
```

### Atualizar Sala
```http
PUT /rooms/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sala de Reunião A - Atualizada",
  "capacity": 15
}
```

### Deletar Sala
```http
DELETE /rooms/:id
Authorization: Bearer <token>
```

## 📅 Reservas

### Listar Reservas
```http
GET /reservations
Authorization: Bearer <token>
```

### Buscar Reserva
```http
GET /reservations/:id
Authorization: Bearer <token>
```

### Criar Reserva
```http
POST /reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "startDate": "2025-10-01T09:00:00Z",
  "endDate": "2025-10-01T11:00:00Z",
  "type": "HOURLY",
  "totalPrice": 100.00,
  "clientId": 1,
  "roomId": 1
}
```

### Atualizar Reserva
```http
PUT /reservations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "startDate": "2025-10-01T10:00:00Z",
  "endDate": "2025-10-01T12:00:00Z"
}
```

### Deletar Reserva
```http
DELETE /reservations/:id
Authorization: Bearer <token>
```

## 🏥 Health Check

### Status da API
```http
GET /health-check
```

**Resposta:**
```json
{
  "status": "ok"
}
```

## 📊 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Dados inválidos |
| 401 | Não autorizado |
| 404 | Não encontrado |
| 500 | Erro interno do servidor |

## 🔒 Autenticação

Todas as rotas protegidas requerem o header:
```http
Authorization: Bearer <seu-jwt-token>
```

## 📝 Tipos de Dados

### UserRole
```typescript
enum UserRole {
  OWNER = "OWNER",
  CLIENT = "CLIENT"
}
```

### ReservationType
```typescript
enum ReservationType {
  HOURLY = "HOURLY",
  DAILY = "DAILY"
}
```

## 🧪 Exemplos de Uso

### Fluxo Completo de Reserva

1. **Login**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

2. **Listar Salas Disponíveis**
```bash
curl http://localhost:3000/rooms
```

3. **Criar Reserva**
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "startDate": "2025-10-01T09:00:00Z",
    "endDate": "2025-10-01T11:00:00Z",
    "type": "HOURLY",
    "totalPrice": 100.00,
    "clientId": 1,
    "roomId": 1
  }'
```

## 📊 Monitoramento

### Logs em Tempo Real
```bash
cd server
npm run logs
```

### Prisma Studio
```bash
cd server
npm run prisma:studio
```

---

**📚 Para mais detalhes, consulte o [README.md](README.md) principal.**
