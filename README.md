# Règle:
Le jeu de la vie se déroule sur une grille en 2 dimensions , chaque cellule de la grille peut être en vie ou morte, chaque cellule de la grille a 8 voisins , quand une cellule morte devient vivante quand elle est entouré de 3 cellules vivantes, une cellule vivante meurt si elle a moins de deux voisines en vies ou plus de 3 voisines en vie.

# Implémentation:
Les règles du jeu de la vie sont implémentés en javaScript , chaque cellule est représentée par un nombre , le premier bit indique si la cellule est en vie , les autres bits indiquent le nombre de voisins de la cellule ,notre grille n’est composé que de nombres ainsi on gagne en temps et en mémoire.

# Interface:
Il est possible de mettre en pause le jeu en appuyant sur la touche P.
Il est possible de zoomer sur la grille à l'aide de la barre en haut à gauche.
Il est possible de se déplacer dans la grille zoomé en scrollant avec la souris
Il est possible de changer l'état d'une cellule en cliquant dessus si le jeu est en pause

