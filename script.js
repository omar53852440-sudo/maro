const giftButton = document.getElementById("giftButton");
const surprise = document.getElementById("surprise");
const tapLabel = document.getElementById("tapLabel");
const songFile = document.getElementById("songFile");
const song = document.getElementById("song");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const recordPlayer = document.querySelector(".record-player");
const musicStatus = document.getElementById("musicStatus");
const letterContent = document.querySelector(".letter-content");
let currentSongUrl = "";
let typingTimer = null;
let typingStarted = false;

const originalLetterHTML = letterContent.innerHTML;
const letterText = [
  { type: "heading", text: "يا هداية، يا أجمل روح 💜" },
  { type: "paragraph", text: "حبيت أعملك الهدية دي علشان أقولك إنك شخص مميز وغالي، وإن وجودك له معنى حلو." },
  { type: "paragraph", text: "أنا بحبك يا هداية، وبحب فيكي روحك وشخصيتك، وبتمنا لك من قلبي كل خير وفرحة ونجاح." },
  { type: "paragraph", text: "إن شاء الله أشوفك بتحققي حلمك وبتبقي الدكتورة اللي نفسك تكونيها، وتفضلي دايمًا فخورة بنفسك وبكل خطوة بتاخديها." },
  { type: "final", text: "بحبك يا هداية ❤️" },
  { type: "signature", text: "— مارو" }
];

function resetLetter() {
  if (typingTimer) window.clearTimeout(typingTimer);
  typingTimer = null;
  typingStarted = false;
  letterContent.innerHTML = "";
}

function typeLetter() {
  if (typingStarted) return;
  typingStarted = true;
  if (typingTimer) window.clearTimeout(typingTimer);

  letterContent.innerHTML = "";
  let blockIndex = 0;
  let charIndex = 0;
  let activeElement = null;

  function nextCharacter() {
    if (blockIndex >= letterText.length) {
      typingTimer = null;
      return;
    }

    const block = letterText[blockIndex];
    if (!activeElement) {
      activeElement = document.createElement(
        block.type === "heading" ? "h2" : "p"
      );
      if (block.type === "final") activeElement.className = "final-line";
      if (block.type === "signature") activeElement.className = "signature";
      letterContent.appendChild(activeElement);
      charIndex = 0;
    }

    if (charIndex < block.text.length) {
      activeElement.textContent += block.text.charAt(charIndex);
      charIndex += 1;
      typingTimer = window.setTimeout(nextCharacter, 55);
    } else {
      blockIndex += 1;
      activeElement = null;
      typingTimer = window.setTimeout(nextCharacter, 240);
    }
  }

  nextCharacter();
}

giftButton.addEventListener("click", () => {
  const isOpen = giftButton.classList.toggle("opened");
  if (isOpen) {
    surprise.hidden = false;
    tapLabel.textContent = "المفاجأة دي مخصوص علشانك يا هداية 💜";
    giftButton.setAttribute("aria-label", "الصندوق مفتوح");
    resetLetter();
    setTimeout(() => surprise.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
  } else {
    surprise.hidden = true;
    tapLabel.textContent = "اضغطي هنا وافتحي الهدية 🎁";
    giftButton.setAttribute("aria-label", "افتحي صندوق الهدية");
    song.pause();
    recordPlayer.classList.remove("playing");
    playButton.textContent = "▶ تشغيل الأغنية";
    pauseButton.disabled = true;
    resetLetter();
  }
});

songFile.addEventListener("change", () => {
  const file = songFile.files && songFile.files[0];
  if (!file) return;
  if (currentSongUrl) URL.revokeObjectURL(currentSongUrl);
  currentSongUrl = URL.createObjectURL(file);
  song.src = currentSongUrl;
  song.load();
  musicStatus.textContent = `تم اختيار الأغنية: ${file.name} — اضغطي تشغيل 🎵`;
  playButton.disabled = false;
});

playButton.addEventListener("click", async () => {
  if (!song.src) {
    musicStatus.textContent = "اختاري ملف أغنية من جهازك الأول، وبعدها اضغطي تشغيل 🎵";
    songFile.click();
    return;
  }
  try {
    await song.play();
    recordPlayer.classList.add("playing");
    musicStatus.textContent = "الأغنية شغّالة… والرسالة بتتكتب واحدة واحدة 💜";
    playButton.textContent = "▶ تشغيل من جديد";
    pauseButton.disabled = false;
    typeLetter();
  } catch (error) {
    musicStatus.textContent = "المتصفح منع التشغيل؛ اضغطي تشغيل مرة تانية.";
  }
});

pauseButton.addEventListener("click", () => {
  if (song.paused) return;
  song.pause();
  recordPlayer.classList.remove("playing");
  musicStatus.textContent = "الأغنية متوقفة مؤقتًا — الرسالة لسه موجودة 💌";
  pauseButton.disabled = true;
  playButton.textContent = "▶ استكمال الأغنية";
});

song.addEventListener("play", () => {
  recordPlayer.classList.add("playing");
  if (typingStarted) return;
  typeLetter();
});
song.addEventListener("pause", () => recordPlayer.classList.remove("playing"));
song.addEventListener("ended", () => {
  recordPlayer.classList.remove("playing");
  pauseButton.disabled = true;
});
