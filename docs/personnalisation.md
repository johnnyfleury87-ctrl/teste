# Guide rapide de personnalisation

Ce fichier explique comment adapter rapidement le contenu sans modifier le moteur de l'application.

## 1. Remplacer les textes

Le point d'entree principal est [js/scenes.js](../js/scenes.js).

Pour chaque scene, vous pouvez changer :

- label : le nom court visible dans l'interface
- title : le titre principal
- subtitle : le resume d'introduction
- body : les paragraphes visibles
- speechText : le texte prononce par la synthese vocale

Conseil : garder un speechText proche du body pour que la lecture audio et la lecture ecran racontent la meme chose.

## 2. Changer l'image de demonstration

Actuellement, la scene de preuve visuelle utilise l'image :

- [image/Capture d'ecran 2026-04-21 141151.png](../image/Capture%20d'ecran%202026-04-21%20141151.png)

Pour la remplacer :

1. ajouter une nouvelle image dans le dossier image
2. mettre a jour la propriete src de la scene concernee dans [js/scenes.js](../js/scenes.js)
3. ajuster alt et caption si necessaire

## 3. Personnaliser le CTA final

La scene conclusion contient un bouton de contact dans [js/scenes.js](../js/scenes.js).

Remplacer :

- mailto:contact@example.com

par votre email reel, ou par une URL vers LinkedIn, Calendly ou un portfolio.

## 4. Ajuster l'apparence

Les styles sont repartis ainsi :

- [css/base.css](../css/base.css) : variables, couleurs, typographie, reset
- [css/layout.css](../css/layout.css) : structure generale et responsive
- [css/components.css](../css/components.css) : cartes, boutons, avatar, media
- [css/animations.css](../css/animations.css) : transitions et etat de parole

Pour une personnalisation rapide, modifier en priorite les variables CSS definies dans [css/base.css](../css/base.css).

## 5. Ajouter un nouveau theme dans le menu

1. creer la scene dans [js/scenes.js](../js/scenes.js)
2. ajouter son identifiant dans themeOrder
3. verifier que back pointe vers menu
4. definir next si vous voulez l'inclure dans la navigation sequentielle

## 6. Ce qu'il ne faut pas toucher en premier

Pour eviter de casser le socle, ne commencez pas par modifier :

- [js/app.js](../js/app.js) si vous voulez seulement changer le contenu
- [js/speech.js](../js/speech.js) si vous ne changez pas la logique vocale
- [js/ui.js](../js/ui.js) si vous ne changez pas la structure de rendu

Tant que la structure des scenes reste coherente, le moteur continuera a fonctionner.