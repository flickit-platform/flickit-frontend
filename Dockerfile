# ---- build (glibc) ----
FROM node:22.12.0-bookworm-slim AS build
WORKDIR /app

COPY package.json ./
RUN npm install --f

COPY . .

RUN npx vite build

# ---- runtime (alpine) ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
