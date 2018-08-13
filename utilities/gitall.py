#!/usr/bin/python

#
#	Utility script for mass git operatiosn on NetPyNE-UI
#	Usage:
# 	gitall branches: print current branch of each repo
#
#	gitall checkout <branch> : checkout <branch> on each repo
#
#	gitall pull <remote> <branch> : execute git pull on each repo
#
#	gitall fetch <remote> <branch> : execute git fetch on each repo
#
#

import os
import sys
import getopt
import subprocess
import json
from subprocess import call

config = {

    "repos": [
        {
            "name": "NetPyNE_UI",
            "path": "..",
            "url": "https://github.com/MetaCell/NetPyNE-UI"
        },
        {
            "name": "org.geppetto.frontend.jupyter",
            "path": "../org.geppetto.frontend.jupyter",
            "url": "https://github.com/openworm/org.geppetto.frontend.jupyter"
        },
        {
            "name": "org.geppetto.frontend",
            "path": "../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/",
            "url": "https://github.com/openworm/org.geppetto.frontend"
        },
        {
            "name": "Geppetto Netpyne extension",
            "path": "../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/extensions/geppetto-netpyne/",
            "url": "https://github.com/MetaCell/geppetto-netpyne"
        }
    ]
}


def incorrectInput(argv, msg):
    print(msg)
    sys.exit()

def main(argv):
    command = []
    if(len(argv) == 0):
        incorrectInput(argv, 'Too few paramaters')

    elif(argv[0] == 'push'):
        command = ['git', 'push', argv[1], argv[2]]

    elif(argv[0] == 'add'):
        command = ['git', 'add', argv[1]]

    elif(argv[0] == 'commit'):
        command = ['git', 'commit', argv[1], argv[2]]

    elif(argv[0] == 'branches'):
        command = ['git', 'rev-parse', '--abbrev-ref', 'HEAD']

    elif(argv[0] == 'reset'):
        command = ['git', 'reset', '--hard', 'HEAD']

    elif(argv[0] == 'status'):
        command = ['git', argv[0]]

    elif(argv[0] == 'remote'):
        command = ['git', 'remote', '-v']

    elif(argv[0] == 'diff'):
        command = ['git', 'diff']

    elif(argv[0] == 'checkout'):
        if(len(argv) == 2):
            command = ['git', 'checkout', argv[1]]
        elif(len(argv) == 3):
            command = ['git', 'checkout', argv[1], argv[2]]
        else:
            incorrectInput(argv, 'Expected <=3 paramaters')

    elif(argv[0] == 'pull' or argv[0] == 'fetch'):
        if(len(argv) == 1):
            command = ['git', argv[0]]
        elif(len(argv) == 2):
            command = ['git', argv[0], argv[1]]
        elif(len(argv) == 3):
            command = ['git', argv[0], argv[1], argv[2]]
        else:
            incorrectInput(argv, 'Too many paramaters')

    else:
        incorrectInput(argv, 'Unrecognized command')

    for repo in config['repos']:
        try:
            print(repo['name'] + '  ' + subprocess.check_output(command, cwd=repo['path']))
        except:
            print("Error -- trying next repo")


if __name__ == "__main__":
    main(sys.argv[1:])
