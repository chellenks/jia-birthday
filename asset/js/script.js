// Splash screen functionality
function hideSplashScreen() {
  const splashScreen = document.getElementById("splashScreen");
  const mainContent = document.querySelector(".container");

  splashScreen.style.animation = "fadeOut 0.8s ease-out forwards";

  setTimeout(() => {
    splashScreen.style.display = "none";
    mainContent.classList.remove("hidden");
  }, 800);
}

// Add fadeOut animation
const fadeOutStyle = document.createElement("style");
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
    }
`;
document.head.appendChild(fadeOutStyle);

let butterflyCount = 0;
let butterflies = [];
let currentAudio = null;
let butterflyInterval = null;

// Butterfly animations CSS
const butterflyStyle = document.createElement("style");
butterflyStyle.textContent = `
    .butterfly {
        position: fixed;
        width: 15%;
        height: 15%;
        background-image: url('asset/img/kupu-kupu.gif');
        background-size: contain;
        background-repeat: no-repeat;
        pointer-events: none;
        z-index: 2000;
        opacity: 0.8;
    }

    @keyframes butterflyFloat1 {
        0% { transform: translate(0, 0); }
        25% { transform: translate(200px, -100px); }
        50% { transform: translate(-150px, -200px); }
        75% { transform: translate(-300px, 50px); }
        100% { transform: translate(0, 0); }
    }

    @keyframes butterflyFloat2 {
        0% { transform: translate(0, 0); }
        20% { transform: translate(-250px, -150px); }
        40% { transform: translate(100px, -300px); }
        60% { transform: translate(300px, -100px); }
        80% { transform: translate(-100px, 100px); }
        100% { transform: translate(0, 0); }
    }

    @keyframes butterflyFloat3 {
        0% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(150px, -250px) scale(1.2); }
        66% { transform: translate(-200px, 50px) scale(0.8); }
        100% { transform: translate(0, 0) scale(1); }
    }

    .content-media {
        text-align: center;
        margin-bottom: 1rem;
    }

    .content-media img, .content-media video {
        width: 100%;
        max-width: 400px;
        border-radius: 15px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        margin-bottom: 1rem;
    }

    .content-media video {
        max-height: 300px;
        object-fit: cover;
    }
