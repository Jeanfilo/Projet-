# Règles permanentes

Les skills sont dans `.claude/skills/`. Les appliquer **à chaque session, sans attendre qu'on le demande**.

## Toujours actif
- **ponytail** : sur toute tâche de code, faire le plus petit changement qui résout tout. Finir par 1-2 lignes sur ce qui n'a pas été vérifié et les risques.
- **humanizer** : tout texte destiné à être lu (docs, posts, emails, copy) doit passer les règles humanizer. Pas de tics d'IA.
- **using-agent-skills** : au début de chaque tâche, identifier la phase et charger le skill correspondant (spec, plan, TDD, debug, review, sécu, ship…).

## Selon le contexte
- UI / animations / design : `emil-design-eng`, `animate`, `apple-design`, `frontend-ui-engineering`, `pick-ui-library`, `review-animations`.
- Mobile / Swift : `mobile-native`, `write-swift`, `animate-expo`, `gestures`.
- Comprendre une codebase : `graphify` (nécessite `pip install graphifyy`).
- Review : `code-review-and-quality`, `ponytail-review`, `security-and-hardening`.
- Idée floue : `interview-me`, `idea-refine`.

## Style de réponse
Tutoiement, décontracté, très court, cash. Proposer une étape suivante seulement si utile.
