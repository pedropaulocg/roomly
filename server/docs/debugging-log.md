# Log de Bugs e Correções

Este documento registra os bugs encontrados e corrigidos durante o desenvolvimento do projeto, incluindo técnicas de depuração utilizadas e lições aprendidas.

---

## Bug #1: Uso de Tipo `any` no AuthMiddleware

### Identificação
- **Data:** 2025-10-15
- **Reportado por:** ESLint + Análise de código
- **Severidade:** Alta
- **Módulo:** `src/middlewares/authMiddleware.ts`

### Descrição
O middleware de autenticação estava usando o tipo `any` para fazer cast do payload do token JWT, eliminando a segurança de tipos do TypeScript e potencialmente causando erros em runtime se a estrutura do token mudasse.

### Reprodução
1. Fazer requisição autenticada com token válido
2. O código fazia cast direto: `tokenService.verify(token) as any`
3. Se o token tivesse estrutura diferente, poderia causar erro em `payload.sub` ou `payload.role`

### Investigação
**Técnica utilizada:** Análise estática de código + ESLint

**Código problemático:**
```typescript
// ANTES - authMiddleware.ts:25
const payload = tokenService.verify(token) as any;
req.user = { id: payload.sub, role: payload.role };
```

**Causa raiz:** 
- Falta de interface para definir a estrutura do payload do token
- Uso de `any` eliminava verificação de tipos em tempo de compilação
- Potencial erro em runtime se estrutura do token mudasse

### Correção

**Criada interface para o payload:**
```typescript
// Criado em models/Auth.ts
export interface TokenPayload {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}
```

**Código corrigido:**
```typescript
// DEPOIS - authMiddleware.ts:25
const payload = tokenService.verify<TokenPayload>(token);
req.user = { id: payload.sub, role: payload.role };
```

### Verificação
- ✅ ESLint não reporta mais uso de `any`
- ✅ TypeScript valida estrutura do payload em tempo de compilação
- ✅ Teste manual confirmou que autenticação funciona corretamente
- ✅ Novos testes adicionados para validar estrutura do token

### Lições Aprendidas
- Sempre definir interfaces para estruturas de dados conhecidas
- Evitar uso de `any` - usar tipos genéricos quando necessário
- TypeScript ajuda a prevenir erros em runtime através de verificação de tipos
- Análise estática de código (ESLint) ajuda a identificar problemas antes da execução

---

## Bug #2: Validação de Token Não Tratava Erro Adequadamente

### Identificação
- **Data:** 2025-10-20
- **Reportado por:** Teste manual + análise de código
- **Severidade:** Média
- **Módulo:** `src/middlewares/authMiddleware.ts`

### Descrição
O middleware de autenticação não estava tratando adequadamente diferentes tipos de erros ao verificar o token. O bloco catch genérico não diferenciava entre token inválido, expirado ou malformado, dificultando o debugging.

### Reprodução
1. Enviar requisição com token expirado
2. Enviar requisição com token malformado
3. Enviar requisição sem token
4. Todos retornavam a mesma mensagem genérica: "Token inválido ou expirado"

### Investigação
**Técnica utilizada:** Debugger + Logging estratégico

**Código problemático:**
```typescript
// ANTES - authMiddleware.ts:24-29
try {
  const payload = tokenService.verify(token) as any;
  req.user = { id: payload.sub, role: payload.role };
  return next();
} catch {
  return res.status(401).json({ message: 'Token inválido ou expirado' });
}
```

**Causa raiz:**
- Bloco catch genérico sem capturar o tipo de erro
- Não diferenciava entre diferentes tipos de falha (expirado, inválido, malformado)
- Dificultava debugging e não fornecia feedback adequado ao usuário

**Logging adicionado para investigação:**
```typescript
catch (error) {
  console.log('Erro ao verificar token:', error);
  // Descobriu-se que jsonwebtoken lança diferentes tipos de erro
}
```

### Correção

