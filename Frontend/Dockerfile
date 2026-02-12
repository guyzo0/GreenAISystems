FROM node:20-alpine AS build

WORKDIR /app

# Copier package.json et installer deps
COPY package*.json ./
RUN npm install

# Copier le code et build
COPY . .
RUN npm run build

# Stage 2 : serve
FROM nginx:alpine

# Copier le build dans Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]