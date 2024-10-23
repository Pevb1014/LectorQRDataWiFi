const inputQRFile = document.getElementById('InputCamera');
const processButton = document.getElementById('processButton');
const outputInfo = document.getElementById('outputInfo');


let scanningActive = true; // Variable para controlar si la lectura está activa o no

processButton.addEventListener('click', () => {
    const qrFile = inputQRFile.files[0];
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

                outputInfo.textContent = getInfoWiFiQR(qrCode.data);
            } else {
                outputInfo.textContent = "No se detectó ningún código QR.";
            }
        };
    };
    reader.readAsDataURL(qrFile);
});

function getInfoWiFiQR(data) {
    let [ nombreRed, clave ] = data.split(';').slice(1, 3).map(text => text.replace(/^[a-zA-Z]:/, ''));
    return `Nombre Red: ${nombreRed}; Clave: ${clave}`;
}