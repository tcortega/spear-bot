# syntax = docker/dockerfile:1.3-labs
FROM node:current-bullseye-slim
ENV APP_DIR=/usr/src/app

ENV SKIP_GITIGNORE_CHECK true

# Add your custom ENV vars here:
ENV WA_POPUP true
ENV IS_DOCKER=true
ENV WA_DISABLE_SPINS true
ENV WA_EXECUTABLE_PATH=/usr/bin/google-chrome
ENV WA_CLI_CONFIG=/config
ENV CHROME_PATH=${WA_EXECUTABLE_PATH}
ENV WA_USE_CHROME=true

ENV PUPPETEER_CHROMIUM_REVISION=${PUPPETEER_CHROMIUM_REVISION}
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PLAYWRIGHT_BROWSERS_PATH=${APP_DIR}

COPY . $APP_DIR

WORKDIR $APP_DIR

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/node_modules
RUN mkdir -p /config
RUN mkdir -p /sessions
RUN apt update
RUN apt install git nano dumb-init -y
RUN echo "Installing dependencies"
RUN apt install nano wget --no-install-recommends  -y
RUN apt upgrade -y
RUN cd /tmp
RUN wget -q --no-check-certificate https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt install ./google-chrome-stable_current_amd64.deb -y
RUN rm google-chrome-stable_current_amd64.deb
RUN export PUPPETEER_SKIP_DOWNLOAD=true
RUN rm -rf /usr/bin/google-chrome
RUN ln -s /usr/bin/google-chrome-stable /usr/bin/google-chrome
RUN cd /opt/google/chrome
RUN rm -rf WidevineCdm/
RUN npm install -g npm@latest
RUN apt autoremove -y
RUN rm -rf /var/lib/apt/lists/*
RUN rm -rf /usr/share/doc/*
RUN rm -rf /usr/share/icons/*
RUN groupadd -r owauser && useradd -r -g owauser -G audio,video owauser
RUN mkdir -p /home/owauser/Downloads
RUN chown -R owauser:owauser /home/owauser
RUN chown -R owauser:owauser /sessions
RUN chown -R owauser:owauser /config
RUN chown -R owauser:owauser /usr/src/app/node_modules
RUN chown -R owauser:owauser ${WA_EXECUTABLE_PATH}
RUN chown -R owauser:owauser /usr/bin/google-chrome
RUN cd /usr/src/app
RUN chown -R owauser:owauser /usr/src/app

RUN npm i @open-wa/wa-automate@latest --ignore-scripts
RUN npm i typescript -g
RUN npm install
RUN npm cache clean --force

RUN npm prune --production && chown -R owauser:owauser $APP_DIR

# test with root later
USER owauser

RUN tsc --build

ENTRYPOINT ["/usr/bin/dumb-init", "--", "npm", "run", "start"]
