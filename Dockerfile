# ---- build (Debian/glibc) ----
FROM node:22.12.0-bookworm-slim AS build
WORKDIR /app

# npm تازه‌تر
RUN npm i -g npm@11.6.2

# فقط package.json (فعلاً lock را کپی نکن که قفل مک/ویندوز گیج نکند)
COPY package.json ./

# نصب با نادیده گرفتن peer dep های ناسازگار + کشیدن optional ها
RUN npm install --legacy-peer-deps --include=optional

# بقیه سورس
COPY . .

# (اختیاری، برای لاگ تشخیصی)
RUN node -e "console.log('libc=', process.report().header.glibcVersionRuntime || 'musl')"

# بیلد
RUN npm run build

# ---- runtime (Alpine) ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
