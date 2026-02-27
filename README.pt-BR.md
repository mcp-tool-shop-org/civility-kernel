<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.md">English</a>
</p>

<div align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/civility-kernel/readme.png" alt="civility-kernel logo" width="360" />
</div>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/civility-kernel/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/civility-kernel/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License"></a>
  <a href="https://mcp-tool-shop-org.github.io/civility-kernel/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page"></a>
  <a href="https://www.npmjs.com/package/@mcptoolshop/civility-kernel"><img src="https://img.shields.io/npm/v/%40mcptoolshop%2Fcivility-kernel" alt="npm version"></a>
</p>

Uma camada de políticas que determina o comportamento do agente com base em preferências, em vez de apenas na maximização da eficiência.

Ele realiza quatro funções, de forma confiável:

1) **Políticas de verificação:** (detectam configurações incorretas ou inseguras antes de serem implementadas).
2) **Políticas de normalização:** (entradas equivalentes produzem a mesma saída).
3) **Comparação e aprovação:** (alterações legíveis por humanos, consentimento explícito).
4) **Reversão automática:** (salva a política anterior antes de substituí-la).

Este é o sistema de segurança, embora possa parecer entediante, que permite criar "agentes com limites definidos".

---

## Ideia central

O seu agente gera planos candidatos. O componente "civility-kernel" decide o que acontece em seguida:

**gerar → filtrar (restrições rígidas) → calcular pontuação (pesos) → escolher OU solicitar.**

As restrições rígidas são inegociáveis. As preferências flexíveis servem de guia para as decisões. A incerteza pode levar à necessidade de consultar um especialista humano.

---

## Instalar

```bash
npm i @mcptoolshop/civility-kernel
```

## O ciclo de governança humana

Você pode sempre verificar o que sua política faz.
O agente deve mostrar as alterações antes que elas sejam aplicadas.
Você pode reverter para uma versão anterior.
Nenhuma atualização é feita silenciosamente.

Visualizar o contrato da apólice:
```bash
npm run policy:explain
```

Propor uma atualização (mostra as diferenças e solicita aprovação):
```bash
npm run policy:propose
```

Normalizar o arquivo de política atual (apenas formatação):
```bash
npm run policy:canonicalize
```

### Segurança do rollback automático

Ao aplicar alterações, o comando `policy-check` pode, opcionalmente, fazer um backup da política antiga:

```bash
npx tsx scripts/policy-check.ts policies/default.json --propose policies/proposed.json --write-prev policies/previous.json
```

## Arquivos de configuração

Convenção recomendada:

- `policies/default.json` — política ativa
- `policies/previous.json` — alvo para reversão automática
- `policies/profiles/*.json` — perfis nomeados (trabalho / baixo atrito / modo de segurança)

## Opções da linha de comando (verificação de política)

- `--explain`: imprime um resumo da política em formato legível.
- `--propose <arquivo>`: analisa o código + mostra as diferenças normalizadas + solicita aprovação.
- `--apply`: reescreve o arquivo de política na forma normalizada.
- `--write-prev <arquivo>`: faz um backup da política anterior na forma normalizada antes de sobrescrevê-la.
- `--diff short|full`: "short" mostra as alterações mais importantes; "full" mostra tudo.
- `--prev <arquivo>`: modo de comparação determinístico para integração contínua.

## API pública

- `lintPolicy(política, { registro, critérios })`
- `canonicalizePolicy(política, registro, critérios?)`
- `diffPolicy(a, b, { modo })` (resumo vs. completo)
- `explainPolicy(política, registro, { formato })`

## CI

O processo de integração contínua (CI) executa:
- exemplos
- testes
- compilação
- uma verificação de políticas, comparando o arquivo `policies/default.json` com o arquivo `policies/previous.json`).

Isso evita o envio de políticas corrompidas ou diferenças (diffs) enganosas.

## Desenvolvimento

```bash
npm test
npm run build
npm run example:basic
npm run policy:check
```

## Escopo de segurança e dados

O Civility Kernel é uma **biblioteca pura** — não faz requisições de rede, não coleta dados de telemetria e não causa efeitos colaterais.

- **Dados acessados:** Lê arquivos de política em formato JSON do sistema de arquivos local. Valida, normaliza e compara documentos de política durante o processo. Todas as operações são determinísticas.
- **Dados NÃO acessados:** Não há requisições de rede. Não há coleta de dados de telemetria. Não há armazenamento de credenciais. O kernel avalia as restrições de política, mas não monitora nem registra as ações do agente.
- **Permissões necessárias:** Permissão de leitura do sistema de arquivos para os arquivos de política em formato JSON. Permissão de escrita apenas quando explicitamente solicitada através da opção `--apply`.

Consulte o arquivo [SECURITY.md](SECURITY.md) para informações sobre como reportar vulnerabilidades.

---

## Cartão de pontuação

| Categoria. | Pontuação. |
|----------|-------|
| Segurança. | 10/10 |
| Tratamento de erros. | 10/10 |
| Documentação para operadores. | 10/10 |
| Higiene no transporte. | 10/10 |
| Identidade. | 10/10 |
| **Overall** | **50/50** |

---

## Licença

MIT (ver LICENÇA).

---

Criado por <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>.
