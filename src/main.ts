import "./style.css";
import { buildZineEpubBlob } from "./epub/buildEpub";
import { renderEpubFromBlob } from "./epub/preview";
import { themes, getThemeById, getDefaultTheme } from "./epub/themes";
import { parseChannelInput } from "./arena/api";
import type { PreviewResult } from "./epub/preview";
import type { Rendition } from "epubjs";
import type { WorkerMessage, WorkerResponse } from "./worker/zineWorker";
import ZineWorker from "./worker/zineWorker?worker";

const themeOptions = themes
  .map((t) => `<option value="${t.id}"${t.id === "zine" ? " selected" : ""}>${t.name}</option>`)
  .join("");

// Suggested channels for users to try
const SUGGESTED_CHANNELS = [
  { slug: "arena-influences", label: "Arena Influences" },
  { slug: "creative-coding", label: "Creative Coding" },
  { slug: "brutalist-websites", label: "Brutalist Websites" },
  { slug: "ambient", label: "Ambient" },
];

const suggestedHtml = SUGGESTED_CHANNELS
  .map(c => `<button class="suggestion-pill" data-slug="${c.slug}">${c.label}</button>`)
  .join("");

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <header class="header">
      <h1>Are.na → Zine</h1>
      <p class="subtitle">Turn your Are.na channels into an artsy book</p>
    </header>
    
    <div class="arena-input-group">
      <label for="arena-channel">Are.na Channels</label>
      <div id="channel-chips" class="channel-chips"></div>
      <div class="input-row">
        <input 
          type="text" 
          id="arena-channel" 
          class="input" 
          placeholder="Add channel URL or slug..."
        />
        <button id="add-channel" class="btn btn-small">+ Add</button>
      </div>
      <p class="input-hint">Add one or more public Are.na channels. Press Enter or click Add.</p>
      <div class="suggested-channels">
        <span class="suggested-label">Try:</span>
        ${suggestedHtml}
      </div>
    </div>
    
    <div id="channel-info" class="channel-info hidden">
      <div class="channel-meta">
        <h3 class="channel-title"></h3>
        <p class="channel-stats"></p>
      </div>
    </div>
    
    <div id="progress-bar" class="progress-bar hidden">
      <div class="progress-fill"></div>
      <span class="progress-text">Loading...</span>
    </div>
    
    <div class="theme-selector">
      <label for="theme-select">Theme</label>
      <select id="theme-select" class="select">
        ${themeOptions}
      </select>
    </div>
    
    <div class="controls">
      <button id="btn" class="btn btn-primary">
        <span class="btn-icon">⚡</span>
        Generate Zine
      </button>
      <button id="prev" class="btn btn-secondary" disabled>
        <span class="btn-icon">←</span>
        Prev
      </button>
      <button id="next" class="btn btn-secondary" disabled>
        <span class="btn-icon">→</span>
        Next
      </button>
      <button id="dl" class="btn btn-accent" disabled>
        <span class="btn-icon">↓</span>
        Download
      </button>
    </div>
    
    <div id="viewer" class="viewer">
      <div class="placeholder">
        <span class="placeholder-icon">✂️</span>
        <p>Enter an Are.na channel above and click Generate</p>
      </div>
    </div>
    
    <footer class="footer">
      <p>Works with public Are.na channels • Images & text become collage spreads</p>
    </footer>
  </div>
