var addSwatch = document.getElementById('add-swatch');
var swatches = document.querySelector('.custom-swatches');
var colorIndicator = document.getElementById('color-indicator');
var userSwatches = document.getElementById('user-swatches');

var spectrumCanvas = document.getElementById('spectrum-canvas');
var spectrumCtx = spectrumCanvas.getContext('2d');
var spectrumCursor = document.getElementById('spectrum-cursor');
var spectrumRect = spectrumCanvas.getBoundingClientRect();

var hueCanvas = document.getElementById('hue-canvas');
var hueCtx = hueCanvas.getContext('2d');
var hueCursor = document.getElementById('hue-cursor');
var hueRect = hueCanvas.getBoundingClientRect();

var currentColor = '';
var hue = 0;
var saturation = 1;
var lightness = 0.5;

var rgbFields = document.getElementById('rgb-fields');
var hexField = document.getElementById('hex-field');

var red = document.getElementById('red');
var blue = document.getElementById('blue');
var green = document.getElementById('green');
var hex = document.getElementById('hex');

red.addEventListener('input', function () {
    var value = parseInt(this.value);
    if (isNaN(value) || value < 0) {
        this.value = 0;
    } else if (value > 255) {
        this.value = 255;
    }
    var color = tinycolor('rgb ' + red.value + ' ' + green.value + ' ' + blue.value);
    colorToPos(color);
});

green.addEventListener('input', function () {
    var value = parseInt(this.value);
    if (isNaN(value) || value < 0) {
        this.value = 0;
    } else if (value > 255) {
        this.value = 255;
    }
    var color = tinycolor('rgb ' + red.value + ' ' + green.value + ' ' + blue.value);
    colorToPos(color);
});

blue.addEventListener('input', function () {
    var value = parseInt(this.value);
    if (isNaN(value) || value < 0) {
        this.value = 0;
    } else if (value > 255) {
        this.value = 255;
    }
    var color = tinycolor('rgb ' + red.value + ' ' + green.value + ' ' + blue.value);
    colorToPos(color);
});


function ColorPicker() {
    createShadeSpectrum();
    createHueSpectrum();
}

function createSwatch(target, color) {
    var swatch = document.createElement('button');
    swatch.classList.add('swatch');
    swatch.setAttribute('title', color);
    swatch.style.backgroundColor = color;
    swatch.addEventListener('click', function () {
        var color = tinycolor(this.style.backgroundColor);
        colorToPos(color);
        setColorValues(color);
    });
    target.appendChild(swatch);
    refreshElementRects();
}

function refreshElementRects() {
    spectrumRect = spectrumCanvas.getBoundingClientRect();
    hueRect = hueCanvas.getBoundingClientRect();
}

function createShadeSpectrum(color) {
    canvas = spectrumCanvas;
    ctx = spectrumCtx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!color) color = '#f00';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var whiteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    whiteGradient.addColorStop(0, "#fff");
    whiteGradient.addColorStop(1, "transparent");
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var blackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    blackGradient.addColorStop(0, "transparent");
    blackGradient.addColorStop(1, "#000");
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', function (e) {
        startGetSpectrumColor(e);
    });
}

function createHueSpectrum() {
    var canvas = hueCanvas;
    var ctx = hueCtx;
    var hueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    hueGradient.addColorStop(0.00, "hsl(0, 100%, 50%)");
    hueGradient.addColorStop(0.17, "hsl(298.8, 100%, 50%)");
    hueGradient.addColorStop(0.33, "hsl(241.2, 100%, 50%)");
    hueGradient.addColorStop(0.50, "hsl(180, 100%, 50%)");
    hueGradient.addColorStop(0.67, "hsl(118.8, 100%, 50%)");
    hueGradient.addColorStop(0.83, "hsl(61.2, 100%, 50%)");
    hueGradient.addColorStop(1.00, "hsl(360, 100%, 50%)");
    ctx.fillStyle = hueGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.addEventListener('mousedown', function (e) {
        startGetHueColor(e);
    });
}

