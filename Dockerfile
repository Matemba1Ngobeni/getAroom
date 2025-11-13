# base image
FROM node:11.6.0 AS build

# set working directory
WORKDIR /app

# copy dependency definitions first for better cache usage
COPY package*.json ./

# install app dependencies (install dev deps needed to build)
RUN npm install

# copy app files
COPY . .

# build app
RUN npm run build

# Serve the build with 'serve'
FROM node:11.6.0-alpine

# install 'serve' to serve the build folder
RUN npm install -g serve

# set working directory
WORKDIR /app    

# copy build files from previous stage
COPY --from=build /app/build ./build    

# expose port
EXPOSE 8080

# run the app with 'serve'
CMD ["serve", "-s", "build", "-l", "8080"]