var sensorData;
var toggleLEDsButton = document.getElementById('toggle-leds');
var ledsOn = true; // Estado inicial, los LEDs están encendidos

toggleLEDsButton.addEventListener('click', function () {
    ledsOn = !ledsOn; // Cambia el estado
    updateLEDs(); // Actualiza el estado de los LEDs
    updateButtonText(); // Actualiza el texto del botón
});

function updateLEDs() {
    // Puedes agregar aquí el código para encender o apagar los LEDs según el estado
    // En este ejemplo, solo se imprime el estado en la consola
    if (ledsOn) {
        console.log('LEDs encendidos');
    } else {
        console.log('LEDs apagados');
    }
}

function updateButtonText() {
    // Cambia el texto del botón según el estado de los LEDs
    toggleLEDsButton.textContent = ledsOn ? 'Apagar LEDs' : 'Encender LEDs';
}

function updateCharts() {
    // Obtener los últimos tres registros
    var lastThreeEntries = sensorData.slice(-3);

    // Actualizar datos del gráfico de temperatura y humedad
    tempHumidityChart.data.labels = lastThreeEntries.map(entry => entry.timestamp);
    tempHumidityChart.data.datasets[0].data = lastThreeEntries.map(entry => entry.temperature);
    tempHumidityChart.data.datasets[1].data = lastThreeEntries.map(entry => entry.humidity);
    tempHumidityChart.update();

    // Actualizar datos del gráfico de luminosidad
    lightChart.data.labels = lastThreeEntries.map(entry => entry.timestamp);
    lightChart.data.datasets[0].data = lastThreeEntries.map(entry => entry.luminosity);
    lightChart.update();
}

// Función para realizar la solicitud AJAX y actualizar los gráficos
function fetchDataAndUpdateCharts() {
    // Realizar una solicitud AJAX para obtener los últimos datos del servidor
    $.ajax({
        url: 'fetch_data.php', // Cambia esto con la URL de tu script PHP para obtener datos
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Actualizar la variable sensorData con los nuevos datos
            sensorData = data;

            // Actualizar los gráficos con los nuevos datos
            updateCharts();
        },
        error: function (error) {
            console.error('Error al obtener datos del servidor:', error);
        }
    });
}

// Llamar a fetchDataAndUpdateCharts cada cierto intervalo de tiempo (por ejemplo, cada 2 segundo)
setInterval(fetchDataAndUpdateCharts, 2000);

// Inicializar los gráficos
var tempHumidityChart = new Chart(document.getElementById('temperature-humidity-chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Temperatura (°C)',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                fill: false
            },
            {
                label: 'Humedad (%)',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

var lightChart = new Chart(document.getElementById('light-chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Oscuridad',
                data: [],
                borderColor: 'rgb(255, 205, 86)',
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

// Inicializar los gráficos al cargar la página
fetchDataAndUpdateCharts();


// Reemplazar el código jQuery con JavaScript puro
var girarButton = document.getElementById('girarBtn');
var reversaButton = document.getElementById('reversaBtn');
var pararButton = document.getElementById('pararBtn');

girarButton.addEventListener('click', function () {
    controlarMotor("girar");
});

reversaButton.addEventListener('click', function () {
    controlarMotor("reversa");
});

pararButton.addEventListener('click', function () {
    controlarMotor("parar");
});

function controlarMotor(action) {
    fetch("http://sistemasprogramables.julysuk.art/control_motor.php?action=" + action)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error al controlar el motor:', error));
}



