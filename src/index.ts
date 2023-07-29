import { movePlugins } from './fetchPlugins.js';
import { gitFetch, setup } from './scripts.js';

await setup();
await gitFetch('vendicated/vencord');
movePlugins();
