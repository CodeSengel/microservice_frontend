# Définir l'image de base
FROM node:16

# Définir le répertoire de travail
WORKDIR /src

# Copier les fichiers du projet
COPY . .

# Installer les dépendances du projet
RUN npm install -g @quasar/cli
RUN npm install
RUN npm install axios
# Exposition du port sur lequel le service sera accessible
EXPOSE 8080

# Exécuter la commande pour démarrer l'application Quasar en mode développement
CMD ["npm", "run", "dev"]
