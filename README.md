# Présentation Interactive

Application statique de présentation professionnelle (HTML/CSS/JS), compatible GitHub Pages.

## Objectif

Fournir une présentation interactive avec scènes, navigation, visuels et lecture vocale navigateur, sans backend.

## Lancer en local

```bash
cd /workspaces/teste
python3 -m http.server 8000
```

Ouvrir ensuite http://localhost:8000.

## Déploiement GitHub Pages

Le projet est servi directement depuis la racine avec `index.html`.

1. Commit et push sur la branche `main`.
2. Ouvrir le dépôt GitHub.
3. Aller dans `Settings`.
4. Ouvrir `Pages`.
5. Dans `Build and deployment`:
6. Choisir `Source: Deploy from a branch`.
7. Sélectionner `Branch: main` et `Folder: / (root)`.
8. Cliquer `Save`.
9. Attendre la publication et ouvrir l'URL fournie par GitHub.

## Lien public

À renseigner après publication :

- https://<votre-utilisateur>.github.io/<votre-repo>/

## Notes techniques

- Entrée: `index.html`
- Projet 100% statique (pas de backend)
- La synthèse vocale dépend du navigateur (Web Speech API)