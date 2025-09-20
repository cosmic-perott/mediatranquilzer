if (!document.getElementById("yt-floating-btn")) { 
  let btn = document.createElement("button"); 
  btn.id = "yt-floating-btn"; 
  btn.innerText = "TMT"; 
  document.body.appendChild(btn); 

  let frame = document.createElement("div"); 
  frame.id = "yt-floating-frame"; 
  frame.style.display = "none"; 

  let header = document.createElement("div"); 
  header.id = "yt-frame-header"; 

  let frameLabel = document.createElement("span"); 
  frameLabel.innerText = "The Internet Tranquilizer"; 

  let closeBtn = document.createElement("button"); 
  closeBtn.innerText = "✖"; 
  closeBtn.id = "yt-close-btn"; 
  header.appendChild(frameLabel); 
  header.appendChild(closeBtn); 
  frame.appendChild(header); 

  // Create frames
  let frameFact = document.createElement("div"); 
  frameFact.className = "yt-sub-frame clickable"; 
  frameFact.innerHTML = "<h4>Fact Check</h4><p>Loading...</p>"; 
  frame.appendChild(frameFact); 

  let frameNeutral = document.createElement("div"); 
  frameNeutral.className = "yt-sub-frame clickable"; 
  frameNeutral.innerHTML = "<h4>Neutral Overview</h4><p>Loading...</p>"; 
  frame.appendChild(frameNeutral); 

  let frameMore = document.createElement("div"); 
  frameMore.className = "yt-sub-frame clickable"; 
  frameMore.innerHTML = "<h4>More Info</h4><p>Loading...</p>"; 
  frame.appendChild(frameMore); 

  let inputBox = document.createElement("input"); 
  inputBox.type = "text"; 
  inputBox.placeholder = "Want to learn more? Ask TMT here..."; 
  inputBox.id = "yt-input-box"; 
  inputBox.disabled = true; // disable until data loaded
  frame.appendChild(inputBox); 

  document.body.appendChild(frame); 

  let factText = "";
  let neutralText = "";
  let moreText = "";

  btn.addEventListener("click", () => {
    const url = window.location.href;
    if (url.includes("youtube.com/watch?v=") || url.includes("youtube.com/shorts/")) {
      frame.style.display = "flex";
      btn.style.display = "none";

      fetch("http://localhost:5000/run-python?url=" + encodeURIComponent(url))
        .then(res => res.text())
        .then(output => {
          // parse content
          const factMatch = output.match(/##FACT CHECK##([\s\S]*?)##END HERE##/);
          const neutralMatch = output.match(/##NEUTRAL OVERVIEW##([\s\S]*?)##END HERE##/);
          const moreMatch = output.match(/##MORE INFO##([\s\S]*?)##END HERE##/);

          factText = factMatch ? factMatch[1].trim() : "No Fact Check available.";
          neutralText = neutralMatch ? neutralMatch[1].trim() : "No Neutral Overview available.";
          moreText = moreMatch ? moreMatch[1].trim() : "No More Info available.";

          // update frames
          frameFact.innerHTML = `<h4>Fact Check</h4><p>${factText}</p>`;
          frameNeutral.innerHTML = `<h4>Neutral Overview</h4><p>${neutralText}</p>`;
          frameMore.innerHTML = `<h4>More Info</h4><p>${moreText}</p>`;

          inputBox.disabled = false;

          inputBox.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
              const userQuery = inputBox.value.trim();
              if (!userQuery) return;

              const contextUrl = `https://penappstmt.streamlit.app/?fact=${encodeURIComponent(factText)}&neutral=${encodeURIComponent(neutralText)}&more=${encodeURIComponent(moreText)}&query=${encodeURIComponent(userQuery)}`;
              window.open(contextUrl, "_blank");
            }
          });
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
