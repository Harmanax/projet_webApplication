Pour utiliser l'application il faut :

avoir une base MongoDB op�rationnelle du nom de : nomadikgames

une collection dans cette base au nom de : games

avoir un serveur node pour pouvoir utiliser l'application (lui faire executer le script server.js)

se connecter sur localhost:3000 pour utiliser l'application une fois que le serveur node est actif

utilisation de l'application :

l'application sert � scrapper des �l�ments de jeux du play store,

pour se faire il faut aller sur le Google playstore, choisir un jeu, copier l'url de ce jeu et
la coller dans notre application, en cliquant sur le sur le bouton "tester" le scrapping s'effectue
et l'application r�cup�re les �l�ments voulus puis les int�gres dans la base mongoDB
(l'application affiche aussi les �l�ments r�cup�r�s).