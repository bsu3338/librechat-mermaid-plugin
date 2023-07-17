FROM node:alpine

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

ARG VERSION

ADD install-dependencies.sh install-dependencies.sh
RUN chmod 755 install-dependencies.sh && /bin/sh install-dependencies.sh

RUN adduser -D mermaidcli
USER mermaidcli
WORKDIR /home/mermaidcli
RUN yarn add @mermaid-js/mermaid-cli@$VERSION

ADD puppeteer-config.json  /puppeteer-config.json

WORKDIR /data
ENTRYPOINT ["/home/mermaidcli/node_modules/.bin/mmdc", "-p", "/puppeteer-config.json"]
CMD [ "--help" ]

# Use the official Node.js 14.x base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Set environment variables
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# RUN npm install --ignore-scripts puppeteer

# Install mermaid-cli globally
RUN npm install -g @mermaid-js/mermaid-cli

# Install the project dependencies
RUN npm install

# Copy the application source code to the working directory
COPY index.js .

# Copy the application source code to the working directory
# COPY . .

# Expose the port specified by the environment variable
ENV PORT=3000
EXPOSE $PORT

# Start the application
CMD ["node", "index.js"]