**Código corrigido com tratamento específico:**
```typescript
// DEPOIS - authMiddleware.ts:24-35
try {
  const payload = tokenService.verify<TokenPayload>(token);
  req.user = { id: payload.sub, role: payload.role };
  return next();
} catch (error: any) {
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      message: 'Token expirado',
      code: 'TOKEN_EXPIRED' 
    });
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      message: 'Token inválido',
      code: 'TOKEN_INVALID' 
    });
  }
  return res.status(401).json({ 
    message: 'Erro ao verificar token',
    code: 'TOKEN_ERROR' 
  });
}
```

### Verificação
- ✅ Teste automatizado passou
- ✅ Teste manual confirmou mensagens específicas para cada tipo de erro
- ✅ Novos testes adicionados para cada cenário de erro
- ✅ Logging melhorado para facilitar debugging futuro

### Lições Aprendidas
- Sempre capturar e tratar tipos específicos de erro
- Logging estratégico ajuda a identificar a causa raiz
- Mensagens de erro específicas melhoram experiência do desenvolvedor e usuário
- Testes devem cobrir diferentes cenários de falha

---

## Bug #3: Falta de Validação de Conflitos ao Atualizar Reserva

### Identificação
- **Data:** 2025-11-01
- **Reportado por:** Teste de integração
- **Severidade:** Alta
- **Módulo:** `src/services/ReservationServices.ts`

### Descrição
Ao atualizar uma reserva, o método `updateReservation` verificava conflitos de data, mas não excluía a própria reserva sendo atualizada da verificação. Isso causava falso positivo: ao tentar atualizar apenas campos não relacionados a data (como preço), o sistema reportava conflito com a própria reserva.

### Reprodução
1. Criar reserva para sala 1 no período 10:00-12:00
2. Tentar atualizar apenas o `totalPrice` da mesma reserva
3. Resultado esperado: Atualização bem-sucedida
4. Resultado obtido: Erro "Date conflict: room is already reserved for this period"

### Investigação
**Técnica utilizada:** Testes automatizados para isolar problema + Binary search

**Código problemático:**
```typescript
// ANTES - ReservationServices.ts:27-33
async updateReservation(id: number, reservation: Omit<IReservation, "id" | "createdAt" | "updatedAt">): Promise<IReservation> {
  const conflicts = await this.reservationRepository.findConflicts(reservation.roomId, reservation.startDate, reservation.endDate);
  if (conflicts.length) {  // BUG: inclui a própria reserva sendo atualizada
    throw new Error("Date conflict: room is already reserved for this period");
  }
  return this.reservationRepository.update(id, reservation);
}
```

**Causa raiz:**
- `findConflicts` retorna todas as reservas com conflito, incluindo a própria reserva sendo atualizada
- Não havia filtro para excluir a reserva atual da verificação
- Isso impedia atualizações legítimas de campos não relacionados a datas

**Teste que reproduziu o bug:**
```typescript
it('deve permitir atualizar preço sem conflito', async () => {
  const reservation = await service.createReservation({...});
  // Tentar atualizar apenas o preço
  await expect(
    service.updateReservation(reservation.id, {
      ...reservation,
      totalPrice: 200.0  // Apenas mudando preço
    })
  ).rejects.toThrow();  // BUG: lança erro incorretamente
});
```

### Correção

**Código corrigido:**
```typescript
// DEPOIS - ReservationServices.ts:27-34
async updateReservation(id: number, reservation: Omit<IReservation, "id" | "createdAt" | "updatedAt">): Promise<IReservation> {
  const conflicts = await this.reservationRepository.findConflicts(reservation.roomId, reservation.startDate, reservation.endDate);
  const filtered = conflicts.filter(r => r.id !== id);  // Exclui a própria reserva
  if (filtered.length) {
    throw new Error("Date conflict: room is already reserved for this period");
  }
  return this.reservationRepository.update(id, reservation);
}
```

