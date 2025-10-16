document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const timerDisplay = document.getElementById('timerDisplay');
    const intervalInput = document.getElementById('intervalInput');
    const saveIntervalButton = document.getElementById('saveIntervalButton');
    let timerIntervalId = null;

    // --- LÓGICA DO BOTÃO ATIVAR/DESATIVAR (EXISTENTE) ---
    const updateToggleButton = (isActive) => {
        if (isActive) {
            toggleButton.textContent = 'Desativar Monitoramento';
            toggleButton.classList.remove('ativar');
            toggleButton.classList.add('desativar');
            startTimer(); // Inicia o timer se estiver ativo
        } else {
            toggleButton.textContent = 'Ativar Monitoramento';
            toggleButton.classList.remove('desativar');
            toggleButton.classList.add('ativar');
            stopTimer(); // Para o timer se estiver inativo
        }
    };

    toggleButton.addEventListener('click', () => {
        chrome.storage.local.get('monitoramentoAtivo', (data) => {
            const newState = !data.monitoramentoAtivo;
            chrome.storage.local.set({ monitoramentoAtivo: newState }, () => {
                updateToggleButton(newState);
                promptForReload(newState);
            });
        });
    });

    // --- LÓGICA DO TIMER ---
    const startTimer = () => {
    if (timerIntervalId) clearInterval(timerIntervalId); // Limpa timer anterior

    const updateDisplay = () => {
        // Pega a hora da próxima atualização salva pelo content.js
        chrome.storage.local.get('nextRefreshTime', (data) => {
            if (data.nextRefreshTime && data.nextRefreshTime > Date.now()) {
                const remainingSeconds = Math.round((data.nextRefreshTime - Date.now()) / 1000);

                if (remainingSeconds >= 0) {
                    const minutes = Math.floor(remainingSeconds / 60);
                    const seconds = remainingSeconds % 60;
                    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                } else {
                    timerDisplay.textContent = "00:00"; // Atualizando...
                }
            } else {
                // Se não houver um 'nextRefreshTime' ou ele já tiver passado, mostra isso.
                timerDisplay.textContent = "Aguardando...";
            }
        });
    };

    // Roda a função uma vez imediatamente para não esperar 1 segundo
    updateDisplay();
    // E então continua rodando a cada segundo
    timerIntervalId = setInterval(updateDisplay, 1000);
};

    const stopTimer = () => {
        if (timerIntervalId) clearInterval(timerIntervalId);
        timerDisplay.textContent = "--:--";
    };

    // --- LÓGICA DO INTERVALO DE ATUALIZAÇÃO ---
    saveIntervalButton.addEventListener('click', () => {
        const newInterval = parseInt(intervalInput.value, 10);
        if (newInterval && newInterval >= 30) {
            // Salva o intervalo em segundos
            chrome.storage.local.set({ refreshInterval: newInterval }, () => {
                saveIntervalButton.textContent = 'Salvo!';
                setTimeout(() => { saveIntervalButton.textContent = 'Salvar'; }, 1500);
                
                // Pede para recarregar para aplicar a nova configuração
                promptForReload(null, true); 
            });
        } else {
            alert('Por favor, insira um valor de no mínimo 30 segundos.');
        }
    });

    // --- INICIALIZAÇÃO DA POPUP ---
    chrome.storage.local.get(['monitoramentoAtivo', 'refreshInterval'], (data) => {
        updateToggleButton(!!data.monitoramentoAtivo);
        // Usa o valor salvo ou um padrão de 60 segundos
        intervalInput.value = data.refreshInterval || 60;
    });
});

// --- FUNÇÃO AUXILIAR PARA RECARREGAR A PÁGINA ---
function promptForReload(isActivating, isIntervalChange = false) {
    let message = '';
    if (isIntervalChange) {
        message = 'Intervalo salvo. Deseja recarregar a página para aplicar a nova configuração?';
    } else {
        const actionText = isActivating ? 'ativar' : 'desativar';
        message = `Monitoramento alterado. Deseja recarregar a página agora para ${actionText} as mudanças?`;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: (msg) => {
                    if (confirm(msg)) {
                        window.location.reload();
                    }
                },
                args: [message]
            });
        }
    });
}