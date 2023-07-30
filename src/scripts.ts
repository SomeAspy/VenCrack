import * as child from 'child_process';
import { childPromise } from './lib.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
export const baseDir = dirname(fileURLToPath(import.meta.url))
    .split('/')
    .slice(0, -1)
    .join('/');

export async function gitFetch(repo: string, host: string = 'github.com') {
    console.log(`Attempting to clone ${repo}...`);
    await childPromise(
        child.exec(
            `cd ${baseDir}/temp && git clone https://${host}/${repo}`,
            (err, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                if (stderr.includes('already exists')) {
                    console.log(
                        `${repo} is already there! Attempting to pull it...`,
                    );

                    child.exec(
                        `cd ${baseDir}/temp && git pull`,
                        (err, stdout, stderr) => {
                            console.log(stdout);
                            console.log(stderr);
                        },
                    );
                }
            },
        ),
    );
}

export async function buildVencord() {
    console.log('Building Vencord');
    await childPromise(
        child.exec(
            `cd ${baseDir}/temp/vencord && pnpm i`,
            (err, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
            },
        ),
    ).then(() => {
        child.exec(
            `cd ${baseDir}/temp/vencord && pnpm run buildWeb`,
            (err, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
            },
        );
    });
}

export async function copyGitToVencord(path: string) {
    await childPromise(
        child.exec(
            `cp -r ${baseDir}/temp/${path} ${baseDir}/temp/vencord/src/plugins/${path}`,
            (err, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
            },
        ),
    );
}

export async function setup() {
    await childPromise(
        child.exec(
            `rm -rf ${baseDir}/temp && mkdir ${baseDir}/temp`,
            (err, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
            },
        ),
    );
}

export async function copyFiles(path: string) {
    await childPromise(
        child.exec(
            `cp -r ${baseDir}/${path} ${baseDir}/temp/vencord/src/plugins/${
                path.split('/')[1]
            }`,
            (err, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
            },
        ),
    );
}