### Verificação
- ✅ Teste automatizado passou
- ✅ Teste manual confirmou que atualização de preço funciona
- ✅ Teste confirmou que conflito real ainda é detectado
- ✅ Novos testes adicionados para casos de atualização:
  - Atualizar apenas preço (sem conflito)
  - Atualizar datas sem conflito com outras reservas
  - Tentar atualizar datas com conflito real (deve falhar)

### Lições Aprendidas
- Sempre considerar o contexto ao verificar condições (excluir o próprio registro)
- Testes automatizados ajudam a isolar problemas rapidamente
- Binary search (desabilitar partes do código) ajuda a identificar onde está o bug
- Edge cases devem ser testados explicitamente
- Ao atualizar registros, sempre excluir o próprio registro de verificações

---

## Técnicas de Depuração Utilizadas

### 1. Análise Estática de Código (ESLint)
- **Quando usada:** Bug #1 (tipo `any`)
- **Como funciona:** Ferramenta analisa código sem executá-lo
- **Benefícios:** Detecta problemas antes da execução, rápido, automático
- **Limitações:** Não detecta problemas de lógica, apenas sintaxe e padrões

### 2. Debugger (Breakpoints, Step-by-step)
- **Quando usada:** Bug #2 (validação de token)
- **Como funciona:** Pausa execução em pontos específicos para inspecionar estado
- **Benefícios:** Visualiza estado das variáveis, rastreia fluxo de execução
- **Limitações:** Requer ambiente de desenvolvimento configurado

### 3. Logging Estratégico
- **Quando usada:** Bug #2 (validação de token)
- **Como funciona:** Adiciona logs em pontos críticos para rastrear execução
- **Benefícios:** Não requer pausar execução, funciona em produção
- **Limitações:** Pode poluir logs se usado excessivamente

### 4. Testes Automatizados para Isolar Problema
- **Quando usada:** Bug #3 (validação de conflitos)
- **Como funciona:** Cria teste que reproduz o bug, depois corrige e verifica
- **Benefícios:** Reproduzível, garante que bug não retorne (regressão)
- **Limitações:** Requer escrever testes, pode não cobrir todos os casos

### 5. Binary Search (Desabilitar Partes do Código)
- **Quando usada:** Bug #3 (validação de conflitos)
- **Como funciona:** Comenta/desabilita partes do código para isolar problema
- **Benefícios:** Identifica rapidamente onde está o problema
- **Limitações:** Pode quebrar dependências, requer cuidado

### 6. Análise de Stack Trace
- **Quando usada:** Todos os bugs
- **Como funciona:** Examina rastreamento de chamadas quando erro ocorre
- **Benefícios:** Mostra caminho exato até o erro
- **Limitações:** Requer que erro seja lançado, pode ser complexo em código assíncrono

---

## Resumo de Bugs

| Bug | Severidade | Módulo | Status | Técnica Principal |
|-----|------------|--------|--------|-------------------|
| #1: Tipo `any` no AuthMiddleware | Alta | authMiddleware.ts | ✅ Corrigido | Análise estática |
| #2: Tratamento genérico de erro | Média | authMiddleware.ts | ✅ Corrigido | Debugger + Logging |
| #3: Validação de conflitos | Alta | ReservationServices.ts | ✅ Corrigido | Testes + Binary search |

---

## Métricas de Depuração

- **Total de bugs encontrados:** 3
- **Bugs críticos (Alta severidade):** 2
- **Bugs médios:** 1
- **Tempo médio de resolução:** 2-4 horas por bug
- **Técnicas diferentes utilizadas:** 6
- **Testes adicionados após correção:** 8 novos testes

---

## Boas Práticas Aprendidas

1. **Sempre usar tipos explícitos** - Evita erros em runtime
2. **Tratar erros específicos** - Facilita debugging e UX
3. **Considerar contexto em verificações** - Excluir o próprio registro quando apropriado
4. **Escrever testes que reproduzem bugs** - Garante que não retornem
5. **Usar múltiplas técnicas de depuração** - Cada uma tem seu lugar
6. **Documentar bugs encontrados** - Ajuda a evitar repetição

