chrome.storage.local.get("monitoramentoAtivo", (data) => {
  if (!data.monitoramentoAtivo) {
    console.log("Monitoramento desativado.");
    return;
  }

  // Funções requestNotificationPermission e showNotification (sem alterações)
  const requestNotificationPermission = () => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") console.log("Notificações permitidas.");
        else console.warn("Notificações bloqueadas.");
      });
    }
  };

  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification("Novos chamados", { body: message, icon: "https://tjsp.br/Icon.png" });
    } else {
      alert(message);
    }
  };

  requestNotificationPermission();

  let activePopups = 0;

  // --- FUNÇÃO DE POP-UP ATUALIZADA ---
   function showAlertPopup(numeroChamado, status, Ems, designado, cidade, tipoAtendimento) {
    // VERIFICAÇÃO: Se um pop-up para este chamado já existe na tela, não faz nada.
    const popupId = `vip-popup-${numeroChamado}`;
    if (document.getElementById(popupId)) {
        return;
    }

    const popup = document.createElement('div');
    popup.id = popupId;
    const popupWidth = 300;
    const popupMargin = 60;
    const popupOffset = activePopups * (popupWidth + popupMargin);

    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = `${20 + popupOffset}px`;
    popup.style.width = `${popupWidth}px`;
    popup.style.backgroundColor = '#ffeb3b';
    popup.style.padding = '15px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    popup.style.zIndex = '9999';
    popup.style.borderLeft = '5px solid #ffc107';

    const linkChamado = `https://suporte.tjsp.jus.br/saw/Request/${numeroChamado}`;

    popup.innerHTML = `
      <h3 style="margin-top: 0; color: #333;">Chamado VIP Requer Atenção</h3>
      <p><strong>Número do Chamado:</strong> ${numeroChamado}</p>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Data de Criação:</strong> ${Ems}</p>
      <p><strong>Designado:</strong> ${designado}</p>
      <p><strong>Cidade:</strong> ${cidade}</p>
      <p><strong>Tipo de Atendimento:</strong> ${tipoAtendimento}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
        <button class="fechar" style="padding: 8px 12px; background: #ffc107; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;">Fechar</button>
        <div>
          <button class="copiar" title="Copiar Informações" style="padding: 8px 12px; background: #4caf50; color: #fff; border: none; border-radius: 3px; cursor: pointer; font-size: 16px; margin-left: 5px;">📋</button>
          <button class="abrir" title="Abrir Chamado" style="padding: 8px 12px; background: #2196f3; color: #fff; border: none; border-radius: 3px; cursor: pointer; font-size: 16px; margin-left: 5px;">🔗</button>
        </div>
      </div>
    `;

    document.body.appendChild(popup);
    activePopups++;

    popup.querySelector('.fechar').addEventListener('click', () => {
        popup.remove();
        activePopups = Math.max(0, activePopups - 1);
    });

    // --- LÓGICA DE CÓPIA ATUALIZADA COM TÍTULO H1 ---
    popup.querySelector('.copiar').addEventListener('click', (e) => {
        try {
            // Versão em HTML com tag <h1> para o título principal.
            const htmlText = `<h1><strong>Chamado VIP Requer Atenção</strong></h1>
                              <p><strong>Número do Chamado:</strong> ${numeroChamado}</p>
                              <p><strong>Status:</strong> ${status}</p>
                              <p><strong>Data de Criação:</strong> ${Ems}</p>
                              <p><strong>Designado:</strong> ${designado}</p>
                              <p><strong>Cidade:</strong> ${cidade}</p>
                              <p><strong>Tipo de Atendimento:</strong> ${tipoAtendimento}</p>`;

            // Versão em texto puro (fallback) permanece a mesma.
            const plainText = `Chamado VIP Requer Atenção
                                Número do Chamado: ${numeroChamado}
                                Status: ${status}
                                Data de Criação: ${Ems}
                                Designado: ${designado}
                                Cidade: ${cidade}
                                Tipo de Atendimento: ${tipoAtendimento}`;

            const clipboardItem = new ClipboardItem({
                "text/html": new Blob([htmlText], { type: "text/html" }),
                "text/plain": new Blob([plainText], { type: "text/plain" }),
            });

            navigator.clipboard.write([clipboardItem]).then(() => {
                e.target.textContent = '✅';
                setTimeout(() => { e.target.textContent = '📋'; }, 1500);
            });

        } catch (err) {
            console.error('Erro ao copiar Rich Text:', err);
            alert('Erro ao copiar informações.');
        }
    });

    popup.querySelector('.abrir').addEventListener('click', () => {
        window.open(linkChamado, '_blank');
    });

    setTimeout(() => {
        if (document.body.contains(popup)) {
            popup.remove();
            activePopups = Math.max(0, activePopups - 1);
        }
    }, 20000);
}

  function checkVIPAndStatus() {
    function extractCidade(texto) {
        if (!texto) return "Cidade não identificada";
        const cidadeBruta = texto.split(/[-/|(]/)[0].trim();
        const cidadeFormatada = cidadeBruta
            .toLowerCase()
            .split(" ")
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
            .join(" ");
        return cidadeFormatada;
    }

    const rowsXPath = "//*[@id='mainView']/div/div[2]/saw-grid-container/div/pl-grid-container/div/div[3]/div[3]/div[2]/div[7]/div/div";
    const rows = document.evaluate(rowsXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    
    for (let i = 1; i <= rows.snapshotLength; i++) {
        const vipCheckboxXPath = `//*[@id="mainView"]/div/div[2]/saw-grid-container/div/pl-grid-container/div/div[3]/div[3]/div[2]/div[7]/div/div[${i}]/div[11]`;
        const statusXPath = `//*[@id="mainView"]/div/div[2]/saw-grid-container/div/pl-grid-container/div/div[3]/div[3]/div[2]/div[7]/div/div[${i}]/div[5]`;
        const chamadoXPath = `//*[@id="mainView"]/div/div[2]/saw-grid-container/div/pl-grid-container/div/div[3]/div[3]/div[2]/div[7]/div/div[${i}]/div[2]`;
        // ... (restante dos XPaths)
        const EmsXPath = `//*[@id="mainView"]/div/div[2]/saw-grid-container/div/pl-grid-container/div/div[3]/div[3]/div[2]/div[7]/div/div[${i}]/div[12]`;
        const designadoXPath = `//*[@id="mainView"]/div/div[2]/saw-grid-container/div/pl-grid-container/div/div[3]/div[3]/div[2]/div[7]/div/div[${i}]/div[7]`;
        const predioLotacaoXPath = `//*[@id="mainView"]/div/div[2]/saw-grid-container/div/pl-grid-container/div/div[3]/div[3]/div[2]/div[7]/div/div[${i}]/div[9]`;
        const tipoAtendimentoXPath = `//*[@id="mainView"]/div/div[2]/saw-grid-container/div/pl-grid-container/div/div[3]/div[3]/div[2]/div[7]/div/div[${i}]/div[10]`;
        
        const vipElement = document.evaluate(vipCheckboxXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const statusElement = document.evaluate(statusXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const chamadoElement = document.evaluate(chamadoXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const EmsElement = document.evaluate(EmsXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const designadoElement = document.evaluate(designadoXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const predioLotacaoElement = document.evaluate(predioLotacaoXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const tipoAtendimentoElement = document.evaluate(tipoAtendimentoXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (vipElement && statusElement && chamadoElement && EmsElement) {
            const isVIP = vipElement.querySelector('input[type="checkbox"]')?.checked ||
                          vipElement.getAttribute('aria-checked') === 'true' ||
                          vipElement.classList.contains('checked');

            if (isVIP) {
                const status = statusElement.textContent.trim();
                
                // CONDIÇÃO SIMPLIFICADA: mostra o pop-up se o status não for um dos dois proibidos.
                // A função showAlertPopup vai lidar com as duplicatas visuais.
                if (status !== "Suspenso" && status !== "Usuário final pendente") {
                    const numeroChamado = chamadoElement.textContent.trim();
                    const Ems = EmsElement.textContent.trim();
                    const designado = designadoElement?.textContent.trim() || "Fila";
                    const predio = predioLotacaoElement?.textContent.trim() || "";
                    const cidade = extractCidade(predio);
                    const tipoAtendimento = tipoAtendimentoElement?.textContent.trim() || "Tipo não informado";
                    showAlertPopup(numeroChamado, status, Ems, designado, cidade, tipoAtendimento);
                }
            }
        }
    }
  }

  // Loop principal (sem alterações)
  let sum = 0;
  let previousCount = 0;
  setInterval(() => {
    const localDate = new Date();
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    const xpathBotao = "//*[@id='mainView']/div/div[2]/saw-grid-container/div/pl-grid-container/div/div[3]/div[3]/div[1]/div/span[3]/span/span/button";
    const botao = document.evaluate(xpathBotao, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (botao) {
      botao.click();
      console.log(`Attempt: ${sum}\n${hours}:${minutes}`);
      sum += 1;
    } else {
      console.warn("404 - Botão não encontrado.");
    }

    setTimeout(() => {
        const xpathChamados = "//div[contains(@class, 'ui-widget-content')]";
        const chamados = document.evaluate(xpathChamados, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const currentCount = chamados.snapshotLength;

        if (sum > 1 && currentCount > previousCount) {
            const newCalls = currentCount - previousCount;
            showNotification(`Você tem ${newCalls} novo(s) chamado(s) na fila!`);
        }
        
        checkVIPAndStatus();
        previousCount = currentCount;
    }, 2000);
  }, 60000);
});