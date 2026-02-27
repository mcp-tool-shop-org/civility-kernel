<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

Un livello di policy che determina il comportamento dell'agente in base a **preferenze**, anziché esclusivamente alla massimizzazione dell'efficienza.

Esegue quattro funzioni, in modo affidabile:

1) **Analizza** le policy (rilevando configurazioni errate o non sicure prima della distribuzione).
2) **Normalizza** le policy (input equivalenti producono lo stesso output).
3) **Confronta le modifiche e approva** (visualizzazione leggibile, consenso esplicito).
4) **Esegue il rollback automatico** (salva la policy precedente prima di sovrascriverla).

Questo è il meccanismo di sicurezza che consente di creare "agenti con dei limiti".

---

## Idea principale

Il tuo agente genera piani candidati. Il "civility-kernel" decide cosa succede dopo:

**genera → filtra (vincoli rigidi) → assegna punteggio (pesi) → scegli OPPURE chiedi**

I vincoli rigidi sono non negoziabili. Le preferenze "soft" guidano le scelte. L'incertezza può richiedere di "chiedere all'operatore".

---

## Installazione

```bash
npm i @mcptoolshop/civility-kernel
```

## Il ciclo di governance gestito dall'operatore

Puoi sempre vedere cosa fa la tua policy.
L'agente deve mostrare le modifiche prima di applicarle.
Puoi eseguire il rollback.
Nessuna modifica viene applicata silenziosamente.

Visualizza il contratto della policy:
```bash
npm run policy:explain
```

Proponi un aggiornamento (mostra le differenze, richiede l'approvazione):
```bash
npm run policy:propose
```

Normalizza il file di policy corrente (solo formattazione):
```bash
npm run policy:canonicalize
```

### Rollback automatico sicuro

Quando si applicano le modifiche, `policy-check` può prima eseguire il backup della policy precedente:

```bash
npx tsx scripts/policy-check.ts policies/default.json --propose policies/proposed.json --write-prev policies/previous.json
```

## File di policy

Convenzione consigliata:

- `policies/default.json` — policy attiva
- `policies/previous.json` — destinazione del rollback automatico
- `policies/profiles/*.json` — profili denominati (lavoro / bassa complessità / modalità sicura)

## Opzioni della riga di comando (policy-check)

- `--explain` — stampa un riepilogo della policy leggibile
- `--propose <file>` — analizza + mostra le differenze normalizzate + richiede l'approvazione
- `--apply` — riscrive il file di policy nella forma normalizzata
- `--write-prev <file>` — esegue il backup della policy normalizzata precedente prima di sovrascriverla
- `--diff short|full` — `short` mostra le modifiche principali; `full` mostra tutto
- `--prev <file>` — modalità diff deterministica per CI

## API pubblica

- `lintPolicy(policy, { registry, scorers })`
- `canonicalizePolicy(policy, registry, scorers?)`
- `diffPolicy(a, b, { mode })` (short vs full)
- `explainPolicy(policy, registry, { format })`

## CI

Esecuzioni CI:
- esempi
- test
- build
- `policy-check` rispetto ai file di esempio (`policies/default.json` vs `policies/previous.json`)

Questo impedisce la distribuzione di policy errate o di differenze fuorvianti.

## Sviluppo

```bash
npm test
npm run build
npm run example:basic
npm run policy:check
```

## Sicurezza e ambito dei dati

Il "Civility Kernel" è una **libreria pura** — nessuna richiesta di rete, nessuna telemetria, nessun effetto collaterale.

- **Dati accessibili:** Legge file di policy JSON dal file system locale. Valida, normalizza e confronta i documenti di policy in memoria. Tutte le operazioni sono deterministiche.
- **Dati NON accessibili:** Nessuna richiesta di rete. Nessuna telemetria. Nessun archivio di credenziali. Il kernel valuta i vincoli della policy; non osserva né registra le azioni dell'agente.
- **Autorizzazioni richieste:** Autorizzazione di lettura del file system per i file di policy JSON. Autorizzazione di scrittura solo quando esplicitamente richiesta tramite `--apply`.

Consulta [SECURITY.md](SECURITY.md) per la segnalazione di vulnerabilità.

---

## Scorecard

| Categoria | Punteggio |
|----------|-------|
| Sicurezza | 10/10 |
| Gestione degli errori | 10/10 |
| Documentazione per gli operatori | 10/10 |
| Qualità del codice | 10/10 |
| Identità | 10/10 |
| **Overall** | **50/50** |

---

## Licenza

MIT (vedi LICENSE)

---

Creato da <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a
