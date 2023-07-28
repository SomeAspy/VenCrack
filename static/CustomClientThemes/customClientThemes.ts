/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Devs } from "@utils/constants.js";
import definePlugin from "@utils/types";

interface CustomTheme {
    // Unique numerical ID for the theme, make sure it also doesn't conflict with Discord's ones
    // I'd start counting from 100
    id: number,
    theme: "light" | "dark",
    colors: ({
        // CSS color, can be a hex code, color name, rgb() or hsl() value, etc.
        color: string,
        // The point at which to stop the gradient [the x in linear-gradient(#abcdef, x)]
        // The last one doesn't have to be 100, it will just be filled with the default background color
        stop: number;
    })[],
    // Angle to rotate the gradient at
    angle: number;
    // Must only use letters and spaces
    getName: () => string,
    // idrk just leave it at 50
    midpointPercentage: number;
}

const themes: ReadonlyArray<CustomTheme> = [{
    id: 69,
    theme: "dark",
    angle: 180,
    colors: [{
        color: "#d04b36",
        stop: 16.666
    }, {
        color: "#e36511",
        stop: 33.333
    }, {
        color: "#ffba00",
        stop: 50
    }, {
        color: "#00b180",
        stop: 66.666
    }, {
        color: "#147aab",
        stop: 83.333
    }, {
        color: "#675997",
        stop: 100
    }],
    getName: () => "Gay",
    midpointPercentage: 50
}];


interface DiscordTheme {
    id: number,
    theme: "light" | "dark",
    colors: ({
        token: string,
        stop: number;
    })[],
    angle: number;
    getName: () => string,
    midpointPercentage: number;
}

const themeColorMap = Object.freeze(
    themes.reduce((prev, cur) => {
        cur.colors.forEach((c, i) =>
            prev[`BG_GRADIENT_${cur.getName().toUpperCase().replace(/ /g, "_")}_${i + 1}`] = c.color
        );
        return prev;
    }, {})
);
function kebabCaseTokens(theme: CustomTheme) {
    return theme.colors.map((_, i) =>
        `bg-gradient-${theme.getName().toLowerCase().replace(/ /g, "-")}-${i + 1}`
    );
}

export default definePlugin({
    name: "CustomClientThemes",
    description: "Paint your Discord however you'd like via client themes",
    authors: [Devs.TheSun],

    patches: [{
        find: ".Messages.CLIENT_THEMES_GRADIENT_MINT_APPLE",
        replacement: {
            match: /=\[({id:\i.\i\.MINT_APPLE)/,
            replace: "= [...$self.customThemes, $1"
        }
    }, {
        find: "RawColors:{",
        replacement: {
            match: /RawColors:{/,
            replace: "$&...$self.rawColors,"
        }
    }, {
        find: "=\"bg-gradient-mint-apple-1\";",
        replacement: [{
            match: /(\i).BG_GRADIENT_MINT_APPLE_1="bg-gradient-mint-apple-1";/,
            replace: "$self.addRawColorNames($1);$&"
        }, {
            match: /(\i)\((\i),\i.BG_GRADIENT_MINT_APPLE_1,/,
            // not really possible to extract this into it's own logic
            // so i had to add it inside the patch
            replace: (orig, fn, obj) => `${themes.map(theme =>
                kebabCaseTokens(theme).map((t, i) =>
                    `${fn}(${obj},"${t}",{hex:"${theme.colors[i].color}"})`
                )
            )},${orig}`
        }]
    }, {
        find: "return\"var(--\".concat",
        replacement: {
            match: /"var\(--".{0,50}"\)"\)/,
            replace: " $self.getColor($&, arguments[0])"
        }
    }],

    get customThemes(): DiscordTheme[] {
        return themes.map(theme => ({
            ...theme,
            colors: kebabCaseTokens(theme).map((t, i) => ({
                token: t,
                stop: theme.colors[i].stop
            }))
        }));
    },

    get rawColors() {
        return themeColorMap;
    },

    addRawColorNames(obj) {
        Object.keys(this.rawColors).forEach(k => obj[k] = k.toLowerCase().replace(/_/g, "-"));
    },

    getColor(original: string, name: string) {
        if (themeColorMap[name]) return themeColorMap[name];
        return original;
    }
});
