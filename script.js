// ============================================
// GLOBAL STATE & CONFIG
// ============================================
let allData = [];
let currentUser = null;
let currentStep = 1;
let currentLocation = { lat: null, lng: null };

// ============================================
// NAVIGATION & UI TOGGLES
// ============================================
function navigateTo(page) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(page-${page});
    if (target) target.classList.remove('hidden');
    window.scrollTo(0, 0);
    if (page === 'dashboard') updateDashboard();
    if (page === 'feed') renderFeed();
}

function handleLocationToggle(toggle) {
    const statusDiv = document.getElementById('location-status');
    if (toggle.checked) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                currentLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                statusDiv.innerHTML = '✅ Location sharing enabled';
            }, () => {
                toggle.checked = false;
                statusDiv.innerHTML = '❌ Location access denied';
            });
        }
    } else {
        statusDiv.innerHTML = '📍 Location sharing disabled';
    }
}

// ============================================
// RECOVERY LOGIC (56 Days)
// ============================================
async function completeDonation(donorId) {
    const donor = allData.find(d => d.__backendId === donorId);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 56); // Add 56 days

    const updatedDonor = {
        ...donor,
        isInRecovery: true,
        recoveryEndDate: endDate.toISOString(),
        lastDonationDate: new Date().toISOString()
    };

    const result = await window.dataSdk.update(updatedDonor);
    if (result.isOk) {
        showSuccessModal('Donation Verified!', 'Donor is now in 56-day recovery.');
        updateDashboard();
    }
}

// ============================================
// INITIALIZATION
// ============================================
window.onload = () => {
    // Check local session
    const savedEmail = localStorage.getItem('currentUserEmail');
    // Initialize Data SDK logic...
};