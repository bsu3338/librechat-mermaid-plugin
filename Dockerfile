# Used https://github.com/mermaid-js/mermaid-cli/blob/master/Dockerfile and files from that project for base design
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

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the application source code to the working directory
COPY index.js .

# Copy the openapi.yaml file to the public folder
COPY openapi.yaml /app/public/openapi.yaml

# Copy the logo.svg file to the public folder
COPY logo.svg /app/public/logo.svg

# Expose the port specified by the environment variable
ENV PORT=3000
EXPOSE $PORT

# Start the application
CMD ["node", "index.js"]
