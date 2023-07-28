export interface PluginList {
    name: string;
    git?: string;
    type: 'git' | 'git-files-aio' | 'static-aio' | 'git-folders';
    ignores?: string[];
    path?: string;
}
