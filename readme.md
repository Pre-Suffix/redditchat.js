# RedditChat.JS

This is a simple tool for converting Reddit posts into a JSON file compatible with **[Twitch Downloader](https://github.com/lay295/TwitchDownloader)**, a tool that can download Twitch VODs, Chat and most importantly for this use case, render out chats into video files.

For this tool to be of any use, download **[Twitch Downloader here.](https://github.com/lay295/TwitchDownloader/releases)**

## Requirements
- Node.JS (v18.16.0 verified to work, but it might work on other versions)
- Snoowrap
- A Reddit App of the Script type (create one **[here](https://www.reddit.com/prefs/apps)** if you don't have one).

## How to Run

1. Clone this Git.
2. Install Snoowrap through NPM
    - `npm init -y`
    - `npm i snoowrap`
3. Fill in all the necessary variables on the top of the index.js file.
4. Run index.js, upon completion a "final.json" file should be found on your root directory.
5. Render the chat using the TwitchDownloader app.