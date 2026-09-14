// ===================================================
// 1. LIVE PREVIEW SYNC FUNCTION
// ===================================================
function syncInput(inputId, previewId, defaultValue) {
  const inputElem = document.getElementById(inputId);
  const previewElem = document.getElementById(previewId);

  if (inputElem && previewElem) {
    inputElem.addEventListener('input', () => {
      const value = inputElem.value.trim();
      previewElem.textContent = value !== '' ? value : defaultValue;
      localStorage.setItem(inputId, inputElem.value);
      updateQRCode();
    });
  }
}

// Bind inputs
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

if (photoInput) {
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
}

// ===================================================
// 3. COLOR PICKER
// ===================================================
const colorPicker = document.getElementById('color-picker');
if (colorPicker) {
  colorPicker.addEventListener('input', (e) => {
    const selectedColor = e.target.value;
    document.querySelectorAll('.theme-target').forEach(elem => {
      elem.style.color = selectedColor;
    });
    document.getElementById('resume-card').style.borderTopColor = selectedColor;
    localStorage.setItem('color-picker', selectedColor);
    updateQRCode();
  });
}

// ===================================================
// 4. SKILLS GENERATOR
// ===================================================
const skillInput = document.getElementById('skill-input');
const addSkillBtn = document.getElementById('add-skill-btn');
const skillsContainer = document.getElementById('preview-skills');

if (addSkillBtn) {
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
}

// ===================================================
// 5. DOWNLOAD PDF BUTTON
// ===================================================
document.getElementById('download-btn').addEventListener('click', () => {
  window.print();
});

// ===================================================
// 6. 100% SCAN-TESTED QR CODE GENERATOR
// ===================================================
const portfolioInput = document.getElementById('portfolio-url-input');
const qrcodeContainer = document.getElementById('qrcode');

let qrCodeObj = null;

function generateShareableUrl() {
  // Use input URL, or current GitHub Live page URL
  let baseUrl = portfolioInput.value.trim();
  if (!baseUrl || !baseUrl.startsWith('http')) {
    baseUrl = window.location.href.split('#')[0];
  }
  
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
    
    // Clear existing QR DOM element
    qrcodeContainer.innerHTML = '';
    
    // Create crisp & fast-reading QR Code
    qrCodeObj = new QRCode(qrcodeContainer, {
      text: fullUrl,
      width: 100,
      height: 100,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.L
    });
  }
}

portfolioInput.addEventListener('input', () => {
  updateQRCode();
  localStorage.setItem('portfolio-url-input', portfolioInput.value.trim());
});

// ===================================================
// 7. LOAD AND PARSE SCAN DATA
// ===================================================
window.addEventListener('load', () => {
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
      return; 
    } catch (err) {
      console.error("URL hash parse error", err);
    }
  }

  // Fallback Restore for Local Desktop Editing
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
