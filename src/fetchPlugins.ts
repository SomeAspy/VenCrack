import json from '../plugins.json' assert { type: 'json' };
import {
    gitFetch,
    copyGitToVencord,
    baseDir,
    copyGitFiles,
} from './scripts.js';
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
                    const files = readdirSync(
                        `${baseDir}/temp/${plugin.git!.split('/')[1]!}`,
                        {
                            withFileTypes: true,
                        },
                    )
                        .filter((item) => item.isFile())
                        .map((file) => file.name);
                    files.forEach((file) => {
                        console.log('wer');
                        async () => {
                            console.log(file);
                            await copyGitFiles(
                                `${plugin.git!.split('/')[1]!}/${file}`,
                            );
                        };
                    });
                });
                break;
            case 'git-folders':
        }
    });
}
