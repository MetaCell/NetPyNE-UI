## Prereqs

* node.js
* npm

## Install with:

`npm install -g phantomjs casperjs slimerjs`

## Run with (in this folder):

To run the tests, navigate to geppetto-netpyne/tests folder and run the following command:

`casperjs test netpyne-tests.js --host=http://localhost:8888/ --engine=slimerjs` 

You can also get a more verbose output with the log level and verbose parameters: 

`casperjs test netpyne-tests.js --host=http://localhost:8888/ --engine=slimerjs --log-level=[debug|info|warning|error] --verbose`

If you have an error similar to this one:
`Gecko error: it seems /usr/bin/firefox is not compatible with SlimerJS.`
It may be due to a new version of Firefox not supported by your current Slimer version. You have two options:
- Update Slimerjs and check if it supports latest FireFox
- Change application.ini maximum Firefox version parameter. [Reference](https://github.com/laurentj/slimerjs/issues/495#issuecomment-225008001)

## documentation

* [CasperJS Test API documentation](http://docs.casperjs.org/en/latest/modules/tester.html) - assert API
* [CasperJS Core API documentation](http://docs.casperjs.org/en/latest/modules/casper.html) - actions like clicks.
* [Additional command-line options for casperjs](https://docs.slimerjs.org/current/configuration.html#command-line-options) (these can go after `--engine=slimerjs`)