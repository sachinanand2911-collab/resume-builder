// ===================================================
// 6. ENCODED DYNAMIC QR CODE GENERATOR (FOR MOBILE DATA SYNC)
// ===================================================
const portfolioInput = document.getElementById('portfolio-url-input');
const qrcodeContainer = document.getElementById('qrcode');

// QR Code Instance
const qrCodeObj = new QRCode(qrcodeContainer, {
  text: window.location.href,
  width: 60,
  height: 60,
  colorDark: "#0f172a",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.M
});

// Function to generate Shareable URL with User Data
function generateShareableUrl() {
  const baseUrl = portfolioInput.value.trim() || window.location.origin + window.location.pathname;
  
  const resumeData = {
    name: document.getElementById('name-input').value.trim(),
    title: document.getElementById('title-input').value.trim(),
    email: document.getElementById('email-input').value.trim(),
    phone: document.getElementById('phone-input').value.trim(),
    summary: document.getElementById('summary-input').value.trim(),
    color: document.getElementById('color-picker').value,
    skills: Array.from(document.querySelectorAll('#preview-skills .skill-badge')).map(b => b.textContent)
  };

  // Convert object to Base64 Hash string
  const jsonString = JSON.stringify(resumeData);
  const encodedData = btoa(encodeURIComponent(jsonString));
  
  return `${baseUrl}#data=${encodedData}`;
}

// Update QR Code whenever inputs change
function updateQRCode() {
  const fullUrl = generateShareableUrl();
  qrCodeObj.clear();
  qrCodeObj.makeCode(fullUrl);
}

// Add event listeners to input fields to update QR dynamically
['name-input', 'title-input', 'email-input', 'phone-input', 'summary-input', 'portfolio-url-input', 'color-picker'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateQRCode);
});

// ===================================================
// 7. LOAD SAVED DATA (localStorage + URL Hash Data)
// ===================================================
window.addEventListener('load', () => {
  // Check if opened via QR Scan (URL contains #data=...)
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
        const skillsContainer = document.getElementById('preview-skills');
        skillsContainer.innerHTML = '';
        data.skills.forEach(skill => {
          const badge = document.createElement('span');
          badge.className = 'skill-badge';
          badge.textContent = skill;
          skillsContainer.appendChild(badge);
        });
      }
      return; // Stop local storage fallback if URL data exists
    } catch (err) {
      console.error("Failed to parse URL data", err);
    }
  }

  // LocalStorage Fallback for laptop browser editing
  const fields = ['name-input', 'title-input', 'email-input', 'phone-input', 'summary-input', 'portfolio-url-input'];
  fields.forEach(id => {
    const savedVal = localStorage.getItem(id);
    if (savedVal) {
      document.getElementById(id).value = savedVal;
      document.getElementById(id).dispatchEvent(new Event('input'));
    }
  });

  const savedColor = localStorage.getItem('color-picker');
  if (savedColor) {
    colorPicker.value = savedColor;
    colorPicker.dispatchEvent(new Event('input'));
  }

  const savedPhoto = localStorage.getItem('saved-photo');
  if (savedPhoto) {
    previewPhoto.src = savedPhoto;
    previewPhoto.style.display = 'block';
    photoContainer.style.display = 'block';
  }

  updateQRCode();
});
