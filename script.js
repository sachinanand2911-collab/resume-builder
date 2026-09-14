// ===================================================
// 1. LIVE PREVIEW SYNC FUNCTION
// ===================================================
function syncInput(inputId, previewId, defaultValue) {
  const inputElem = document.getElementById(inputId);
  const previewElem = document.getElementById(previewId);

  inputElem.addEventListener('input', () => {
    const value = inputElem.value.trim();
    previewElem.textContent = value !== '' ? value : defaultValue;
    localStorage.setItem(inputId, inputElem.value);
    updateQRCode();
  });
}

// Bind input fields to preview elements
syncInput('name-input', 'preview-name', 'Rahul Sharma');
syncInput('title-input', 'preview-title', 'Frontend Developer');
syncInput('email-input', 'preview-email', 'rahul@example.com');
syncInput('phone-input', 'preview-phone', '+91 9876543210');
syncInput('summary-input', 'preview-summary', 'Passionate developer eager to build web applications using HTML, CSS, and JavaScript.');

// ===================================================
// 2. PROFILE PHOTO UPLOADER
// ===================================================
const photoInput = document.getElementById('photo-input');
const previewPhoto = document.getElementById('preview-photo');
const photoContainer = document.getElementById('photo-container');

photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      previewPhoto.src = event.target.result;
      previewPhoto.style.display = 'block';
      photoContainer.style.display = 'block';
      localStorage.setItem('saved-photo', event.target.result);
      updateQRCode();
    };
    reader.readAsDataURL(file);
  }
});

// ===================================================
// 3. COLOR PICKER FEATURE
// ===================================================
const colorPicker = document.getElementById('color-picker');
colorPicker.addEventListener('input', (e) => {
  const selectedColor = e.target.value;
  document.querySelectorAll('.theme-target').forEach(elem => {
    elem.style.color = selectedColor;
  });
  document.getElementById('resume-card').style.borderTopColor = selectedColor;
  localStorage.setItem('color-picker', selectedColor);
  updateQRCode();
});

// ===================================================
// 4. DYNAMIC SKILL TAG GENERATOR
// ===================================================
const skillInput = document.getElementById('skill-input');
const addSkillBtn = document.getElementById('add-skill-btn');
const skillsContainer = document.getElementById('preview-skills');

addSkillBtn.addEventListener('click', () => {
  const skillText = skillInput.value.trim();
  if (skillText === '') return;

  const badge = document.createElement('span');
  badge.className = 'skill-badge';
  badge.textContent = skillText;

  skillsContainer.appendChild(badge);
  skillInput.value = '';
  updateQRCode();
});

// ===================================================
// 5. DOWNLOAD PDF BUTTON
// ===================================================
document.getElementById('download-btn').addEventListener('click', () => {
  window.print();
});

// ===================================================
// 6. INSTANT SCAN QR GENERATOR (OPTIMIZED BASE64 DATA)
// ===================================================
const portfolioInput = document.getElementById('portfolio-url-input');
const qrcodeContainer = document.getElementById('qrcode');

const qrCodeObj = new QRCode(qrcodeContainer, {
  text: window.location.href,
  width: 90,
  height: 90,
  colorDark: "#0f172a",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.L // Low correction = Less complex QR = Fast scan!
});

function generateShareableUrl() {
  const customUrl = portfolioInput.value.trim();
  const baseUrl = customUrl || (window.location.origin + window.location.pathname);
  
  // Clean & Compact keys to keep Base64 payload small
  const resumeData = {
    n: document.getElementById('preview-name').textContent,
    t: document.getElementById('preview-title').textContent,
    e: document.getElementById('preview-email').textContent,
    p: document.getElementById('preview-phone').textContent,
    s: document.getElementById('preview-summary').textContent,
    c: document.getElementById('color-picker').value,
    k: Array.from(document.querySelectorAll('#preview-skills .skill-badge')).map(b => b.textContent)
  };

  const jsonString = JSON.stringify(resumeData);
  const encodedData = btoa(encodeURIComponent(jsonString));
  
  return `${baseUrl}#data=${encodedData}`;
}

function updateQRCode() {
  if (typeof QRCode !== 'undefined' && qrcodeContainer) {
    const fullUrl = generateShareableUrl();
    qrCodeObj.clear();
    qrCodeObj.makeCode(fullUrl);
  }
}

portfolioInput.addEventListener('input', () => {
  updateQRCode();
  localStorage.setItem('portfolio-url-input', portfolioInput.value.trim());
});

// ===================================================
// 7. LOAD SAVED DATA (SCAN PARSER + LOCAL STORAGE)
// ===================================================
window.addEventListener('load', () => {
  // Check if opened via Mobile QR Scan
  if (window.location.hash.includes('#data=')) {
    try {
      const encodedData = window.location.hash.split('#data=')[1];
      const jsonString = decodeURIComponent(atob(encodedData));
      const data = JSON.parse(jsonString);

      if (data.n) document.getElementById('preview-name').textContent = data.n;
      if (data.t) document.getElementById('preview-title').textContent = data.t;
      if (data.e) document.getElementById('preview-email').textContent = data.e;
      if (data.p) document.getElementById('preview-phone').textContent = data.p;
      if (data.s) document.getElementById('preview-summary').textContent = data.s;
      
      if (data.c) {
        document.querySelectorAll('.theme-target').forEach(e => e.style.color = data.c);
        document.getElementById('resume-card').style.borderTopColor = data.c;
      }

      if (data.k && data.k.length > 0) {
        skillsContainer.innerHTML = '';
        data.k.forEach(skill => {
          const badge = document.createElement('span');
          badge.className = 'skill-badge';
          badge.textContent = skill;
          skillsContainer.appendChild(badge);
        });
      }
      return; // Mobile scan me LocalStorage ignore hoga
    } catch (err) {
      console.error("Failed to parse URL data", err);
    }
  }

  // LocalStorage Fallback for Desktop Editing
  const fieldMap = [
    { input: 'name-input', preview: 'preview-name' },
    { input: 'title-input', preview: 'preview-title' },
    { input: 'email-input', preview: 'preview-email' },
    { input: 'phone-input', preview: 'preview-phone' },
    { input: 'summary-input', preview: 'preview-summary' },
    { input: 'portfolio-url-input', preview: null }
  ];

  fieldMap.forEach(item => {
    const savedVal = localStorage.getItem(item.input);
    if (savedVal) {
      document.getElementById(item.input).value = savedVal;
      if (item.preview) {
        document.getElementById(item.preview).textContent = savedVal;
      }
    }
  });

  const savedColor = localStorage.getItem('color-picker');
  if (savedColor) {
    colorPicker.value = savedColor;
    document.querySelectorAll('.theme-target').forEach(e => e.style.color = savedColor);
    document.getElementById('resume-card').style.borderTopColor = savedColor;
  }

  const savedPhoto = localStorage.getItem('saved-photo');
  if (savedPhoto) {
    previewPhoto.src = savedPhoto;
    previewPhoto.style.display = 'block';
    photoContainer.style.display = 'block';
  }

  updateQRCode();
});
