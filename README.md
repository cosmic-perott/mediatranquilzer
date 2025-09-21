# The Media Tranquilizer #
**Value Truth, Not Noise**
The AI-powered web extension that filters out media clutter, biased opinions, and misinformation—delivering only the objective truth you need.

## How it works ##
It works by connecting the front end that is on the web with the servers that are running locally.
It uses open source libraries such as yt-dlp and faster-whisper to analyse videos and extract transcripts.
It uses Gemini API to generate the AI responses and it uses streamlit to create an environment for the AI to chat with the user.

## How to use it ##

### 1 Setting up the extension ###
**NOTE: This extension is not available on the Google Chrome Webstore. Therefore, in order to use it, you must download the repository as a ZIP file and run it locally**

BEFORE YOU DOWNLOAD THE ZIP: make sure you have node.js installed

Download the ZIP file and open in desired IDE (e.g VSCode) or clone the git into the IDE
Then, open terminal and run
``` node server.js ```

After that is running, go to Google Chrome and go to the website
```chrome://extensions``` (yes this is a valid URL — I didn't make the rules)

Then upload the files in the IDE

### Using the Extension

Go to ```youtube.com``` and click on any video.
you should see a red and blue icon appear at the bottom right corner of your webpage.

Make sure you are watching a video before clicking it.

**For Best Performance (and to not break the program), only click it once**
**if you opened it once, closed it, and then re opened it again it will take longer for the content to load**

Once you have clicked the icon and the content has loaded, you will see an AI's response regarding the video's content.
This will include a neutralisation of biases and opinions (if it is a political video), fact checking (if it is an informative video), and providing additional information which would help users understand the content to a better degree(if the video does not fall into either category)

you can click on the entry box below and ask the AI follow up questions.
this will direct you to a website made with streamlit where you can have a 1 to 1 conversation with the AI about the given topic.





**All code, content, writings, images created by cosmic-perott for PennApps XXVI**
