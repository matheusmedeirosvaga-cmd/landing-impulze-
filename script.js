  // Dispara evento pro Google Analytics / Google Ads (se o gtag tiver carregado)
  function trackEvent(eventName, params){
    if(typeof gtag === 'function'){
      gtag('event', eventName, params || {});
    }
  }

  // Obs: não precisamos disparar conversão manual pro Google Ads aqui.
  // "Lead form - Submit" é detectada automaticamente pela tag base do Ads (já no index.html),
  // e "SUBMIT_LEAD_FOI" é detectada via o evento form_submit que mandamos pro GA4 abaixo.

  // ---------- Banner de cookies (LGPD) ----------
  function initCookieBanner(){
    var CONSENT_KEY = 'impulze_cookie_consent';
    var banner = document.getElementById('cookieBanner');
    if(!banner) return;

    function updateConsent(granted){
      if(typeof gtag !== 'function') return;
      var status = granted ? 'granted' : 'denied';
      gtag('consent', 'update', {
        'ad_storage': status,
        'ad_user_data': status,
        'ad_personalization': status,
        'analytics_storage': status
      });
    }

    var saved = null;
    try { saved = localStorage.getItem(CONSENT_KEY); } catch(e) {}

    if(saved === 'granted' || saved === 'denied'){
      updateConsent(saved === 'granted');
    } else {
      banner.classList.add('show');
    }

    function choose(granted){
      updateConsent(granted);
      try { localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied'); } catch(e) {}
      banner.classList.remove('show');
    }

    var acceptBtn = document.getElementById('cookieAccept');
    var declineBtn = document.getElementById('cookieDecline');
    if(acceptBtn) acceptBtn.addEventListener('click', function(){ choose(true); });
    if(declineBtn) declineBtn.addEventListener('click', function(){ choose(false); });
  }

  initCookieBanner();

  function whatsLink(name, phone, msgPrefix){
    var num = "5553984439994";
    var text = encodeURIComponent(msgPrefix + " Meu nome é " + name + ", meu WhatsApp é " + phone + ".");
    return "https://wa.me/" + num + "?text=" + text;
  }

  // Marca "form_start" só uma vez por formulário, no primeiro campo tocado
  function trackFormStart(formId){
    var form = document.getElementById(formId);
    if(!form) return;
    var started = false;
    form.addEventListener('focusin', function(){
      if(started) return;
      started = true;
      trackEvent('form_start', {form_id: formId});
    });
  }

  function handleSubmit(formId, nameId, phoneId){
    var form = document.getElementById(formId);
    if(!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = document.getElementById(nameId).value.trim();
      var phone = document.getElementById(phoneId).value.trim();
      if(!name || !phone) return;

      trackEvent('form_submit', {form_id: formId});

      window.open(whatsLink(name, phone, "Olá Impulze, quero um diagnóstico grátis."), "_blank");
    });
  }

  // Clique em qualquer botão/link de WhatsApp (topo, flutuante) também conta como conversão
  function trackWhatsappClicks(){
    document.querySelectorAll('a[href*="wa.me"]').forEach(function(el){
      el.addEventListener('click', function(){
        trackEvent('whatsapp_click', {link_location: el.className || 'link'});
      });
    });
  }

  handleSubmit('leadForm', 'nome', 'whats');
  handleSubmit('leadForm2', 'nome2', 'whats2');
  trackFormStart('leadForm');
  trackFormStart('leadForm2');
  trackWhatsappClicks();
