if (!document.getElementById("yt-floating-btn")) { 
  let btn = document.createElement("button"); 
  btn.id = "yt-floating-btn"; 
  btn.innerText = "INTQ"; 
  document.body.appendChild(btn); 

  let frame = document.createElement("div"); 
  frame.id = "yt-floating-frame"; 
  frame.style.display = "none"; 

  let header = document.createElement("div"); 
  header.id = "yt-frame-header"; 

  let frameLabel = document.createElement("span"); 
  frameLabel.innerText = "The Internet Tranquilizer"; 

  let closeBtn = document.createElement("button"); 
  closeBtn.innerText = "✖"; closeBtn.id = "yt-close-btn"; 
  header.appendChild(frameLabel); header.appendChild(closeBtn); 
  frame.appendChild(header); 

  // FACT CHECK
  let frameFact = document.createElement("div"); 
  frameFact.className = "yt-sub-frame clickable"; 
  frameFact.innerHTML = "<h4>Fact Check</h4><p>Content goes here...</p>"; 
  frame.appendChild(frameFact); 

  // NEUTRAL
  let frameNeutral = document.createElement("div"); 
  frameNeutral.className = "yt-sub-frame clickable"; 
  frameNeutral.innerHTML = "<h4>Neutral Overview</h4><p>Content goes here...</p>"; 
  frame.appendChild(frameNeutral); 

  // MORE INFO
  let frameMore = document.createElement("div"); 
  frameMore.className = "yt-sub-frame clickable"; 
  frameMore.innerHTML = "<h4>More Info</h4><p>Content goes here...</p>"; 
  frame.appendChild(frameMore); 

  let inputBox = document.createElement("input"); 
  inputBox.type = "text"; 
  inputBox.placeholder = "Want to learn more? Ask INTQ here..."; 
  inputBox.id = "yt-input-box"; 
  frame.appendChild(inputBox); 
  document.body.appendChild(frame); 

  btn.addEventListener("click", () => {
    const url = window.location.href;
    if (url.includes("youtube.com/watch?v=") || url.includes("youtube.com/shorts/")) {
      frame.style.display = "flex";
      btn.style.display = "none";
      console.log("Calling Python server...");

      fetch("http://localhost:5000/run-python?url=" + encodeURIComponent(url))
        .then(res => res.text())
        .then(output => {
          console.log("Raw output:", output);

          // Split text by markers
          const factMatch = output.match(/##FACT CHECK##([\s\S]*?)##END HERE##/);
          const neutralMatch = output.match(/##NEUTRAL OVERVIEW##([\s\S]*?)##END HERE##/);
          const moreMatch = output.match(/##MORE INFO##([\s\S]*?)##END HERE##/);

          const factText = factMatch ? factMatch[1].trim() : "No Fact Check available.";
          const neutralText = neutralMatch ? neutralMatch[1].trim() : "No Neutral Overview available.";
          const moreText = moreMatch ? moreMatch[1].trim() : "No More Info available.";

          // Display in frames
          frameFact.innerHTML = `<h4>Fact Check</h4><p>${factText}</p>`;
          frameNeutral.innerHTML = `<h4>Neutral Overview</h4><p>${neutralText}</p>`;
          frameMore.innerHTML = `<h4>More Info</h4><p>${moreText}</p>`;

          // Add click listeners → send data to Streamlit
          frameFact.onclick = () => {
            sendToStreamlit("Fact Check", factText);
          };
          frameNeutral.onclick = () => {
            sendToStreamlit("Neutral Overview", neutralText);
          };
          frameMore.onclick = () => {
            sendToStreamlit("More Info", moreText);
          };
        })
        .catch(err => console.error("Error:", err));
    } else {
      alert("This product cannot be used on this page.");
    }
  });

  closeBtn.addEventListener("click", () => {
    frame.style.display = "none"; 
    btn.style.display = "block";
  }); 
}

// Function: send info to Streamlit app
function sendToStreamlit(section, text) {
  const payload = {
    section: section,
    content: text
  };

  fetch("http://localhost:8501/add_context", {   // <--- Flask proxy recommended
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(() => {
    // Open Streamlit in new tab
    window.open("http://localhost:8501", "_blank");
  })
  .catch(err => console.error("Error sending to Streamlit:", err));
}
