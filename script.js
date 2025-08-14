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
// MOBILE MENU TOGGLE //
//====================//
function toggleMobileMenu() {
  const navLinks = document.getElementById('mobileMenu'); // Mobile menu div
  const menuToggle = document.getElementById('menuToggle'); // Hamburger button

  // Show/hide menu
  navLinks.classList.toggle('hidden');
  menuToggle.classList.toggle('open');
}

// Ensure listener is active after page load
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMobileMenu);
  }
});

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
// PRE-REGISTRATION FLOW //
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
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const country = countrySelect?.options[countrySelect.selectedIndex]?.text || "";
    const state = stateSelect?.options[stateSelect.selectedIndex]?.text || "";
    const city = citySelect?.options[citySelect.selectedIndex]?.text || "";

    const selectedGenres = [];
    ['fighting', 'simulation', 'sandbox', 'flying', 'multiplayer'].forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox?.checked) {
        selectedGenres.push(checkbox.nextElementSibling.textContent);
      }
    });

    document.getElementById('confirmData').innerHTML = `
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Location:</strong> ${city}, ${state}, ${country}</p>
      <p><strong>Favorite Genres:</strong> ${selectedGenres.length > 0 ? selectedGenres.join(', ') : 'None'}</p>
    `;
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
    setTimeout(() => star.style.animation = 'starPulse 0.6s ease-out', 10);
  });

  star.addEventListener('mouseover', () => {
    if (selectedRating === 0) highlightStars(index + 1);
  });
});

document.querySelector('.star-rating')?.addEventListener('mouseleave', () => {
  if (selectedRating === 0) clearStarHighlight();
});

function highlightStars(rating) {
  stars.forEach((star, index) => {
    star.classList.remove('active', 'selected');
    if (index < rating) star.classList.add('active');
  });
}

function updateStarDisplay() {
  stars.forEach((star, index) => {
    star.classList.remove('active', 'selected');
    if (index < selectedRating) star.classList.add('selected');
  });
}

function clearStarHighlight() {
  stars.forEach(star => star.classList.remove('active'));
}

//=============================//
// DOM CONTENT LOADED HANDLER //
//=============================//
document.addEventListener('DOMContentLoaded', function () {
  // Init country data
  loadCountries();
  countrySelect?.addEventListener('change', loadStates);
  stateSelect?.addEventListener('change', loadCities);

  // Mobile menu link close
  document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.add('hidden');
    });
  });

  // Transitions for UI elements
  document.querySelectorAll('.card, .team-card, .btn').forEach(el => {
    el.style.transition = 'all 0.3s ease';
  });

  // Mobile menu toggle
  document.getElementById('menuToggle')?.addEventListener('click', toggleMobileMenu);

  // Contact form submission with Formspree
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const message = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !message) {
        contactStatus.textContent = "❌ Please fill all fields before sending your message!";
        contactStatus.classList.add("text-red-500");
        return;
      }

      fetch('https://formspree.io/f/movllbee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      })
        .then(res => {
          if (res.ok) {
            contactStatus.textContent = "✅ Message sent successfully!";
            contactStatus.classList.remove("text-red-500");
            contactStatus.classList.add("text-green-500");
            contactForm.reset();
          } else {
            contactStatus.textContent = "❌ Failed to send message. Try again.";
            contactStatus.classList.add("text-red-500");
          }
        })
        .catch(() => {
          contactStatus.textContent = "⚠️ Something went wrong. Try later.";
          contactStatus.classList.add("text-red-500");
        });
    });
  }

  // Feedback form submission
if (feedbackForm) {
  feedbackForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const comment = document.getElementById('feedbackComment')?.value.trim();
    if (selectedRating === 0 || comment === '') {
      alert("Please select a rating and write a comment before submitting.");
      return;
    }
    alert("Thank you for your feedback! Your input helps us improve.");
    feedbackForm.reset();
    selectedRating = 0;
    clearStarHighlight();
  }); 
}
});
window.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('bgMusic');
  music.play().catch(() => {
    // If browser blocks autoplay, play on first user click
    document.addEventListener('click', () => {
      music.play();
    }, { once: true });
  });
});

window.addEventListener("DOMContentLoaded", () => {
  loadBranchContent("pika-main.txt", "mainBranch");
  loadBranchContent("pika-studio.txt", "branch1");
  loadBranchContent("pika-tech.txt", "branch2");
  loadBranchContent("pika-publishers.txt", "branch3");
});

function loadBranchContent(file, elementId) {
  fetch(file)
    .then(res => res.ok ? res.text() : "Unable to load content.")
    .then(text => {
      document.getElementById(elementId).innerText = text;
    })
    .catch(() => {
      document.getElementById(elementId).innerText = "Failed to load.";
    });
}
// BG Music play on first click
  const music = document.getElementById('bgMusic');
  document.addEventListener('click', () => {
    if (music && music.paused) {
      music.play().catch(err => console.log("Music play blocked:", err));
    }
  }, { once: true });
});

