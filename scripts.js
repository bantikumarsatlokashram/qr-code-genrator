$(document).ready(function() {
    const beepSound = new Audio('https://www.bkpkvideo.com/wp-content/uploads/2024/06/beep.wav'); // Add your beep sound URL

    // Initialize Pickr with custom styles
const pickr = Pickr.create({
    el: '#qrColor',
    theme: 'classic', // You can keep the classic theme
    default: '#7c3aed',
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            hsla: true,
            hsva: true,
            cmyk: true,
            input: true,
            save: true
        }
    }
});

pickr.on('save', (color) => {
    const hexColor = color.toHEXA().toString();
    localStorage.setItem('qrColor', hexColor);
    pickr.hide();
});

// Load user preferences
if (localStorage.getItem('qrColor')) {
    pickr.setColor(localStorage.getItem('qrColor'));
}

// QR code generation
$('#qrForm').on('submit', function(event) {
    event.preventDefault();
    let qrText = $('#qrText').val();
    let qrColor = pickr.getColor().toHEXA().toString();
    let qrSize = parseInt($('#qrSize').val());

    if (qrText) {
        $('#qrCode').empty();

        let qrCode = new QRCode(document.getElementById("qrCode"), {
            text: qrText,
            width: qrSize,
            height: qrSize,
            colorDark: qrColor,
            colorLight: "rgba(0,0,0,0)",  // Ensure transparency for PNG
            correctLevel: QRCode.CorrectLevel.H
        });

        // Add animation and border
        $('#qrCode canvas').css('border', `5px solid ${qrColor}`);
        $('#qrCode').addClass('qr-code-animate');
        $('#saveButtonWrapper').fadeIn();

        setTimeout(() => {
            let qrCanvas = $('#qrCode canvas')[0];
            let qrDataUrl = qrCanvas.toDataURL("image/png", 1.0); // Ensuring HD quality
            $('#downloadLink').attr('href', qrDataUrl);
        }, 500);

            // Play beep sound on successful QR code generation
            beepSound.play();
        }
    });

    // Download QR code in various formats
    function downloadQRCode(format) {
        let qrCanvas = $('#qrCode canvas')[0];
        if (!qrCanvas) {
            alert('Please generate a QR code first.');
            return;
        }

        if (format === 'png') {
            qrCanvas.toBlob(function(blob) {
                saveAs(blob, 'qrcode.png');
            }, 'image/png');
        } else {
            let extraSpace = 100;
            let canvasWithExtraSpace = document.createElement('canvas');
            canvasWithExtraSpace.width = qrCanvas.width + extraSpace * 2;
            canvasWithExtraSpace.height = qrCanvas.height + extraSpace * 2;
            let context = canvasWithExtraSpace.getContext('2d');
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvasWithExtraSpace.width, canvasWithExtraSpace.height);
            context.drawImage(qrCanvas, extraSpace, extraSpace);

            let mimeType;
            switch (format) {
                case 'jpg':
                    mimeType = 'image/jpeg';
                    break;
                case 'webp':
                    mimeType = 'image/webp';
                    break;
                default:
                    alert('Unsupported format');
                    return;
            }

            canvasWithExtraSpace.toBlob(function(blob) {
                saveAs(blob, `qrcode.${format}`);
            }, mimeType);
        }
    }

    $('#downloadJPG').on('click', function() {
        downloadQRCode('jpg');
    });

    $('#downloadPNG').on('click', function() {
        downloadQRCode('png');
    });

    $('#downloadWebP').on('click', function() {
        downloadQRCode('webp');
    });

    function showSnackbar() {
        let snackbar = document.getElementById("snackbar");
        snackbar.className = "show";
        setTimeout(function() {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
    }
});

