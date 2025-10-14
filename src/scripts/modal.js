const { ipcRenderer, contextBridge } = require('electron');
const { systemLogger } = require('../utils/systemLogs');
const { validateTimeRange, toggleAmPm } = require('../utils/modal/logic');
const { getTimerEventData, ipcEventPrevHour, ipcEventTimerEventData, setupErrorEvents } = require('../utils/modal/ipcEvents');
const { viewLoader, hideLoader, closeModal, timeButtom } = require('../utils/modal/ui');
const { showClients } = require('../utils/modal/showClietns');
const logger = systemLogger();
ipcEventTimerEventData();
setupErrorEvents();
let prevHour = false;
document.addEventListener('DOMContentLoaded', () => {
    ipcEventPrevHour();
    
    timeButtom();
    window.addEventListener('storage', (event) => {
        if (event.key === 'name') {
            showClients();	
        }
	});

    const closeButton = document.querySelector('#close');
    const button = document.querySelector('button');
    const messageError = document.querySelector('#error-message');
    document.getElementById('modalForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        viewLoader(closeButton, button, messageError);

        const formData = new FormData(event.target);
        
        const data = {
            client: formData.get('client'),
            description: formData.get('description'),
            brand: formData.get('brand'),
            task: formData.get('task'),
            pause: formData.get('pause'),
        };
        
        if (prevHour){

            const { dateInit, dateEnd } = validateTimeRange(formData.get('time_start'), formData.get('time_end'))
            
            data.regPrevHour = {
                timeStart: dateInit.toISOString().replace('T',' ').substring(0, 19),
                timeEnd: dateEnd.toISOString().replace('T',' ').substring(0, 19),
            };
        }
        
        ipcRenderer.send('send-data', data);
        let timerEventData = getTimerEventData();
        ipcRenderer.send('change-timer-status', timerEventData);
        ipcRenderer.once('send-data-response', () => {
            hideLoader(closeButton, button);
            event.target.querySelector('input[name="description"]').value = '';
            timerEventData = null; 
            prevHour = false;
        });
    });
    showClients();
    closeButton.addEventListener('click', (event) => {
        ipcRenderer.send('close-modal-window');
        prevHour = false;
        closeModal();
    });
});