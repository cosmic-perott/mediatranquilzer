def get_transcript(url):
    print(url+url) 
    if len(url) < 2: 
        print("ERROR: No URL provided") 
        sys.exit(1) 
    video_url = url 
    output_file = "output.mp3" 
    ydl_opts = { "format": "bestaudio/best", 
                "outtmpl": "output.%(ext)s", 
                "quiet": True, 
                "postprocessors": [ { "key": "FFmpegExtractAudio",
                                      "preferredcodec": "mp3",
                                    "preferredquality": "192", 
                                    } ], 
                }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl: 
        ydl.download([video_url])
    
    model = WhisperModel("small", device="cpu", compute_type="int8") 
    segments, info = model.transcribe(output_file, beam_size=5) 
    transcription = [] 
    for segment in segments: 
        transcription.append(segment.text)
    tts = " ".join(transcription) 

    os.remove(output_file) 
    tt = tts.split("B/s") 

    
    genai.configure(api_key="AIzaSyDMHYkly-Ms5lTQ0bZRADM1Um_J9I53o1I")
    generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 2000,
    "response_mime_type": "text/plain",
}
    model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)
    
    chat_session = model.start_chat(
    history=[]
)
    
    response = chat_session.send_message(f"{tt[-1]}. Initially assume it is an argumentative text and that it is opinion based and show both sides of the argument. if this is an argumentative text or if the video includes any opinions or any claims, show the neutralised overview of both arguments. assuming that the video is an arugmentative opinion based text, fact check any 'factual things' they are claiming. if this isn't either, provide further informaton to aid the viewer. use the labels ##FACT CHECK## when u are fact checking the content. use the label ##NO BIAS## when you are showing both sides of the arugment without bias (THIS LABEL MUST BE SHOWN IN YOUR RESPONSE). use the label ##MORE INFO## if it shows more information on the topic. keep all sentences to 150 words MAX. every time a paragraph ends, end the paragrph with the label ##END HERE## any response you give must be put under one of the three labels. if you have a summary of the video, put it under fact check")

    return response.text
    
if __name__ == "__main__":
    import sys, yt_dlp, os
    import google.generativeai as genai
    from faster_whisper import WhisperModel 
    a = str(sys.argv[1]) 
    tts = get_transcript(a) 
    print(tts, flush=True)
