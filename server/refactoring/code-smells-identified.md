# Code Smells Identificados

## 1. Uso de `any` explícito
- **Arquivos**: src/helpers/TokenService.ts, src/middlewares/authMiddleware.ts, src/models/User.ts
- **Linhas**: múltiplas ocorrências
- **Descrição**: O uso de `any` elimina a segurança de tipos do TypeScript.
- **Severidade**: Alta
- **Ferramenta**: ESLint (@typescript-eslint/no-explicit-any)

## 2. Uso excessivo de `console.log`
- **Arquivos**: src/app.ts, src/config/prisma.ts
- **Linhas**: múltiplas ocorrências
- **Descrição**: Polui os logs da aplicação e não deve ser usado em produção.
- **Severidade**: Média
- **Ferramenta**: ESLint (no-console)

## 3. Variável não utilizada
- **Arquivo**: src/controllers/UserController.ts
- **Linha**: 1
- **Descrição**: Interface `IUser` importada mas não utilizada.
- **Severidade**: Baixa
- **Ferramenta**: ESLint (@typescript-eslint/no-unused-vars)

## 4. Método longo - App.listen()
- **Arquivo**: src/app.ts
- **Linhas**: 54-65
- **Descrição**: Método `listen()` contém múltiplas responsabilidades: inicialização do servidor, configuração de shutdown handlers e logging.
- **Severidade**: Média
- **Problemas**: Viola o Single Responsibility Principle, dificulta testes unitários
- **Sugestão**: Extrair lógica de shutdown para método separado