;(function() {
  // Prevent double-injection
  if (window.MDWCurvedSliderInjected) return;
  window.MDWCurvedSliderInjected = true;

  function attachCurvedSlider() {
    var selector = "[class^='mdw-curved-slider'], [class*=' mdw-curved-slider']",
        scene = [],
        renderer = [],
        options = [],
        time = [],
        camera = [],
        slideAmount = [],
        currentContainerHeight = [],
        previousContainerHeight = [],
        planes = [];

    addEventListener('DOMContentLoaded', function(){

      function getWidth(gap){ return 1 + gap/100; }

      function getPlaneWidth(el, camera){
        var vFov = camera.fov * Math.PI / 180,
            height = 2 * Math.tan(vFov/2) * camera.position.z,
            aspect = el.clientWidth / el.clientHeight,
            width = height * aspect;
        return el.clientWidth / width;
      }

      function init(e = 'none'){
        Array.from(document.querySelectorAll(selector)).forEach(function(el, index){

          if( e == 'none' ){
              currentContainerHeight[index] = previousContainerHeight[index] = el.clientHeight;
          } else {
              currentContainerHeight[index] = el.clientHeight;
              if( mobileHeightChage && currentContainerHeight[index] == previousContainerHeight[index] ) return;
          }

          previousContainerHeight[index] = currentContainerHeight[index];

          var className = el.getAttribute('class') || '';
          var classNameIndex = className.indexOf('mdw-curved-slider');
          if (classNameIndex === -1) return; // no matching class, skip
          // find end of that short class safely (if no trailing space, use length)
          var spaceIndex = className.indexOf(' ', classNameIndex);
          if (spaceIndex === -1) spaceIndex = className.length;
          var shortClass = className.substring(classNameIndex, spaceIndex);
          var values = shortClass.split('-');

          options[index] = {
              speed: 30,
              gap: 10,
              curve: 12,
              direction: -1
          };

          values.forEach(function(value, i){
              if(value=='speed' && values[i+1] && !isNaN(values[i+1])){
                  options[index].speed = values[i+1];
              }
              if(value=='gap' && values[i+1] && !isNaN(values[i+1])){
                  options[index].gap = values[i+1];
              }
              if(value=='curve' && values[i+1] && !isNaN(values[i+1])){
                  options[index].curve = values[i+1];
              }
              if(value=='reverse'){ options[index].direction = 1; }
          });

          var images = [], allImages = [];
          time[index] = 0;

          Array.from(el.querySelectorAll('.elementor-widget-image-gallery .gallery-item')).forEach(function(gEl){
            var img = gEl.querySelector('img');
            if(img && img.getAttribute('src')) images.push(img.getAttribute('src'));
          });

          if (images.length === 0) {
            // nothing to render, skip this container
            return;
          }

          allImages = images.slice();
          slideAmount[index] = images.length;

          scene[index] = new THREE.Scene();
          camera[index] = new THREE.PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 20);
          camera[index].position.z = 2;

          renderer[index] = new THREE.WebGLRenderer({ alpha: true, antialias: true });
          renderer[index].setSize(el.clientWidth, el.clientHeight);
          renderer[index].setPixelRatio(window.devicePixelRatio);

          var previousCanvas = el.querySelector('canvas');
          if(previousCanvas) { el.removeChild(previousCanvas); }
          el.appendChild(renderer[index].domElement);

          var geometry = new THREE.PlaneGeometry(1, 1, 20, 20),
              planeSpace = getPlaneWidth(el, camera[index]) * getWidth(options[index].gap),
              ratio = Math.ceil(el.clientWidth / (planeSpace * images.length)),
              totalImage = Math.ceil(el.clientWidth / planeSpace) + 1 + images.length,
              initialOffset = Math.ceil(el.clientWidth / (2 * planeSpace) - 0.5);

          for(var i = slideAmount[index]; i < totalImage; i++){
            allImages.push(images[i % slideAmount[index]]);
          }

          planes[index] = [];

          allImages.forEach(function (image, i) {
            var loader = new THREE.TextureLoader();
            loader.load(
              image,
              function ( texture ) {
                var material = new THREE.ShaderMaterial({
                  uniforms: {
                    tex: { value: texture },
                    curve: { value: options[index].curve }
                  },
                  vertexShader: `
                    uniform float curve;
                    varying vec2 vertexUV;
                    void main(){
                      vertexUV = uv;
                      vec3 newPosition = position;
                      float distanceFromCenter = abs(modelMatrix*vec4(position, 1.0)).x;
                      newPosition.y *= 1.0 + (curve/100.0)*pow(distanceFromCenter,2.0);
                      
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                    }
                  `,
                  fragmentShader: `
                    uniform sampler2D tex;
                    varying vec2 vertexUV;
                    void main(){
                      gl_FragColor = texture2D(tex, vertexUV);
                    }
                  `
                });

                var mesh = new THREE.Mesh( geometry, material );
                mesh.position.x = -1 * options[index].direction * (i - initialOffset) * getWidth(options[index].gap);
                planes[index][i] = mesh;
                scene[index].add( mesh );
              }
            );
          });

        }); // end selector forEach
      } // end init

      init();

      var currentWidth,
          previousWidth = window.innerWidth,
          mobileHeightChage = false;

      function onResize(){
        currentWidth = window.innerWidth;
        mobileHeightChage = currentWidth < 768 && currentWidth == previousWidth;
        init('resize');
        previousWidth = currentWidth;
      }

      window.addEventListener('resize', function(){
        onResize();
        setTimeout(onResize, 100);
      });

      var previousTime = 0;

      function animate(currentTime){
        var timePassed = currentTime - previousTime;

        Array.from(document.querySelectorAll(selector)).forEach(function(el, index){
          if (!scene[index]) return;
          if (Math.abs(scene[index].position.x) >= getWidth(options[index].gap) * slideAmount[index]){ time[index] = 0; }
          time[index] += options[index].direction * timePassed * 0.00001;
          scene[index].position.x = time[index] * options[index].speed;
          renderer[index].render(scene[index], camera[index]);
        });

        previousTime = currentTime;
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);

    }); // end DOMContentLoaded
  } // end attachCurvedSlider

  // If THREE is not loaded, load it dynamically, otherwise init immediately.
  if (typeof THREE === 'undefined') {
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js';
    s.onload = attachCurvedSlider;
    s.onerror = function(){ console.error('Failed to load Three.js for curved slider.'); };
    document.head.appendChild(s);
  } else {
    attachCurvedSlider();
  }

})();


