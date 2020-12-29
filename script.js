// Переменные для канвас
let 
    canvas            = document.getElementById('cnv'),
    ctx               = canvas.getContext('2d'),
    activeBtnPanel    = document.querySelector('.active-btn'),
    generalColor      = document.querySelector('.general-color-btn'),
    generalSize       = document.querySelector('.general-size-btn'),
    lineRadioBtn      = document.querySelector('.line-radio-item'), 
    circleRadioBtn    = document.querySelector('.circle-radio-item'), 
    dotRadioBtn       = document.querySelector('.dot-radio-item'), 
    gradientRadioBtn  = document.querySelector('.gradient');
    fillCanvas        = document.querySelector('.fill'),
    clearing          = document.querySelector('.clearing'),  
    eraser            = document.querySelector('.eraser'),   
    ifMouseDown       = false, 
    lastDotPosition   = null,
    fistDotPosition   = null,
    lineDuration      = null,
    createGradient    = null;
    btnPanelIterator  = 0;

    generalSize.value = 1;
    canvas.width      = innerWidth;
    canvas.height     = innerHeight;
    fillCanvas.value  = '#FFFFFF';

const    
    hexCode           = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];    

canvas.addEventListener('resize', () =>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});
    
activeBtnPanel.addEventListener('click', function(){
        this.classList.remove('active-btn');
        this.classList.add('off-btn');
        document.querySelector('#mp').classList.remove('main-panel');
        document.querySelector('#mp').classList.add('main-panel-off');
        btnPanelIterator++
        if(btnPanelIterator == 2){
            this.classList.remove('off-btn');
            this.classList.add('active-btn');
            document.querySelector('#mp').classList.remove('main-panel-off');
            document.querySelector('#mp').classList.add('main-panel');
            btnPanelIterator = 0;
        }
});

canvas.addEventListener('mousedown', () =>{
    ifMouseDown = true;
});

canvas.addEventListener('mouseup', () =>{
    ifMouseDown = false;
    ctx.beginPath();
});

clearing.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

lineRadioBtn.addEventListener('click', function(){ 
    canvas.removeEventListener('click', drawCircle);
    canvas.removeEventListener('mousemove', useEraser);
    canvas.removeEventListener('click', drawStraightLine);
    canvas.removeEventListener('mousemove', drag);
    canvas.removeEventListener('mousemove', drawGradient);
    canvas.addEventListener('mousemove', drawLine);
    canvas.style.cursor = 'crosshair';
    this.classList.add('active');
    circleRadioBtn.classList.remove('active');
    dotRadioBtn.classList.remove('active');
    eraser.classList.remove('active');
    gradientRadioBtn.classList.remove('active');
});
circleRadioBtn.addEventListener('click', function(){ 
    canvas.removeEventListener('mousemove', drawLine);
    canvas.removeEventListener('mousemove', useEraser);
    canvas.removeEventListener('click', drawStraightLine);
    canvas.removeEventListener('mousemove', drag);
    canvas.removeEventListener('mousemove', drawGradient);
    canvas.addEventListener('click', drawCircle);
    canvas.style.cursor = 'move';
    this.classList.add('active');
    lineRadioBtn.classList.remove('active');
    dotRadioBtn.classList.remove('active');
    eraser.classList.remove('active');
    gradientRadioBtn.classList.remove('active');
});
dotRadioBtn.addEventListener('click', function(){
    canvas.removeEventListener('mousemove', drawLine);
    canvas.removeEventListener('click', drawCircle);
    canvas.removeEventListener('mousemove', useEraser);
    canvas.removeEventListener('mousemove', drawGradient);
    canvas.addEventListener('mousedown', beginDrag);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', finishDrag);
    canvas.style.cursor = 'copy';
    this.classList.add('active');
    lineRadioBtn.classList.remove('active');
    circleRadioBtn.classList.remove('active');
    eraser.classList.remove('active');
    gradientRadioBtn.classList.remove('active');
});
eraser.addEventListener('click', function(){
    canvas.removeEventListener('mousemove', drawLine);
    canvas.removeEventListener('click', drawCircle);
    canvas.removeEventListener('click', drawStraightLine);
    canvas.removeEventListener('mousemove', drag);
    canvas.removeEventListener('mousemove', drawGradient);
    canvas.addEventListener('mousemove', useEraser);
    canvas.style.cursor = 'cell';
    this.classList.add('active');
    lineRadioBtn.classList.remove('active');
    circleRadioBtn.classList.remove('active');
    dotRadioBtn.classList.remove('active');
    gradientRadioBtn.classList.remove('active');
});
gradientRadioBtn.addEventListener('click', function(){
    canvas.removeEventListener('mousemove', drawLine);
    canvas.removeEventListener('click', drawCircle);
    canvas.removeEventListener('mousemove', useEraser);
    canvas.removeEventListener('click', drawStraightLine);
    canvas.removeEventListener('mousemove', drag);
    canvas.addEventListener('mousemove', drawGradient);
    canvas.style.cursor = 'sw-resize';
    this.classList.add('active');
    lineRadioBtn.classList.remove('active');
    circleRadioBtn.classList.remove('active');
    dotRadioBtn.classList.remove('active');
    eraser.classList.remove('active');
})

