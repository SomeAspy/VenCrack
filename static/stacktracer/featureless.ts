/* eslint-disable header/header */

import { definePluginSettings } from "@api/settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    forceDisabled: {
        type: OptionType.STRING,
        description: "Forcefully disable these features (comma separated)",
        default: "debug_logging",
    },
});

let patch: { proxy: any; revoke: () => void; } | null = null;
export default definePlugin({
    name: "Featureless",
    authors: [Devs.Vap],
    description: "no discord these features are totalllyyy not supporteddd ;P",
    settings,
    start() {
        patch ??= Proxy.revocable(DiscordNative.features.supports, {
            apply(target, thisArg, args) {
                if (settings.store.forceDisabled.split(",").includes(args[0]))
                    return false;
                return Reflect.apply(target, thisArg, args);
            },
        });
        DiscordNative.features.supports = patch.proxy;
    },
    stop() {
        patch?.revoke();
        patch = null;
    },
});
