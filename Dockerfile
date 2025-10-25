# ---- build stage ----
FROM node:22.12.0-bookworm-slim AS build
WORKDIR /app

# npm را آپدیت کن تا باگ optional deps حل شود
RUN npm i -g npm@11.6.2

# فقط مانیفست‌ها را کپی کن تا کش درست کار کند
COPY package.json package-lock.json ./

# نصب: پیردپ‌ها را نادیده بگیر (اختلاف React 19 با پکیج‌هایی که 18 می‌خوان)
RUN npm ci --legacy-peer-deps --include=optional

# بقیه سورس
COPY . .

# بیلد
RUN npm run build

# ---- runtime stage ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
