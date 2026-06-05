FROM nginx:1.25

# Копируем наш Nginx конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем уже готовый React build
COPY build /usr/share/nginx/html

EXPOSE 9000
CMD ["nginx", "-g", "daemon off;"]