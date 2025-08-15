//====================//
// CONFIGURATION      //
//====================//
const config = {
  cUrl: 'https://api.countrystatecity.in/v1/countries',
  ckey: 'Vmhpak5Lazh0VW04RDhzMm93bnJCMmUwOEw4QkgwYldGU1VQazVTVg=='
};

//====================//
// ELEMENT REFERENCES //
//====================//
const countrySelect = document.getElementById('country');
const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');
const feedbackForm = document.getElementById('feedbackForm');
const star = document.querySelectorAll('.star');

//====================//
// COUNTRY -> STATE -> CITY LOGIC //
//====================//
function loadCountries() {
  // disable selects if present
  if (stateSelect) {
    stateSelect.disabled = true;
    stateSelect.style.pointerEvents = 'none';
  }
  if (citySelect) {
    citySelect.disabled = true;
    citySelect.style.pointerEvents = 'none';
  }

  // If no country select on this page, skip populating but keep function safe
  if (!countrySelect) return;

  fetch(config.cUrl, { headers: { "X-CSCAPI-KEY": config.ckey } })
    .then(res => res.json())
    .then(data => {
      data.forEach(country => {
        const option = document.createElement('option');
        option.value = country.iso2;
        option.textContent = country.name;
        countrySelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error loading countries:', error);
      // no alert here to avoid annoying user on pages without selects
    });
}

function loadStates() {
  const selectedCountryCode = countrySelect?.value;
  if (!stateSelect) return;
  stateSelect.innerHTML = '<option value="">Select State</option>';
  if (citySelect) citySelect.innerHTML = '<option value="">Select City</option>';

  if (!selectedCountryCode) return;

  fetch(`${config.cUrl}/${selectedCountryCode}/states`, {
    headers: { "X-CSCAPI-KEY": config.ckey }
  })
    .then(res => res.json())
    .then(data => {
      data.forEach(state => {
        const option = document.createElement('option');
        option.value = state.iso2;
        option.textContent = state.name;
        stateSelect.appendChild(option);
      });
      stateSelect.disabled = false;
      stateSelect.style.pointerEvents = 'auto';
      if (citySelect) {
        citySelect.disabled = true;
        citySelect.style.pointerEvents = 'none';
      }
    })
    .catch(error => {
      console.error('Error loading states:', error);
    });
}

function loadCities() {
  const selectedCountryCode = countrySelect?.value;
  const selectedStateCode = stateSelect?.value;
  if (!citySelect) return;
  citySelect.innerHTML = '<option value="">Select City</option>';

  if (!selectedCountryCode || !selectedStateCode) return;

  fetch(`${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`, {
    headers: { "X-CSCAPI-KEY": config.ckey }
  })
    .then(res => res.json())
    .then(data => {
      data.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name;
        option.textContent = city.name;
        citySelect.appendChild(option);
      });
      citySelect.disabled = false;
      citySelect.style.pointerEvents = 'auto';
    })
    .catch(error => {
      console.error('Error loading cities:', error);
    });
}

//====================//
// MOBILE MENU TOGGLE //
//====================//
function toggleMobileMenu() {
  const navLinks = document.getElementById('mobileMenu'); // Mobile menu div
  const menuToggle = document.getElementById('menuToggle'); // Hamburger button

  if (!navLinks || !menuToggle) return;

  // Show/hide menu
  navLinks.classList.toggle('hidden');
  menuToggle.classList.toggle('open');
}

//====================//
// PAGE NAVIGATION    //
//====================//
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  const targetPage = document.getElementById(pageId);
  if (!targetPage) return;
  targetPage.classList.add('active');
  targetPage.classList.add('fade-in');
  setTimeout(() => {
    targetPage.classList.remove('fade-in');
  }, 500);
}

//====================//
// PRE-REGISTRATION FLOW //
//====================//
let currentStep = 1;

function openPreRegistration() {
  const modal = document.getElementById('preRegModal');
  if (!modal) return;
  modal.classList.add('active');
  currentStep = 1;
  showStep(1);
}

function closePreRegistration() {
  const modal = document.getElementById('preRegModal');
  if (!modal) return;
  modal.classList.remove('active');
  resetPreRegistration();
}

