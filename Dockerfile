FROM node:8

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
RUN npm install
RUN npm install bcrypt
COPY . /usr/src/app
CMD [ "npm", "start" ]

EXPOSE 3000