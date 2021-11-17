#!/bin/sh

set -e

rm -rf node_modules
rm -rf yarn.lock
cp package.json package.bak
cp dev_package.json package.json

yarn global add yalc

app=$(pwd)

cd $app/../src/geppetto-meta/geppetto.js/geppetto-core
rm -rf node_modules
yarn && yarn build && yarn publish:yalc

cd $app/../src/geppetto-meta/geppetto.js/geppetto-ui
rm -rf node_modules
yarn && yarn build:dev && yarn publish:yalc

cd $app/../src/geppetto-meta/geppetto.js/geppetto-client
rm -rf node_modules
yarn && yarn build && yarn publish:yalc

cd $app

yalc add @metacell/geppetto-meta-client
yalc add @metacell/geppetto-meta-core
yalc add @metacell/geppetto-meta-ui
