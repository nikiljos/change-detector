const axios = require("axios");
const fs = require("fs");
const { writeFile } = require("fs/promises");
const diff = require("diff");
require("dotenv").config();
const send = require("./sendMessage.js");
const { formatContentChangeCard } = require("./gchat-card.js");

const diffUrl = process.env.diff_url || "https://tiny.nikjos.in";

async function checkSite(url, siteName, filter) {
    console.log(`${new Date().toString()} ${siteName}`);

    // TODO: change to fetch
    res = await axios
        .get(url)
        .then((data) => {
            return data.data;
        })
        .catch((err) => {
            // console.log(err)
            console.log("Error hitting website:", siteName);
            return null;
        });
    // console.log(res)
    if (res) {
        await checkChange(res, url, siteName, filter);
    }
}

const filterTags = (htmlString, filter = []) => {
    const pattern = filter
        .map((tag) => {
            if (tag === "htmlComment") {
                return `<!--([\\s\\S]*?)-->`;
            } else {
                return `<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`;
            }
        })
        .join("|");

    const result = htmlString.replace(new RegExp(pattern, "gi"), "");

    return result;
};

async function checkChange(html, url, siteName, filter) {
    let newData = html.toString();

    if (filter && filter.length > 0) {
        newData = filterTags(newData, filter);
    }

    let filePath = `./data/${siteName}.html`;
    let diffPath = `./data/diff/${siteName}.txt`;

    let oldData = "";
    // TODO: use fs/promise
    if (fs.existsSync(filePath)) {
        oldData = fs.readFileSync(filePath, { encoding: "utf8" });
    }

    if (newData != oldData) {
        const diffData = diff.diffLines(oldData, newData).filter((x) => x.added || x.removed);

        // console.log({ diffData });

        const diffCount = {
            ins: 0,
            del: 0,
        };

        const formattedDiff = diffData.map((elt) => {
            let type = "";
            if (elt.added) {
                type = "+++";
                diffCount.ins += elt.count;
            } else {
                type = "---";
                diffCount.del += elt.count;
            }
            return `🟠 ${type} (${elt.count})\n\n${elt.value}`;
        });
        formattedDiff.unshift(`\nDiff generated on: ${new Date().toString()}`);

        const diffString = formattedDiff.join("\n\n" + "=".repeat(80) + "\n\n");

        await writeFile(diffPath, diffString);

        try {
            // await send(`🔎 *${siteName}* Content Change Detected\n\n${url}\n\nView Diff → ${diffUrl}/${siteName}`);
            await send.card(
                formatContentChangeCard(
                    siteName,
                    url,
                    `${diffUrl}/${siteName}`,
                    diffCount.ins,
                    diffCount.del
                ),
                siteName
            );
            fs.writeFileSync(filePath, newData);
        } catch (err) {
            console.log({ err });
        }
    }
}

module.exports = checkSite;
