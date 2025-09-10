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

      .mde-enhanced-btn {
        padding: 12px 24px;
        background: #1976d2;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        font-size: 14px;
        font-weight: bold;
        margin-left: 30px;
      }

      .mde-enhanced-btn:disabled {
        background: #757575;
        cursor: not-allowed;
        opacity: 0.7;
      }

      .mde-enhanced-btn.processing {
        background: #ff9800;
      }
    `;
    document.head.appendChild(style);
  }

  function addAllHomeworksButton() {
    const btn = document.createElement('button');
    btn.id = 'md-enhanced-btn';
    btn.classList.add('non-printable', 'mde-enhanced-btn');
    btn.textContent = 'All kids homework';

    btn.onclick = function() {
      if (confirm('This will navigate through multiple pages to collect homework data. Continue?')) {
        collectAllHomeworkData(btn);
      }
    };
    document.querySelector('#main .title')?.appendChild(btn);
  }

  function collectAllHomeworkData(buttonElement) {
    // Set button to processing state
    buttonElement.disabled = true;
    buttonElement.classList.add('processing');
    buttonElement.textContent = 'Processing...';

    function collectChangeChildUrls() {
      let changeChildUrls = [];
      document.querySelectorAll('.child-info-wrapper-in-list').forEach(childEl => {
        const changeChildUrl = childEl.attributes.onclick.textContent.match(/location\.href\s*=\s'([^']+)'/)[1];
        changeChildUrls.push(changeChildUrl);
      });
      localStorage.setItem('mde:pendingChildUrls', JSON.stringify(changeChildUrls));
    }

    function gatherPagesData() {
      const pendingUrls = JSON.parse(localStorage.getItem('mde:pendingChildUrls') || '[]');

      // Use async/await to ensure sequential execution
      return pendingUrls.reduce((promise, url, index) => {
        return promise.then(async () => {
          const childId = url.split('/').pop();
          console.log(`Processing child ${childId}...`);

          // Update button text with progress
          buttonElement.textContent = `Processing child ${index + 1}/${pendingUrls.length}...`;

          try {
            const pageHtml = await gatherTargetPage(url);
            localStorage.setItem('mde:pageHtml:' + childId, pageHtml);
            console.log(`Completed child ${childId}`);
            // Add a small delay between requests to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`Error processing child ${childId}:`, error);
          }
        });
      }, Promise.resolve());
    }

    function gatherTargetPage(url) {
      return fetch(url)
        .then(() => {
            const formData = new FormData();
            formData.append('orderBy', '2');
            formData.append('datepickerFrom', new Date().toISOString().split('T')[0]);
            formData.append('datepickerTo', new Date().toISOString().split('T')[0]);
            formData.append('lessonSelect', '0');

            return fetch(
              "/1/lt/page/classhomework/home_work/0",
              {
                "body": formData,
                "method": "POST",
                "mode": "cors"
              }
            )
        })
        .then((page) => page.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const content = doc.querySelector('#main_middle')?.innerHTML || 'No Content';
          return content;
        });
    }

    function resetCache() {
      // remove everything starting with "mde:"
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('mde:')) {
          localStorage.removeItem(key);
        }
      });
    }

    function displayPagesData() {
      let mainHtml = '';
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('mde:pageHtml:')) {
          mainHtml += localStorage.getItem(key);
        }
      });
      document.querySelector('#main_middle').innerHTML = mainHtml;
    }

    resetCache();
    collectChangeChildUrls();
    gatherPagesData().then(() => {
      displayPagesData();
      markNonPrintableElements();

      // Reset button state
      buttonElement.disabled = false;
      buttonElement.classList.remove('processing');
      buttonElement.textContent = 'All kids homework';
    }).catch((error) => {
      console.error('Error collecting homework data:', error);

      // Reset button state on error
      buttonElement.disabled = false;
      buttonElement.classList.remove('processing');
      buttonElement.textContent = 'All kids homework';

      alert('An error occurred while collecting homework data. Please try again.');
    });
  }

  function markNonPrintableElements() {
    // Mark elements that should not be printed
    const selectors = [
      'header',
      '.side-container',
      '#banner_in_system',
      '.new_class',
      '.classhomework_table th:nth-child(3)',
      '.classhomework_table td:nth-child(3)',
      '.classhomework_table th:nth-child(5)',
      '.classhomework_table td:nth-child(5)',
      '.classhomework_table th:nth-child(6)',
      '.classhomework_table td:nth-child(6)',
      '.classhomework_table td:nth-child(7)',
      '.classhomework_table th:nth-child(7)',
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
    addAllHomeworksButton();
  }

  init();
})();


