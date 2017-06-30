FROM ubuntu:16.10
MAINTAINER Rosario Huanca <rhuancagonza@gmail.com>

RUN apt-get -yqq update
RUN apt-get -y install nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g fs-extra
#RUN cd $(npm root -g)/npm && npm install fs-extra && sed -i -e s/graceful-fs/fs-extra/ -e s/fs.rename/fs.move/ ./lib/utils/rename.js

# copy our application code
ADD . /app
WORKDIR /app

# fetch app specific deps
RUN npm install
#RUN cp -R . /tmp/src && ls /tmp/src && cd /tmp/src && npm i
#RUN npm run build

# expose port
EXPOSE 4000

# start app
CMD [ "node", "app.js" ]