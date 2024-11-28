# Step 1: Build the Angular app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Step 2: Serve the app using Nginx
FROM nginx:alpine
COPY --from=build /app/dist/client /usr/share/nginx/html
COPY default.nginx /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]