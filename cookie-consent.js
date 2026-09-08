(function () {
  'use strict';

  var STORAGE_KEY = 'aj_cookie_consent';
  var GA_ID = 'G-EV2E8FYEG5';

  function loadAnalytics() {
    if (window.__ajAnalyticsLoaded) return;
    window.__ajAnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);
  }

  function removeConsentUi() {
    var banner = document.getElementById('aj-cookie-banner');
    var settings = document.getElementById('aj-cookie-settings');
    if (banner) banner.remove();
    if (settings) settings.remove();
  }

  function saveChoice(choice) {
    try { localStorage.setItem(STORAGE_KEY, choice); } catch (e) {}
    removeConsentUi();
    if (choice === 'accepted') loadAnalytics();
    showSettingsButton();
  }

  function showSettingsButton() {
    if (document.getElementById('aj-cookie-settings')) return;
    var button = document.createElement('button');
    button.id = 'aj-cookie-settings';
    button.type = 'button';
    button.textContent = 'Cookie settings';
    button.addEventListener('click', showBanner);
    document.body.appendChild(button);
  }

  function showBanner() {
    removeConsentUi();

    var banner = document.createElement('div');
    banner.id = 'aj-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.innerHTML =
      '<div class="aj-cookie-copy">' +
        '<strong>We value your privacy</strong>' +
        '<p>We use Google Analytics to understand how visitors use our website and improve our services. Analytics is only enabled if you choose to accept it. Read our <a href="' + (location.pathname.indexOf('/') !== -1 ? (location.pathname.split('/').length > 2 ? '../' : './') : './') + 'privacy-policy.html">Privacy Policy</a>.</p>' +
      '</div>' +
      '<div class="aj-cookie-actions">' +
        '<button type="button" class="aj-cookie-decline">Decline</button>' +
        '<button type="button" class="aj-cookie-accept">Accept Analytics</button>' +
      '</div>';

    document.body.appendChild(banner);
    banner.querySelector('.aj-cookie-accept').addEventListener('click', function () { saveChoice('accepted'); });
    banner.querySelector('.aj-cookie-decline').addEventListener('click', function () { saveChoice('declined'); });
  }

  function addStyles() {
    var style = document.createElement('style');
    style.textContent =
      '#aj-cookie-banner{position:fixed;left:20px;right:20px;bottom:20px;z-index:9999;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:20px 22px;background:#fff;color:#16213E;border:1px solid rgba(20,44,122,.12);border-radius:16px;box-shadow:0 18px 50px rgba(20,44,122,.22);font-family:Arial,sans-serif}'+
      '#aj-cookie-banner strong{display:block;font-size:1rem;margin-bottom:5px}'+
      '#aj-cookie-banner p{margin:0;max-width:760px;font-size:.88rem;line-height:1.5;color:#4C5670}'+
      '#aj-cookie-banner a{color:#1E40AF;text-decoration:underline}'+
      '.aj-cookie-actions{display:flex;gap:10px;flex-shrink:0}'+
      '.aj-cookie-actions button,#aj-cookie-settings{border:0;border-radius:999px;padding:11px 18px;font-weight:700;cursor:pointer;font:inherit}'+
      '.aj-cookie-decline{background:#EEF1F6;color:#16213E}'+
      '.aj-cookie-accept{background:#1E40AF;color:#fff}'+
      '#aj-cookie-settings{position:fixed;right:18px;bottom:18px;z-index:9998;background:#16213E;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.18);font-size:.78rem}'+
      '@media(max-width:700px){#aj-cookie-banner{left:12px;right:12px;bottom:12px;display:block;padding:18px}.aj-cookie-actions{margin-top:14px;display:flex}.aj-cookie-actions button{flex:1}.aj-cookie-copy p{font-size:.82rem}}';
    document.head.appendChild(style);
  }

  document.addEventListener('DOMContentLoaded', function () {
    addStyles();
    var choice = null;
    try { choice = localStorage.getItem(STORAGE_KEY); } catch (e) {}

    if (choice === 'accepted') {
      loadAnalytics();
      showSettingsButton();
    } else if (choice === 'declined') {
      showSettingsButton();
    } else {
      showBanner();
    }
  });
})();
