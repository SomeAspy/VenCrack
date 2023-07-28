/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Samu
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

import { lazyWebpack } from "../utils";
import definePlugin from "../utils/types";
import { filters } from "../webpack";

const RelationshipStore = lazyWebpack(filters.byProps(["getRelationships", "isBlocked"]));

export default definePlugin({
    name: "IgnoreBlockedUsers",
    description: "Unlike the noBlockedMessages plugin, this plugin completely ignores (recent) incoming messages from blocked users (locally).",
    authors: [{
        name: "Samu",
        id: 702973430449832038n
    }
    ],
    patches: [
        {
            find: "displayName=\"MessageStore\"",
            replacement: [
                {
                    match: /(?<=MESSAGE_CREATE:function\((\w)\){var \w=\w\.channelId,\w=\w\.message,\w=\w\.isPushNotification,\w=\w\.\w\.getOrCreate\(\w\));/,
                    replace: ";if(Vencord.Plugins.plugins.IgnoreBlockedUsers.isBlocked(n))return;"
                }
            ]
        }
    ],
    isBlocked(message) {
        if (RelationshipStore.isBlocked(message.author.id)) return true;
        else return false;
    }
});
