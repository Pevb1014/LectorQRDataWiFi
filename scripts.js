const video = document.getElementById('video');
const output = document.getElementById('output');
const restartBtn = document.getElementById('restartBtn');

let scanningActive = true; // Variable para controlar si la lectura está activa o no

// Obtener acceso a la cámara
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error al acceder a la cámara: " + err);
    });

// Decodificar el QR de la cámara en tiempo real
video.addEventListener('play', () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    function scanQRCode() {
        if (!scanningActive) {
            alert(`Escaneo activado: ${scanningActive}`);
            return;  // Si la lectura está pausada, no seguir escaneando
        }
    
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
    
        if (qrCode) {
            // Mostrar los datos del QR
            const qrData = qrCode.data;
            if (qrData.startsWith("WIFI:")) {
                alert(`Escaneo activado: ${scanningActive}`);
                output.textContent = "Código QR de red Wi-Fi detectado.";
                extractWifiInfo(qrData);
                scanningActive = false;  // Pausar la lectura
                alert(`Escaneo activado: ${scanningActive}`);
            } else {
                output.textContent = "Código QR detectado, pero no es de una red Wi-Fi.";
            }
        } else {
            output.textContent  = "No se ha detectado un código QR.";
        }
    
        if (scanningActive) {
            requestAnimationFrame(scanQRCode); // Seguir escaneando si está activo
        }
    }
    scanQRCode();
});

// Función para extraer la información de la red Wi-Fi del código QR
function extractWifiInfo(qrData) {
    const wifiData = qrData.slice(5).split(';');
    let wifiInfo = {};

    wifiData.forEach(pair => {
        if (pair.includes(':')) {
            const [key, value] = pair.split(':', 2);
            wifiInfo[key] = value;
        }
    });

    output.textContent = `Nombre de la red: ${wifiInfo['S']}\nEncriptación: ${wifiInfo['T']} \nContraseña: ${wifiInfo['P']}`;
}

// Función para reiniciar el escaneo
function restartScanner() {
    alert("Botn de reseteo oprimido");
    alert(`Escaneo activado: ${scanningActive}`);
    scanningActive = true;
    alert(`Escaneo activado: ${scanningActive}`);
    output.textContent = "";
    requestAnimationFrame(scanQRCode);  // Reiniciar el escaneo
}