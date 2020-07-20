## STAGE 1: Build ###
FROM node:10.20.1 AS build
WORKDIR /usr/src/app

COPY package.json ./
RUN npm config set registry http://registry.npmjs.org/ 
RUN npm install

COPY . .

#RUN npm run build
RUN npm run build --configuration dev --aot=true --build-optimizer=false --base-href l

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/udap-registration /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
