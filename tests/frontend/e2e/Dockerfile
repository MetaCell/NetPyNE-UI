FROM buildkite/puppeteer:latest

ENV CHROME_BIN=/usr/bin/chromium-browser
ARG DEBIAN_FRONTEND=noninteractive

COPY package.json .
RUN npm install ci
COPY . .
	
CMD ["npm", "run", "test"]