canvas.addEventListener('mousemove', drawLine);

fillCanvas.addEventListener('input', () =>{
    canvas.style.backgroundColor = fillCanvas.value;
});

generalSize.addEventListener('input', function(){
    if(this.value > 100 || this.value < 1){
        alert('Недопустимое значение');
        this.value = 1;
    }
});

function drawLine(e){
    if(lineRadioBtn.classList.contains('active')){
        if(ifMouseDown){
            ctx.fillStyle = generalColor.value;
            ctx.strokeStyle = generalColor.value;
            ctx.lineWidth = generalSize.value * 2;
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(e.clientX, e.clientY, generalSize.value, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
        }   
    
    } 

}

function drawCircle(e){
    if(circleRadioBtn.classList.contains('active')){
        ctx.fillStyle = generalColor.value;
        ctx.beginPath();
        ctx.arc(e.clientX, e.clientY, generalSize.value, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
    }
}

function drawStraightLine(lastPosition){
    if(dotRadioBtn.classList.contains('active')){ 
        ctx.lineCap = 'round';   
        ctx.fillStyle = generalColor.value;
        ctx.strokeStyle = generalColor.value;
        ctx.lineWidth = generalSize.value;
        ctx.beginPath();
        ctx.moveTo(fistDotPosition.x, fistDotPosition.y);
        ctx.lineTo(lastPosition.x, lastPosition.y);
        ctx.stroke();
        ctx.beginPath();
    }    
}

function getCanvasCords(e){
    let
        x = e.clientX - canvas.getBoundingClientRect().left,
        y = e.clientY - canvas.getBoundingClientRect().top;
    return {x: x, y: y};
}

function beginDrag(e){
    fistDotPosition = getCanvasCords(e);
    copyLineDuration();
}

function drag(e){
    if(ifMouseDown){
        pasteLineDuration();
        lastDotPosition = getCanvasCords(e);
        drawStraightLine(lastDotPosition);
    }
}

function finishDrag(e){
    let lastDotPosition = getCanvasCords(e);
    drawStraightLine(lastDotPosition);
}

function copyLineDuration(){
    lineDuration = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function pasteLineDuration(){
    ctx.putImageData(lineDuration, 0, 0)
}

function useEraser(e){
    if(eraser.classList.contains('active')){
        if(ifMouseDown){
            ctx.fillStyle = fillCanvas.value;
            ctx.strokeStyle = fillCanvas.value;
            ctx.lineWidth = 5 * 2;
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(e.clientX, e.clientY, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
        }
    }
}

function createRandomColor(hex){
    for ( let i = 0; i < 6; i++ ) { 
        let generationColor = hexCode[Math.round( Math.random() * (hexCode.length - 1) )];
        hex += generationColor;
      }
    return hex;
}

function drawGradient(e){
    if(gradientRadioBtn.classList.contains('active')){
        if(ifMouseDown){
            createGradient = ctx.createLinearGradient(e.clientX, e.clientY, e.clientX + 35, e.clientY + 35);
            createGradient.addColorStop(Math.round( Math.random()), createRandomColor('#'));
            createGradient.addColorStop(Math.round( Math.random()), createRandomColor('#'));
            ctx.fillStyle = createGradient;
            ctx.strokeStyle = createGradient;
            ctx.lineWidth = generalSize.value * 2;
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(e.clientX, e.clientY, generalSize.value, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
        }   
    } 
}

