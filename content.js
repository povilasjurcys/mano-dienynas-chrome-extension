// Injects a print button into the page and opens the print dialog when clicked
(function() {
  function injectCss() {
    // Inject CSS to hide elements with class 'non-printable' when printing
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        .non-printable { display: none !important; }
        #container_main { padding-left: 0 !important; }
        .toolhead { display: none !important; }
        .md-block {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function addPrintButton() {
    // Avoid duplicate button
    if (document.getElementById('md-print-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'md-print-btn';
    btn.className = 'md-print-btn non-printable';
    btn.textContent = 'Print';
    btn.style.zIndex = '9999';
    btn.style.padding = '10px 20px';
    btn.style.background = '#1976d2';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

    btn.onclick = function() {
      window.print();
    };

    document.querySelector('.toolhead').appendChild(btn);
  }

  function markNonPrintableElements() {
    // Mark elements that should not be printed
    const selectors = [
      'header',
      '.side-container',
      '#banner_in_system'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('non-printable');
      });
    });
  }

  function init() {
    injectCss();
    markNonPrintableElements();
    // addPrintButton();
  }

  init();
})();


