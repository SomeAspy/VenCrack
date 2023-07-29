import * as child from 'child_process';

export function childPromise(
    child: child.ChildProcess,
): Promise<child.ChildProcess> {
    return new Promise(function (resolve, reject) {
        child.addListener('error', reject);
        child.addListener('exit', resolve);
    });
}
