FROM node:carbon
WORKDIR /usr/src/api
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
EXPOSE 80 

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && yarn start
