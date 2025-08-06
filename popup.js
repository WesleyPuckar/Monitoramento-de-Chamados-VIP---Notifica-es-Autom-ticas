const toggleButton = document.getElementById("toggleButton");

chrome.storage.local.get("monitoramentoAtivo", (data) => {
  toggleButton.textContent = data.monitoramentoAtivo ? "Desativar" : "Ativar";
});

toggleButton.addEventListener("click", () => {
  chrome.storage.local.get("monitoramentoAtivo", (data) => {
    const novoEstado = !data.monitoramentoAtivo;
    chrome.storage.local.set({ monitoramentoAtivo: novoEstado }, () => {
      toggleButton.textContent = novoEstado ? "Desativar" : "Ativar";
    });
  });
});
