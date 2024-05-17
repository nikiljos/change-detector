require("./app.js");
const cron = require("node-cron");
const findChange = require("./findchange.js");
const send = require("./sendMessage.js");

console.log("Running🏃‍♂️");

const sites = [
    {
        url: "https://nikjos.in/",
        key: "nikjos.in",
        filter: ["script", "style", "htmlComment"],
    },
    {
        url: "https://tiny.nikjos.in/force",
        key: "test",
    },
];
// // use this map to reset the site URLs to force a change detection
// .map((x) => ({
//     ...x,
//     url: "https://tiny.nikjos.in/force",
// }));

const schedule = "0 */5 * * * *"; // every 5 minutes
// const schedule = "*/5 * * * * *"; // every 5 seconds

cron.schedule(schedule, () => {
    // all();
    try {
        checkAllChange(sites);
    } catch (err) {
        console.log("Uncaught Exception: ", err);
    }
});

// function all() {
//     keam();
//     cusat();
//     findChange("https://www.cee.kerala.gov.in/main.php", "KEAM-homepage");
//     timeLogger();
// }

const checkAllChange = (sites) =>
    Promise.all(sites.map((site) => findChange(site.url, site.key, site.filter)));

const initRun = async () => {
    await send.message(`🕐 Change Detector Server Reload\n\n${new Date().toString()}`);
    await checkAllChange(sites);
    await send.message(`🕐 Initial Run Complete\n\n*Change Detector Running on Cron*`);
};

initRun();
