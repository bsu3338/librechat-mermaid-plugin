# Use the official Node.js 14.x base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the application source code to the working directory
COPY server.js .

# Copy the application source code to the working directory
# COPY . .

# Expose the port specified by the environment variable
ENV PORT=3000
EXPOSE $PORT

# Start the application
CMD ["node", "server.js"]
