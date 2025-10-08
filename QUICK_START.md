# 🚀 Quick Start - Roomly

## ⚡ Setup Rápido (5 minutos)

### 1. Pré-requisitos
```bash
# Verifique se tem Node.js 18+
node --version

# Verifique se tem PostgreSQL
psql --version
```

### 2. Clone e Instale
```bash
git clone <url-do-repositorio>
cd boaspraticas

# Backend
cd server
npm install

# Frontend
cd ../front
npm install
```

### 3. Configure o Banco
```bash
# Crie o banco
createdb roomly

# Configure as variáveis (copie e edite)
cp server/.env.example server/.env
# Edite server/.env com suas credenciais do PostgreSQL
```

### 4. Execute o Setup Automático
```bash
cd server
npm run setup
```

### 5. Inicie os Serviços
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd front
npm run dev
```

### 6. Acesse a Aplicação
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Health**: http://localhost:3000/health-check

## 🧪 Teste Rápido

### 1. Verifique se está funcionando
```bash
curl http://localhost:3000/health-check
```

### 2. Monitore os logs
```bash
cd server
npm run logs
```

### 3. Acesse o Prisma Studio (opcional)
```bash
cd server
npm run prisma:studio
```

## 🆘 Problemas Comuns

### Erro de conexão com banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Teste: `psql -h localhost -U seu_usuario -d roomly`

### Erro de dependências
```bash
# Limpe e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Porta já em uso
```bash
# Mude a porta no .env
PORT=3001
```

## 📚 Próximos Passos

1. Leia o [README.md](README.md) completo
2. Explore a [documentação de qualidade](server/refactoring/quality-report.md)
3. Veja os [exemplos de refatoração](server/refactoring/before-after-examples/)

---

**🎉 Pronto! Sua aplicação está rodando!**
