let isHorrorEnabled = false;
let isHorrorMode = false;
let restartClickCount = 0;

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
    if (enabled) {
        triggerHorrorMode();
    } else {
        resetToNormal();
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

// ⚡ 빠른 속도로 수치 감소 (공포모드가 켜져있으면 0까지 다 닳고, 아니면 조금 남기고 멈춤)
setInterval(() => {
    if (document.getElementById('satiety-fill')) {
        let minLimit = isHorrorEnabled ? 0 : 15; // 평소엔 15까지만 줄고 멈춤, 공포모드에선 0까지 다 닳음
        
        petStats.satiety = Math.max(minLimit, petStats.satiety - 5);
        petStats.cleanliness = Math.max(minLimit, petStats.cleanliness - 5);
        petStats.energy = Math.max(minLimit, petStats.energy - 5);
        updatePetUI();

        // 수치가 완전히 다 닳았을 때 공포모드 발동
        if (petStats.satiety === 0 && petStats.cleanliness === 0 && petStats.energy === 0) {
            if (!isHorrorMode) {
                triggerHorrorMode();
            }
        }
    }
}, 1000); // 1초마다 빠르게 감소

function updatePetUI() {
    const sFill = document.getElementById('satiety-fill');
    const cFill = document.getElementById('cleanliness-fill');
    const eFill = document.getElementById('energy-fill');
    const dialog = document.getElementById('pet-dialog');
    const dolphin = document.getElementById('dolphin-char');

    if (sFill) sFill.style.width = petStats.satiety + '%';
    if (cFill) cFill.style.width = petStats.cleanliness + '%';
    if (eFill) eFill.style.width = petStats.energy + '%';

    if (petStats.satiety <= 20) {
        if (dialog) dialog.innerText = "......";
        if (dolphin) dolphin.style.filter = "grayscale(100%)";
    }
}

function feedPet() {
    petStats.satiety = Math.min(100, petStats.satiety + 30);
    updatePetUI();
}
function cleanPet() {
    petStats.cleanliness = Math.min(100, petStats.cleanliness + 30);
    updatePetUI();
}
function sleepPet() {
    petStats.energy = Math.min(100, petStats.energy + 30);
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
    document.getElementById('bsod-screen').style.display = 'none';
    
    // 에러창이 남아있다면 제거
    const errPop = document.getElementById('error-popup');
    if (errPop) errPop.remove();

    petStats.satiety = 70;
    petStats.cleanliness = 70;
    petStats.energy = 70;
    updatePetUI();
}

// 돌고래 창(Play Lab 박스)을 닫을 때
function closeWindow(btn) {
    const box = btn.closest('.win-box');
    if (box) {
        box.style.display = 'none';
        // 만약 공포모드 상태(수치 다 닳음)에서 돌고래 창을 닫았다면 검은 문 등장
        if (isHorrorMode) {
            document.getElementById('black-door').style.display = 'flex';
        }
    }
}

// 검은 문을 눌렀을 때의 연출 시퀀스 (블루스크린 0.1초 -> 에러창 0.2초 -> 블루스크린 -> 정상 복구)
function triggerBSODSequence() {
    const bsod = document.getElementById('bsod-screen');
    const blackDoor = document.getElementById('black-door');
    blackDoor.style.display = 'none';

    // 1. 첫 번째 블루스크린 (0.1초)
    bsod.style.display = 'flex';

    setTimeout(() => {
        bsod.style.display = 'none';
        
        // 2. 에러 창 생성 (0.2초)
        showErrorPopup(() => {
            // 3. 다시 블루스크린 (잠시 유지 후 정상 복구)
            bsod.style.display = 'flex';
            setTimeout(() => {
                resetToNormal();
            }, 800);
        });

    }, 100); // 0.1초
}

function showErrorPopup(callback) {
    const pop = document.createElement('div');
    pop.id = 'error-popup';
    pop.innerHTML = `
        <div style="background:#c0c0c0; border:2px solid; border-color:#fff #000 #000 #fff; width:300px; padding:2px; font-family:monospace; box-shadow:5px 5px 10px rgba(0,0,0,0.5);">
            <div style="background:#000080; color:white; padding:3px; font-weight:bold; display:flex; justify-content:space-between;">
                <span>System Error</span><span>[X]</span>
            </div>
            <div style="padding:20px; color:black; text-align:center; font-weight:bold;">
                ⚠️ Fatal Exception 0xE: 0x0028<br>System memory corrupted.
            </div>
        </div>
    `;
    pop.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); z-index:99999;";
    document.body.appendChild(pop);

    setTimeout(() => {
        pop.remove();
        if (callback) callback();
    }, 200); // 0.2초
}

function handleStartClick() {
    if (!isHorrorMode) return;
    restartClickCount++;
    if (restartClickCount >= 5) {
        resetToNormal();
        restartClickCount = 0;
    }
}