`;

const btn = document.querySelector<HTMLButtonElement>("#btn")!;
const prev = document.querySelector<HTMLButtonElement>("#prev")!;
const next = document.querySelector<HTMLButtonElement>("#next")!;
const dl = document.querySelector<HTMLButtonElement>("#dl")!;
const viewer = document.querySelector<HTMLDivElement>("#viewer")!;
const themeSelect = document.querySelector<HTMLSelectElement>("#theme-select")!;
const channelInput = document.querySelector<HTMLInputElement>("#arena-channel")!;
const addChannelBtn = document.querySelector<HTMLButtonElement>("#add-channel")!;
const channelChips = document.querySelector<HTMLDivElement>("#channel-chips")!;
const channelInfo = document.querySelector<HTMLDivElement>("#channel-info")!;
const progressBar = document.querySelector<HTMLDivElement>("#progress-bar")!;
const progressFill = progressBar.querySelector<HTMLDivElement>(".progress-fill")!;
const progressText = progressBar.querySelector<HTMLSpanElement>(".progress-text")!;
const suggestionPills = document.querySelectorAll<HTMLButtonElement>(".suggestion-pill");

let currentBlob: Blob | null = null;
let rendition: Rendition | null = null;
let currentChannelSlugs: string[] = [];
let worker: Worker | null = null;

// Track added channels
const addedChannels = new Set<string>();

function renderChips() {
  channelChips.innerHTML = Array.from(addedChannels)
    .map(slug => `
      <div class="channel-chip" data-slug="${slug}">
        <span class="chip-text">${slug}</span>
        <button class="chip-remove" data-slug="${slug}" aria-label="Remove ${slug}">×</button>
      </div>
    `)
    .join("");
  
  // Add remove listeners
  channelChips.querySelectorAll<HTMLButtonElement>(".chip-remove").forEach(btn => {
    btn.onclick = () => {
      const slug = btn.dataset.slug;
      if (slug) {
        addedChannels.delete(slug);
        renderChips();
      }
    };
  });
}

function addChannel(input: string) {
  const slug = parseChannelInput(input.trim());
  if (slug && !addedChannels.has(slug)) {
    addedChannels.add(slug);
    renderChips();
    channelInput.value = "";
  }
}

function showError(message: string) {
  viewer.innerHTML = `<div class="error">${message}</div>`;
}

function showProgress(percent: number, text: string) {
  progressBar.classList.remove("hidden");
  progressFill.style.width = `${percent}%`;
  progressText.textContent = text;
}

function hideProgress() {
  progressBar.classList.add("hidden");
}

function showChannelInfo(title: string, stats: string) {
  channelInfo.classList.remove("hidden");
  const titleEl = channelInfo.querySelector(".channel-title")!;
  const statsEl = channelInfo.querySelector(".channel-stats")!;
  titleEl.textContent = title;
  statsEl.textContent = stats;
}

function hideChannelInfo() {
  channelInfo.classList.add("hidden");
}

function resetUI() {
  btn.disabled = false;
  btn.innerHTML = `<span class="btn-icon">⚡</span> Generate Zine`;
  if (worker) {
    worker.terminate();
    worker = null;
  }
}

// Allow Enter key to add channel
channelInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const input = channelInput.value.trim();
    if (input) {
      addChannel(input);
    }
  }
});

// Add channel button
addChannelBtn.onclick = () => {
  const input = channelInput.value.trim();
  if (input) {
    addChannel(input);
  }
};

// Suggestion pills
suggestionPills.forEach(pill => {
  pill.onclick = () => {
    const slug = pill.dataset.slug;
    if (slug) {
      addChannel(slug);
    }
  };
});

// Generate zine using Web Worker
btn.onclick = async () => {
  // If there's text in the input, add it first
  const input = channelInput.value.trim();
  if (input) {
    addChannel(input);
  }
  
  if (addedChannels.size === 0) {
    showError("Please add at least one Are.na channel");
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<span class="btn-icon">⏳</span> Creating...`;
  hideChannelInfo();
  
  const selectedTheme = getThemeById(themeSelect.value) ?? getDefaultTheme();
  const channelSlugs = Array.from(addedChannels);
  currentChannelSlugs = channelSlugs;

  showProgress(0, "Starting worker...");
  
  // Terminate any existing worker
  if (worker) {
    worker.terminate();
  }
  
  worker = new ZineWorker();
  
  worker.onmessage = async (e: MessageEvent<WorkerResponse>) => {
    const msg = e.data;
    
    if (msg.type === "progress") {
      showProgress(msg.percent * 0.8, msg.message); // Reserve 20% for EPUB build
    } else if (msg.type === "complete") {
      try {
        console.log("[Main] Received complete message");
        // Show channel info
        showChannelInfo(msg.title, `${msg.chapters.length} pages • ${msg.images.length} images`);
        
        showProgress(82, "Building EPUB...");
        console.log("[Main] Building EPUB...");
        
        // Convert worker data to the format buildZineEpubBlob expects
        const zineChapters = msg.chapters.map(c => ({
          title: c.title,
          html: c.html,
          images: c.images,
        }));
        
        const images = msg.images.map(img => ({
          id: img.id,
          filename: img.filename,
          data: img.data,
          mediaType: img.mediaType,
        }));
        
        console.log("[Main] Calling buildZineEpubBlob with", zineChapters.length, "chapters,", images.length, "images");
        
        // Build EPUB on main thread
        const blob = await buildZineEpubBlob({
          title: msg.title,
          author: msg.author,
          language: "en",
          zineChapters,
          images,
          css: selectedTheme.css,
        });
        
        console.log("[Main] EPUB built, size:", blob.size);
        currentBlob = blob;
        
        // Enable download immediately after EPUB is built
        dl.disabled = false;
        
        showProgress(92, "Rendering preview...");
        console.log("[Main] Rendering preview...");
        
        // Add timeout to preview rendering
        const previewPromise = renderEpubFromBlob(blob, viewer, {
          height: "600px",
          width: "100%",
        });
        
        const timeoutPromise = new Promise<null>((_, reject) => 
          setTimeout(() => reject(new Error("Preview timeout")), 30000)
        );
        
        try {
          const result = await Promise.race([previewPromise, timeoutPromise]) as PreviewResult;
          console.log("[Main] Preview rendered!");
          rendition = result.rendition;
          showProgress(100, "Done!");
        } catch (previewError) {
          console.warn("[Main] Preview failed or timed out:", previewError);
          viewer.innerHTML = `<div class="placeholder">
            <span class="placeholder-icon">📚</span>
            <p>Preview unavailable for large files. Click Download to get your EPUB!</p>
          </div>`;
          showProgress(100, "Ready to download!");
        }
        
        setTimeout(hideProgress, 500);

        prev.disabled = false;
        next.disabled = false;
        dl.disabled = false;
      } catch (error) {
        hideProgress();
        console.error("Failed to build EPUB:", error);
        showError("Failed to build EPUB. Check console for details.");
      } finally {
        resetUI();
      }
    } else if (msg.type === "error") {
      hideProgress();
      showError(msg.message);
      resetUI();
    }
  };
  
  worker.onerror = (error) => {
    hideProgress();
    console.error("Worker error:", error);
    showError("Worker error. Check console for details.");
    resetUI();
  };
  
  // Start the worker
  const message: WorkerMessage = { type: "generate", channelSlugs };
  worker.postMessage(message);
};

prev.onclick = () => rendition?.prev();
next.onclick = () => rendition?.next();

dl.onclick = () => {
  if (!currentBlob) return;
  const filename = currentChannelSlugs.length > 0 
    ? `${currentChannelSlugs.join("-")}-zine.epub`
    : "demo-zine.epub";
  const url = URL.createObjectURL(currentBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