function nextStep(step) {
  if (step === 3) {
    const form = document.getElementById('preRegForm');
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const fullName = document.getElementById('fullName')?.value || "";
    const email = document.getElementById('email')?.value || "";
    const country = countrySelect?.options[countrySelect.selectedIndex]?.text || "";
    const state = stateSelect?.options[stateSelect.selectedIndex]?.text || "";
    const city = citySelect?.options[citySelect.selectedIndex]?.text || "";

    const selectedGenres = [];
    ['fighting', 'simulation', 'sandbox', 'flying', 'multiplayer'].forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox?.checked) {
        selectedGenres.push(checkbox.nextElementSibling?.textContent || "");
      }
    });

    const confirmEl = document.getElementById('confirmData');
    if (confirmEl) {
      confirmEl.innerHTML = `
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Location:</strong> ${city}, ${state}, ${country}</p>
        <p><strong>Favorite Genres:</strong> ${selectedGenres.length > 0 ? selectedGenres.join(', ') : 'None'}</p>
      `;
    }
  }

  if (currentStep > 0) {
    const oldDot = document.getElementById(`dot${currentStep}`);
    oldDot?.classList.add('completed');
    oldDot?.classList.remove('active');
  }
  currentStep = step;
  showStep(step);
  document.getElementById(`dot${step}`)?.classList.add('active');
}

function showStep(step) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const stepEl = document.getElementById(`step${step}`);
  if (stepEl) stepEl.classList.add('active');
}

function resetPreRegistration() {
  currentStep = 1;
  for (let i = 1; i <= 5; i++) {
    const dot = document.getElementById(`dot${i}`);
    if (!dot) continue;
    dot.classList.remove('active', 'completed');
    if (i === 1) dot.classList.add('active');
  }
  showStep(1);
  const form = document.getElementById('preRegForm');
  if (form) form.reset();
}

//====================//
// STAR RATING SYSTEM //
//====================//
const stars = document.querySelectorAll('.star');
let selectedRating = 0;

if (stars && stars.length) {
  stars.forEach((starEl, index) => {
    starEl.addEventListener('click', () => {
      selectedRating = index + 1;
      updateStarDisplay();
      starEl.style.animation = 'none';
      setTimeout(() => starEl.style.animation = 'starPulse 0.6s ease-out', 10);
      const ratingInput = document.getElementById('ratingInput');
      if (ratingInput) ratingInput.value = selectedRating;
    });

    starEl.addEventListener('mouseover', () => {
      if (selectedRating === 0) highlightStars(index + 1);
    });
  });

  document.querySelector('#starRating')?.addEventListener('mouseleave', () => {
    if (selectedRating === 0) clearStarHighlight();
  });
}

function highlightStars(rating) {
  stars.forEach((s, i) => {
    s.classList.remove('active', 'selected');
    if (i < rating) s.classList.add('active');
  });
}

function updateStarDisplay() {
  stars.forEach((s, i) => {
    s.classList.remove('active', 'selected');
    if (i < selectedRating) s.classList.add('selected');
  });
}

function clearStarHighlight() {
  stars.forEach(s => s.classList.remove('active'));
}

//=============================//
// LOAD BRANCH CONTENT & BG MUSIC //
//=============================//

/**
 * Loads a small plaintext file (pika-main.txt, etc.) into an element.
 * IMPORTANT: Use correct relative paths. This function adds a cache-busting query
 * so that during dev you always get fresh content.
 */
