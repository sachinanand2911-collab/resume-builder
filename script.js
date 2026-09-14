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
    updateQRCode(); // Dynamically update QR code when text changes
  });
}

// Bind single fields for live typing preview
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
// 6. ENCODED DYNAMIC QR CODE GENERATOR (REAL-TIME DATA SYNC)
// ===================================================
const portfolioInput = document.getElementById('portfolio-url-input');
const qrcodeContainer = document.getElementById('qrcode');

const qrCodeObj = new QRCode(qrcodeContainer, {
  text: window.location.href,
  width: 60,
  height: 60,
  colorDark: "#0f172a",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.M
});

function generateShareableUrl() {
  const baseUrl = portfolioInput.value.trim() || window.location.origin + window.location.pathname;
  
  const resumeData = {
    name: document.getElementById('preview-name').textContent,
    title: document.getElementById('preview-title').textContent,
    email: document.getElementById('preview-email').textContent,
    phone: document.getElementById('preview-phone').textContent,
    summary: document.getElementById('preview-summary').textContent,
    color: document.getElementById('color-picker').value,
    skills: Array.from(document.querySelectorAll('#preview-skills .skill-badge')).map(b => b.textContent)
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
// 7. LOAD SAVED DATA & SCAN DATA PARSER
// ===================================================
window.addEventListener('load', () => {
  // Mobile QR Scan Detection
  if (window.location.hash.includes('#data=')) {
    try {
      const encodedData = window.location.hash.split('#data=')[1];
      const jsonString = decodeURIComponent(atob(encodedData));
      const data = JSON.parse(jsonString);

      if (data.name) document.getElementById('preview-name').textContent = data.name;
      if (data.title) document.getElementById('preview-title').textContent = data.title;
      if (data.email) document.getElementById('preview-email').textContent = data.email;
      if (data.phone) document.getElementById('preview-phone').textContent = data.phone;
      if (data.summary) document.getElementById('preview-summary').textContent = data.summary;
      
      if (data.color) {
        document.querySelectorAll('.theme-target').forEach(e => e.style.color = data.color);
        document.getElementById('resume-card').style.borderTopColor = data.color;
      }

      if (data.skills && data.skills.length > 0) {
        skillsContainer.innerHTML = '';
        data.skills.forEach(skill => {
          const badge = document.createElement('span');
          badge.className = 'skill-badge';
          badge.textContent = skill;
          skillsContainer.appendChild(badge);
        });
      }
      return; 
    } catch (err) {
      console.error("Failed to parse URL data", err);
    }
  }

  // Restore LocalStorage Data for Live Editing
  const fields = ['name-input', 'title-input', 'email-input', 'phone-input', 'summary-input', 'portfolio-url-input'];
  fields.forEach(id => {
    const savedVal = localStorage.getItem(id);
    if (savedVal) {
      document.getElementById(id).value = savedVal;
      // Trigger sync manually for preview initialization
      const previewId = id.replace('-input', '').replace('name', 'preview-name').replace('title', 'preview-title').replace('email', 'preview-email').replace('phone', 'preview-phone').replace('summary', 'preview-summary');
      const previewElem = document.getElementById(previewId);
      if (previewElem) previewElem.textContent = savedVal;
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
