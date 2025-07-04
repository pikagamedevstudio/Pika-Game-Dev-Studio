//====================//
// COUNTRY/STATE/CITY //
//====================//

const config = {
  cUrl: 'https://api.countrystatecity.in/v1/countries',
  ckey: 'Vmhpak5Lazh0VW04RDhzMm93bnJCMmUwOEw4QkgwYldGU1VQazVTVg=='
};

const countrySelect = document.getElementById('country');
const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');

function loadCountries() {
  fetch(config.cUrl, { headers: { "X-CSCAPI-KEY": config.ckey } })
    .then(res => res.json())
    .then(data => {
      data.forEach(country => {
        const option = document.createElement('option');
        option.value = country.iso2;
        option.textContent = country.name;
        countrySelect?.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error loading countries:', error);
      alert('Failed to load countries. Check your connection or API key.');
    });

  stateSelect.disabled = true;
  citySelect.disabled = true;
  stateSelect.style.pointerEvents = 'none';
  citySelect.style.pointerEvents = 'none';
}

function loadStates() {
  const selectedCountryCode = countrySelect?.value;
  stateSelect.innerHTML = '<option value="">Select State</option>';
  citySelect.innerHTML = '<option value="">Select City</option>';

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
        stateSelect?.appendChild(option);
      });
      stateSelect.disabled = false;
      stateSelect.style.pointerEvents = 'auto';

      citySelect.disabled = true;
      citySelect.style.pointerEvents = 'none';
    })
    .catch(error => {
      console.error('Error loading states:', error);
      alert('Failed to load states.');
    });
}

function loadCities() {
  const selectedCountryCode = countrySelect?.value;
  const selectedStateCode = stateSelect?.value;
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
        citySelect?.appendChild(option);
      });
      citySelect.disabled = false;
      citySelect.style.pointerEvents = 'auto';
    })
    .catch(error => {
      console.error('Error loading cities:', error);
      alert('Failed to load cities.');
    });
}

//====================//
// PAGE NAVIGATION    //
//====================//

function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));

  const targetPage = document.getElementById(pageId);
  targetPage.classList.add('active');
  targetPage.classList.add('fade-in');

  setTimeout(() => {
    targetPage.classList.remove('fade-in');
  }, 500);
}

//====================//
// MOBILE MENU TOGGLE //
//====================//

function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  const menuToggle = document.getElementById('menuToggle');

  navLinks.classList.toggle('active');
  menuToggle.classList.toggle('open');
}

//====================//
// PRE-REGISTRATION   //
//====================//

let currentStep = 1;

function openPreRegistration() {
  document.getElementById('preRegModal').classList.add('active');
  currentStep = 1;
  showStep(1);
}

function closePreRegistration() {
  document.getElementById('preRegModal').classList.remove('active');
  resetPreRegistration();
}

function nextStep(step) {
  if (step === 3) {
    const form = document.getElementById('preRegForm');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
  }

  if (currentStep > 0) {
    document.getElementById(`dot${currentStep}`).classList.add('completed');
    document.getElementById(`dot${currentStep}`).classList.remove('active');
  }

  currentStep = step;
  showStep(step);
  document.getElementById(`dot${step}`).classList.add('active');
}

function showStep(step) {
  const steps = document.querySelectorAll('.step');
  steps.forEach(s => s.classList.remove('active'));

  document.getElementById(`step${step}`).classList.add('active');
}

function resetPreRegistration() {
  currentStep = 1;
  for (let i = 1; i <= 5; i++) {
    const dot = document.getElementById(`dot${i}`);
    dot.classList.remove('active', 'completed');
    if (i === 1) dot.classList.add('active');
  }

  showStep(1);
  document.getElementById('preRegForm').reset();
  document.getElementById('gameSuggestions').value = '';
}

//====================//
// STAR RATING SYSTEM //
//====================//

const stars = document.querySelectorAll('.star');
let selectedRating = 0;

stars.forEach((star, index) => {
  star.addEventListener('click', () => {
    selectedRating = index + 1;
    updateStarDisplay();

    star.style.animation = 'none';
    setTimeout(() => {
      star.style.animation = 'starPulse 0.6s ease-out';
    }, 10);
  });

  star.addEventListener('mouseover', () => {
    if (selectedRating === 0) {
      highlightStars(index + 1);
    }
  });
});

document.querySelector('.star-rating')?.addEventListener('mouseleave', () => {
  if (selectedRating === 0) {
    clearStarHighlight();
  }
});

function highlightStars(rating) {
  stars.forEach((star, index) => {
    star.classList.remove('active', 'selected');
    if (index < rating) {
      star.classList.add('active');
    }
  });
}

function updateStarDisplay() {
  stars.forEach((star, index) => {
    star.classList.remove('active', 'selected');
    if (index < selectedRating) {
      star.classList.add('selected');
    }
  });
}

function clearStarHighlight() {
  stars.forEach(star => {
    star.classList.remove('active');
  });
}

//=========================//
// FORM SUBMISSION EVENTS //
//=========================//

document.addEventListener('DOMContentLoaded', function () {
  // Initialize country dropdown
  loadCountries();

  countrySelect?.addEventListener('change', loadStates);
  stateSelect?.addEventListener('change', loadCities);

  const elements = document.querySelectorAll('.card, .team-card, .btn');
  elements.forEach(el => {
    el.style.transition = 'all 0.3s ease';
  });

  document.getElementById('menuToggle')?.addEventListener('click', toggleMobileMenu);

  document.getElementById('contactForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    this.reset();
  });

  document.getElementById('feedbackForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    if (selectedRating === 0) {
      alert('Please select a star rating before submitting.');
      return;
    }
    alert("Thank you for your feedback! Your input helps us improve.");
    this.reset();
    selectedRating = 0;
    clearStarHighlight();
  });
});