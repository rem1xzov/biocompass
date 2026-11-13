(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const pad = (n) => String(n).padStart(2, '0');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Local persistence (safe in demo) ---------- */
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem('biocompass:' + key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('biocompass:' + key, JSON.stringify(value)); } catch (e) {}
    }
  };

  /* ---------- Toast ---------- */
  let toastTimer;
  const toastEl = $('#toast');
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2800);
  }

  /* ---------- Header / nav ---------- */
  const header = $('#siteHeader');
  const mobileNav = $('[data-mobile-nav]');
  const menuToggle = $('[data-menu-toggle]');
  function closeMobileNav() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  window.addEventListener('scroll', () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
  }, { passive: true });
  menuToggle?.addEventListener('click', () => {
    const willOpen = mobileNav.hidden;
    mobileNav.hidden = !willOpen;
    menuToggle.setAttribute('aria-expanded', String(willOpen));
  });
  $$('.mobile-nav a').forEach(a => a.addEventListener('click', closeMobileNav));

  /* ---------- Reveal ---------- */
  const reveals = $$('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 5, 4) * 55}ms`;
      io.observe(el);
    });
    // Guarantee above-the-fold content is visible even if IO is delayed.
    window.setTimeout(() => {
      reveals.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.05) el.classList.add('is-visible');
      });
    }, 350);
  }

  /* ---------- Landing route accordion ---------- */
  const routeItems = $$('.route-item');
  const dialNumber = $('#dialNumber');
  const dialArc = $('#dialArc');
  function openRouteStep(step) {
    routeItems.forEach(item => {
      const active = Number(item.dataset.step) === step;
      item.classList.toggle('is-open', active);
      const head = $('.route-head', item);
      if (head) head.setAttribute('aria-expanded', String(active));
    });
    if (dialNumber) dialNumber.textContent = pad(step);
    if (dialArc) {
      const circumference = 2 * Math.PI * 98;
      dialArc.style.strokeDasharray = `${(circumference * step) / 5} ${circumference}`;
    }
  }
  routeItems.forEach(item => {
    $('.route-head', item)?.addEventListener('click', () => openRouteStep(Number(item.dataset.step)));
  });

  /* ---------- FAQ: keep one open ---------- */
  const faqDetails = $$('.faq-list details');
  faqDetails.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) faqDetails.forEach(other => { if (other !== d) other.open = false; });
  }));

  /* ---------- App shell ---------- */
  const app = $('#app');
  const appTitle = $('[data-view-title]');
  const viewNames = {
    chat: 'Чат с агентом',
    route: 'Мой маршрут',
    map: 'Карта организаций',
    knowledge: 'База знаний',
    catalog: 'Каталог протезов'
  };
  let lastFocused = null;

  function openApp(options = {}) {
    if (!app) return;
    lastFocused = document.activeElement;
    app.hidden = false;
    document.body.classList.add('app-open');
    closeMobileNav();
    switchView(options.view || 'chat');
    if (options.scenario) {
      window.setTimeout(() => {
        const prompt = scenarioPrompts[options.scenario];
        if (prompt) sendMessage(prompt);
      }, 450);
    }
    window.setTimeout(() => {
      if (window.innerWidth <= 900) {
        // Keep the chat composer visible without forcing mobile keyboard.
        $('#chatInput')?.blur();
      }
    }, 550);
  }

  function closeApp() {
    if (!app || app.hidden) return;
    app.hidden = true;
    document.body.classList.remove('app-open', 'sidebar-open');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
  }

  function switchView(view) {
    if (!viewNames[view]) view = 'chat';
    $$('.app-nav [data-view]').forEach(btn => btn.classList.toggle('is-active', btn.dataset.view === view));
    $$('.app-view').forEach(panel => panel.classList.toggle('is-active', panel.dataset.viewPanel === view));
    if (appTitle) appTitle.textContent = viewNames[view];
    const activePanel = $(`.app-view[data-view-panel="${view}"]`);
    const scroller = $('.view-scroll', activePanel);
    if (scroller) scroller.scrollTop = 0;
    if (view === 'chat') scrollChat();
    if (window.innerWidth <= 900) app.classList.remove('sidebar-open');
  }

  document.addEventListener('click', (event) => {
    const openTrigger = event.target.closest('[data-open-app]');
    if (openTrigger) {
      event.preventDefault();
      const view = openTrigger.dataset.viewLink || 'chat';
      openApp({ view, scenario: openTrigger.dataset.scenario || null });
      return;
    }
    const closeTrigger = event.target.closest('[data-close-app]');
    if (closeTrigger) {
      event.preventDefault();
      closeApp();
      return;
    }
    const viewTrigger = event.target.closest('[data-view]');
    if (viewTrigger) {
      event.preventDefault();
      switchView(viewTrigger.dataset.view);
      return;
    }
    if (event.target.closest('[data-open-sidebar]')) {
      app?.classList.add('sidebar-open');
      return;
    }
    if (event.target.closest('[data-close-sidebar]')) {
      app?.classList.remove('sidebar-open');
      return;
    }
    const toastTrigger = event.target.closest('[data-toast]');
    if (toastTrigger) {
      event.preventDefault();
      toast(toastTrigger.dataset.toast);
      return;
    }
    const legal = event.target.closest('[data-legal]');
    if (legal) {
      event.preventDefault();
      toast('Документы появятся перед публичным запуском. Это прототип.');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (!$('#articleModal')?.hidden) {
        closeModal();
      } else if (app && !app.hidden) {
        closeApp();
      } else {
        closeMobileNav();
      }
    }
  });

  /* ---------- Route progress ---------- */
  const routeCards = $$('.app-route-card');
  const taskInputs = $$('[data-task]');
  function updateProgress() {
    let completedStages = 0;
    routeCards.forEach(card => {
      const tasks = $$('[data-task]', card);
      if (tasks.length && tasks.every(t => t.checked)) completedStages++;
    });
    const percent = Math.min(100, 20 + completedStages * 20);
    const step = Math.min(5, 1 + completedStages);

    const sidebarValue = $('#sidebarProgressValue');
    const sidebarBar = $('#sidebarProgressBar');
    const railText = $('#railProgressText');
    const railPercent = $('#railProgressPercent');
    const railBar = $('#railProgressBar');
    const routeValue = $('#routeProgressValue');
    const routeBar = $('#routeProgressBar');
    const navProgress = $('.nav-progress');

    if (sidebarValue) sidebarValue.textContent = `${step} / 5`;
    if (sidebarBar) sidebarBar.style.width = `${percent}%`;
    if (railText) railText.textContent = `${step} из 5 этапов`;
    if (railPercent) railPercent.textContent = `${percent}%`;
    if (railBar) railBar.style.width = `${percent}%`;
    if (routeValue) routeValue.textContent = `${step} / 5`;
    if (routeBar) routeBar.style.width = `${percent}%`;
    if (navProgress) navProgress.textContent = `${percent}%`;

    const stepLabels = ['разобраться в ситуации', 'собрать документы', 'подобрать протез и клинику', 'пройти изготовление и примерку', 'начать реабилитацию'];
    const stepTerms = ['1-2 дня', '2-6 недель', '1-3 недели', '3-8 недель', 'постоянно'];
    const nextLabel = completedStages >= 5 ? 'маршрут собран' : stepLabels[completedStages];
    const nextTerm = completedStages >= 5 ? 'все этапы' : `≈ ${stepTerms[completedStages]}`;
    if ($('#sidebarNextStep')) $('#sidebarNextStep').textContent = nextLabel;
    if ($('#routeNextStep')) $('#routeNextStep').textContent = nextLabel;
    if ($('#routeNextTerm')) $('#routeNextTerm').textContent = nextTerm;

    routeCards.forEach((card, index) => {
      const tasks = $$('[data-task]', card);
      const done = tasks.length && tasks.every(t => t.checked);
      card.classList.toggle('is-complete', done);
      card.classList.toggle('is-current', !done && index === completedStages);
      const state = $('.app-route-state', card);
      if (state) state.textContent = done ? 'готово' : index === completedStages ? 'в работе' : 'запланировано';
      const body = $('.app-route-body', card);
      if (body) body.style.display = done || index === completedStages ? '' : 'none';
    });

    $$('.rail-step').forEach((row, index) => {
      row.classList.toggle('is-done', index < completedStages);
      row.classList.toggle('is-active', index === completedStages);
    });
    store.set('progress', taskInputs.map(t => t.checked));
  }
  taskInputs.forEach(input => {
    input.addEventListener('change', () => {
      input.closest('.task')?.classList.toggle('checked', input.checked);
      updateProgress();
    });
  });
  const savedProgress = store.get('progress', null);
  if (Array.isArray(savedProgress) && savedProgress.length === taskInputs.length) {
    taskInputs.forEach((input, i) => {
      input.checked = Boolean(savedProgress[i]);
      input.closest('.task')?.classList.toggle('checked', input.checked);
    });
  }
  updateProgress();

  /* ---------- Saved clinics ---------- */
  const baseSaved = [{ name: 'Чек-лист документов', note: 'добавлен агентом', icon: 'file' }];
  let savedClinicNames = store.get('savedClinics', []);
  if (!Array.isArray(savedClinicNames)) savedClinicNames = [];
  const savedList = $('#savedList');
  const savedCount = $('#savedCount');
  function renderSaved() {
    if (!savedList) return;
    const all = [...baseSaved, ...savedClinicNames.map(name => ({ name, note: 'клиника · демо', icon: 'map' }))];
    savedList.innerHTML = all.map(item => `
      <div class="saved-item" style="margin-bottom:7px">
        <span class="saved-icon"><svg class="icon"><use href="#i-${item.icon}"/></svg></span>
        <div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.note)}</small></div>
      </div>`).join('');
    if (savedCount) savedCount.textContent = String(all.length);
  }
  function toggleClinic(name, button) {
    const idx = savedClinicNames.indexOf(name);
    if (idx >= 0) {
      savedClinicNames.splice(idx, 1);
      button?.classList.remove('is-saved');
      if (button) button.innerHTML = 'В избранное <svg class="icon"><use href="#i-bookmark"/></svg>';
      toast('Убрано из избранного');
    } else {
      savedClinicNames.push(name);
      button?.classList.add('is-saved');
      if (button) button.innerHTML = 'Сохранено <svg class="icon"><use href="#i-check"/></svg>';
      toast('Клиника сохранена в вашем маршруте');
    }
    store.set('savedClinics', savedClinicNames);
    renderSaved();
  }
  function syncSavedButtons() {
    $$('[data-save-clinic]').forEach(btn => {
      const saved = savedClinicNames.includes(btn.dataset.saveClinic);
      btn.classList.toggle('is-saved', saved);
      btn.innerHTML = saved
        ? 'Сохранено <svg class="icon"><use href="#i-check"/></svg>'
        : 'В избранное <svg class="icon"><use href="#i-bookmark"/></svg>';
    });
  }
  renderSaved();
  syncSavedButtons();
  document.addEventListener('click', (event) => {
    const saveBtn = event.target.closest('[data-save-clinic]');
    if (saveBtn) {
      toggleClinic(saveBtn.dataset.saveClinic, saveBtn);
    }
  });

  /* ---------- Map ---------- */
  const clinicCards = $$('.clinic-card');
  const canvasPins = $$('.canvas-pin');
  const mapCount = $('#mapCount');
  function selectClinic(index) {
    clinicCards.forEach(card => card.classList.toggle('is-selected', Number(card.dataset.clinicCard) === index));
    canvasPins.forEach(pin => pin.classList.toggle('is-selected', Number(pin.dataset.clinic) === index));
    const card = clinicCards.find(c => Number(c.dataset.clinicCard) === index);
    card?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  canvasPins.forEach(pin => pin.addEventListener('click', () => selectClinic(Number(pin.dataset.clinic))));
  clinicCards.forEach(card => card.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    selectClinic(Number(card.dataset.clinicCard));
  }));

  $$('[data-map-filters] button').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('[data-map-filters] button').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      let visible = 0;
      clinicCards.forEach(card => {
        const tags = (card.dataset.tags || '').split(' ');
        const show = filter === 'all' || tags.includes(filter);
        card.classList.toggle('is-hidden', !show);
        if (show) visible++;
      });
      canvasPins.forEach(pin => {
        const card = clinicCards.find(c => Number(c.dataset.clinicCard) === Number(pin.dataset.clinic));
        const tags = (card?.dataset.tags || '').split(' ');
        pin.style.display = filter === 'all' || tags.includes(filter) ? '' : 'none';
      });
      if (mapCount) mapCount.textContent = `${visible} ${visible === 1 ? 'организация' : visible < 5 ? 'организации' : 'организаций'}`;
    });
  });

  /* ---------- App knowledge filters ---------- */
  const appArticles = $$('.app-article');
  const appKnowledgeSearch = $('[data-app-knowledge-search]');
  const appKnowledgeEmpty = $('[data-app-knowledge-empty]');
  let knowledgeCategory = 'all';

  function filterAppKnowledge() {
    const query = (appKnowledgeSearch?.value || '').trim().toLowerCase();
    let visible = 0;
    appArticles.forEach(card => {
      const categoryOk = knowledgeCategory === 'all' || card.dataset.category === knowledgeCategory;
      const textOk = !query || card.textContent.toLowerCase().includes(query);
      const show = categoryOk && textOk;
      card.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    if (appKnowledgeEmpty) appKnowledgeEmpty.hidden = visible !== 0;
  }
  $$('[data-knowledge-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('[data-knowledge-filter]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      knowledgeCategory = btn.dataset.knowledgeFilter;
      filterAppKnowledge();
    });
  });
  appKnowledgeSearch?.addEventListener('input', filterAppKnowledge);

  /* ---------- Catalog filters ---------- */
  $$('[data-catalog-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('[data-catalog-filter]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.catalogFilter;
      $$('.app-product').forEach(card => {
        card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
      });
    });
  });

  /* ---------- Article modal ---------- */
  const articles = {
    ipra: {
      kicker: 'База знаний · Документы · 8 мин',
      title: 'ИПРА и протезирование. Что важно знать',
      lead: 'Индивидуальная программа реабилитации и абилитации. Это документ, который определяет, какие средства реабилитации человек может получить. Вот что стоит проверить до похода в клинику.',
      body: `
        <h3>Зачем нужна ИПРА</h3>
        <p>ИПРА разрабатывается по результатам медико-социальной экспертизы. В ней указываются рекомендации по реабилитации, включая технические средства. Для протезирования важно, чтобы в программе были отражены нужные изделия и услуги.</p>
        <h3>Что проверить в документе</h3>
        <ul>
          <li>Ваши персональные данные и срок действия программы.</li>
          <li>Наличие рекомендаций по протезно-ортопедическим изделиям.</li>
          <li>Конкретные характеристики изделия, если они указаны.</li>
          <li>Отметки о том, какие услуги и за чей счёт предоставляются.</li>
        </ul>
        <h3>Что взять с собой</h3>
        <p>Обычно обсуждают паспорт, СНИЛС, саму ИПРА, медицинские выписки и заключения. Точный список зависит от клиники и региона. Уточняйте заранее.</p>
        <div class="modal-note">Это ориентир, а не юридическая консультация. Официальные требования и порядок оформления уточняйте в уполномоченных органах и у профильного специалиста.</div>`
    },
    clinic: {
      kicker: 'База знаний · Клиники · 6 мин',
      title: '7 вопросов клинике до подписания договора',
      lead: 'Хорошая клиника не боится вопросов. Вот короткий список, который поможет сравнить варианты по существу, а не по обещаниям на сайте.',
      body: `
        <h3>Спросите до договора</h3>
        <ul>
          <li>Сколько протезов вашего уровня ампутации они изготовили за последний год?</li>
          <li>Уточните, кто будет вести вас на всех этапах. Врач, техник или реабилитолог?</li>
          <li>Сколько примерок входит в стоимость и что считается доработкой?</li>
          <li>Какая гарантия на гильзу, механику и электронику?</li>
          <li>Что входит в сервис и как быстро он доступен?</li>
          <li>Какая полная стоимость с учётом всех дополнительных услуг?</li>
          <li>Можно ли поговорить с человеком, который уже пользовался их изделием?</li>
        </ul>
        <h3>Красные флаги</h3>
        <p>Давление «решать сегодня», отсутствие письменной сметы, обещание гарантированного результата без осмотра и отказ объяснять, что входит в цену.</p>
        <div class="modal-note">В демо-кабинете организации вымышлены. Используйте список как основу для реального разговора.</div>`
    },
    fitting: {
      kicker: 'База знаний · Первый протез · 5 мин',
      title: 'Примерка гильзы. Что нормально, а что повод для доработки',
      lead: 'Гильза напрямую контактирует с культей. От её посадки зависит комфорт и то, насколько уверенно вы будете пользоваться протезом.',
      body: `
        <h3>Нормально</h3>
        <ul>
          <li>Лёгкое давление в отдельных точках, которое проходит после привыкания.</li>
          <li>Несколько примерок и корректировок перед финальным изделием.</li>
          <li>Ощущение «непривычно», особенно в первые дни.</li>
        </ul>
        <h3>Повод сказать специалисту</h3>
        <ul>
          <li>Резкая боль, онемение или покалывание, которые не проходят.</li>
          <li>Краснота, потёртости или повреждения кожи.</li>
          <li>Протез прокручивается, давит или болтается при ходьбе.</li>
          <li>Вы не можете простоять в нём столько, сколько нужно для повседневных дел.</li>
        </ul>
        <h3>Не соглашайтесь «на потом»</h3>
        <p>Если что-то неудобно на примерке, скажите об этом сразу. Доработка на этом этапе обычно проще и быстрее, чем после выдачи.</p>
        <div class="modal-note">Порог боли и ощущения индивидуальны. Любые стойкие симптомы обсуждайте с врачом и техником.</div>`
    },
    care: {
      kicker: 'База знаний · Жизнь с протезом · 4 мин',
      title: 'Уход за культей и кожей. Базовая информация',
      lead: 'Кожа под гильзой испытывает повышенную нагрузку. Регулярный осмотр и простые привычки помогают вовремя заметить проблему.',
      body: `
        <h3>Ежедневный осмотр</h3>
        <p>Проверяйте кожу культи до и после ношения протеза. Обращайте внимание на покраснения, потёртости, изменение температуры и новые ощущения.</p>
        <h3>Гигиена и гильза</h3>
        <ul>
          <li>Соблюдайте рекомендации по уходу за культей, которые дал ваш специалист.</li>
          <li>Следите за чистотой и сухостью гильзы и вкладышей.</li>
          <li>Не используйте случайные кремы и мази без согласования.</li>
          <li>Давайте коже отдых, если появляется стойкое раздражение.</li>
        </ul>
        <h3>Когда не откладывать</h3>
        <p>Если появилась рана, сильная боль, отёк или признаки воспаления. Обратитесь к медицинскому специалисту. Не пытайтесь «перетерпеть».</p>
        <div class="modal-note">Материал носит общий характер и не заменяет индивидуальные рекомендации лечащего врача.</div>`
    }
  };
  const modal = $('#articleModal');
  const modalKicker = $('#modalKicker');
  const modalTitle = $('#modalTitle');
  const modalLead = $('#modalLead');
  const modalBody = $('#modalBody');
  let lastArticle = 'ipra';

  function openArticle(key) {
    const article = articles[key] || articles.ipra;
    lastArticle = key;
    if (!modal) return;
    modalKicker.textContent = article.kicker;
    modalTitle.textContent = article.title;
    modalLead.textContent = article.lead;
    modalBody.innerHTML = article.body;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    $('.modal-close', modal)?.focus({ preventScroll: true });
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
  }
  document.addEventListener('click', (e) => {
    const articleTrigger = e.target.closest('[data-open-article]');
    if (articleTrigger) {
      e.preventDefault();
      openArticle(articleTrigger.dataset.openArticle);
      return;
    }
    if (e.target.closest('[data-close-modal]')) {
      closeModal();
    }
  });
  $('[data-modal-ask]')?.addEventListener('click', () => {
    closeModal();
    if (app?.hidden) openApp({ view: 'chat' });
    else switchView('chat');
    window.setTimeout(() => sendMessage('Хочу узнать подробнее. ' + articles[lastArticle].title), 220);
  });

  /* ---------- Landing knowledge search ---------- */
  const landingSearch = $('[data-knowledge-search]');
  const landingArticleGrid = $('[data-article-grid]');
  let landingEmpty;
  function filterLandingKnowledge() {
    if (!landingSearch || !landingArticleGrid) return;
    const query = landingSearch.value.trim().toLowerCase();
    let visible = 0;
    $$('.article-card', landingArticleGrid).forEach(card => {
      const show = !query || card.textContent.toLowerCase().includes(query);
      card.hidden = !show;
      if (show) visible++;
    });
    if (!landingEmpty) {
      landingEmpty = document.createElement('div');
      landingEmpty.className = 'knowledge-empty';
      landingEmpty.innerHTML = 'Ничего не нашлось. <strong>Спросите агента</strong>. Он ответит своими словами.';
      landingArticleGrid.after(landingEmpty);
    }
    landingEmpty.hidden = visible !== 0;
  }
  landingSearch?.addEventListener('input', filterLandingKnowledge);

  /* ---------- Chat ---------- */
  const chatScroll = $('#chatScroll');
  const chatForm = $('#chatForm');
  const chatInput = $('#chatInput');
  const initialChatHtml = chatScroll ? chatScroll.innerHTML : '';
  const initialComposerHtml = $('#composerQuick')?.innerHTML || '';
  let isTyping = false;
  let messageCount = 0;

  const scenarioPrompts = {
    new: 'Я только узнал об ампутации и пока не понимаю, с чего начать.',
    prepare: 'Я готовлюсь к протезированию. Помоги собрать маршрут и понять, что делать дальше.',
    life: 'Я уже протезируюсь. Хочу разобраться с реабилитацией и бытовыми вопросами.',
    docs: 'Какие документы нужны для протезирования?',
    clinics: 'Хочу найти клинику рядом и понять стоимость.',
    cost: 'Сколько может стоить протез и какие есть варианты компенсации?',
    rehab: 'Что важно знать про реабилитацию после протезирования?',
    fitting: 'Как проходит примерка и что делать, если гильза неудобна?',
    question: 'У меня есть вопрос по протезированию.',
    route: 'Давайте посмотрим мой маршрут.'
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[ch]));
  }
  function currentTime() {
    return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  function scrollChat() {
    if (!chatScroll) return;
    requestAnimationFrame(() => { chatScroll.scrollTop = chatScroll.scrollHeight; });
  }

  function appendUser(text) {
    if (!chatScroll) return;
    chatScroll.classList.remove('is-empty');
    const row = document.createElement('div');
    row.className = 'chat-row chat-row-user';
    row.innerHTML = `<div class="chat-content"><div class="chat-meta"><strong>Вы</strong><span>${currentTime()}</span></div><div class="chat-bubble"><p>${escapeHtml(text)}</p></div></div>`;
    chatScroll.appendChild(row);
    messageCount++;
    scrollChat();
  }

  function appendAgent(html) {
    if (!chatScroll) return;
    const row = document.createElement('div');
    row.className = 'chat-row chat-row-agent';
    row.innerHTML = `
      <span class="chat-avatar"><svg viewBox="0 0 40 40"><rect width="40" height="40" rx="13" fill="#F45B2A"/><circle cx="20" cy="20" r="9" fill="none" stroke="#fff" stroke-width="1.5"/><path d="m24.5 15.5-2.2 6.8-6.8 2.2 2.2-6.8 6.8-2.2Z" fill="#fff"/></svg></span>
      <div class="chat-content"><div class="chat-meta"><strong>Биокомпас</strong><span>${currentTime()}</span></div>${html}</div>`;
    chatScroll.appendChild(row);
    messageCount++;
    scrollChat();
  }

  function showTyping() {
    if (!chatScroll) return null;
    const row = document.createElement('div');
    row.className = 'chat-row chat-row-agent';
    row.dataset.typing = 'true';
    row.innerHTML = `<span class="chat-avatar"><svg viewBox="0 0 40 40"><rect width="40" height="40" rx="13" fill="#F45B2A"/><circle cx="20" cy="20" r="9" fill="none" stroke="#fff" stroke-width="1.5"/><path d="m24.5 15.5-2.2 6.8-6.8 2.2 2.2-6.8 6.8-2.2Z" fill="#fff"/></svg></span><div class="chat-content"><div class="typing"><i></i><i></i><i></i></div></div>`;
    chatScroll.appendChild(row);
    scrollChat();
    return row;
  }

  function optionButtons(items) {
    return `<div class="chat-options">${items.map(([label, value]) => `<button type="button" data-chat-quick="${escapeHtml(value)}">${escapeHtml(label)}</button>`).join('')}</div>`;
  }

  function routeRichCard() {
    return `
      <div class="chat-bubble"><p>Собрал для вас маршрут из пяти этапов. Сейчас мы на первом. Важно понять ситуацию и ваши цели. Дальше будет документы, выбор клиники, изготовление и реабилитация.</p></div>
      <div class="chat-rich">
        <div class="rich-title"><strong>Ваш маршрут</strong><span>1 / 5</span></div>
        <div class="rich-row"><span class="rich-check is-done"><svg class="icon"><use href="#i-check"/></svg></span><div><strong>Разобраться в ситуации</strong><small>уже начали · 2 из 3 пунктов</small></div></div>
        <div class="rich-row"><span class="rich-check">02</span><div><strong>Собрать документы</strong><small>ИПРА, выписки, направления</small></div></div>
        <div class="rich-row"><span class="rich-check">03</span><div><strong>Подобрать протез и клинику</strong><small>сравним варианты рядом с вами</small></div></div>
        <div class="rich-foot"><span>Прогресс сохранится в кабинете</span><button type="button" data-view="route">Открыть маршрут <svg class="icon"><use href="#i-arrow-right"/></svg></button></div>
      </div>
      ${optionButtons([['Документы', 'Какие документы нужны для протезирования?'], ['Клиники рядом', 'Хочу найти клинику рядом и понять стоимость'], ['Мне тревожно', 'Мне тревожно. Как справиться с этим состоянием?']])}`;
  }

  function docsRichCard() {
    return `
      <div class="chat-bubble"><p>Для начала важно проверить, есть ли у вас ИПРА. Это индивидуальная программа реабилитации. В ней могут быть указаны протезно-ортопедические изделия. Вот базовый чек-лист.</p></div>
      <div class="chat-rich">
        <div class="rich-title"><strong>Документы для первого визита</strong><span>демо</span></div>
        <div class="rich-row"><span class="rich-check is-done"><svg class="icon"><use href="#i-check"/></svg></span><div><strong>ИПРА</strong><small>проверить срок и рекомендации по изделию</small></div></div>
        <div class="rich-row"><span class="rich-check is-done"><svg class="icon"><use href="#i-check"/></svg></span><div><strong>Паспорт и СНИЛС</strong><small>копии обычно нужны клинике</small></div></div>
        <div class="rich-row"><span class="rich-check"></span><div><strong>Медицинские выписки</strong><small>заключения, снимки, история лечения</small></div></div>
        <div class="rich-row"><span class="rich-check"></span><div><strong>Направление</strong><small>если его оформляет ваш медцентр</small></div></div>
        <div class="rich-foot"><span>Точный список уточняйте в клинике</span><button type="button" data-toast="Чек-лист сохранён в вашем маршруте">Сохранить чек-лист <svg class="icon"><use href="#i-bookmark"/></svg></button></div>
      </div>
      ${optionButtons([['Как проверить ИПРА?', 'Как проверить ИПРА и что в ней важно?'], ['Найти клинику', 'Хочу найти клинику рядом и понять стоимость']])}`;
  }

  function clinicsRichCard() {
    return `
      <div class="chat-bubble"><p>В демо-кабинете есть 4 организации. Я показываю несколько, которые подходят под ваш контекст. Это Москва, нижняя конечность и первичное протезирование. Это вымышленные данные для примера, без реальных рекомендаций.</p></div>
      <div class="chat-clinic-list">
        <div class="chat-clinic"><span class="chat-clinic-icon"><svg class="icon"><use href="#i-map"/></svg></span><div><strong>Центр «Опора»</strong><small>по ИПРА · нижняя конечность · 4,9</small></div><span class="chat-clinic-dist">2,4 км</span></div>
        <div class="chat-clinic"><span class="chat-clinic-icon"><svg class="icon"><use href="#i-map"/></svg></span><div><strong>Лаборатория движения</strong><small>бионика · реабилитация · 4,7</small></div><span class="chat-clinic-dist">4,1 км</span></div>
        <div class="chat-clinic"><span class="chat-clinic-icon"><svg class="icon"><use href="#i-map"/></svg></span><div><strong>Клиника «Шаг»</strong><small>по ИПРА · сервис · 4,6</small></div><span class="chat-clinic-dist">5,8 км</span></div>
      </div>
      <div class="chat-bubble" style="margin-top:9px"><p>Стоимость зависит от конструкции и комплектации. Сравнивать нужно полную смету, а не только цену изделия.</p></div>
      ${optionButtons([['Открыть карту', 'Покажи карту организаций'], ['Что спросить у клиники?', 'Какие вопросы задать клинике до договора?']])}`;
  }

  function rehabRichCard() {
    return `
      <div class="chat-bubble"><p>Реабилитация не отдельный этап после выдачи протеза, а процесс, который начинается заранее. Вот три опоры, с которых обычно стоит начать.</p></div>
      <div class="chat-rich">
        <div class="rich-title"><strong>Реабилитация. База</strong><span>3 опоры</span></div>
        <div class="rich-row"><span class="rich-check">01</span><div><strong>Нагрузка постепенно</strong><small>программа ЛФК со специалистом, без героизма</small></div></div>
        <div class="rich-row"><span class="rich-check">02</span><div><strong>Кожа и гильза</strong><small>осмотр до и после, реакция на потёртости</small></div></div>
        <div class="rich-row"><span class="rich-check">03</span><div><strong>Быт и цели</strong><small>маленькие задачи, которые важны именно вам</small></div></div>
      </div>
      <div class="chat-bubble" style="margin-top:9px"><p>Если появится боль, рана или отёк, это повод обратиться к врачу, а не терпеть.</p></div>
      ${optionButtons([['Первый протез', 'Как проходит примерка гильзы?'], ['Уход за культей', 'Расскажи про уход за культей и кожей']])}`;
  }

  function empathyReply() {
    return `
      <div class="chat-bubble"><p>Это нормально. Можно бояться и злиться. Вы столкнулись с большим изменением, и не обязаны быть «сильным» каждую минуту.</p><p>Я не заменю психолога, но могу помочь разбить пугающее «всё сразу» на маленькие шаги. С чего сейчас чуть легче начать?</p></div>
      ${optionButtons([['Просто поговорить', 'Хочу просто поговорить о том, что чувствую'], ['Что будет дальше?', 'Расскажи, какие этапы меня ждут дальше'], ['Нужна помощь близких', 'Как попросить близких о помощи?']])}`;
  }

  function articleReply(title) {
    return `
      <div class="chat-bubble"><p>Если коротко, ${escapeHtml(title)}. Я могу разложить это на шаги или открыть статью из базы знаний. Что удобнее?</p></div>
      ${optionButtons([['Открыть статью', 'Открой статью из базы знаний'], ['Разложить на шаги', 'Разложи это на конкретные шаги'], ['Вернуться к маршруту', 'Давайте посмотрим мой маршрут']])}`;
  }

  function buildReply(text) {
    const t = text.toLowerCase();
    if (/(привет|здравств|добрый)/.test(t)) {
      return `<div class="chat-bubble"><p>Здравствуйте. Я рядом. Расскажите в двух словах, что происходит, и я помогу понять, с чего начать.</p></div>${optionButtons([['Только узнал об ампутации', 'Я только узнал об ампутации и пока не понимаю, с чего начать.'], ['Готовлюсь к протезу', 'Я готовлюсь к протезированию. Помоги собрать маршрут.'], ['Уже протезируюсь', 'Я уже протезируюсь. Хочу разобраться с реабилитацией.']])}`;
    }
    if (/(тревож|страш|боюсь|больно|тяжел|одинок|депресс|не могу|стыдно|злюсь|устал)/.test(t)) return empathyReply();
    if (/(ипра|документ|справк|бумаг|комисси|выписк)/.test(t)) return docsRichCard();
    if (/(клиник|центр|организац|где найти|рядом|москв)/.test(t)) return clinicsRichCard();
    if (/(стоимост|цена|стоит|деньг|бюджет|компенсац|оплат|ипра.*ден)/.test(t)) {
      return `
        <div class="chat-bubble"><p>Универсальной цены нет. Она зависит от уровня ампутации, типа конструкции, комплектации и региона. В разговоре с клиникой просите полную смету, а не цену «от».</p><p>Покрытие может идти через ИПРА, региональные программы или компенсацию, но условия зависят от вашей ситуации. Я помогу составить список вопросов, а не заменю юриста.</p></div>
        ${optionButtons([['Что входит в смету?', 'Что должно входить в смету на протез?'], ['Открыть карту', 'Покажи карту организаций'], ['Документы', 'Какие документы нужны для протезирования?']])}`;
    }
    if (/(реабилитац|лфк|упражнен|ходить|настро|уход|кож|культ)/.test(t)) return rehabRichCard();
    if (/(примерк|гильз|изготовлен|слепок|посадк)/.test(t)) {
      return `
        <div class="chat-bubble"><p>На примерке не нужно терпеть. Скажите специалисту, где давит, жжёт или сползает. Несколько корректировок нормальны. Это часть процесса.</p><p>Проверьте, можете ли вы стоять, сидеть, пройти привычную дистанцию; нет ли онемения и резкой боли; держится ли гильза при движении.</p></div>
        ${optionButtons([['Открыть статью', 'Открой статью про примерку гильзы'], ['Нужен чек-лист', 'Дай чек-лист вопросов на примерку'], ['Дальше', 'Что происходит после примерки?']])}`;
    }
    if (/(карта|организац|покажи.*клиник)/.test(t)) {
      return `<div class="chat-bubble"><p>Открываю карту организаций. В демо-версии там 4 вымышленные карточки. Можно потренироваться с фильтрами «По ИПРА», «Рядом» и «Детские».</p></div><div class="rich-foot" style="margin-top:8px"><span>Карта доступна в кабинете</span><button type="button" data-view="map">Открыть карту <svg class="icon"><use href="#i-arrow-right"/></svg></button></div>`;
    }
    if (/(маршрут|план|с чего начать|начать|дальше|этап)/.test(t)) return routeRichCard();
    if (/(рук|кист|палец|верхн)/.test(t)) {
      return `
        <div class="chat-bubble"><p>Для верхней конечности выбор обычно идёт между механическими, бионическими и косметическими протезами. Разница в управлении, весе, функциях и обслуживании.</p><p>Чтобы сузить варианты, важно понять уровень ампутации, сохранившиеся движения, ваши бытовые задачи и готовность к обучению.</p></div>
        ${optionButtons([['Каталог протезов', 'Открой каталог протезов'], ['Сравнить типы', 'Сравни механический и бионический протез'], ['Клиники', 'Хочу найти клинику рядом']])}`;
    }
    if (/(ног|бедр|голен|стоп|нижн)/.test(t)) {
      return `
        <div class="chat-bubble"><p>Для нижней конечности важны уровень ампутации, состояние культи, ваш темп ходьбы и поверхности, по которым вы хотите ходить. От этого зависит тип колена и стопы.</p><p>Не соглашайтесь выбирать только по цене. Важны примерка, настройка и сервис.</p></div>
        ${optionButtons([['Каталог протезов', 'Открой каталог протезов'], ['Клиники', 'Хочу найти клинику рядом'], ['Реабилитация', 'Что важно знать про реабилитацию?']])}`;
    }
    if (/(спасиб|благодар)/.test(t)) {
      return `<div class="chat-bubble"><p>Пожалуйста. Я рядом, когда понадобится. Если хотите, можем продолжить с документов или клиник. Без спешки.</p></div>`;
    }
    if (/(открой.*стат|база знаний|статья)/.test(t)) {
      return `<div class="chat-bubble"><p>Открою базу знаний. Там есть короткие статьи про ИПРА, выбор клиники, примерку и уход. Если нужного нет, спросите меня своими словами.</p></div><div class="rich-foot" style="margin-top:8px"><span>6 материалов в демо-базе</span><button type="button" data-view="knowledge">Открыть базу <svg class="icon"><use href="#i-arrow-right"/></svg></button></div>`;
    }
    if (/(каталог|протез.*тип|бионич|механич|косметич)/.test(t)) {
      return `<div class="chat-bubble"><p>В каталоге четыре типа конструкций. Бионическая кисть, модульный протез бедра, протез голени и косметический протез. Могу объяснить разницу или открыть карточки.</p></div>${optionButtons([['Открыть каталог', 'Открой каталог протезов'], ['Сравнить', 'Сравни типы протезов простыми словами']])}`;
    }
    return `
      <div class="chat-bubble"><p>Понял. Уточню, чтобы не давать общий ответ. Речь о верхней или нижней конечности? И вы сейчас на этапе «только разбираюсь» или уже готовитесь к протезированию?</p><p>Можно ответить своими словами, я подстроюсь.</p></div>
      ${optionButtons([['Нижняя конечность', 'У меня нижняя конечность. Помоги разобраться.'], ['Верхняя конечность', 'У меня верхняя конечность. Помоги разобраться.'], ['Пока не знаю', 'Пока не понимаю, что мне нужно. Помоги разобраться.']])}`;
  }

  function sendMessage(text) {
    const value = String(text || '').trim();
    if (!value || isTyping) return;
    if (app?.hidden) openApp({ view: 'chat' });
    else if (!$('.app-view[data-view-panel="chat"]')?.classList.contains('is-active')) switchView('chat');

    appendUser(value);
    if (chatInput) {
      chatInput.value = '';
      chatInput.style.height = 'auto';
    }
    isTyping = true;
    const typing = showTyping();
    const reply = buildReply(value);
    window.setTimeout(() => {
      typing?.remove();
      appendAgent(reply);
      isTyping = false;
      if (value.toLowerCase().includes('карта') && reply.includes('data-view="map"')) {
        // Do not switch automatically; keep the user in the dialogue.
      }
    }, prefersReduced ? 150 : 620 + Math.min(value.length * 4, 500));
  }

  chatForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage(chatInput?.value);
  });
  chatInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      sendMessage(chatInput.value);
    }
  });
  chatInput?.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });
  document.addEventListener('click', (event) => {
    const quick = event.target.closest('[data-chat-quick]');
    if (quick) {
      event.preventDefault();
      sendMessage(quick.dataset.chatQuick);
    }
  });

  $('[data-new-chat]')?.addEventListener('click', () => {
    if (!chatScroll) return;
    chatScroll.innerHTML = initialChatHtml;
    chatScroll.classList.add('is-empty');
    const quick = $('#composerQuick');
    if (quick) quick.innerHTML = initialComposerHtml;
    isTyping = false;
    messageCount = 0;
    switchView('chat');
    toast('Начат новый диалог');
    scrollChat();
    chatInput?.focus();
  });

  /* ---------- App init ---------- */
  if (app) app.hidden = true;
  updateProgress();
  renderSaved();

  // Expose a tiny API for automated visual QA.
  window.Biocompass = { openApp, closeApp, switchView, sendMessage, toast, openArticle };
})();
