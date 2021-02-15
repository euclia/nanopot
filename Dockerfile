FROM nginx
COPY dist/nanopot /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/

EXPOSE 80