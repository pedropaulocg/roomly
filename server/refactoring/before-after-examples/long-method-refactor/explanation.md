# Refatoração de Método Longo - App.listen()

## Problema
O método `App.listen()` estava violando o Princípio da Responsabilidade Única ao lidar com múltiplas responsabilidades:
1. Inicialização do servidor
2. Tratamento de sinais de shutdown
3. Logging

## Solução: Extrair Método
Aplicada a técnica de refatoração **Extract Method** para separar as responsabilidades.

## Benefícios
- ✅ **Responsabilidade Única**: Cada método tem um propósito claro
- ✅ **Melhor Testabilidade**: Lógica de shutdown pode ser testada independentemente
- ✅ **Legibilidade Melhorada**: Código é mais auto-documentado
- ✅ **Manutenibilidade**: Mudanças na lógica de shutdown são isoladas

## Code Smell Corrigido
- **Tipo**: Método Longo
- **Severidade**: Média
- **Localização**: src/app.ts:54-65
- **Status**: ✅ Corrigido

## Técnica de Refatoração
- **Padrão**: Extract Method
- **Princípio**: Princípio da Responsabilidade Única
- **Resultado**: Método reduzido de 12 linhas para 4 linhas, com método auxiliar de 7 linhas extraído
