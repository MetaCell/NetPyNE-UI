#!/bin/sh

set -e

rm -rf node_modules
rm -rf yarn.lock
cp package.json package.bak
cp dev_package.json package.json

yarn global add yalc

app=$(pwd)

echo "#### geppetto core ####"
cd $app/../src/geppetto-meta/geppetto.js/geppetto-core
rm -rf node_modules build
yarn && yarn build:dev && yarn publish:yalc

echo "#### geppetto ui ####"
cd $app/../src/geppetto-meta/geppetto.js/geppetto-ui
rm -rf node_modules build
yarn && yarn build:dev && yarn publish:yalc

echo "#### geppetto client ####"
cd $app/../src/geppetto-meta/geppetto.js/geppetto-client
rm -rf node_modules build
yarn && yarn build:dev && yarn publish:yalc

cd $app

#rm -Rf .yalc

yalc add @metacell/geppetto-meta-client
yalc add @metacell/geppetto-meta-core
yalc add @metacell/geppetto-meta-ui
