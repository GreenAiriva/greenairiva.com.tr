(function () {
  'use strict';

  const doc = document;
  const qs = (selector, parent = doc) => parent.querySelector(selector);
  const form = qs('#career-apply-form');
  if (!form) return;

  const lang = doc.documentElement.getAttribute('lang') || 'tr';

  const stylesLink = doc.querySelector('link[href*="/css/styles.css"]');
  let baseUrl = '';
  if (stylesLink) {
    const href = stylesLink.getAttribute('href') || '';
    const prefix = href.split('/css/styles.css')[0];
    if (prefix && prefix !== '.') {
      baseUrl = prefix;
    }
  }
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const jobsPath = lang === 'tr' ? '/career/tr/jobs.json' : '/career/jobs.json';
  const jobsUrl = `${baseUrl}${jobsPath}` || jobsPath;

  const params = new URLSearchParams(window.location.search);
  const rawSlug = params.get('slug') || '';
  const slugLower = rawSlug.toLowerCase();

  const slugAlias = {
    'donanim-prototip-gelistirme-muhendisi': 'hardware-prototype-development-engineer',
    'elektrik-elektronik-iot-muhendisi': 'electronics-iot-engineer',
    'veri-analisti': 'data-analyst',
    'kimyager-malzeme-uzmani': 'chemist-material-specialist',
    'is-gelistirme-sorumlusu': 'business-developer'
  };
  const effectiveSlug = slugAlias[slugLower] || slugLower;

  const pageUrlInput = qs('#page_url');
  if (pageUrlInput) {
    pageUrlInput.value = window.location.href;
  }

  const positionInput = qs('#position');
  const positionSlugInput = qs('#position_slug');
  const alertBox = qs('#form-alert');

  if (positionSlugInput) {
    positionSlugInput.value = rawSlug || '';
  }

  const translate = (tr, en) => (lang === 'tr' ? tr : en);

  fetch(jobsUrl, { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error('network');
      return res.json();
    })
    .then((data) => {
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && Array.isArray(data.jobs)) {
        list = data.jobs;
      }
      const job = list.find((item) => (item.slug || '').toLowerCase() === effectiveSlug) || null;
      if (positionSlugInput && job && !rawSlug) {
        positionSlugInput.value = job.slug || '';
      }
      if (positionInput) {
        const title = job && job.title ? job.title : translate('(İlan başlığı bulunamadı)', '(Job not found)');
        positionInput.value = title;
      }
      renderRoleBlock(rawSlug || (job && job.slug) || '', lang);
    })
    .catch(() => {
      if (positionInput) {
        positionInput.value = translate('(İlan verisi yüklenemedi)', '(Failed to load job data)');
      }
      renderRoleBlock(rawSlug, lang);
    });

  function renderRoleBlock(slug, langCode) {
    const host = qs('#role-specific');
    if (!host) return;
    const t = (tr, en) => (langCode === 'tr' ? tr : en);
    let html = '';
    const slugKey = (slug || '').toLowerCase();

    switch (slugKey) {
      case 'hardware-prototype-development-engineer':
      case 'donanim-prototip-gelistirme-muhendisi':
        html = `
          <h2 class="h5 mb-3">${t('Mekanik / Prototip Bilgileri', 'Mechanical / Prototype Details')}</h2>
          <div class="ga-form__grid">
            <div class="ga-form__group">
              <label class="form-label" for="cad_tools">${t('Kullandığınız CAD/CAE araçları', 'CAD/CAE tools used')}</label>
              <input id="cad_tools" name="cad_tools" type="text" class="form-control" placeholder="Inventor, SolidWorks, ANSYS...">
            </div>
            <div class="ga-form__group">
              <label class="form-label" for="proto_exp">${t('Prototip Deneyimi', 'Prototype Experience')}</label>
              <textarea id="proto_exp" name="proto_exp" class="form-control" maxlength="1200"></textarea>
            </div>
          </div>`;
        break;

      case 'electronics-iot-engineer':
      case 'elektrik-elektronik-iot-muhendisi':
        html = `
          <h2 class="h5 mb-3">${t('Elektronik & IoT', 'Electronics & IoT')}</h2>
          <div class="ga-form__grid">
            <div class="ga-form__group">
              <label class="form-label" for="pcb_tools">PCB</label>
              <input id="pcb_tools" name="pcb_tools" type="text" class="form-control" placeholder="KiCad, Altium, Eagle...">
            </div>
            <div class="ga-form__group">
              <label class="form-label" for="iot_stack">IoT</label>
              <input id="iot_stack" name="iot_stack" type="text" class="form-control" placeholder="LoRa, MQTT, NB-IoT, Wi-Fi...">
            </div>
          </div>`;
        break;

      case 'data-analyst':
      case 'veri-analisti':
        html = `
          <h2 class="h5 mb-3">${t('Yazılım & Veri', 'Software & Data')}</h2>
          <div class="ga-form__grid">
            <div class="ga-form__group">
              <label class="form-label" for="stack">${t('Yığın / Diller', 'Stack / Languages')}</label>
              <input id="stack" name="stack" type="text" class="form-control" placeholder="Python, JS/TS, SQL...">
            </div>
            <div class="ga-form__group">
              <label class="form-label" for="db_api">${t('Veritabanı / API Deneyimi', 'Database / API Experience')}</label>
              <textarea id="db_api" name="db_api" class="form-control" maxlength="1200"></textarea>
            </div>
          </div>`;
        break;

      case 'chemist-material-specialist':
      case 'kimyager-malzeme-uzmani':
        html = `
          <h2 class="h5 mb-3">${t('Malzeme & Karakterizasyon', 'Materials & Characterization')}</h2>
          <div class="ga-form__grid">
            <div class="ga-form__group">
              <label class="form-label" for="materials">${t('Malzemeler', 'Materials')}</label>
              <input id="materials" name="materials" type="text" class="form-control" placeholder="MOF, COF, Zeolit, Aktif Karbon...">
            </div>
            <div class="ga-form__group">
              <label class="form-label" for="methods">${t('Laboratuvar Teknikleri', 'Lab Techniques')}</label>
              <input id="methods" name="methods" type="text" class="form-control" placeholder="XRD, BET, SEM, TGA, FTIR...">
            </div>
          </div>`;
        break;

      case 'business-developer':
      case 'is-gelistirme-sorumlusu':
        html = `
          <h2 class="h5 mb-3">${t('İş Geliştirme', 'Business Development')}</h2>
          <div class="ga-form__grid">
            <div class="ga-form__group">
              <label class="form-label" for="grants">${t('Hibe/Fon Tecrübeleri', 'Grants/Funding Experience')}</label>
              <textarea id="grants" name="grants" class="form-control" maxlength="1200" placeholder="TÜBİTAK, Horizon, EIC..."></textarea>
            </div>
            <div class="ga-form__group">
              <label class="form-label" for="pitch">${t('Kısa Pitch / Yaklaşım', 'Short Pitch / Approach')}</label>
              <textarea id="pitch" name="pitch" class="form-control" maxlength="800"></textarea>
            </div>
          </div>`;
        break;

      default:
        html = '';
    }
    host.innerHTML = html;
  }

  const err = (id, msg) => {
    const el = qs(`#err-${id}`);
    if (el) {
      el.textContent = msg || '';
    }
  };

  function clearErrors() {
    ['position', 'full_name', 'email', 'phone', 'linkedin', 'portfolio', 'cv', 'attachments', 'cover_letter', 'consent'].forEach((key) => err(key, ''));
    if (alertBox) {
      alertBox.textContent = '';
    }
    if (uploadProgress) {
      uploadProgress.classList.add('d-none');
      const bar = uploadProgress.querySelector('.progress-bar');
      if (bar) {
        bar.style.width = '0%';
      }
    }
  }

  const MAX_CV = 5 * 1024 * 1024;
  const MAX_ATTACH_SUM = 20 * 1024 * 1024;
  const ATT_OK = /(\.)(pdf|zip|png|jpe?g|pptx?|xlsx|csv|txt|md)$/i;
  const CV_OK = /(\.)(pdf|docx?)$/i;

  const cvInput = qs('#cv');
  const attachmentsInput = qs('#attachments');
  const uploadList = qs('#upload-list');
  const uploadProgress = qs('#upload-progress');

  function sizeHuman(bytes) {
    if (!bytes) return '0 MB';
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function renderList(files) {
    if (!uploadList) return;
    uploadList.innerHTML = '';
    if (!files || !files.length) return;
    const ul = doc.createElement('ul');
    ul.className = 'list-unstyled mb-0';
    files.forEach((file) => {
      const li = doc.createElement('li');
      li.textContent = `${file.name} (${sizeHuman(file.size)})`;
      ul.appendChild(li);
    });
    uploadList.appendChild(ul);
  }

  attachmentsInput?.addEventListener('change', () => {
    renderList(Array.from(attachmentsInput.files || []));
  });

  form.addEventListener('submit', (event) => {
    clearErrors();
    let valid = true;

    const honeypot = qs('#hp-company');
    if (honeypot && honeypot.value) {
      event.preventDefault();
      return false;
    }

    const fullName = qs('#full_name')?.value.trim();
    const email = qs('#email')?.value.trim();
    const consent = qs('#consent')?.checked;
    const coverLetter = qs('#cover_letter')?.value || '';
    const linkedin = qs('#linkedin')?.value.trim();
    const portfolio = qs('#portfolio')?.value.trim();

    if (!positionInput || !positionInput.value.trim() || positionInput.value.startsWith('(') || /yükleniyor|loading/i.test(positionInput.value)) {
      err('position', translate('Pozisyon doğrulanamadı.', 'Position could not be verified.'));
      valid = false;
    }

    if (!fullName) {
      err('full_name', translate('Zorunlu alan', 'Required'));
      valid = false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err('email', translate('Geçerli e-posta girin', 'Enter a valid email'));
      valid = false;
    }

    if (!consent) {
      err('consent', translate('Onay gerekli', 'Consent required'));
      valid = false;
    }

    if (linkedin) {
      try {
        const url = new URL(linkedin);
        if (!/^https?:$/i.test(url.protocol)) {
          throw new Error('invalid protocol');
        }
      } catch (error) {
        err('linkedin', translate('Geçerli bir URL girin', 'Enter a valid URL'));
        valid = false;
      }
    }

    if (portfolio) {
      try {
        const url = new URL(portfolio);
        if (!/^https?:$/i.test(url.protocol)) {
          throw new Error('invalid protocol');
        }
      } catch (error) {
        err('portfolio', translate('Geçerli bir URL girin', 'Enter a valid URL'));
        valid = false;
      }
    }

    if (coverLetter && coverLetter.length > 2000) {
      err('cover_letter', translate('Ön yazı 2000 karakteri aşmamalı', 'Cover letter must be 2000 characters or less'));
      valid = false;
    }

    const cvFile = cvInput?.files?.[0] || null;
    if (!cvFile) {
      err('cv', translate('CV gerekli', 'CV required'));
      valid = false;
    } else {
      if (!CV_OK.test(cvFile.name)) {
        err('cv', translate('CV dosya türü desteklenmiyor', 'Unsupported CV file type'));
        valid = false;
      }
      if (cvFile.size > MAX_CV) {
        err('cv', translate('CV boyutu 5 MB’ı aşamaz', 'CV must be ≤ 5 MB'));
        valid = false;
      }
    }

    let attachmentsTotal = 0;
    let attachmentsBadType = false;
    const attachmentFiles = Array.from(attachmentsInput?.files || []);
    attachmentFiles.forEach((file) => {
      attachmentsTotal += file.size;
      if (!ATT_OK.test(file.name)) {
        attachmentsBadType = true;
      }
    });

    if (attachmentsTotal > MAX_ATTACH_SUM) {
      err('attachments', translate('Toplam ek boyutu 20 MB’ı aşamaz', 'Total attachments must be ≤ 20 MB'));
      valid = false;
    }

    if (attachmentsBadType) {
      err('attachments', translate('Uygun olmayan dosya uzantısı var', 'Some attachments have unsupported types'));
      valid = false;
    }

    if (!valid) {
      event.preventDefault();
      if (alertBox) {
        alertBox.textContent = translate('Lütfen hataları düzeltin.', 'Please fix the errors.');
      }
      return false;
    }

    if (uploadProgress) {
      uploadProgress.classList.remove('d-none');
      const bar = uploadProgress.querySelector('.progress-bar');
      if (bar) {
        bar.style.width = '100%';
      }
    }

    if (alertBox) {
      alertBox.textContent = translate('Gönderiliyor...', 'Submitting...');
    }

    return true;
  });
})();
