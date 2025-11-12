# base image
FROM node:11.6.0 AS build

# set working directory
WORKDIR /app


# copy app files
COPY . .

# install app dependencies
COPY package*.json ./
RUN npm clean-install --only=production

# build app
RUN npm run build
#Serve the buld with 'serve'
FROM node:11.6.0-alpine
# install 'serve' to serve the build folder
RUN npm install -g serve

# set working directory
WORKDIR /app    

# copy build files from previous stage
COPY --from=build /app/build ./build    

# expose port
EXPOSE 3000

#  run the app with 'serve'
CMD ["serve", "-s", "build", "-l", "3000"]
