const { ipcEventGetClientsAndPauses } = require('./ipcEvents');
const { getLastClient, filterClients } = require('./logic');
const { renderClients, setupClientEvents, updateBrands } = require('./ui');


async function showClients() {
    const clients = await ipcEventGetClientsAndPauses();
    const clientSelect = document.getElementById('client');
    const brandSelect = document.getElementById('brand');
    const taskSelect = document.getElementById('task');

    if (!clients.length) {
        clientSelect.innerHTML = '<option value="">No hay clientes disponibles</option>';
        brandSelect.innerHTML = '<option value="">No hay marcas disponibles</option>';
        taskSelect.innerHTML = '<option value="">No hay tareas disponibles</option>';
        return;
    }

    const lastClient = getLastClient();
    const filteredClients = filterClients(clients, lastClient);

    const firstValidClient = renderClients(filteredClients, lastClient, clientSelect, taskSelect, brandSelect);
    setupClientEvents(clientSelect, brandSelect, taskSelect, filteredClients);
	
    if (lastClient) {
        clientSelect.value = String(lastClient.id);
        updateBrands(clientSelect, brandSelect, taskSelect, filteredClients);
    } else if (firstValidClient) {
        clientSelect.value = String(firstValidClient.id);
        updateBrands(clientSelect, brandSelect, taskSelect, filteredClients);
    }
}

module.exports = { showClients };
