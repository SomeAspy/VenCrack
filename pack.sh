#!/bin/bash

# Setup Working environment

# git config pull.rebase false
git clone https://github.com/vendicated/vencord
git clone https://github.com/SomeAspy/ThirdPartyVencordPlugins --recurse-submodules
git pull https://github.com/vendicated/vencord
git pull https://github.com/SomeAspy/ThirdPartyVencordPlugins --recurse-submodules

# Repack bad packs
cd ThirdPartyVencordPlugins
bash repack.sh
cd ..

# Move into Vencord plugins directory
mkdir vencord/src/userplugins
for item in ThirdPartyVencordPlugins/dist ; do
    echo found $item
    cp -r $item vencord/src/userplugins
done

# fix strange moving behavior
mv vencord/src/userplugins/dist x
rm -rf vencord/src/userplugins
mv x vencord/src/userplugins

# build vencord
cd vencord
pnpm install --frozen-lockfile

# depending on which version of vencord you can select either buildWeb, or build for injecting locally.

LocalInject=false

if [ "$LocalInject" = true ] ; then
    pnpm build
    echo Just use "pnpm inject" inside the vencord folder!
else
    pnpm buildWeb
    cp -r dist/**/* ../dist
    echo dist is ready!
fi
