const { toggleAmPm, sortElements } = require("./logic");

function viewLoader(closeButton, button, messageError ) {
	const svgElement = document.getElementById('svg-loading');
	const buttonText = document.getElementById('button-text');

	if (svgElement) {
		svgElement.classList.add('loading');       
		svgElement.classList.remove('no-loading'); 

		buttonText.style.display = 'none';        
		closeButton.style.pointerEvents = 'none';
		closeButton.style.opacity = '0.5';
		button.style.opacity = '0.5';
		button.style.pointerEvents = 'none';
		messageError.textContent = '';
	}

}

function hideLoader(closeButton, button) {
	document.getElementById('svg-loading').classList.add('no-loading');
	document.getElementById('svg-loading').classList.remove('loading');
	const buttonText = document.getElementById('button-text');

	buttonText.style.display = 'block';
	closeButton.style.pointerEvents = 'auto'; 
	closeButton.style.opacity = '1';
		button.style.pointerEvents = 'auto';
	button.style.opacity = '1';
	divPause[0].style.display = 'none';
	pauseSelect.innerHTML = '';

	const timeContainer = document.getElementsByClassName('time-container')
	timeContainer[0].classList.add('hidden')
	const timeInputs = document.querySelectorAll('.time-container input[type="text"]');
	timeInputs.forEach(input => input.value = '');
}

function closeModal() {
    const divPause = document.getElementsByClassName('pause');
    const pauseSelect = document.getElementById('pause');
	const data = JSON.parse(localStorage.getItem('workDayData'))
	lastClient = data.pop();
	
	document.querySelector('input[name="description"]').value = '';
	document.querySelector('select[name="client"]').value = lastClient.client.id;
	divPause[0].style.display = 'none';
	pauseSelect.innerHTML = '';
	timerEventData = null;
	document.querySelectorAll('.form-group:not(.pause)').forEach(el => {
		el.style.display = 'block';
	});

	const timeContainer = document.getElementsByClassName('time-container')
	timeContainer[0].classList.add('hidden')
	const timeInputs = document.querySelectorAll('.time-container input[type="text"]');
	timeInputs.forEach(input => input.value = '');
	
	const messageError = document.querySelector('#error-message');
	messageError.textContent = '';
}

function timeButtom() {
	document.getElementById('btn-tm-start').addEventListener('click', (e) => {
    	toggleAmPm(e.target);
	});

	document.getElementById('btn-tm-end').addEventListener('click', (e) => {
		toggleAmPm(e.target);
	});
}

function renderClients(clients, lastClient, clientSelect, taskSelect, brandSelect) {
    clientSelect.innerHTML = '';
    taskSelect.innerHTML = '<option value="">Selecciona una marca primero</option>';
    
    let firstValidClient = null;

    
    if (lastClient) {
        const option = document.createElement('option');
        option.value = String(lastClient.id);
        option.textContent = lastClient.name;
        option.selected = true;
        clientSelect.appendChild(option);
    }

    
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = String(client.id);
        option.textContent = client.name;
        clientSelect.appendChild(option);

        if (!firstValidClient) firstValidClient = client;

        if (client.tasks.length === 0) {
            taskSelect.innerHTML = '<option value="">No hay tareas disponibles</option>';
        }
    });

    return firstValidClient;
}

function updateBrands(clientSelect, brandSelect, taskSelect, clients) {
    brandSelect.innerHTML = '';
    const clientId = clientSelect.value;
    if (!clientId) {
        brandSelect.innerHTML = '<option value="">Selecciona un cliente primero</option>';
        return;
    }
    const selectedClient = clients.find(c => String(c.id) === String(clientId));
    if (!selectedClient) return;

    sortElements(selectedClient.brands).forEach(brand => {
        const option = document.createElement('option');
        option.value = String(brand.id);
        option.textContent = brand.name;
        brandSelect.appendChild(option);
    });
	
    updateTasks(clientSelect, brandSelect, taskSelect, clients);
}

function updateTasks(clientSelect, brandSelect, taskSelect, clients) {
    taskSelect.innerHTML = '';
    const clientId = clientSelect.value;
    const brandId = brandSelect.value;
    if (!clientId || !brandId) {
        taskSelect.innerHTML = '<option value="">Selecciona un cliente y marca primero</option>';
        return;
    }
    const selectedClient = clients.find(c => String(c.id) === String(clientId));
    if (!selectedClient) return;

    const filteredTasks = selectedClient.tasks.filter(task => !task.brand_id || task.brand_id == brandId);
    if (filteredTasks.length === 0) {
        taskSelect.innerHTML = '<option value="">No hay tareas disponibles</option>';
        return;
    }

    filteredTasks.forEach(task => {
        const option = document.createElement('option');
        option.value = String(task.id);
        option.textContent = task.name;
        taskSelect.appendChild(option);
    });
}

function setupClientEvents(clientSelect, brandSelect, taskSelect, clients) {
    clientSelect.addEventListener('change', () => updateBrands(clientSelect, brandSelect, taskSelect, clients));
    brandSelect.addEventListener('change', () => updateTasks(clientSelect, brandSelect, taskSelect, clients));
}

function showError(message) {
    const messageError = document.querySelector('#error-message');
    const button = document.querySelector('button');
    const buttonText = document.getElementById('button-text');
    const closeButton = document.querySelector('#close');
    const svgLoading = document.getElementById('svg-loading');

    svgLoading.classList.add('no-loading');
    svgLoading.classList.remove('loading');
    buttonText.style.display = 'block';
    button.style.pointerEvents = 'auto';
    button.style.opacity = '1';
    closeButton.style.pointerEvents = 'auto';
    closeButton.style.opacity = '1';
    messageError.textContent = message;
}

module.exports = { viewLoader , hideLoader , closeModal, timeButtom, renderClients , updateBrands , updateTasks , setupClientEvents , showError };