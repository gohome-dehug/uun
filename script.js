let isHorrorEnabled = false;
let isHorrorMode = false;
let restartClickCount = 0;

// 돌고래 키우기 수치 관리 (Play Lab 용)
let petStats = {
    satiety: 70,
    cleanliness: 70,
    energy: 70
};

function toggleMenu() {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('show');
}

function toggleSettings() {
    document.getElementById('settings-popup').classList.toggle('active');
}

function toggleHorrorSetting(enabled) {
    isHorrorEnabled = enabled;
    if (!enabled && isHorrorMode) {
        resetToNormal();
    } else if (enabled) {
        triggerHorrorMode();
    }
}

function updateClock() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    m = m < 10 ? '0' + m : m;
    const clockEl = document.getElementById('clock');
    if (clockEl) clockEl.innerText = `${h}:${m} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

// 돌고래 수치 감소 및 공포모드 연동 타이머
setInterval(() => {
    // 플레이랩 페이지에 있을 때 수치 자연 감소
    if (document.getElementById('satiety-fill')) {
        petStats.satiety = Math.max(0, petStats.satiety - 2);
        petStats.cleanliness = Math.max(0, petStats.cleanliness - 2);
        petStats.energy = Math.max(0, petStats.energy - 2);
        updatePetUI();
    }

    // 모든 수치가 0이 되었고, 공포모드 설정이 켜져있거나 방치되었을 때 공포모드 발동
    if ((petStats.satiety === 0 && petStats.cleanliness === 0 && petStats.energy === 0) || isHorrorEnabled) {
        if (!isHorrorMode && isHorrorEnabled) {
            triggerHorrorMode();
        }
    }
}, 3000);

function updatePetUI() {
    const sFill = document.getElementById('satiety-fill');
    const cFill = document.getElementById('cleanliness-fill');
    const eFill = document.getElementById('energy-fill');
    const dialog = document.getElementById('pet-dialog');
    const dolphin = document.getElementById('dolphin-char');

    if (sFill) sFill.style.width = petStats.satiety + '%';
    if (cFill) cFill.style.width = petStats.cleanliness + '%';
    if (eFill) eFill.style.width = petStats.energy + '%';

    if (petStats.satiety <= 20 || petStats.cleanliness <= 20) {
        if (dialog) dialog.innerText = "...배고파... 괴로워...";
        if (dolphin) dolphin.style.filter = "grayscale(80%)";
    }
}

function feedPet() {
    petStats.satiety = Math.min(100, petStats.satiety + 25);
    updatePetUI();
}
function cleanPet() {
    petStats.cleanliness = Math.min(100, petStats.cleanliness + 25);
    updatePetUI();
}
function sleepPet() {
    petStats.energy = Math.min(100, petStats.energy + 25);
    updatePetUI();
}

function triggerHorrorMode() {
    isHorrorMode = true;
    document.body.classList.add('horro-mode');
}

function resetToNormal() {
    isHorrorMode = false;
    isHorrorEnabled = false;
    const checkbox = document.getElementById('toggle-horror');
    if (checkbox) checkbox.checked = false;

    document.body.classList.remove('horro-mode');
    document.getElementById('black-door').style.display = 'none';
    
    // 수치 복구
    petStats.satiety = 70;
    petStats.cleanliness = 70;
    petStats.energy = 70;
    updatePetUI();
}

function closeWindow(btn) {
    const box = btn.closest('.win-box');
    if (box) box.style.display = 'none';
}

function triggerBSOD() {
    document.getElementById('bsod-screen').style.display = 'flex';
}

function resetFromBSOD() {
    document.getElementById('bsod-screen').style.display = 'none';
    resetToNormal();
}

function handleStartClick() {
    if (!isHorrorMode) return;
    restartClickCount++;
    if (restartClickCount >= 5) {
        resetToNormal();
        restartClickCount = 0;
    }
}
