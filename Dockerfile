# Set the base image to the official Node.js one
FROM node:4.2.4

# File Author / Maintainer
MAINTAINER Jacopo Daeli

# Expose port app is running on
EXPOSE 3000

# Bundle app source
COPY package.json /src/package.json

# Change working directory
WORKDIR /src

# Install app dependencies
RUN npm install

# Change working directory
WORKDIR /

# Bundle app source
COPY . /src

# Change working directory
WORKDIR /src

CMD ["node", "--use_strict", "app/index.js"]
