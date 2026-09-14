// 1. LIVE SYNC FUNCTION
function syncInput(inputId, previewId, defaultValue) {
  const inputElem = document.getElementById(inputId);
  const previewElem = document.getElementById(previewId);

  inputElem.addEventListener('input', () => {
    const value = inputElem.value.trim();
    previewElem.textContent = value !== '' ? value : defaultValue;
    
    // Auto Save to localStorage
    localStorage.setItem(inputId, inputElem.value);
  });
}

// Bind single fields
syncInput('name-input', 'preview-name', 'Rahul Sharma');
syncInput('title-input', 'preview-title', 'Frontend Developer');
syncInput('email-input', 'preview-email', 'rahul@example.com');
syncInput('phone-input', 'preview-phone', '+91 9876543210');
syncInput('summary-input', 'preview-summary', 'Passionate developer eager to build web applications using HTML, CSS, and JavaScript.');

// 2. PROFILE PHOTO UPLOADER
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
    };
    reader.readAsDataURL(file);
  }
});

// 3. COLOR PICKER FEATURE
const colorPicker = document.getElementById('color-picker');
colorPicker.addEventListener('input', (e) => {
  const selectedColor = e.target.value;
  document.querySelectorAll('.theme-target').forEach(elem => {
    elem.style.color = selectedColor;
  });
  document.getElementById('resume-card').style.borderTopColor = selectedColor;
  localStorage.setItem('color-picker', selectedColor);
});

// 4. DYNAMIC SKILL TAG GENERATOR
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
});

// 5. DOWNLOAD PDF BUTTON
document.getElementById('download-btn').addEventListener('click', () => {
  window.print();
});

// 6. DYNAMIC PHONE RESUME DOWNLOAD QR CODE GENERATOR
const portfolioInput = document.getElementById('portfolio-url-input');
const qrcodeContainer = document.getElementById('qrcode');

const qrCodeObj = new QRCode(qrcodeContainer, {
  text: window.location.href, // Defaults to current document URL
  width: 60,
  height: 60,
  colorDark: "#0f172a",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H
});

portfolioInput.addEventListener('input', () => {
  const url = portfolioInput.value.trim();
  const downloadUrl = url !== '' ? url : window.location.href;
  
  qrCodeObj.clear();
  qrCodeObj.makeCode(downloadUrl);
  localStorage.setItem('portfolio-url-input', url);
});

// 7. LOAD SAVED DATA ON PAGE RELOAD
window.addEventListener('load', () => {
  const fields = ['name-input', 'title-input', 'email-input', 'phone-input', 'summary-input', 'portfolio-url-input'];
  
  fields.forEach(id => {
    const savedVal = localStorage.getItem(id);
    if (savedVal) {
      document.getElementById(id).value = savedVal;
      document.getElementById(id).dispatchEvent(new Event('input'));
    }
  });

  // Restore Color Accent
  const savedColor = localStorage.getItem('color-picker');
  if (savedColor) {
    colorPicker.value = savedColor;
    colorPicker.dispatchEvent(new Event('input'));
  }

  // Restore Profile Photo
  const savedPhoto = localStorage.getItem('saved-photo');
  if (savedPhoto) {
    previewPhoto.src = savedPhoto;
    previewPhoto.style.display = 'block';
    photoContainer.style.display = 'block';
  }
});