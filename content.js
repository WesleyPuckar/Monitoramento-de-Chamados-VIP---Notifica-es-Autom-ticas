chrome.storage.local.get(['monitoramentoAtivo', 'refreshInterval'], (data) => {
  if (!data.monitoramentoAtivo) {
    console.log("Monitoramento desativado.");
    chrome.storage.local.set({ nextRefreshTime: null });
    return;
  }

  const REFRESH_INTERVAL_MS = (data.refreshInterval || 60) * 1000;

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
  let alertHistory = {}; 

  function canNotify(numeroChamado, status) {
    const agora = Date.now();
    if (status === "Suspenso" || status === "Usuário final pendente") {
        const ultimoAlerta = alertHistory[numeroChamado] || 0;
        if (agora - ultimoAlerta < 300000) { // 5 minutos
            return false;
        }
    }
    alertHistory[numeroChamado] = agora;
    return true;
  }

  function showAlertPopup(numeroChamado, status, Ems, designado, cidade, tipoAtendimento, suspenso = false) {
    const popupId = `vip-popup-${numeroChamado}`;
    if (document.getElementById(popupId)) return;

    const popup = document.createElement('div');
    popup.id = popupId;
    const popupWidth = 300;
    const popupMargin = 60;
    const popupOffset = activePopups * (popupWidth + popupMargin);

    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = `${20 + popupOffset}px`;
    popup.style.width = `${popupWidth}px`;
    popup.style.padding = '15px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    popup.style.zIndex = '9999';

    if (suspenso) {
        popup.style.backgroundColor = '#bbdefb';
        popup.style.borderLeft = '5px solid #2196f3';
    } else {
        popup.style.backgroundColor = '#ffeb3b';
        popup.style.borderLeft = '5px solid #ffc107';
    }

    const titulo = suspenso ? "Chamado VIP" : "Chamado VIP Requer Atenção";
    const linkChamado = `https://suporte.tjsp.jus.br/saw/Request/${numeroChamado}`;

    popup.innerHTML = `
      <h3 style="margin-top: 0; color: #333;">${titulo}</h3>
      <p><strong>Número do Chamado:</strong> ${numeroChamado}</p>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Data de Criação:</strong> ${Ems}</p>
      <p><strong>Designado:</strong> ${designado}</p>
      <p><strong>Cidade:</strong> ${cidade}</p>
      <p><strong>Tipo de Atendimento:</strong> ${tipoAtendimento}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
        <button class="fechar" style="padding: 8px 12px; background: #ccc; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;">Fechar</button>
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

    popup.querySelector('.copiar').addEventListener('click', (e) => {
        try {
            const htmlText = `<h1><strong>Chamado VIP Requer Atenção</strong></h1><p><strong>Número do Chamado:</strong> ${numeroChamado}</p><p><strong>Status:</strong> ${status}</p><p><strong>Data de Criação:</strong> ${Ems}</p><p><strong>Designado:</strong> ${designado}</p><p><strong>Cidade:</strong> ${cidade}</p><p><strong>Tipo de Atendimento:</strong> ${tipoAtendimento}</p>`;
            const plainText = `Chamado VIP Requer Atenção\nNúmero do Chamado: ${numeroChamado}\nStatus: ${status}\nData de Criação: ${Ems}\nDesignado: ${designado}\nCidade: ${cidade}\nTipo de Atendimento: ${tipoAtendimento}`;
            const clipboardItem = new ClipboardItem({"text/html": new Blob([htmlText], { type: "text/html" }), "text/plain": new Blob([plainText], { type: "text/plain" })});
            navigator.clipboard.write([clipboardItem]).then(() => {
                e.target.textContent = '✅';
                setTimeout(() => { e.target.textContent = '📋'; }, 1500);
            });
        } catch (err) {
            console.error('Erro ao copiar:', err);
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
        return cidadeBruta.toLowerCase().split(" ").map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1)).join(" ");
    }

    const SELECTORS = {
        row: ".slick-row", numeroChamado: ".l1", status: ".l4",
        designado: ".l6", predioLotacao: ".l8", tipoAtendimento: ".l9",
        vipCheckbox: ".l10", dataCriacao: ".l11",
    };

    const allRows = document.querySelectorAll(SELECTORS.row);

    allRows.forEach(row => {
        const vipElement = row.querySelector(SELECTORS.vipCheckbox);
        const statusElement = row.querySelector(SELECTORS.status);
        const chamadoElement = row.querySelector(SELECTORS.numeroChamado);
        const emsElement = row.querySelector(SELECTORS.dataCriacao);
        const designadoElement = row.querySelector(SELECTORS.designado);
        const predioLotacaoElement = row.querySelector(SELECTORS.predioLotacao);
        const tipoAtendimentoElement = row.querySelector(SELECTORS.tipoAtendimento);

        if (!vipElement || !statusElement || !chamadoElement || !emsElement) return;

        const isVIP = vipElement.querySelector('input[type="checkbox"][checked="checked"]') !== null;

        if (isVIP) {
            const status = statusElement.textContent.trim();
            const numeroChamado = chamadoElement.textContent.trim();
            const Ems = emsElement.textContent.trim();
            const designado = designadoElement?.textContent.trim() || "Fila";
            const predio = predioLotacaoElement?.textContent.trim() || "";
            const cidade = extractCidade(predio);
            const tipoAtendimento = tipoAtendimentoElement?.textContent.trim() || "Tipo não informado";
            const isSuspendedOrPending = (status === "Suspenso" || status === "Usuário final pendente");

            if (canNotify(numeroChamado, status)) {
                showAlertPopup(numeroChamado, status, Ems, designado, cidade, tipoAtendimento, isSuspendedOrPending);
            }
        }
    });
  }

  let sum = 0;
  let previousCount = 0;

  setInterval(() => {
    const nextRefresh = Date.now() + REFRESH_INTERVAL_MS;
    chrome.storage.local.set({ nextRefreshTime: nextRefresh });

    const localDate = new Date();
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    const xpathBotao = "//*[@id='mainView']/div/div[2]/saw-grid-container/div/pl-grid-container/div/div[3]/div[3]/div[1]/div/span[3]/span/span/button";
    const botao = document.evaluate(xpathBotao, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (botao) {
      botao.click();
      console.log(`Attempt: ${sum}\n${hours}:${minutes}`);
      sum += 1;

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

    } else {
      console.warn("404 - Botão não encontrado.");
    }
  }, REFRESH_INTERVAL_MS);
});