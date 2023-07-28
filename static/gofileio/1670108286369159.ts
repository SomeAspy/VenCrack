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

import { ApplicationCommandInputType, ApplicationCommandOptionType } from "@api/Commands";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { findByProps } from "@webpack";

const DRAFT_TYPE = 0;

export default definePlugin({
    name: "Gofileio",
    description: "Allow for you to upload files to gofile.io and send them to others",
    authors: [Devs.Samu],
    dependencies: ["MessageEventsAPI"],
    target: "DESKTOP",
    commands: [{
        name: "goupload",
        description: "Upload a file to gofile.io and adds it to your clipboard",
        inputType: ApplicationCommandInputType.BUILT_IN,
        options: [
            {
                name: "file",
                description: "The file to upload",
                type: ApplicationCommandOptionType.ATTACHMENT,
                required: true
            }
        ],
        execute: async (args, ctx) => {
            const UploadStore = findByProps("getUploads");
            const upload = UploadStore.getUploads(ctx.channel.id, DRAFT_TYPE)[0];

            const uploadedFile = upload?.item?.file as File;

            const formData = new FormData();
            formData.append("file", uploadedFile);

            const server = await fetch("https://api.gofile.io/getServer").then(response => response.json());

            fetch(`https://${server.data.server}.gofile.io/uploadFile`, {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then(result => {
                    DiscordNative.clipboard.copy(result.data.downloadPage);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    }],
    start() {

    },
    stop() {

    }
});
