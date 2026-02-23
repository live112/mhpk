# Etapa de construcción
FROM node:22-alpine as build

# Establecer el directorio de trabajo en la imagen
WORKDIR /app

# Copiar el archivo package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos de construcción de la etapa de compilación al servidor nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Se crea el archivo de configuracion de nginx para evitar el error de 404
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Exponer el puerto 80 para servir la aplicación
EXPOSE 80

# Comando para iniciar el servidor nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
