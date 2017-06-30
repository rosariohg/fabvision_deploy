FROM ubuntu:16.10
MAINTAINER Rosario Huanca <rhuancagonza@gmail.com>

RUN apt-get -yqq update
RUN apt-get -y install nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

# copy our application code
ADD . /app
WORKDIR /app

# fetch app specific deps
RUN npm install
#RUN npm run build

# expose port
#EXPOSE 5000

# start app
CMD [ "node", "app.js" ]