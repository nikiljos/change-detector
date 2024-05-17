const formatContentChangeCard = (siteId, siteUrl, diffUrl, ins, del) => {
    const gChatCard = {
        header: {
            title: "Content Change Detected",
            subtitle: siteId,
            // imageUrl: "https://developers.google.com/chat/images/quickstart-app-avatar.png",
            // imageType: "CIRCLE",
        },
        sections: [
            {
                header: `${ins} Insertions, ${del} Deletions`,
                // collapsible: false,
                // uncollapsibleWidgetsCount: 1,
                widgets: [
                    {
                        buttonList: {
                            buttons: [
                                {
                                    text: "Visit Site",
                                    icon: {
                                        knownIcon: "BOOKMARK",
                                    },
                                    onClick: {
                                        openLink: {
                                            url: siteUrl,
                                        },
                                    },
                                },
                                {
                                    text: "View Diff",
                                    icon: {
                                        knownIcon: "DESCRIPTION",
                                    },
                                    onClick: {
                                        openLink: {
                                            url: diffUrl,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        decoratedText: {
                            // text:"\n",
                            bottomLabel: siteUrl,
                        },
                    },
                ],
            },
        ],
    };

    return gChatCard;
};

module.exports={
    formatContentChangeCard
}
