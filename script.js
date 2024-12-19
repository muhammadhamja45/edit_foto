    const upload = document.getElementById('upload');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const brightness = document.getElementById('brightness');
    const contrast = document.getElementById('contrast');
    const saturation = document.getElementById('saturation');
    const reset = document.getElementById('reset');
    const previewToggle = document.getElementById('preview-toggle');
    const download = document.getElementById('download');
    const message = document.getElementById('message');
    const brightnessValue = document.getElementById('brightness-value');
    const contrastValue = document.getElementById('contrast-value');
    const saturationValue = document.getElementById('saturation-value');

    let img = new Image();
    let originalImageData;
    let isPreviewActive = false;

    // Fungsi untuk menampilkan pesan error
    function showMessage(text) {
    message.textContent = text;
    message.classList.remove('hidden');
    setTimeout(() => message.classList.add('hidden'), 3000);
    }

    // Fungsi untuk mengunggah gambar
    upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
        showMessage('Please upload a valid image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
    });

    // Fungsi untuk menggambar gambar di canvas
    img.onload = () => {
    const maxCanvasWidth = 800;
    const maxCanvasHeight = 600;
    let width = img.width;
    let height = img.height;

    if (width > maxCanvasWidth || height > maxCanvasHeight) {
        const widthRatio = maxCanvasWidth / width;
        const heightRatio = maxCanvasHeight / height;
        const ratio = Math.min(widthRatio, heightRatio);

        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    // Fungsi untuk mengaplikasikan filter
    function applyFilters() {
    if (!originalImageData) return;

    const imgData = new ImageData(
        new Uint8ClampedArray(originalImageData.data),
        originalImageData.width,
        originalImageData.height
    );

    const data = imgData.data;
    const brightnessValue = parseInt(brightness.value);
    const contrastValue = parseInt(contrast.value);
    const saturationValue = parseInt(saturation.value) / 100;

    for (let i = 0; i < data.length; i += 4) {
        // Adjust brightness
        data[i] += brightnessValue;
        data[i + 1] += brightnessValue;
        data[i + 2] += brightnessValue;

        // Adjust contrast
        data[i] = ((data[i] - 128) * (contrastValue / 100 + 1)) + 128;
        data[i + 1] = ((data[i + 1] - 128) * (contrastValue / 100 + 1)) + 128;
        data[i + 2] = ((data[i + 2] - 128) * (contrastValue / 100 + 1)) + 128;

        // Adjust saturation
        const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        data[i] = gray + (data[i] - gray) * (1 + saturationValue);
        data[i + 1] = gray + (data[i + 1] - gray) * (1 + saturationValue);
        data[i + 2] = gray + (data[i + 2] - gray) * (1 + saturationValue);

        // Clamp values to 0–255
        data[i] = Math.min(255, Math.max(0, data[i]));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2]));
    }

    ctx.putImageData(imgData, 0, 0);
    }

    // Event listener untuk slider
    [brightness, contrast, saturation].forEach((slider) => {
    slider.addEventListener('input', () => {
        applyFilters();
        brightnessValue.textContent = brightness.value;
        contrastValue.textContent = contrast.value;
        saturationValue.textContent = saturation.value;
    });
    });

    // Fungsi untuk reset filter
    reset.addEventListener('click', () => {
    brightness.value = 0;
    contrast.value = 0;
    saturation.value = 0;
    brightnessValue.textContent = '0';
    contrastValue.textContent = '0';
    saturationValue.textContent = '0';

    ctx.putImageData(originalImageData, 0, 0);
    });

    // Fungsi untuk toggle preview
    previewToggle.addEventListener('click', () => {
    if (!originalImageData) return;
    isPreviewActive = !isPreviewActive;
    if (isPreviewActive) {
        ctx.putImageData(originalImageData, 0, 0);
    } else {
        applyFilters();
    }
    });

    const sepia = document.getElementById('sepia');
const grayscale = document.getElementById('grayscale');

[sepia, grayscale].forEach((filter) => {
  filter.addEventListener('change', () => {
    applyFilters();
  });
});

function applyFilters() {
  if (!originalImageData) return;

  const imgData = new ImageData(
    new Uint8ClampedArray(originalImageData.data),
    originalImageData.width,
    originalImageData.height
  );

  const data = imgData.data;
  const brightnessValue = parseInt(brightness.value);
  const contrastValue = parseInt(contrast.value);
  const saturationValue = parseInt(saturation.value) / 100;
  const isSepia = sepia.checked;
  const isGrayscale = grayscale.checked;

  for (let i = 0; i < data.length; i += 4) {
    // Brightness, Contrast, Saturation
    data[i] += brightnessValue;
    data[i + 1] += brightnessValue;
    data[i + 2] += brightnessValue;

    data[i] = ((data[i] - 128) * (contrastValue / 100 + 1)) + 128;
    data[i + 1] = ((data[i + 1] - 128) * (contrastValue / 100 + 1)) + 128;
    data[i + 2] = ((data[i + 2] - 128) * (contrastValue / 100 + 1)) + 128;

    const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
    data[i] = gray + (data[i] - gray) * (1 + saturationValue);
    data[i + 1] = gray + (data[i + 1] - gray) * (1 + saturationValue);
    data[i + 2] = gray + (data[i + 2] - gray) * (1 + saturationValue);

    if (isSepia) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = 0.393 * r + 0.769 * g + 0.189 * b;
      data[i + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
      data[i + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
    }

    if (isGrayscale) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    }

    data[i] = Math.min(255, Math.max(0, data[i]));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2]));
  }

  ctx.putImageData(imgData, 0, 0);
}


    // Fungsi untuk mengunduh gambar
    download.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
    });
