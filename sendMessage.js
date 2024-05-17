const sendLog = (message) => console.log("Incoming Message:", message);

const sendGChatWebhook = (content) =>
    fetch(process.env.gchat_webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            ...content,
            thread: { threadKey: process.env.gchat_thread },
        }),
    }).then((res) => res.json());
// .then((data) => console.log({ data }))
// .catch((err) => console.log(err));

const message = (text) => sendGChatWebhook({ text });
const card = (gChatCard, text) => sendGChatWebhook({ cardsV2: [{ card: gChatCard }], text });

module.exports = {
    message,
    card,
};
