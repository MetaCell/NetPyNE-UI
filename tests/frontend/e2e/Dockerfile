FROM buildkite/puppeteer:latest

ENV CHROME_BIN=/usr/bin/chromium-browser
ARG DEBIAN_FRONTEND=noninteractive

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .
	
CMD ["npm", "run", "test"]