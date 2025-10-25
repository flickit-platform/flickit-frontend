# WORKDIR /app/frontend

# COPY package.json package-lock.json ./
# RUN npm install 
# COPY . ./
# EXPOSE 3000


# Use an official Node runtime as a parent image
FROM node:22.12.0

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

RUN rm -rf node_modules package-lock.json && npm install

# Install any needed packages specified in package.json
RUN npm cache clean --f

# Install any needed packages specified in package.json
RUN npm install --f

# Build the React app
RUN npm run build

# Serve the React app using Nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
