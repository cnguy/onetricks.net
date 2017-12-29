FROM node:carbon
WORKDIR /usr/src/stats
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
EXPOSE 3002
CMD ["yarn", "start"]