(function() {
  'use strict';

  // Config
  var SCRIPT = document.currentScript || document.querySelector('script[src*="embed.js"]');
  var API_URL = (SCRIPT && SCRIPT.dataset.url) || window.location.origin;
  var BRAND_COLOR = '#722F37';
  var BG_COLOR = '#FAF9F5';
  var BEIGE = '#EFDECE';
  var TEXT_COLOR = '#141413';
  var BROWN = '#522D25';

  // State
  var isOpen = false;
  var context = {};
  var sessionId = localStorage.getItem('cb_session') || (function() {
    var id = 'cb_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cb_session', id);
    return id;
  })();

  // ============================================================
  // CREATE ROOT + SHADOW DOM
  // ============================================================
  var root = document.createElement('div');
  root.id = 'chayrabot-root';
  document.body.appendChild(root);
  var shadow = root.attachShadow({ mode: 'open' });

  // ============================================================
  // STYLES
  // ============================================================
  var style = document.createElement('style');
  style.textContent = '\
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\
    .cb-launcher {\
      position: fixed; bottom: 20px; right: 20px; z-index: 99999;\
      width: 60px; height: 60px; border-radius: 50%;\
      background: ' + BRAND_COLOR + '; color: #fff;\
      border: none; cursor: pointer; display: flex;\
      align-items: center; justify-content: center;\
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);\
      transition: transform 0.2s, box-shadow 0.2s;\
      font-size: 26px;\
    }\
    .cb-launcher:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(0,0,0,0.3); }\
    .cb-window {\
      position: fixed; bottom: 90px; right: 20px; z-index: 99998;\
      width: 380px; max-width: calc(100vw - 24px); height: 550px; max-height: calc(100vh - 110px);\
      background: ' + BG_COLOR + '; border-radius: 16px;\
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);\
      display: none; flex-direction: column; overflow: hidden;\
      font-family: Arial, "Helvetica Neue", sans-serif;\
    }\
    .cb-window.open { display: flex; }\
    .cb-header {\
      background: ' + BRAND_COLOR + '; color: #fff; padding: 14px 16px;\
      display: flex; align-items: center; gap: 10px; flex-shrink: 0;\
    }\
    .cb-header-title { font-weight: 700; font-size: 16px; flex: 1; }\
    .cb-header-sub { font-size: 11px; opacity: 0.85; }\
    .cb-close {\
      background: none; border: none; color: #fff; cursor: pointer;\
      font-size: 22px; padding: 4px 8px; border-radius: 6px;\
    }\
    .cb-close:hover { background: rgba(255,255,255,0.15); }\
    .cb-messages {\
      flex: 1; overflow-y: auto; padding: 16px; display: flex;\
      flex-direction: column; gap: 10px;\
    }\
    .cb-messages::-webkit-scrollbar { width: 4px; }\
    .cb-messages::-webkit-scrollbar-thumb { background: ' + BEIGE + '; border-radius: 4px; }\
    .cb-msg {\
      max-width: 85%; padding: 10px 14px; border-radius: 14px;\
      font-size: 14px; line-height: 1.5; word-wrap: break-word;\
    }\
    .cb-msg a { color: ' + BROWN + '; text-decoration: underline; }\
    .cb-msg-bot {\
      background: ' + BEIGE + '; color: ' + TEXT_COLOR + ';\
      align-self: flex-start; border-bottom-left-radius: 4px;\
    }\
    .cb-msg-user {\
      background: ' + BRAND_COLOR + '; color: #fff;\
      align-self: flex-end; border-bottom-right-radius: 4px;\
    }\
    .cb-msg-user a { color: #fff; }\
    .cb-suggestions {\
      padding: 8px 16px 4px; display: flex; flex-wrap: wrap; gap: 6px; flex-shrink: 0;\
    }\
    .cb-sug-btn {\
      background: #fff; color: ' + BROWN + '; border: 1.5px solid ' + BEIGE + ';\
      padding: 6px 12px; border-radius: 20px; cursor: pointer;\
      font-size: 12px; font-weight: 500; transition: all 0.15s;\
      white-space: nowrap;\
    }\
    .cb-sug-btn:hover { background: ' + BEIGE + '; border-color: ' + BRAND_COLOR + '; }\
    .cb-input-area {\
      padding: 10px 12px; border-top: 1px solid ' + BEIGE + ';\
      display: flex; gap: 8px; flex-shrink: 0; background: #fff;\
    }\
    .cb-input {\
      flex: 1; border: 1.5px solid ' + BEIGE + '; border-radius: 24px;\
      padding: 10px 16px; font-size: 14px; outline: none;\
      font-family: inherit; color: ' + TEXT_COLOR + ';\
    }\
    .cb-input:focus { border-color: ' + BRAND_COLOR + '; }\
    .cb-input::placeholder { color: #999; }\
    .cb-send {\
      background: ' + BRAND_COLOR + '; color: #fff; border: none;\
      border-radius: 50%; width: 40px; height: 40px; cursor: pointer;\
      display: flex; align-items: center; justify-content: center;\
      font-size: 18px; flex-shrink: 0; transition: background 0.15s;\
    }\
    .cb-send:hover { background: ' + BROWN + '; }\
    .cb-send:disabled { opacity: 0.5; cursor: not-allowed; }\
    .cb-typing {\
      display: flex; gap: 4px; padding: 10px 14px;\
      align-self: flex-start; background: ' + BEIGE + ';\
      border-radius: 14px; border-bottom-left-radius: 4px;\
    }\
    .cb-dot {\
      width: 7px; height: 7px; border-radius: 50%;\
      background: ' + BROWN + '; opacity: 0.4;\
      animation: cbBounce 1.2s infinite;\
    }\
    .cb-dot:nth-child(2) { animation-delay: 0.2s; }\
    .cb-dot:nth-child(3) { animation-delay: 0.4s; }\
    @keyframes cbBounce {\
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }\
      30% { transform: translateY(-6px); opacity: 1; }\
    }\
    .cb-powered {\
      text-align: center; font-size: 10px; color: #aaa;\
      padding: 4px 0 8px; flex-shrink: 0;\
    }\
    @media (max-width: 500px) {\
      .cb-window {\
        width: 100vw; height: 100vh; max-height: 100vh;\
        bottom: 0; right: 0; border-radius: 0;\
      }\
      .cb-launcher { bottom: 12px; right: 12px; width: 54px; height: 54px; font-size: 22px; }\
    }\
  ';
  shadow.appendChild(style);

  // ============================================================
  // LAUNCHER BUTTON
  // ============================================================
  var launcher = document.createElement('button');
  launcher.className = 'cb-launcher';
  launcher.innerHTML = '💬';
  launcher.setAttribute('aria-label', 'Chat avec ChayraBot');
  launcher.onclick = function() { toggleChat(); };
  shadow.appendChild(launcher);

  // ============================================================
  // CHAT WINDOW
  // ============================================================
  var win = document.createElement('div');
  win.className = 'cb-window';
  win.innerHTML = '\
    <div class="cb-header">\
      <div>\
        <div class="cb-header-title">ChayraBot 🤖</div>\
        <div class="cb-header-sub">Assistant ChayraKaftan</div>\
      </div>\
      <button class="cb-close" aria-label="Fermer">&times;</button>\
    </div>\
    <div class="cb-messages"></div>\
    <div class="cb-suggestions"></div>\
    <div class="cb-input-area">\
      <input class="cb-input" type="text" placeholder="Votre message..." autocomplete="off" />\
      <button class="cb-send" aria-label="Envoyer">➤</button>\
    </div>\
    <div class="cb-powered">ChayraKaftan © 2026</div>\
  ';
  shadow.appendChild(win);

  var messagesEl = win.querySelector('.cb-messages');
  var suggestionsEl = win.querySelector('.cb-suggestions');
  var inputEl = win.querySelector('.cb-input');
  var sendBtn = win.querySelector('.cb-send');
  var closeBtn = win.querySelector('.cb-close');

  closeBtn.onclick = function() { toggleChat(); };
  sendBtn.onclick = function() { sendMessage(); };
  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  // ============================================================
  // FUNCTIONS
  // ============================================================
  function toggleChat() {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    launcher.innerHTML = isOpen ? '✕' : '💬';
    if (isOpen && messagesEl.children.length === 0) {
      addBotMessage('Bonjour ! 👋 Je suis **ChayraBot**, l\'assistant de ChayraKaftan.\n\nComment puis-je vous aider ?');
      showSuggestions(['Où est ma commande ?', 'Frais de livraison', 'Délais de livraison', 'Retour', 'Tailles', 'Nous contacter']);
    }
    if (isOpen) inputEl.focus();
  }

  function addBotMessage(text) {
    var div = document.createElement('div');
    div.className = 'cb-msg cb-msg-bot';
    div.innerHTML = formatMarkdown(text);
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function addUserMessage(text) {
    var div = document.createElement('div');
    div.className = 'cb-msg cb-msg-user';
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function showSuggestions(items) {
    suggestionsEl.innerHTML = '';
    if (!items || items.length === 0) return;
    items.forEach(function(item) {
      var btn = document.createElement('button');
      btn.className = 'cb-sug-btn';
      btn.textContent = item;
      btn.onclick = function() {
        inputEl.value = item;
        sendMessage();
      };
      suggestionsEl.appendChild(btn);
    });
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'cb-typing';
    div.id = 'cb-typing';
    div.innerHTML = '<span class="cb-dot"></span><span class="cb-dot"></span><span class="cb-dot"></span>';
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    var el = messagesEl.querySelector('#cb-typing');
    if (el) el.remove();
  }

  function scrollToBottom() {
    setTimeout(function() { messagesEl.scrollTop = messagesEl.scrollHeight; }, 50);
  }

  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br>');
  }

  function sendMessage() {
    var text = inputEl.value.trim();
    if (!text) return;

    addUserMessage(text);
    inputEl.value = '';
    inputEl.disabled = true;
    sendBtn.disabled = true;
    suggestionsEl.innerHTML = '';
    showTyping();

    fetch(API_URL + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        sessionId: sessionId,
        context: context,
      }),
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      hideTyping();
      addBotMessage(data.reply || 'Désolé, une erreur est survenue.');
      if (data.context) context = data.context;
      if (data.suggestions) showSuggestions(data.suggestions);
    })
    .catch(function() {
      hideTyping();
      addBotMessage('Désolé, je rencontre un problème technique. Contactez-nous à **chayrakaftan@gmail.com**.');
    })
    .finally(function() {
      inputEl.disabled = false;
      sendBtn.disabled = false;
      inputEl.focus();
    });
  }

})();
