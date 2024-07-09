//달력
function generateCalendar(year, month) {
    const calendar = document.getElementById('calendar');
    if (!calendar) {
        console.error('Calendar element not found');
        return;
    }
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let table = '<table>';
    table += `<tr><th colspan="7">${monthNames[month]} ${year}</th></tr>`;
    table += '<tr>' + dayNames.map(day => `<th>${day}</th>`).join('') + '</tr><tr>';

    for (let i = 0; i < firstDay; i++) {
        table += '<td></td>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
            table += '</tr><tr>';
        }
        table += `<td>${day}</td>`;
    }

    table += '</tr></table>';
    calendar.innerHTML = table;
}

//네번째 뮤직플레이어
document.addEventListener('DOMContentLoaded', function() {
    generateCalendar(2024, 7); // August 2024 (month is 0-indexed)

    const $ = document.querySelector.bind(document);
    const stage = $('.stage');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 300;
    canvas.height = 300;
    stage.appendChild(canvas);

    const audioFiles = [
        './music/dannyminus - Give It to Me.mp3',
        './music/CustomMelody - Joy Dealer.mp3',
        './music/Carmel Quartet - Eine Kleine Nachtmusik.mp3',
        './music/Randy Sharp - Chique N Teriyaki.mp3',
        './music/Steven Beddall - Escape Velocity.mp3'
        // 추가 오디오 파일 경로
    ];
    
    let currentAudioIndex = 0;
    const audioElement = new Audio(audioFiles[currentAudioIndex]);

    audioElement.addEventListener('ended', () => {
        currentAudioIndex = (currentAudioIndex + 1) % audioFiles.length;
        audioElement.src = audioFiles[currentAudioIndex];
        audioElement.play();
    });

    audioElement.addEventListener('error', (e) => {
        console.error("Audio error: ", e);
    });

    const visualizer = {
        bar: { width: 1, height: 40, color: 'white' },
        radius: 60
    };
    const pieces = 400;
    let audio = Array(pieces).fill(null).map(() => Math.random());

    const update = () => {
        audio = audio.map(x => Math.random() > 0.5 ? Math.max(x - 0.01, 0.02) : Math.min(x + 0.01, 1));
    };

    const render = () => {
        const spacing = 360 / audio.length;
        const origin = { x: canvas.width / 2 - visualizer.bar.width / 2, y: canvas.height / 2 - visualizer.bar.height };
        
        context.fillStyle = '#fff';
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const [i, piece] of audio.entries()) {
            const degrees = i * spacing;
            const radians = degrees / 180 * Math.PI;

            context.save();
            context.translate(origin.x, origin.y);
            context.rotate(radians);
            context.fillRect(visualizer.bar.width / -2, visualizer.radius, visualizer.bar.width, visualizer.bar.height * piece);
            context.restore();
        }

        update();
        requestAnimationFrame(render);
    };

    render();

    // Controls
    $('#play').addEventListener('click', () => audioElement.play());
    $('#pause').addEventListener('click', () => audioElement.pause());
    $('#restart').addEventListener('click', () => {
        audioElement.currentTime = 0;
        audioElement.play();
    });
    $('#volume').addEventListener('input', (event) => {
        audioElement.volume = event.target.value;
    });
});


