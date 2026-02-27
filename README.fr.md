<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.md">English</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

Une couche de politique qui fait que le comportement de l'agent est régi par des **préférences** plutôt que par une simple maximisation de l'efficacité.

Elle effectue quatre tâches, de manière fiable :

1) **Vérification** des politiques (détection des configurations incorrectes ou dangereuses avant leur déploiement).
2) **Normalisation** des politiques (les entrées équivalentes produisent la même sortie).
3) **Comparaison des différences + approbation** des modifications (facile à comprendre par l'humain, consentement explicite).
4) **Rétrogradation automatique** (sauvegarde de la politique précédente avant de la remplacer).

Il s'agit de la partie essentielle de la sécurité qui vous permet de créer des "agents avec des limites".

---

## Idée principale

Votre agent génère des plans candidats. Le "civility-kernel" décide de ce qui se passe ensuite :

**génération → filtrage (contraintes strictes) → notation (poids) → choix OU demande**

Les contraintes strictes sont non négociables. Les préférences permettent de trouver des compromis. L'incertitude peut nécessiter une "demande à l'humain".

---

## Installation

```bash
npm i @mcptoolshop/civility-kernel
```

## La boucle de gouvernance humaine

Vous pouvez toujours voir ce que fait votre politique.
L'agent doit afficher les modifications avant qu'elles ne soient appliquées.
Vous pouvez effectuer une rétrogradation.
Rien ne se met à jour silencieusement.

Prévisualisez le contrat de la politique :
```bash
npm run policy:explain
```

Proposez une mise à jour (affiche les différences, demande une approbation) :
```bash
npm run policy:propose
```

Normalisez le fichier de politique actuel (normalisation du format uniquement) :
```bash
npm run policy:canonicalize
```

### Rétrogradation automatique pour la sécurité

Lors de l'application des modifications, `policy-check` peut d'abord sauvegarder l'ancienne politique :

```bash
npx tsx scripts/policy-check.ts policies/default.json --propose policies/proposed.json --write-prev policies/previous.json
```

## Fichiers de politique

Convention recommandée :

- `policies/default.json` — politique active
- `policies/previous.json` — cible de rétrogradation automatique
- `policies/profiles/*.json` — profils nommés (travail / faible friction / mode sécurisé)

## Options de la ligne de commande (policy-check)

- `--explain` — affiche un résumé de la politique facile à comprendre
- `--propose <file>` — vérification + affichage des différences normalisées + demande d'approbation
- `--apply` — réécrit le fichier de politique dans un format normalisé
- `--write-prev <file>` — sauvegarde de l'ancienne politique normalisée avant de la remplacer
- `--diff short|full` — `short` affiche les modifications principales ; `full` affiche tout
- `--prev <file>` — mode de comparaison différentielle CI déterministe

## API publique

- `lintPolicy(policy, { registry, scorers })`
- `canonicalizePolicy(policy, registry, scorers?)`
- `diffPolicy(a, b, { mode })` (court vs complet)
- `explainPolicy(policy, registry, { format })`

## CI

Exécutions CI :
- exemples
- tests
- construction
- `policy-check` par rapport aux fichiers de configuration (`policies/default.json` vs `policies/previous.json`)

Cela empêche le déploiement de politiques incorrectes ou de différences trompeuses.

## Développement

```bash
npm test
npm run build
npm run example:basic
npm run policy:check
```

## Sécurité et portée des données

Le "Civility Kernel" est une **bibliothèque pure** — aucune requête réseau, aucune télémétrie, aucun effet secondaire.

- **Données accessibles :** Lecture de fichiers de politique JSON à partir du système de fichiers local. Validation, normalisation et comparaison des différences des documents de politique en interne. Toutes les opérations sont déterministes.
- **Données non accessibles :** Aucune requête réseau. Aucune télémétrie. Aucun stockage d'informations d'identification. Le noyau évalue les contraintes de la politique ; il n'observe ni ne journalise les actions de l'agent.
- **Autorisations requises :** Accès en lecture au système de fichiers pour les fichiers de politique JSON. Écriture uniquement lorsque cela est explicitement demandé via `--apply`.

Consultez [SECURITY.md](SECURITY.md) pour signaler les vulnérabilités.

---

## Tableau de bord

| Catégorie | Score |
|----------|-------|
| Sécurité | 10/10 |
| Gestion des erreurs | 10/10 |
| Documentation pour les opérateurs | 10/10 |
| Qualité du déploiement | 10/10 |
| Identité | 10/10 |
| **Overall** | **50/50** |

---

## Licence

MIT (voir LICENSE)

---

Créé par <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>
