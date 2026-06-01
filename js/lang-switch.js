// js/lang-switch.js
// Header dil düğmelerinin davranışını ve kariyer ilanı slug eşleşmelerini yönetir.

function getSlugMapping(slug, fromLang, toLang, callback) {
  const toJson = toLang === 'tr' ? '/career/tr/jobs.json' : '/career/jobs.json';

  fetch(toJson)
    .then(res => res.json())
    .then(toJobs => {
      const direct = toJobs.find(j => j.slug && j.slug.toLowerCase() === slug.toLowerCase());
      if (direct) {
        callback(direct.slug);
        return;
      }

      const customMap = {
        en: {},
        tr: {}
      };
      const directionMap = fromLang === 'en' ? customMap.en : customMap.tr;
      const mapped = directionMap[slug];
      callback(mapped || slug);
    })
    .catch(() => callback(slug));
}

function handleJobSlugSwitch(targetLang) {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    return false;
  }

  const navigateWithSlug = (basePath, mappedSlug) => {
    const slugValue = mappedSlug || slug;
    const url = `${basePath}?slug=${encodeURIComponent(slugValue)}`;
    window.location.href = url;
  };

  if (targetLang === 'tr' && /\/career\/vacancies\.html$/.test(path)) {
    getSlugMapping(slug, 'en', 'tr', mappedSlug => navigateWithSlug('/career/tr/vacancies.html', mappedSlug));
    return true;
  }

  if (
    targetLang === 'en' &&
    (/(?:\/career\/tr\/vacancies\.html$)/.test(path) || /\/tr\/career\/vacancies\.html$/.test(path))
  ) {
    getSlugMapping(slug, 'tr', 'en', mappedSlug => navigateWithSlug('/career/vacancies.html', mappedSlug));
    return true;
  }

  return false;
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.lang-switch[data-lang]').forEach(btn => {
    btn.addEventListener('click', function (event) {
      const targetLang = this.dataset.lang;
      if (!targetLang) {
        return;
      }

      if (handleJobSlugSwitch(targetLang)) {
        event.preventDefault();
      }
    });
  });
});