function colorToHue(color) {
    var color = tinycolor(color);
    var hueString = tinycolor('hsl ' + color.toHsl().h + ' 1 .5').toHslString();
    return hueString;
}

function colorToPos(color) {
    var color = tinycolor(color);
    var hsl = color.toHsl();
    hue = hsl.h;
    var hsv = color.toHsv();
    var x = spectrumRect.width * hsv.s;
    var y = spectrumRect.height * (1 - hsv.v);
    var hueY = hueRect.height - ((hue / 360) * hueRect.height);
    updateSpectrumCursor(x, y);
    updateHueCursor(hueY);
    setCurrentColor(color);
    createShadeSpectrum(colorToHue(color));
}

function setColorValues(color) {
    var color = tinycolor(color);
    var rgbValues = color.toRgb();
    var hexValue = color.toHex();

    red.value = rgbValues.r;
    green.value = rgbValues.g;
    blue.value = rgbValues.b;
    hex.value = hexValue;
}

function setCurrentColor(color) {
    color = tinycolor(color);
    currentColor = color;
    colorIndicator.style.backgroundColor = color;
    spectrumCursor.style.backgroundColor = color;
    hueCursor.style.backgroundColor = 'hsl(' + color.toHsl().h + ',100%, 50%)';
}

function updateHueCursor(y) {
    hueCursor.style.top = y + "px";
}

function updateSpectrumCursor(x, y) {
    spectrumCursor.style.left = x + 'px';
    spectrumCursor.style.top = y + 'px';
}

var startGetSpectrumColor = function (e) {
    getSpectrumColor(e);
    spectrumCursor.classList.add('dragging');
    window.addEventListener('mousemove', getSpectrumColor);
    window.addEventListener('mouseup', endGetSpectrumColor);
};

function getSpectrumColor(e) {
    e.preventDefault();

    var rect = spectrumCanvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    x = Math.max(0, Math.min(rect.width - 1, x));
    y = Math.max(0, Math.min(rect.height - 1, y));

    saturation = x / (rect.width - 1);
    lightness = 1 - y / (rect.height - 1);

    var color = tinycolor('hsl ' + hue + ' ' + saturation + ' ' + lightness);
    setCurrentColor(color);
    setColorValues(color);
    updateSpectrumCursor(x, y);
}



function endGetSpectrumColor(e) {
    spectrumCursor.classList.remove('dragging');
    window.removeEventListener('mousemove', getSpectrumColor);
}

var startGetHueColor = function (e) {
    getHueColor(e);
    hueCursor.classList.add('dragging');
    window.addEventListener('mousemove', getHueColor);
    window.addEventListener('mouseup', endGetHueColor);
};

function getHueColor(e) {
    e.preventDefault();

    var rect = hueCanvas.getBoundingClientRect();
    var y = e.clientY - rect.top;

    y = Math.max(0, Math.min(rect.height, y));

    var percent = y / rect.height;
    hue = 360 - (360 * percent);

    var hueColor = tinycolor('hsl ' + hue + ' 100% 50%').toHslString();
    var color = tinycolor('hsl ' + hue + ' ' + saturation + ' ' + lightness).toHslString();

    createShadeSpectrum(hueColor);
    updateHueCursor(y);
    setCurrentColor(color);
    setColorValues(color);
}

function endGetHueColor(e) {
    hueCursor.classList.remove('dragging');
    window.removeEventListener('mousemove', getHueColor);
}

red.addEventListener('input', function () {
    var color = tinycolor('rgb ' + red.value + ' ' + green.value + ' ' + blue.value);
    colorToPos(color);
});

green.addEventListener('input', function () {
    var color = tinycolor('rgb ' + red.value + ' ' + green.value + ' ' + blue.value);
    colorToPos(color);
});

blue.addEventListener('input', function () {
    var color = tinycolor('rgb ' + red.value + ' ' + green.value + ' ' + blue.value);
    colorToPos(color);
});

addSwatch.addEventListener('click', function () {
    createSwatch(userSwatches, currentColor);
});

window.addEventListener('resize', function () {
    refreshElementRects();
});

new ColorPicker();