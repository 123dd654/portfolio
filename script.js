function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('time-text').textContent = timeString;
}

setInterval(updateTime, 1000);
updateTime();  // 초기 호출로 즉시 업데이트

const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const playPauseBtn = document.getElementById('playPause');
const repeatBtn = document.getElementById('repeat');
const audioElement = document.getElementById('audioElement');

let audioContext, analyser, source, dataArray, bufferLength;
let isPlaying = false;

canvas.width = 500;
canvas.height = 100;

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
}

function drawWaveform() {
    requestAnimationFrame(drawWaveform);

    if (audioContext) {
        analyser.getByteTimeDomainData(dataArray);
    } else {
        // 초기 상태에서는 평평한 선을 그립니다
        for (let i = 0; i < bufferLength; i++) {
            dataArray[i] = 128;
        }
    }

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(255, 255, 255)';
    ctx.beginPath();

    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
}

// 초기 상태에서 평평한 선을 그리기 위해 bufferLength와 dataArray를 초기화합니다
bufferLength = 1024;
dataArray = new Uint8Array(bufferLength).fill(128);

drawWaveform();

playPauseBtn.addEventListener('click', () => {
    if (!audioContext) {
        initAudio();
    }

    if (isPlaying) {
        audioElement.pause();
        playPauseBtn.textContent = '▶';
    } else {
        audioElement.play();
        playPauseBtn.textContent = '❚❚';
    }
    isPlaying = !isPlaying;
});

repeatBtn.addEventListener('click', () => {
    audioElement.currentTime = 0;
    if (!isPlaying) {
        audioElement.play();
        playPauseBtn.textContent = '❚❚';
        isPlaying = true;
    }
});

audioElement.addEventListener('ended', () => {
    isPlaying = false;
    playPauseBtn.textContent = '▶';
});

document.addEventListener('DOMContentLoaded', function() {
    const teamPro = document.querySelector('.teamPro');
    const soloPro = document.querySelector('.soloPro');

    function showClickImage(element) {
        const clickImage = element.querySelector('.click-image');
        clickImage.style.opacity = '1';
    }

    function hideClickImage(element) {
        const clickImage = element.querySelector('.click-image');
        clickImage.style.opacity = '0';
    }

    teamPro.addEventListener('mouseenter', () => showClickImage(teamPro));
    teamPro.addEventListener('mouseleave', () => hideClickImage(teamPro));

    soloPro.addEventListener('mouseenter', () => showClickImage(soloPro));
    soloPro.addEventListener('mouseleave', () => hideClickImage(soloPro));
});