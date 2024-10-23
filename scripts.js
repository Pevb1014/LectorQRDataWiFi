const inputQRFile = document.getElementById('InputCamera');
const output = document.getElementById('output');
const restartBtn = document.getElementById('restartBtn');

let scanningActive = true; // Variable para controlar si la lectura está activa o no

inputQRFile.addEventListener('change', (event) => {
    const qrFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        let img = new Image();
        img.src = event.target.result;

        img.onload = function (event) {
            let canvas = document.createElement('canvas');
            canvas.style.display = 'none';
            canvas.width = img.width;
            canvas.height = img.height;
            let context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            let qrCode = jsQR(imageData.data, canvas.width, canvas.height);
            if (qrCode) {

                output.textContent = getInfoWiFiQR(qrCode.data);
            } else {
                output.textContent = "No se detectó ningún código QR.";
            }
        };
    };
    reader.readAsDataURL(qrFile);
});

function getInfoWiFiQR(data) {
    let [ nombreRed, clave ] = data.split(';').slice(1, 3).map(text => text.replace(/^[a-zA-Z]:/, ''));
    return `Nombre Red: ${nombreRed}; Clave: ${clave}`;
}