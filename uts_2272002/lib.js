const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let curtainHeight = canvas.height * 0.5; // Mulai dari setengah layar
let isDragging = false;
let startY = 0;

function drawPolygon(ctx, points, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
}

function drawCurtain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background brightness layer
    const brightness = 1 - curtainHeight / canvas.height; // Semakin rendah curtainHeight, semakin gelap
    ctx.fillStyle = `rgba(0, 0, 0, ${brightness})`; // Gunakan hitam untuk menggelapkan layar
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the curtain
    const curtainColor = '#333';
    const segments = 10;
    const segmentHeight = curtainHeight / segments;

    for (let i = 0; i < segments; i++) {
        let top = i * segmentHeight;
        let bottom = (i + 1) * segmentHeight;
        
        // Polygon points for the curtain segment
        const points = [
            { x: 0, y: top },
            { x: canvas.width, y: top },
            { x: canvas.width, y: bottom },
            { x: 0, y: bottom },
        ];
        drawPolygon(ctx, points, curtainColor);
    }

    requestAnimationFrame(drawCurtain);
}

// Event untuk mengontrol ketinggian tirai
canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    startY = e.clientY;
});

canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const diff = e.clientY - startY;
        curtainHeight = Math.min(canvas.height, Math.max(0, curtainHeight + diff));
        startY = e.clientY;
    }
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});

drawCurtain();