function loadBranchContent(file, elementId) {
  const el = document.getElementById(elementId);
  if (!el) {
    console.warn("loadBranchContent: element not found ->", elementId);
    return;
  }

  fetch(`${file}?v=${Date.now()}`, { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch ${file} (status ${res.status})`);
      return res.text();
    })
    .then(text => {
      el.textContent = text.trim();
    })
    .catch(err => {
      console.error("Error loading branch file:", file, err);
      el.textContent = "Failed to load.";
    });
}

//=============================//
// DOMContentLoaded - main init //
//=============================//
document.addEventListener('DOMContentLoaded', function () {
  // 1) Countries (if select exists)
  try {
    loadCountries();
    countrySelect?.addEventListener('change', loadStates);
    stateSelect?.addEventListener('change', loadCities);
  } catch (e) {
    console.warn("Country/state/city initialization skipped.", e);
  }

  // 2) Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMobileMenu);
  }

  // 3) Mobile menu auto-close on link click
  document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobileMenu')?.classList.add('hidden');
    });
  });

  // 4) Simple UI transitions
  document.querySelectorAll('.card, .team-card, .btn').forEach(el => {
    el.style.transition = 'all 0.3s ease';
  });

  // 5) Contact form submit (Formspree)
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const message = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !message) {
        if (contactStatus) {
          contactStatus.textContent = "❌ Please fill all fields before sending your message!";
          contactStatus.classList.add("text-red-500");
        }
        return;
      }

      fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      })
        .then(res => {
          if (res.ok) {
            if (contactStatus) {
              contactStatus.textContent = "✅ Message sent successfully!";
              contactStatus.classList.remove("text-red-500");
              contactStatus.classList.add("text-green-500");
            }
            contactForm.reset();
          } else {
            if (contactStatus) {
              contactStatus.textContent = "❌ Failed to send message. Try again.";
              contactStatus.classList.add("text-red-500");
            }
          }
        })
        .catch(() => {
          if (contactStatus) {
            contactStatus.textContent = "⚠️ Something went wrong. Try later.";
            contactStatus.classList.add("text-red-500");
          }
        });
    });
  }

  // 6) Feedback form
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const comment = document.getElementById('feedbackComment')?.value.trim();
      if (selectedRating === 0 || !comment) {
        alert("Please select a rating and write a comment before submitting.");
        return;
      }
      alert("Thank you for your feedback! Your input helps us improve.");
      feedbackForm.reset();
      selectedRating = 0;
      clearStarHighlight();
    });
  }

  // 7) Load about-us branch files
  const branches = [
    ["pika-main.txt", "mainBranch"],
    ["pika-studio.txt", "branch1"],
    ["pika-tech.txt", "branch2"],
    ["pika-publishers.txt", "branch3"]
  ];

  branches.forEach(([file, id]) => loadBranchContent(file, id));

  // 8) BG Music: try autoplay; if blocked, play on first user interaction (click/keydown/scroll/touch)
  const music = document.getElementById('bgMusic');
  if (music) {
    // Try immediate play (may be blocked)
    music.play().catch(() => {
      // If blocked, add listeners that try once on first interaction
      const playOnInteraction = () => {
        music.play().catch(err => console.log("Music play blocked on interaction:", err));
        // remove listeners after trying
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('keydown', playOnInteraction);
        document.removeEventListener('scroll', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
      };
      document.addEventListener('click', playOnInteraction, { passive: true });
      document.addEventListener('keydown', playOnInteraction, { passive: true });
      document.addEventListener('scroll', playOnInteraction, { passive: true });
      document.addEventListener('touchstart', playOnInteraction, { passive: true });
    });
  } else {
    console.warn("bgMusic element not found (#bgMusic).");
  }
});
/* ================================================
   tsParticles Initialization
   - Adds interactive particle background to all pages
   - Fullscreen canvas with neon futuristic effect
   - Hover: grab particles, Click: push particles
================================================ */
tsParticles.load("tsparticles", {
    fpsLimit: 60,
    background: {
        color: "#0a0a0a"
    },
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                area: 800
            }
        },
        color: {
            value: ["#00ffff", "#ff00ff", "#ffff00"]
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.7,
            random: true
        },
        size: {
            value: 3,
            random: true
        },
        move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
                default: "out"
            }
        },
        links: {
            enable: true,
            distance: 120,
            color: "#ffffff",
            opacity: 0.3,
            width: 1
        }
    },
    interactivity: {
        detectsOn: "canvas",
        events: {
            onHover: {
                enable: true,
                mode: "grab"
            },
            onClick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                links: {
                    opacity: 0.5
                }
            },
            push: {
                quantity: 4
            }
        }
    },
    detectRetina: true
});

