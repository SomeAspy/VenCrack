import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

const INVIDIOUS_ROOT = "CHANGE ME";

export default definePlugin({
    name: "Invidious",
    description: "Replace all YouTube embeds with an embed from an Invidious instance",
    authors: [Devs.katlyn],

    patches: [{
        find: "().embedVideo",
        replacement: {
            match: /(iframe.{10,50}src:)(\i)/,
            replace: "$1 $self.rewriteUrl($2)"
        }
    }],
    rewriteUrl(url) {
        return url.replace("https://www.youtube.com", INVIDIOUS_ROOT);
    }
});
