import json from '../plugins.json' assert { type: 'json' };
import { gitFetch, copyGitToVencord, baseDir, copyFiles } from './scripts.js';
import type { PluginList } from './types/pluginsList.js';
import { readdirSync } from 'fs';

const plugins = json as PluginList[];
export function movePlugins() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    plugins.forEach(async (plugin: PluginList) => {
        // this will be undefined if we are not using git, but that should not matter if git when used always has it.
        switch (plugin.type) {
            case 'git':
                await gitFetch(plugin.git!, plugin.host).then(
                    async () =>
                        await copyGitToVencord(plugin.git!.split('/')[1]!),
                );
                break;
            case 'git-files-aio':
                await gitFetch(plugin.git!, plugin.host).then(() => {
                    readdirSync(
                        `${baseDir}/temp/${plugin.git!.split('/')[1]!}`,
                        {
                            withFileTypes: true,
                        },
                    )
                        .filter((item) => item.isFile())
                        .map((file) => file.name)
                        .forEach((file) => {
                            void (async () => {
                                console.log(`Found ${file}`);
                                await copyFiles(
                                    `temp/${plugin.git!.split(
                                        '/',
                                    )[1]!}/${file}`,
                                );
                            })();
                        });
                });
                break;
            case 'static-aio':
                readdirSync(`${baseDir}/${plugin.path}`, {
                    withFileTypes: true,
                })
                    .filter(
                        (item) =>
                            item.isFile() && item.name.match(/.(tsx?|css)/),
                    )
                    .map((file) => file.name)
                    .forEach((file) => {
                        void (async () => {
                            console.log(`Found ${file}`);
                            await copyFiles(plugin.path!);
                        })();
                    });
        }
    });
}
