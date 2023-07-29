export interface PluginList {
    name: string;
    git?: string;
    host?: string;
    type: 'git' | 'git-files-aio' | 'static-aio' | 'git-folders';
    ignores?: string[];
    path?: string;
}
