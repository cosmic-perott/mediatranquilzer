import streamlit as st
from PIL import Image
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from streamlit.web.server.websocket_headers import _get_websocket_headers
from tornado.web import RequestHandler

# Storage for context
if "context_data" not in st.session_state:
    st.session_state.context_data = {"fact": "", "neutral": "", "more": ""}

# Custom endpoint to receive POST from content.js
class ContextHandler(RequestHandler):
    def post(self):
        import json
        data = json.loads(self.request.body)
        st.session_state.context_data["fact"] = data.get("fact", "")
        st.session_state.context_data["neutral"] = data.get("neutral", "")
        st.session_state.context_data["more"] = data.get("more", "")
        self.write({"status": "ok"})

# Register endpoint
from streamlit.web.server import Server
server = Server.get_current()
if not server.is_running():
    pass
else:
    app = server._http_server
    app.add_handlers(r".*", [(r"/send-context", ContextHandler)])



def load_icon():
    img = Image.open("INTQ_pfp.png")
    return img

st.set_page_config(
    page_title="INTQ AI Chat Page",
    page_icon=load_icon(),  
    layout="centered",  
    initial_sidebar_state="auto"
)

st.markdown(
    """
    <style>
    .css-18e3th9 {
        background-color: #f0f0f0;
    }
    .css-1d391kg {
        color: #1c1c1c;
    }
    </style>
    """, 
    unsafe_allow_html=True
)



genai.configure(api_key="AIzaSyDMHYkly-Ms5lTQ0bZRADM1Um_J9I53o1I")
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 2000,
  "response_mime_type": "text/plain",
}

if "message_history" not in st.session_state:

    st.session_state.message_history = [
            {"role": "user", "parts": ""},
    ]

# Set up the model
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)


chat_session = model.start_chat(
    history=st.session_state.message_history
)




#


def right_aligned_message(message):
    st.markdown(
        f'<div style="text-color:#000000;text-align: right; padding:10px; border-radius:16px;">{message}</div>',
        unsafe_allow_html=True
    )
def left_aligned_message(message):
    st.markdown(
        f'<div style="text-color:#000000;text-align: left; padding:10px; border-radius:16px;>{message}</div>'
    )
st.title("INTQ AI")

if 'messages' not in st.session_state:
    st.session_state.messages = []
for message in st.session_state.messages:
    if message['role'] == 'user':
        right_aligned_message(message['parts'])
    else:
        st.chat_message(message['role'],avatar=load_icon()).markdown(message['parts'])

prompt = st.chat_input("Chat with INTQ")
if prompt:
    right_aligned_message(prompt)
    st.session_state.messages.append({'role': 'user', 'parts': prompt})
    st.session_state.message_history.append({"role": "user", "parts": prompt})
    context_text = f"""
    FACT CHECK: {st.session_state.context_data['fact']}
    NEUTRAL OVERVIEW: {st.session_state.context_data['neutral']}
    MORE INFO: {st.session_state.context_data['more']}
    """

    final_prompt = context_text + "\n\nUser: " + prompt
    response = chat_session.send_message(final_prompt)

    response = chat_session.send_message(prompt)


    st.chat_message('assistant',avatar=load_icon()).markdown(response.text)
    st.session_state.message_history.append({"role": "assistant", "parts": response.text})
    st.session_state.messages.append({"role": "assistant", "parts": response.text})
