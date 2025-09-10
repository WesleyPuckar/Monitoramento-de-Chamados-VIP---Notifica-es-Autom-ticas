🛠️ Extensão de Monitoramento de Chamados VIP

Esta extensão para Google Chrome monitora automaticamente uma interface web de chamados técnicos, detectando chamados classificados como **VIP** e exibindo **pop-ups visuais** com informações importantes em tempo real para melhor atendimento e cumprimento de metas de SLA.

## 📌 Funcionalidades

- ✅ Monitoramento automático de chamados VIP
- ✅ Notificações visuais com número, status, cidade, designado, tipo de atendimento e data
- ✅ Atualizações a cada 60 segundos
- ✅ Botão para **copiar os dados do chamado** para a área de transferência
- ✅ Botão para **acessar diretamente a página do chamado**
- ✅ Interface responsiva e não intrusiva

## 🖼️ Exemplo de Notificação
<img width="296" height="272" alt="image" src="https://github.com/user-attachments/assets/092ce755-4a36-473f-960a-ae29b81e1f8e" />

## 🧩 Instalação (Modo Desenvolvedor)

1. Baixe ou clone este repositório:
   ```bash
   git clone https://github.com/WesleyPuckar/Monitoramento-de-Chamados-VIP---Notifica-es-Autom-ticas.git
   
2- Abra o Google Chrome e vá para chrome://extensions

3- Ative o Modo do desenvolvedor (canto superior direito)

4- Clique em "Carregar sem compactação"

5- Selecione a pasta onde está o manifest.json

 A extensão será adicionada as extensões do chrome, sendo necessário acessar o ícone dela e clicar para ativar e logo em seguida recarregando a página (F5) para que seja aplicado.

## ⚙️ **Como funciona?**

O script utiliza XPath para localizar dinamicamente os dados de chamados.

Orienta-se a utilizar as colunas da seguinte forma para evitar erros na extensão:
<img width="1816" height="42" alt="image" src="https://github.com/user-attachments/assets/ecbfa481-9472-4ee3-888c-cf8d8e1e9870" />


Detecta automaticamente chamados com status ativo e identificados como VIP.

Exibe pop-ups com informações detalhadas diretamente na tela.

A verificação é feita a cada 60 segundos, garantindo acompanhamento em tempo real.

Atenção: O Script irá notificar somente chamados Vips que estiverem com status diferente de (Suspenso ou Usuário final pendente) já que em nenhum desses status é contado o SLA

Com a nova atualização do código foi adicionado um novo pop-up com a cor azul notificando assim os chamados com status (Suspenso e Usuário final pendente) como um lembrete, caso seja a primeira vez do chamado na fila com esse status o mesmo será exibido na hora, nas demais vezes somente a cada 5 minutos ele aparecerá como um lembrete evitando assim a poluição Visual

## 🖼️ Exemplo de Notificação de lembrete do VIP

<img width="255" height="229" alt="image" src="https://github.com/user-attachments/assets/92a0b2aa-775f-406a-8879-5f57dac2e5bf" />


## 📁 **Estrutura do Projeto**
├── manifest.json

├── content.js

├── icon.png

├── popup.html

└── README.md

## ✅ **Permissões requeridas**

activeTab

storage

notifications

Acesso ao site onde os chamados são exibidos (via content_scripts)

## ⚠️ **Observações**
Certifique-se de ativar as notificações do site onde a extensão será usada.

Desenvolvido para uso interno. Adaptável para outras interfaces com ajustes no XPath.

## 📄 **Licença**
Este projeto é de uso interno e não possui uma licença pública definida.
