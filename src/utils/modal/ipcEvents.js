const { ipcRenderer } = require("electron");
const { applyHourValidation } = require("./logic");
const { showError } = require("./ui");
let timerEventData = null;

function getTimerEventData() {
	return timerEventData;
}

function ipcEventPrevHour() {
	ipcRenderer.on('prev-hours', () => {
		const timeContainer = document.getElementsByClassName('time-container')
		timeContainer[0].classList.remove('hidden')
		prevHour = true;
		const timeInputs = document.querySelectorAll('.time-container input[type="text"]');
		timeInputs.forEach(input => {
			applyHourValidation(input);
		});
	})
}

function ipcEventTimerEventData() {
	ipcRenderer.on('timer-event', async (event, data) => {
		timerEventData = data;
		const divPause = document.getElementsByClassName('pause');
		document.querySelectorAll('.form-group:not(.pause)').forEach(el => {
			el.style.display = timerEventData === 'pause' ? 'none' : 'block';
		});

		if (divPause.length > 0) {
			divPause[0].style.display = 'block';
		}

		const pauseSelect = document.getElementById('pause');

		ipcRenderer.invoke('get-clients-and-pauses').then(({ pauses }) => {
			pauses.forEach(pause => {
				const option = document.createElement('option');
				option.value = pause.id;
				option.textContent = pause.name;
				pauseSelect.appendChild(option);
			});
		}).catch(error => {
			console.error('Error al obtener las pausas:', error);
		});
	});

}

async function ipcEventGetClientsAndPauses(){
	try {
		const { clients } = await ipcRenderer.invoke('get-clients-and-pauses');
		return clients;
	} catch (error) {
		console.error('Error al obtener los clientes:', error);
        document.getElementById('client').innerHTML = '<option value="">Error al cargar los clientes</option>';
	}
}

function setupErrorEvents() {
    ipcRenderer.on('error-occurred', (event, error) => {
        console.error('Error recibido desde el proceso principal:', error.message);
        console.error('Stack Trace:', error.stack);
        showError('Ha ocurrido un error. Inténtalo de nuevo.');
        ipcRenderer.send('error-modal', `Error: ${error.message}\nStack Trace: ${error.stack}`);
    });
}

module.exports = { ipcEventPrevHour, ipcEventTimerEventData, ipcEventTimerEventData , getTimerEventData, ipcEventGetClientsAndPauses, setupErrorEvents}