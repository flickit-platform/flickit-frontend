# ---- build (glibc) ----
FROM node:22.12.0-bookworm-slim AS build
WORKDIR /app

RUN npm i -g npm@11.6.2

# فقط package.json تا لاکِ سازگار برای لینوکس تولید شود
COPY package.json ./
RUN npm install --legacy-peer-deps --include=optional

# بقیه سورس
COPY . .

# (اختیاری، ولی بی‌خطر)
# RUN sh -lc 'cat /etc/os-release; (getconf GNU_LIBC_VERSION || true); (ldd --version 2>&1 | head -n1 || true)'

# بیلد
RUN npm run build

# ---- runtime (alpine) ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
