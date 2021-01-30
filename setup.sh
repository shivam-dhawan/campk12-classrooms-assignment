#!/bin/bash

echo
echo "## Doing a yarn install in client"
cd client
yarn install


echo
echo "## Doing a yarn install in server"
cd ../server
yarn install

echo
echo "## Doing a yarn install in root folder"
cd ..
yarn install

echo
echo "#######---->> All Setup, Don't mess up the code & follow linting rules. <<----#######"
