let isHorrorEnabled = false;
let isHorrorMode = false;
let restartClickCount = 0;

function toggleMenu() {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('show');
}

function toggleSettings() {
    document.getElementById('settings-popup').classList.toggle('active');
}

function toggleHorrorSetting(enabled) {
    isHorrorEnabled = enabled;
    if (!enabled && isHorrorMode) resetToNormal();
    else if (enabled) triggerHorrorMode();
}

function updateClock() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    m = m < 10 ? '0' + m : m;
    document.getElementById('clock').innerText = `${h}:${m} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

function triggerHorrorMode() {
    isHorrorMode = true;
    document.body.classList.add('horro-mode');
}

function resetToNormal() {
    isHorrorMode = false;
    document.body.classList.remove('horro-mode');
    document.getElementById('black-door').style.display = 'none';
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
    if (restartClickCount >= 5) resetToNormal();
}
