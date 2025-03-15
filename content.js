console.log("[Scrappifier]: Loaded");

// Add base styles
const styleElement = document.createElement("style");
styleElement.textContent = `
  .letter {
    display: inline-block;
    transition: transform 0.2s ease;
  }
`;
document.head.appendChild(styleElement);

// Use local audio file from extension
const audioElement = document.createElement("audio");
audioElement.src = chrome.runtime.getURL("assets/My Song 16.m4a");
audioElement.loop = true;
audioElement.autoplay = true;
document.body.appendChild(audioElement);

// Define the mutation handler as a named function
function handleMutations() {
  // document.querySelectorAll("img").forEach((img) => {
  //   if (img.classList.contains("processed-by-destroyer")) return;

  //   img.src = `https://wsrv.nl/?url=${encodeURIComponent(
  //     img.src
  //   )}&w=300&q=1&output=jpg`;

  //   img.classList.add("processed-by-destroyer");
  // });

  document
    .querySelectorAll("h1, h2, h3, h4, p, a, ul, li, code")
    .forEach((element) => {
      if (element.classList.contains("processed-by-destroyer")) return;

      // Skip elements with already processed letters inside
      if (element.querySelector(".letter")) return;

      // Clone the element to work with its HTML
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = element.innerHTML;

      // Process only text nodes, preserve HTML structure
      const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          let newHTML = "";

          for (const letter of text) {
            newHTML += `<span class="letter">${letter}</span>`;
          }

          const fragment = document
            .createRange()
            .createContextualFragment(newHTML);
          node.replaceWith(fragment);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Process child nodes recursively
          Array.from(node.childNodes).forEach(processNode);
        }
      };

      Array.from(tempContainer.childNodes).forEach(processNode);

      element.innerHTML = tempContainer.innerHTML;
      element.classList.add("processed-by-destroyer");
    });

  if (!document.body.classList.contains("destroyer-styled")) {
    document.body.style.cssText = `
      background-color: #ff13f0 !important;
      color: #5bff2f !important;
    `;
    document.querySelectorAll("a").forEach((a) => {
      a.style.fontSize = "20px";
    });
    document.body.classList.add("destroyer-styled");
  }

  return false;
}

// Initial page load
handleMutations();

// Replace VM.observe with MutationObserver for extensions
const observer = new MutationObserver(() => {
  handleMutations();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

if (!window.destroyerEventsAttached) {
  document.addEventListener("click", () => {
    if (audioElement.paused) {
      audioElement.play();
    }
  });

  let lastUpdate = 0;
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastUpdate < 1000) return; // Only update every second
    lastUpdate = now;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    document.querySelectorAll(".letter").forEach((letter) => {
      const rect = letter.getBoundingClientRect();
      const letterX = rect.left + rect.width / 2;
      const letterY = rect.top + rect.height / 2;

      const dx = mouseX - letterX;
      const dy = mouseY - letterY;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + Math.random() * 180;

      angle += Math.random() * 90;

      letter.style.transform = `rotate(${angle}deg)`;
    });
  });

  window.destroyerEventsAttached = true;
}
