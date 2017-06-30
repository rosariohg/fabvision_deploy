FROM gcr.io/tensorflow/tensorflow:1.2.0
MAINTAINER Rosario Huanca <rhuancagonza@gmail.com>

# copy our application code
ADD . /app
WORKDIR /app

# fetch app specific deps
RUN pip install -r requirements.txt

EXPOSE 5000

# start app
CMD [ "python", "app.py" ]