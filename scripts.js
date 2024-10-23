const inputQRFile = document.getElementById('InputCamera');
const processButton = document.getElementById('processButton');
const outputInfo = document.getElementById('outputInfo');

let processing = false; // Estado de procesamiento

// Evento al cambiar el archivo
inputQRFile.addEventListener('change', () => {
    outputInfo.textContent = ""; // Limpiar salida
    if (processing) {
        processing = false; // Reiniciar el estado si se selecciona un nuevo archivo
    }
});

processButton.addEventListener('click', async () => {
    const qrFile = inputQRFile.files[0];
    if (!qrFile) {
        outputInfo.textContent = "Por favor, selecciona un archivo.";
        return;
    }

    if (processing) {
        outputInfo.textContent = "Por favor, espera a que se procese el QR actual.";
        return; // Evitar múltiples clics
    }

    processing = true; // Establecer estado de procesamiento
    processButton.disabled = true; // Deshabilitar el botón

    const reader = new FileReader();
    reader.onload = function(event) {
        let img = new Image();
        img.src = event.target.result;

        img.onload = function () {
            //document.body.removeChild(document.body.lastChild);
            let canvas = document.createElement('canvas');
            const scaleFactor = 2; // Puedes ajustar esto
            canvas.width = img.width / scaleFactor;
            canvas.height = img.height / scaleFactor;
            let context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            //document.body.appendChild(canvas);
            let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            let qrCode = jsQR(imageData.data, canvas.width, canvas.height);
            
            if (qrCode) {
                outputInfo.textContent = getInfoWiFiQR(qrCode.data);
            } else {
                outputInfo.textContent = "No se detectó ningún código QR.";
            }

            processing = false; // Resetear estado de procesamiento
            processButton.disabled = false; // Habilitar el botón
        };
    };
    reader.readAsDataURL(qrFile);
});

function getInfoWiFiQR(data) {
    let [ nombreRed, clave ] = data.split(';').slice(1, 3).map(text => text.replace(/^[a-zA-Z]:/, ''));
    return `Nombre Red: ${nombreRed}; Clave: ${clave}`;
}