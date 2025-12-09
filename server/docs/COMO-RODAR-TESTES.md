# Como Rodar os Testes

## Pré-requisitos

Antes de executar os testes, certifique-se de ter:

- **Node.js** instalado (versão 18 ou superior)
- **npm** ou **yarn** instalado
- Dependências do projeto instaladas

---

## Passo a Passo

### 1. Instalar Dependências

Se ainda não instalou as dependências do projeto:

```bash
cd server
npm install
```

Ou se estiver na raiz do projeto:

```bash
npm install
```

### 2. Gerar o Cliente Prisma

O Prisma precisa gerar o cliente antes de rodar os testes:

```bash
npm run prisma:generate
```

**Nota:** Os testes usam mocks do Prisma, então não é necessário ter o banco de dados rodando.

---

## Executar os Testes

### Opção 1: Executar Todos os Testes (Recomendado)

```bash
npm test
```

**O que faz:**
- Executa todos os testes unitários
- Mostra o resultado no terminal
- Tempo de execução: ~1.6 segundos

**Saída esperada:**
```
PASS  tests/unit/test_ReservationRepository.ts
PASS  tests/unit/test_RoomRepository.ts
PASS  tests/unit/test_UserRepository.ts
PASS  tests/unit/test_ReservationServices.ts
PASS  tests/unit/test_RoomServices.ts
PASS  tests/unit/test_AuthMiddleware.ts

Test Suites: 6 passed, 6 total
Tests:       67 passed, 67 total
Time:        1.6 s
```

---

### Opção 2: Executar Testes com Cobertura

Para gerar o relatório de cobertura:

```bash
npm run test:coverage
```

**O que faz:**
- Executa todos os testes
- Gera relatório de cobertura no terminal
- Cria relatório HTML em `tests/coverage-results/index.html`
- Cria arquivo JSON em `tests/coverage-results/coverage-summary.json`

**Saída esperada no terminal:**
```
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   71.42 |    61.25 |   78.04 |   72.09 |
-------------------|---------|----------|---------|---------|
```

**Para ver o relatório HTML:**
```bash
# No macOS
open tests/coverage-results/index.html

# No Linux
xdg-open tests/coverage-results/index.html

# No Windows
start tests/coverage-results/index.html
```

---

### Opção 3: Executar Testes em Modo Watch

Para executar os testes automaticamente quando arquivos são modificados:

```bash
npm run test:watch
```

**O que faz:**
- Executa os testes uma vez
- Fica observando mudanças nos arquivos
- Re-executa os testes automaticamente quando detecta alterações
- Útil durante o desenvolvimento

**Para sair:** Pressione `q` ou `Ctrl+C`

---

### Opção 4: Executar um Arquivo de Teste Específico

Para executar apenas um arquivo de teste:

```bash
# Exemplo: executar apenas testes do ReservationRepository
npm test -- tests/unit/test_ReservationRepository.ts

# Ou usando o padrão do Jest
npx jest tests/unit/test_ReservationRepository.ts
```

---

### Opção 5: Executar Testes por Padrão de Nome

Para executar testes que correspondem a um padrão:

```bash
# Executar todos os testes de Repository
npm test -- --testNamePattern="Repository"

# Executar todos os testes de Services
npm test -- --testNamePattern="Services"
```

---

### Opção 6: Executar um Teste Específico

Para executar apenas um teste específico dentro de um arquivo:

```bash
# Executar apenas o teste "deve criar uma reserva com dados válidos"
npm test -- -t "deve criar uma reserva com dados válidos"
```

---

## 📊 Verificar Resultados

### No Terminal

Após executar `npm test`, você verá:

- **Test Suites:** Quantidade de arquivos de teste executados
- **Tests:** Quantidade total de testes executados
- **Time:** Tempo total de execução
- **Status:** `passed` ou `failed` para cada teste

### Relatório de Cobertura

Após executar `npm run test:coverage`, você pode:

1. **Ver no terminal:** Métricas resumidas
2. **Abrir o HTML:** Navegar até `tests/coverage-results/index.html`
3. **Ver detalhes por arquivo:** Clicar em qualquer arquivo no relatório HTML

---

## Exemplo Completo

```bash
# 1. Navegar para o diretório do servidor
cd server

# 2. Instalar dependências (se necessário)
npm install

# 3. Gerar Prisma Client (se necessário)
npm run prisma:generate

# 4. Executar todos os testes
npm test

# 5. Executar testes com cobertura
npm run test:coverage

# 6. Abrir relatório HTML (macOS)
open tests/coverage-results/index.html
```

---

## Resumo dos Comandos

| Comando | Descrição |
|---------|-----------|
| `npm test` | Executa todos os testes |
| `npm run test:coverage` | Executa testes e gera relatório de cobertura |
| `npm run test:watch` | Executa testes em modo watch |
| `npm test -- <arquivo>` | Executa um arquivo específico |
| `npm test -- -t "nome"` | Executa um teste específico |

---

## Documentação Adicional

- **Relatório de Testes:** `docs/testing-report.md`
- **Relatório de Cobertura:** `docs/coverage-report.md`
- **Configuração do Jest:** `jest.config.js`

---
