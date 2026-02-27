<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.md">English</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

Una capa de políticas que hace que el comportamiento del agente esté **regido por preferencias**, en lugar de simplemente maximizar la eficiencia.

Realiza cuatro funciones, de manera confiable:

1) **Verifica** las políticas (detecta configuraciones incorrectas o inseguras antes de que se implementen).
2) **Estandariza** las políticas (las entradas equivalentes producen la misma salida).
3) **Compara y aprueba** los cambios (legibles por humanos, consentimiento explícito).
4) **Revierte** automáticamente (guarda la política anterior antes de sobrescribirla).

Esto es la infraestructura de seguridad básica que permite crear "agentes con límites".

---

## Idea central

Su agente genera planes candidatos. El "civility-kernel" decide qué sucede a continuación:

**generar → filtrar (restricciones estrictas) → puntuar (pesos) → elegir O preguntar**

Las restricciones estrictas son innegociables. Las preferencias suaves guían las compensaciones. La incertidumbre puede forzar la opción de "preguntar al humano".

---

## Instalación

```bash
npm i @mcptoolshop/civility-kernel
```

## El ciclo de gobernanza humana

Siempre puede ver lo que hace su política.
El agente debe mostrar los cambios antes de aplicarlos.
Puede revertir los cambios.
Nada se actualiza silenciosamente.

Previsualice el contrato de la política:
```bash
npm run policy:explain
```

Proponga una actualización (muestra la diferencia, solicita aprobación):
```bash
npm run policy:propose
```

Estandarice el archivo de política actual (normalización solo de formato):
```bash
npm run policy:canonicalize
```

### Seguridad de reversión automática

Al aplicar cambios, `policy-check` puede hacer una copia de seguridad de la política anterior primero:

```bash
npx tsx scripts/policy-check.ts policies/default.json --propose policies/proposed.json --write-prev policies/previous.json
```

## Archivos de políticas

Convención recomendada:

- `policies/default.json` — política activa
- `policies/previous.json` — objetivo de reversión automática
- `policies/profiles/*.json` — perfiles con nombre (trabajo / bajo costo / modo seguro)

## Opciones de la línea de comandos (policy-check)

- `--explain` — imprime un resumen de la política legible por humanos
- `--propose <file>` — verifica + muestra la diferencia estandarizada + solicita aprobación
- `--apply` — reescribe el archivo de política en formato estandarizado
- `--write-prev <file>` — hace una copia de seguridad de la política estandarizada anterior antes de sobrescribirla
- `--diff short|full` — "short" muestra los cambios principales; "full" muestra todo
- `--prev <file>` — modo de diferencia determinista para CI

## API pública

- `lintPolicy(policy, { registry, scorers })`
- `canonicalizePolicy(policy, registry, scorers?)`
- `diffPolicy(a, b, { mode })` (corta vs. completa)
- `explainPolicy(policy, registry, { format })`

## CI

Ejecuciones de CI:
- ejemplos
- pruebas
- compilación
- `policy-check` contra archivos de referencia (`policies/default.json` vs `policies/previous.json`)

Esto evita la implementación de políticas incorrectas o diferencias engañosas.

## Desarrollo

```bash
npm test
npm run build
npm run example:basic
npm run policy:check
```

## Seguridad y alcance de datos

Civility Kernel es una **biblioteca pura** — no realiza solicitudes de red, no recopila datos de telemetría, no tiene efectos secundarios.

- **Datos accedidos:** Lee archivos de políticas JSON del sistema de archivos local. Valida, estandariza y compara políticas dentro del proceso. Todas las operaciones son deterministas.
- **Datos NO accedidos:** No realiza solicitudes de red. No recopila datos de telemetría. No almacena credenciales. El kernel evalúa las restricciones de la política; no observa ni registra las acciones del agente.
- **Permisos requeridos:** Permiso de lectura del sistema de archivos para archivos de políticas JSON. Permiso de escritura solo cuando se solicita explícitamente a través de `--apply`.

Consulte [SECURITY.md](SECURITY.md) para informar sobre vulnerabilidades.

---

## Cuadro de evaluación

| Categoría | Puntuación |
|----------|-------|
| Seguridad | 10/10 |
| Manejo de errores | 10/10 |
| Documentación para operadores | 10/10 |
| Higiene de implementación | 10/10 |
| Identidad | 10/10 |
| **Overall** | **50/50** |

---

## Licencia

MIT (consulte LICENSE)

---

Creado por <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a
