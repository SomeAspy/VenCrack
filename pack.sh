#!/bin/bash

#SECTION - CLEANUP

rm -rf dist vencord ThirdPartyVencordPlugins
mkdir dist

#!SECTION
#SECTION - SETUP

git config pull.rebase false
git clone https://github.com/vendicated/vencord
git clone https://github.com/SomeAspy/ThirdPartyVencordPlugins --recurse-submodules

#!SECTION
#SECTION - Integrate 3rd-party plugins

(cd ThirdPartyVencordPlugins || { echo "Filesystem Failure"; exit 1;}
bash repack.sh)
mkdir vencord/src/userplugins
cp -Rf ThirdPartyVencordPlugins/dist/* vencord/src/userplugins/

#!SECTION
#SECTION - Build Vencord

(cd vencord || { echo "Filesystem Failure"; exit 1;}
pnpm i --frozen-lockfile
pnpm run buildWeb)

#!SECTION
#SECTION - Deploy

cp -Rf vencord/dist/* dist

#!SECTION

echo Done packing Vencord! Files can now be served at the dist directory at the head of this repository!

echo Made by someaspy on Discord - https://github.com/SomeAspy - https://aspy.dev