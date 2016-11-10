FROM ubuntu:latest
MAINTAINER Rahul Nair "rnair@ncsu.edu"
RUN apt-get -y update && apt-get install -y \
	nginx \
	build-essential \
	openjdk-8-jdk \
	maven \
	wget

RUN mkdir ~/.ssh
RUN echo "Host *" >> ~/.ssh/config
RUN echo "StrictHostKeyChecking no" >> ~/.ssh/config
RUN echo "" >> ~/.ssh/known_hosts
RUN rm /etc/nginx/sites-enabled/default
RUN touch /etc/nginx/sites-available/flask_settings
RUN ln -s /etc/nginx/sites-available/flask_settings /etc/nginx/sites-enabled/flask_settings
RUN echo 'server {location / {proxy_pass http://127.0.0.1:8080;proxy_set_header Host $host;proxy_set_header X-Real-IP $remote_addr;}}' > /etc/nginx/sites-enabled/flask_settings
COPY ./bloghub /bloghub
#RUN wget http://download.redis.io/redis-stable.tar.gz
#RUN tar xvzf redis-stable.tar.gz
#RUN cd redis-stable; make
#RUN apt-get install redis-server -y
WORKDIR /bloghub
RUN mvn install
EXPOSE 80
EXPOSE 8080
EXPOSE 6379
CMD ["./startup.sh"]
