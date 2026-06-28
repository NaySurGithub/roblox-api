const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/roblox/user", async (req,res)=>{
    try{
        const response = await fetch(
            "https://users.roblox.com/v1/usernames/users",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    usernames:[req.body.username],
                    excludeBannedUsers:true
                })
            }
        );

        const data = await response.json();

        if(!data.data.length)
            return res.status(404).json({error:"User not found"});

        const user=data.data[0];

        const avatar = await fetch(
          `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png`
        );

        const avatarData = await avatar.json();

        res.json({
            id:user.id,
            name:user.name,
            avatar:avatarData.data[0].imageUrl
        });

    }catch(e){
        res.status(500).json({error:e.message});
    }
});

app.listen(3000);
