FROM node:carbon
WORKDIR /usr/src/api
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
EXPOSE 3001
CMD ["yarn", "start"]
