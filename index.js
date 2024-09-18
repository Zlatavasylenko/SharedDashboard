const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;
let isErasing = false;
let isDrawing = false; // Додаємо змінну для перевірки, чи активний режим малювання

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (e.target.id === 'eraser') {
        isErasing = !isErasing;
        canvas.classList.toggle('eraser-cursor', isErasing);
        canvas.classList.toggle('pen-cursor', !isErasing);
        isDrawing = false; // Деактивувати режим малювання, якщо активний режим стирання
    }

    if (e.target.id === 'pen') {
        isDrawing = !isDrawing; // Перемикання режиму малювання
        isErasing = false; // Вимикаємо режим стирання, якщо включено режим малювання
        ctx.strokeStyle = document.getElementById('stroke').value;
        canvas.classList.remove('eraser-cursor');
        canvas.classList.add('pen-cursor');
    }
});

toolbar.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
        if(isErasing) {
            isErasing = false;
            canvas.classList.remove('eraser-cursor');
        }
        if (isDrawing) {
            canvas.classList.add('pen-cursor');
        }
    }

    if(e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
});

const draw = (e) => {
    if(!isPainting) {
        return;
    }

    ctx.lineWidth = isErasing ? lineWidth * 2 : lineWidth; // Збільшуємо розмір для стирачки
    ctx.lineCap = 'round';
    ctx.strokeStyle = isErasing ? '#FFFFFF' : ctx.strokeStyle; // Білий колір для стирачки

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
}

canvas.addEventListener('mousedown', (e) => {
    if (isDrawing || isErasing) {
        isPainting = true;
    }
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

// Встановити початковий стан курсора
canvas.classList.add('pen-cursor');
