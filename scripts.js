const video = document.getElementById('video');
const output = document.getElementById('output');

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
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
        
        if (qrCode) {
            // Mostrar los datos del QR
            const qrData = qrCode.data;
            if (qrData.startsWith("WIFI:")) {
                output.textContent = "Código QR de red Wi-Fi detectado.";
                extractWifiInfo(qrData);
            } else {
                output.textContent = "Código QR detectado, pero no es de una red Wi-Fi.";
            }
        } else {
            output.textContent = "No se ha detectado un código QR.";
        }
        
        requestAnimationFrame(scanQRCode);
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

    output.innerHTML = `
        <p><strong>SSID (Nombre de la red):</strong> ${wifiInfo['S'] || 'No encontrado'}</p>
        <p><strong>Encriptación:</strong> ${wifiInfo['T'] || 'No encontrada'}</p>
        <p><strong>Contraseña:</strong> ${wifiInfo['P'] || 'No encontrada'}</p>
        <p><strong>Red oculta:</strong> ${wifiInfo['H'] || 'false'}</p>
    `;
}