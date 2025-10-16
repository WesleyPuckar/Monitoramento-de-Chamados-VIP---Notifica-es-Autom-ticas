# 🚀 Monitor de Chamados VIP - Notificações Automáticas

Esta extensão para Google Chrome monitora uma interface web de chamados técnicos, detectando chamados classificados como **VIP**. Ela exibe pop-ups visuais e inteligentes em tempo real, com uma interface de controle completa para otimizar o atendimento e garantir o cumprimento de metas de SLA.

## ✨ Funcionalidades Principais

-   ✅ **Monitoramento em Tempo Real**: Identifica automaticamente chamados marcados como VIP na fila.
-   🔧 **Intervalo Configurável**: Defina o tempo de atualização (a partir de 30 segundos) diretamente na interface da extensão.
-   ⏯️ **Controle Total**: Ative ou desative o monitoramento a qualquer momento através de um botão na popup.
-   ⏳ **Timer Regressivo**: Visualize em tempo real quanto falta para a próxima verificação automática.
-   📋 **Ações Rápidas**: Copie todos os dados do chamado com um clique ou abra a página do chamado em uma nova aba diretamente pela notificação.
-   💪 **Código Robusto**: Utiliza seletores CSS estáveis em vez de XPath, tornando a extensão muito mais resistente a atualizações na interface do sistema de chamados.

## 🖼️ Tipos de Notificação e Interface

### 🟡 Alerta de Ação Imediata

Receba notificações amarelas para chamados VIP que exigem **ação imediata** (status diferente de "Suspenso" ou "Pendente").
<br>
<img width="296" height="272" alt="image" src="https://github.com/user-attachments/assets/092ce755-4a36-473f-960a-ae29b81e1f8e" />

### 🔵 Lembrete de Chamado Suspenso/Pendente

Receba notificações azuis como **lembretes** para chamados VIP que estão suspensos ou pendentes, evitando que sejam esquecidos.
<br>
<img width="255" height="229" alt="image" src="https://github.com/user-attachments/assets/92a0b2aa-775f-406a-8879-5f57dac2e5bf" />

### 🖥️ Nova Interface de Controle

A extensão agora conta com uma popup de controle moderna e intuitiva, permitindo gerenciar todas as suas funcionalidades de forma centralizada.
<br>
<img width="302" height="345" alt="image" src="https://github.com/user-attachments/assets/e50312b8-99c2-4052-b13f-332679893cc9" />

## 🧩 Instalação e Uso

1.  Baixe ou clone este repositório:
    ```bash
    git clone [https://github.com/WesleyPuckar/Monitoramento-de-Chamados-VIP---Notifica-es-Autom-ticas.git](https://github.com/WesleyPuckar/Monitoramento-de-Chamados-VIP---Notifica-es-Autom-ticas.git)
    ```
2.  Abra o Google Chrome e navegue até `chrome://extensions`.
3.  Ative o **Modo de desenvolvedor** no canto superior direito.
4.  Clique em **"Carregar sem compactação"** e selecione a pasta do projeto que você baixou.
5.  **Pronto!** A extensão será adicionada ao Chrome. Acesse a página de chamados e clique no ícone da extensão para configurar e ativar o monitoramento.

## ⚙️ Como Funciona?

O script de conteúdo (`content.js`) é injetado na página de chamados e, quando ativado, começa a executar verificações no intervalo de tempo definido pelo usuário.

Ele utiliza seletores de classe CSS para localizar de forma eficiente as linhas e colunas da tabela, extraindo os dados dos chamados marcados como VIP. Essa abordagem é significativamente mais estável que a antiga baseada em XPath. Com base no status do chamado, a extensão decide se deve exibir um alerta de ação imediata ou um lembrete.

## 📁 Estrutura do Projeto
├── manifest.json # Arquivo de configuração da extensão

├── content.js       # Lógica principal de monitoramento e notificações 

├── popup.html       # Estrutura da interface de controle 

├── popup.js         # Lógica da interface de controle (botões, timer, etc.) 

├── icon.png         # Ícone da extensão 

└── README.md        # Este arquivo

## ✅ Permissões Requeridas

-   **notifications**: Para exibir as notificações de novos chamados.
-   **storage**: Para salvar o estado (ativo/inativo) e o intervalo de atualização configurado.
-   **scripting**: Para injetar o código que interage com a página de chamados.

## ⚠️ Observações

-   Certifique-se de que as notificações do navegador para o site de chamados estão ativadas.
-   A extensão foi desenvolvida para uma interface específica, mas pode ser adaptada para outros sistemas com ajustes nos seletores CSS no arquivo `content.js`.

## 📄 Licença

Este projeto é de uso interno e não possui uma licença pública definida.
