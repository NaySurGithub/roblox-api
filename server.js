const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

async function roblox(url, options = {}) {
    const res = await fetch(url, options);

    if (!res.ok) {
        throw new Error(`Roblox API error ${res.status}`);
    }

    return await res.json();
}

app.post("/roblox/user", async (req, res) => {
    try {
        const data = await roblox(
            "https://users.roblox.com/v1/usernames/users",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usernames: [req.body.username],
                    excludeBannedUsers: true
                })
            }
        );

        if (!data.data.length) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(data.data[0]);

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.get("/roblox/user/:id", async (req, res) => {
    try {
        res.json(
            await roblox(
                `https://users.roblox.com/v1/users/${req.params.id}`
            )
        );

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.get("/roblox/avatar/:id", async (req, res) => {
    try {
        res.json(
            await roblox(
                `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${req.params.id}&size=150x150&format=Png`
            )
        );

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.get("/roblox/avatar-full/:id", async (req, res) => {
    try {
        res.json(
            await roblox(
                `https://thumbnails.roblox.com/v1/users/avatar?userIds=${req.params.id}&size=420x420&format=Png`
            )
        );

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.post("/roblox/presence", async (req, res) => {
    try {
        res.json(
            await roblox(
                "https://presence.roblox.com/v1/presence/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userIds: req.body.userIds
                    })
                }
            )
        );

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.get("/roblox/friends/:id", async (req, res) => {
    try {
        res.json(
            await roblox(
                `https://friends.roblox.com/v1/users/${req.params.id}/friends/count`
            )
        );

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.get("/roblox/groups/:id", async (req, res) => {
    try {
        res.json(
            await roblox(
                `https://groups.roblox.com/v2/users/${req.params.id}/groups/roles`
            )
        );

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.get("/roblox/badges/:id", async (req, res) => {
    try {
        res.json(
            await roblox(
                `https://badges.roblox.com/v1/users/${req.params.id}/badges?limit=10`
            )
        );

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.get("/roblox/inventory/:id/:assetType", async (req, res) => {
    try {
        res.json(
            await roblox(
                `https://inventory.roblox.com/v1/users/${req.params.id}/items/${req.params.assetType}/count`
            )
        );

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.get("/roblox/search/:name", async (req, res) => {
    try {
        res.json(
            await roblox(
                `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(req.params.name)}`
            )
        );

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.get("/roblox/games/:id", async (req, res) => {
    try {
        res.json(
            await roblox(
                `https://games.roblox.com/v2/users/${req.params.id}/games?limit=10`
            )
        );

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.get("/", (req, res) => {
    res.json({
        status: "online",
        api: "Roblox Proxy",
        cors: "enabled"
    });
});

app.listen(
    process.env.PORT || 3000,
    () => {
        console.log("Roblox API proxy running");
    }
);
