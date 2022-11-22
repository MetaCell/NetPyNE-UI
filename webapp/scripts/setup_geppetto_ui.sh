#!/bin/sh

trap ctrl_c INT

ctrl_c() {
	echo "### Stopping dev server ###"
	mv package.json dev_package.json
	mv package.bak package.json
	exit 0	
}

#set -e

rm -rf node_modules
rm -rf yarn.lock
mv package.json package.bak
mv dev_package.json package.json

yarn global add yalc

app=$(pwd)

cd $app/../src/geppetto-meta/geppetto.js/geppetto-core
rm -rf node_modules
yarn && yarn build:dev && yarn publish:yalc

cd $app/../src/geppetto-meta/geppetto.js/geppetto-ui
rm -rf node_modules
yarn && yarn build:dev && yarn publish:yalc

cd $app/../src/geppetto-meta/geppetto.js/geppetto-client
rm -rf node_modules
yarn && yarn build:dev && yarn publish:yalc

cd $app

#rm -Rf .yalc

yalc add @metacell/geppetto-meta-client
yalc add @metacell/geppetto-meta-core
yalc add @metacell/geppetto-meta-ui

yarn && yarn run start
