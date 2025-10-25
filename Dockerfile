# ---- builder ----
FROM node:22.12.0 AS builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i -g npm@11.6.2

RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

COPY . .

# build
RUN npm run build

# ---- runtime ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
