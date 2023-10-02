const postID = "POST ID"; // Put here the Reddit Post's ID
const startTS = 1695574500; // Put here the Unix Timecode correspondent to the start of your reddit thread.
const endTS = 1695592800; // Put here the Unix Timecode correspondent to the end of your reddit thread.




// Requirements
const snoowrap = require('snoowrap');
const r = new snoowrap({ userAgent: "RedditArchiver-standalone v2.0.0 by /u/ailothaen", clientId, clientSecret, refreshToken });

// Global Variables
var colors = [
  "FF0000",
  "0000FF",
  "008000",
  "b22222",
  "ff7f50",
  "9acd32",
  "ff4500",
  "2e8b57",
  "daa520",
  "d2691e",
  "5f9ea0",
  "1e90ff",
  "ff69b4",
  "8a2be2",
  "00ff7f"
]

var userColors = new Map();

// Functions
var random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function userColor(username) {
    if(!userColors.has(username))
        userColors.set(username, colors[0, random(0,colors.length - 1)]);

    return userColors.get(username);
}

async function getPostComments(postId) {
    const post = await r.getSubmission(postId).expandReplies({limit: Infinity, depth: Infinity}); // Get comments
    let resp = []; // Setting up array for returning

    post.comments.forEach((x) => { // Cycle thorugh each post, format it and add it to the array.
        let name = `${x.author.name}`;
        let flairs = ""
        if(x.author_flair_richtext != undefined) {
            x.author_flair_richtext.forEach((x) => {
                if(x.t != undefined)
                    flairs += String(x.t).charAt(0) == " " ? String(x.t).substr(1) : String(x.t);
            });

            if(flairs != "") // If there's any flairs, add them to the end of username.
                name += ` [${flairs}]`;
        }

        resp.push({
            ts: x.created_utc,
            name: name,
            text: x.body
        });

    });

    resp = resp.sort((a,b) => b.ts - a.ts); // Sorts array

    return resp;
}


async function main() {
    console.log("(1/3) Downloading Comments");
    let dComments = await getPostComments(postID);
    console.log("(2/3) Sorting Comments");
    let comments = [];

    dComments.forEach((c) => {
        comments.push({
            content_offset_seconds: c.ts - startTS,
            commenter: {
                display_name: c.name,
                name: c.name
            },
            message: {
                body: String(c.text).replace(/\\n/g, ""),
                fragments: [
                    {
                        text: String(c.text).replace(/\\n/g, ""),
                        emoticon: null
                    }
                ],
                user_color: userColor(c.name)
            }
        })
    });

    comments = comments.reverse();

    var template = {
        FileInfo: {
          Version: { Major: 1, Minor: 3, Patch: 1 },
          CreatedAt: '0001-01-01T00:00:00',
          UpdatedAt: '0001-01-01T00:00:00'
        },
        streamer: { name: 'example' },
        video: {
          title: 'Reddit CHAT',
          id: '1901422058',
          created_at: '0001-01-01T00:00:00',
          start: 0,
          end: (endTS - startTS),
          length: (endTS - startTS),
          viewCount: 301,
          game: 'Just Chatting',
          chapters: []
        },
        comments: [],
        embeddedData: null
    }

    template.comments = comments; // Adds comments to template.

    console.log("(3/3) Writing results to disk");
    require("fs").writeFileSync("./final.json", Buffer.from(JSON.stringify(template)));
}

main();