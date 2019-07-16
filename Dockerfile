FROM nginx
MAINTAINER scott.chen@sixonetech.com
RUN mkdir -p /usr/share/game/catpunch
RUN mkdir -p /etc/nginx/ssl
COPY nginx.conf /etc/nginx/nginx.conf
COPY catpunch-web.conf /etc/nginx/conf.d/default.conf
COPY weberverbygo_proxy.conf /etc/nginx/conf.d/weberverbygo_proxy.conf
COPY CatPunch /usr/share/game/catpunch
COPY CatPunch/locales /usr/share/game/catpunch/dist/locales
VOLUME ["/usr/share/game/catpunch/dist"]
VOLUME ["/etc/nginx/conf.d"]
VOLUME ["/etc/nginx/ssl"]
EXPOSE 80
EXPOSE 443
EXPOSE 8000
