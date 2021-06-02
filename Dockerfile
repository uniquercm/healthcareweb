#############
### build ###
#############

# base image
FROM node:12.2.0 as build

# install chrome for protractor tests
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
#RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json package-lock.json ./
RUN npm ci
RUN npm install -g @angular/cli

# add app
COPY . /app

# run tests
#RUN ng test --watch=false
#RUN ng e2e --port 4202

# generate build
#RUN ng build --output-path=dist
RUN npm run build

############
### prod ###
############

# base image
#FROM nginx:1.16.0-alpine

#COPY /etc/nginx/sites-enabled/healthcare_web

## Remove default nginx index page
RUN rm -rf /var/www/web/*


# copy artifact build from the 'build environment'
COPY --from=build /app/dist/healthcare /var/www/web/

# expose port 80
EXPOSE 5005 80

# run nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
#docker build --network host -t  appplaza:dev .
#docker run --name appplaza -d -it --rm -p 80:80 appplaza:dev
#docker rm -f appplaza