`;

document.head.appendChild(butterflyStyle);

function createButterfly() {
  const butterfly = document.createElement("div");
  butterfly.className = "butterfly";
  butterfly.id = `butterfly-${butterflyCount++}`;

  // Random starting position
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  butterfly.style.left = startX + "px";
  butterfly.style.top = startY + "px";

  // Random animation
  const animations = ["butterflyFloat1", "butterflyFloat2", "butterflyFloat3"];
  const randomAnimation =
    animations[Math.floor(Math.random() * animations.length)];
  const duration = 8 + Math.random() * 4; // 8-12 seconds

  butterfly.style.animation = `${randomAnimation} ${duration}s ease-in-out infinite`;

  document.body.appendChild(butterfly);
  butterflies.push(butterfly);

  return butterfly;
}

function removeAllButterflies() {
  butterflies.forEach((butterfly) => {
    if (butterfly && butterfly.parentNode) {
      butterfly.parentNode.removeChild(butterfly);
    }
  });
  butterflies = [];
  butterflyCount = 0;
}

function startButterflyAnimation() {
  // Create 3-5 butterflies with random intervals
  const butterflyAmount = 1 + Math.floor(Math.random() * 1);

  for (let i = 0; i < butterflyAmount; i++) {
    setTimeout(() => {
      createButterfly();
    }, i * 500); // Stagger creation
  }

  // Continue creating butterflies periodically
  const butterflyInterval = setInterval(() => {
    if (butterflies.length < 6) {
      // Max 6 butterflies
      createButterfly();
    }
  }, 3000 + Math.random() * 2000); // Every 3-5 seconds

  return butterflyInterval;
}

// Content for each candle
const contents = {
  1: {
    type: "media",
    title: "",
    content: `<img src="asset/img/content1.jpg" alt="Doa" onerror="this.style.display='none'">`,
  },
  2: {
    type: "media",
    title: "",
    content: `<video controls autoplay muted loop style="width: 100%; max-width: 90vw; max-height: 90vh; border-radius: 15px;">
        <source src="asset/img/content2.mp4" type="video/mp4">
        Video tidak dapat diputar
    </video>`,
  },
  3: {
    type: "media",
    title: "",
    content: `<img src="asset/img/content3.jpg" alt="Foto" onerror="this.style.display='none'">`,
  },
  4: {
    type: "media",
    title: "",
    content: `<video controls autoplay muted loop style="width: 100%; max-width: 90vw; max-height: 90vh; border-radius: 15px;">
        <source src="asset/img/content4.mp4" type="video/mp4">
        Video tidak dapat diputar
    </video>`,
  },
  5: {
    type: "media",
    title: "",
    content: `<img src="asset/img/content5.jpg" alt="Doa" onerror="this.style.display='none'">`,
  },
};

function blowCandle(candleNumber) {
  const flameWrapper = document.querySelector(
    `[data-content="${candleNumber}"]`
  );
  const flame = flameWrapper.querySelector(".interactive-flame");
  const smoke = flameWrapper.querySelector(".smoke");

  // Matikan api dan munculkan asap
  flame.style.opacity = "0";
  smoke.classList.remove("hidden");

  // Tampilkan modal dengan konten
  setTimeout(() => {
    showModal(candleNumber);
  }, 500);
}

function showModal(contentNumber) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const content = contents[contentNumber];

  // Hilangkan baris yang ada tombol close
  modalBody.innerHTML = `
        <h2 class="content-title">${content.title}</h2>
        ${content.content}
    `;

  modal.classList.remove("hidden");

  // Start butterfly animation when modal opens
  butterflyInterval = startButterflyAnimation();
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.add("hidden");

  // Stop musik jika sedang diputar
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  // Stop butterfly animation and remove all butterflies
  if (butterflyInterval) {
    clearInterval(butterflyInterval);
    butterflyInterval = null;
  }
  removeAllButterflies();
}

function playMusic() {
  const audio = document.getElementById("birthdayMusic");
  if (audio) {
    currentAudio = audio;
    audio.play().catch((e) => {
      alert("Silakan tambahkan file musik ke folder asset/music.mp3");
    });
  }
}

function pauseMusic() {
  if (currentAudio) {
    currentAudio.pause();
  }
}

// Close modal when clicking anywhere
window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (!modal.classList.contains("hidden")) {
    closeModal();
  }
};

// Handle window resize for butterfly positioning
window.addEventListener("resize", function () {
  removeAllButterflies();
  if (
    butterflyInterval &&
    !document.getElementById("modal").classList.contains("hidden")
  ) {
    butterflyInterval = startButterflyAnimation();
  }
});

// Welcome message - replaced with splash screen click handler
window.addEventListener("load", function () {
  const splashScreen = document.getElementById("splashScreen");
  splashScreen.addEventListener("click", hideSplashScreen);

  // Optional: Auto-hide after 10 seconds if not clicked
  setTimeout(() => {
    if (!splashScreen.style.display || splashScreen.style.display !== "none") {
      hideSplashScreen();
    }
  }, 10000);
});

// Add balloon effects
function createBalloon() {
  const balloon = document.createElement("div");
  const balloonColors = ["🎈", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍"];
  const randomColor =
    balloonColors[Math.floor(Math.random() * balloonColors.length)];

  balloon.innerHTML = randomColor;
  balloon.style.position = "fixed";
  balloon.style.left = Math.random() * 100 + "vw";
  balloon.style.bottom = "-50px";
  balloon.style.animationDuration = Math.random() * 4 + 6 + "s"; // 6-10 seconds
  balloon.style.opacity = Math.random() * 0.5 + 0.5; // 0.5-1 opacity
  balloon.style.fontSize = Math.random() * 20 + 30 + "px"; // 30-50px
  balloon.style.animation =
    "balloonFloat " + (Math.random() * 4 + 6) + "s ease-out forwards";
  balloon.style.zIndex = "100";

  document.body.appendChild(balloon);

  setTimeout(() => {
    balloon.remove();
  }, 10000);
}

// Add balloon animation CSS
const balloonStyle = document.createElement("style");
balloonStyle.textContent = `
    @keyframes balloonFloat {
        0% { 
            transform: translateY(0) rotate(0deg) translateX(0); 
            opacity: 0.8;
        }
        25% { 
            transform: translateY(-25vh) rotate(90deg) translateX(-20px); 
        }
        50% { 
            transform: translateY(-50vh) rotate(180deg) translateX(20px); 
        }
        75% { 
            transform: translateY(-75vh) rotate(270deg) translateX(-10px); 
        }
        100% { 
            transform: translateY(-120vh) rotate(360deg) translateX(0); 
            opacity: 0;
        }
    }
`;
document.head.appendChild(balloonStyle);
setInterval(createBalloon, 1000);
