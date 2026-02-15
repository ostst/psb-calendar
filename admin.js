document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // === АККАУНТЫ И РОЛИ ===
    // =============================================
    const ACCOUNTS = {
        goz:     { password: 'goz123',     label: 'ГОЗ и ОПК',              categories: ['goz'] },
        finance: { password: 'finance123', label: 'Финансовая грамотность',  categories: ['finance'] },
        digital: { password: 'digital123', label: 'Цифровые навыки',        categories: ['digital'] },
        other:   { password: 'other123',   label: 'Остальные направления',  categories: ['projects','management','business','personal','games'] },
        admin:   { password: 'admin',      label: 'Тех. администратор',     categories: ['all'] },
    };

    const CATEGORY_LABELS = {
        goz: 'ГОЗ и ОПК', finance: 'Финансовая грамотность', digital: 'Цифровые навыки',
        projects: 'Управление проектами', management: 'Управленческие навыки',
        business: 'Предпринимательство', personal: 'Личностный рост', games: 'Бизнес-игры',
    };

    let currentRole = null; // 'goz' | 'finance' | 'digital' | 'other' | 'admin'

    // =============================================
    // === КАТАЛОГ КУРСОВ С САЙТА ===
    // =============================================
    const COURSE_CATALOG = [
        // ГОЗ и ОПК
        { category: 'goz', title: 'Ответственность в сфере ГОЗ', link: 'https://psb-academy.ru/education/347', description: 'Программа об ответственности в сфере государственного оборонного заказа.', rating: '4.8' },
        { category: 'goz', title: 'Специфика ценообразования при выполнении ГОЗ', link: 'https://psb-academy.ru/education/202', description: 'Курс для специалистов по ценообразованию в рамках гособоронзаказа.', rating: '4.9' },
        { category: 'goz', title: 'Закупки в рамках реализации гособоронзаказа', link: 'https://psb-academy.ru/education/206', description: 'Программа по закупкам в рамках реализации ГОЗ.', rating: '4.7' },
        { category: 'goz', title: 'Государственные контракты: составление, заключение, исполнение', link: 'https://psb-academy.ru/education/207', description: 'Программа обучения по государственным контрактам: от составления до прекращения.', rating: '4.8' },
        { category: 'goz', title: 'Просто о сложном: ГОЗ в вопросах и ответах', link: 'https://psb-academy.ru/education/385', description: 'Доступный курс о государственном оборонном заказе.', rating: '4.6' },
        { category: 'goz', title: 'Гособоронзаказ. Эксперты', link: 'https://psb-academy.ru/education/241', description: 'Программа предназначена для обучения сотрудников, задействованных в ГОЗ.', rating: '4.9' },

        // Финансовая грамотность
        { category: 'finance', title: 'Управление личным бюджетом', link: 'https://psb-academy.ru/education/168', description: 'Научитесь управлять личным бюджетом: планирование, учёт, оптимизация расходов.', rating: '4.7' },
        { category: 'finance', title: 'Инвестиции в искусство', link: 'https://psb-academy.ru/education/121', description: 'Курс об инвестициях в предметы искусства.', rating: '4.5' },
        { category: 'finance', title: 'Управление финансовым благополучием сотрудников', link: 'https://psb-academy.ru/education/276', description: 'Программа повышения финансовой грамотности сотрудников.', rating: '4.6' },
        { category: 'finance', title: 'Основы финансов для нефинансистов', link: 'https://psb-academy.ru/education/95', description: 'Базовые знания о финансах для специалистов из других областей.', rating: '4.8' },
        { category: 'finance', title: 'Финансовая грамотность и личный бюджет', link: 'https://psb-academy.ru/education/346', description: 'Основы финансовой грамотности и управления личным бюджетом.', rating: '4.7' },

        // Цифровые навыки
        { category: 'digital', title: 'Креативное мышление', link: 'https://psb-academy.ru/education/160', description: 'Развивайте креативное мышление и учитесь генерировать идеи.', rating: '4.6' },

        // Управление проектами
        { category: 'projects', title: 'Маркетинг продукта', link: 'https://psb-academy.ru/education/164', description: 'Как разрабатывать и продвигать продукт на рынке.', rating: '4.7' },
        { category: 'projects', title: 'Управление цифровым продуктом', link: 'https://psb-academy.ru/education/165', description: 'Курс по управлению цифровыми продуктами: стратегия, метрики, команда.', rating: '4.5' },
        { category: 'projects', title: 'Процессное (бережливое) управление в государственном секторе', link: 'https://psb-academy.ru/education/154', description: 'Внедрение бережливого управления в государственном секторе.', rating: '4.6' },
        { category: 'projects', title: 'Управление командой и коммуникациями проекта', link: 'https://psb-academy.ru/education/161', description: 'Эффективное управление командой проекта и коммуникациями.', rating: '4.8' },
        { category: 'projects', title: 'Основы гибридного управления проектами', link: 'https://psb-academy.ru/education/302', description: 'Гибридные методологии управления проектами.', rating: '4.7' },

        // Управленческие навыки
        { category: 'management', title: 'Стратегия продаж: от разработки до реализации', link: 'https://psb-academy.ru/education/173', description: 'Разработка и реализация стратегии продаж.', rating: '4.8' },
        { category: 'management', title: 'Коммерческое предложение и работа с отказами', link: 'https://psb-academy.ru/education/174', description: 'Как составить коммерческое предложение и работать с отказами клиентов.', rating: '4.6' },
        { category: 'management', title: 'Формирование эффективной команды', link: 'https://psb-academy.ru/education/175', description: 'Как собрать и мотивировать эффективную команду.', rating: '4.7' },

        // Бизнес-игры
        { category: 'games', title: 'Бизнес-игра "Включайся в проект"', link: 'https://psb-academy.ru/education/303', description: 'Интерактивная бизнес-игра по управлению проектами.', rating: '4.9' },
        { category: 'games', title: 'Финансово-деловая игра «Время денег»', link: 'https://psb-academy.ru/education/319', description: 'Игра для развития финансовой грамотности.', rating: '4.8' },
    ];

    // =============================================
    // === ЛОГИН ===
    // =============================================
    const loginScreen = document.getElementById('loginScreen');
    const adminContainer = document.getElementById('adminContainer');
    const loginForm = document.getElementById('loginForm');
    const loginRole = document.getElementById('loginRole');
    const loginPassword = document.getElementById('loginPassword');
    const loginError = document.getElementById('loginError');
    const roleBadge = document.getElementById('roleBadge');

    // --- Helper: get effective password for a role (custom or default) ---
    function getPassword(role) {
        const custom = JSON.parse(localStorage.getItem('adminCustomPasswords') || '{}');
        if (custom[role]) return custom[role];
        return ACCOUNTS[role] ? ACCOUNTS[role].password : null;
    }

    const savedRole = sessionStorage.getItem('adminRole');
    if (savedRole && ACCOUNTS[savedRole]) {
        currentRole = savedRole;
        loginScreen.style.display = 'none';
        adminContainer.style.display = 'block';
        applyRole();
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const role = loginRole.value;
        const pass = loginPassword.value;
        if (!role || !ACCOUNTS[role]) { loginError.style.display = 'block'; return; }
        if (getPassword(role) !== pass) {
            loginError.style.display = 'block';
            loginPassword.value = '';
            loginPassword.focus();
            return;
        }
        currentRole = role;
        sessionStorage.setItem('adminRole', role);
        loginScreen.style.display = 'none';
        adminContainer.style.display = 'block';
        loginError.style.display = 'none';
        applyRole();
        loadEvents();
        updateStats();
        updateNotifications();
    });

    document.getElementById('btnLogout').addEventListener('click', () => {
        sessionStorage.removeItem('adminRole');
        currentRole = null;
        adminContainer.style.display = 'none';
        loginScreen.style.display = 'flex';
        loginForm.reset();
        selectedItems.clear();
        updateBulkBar();
    });

    // Кнопка «К календарю»: при встраивании в app.html — переключаем вкладку родителя
    const btnBackToCalendar = document.querySelector('a[href="index.html"]');
    if (btnBackToCalendar) {
        btnBackToCalendar.addEventListener('click', function(e) {
            if (window.parent !== window) {
                try {
                    if (window.parent.switchToCalendar) {
                        e.preventDefault();
                        window.parent.switchToCalendar();
                    }
                } catch (_) {}
            }
        });
    }

    function applyRole() {
        if (!currentRole) return;
        const acc = ACCOUNTS[currentRole];
        roleBadge.textContent = acc.label;

        const catSelect = document.getElementById('eventCategory');
        const editCatSelect = document.getElementById('editEventCategory');

        if (currentRole !== 'admin') {
            // Ограничиваем категории
            const allowed = acc.categories;
            [catSelect, editCatSelect].forEach(sel => {
                Array.from(sel.options).forEach(opt => {
                    if (!opt.value) return; // placeholder
                    opt.style.display = allowed.includes(opt.value) ? '' : 'none';
                });
            });
            // Если одна категория — выбрать автоматически
            if (allowed.length === 1) {
                catSelect.value = allowed[0];
                catSelect.disabled = true;
            }
        } else {
            [catSelect, editCatSelect].forEach(sel => {
                Array.from(sel.options).forEach(opt => opt.style.display = '');
            });
            catSelect.disabled = false;
        }
    }

    function canSeeCategory(cat) {
        if (!currentRole) return false;
        const acc = ACCOUNTS[currentRole];
        if (acc.categories[0] === 'all') return true;
        return acc.categories.includes(cat);
    }

    // =============================================
    // === ТЁМНАЯ ТЕМА ===
    // =============================================
    const btnThemeToggle = document.getElementById('btnThemeToggle');
    const savedTheme = localStorage.getItem('adminDarkTheme');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-theme');
        btnThemeToggle.textContent = '☀️';
    }
    btnThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('adminDarkTheme', isDark);
        btnThemeToggle.textContent = isDark ? '☀️' : '🌙';
    });

    // =============================================
    // === ЭЛЕМЕНТЫ ===
    // =============================================
    const form = document.getElementById('addEventForm');
    const list = document.getElementById('eventsList');
    const clearBtn = document.getElementById('clearAll');
    const dateTagsWrapper = document.getElementById('dateTagsWrapper');
    const addDateRowBtn = document.getElementById('addDateRowBtn');
    const eventDateInput = document.getElementById('eventDate');
    const eventImageFile = document.getElementById('eventImageFile');
    const eventImageUrl = document.getElementById('eventImageUrl');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removePreviewBtn = document.getElementById('removePreview');
    const duplicateHint = document.getElementById('duplicateHint');
    const searchInput = document.getElementById('searchInput');
    const monthFilter = document.getElementById('monthFilter');
    const sortSelect = document.getElementById('sortSelect');
    const emptyState = document.getElementById('emptyState');
    const btnExport = document.getElementById('btnExport');
    const importFile = document.getElementById('importFile');
    const eventsCounter = document.getElementById('eventsCounter');

    const monthGenitive = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

    // =============================================
    // === TOAST С UNDO ===
    // =============================================
    let toastTimeout = null;
    let undoCallback = null;

    function toast(message, type = 'success', undoFn = null) {
        const el = document.getElementById('toast');
        const textEl = document.getElementById('toastText');
        const undoBtn = document.getElementById('toastUndo');
        if (toastTimeout) clearTimeout(toastTimeout);
        textEl.textContent = message;
        el.className = `toast toast-${type} toast-visible`;
        if (undoFn) { undoCallback = undoFn; undoBtn.style.display = 'inline-block'; }
        else { undoCallback = null; undoBtn.style.display = 'none'; }
        toastTimeout = setTimeout(() => { el.className = 'toast'; undoCallback = null; undoBtn.style.display = 'none'; }, undoFn ? 5000 : 3000);
    }

    document.getElementById('toastUndo').addEventListener('click', () => {
        if (undoCallback) { undoCallback(); undoCallback = null; }
        document.getElementById('toast').className = 'toast';
        document.getElementById('toastUndo').style.display = 'none';
        if (toastTimeout) clearTimeout(toastTimeout);
    });

    // =============================================
    // === IMAGE HELPERS ===
    // =============================================
    function compressImage(file, maxWidth = 1200, quality = 0.8) {
        return new Promise((resolve, reject) => {
            if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) { reject(new Error('Неподдерживаемый формат')); return; }
            if (file.size > MAX_IMAGE_SIZE) { reject(new Error('Изображение больше 2 МБ')); return; }
            const img = new Image(); const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
            img.onload = () => { let w = img.width, h = img.height; if (w > maxWidth) { h = (h*maxWidth)/w; w = maxWidth; } canvas.width=w; canvas.height=h; ctx.drawImage(img,0,0,w,h); resolve(canvas.toDataURL('image/jpeg',quality)); };
            img.onerror = () => reject(new Error('Ошибка загрузки'));
            img.src = URL.createObjectURL(file);
        });
    }

    function showPreview(src) { if (!src) { imagePreview.style.display='none'; return; } previewImg.src=src; imagePreview.style.display='block'; }

    eventImageFile.addEventListener('change', (e) => { const f=e.target.files[0]; if(!f){showPreview(null);return;} if(f.size>MAX_IMAGE_SIZE){toast('Изображение больше 2 МБ','error');e.target.value='';return;} const r=new FileReader(); r.onload=(ev)=>showPreview(ev.target.result); r.readAsDataURL(f); });
    eventImageUrl.addEventListener('input', () => { const u=eventImageUrl.value.trim(); if(u&&u.startsWith('http'))showPreview(u);else showPreview(null); });
    removePreviewBtn.addEventListener('click', () => { eventImageFile.value=''; eventImageUrl.value=''; showPreview(null); });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => { document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const tab=btn.dataset.tab; document.getElementById('imageFileBlock').style.display=tab==='file'?'block':'none'; document.getElementById('imageUrlBlock').style.display=tab==='url'?'block':'none'; if(tab==='file')eventImageUrl.value='';else eventImageFile.value=''; showPreview(null); });
    });

    eventDateInput.addEventListener('change', checkDuplicate);
    function checkDuplicate() { const key=getKeyFromDateInput(); if(!key){duplicateHint.style.display='none';return;} const db=JSON.parse(localStorage.getItem('calendarEvents'))||{}; const ex=db[key]; if(ex){const arr=Array.isArray(ex)?ex:[ex]; duplicateHint.style.display='block'; duplicateHint.textContent=`На эту дату уже ${arr.length} событие(й). Будет добавлено ещё одно.`;} else duplicateHint.style.display='none'; }
    function getKeyFromDateInput() { const v=eventDateInput.value; if(!v)return null; const d=new Date(v); return `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`; }

    // === DATE ROWS ===
    addDateRowBtn.addEventListener('click', () => addDateRow());
    function addDateRow(data=null) {
        const div=document.createElement('div'); div.className='date-row';
        div.innerHTML=`<div class="date-row-field"><label>Дата начала</label><input type="date" class="date-start" value="${data?.start||''}"></div><div class="date-row-field"><label>Дата окончания</label><input type="date" class="date-end" value="${data?.end||''}"></div><button type="button" class="btn-remove-row">×</button>`;
        div.querySelector('.btn-remove-row').addEventListener('click',()=>div.remove());
        dateTagsWrapper.appendChild(div);
    }
    function formatDateRu(s){if(!s)return"";const d=new Date(s);return`${d.getDate()} ${monthGenitive[d.getMonth()]}`;}

    // =============================================
    // === ВЫБОР КУРСА С САЙТА ===
    // =============================================
    const coursePickerBackdrop = document.getElementById('coursePickerBackdrop');
    const courseList = document.getElementById('courseList');
    const courseSearch = document.getElementById('courseSearch');

    document.getElementById('btnPickCourse').addEventListener('click', () => {
        renderCoursePicker();
        coursePickerBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
        courseSearch.value = '';
        courseSearch.focus();
    });

    document.getElementById('coursePickerClose').addEventListener('click', closePicker);
    coursePickerBackdrop.addEventListener('click', (e) => { if (e.target === coursePickerBackdrop) closePicker(); });
    function closePicker() { coursePickerBackdrop.classList.remove('open'); document.body.style.overflow = ''; }

    courseSearch.addEventListener('input', renderCoursePicker);

    function renderCoursePicker() {
        const q = courseSearch.value.trim().toLowerCase();
        const acc = ACCOUNTS[currentRole];
        const allowedCats = acc.categories[0] === 'all' ? Object.keys(CATEGORY_LABELS) : acc.categories;

        let filtered = COURSE_CATALOG.filter(c => allowedCats.includes(c.category));
        if (q) filtered = filtered.filter(c => c.title.toLowerCase().includes(q));

        // Group by category
        const groups = {};
        filtered.forEach(c => {
            if (!groups[c.category]) groups[c.category] = [];
            groups[c.category].push(c);
        });

        let html = '';
        if (filtered.length === 0) {
            html = '<div class="course-empty">Курсы не найдены</div>';
        } else {
            for (const cat in groups) {
                html += `<div class="course-group-label">${CATEGORY_LABELS[cat] || cat}</div>`;
                groups[cat].forEach((c, i) => {
                    html += `<div class="course-item" data-cat="${c.category}" data-idx="${COURSE_CATALOG.indexOf(c)}">
                        <div class="course-item-title">${c.title}</div>
                        <div class="course-item-meta">${c.description.substring(0, 80)}${c.description.length > 80 ? '...' : ''}</div>
                    </div>`;
                });
            }
        }
        courseList.innerHTML = html;

        // Attach click
        courseList.querySelectorAll('.course-item').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.idx);
                const course = COURSE_CATALOG[idx];
                if (!course) return;

                document.getElementById('eventTitle').value = course.title;
                document.getElementById('eventDesc').value = course.description || '';
                document.getElementById('eventRating').value = course.rating || '4.8';
                document.getElementById('eventLink').value = course.link || '';
                document.getElementById('eventCategory').value = course.category;

                closePicker();
                toast('Курс «' + course.title + '» загружен. Можно редактировать.');
                saveDraft();
            });
        });
    }

    // =============================================
    // === EDIT MODAL ===
    // =============================================
    const editModalBackdrop = document.getElementById('editModalBackdrop');
    const editEventForm = document.getElementById('editEventForm');
    const editKeyInput = document.getElementById('editKey');
    const editIndexInput = document.getElementById('editIndex');
    const editDateTagsWrapper = document.getElementById('editDateTagsWrapper');
    const editEventDate = document.getElementById('editEventDate');
    const editEventTitle = document.getElementById('editEventTitle');
    const editEventRating = document.getElementById('editEventRating');
    const editEventLink = document.getElementById('editEventLink');
    const editEventDesc = document.getElementById('editEventDesc');
    const editEventCategory = document.getElementById('editEventCategory');
    const editEventImageFile = document.getElementById('editEventImageFile');
    const editEventImageUrl = document.getElementById('editEventImageUrl');
    const editImagePreview = document.getElementById('editImagePreview');
    const editPreviewImg = document.getElementById('editPreviewImg');

    function showEditPreview(src){if(!src){editImagePreview.style.display='none';return;}editPreviewImg.src=src;editImagePreview.style.display='block';}

    function addEditDateRow(data=null) {
        const div=document.createElement('div'); div.className='date-row';
        div.innerHTML=`<div class="date-row-field"><label>Дата начала</label><input type="date" class="date-start" value="${data?.start||''}"></div><div class="date-row-field"><label>Дата окончания</label><input type="date" class="date-end" value="${data?.end||''}"></div><button type="button" class="btn-remove-row">×</button>`;
        div.querySelector('.btn-remove-row').addEventListener('click',()=>div.remove());
        editDateTagsWrapper.appendChild(div);
    }
    document.getElementById('editAddDateRowBtn').addEventListener('click',()=>addEditDateRow());

    document.querySelectorAll('.edit-tab-btn').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.edit-tab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const tab=btn.dataset.tab;document.getElementById('editImageFileBlock').style.display=tab==='file'?'block':'none';document.getElementById('editImageUrlBlock').style.display=tab==='url'?'block':'none';if(tab==='file')editEventImageUrl.value='';else editEventImageFile.value='';showEditPreview(null);});});

    editEventImageFile.addEventListener('change',(e)=>{const f=e.target.files[0];if(!f){showEditPreview(null);return;}if(f.size>MAX_IMAGE_SIZE){toast('Изображение больше 2 МБ','error');e.target.value='';return;}const r=new FileReader();r.onload=(ev)=>showEditPreview(ev.target.result);r.readAsDataURL(f);});
    editEventImageUrl.addEventListener('input',()=>{const u=editEventImageUrl.value.trim();if(u&&u.startsWith('http'))showEditPreview(u);else showEditPreview(null);});
    document.getElementById('editRemovePreview').addEventListener('click',()=>{editEventImageFile.value='';editEventImageUrl.value='';showEditPreview(null);});

    function openEditModal(){editModalBackdrop.classList.add('open');document.body.style.overflow='hidden';}
    function closeEditModal(){editModalBackdrop.classList.remove('open');document.body.style.overflow='';}
    document.getElementById('editModalClose').addEventListener('click',closeEditModal);
    document.getElementById('editModalCancel').addEventListener('click',closeEditModal);
    editModalBackdrop.addEventListener('click',(e)=>{if(e.target===editModalBackdrop)closeEditModal();});

    function parseRuToDate(ruStr){if(!ruStr)return'';const cl=String(ruStr).replace(/^(с|до)\s+/i,'').trim();const m=cl.match(/(\d+)\s+(\S+)/);if(!m)return'';const mn=m[2].toLowerCase();const mi=monthGenitive.findIndex(x=>x.toLowerCase()===mn);if(mi<0)return'';const y=new Date().getFullYear();return`${y}-${String(mi+1).padStart(2,'0')}-${String(parseInt(m[1])).padStart(2,'0')}`;}

    window.editEvent = function(key, index=0) {
        const db=JSON.parse(localStorage.getItem('calendarEvents'))||{};
        let events=db[key]; if(!events)return; if(!Array.isArray(events))events=[events];
        const event=events[index]; if(!event)return;

        const [day,month,year]=key.split('-').map(Number);
        const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

        editKeyInput.value=key; editIndexInput.value=String(index);
        editEventDate.value=dateStr; editEventTitle.value=event.title;
        editEventDesc.value=event.description||''; editEventRating.value=event.rating||'5.0';
        editEventLink.value=event.link||''; editEventCategory.value=event.category||'';

        editDateTagsWrapper.innerHTML='';
        if(event.dateTags&&event.dateTags.length){event.dateTags.forEach(t=>{const start=t.line1?.replace('с ','');const end=t.line2?.replace('до ','');addEditDateRow({start:parseRuToDate(start),end:parseRuToDate(end)});});}else addEditDateRow();

        editEventImageFile.value=''; editEventImageUrl.value='';
        if(event.image){if(event.image.startsWith('http')){editEventImageUrl.value=event.image;document.querySelector('.edit-tab-btn[data-tab="url"]').click();showEditPreview(event.image);}else{document.querySelector('.edit-tab-btn[data-tab="file"]').click();showEditPreview(event.image);}}else{showEditPreview(null);document.querySelector('.edit-tab-btn[data-tab="file"]').click();}

        openEditModal();
    };

    editEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dateInput=editEventDate.value; const title=editEventTitle.value.trim();
        const desc=editEventDesc.value.trim(); const rating=editEventRating.value;
        const link=editEventLink.value.trim(); const category=editEventCategory.value;

        if(!dateInput||!title||!category){toast('Заполните все обязательные поля','error');return;}
        if(link&&!/^https?:\/\//.test(link)){toast('Введите корректную ссылку','error');return;}

        const dateRows=editDateTagsWrapper.querySelectorAll('.date-row'); const dateTags=[];
        dateRows.forEach(row=>{const s=row.querySelector('.date-start').value;const en=row.querySelector('.date-end').value;if(s&&en)dateTags.push({line1:`с ${formatDateRu(s)}`,line2:`до ${formatDateRu(en)}`});else if(s)dateTags.push({line1:`с ${formatDateRu(s)}`,line2:''});});

        let imageBase64=null;
        const activeTab=document.querySelector('.edit-tab-btn.active').dataset.tab;
        if(activeTab==='url'){const url=editEventImageUrl.value.trim();if(url&&url.startsWith('http'))imageBase64=url;}
        else if(editEventImageFile.files&&editEventImageFile.files[0]){try{imageBase64=await compressImage(editEventImageFile.files[0]);}catch(err){toast(err.message,'error');return;}}
        else if(editPreviewImg.src&&editPreviewImg.src.startsWith('http'))imageBase64=editPreviewImg.src;
        else if(editPreviewImg.src&&editPreviewImg.src.startsWith('data:'))imageBase64=editPreviewImg.src;

        const dateObj=new Date(dateInput); const key=`${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`;
        const newEvent={title,description:desc,rating:rating||'5.0',link:link||'#',dateTags,category,image:imageBase64||'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop'};

        let db=JSON.parse(localStorage.getItem('calendarEvents'))||{};
        const editKey=editKeyInput.value; const editIdx=parseInt(editIndexInput.value,10);
        if(editKey===key){let arr=db[key];if(!Array.isArray(arr))arr=[arr];arr[editIdx]=newEvent;db[key]=arr;}
        else{let oldArr=db[editKey];if(!Array.isArray(oldArr))oldArr=[oldArr];oldArr.splice(editIdx,1);if(oldArr.length===0)delete db[editKey];else db[editKey]=oldArr;const ex=db[key];if(ex){const arr=Array.isArray(ex)?[...ex,newEvent]:[ex,newEvent];db[key]=arr;}else db[key]=[newEvent];}

        localStorage.setItem('calendarEvents',JSON.stringify(db));
        addActivityLog('edit', title);
        addNotification('edit', title);
        toast('Событие обновлено'); closeEditModal(); loadEvents(); updateStats();
    });

    // =============================================
    // === SAVE (create) ===
    // =============================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dateInput=eventDateInput.value;
        const title=document.getElementById('eventTitle').value.trim();
        const desc=document.getElementById('eventDesc').value.trim();
        const rating=document.getElementById('eventRating').value;
        const link=document.getElementById('eventLink').value.trim();
        const category=document.getElementById('eventCategory').value;

        if(!dateInput||!title||!category){toast('Заполните дату, название и категорию','error');return;}
        if(link&&!/^https?:\/\//.test(link)){toast('Введите корректную ссылку','error');return;}

        const dateRows=dateTagsWrapper.querySelectorAll('.date-row'); const dateTags=[];
        dateRows.forEach(row=>{const s=row.querySelector('.date-start').value;const en=row.querySelector('.date-end').value;if(s&&en)dateTags.push({line1:`с ${formatDateRu(s)}`,line2:`до ${formatDateRu(en)}`});else if(s)dateTags.push({line1:`с ${formatDateRu(s)}`,line2:''});});

        let imageBase64=null;
        const activeTab=document.querySelector('.tab-btn.active').dataset.tab;
        if(activeTab==='url'){const url=eventImageUrl.value.trim();if(url&&url.startsWith('http'))imageBase64=url;}
        else if(eventImageFile.files&&eventImageFile.files[0]){try{imageBase64=await compressImage(eventImageFile.files[0]);}catch(err){toast(err.message,'error');return;}}

        const dateObj=new Date(dateInput); const key=`${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`;
        const newEvent={title,description:desc,rating:rating||'5.0',link:link||'#',dateTags,category,image:imageBase64||'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop'};

        let db=JSON.parse(localStorage.getItem('calendarEvents'))||{};
        const ex=db[key]; if(ex){const arr=Array.isArray(ex)?[...ex,newEvent]:[ex,newEvent];db[key]=arr;}else db[key]=[newEvent];

        localStorage.setItem('calendarEvents',JSON.stringify(db));
        addActivityLog('create', title);
        addNotification('create', title);
        toast('Событие сохранено'); clearDraft(); form.reset(); dateTagsWrapper.innerHTML=''; addDateRow(); showPreview(null);
        eventImageFile.value=''; eventImageUrl.value=''; duplicateHint.style.display='none';
        applyRole(); // восстановить locked category
        loadEvents();
        updateStats();
    });

    // =============================================
    // === LOAD & RENDER ===
    // =============================================
    function getEventsForList() {
        const db=JSON.parse(localStorage.getItem('calendarEvents'))||{};
        const items=[];
        for(const key in db){let events=db[key];if(!Array.isArray(events))events=[events];events.forEach((ev,idx)=>items.push({key,index:idx,event:ev}));}
        return items;
    }

    function loadEvents() {
        let items=getEventsForList();

        // Фильтрация по роли
        if (currentRole && currentRole !== 'admin') {
            const allowed = ACCOUNTS[currentRole].categories;
            items = items.filter(i => allowed.includes(i.event.category));
        }

        const search=searchInput.value.trim().toLowerCase();
        const month=monthFilter.value;
        const sort=sortSelect.value;
        if(search)items=items.filter(i=>i.event.title.toLowerCase().includes(search));
        if(month!=='')items=items.filter(i=>parseInt(i.key.split('-')[1],10)===parseInt(month,10));

        if(sort==='date'){items.sort((a,b)=>{const[da,ma,ya]=a.key.split('-').map(Number);const[db2,mb,yb]=b.key.split('-').map(Number);return new Date(ya,ma,da)-new Date(yb,mb,db2);});}
        else if(sort==='title'){items.sort((a,b)=>a.event.title.localeCompare(b.event.title,'ru'));}
        else if(sort==='rating'){items.sort((a,b)=>parseFloat(b.event.rating||0)-parseFloat(a.event.rating||0));}

        list.innerHTML='';
        emptyState.style.display=items.length===0?'flex':'none';

        const totalAll=getEventsForList().length;
        const totalVisible=items.length;
        eventsCounter.textContent = totalAll > 0 ? (currentRole === 'admin' ? `Всего: ${totalAll}` : `Ваших: ${totalVisible} из ${totalAll}`) : '';

        items.forEach(({key,index,event})=>{
            const [day,month,year]=key.split('-').map(Number);
            const displayDate=`${day}.${month+1}.${year}`;
            const thumb=event.image&&(event.image.startsWith('data')||event.image.startsWith('http'))?event.image:'';
            const catLabel=CATEGORY_LABELS[event.category]||'';
            const itemId=`${key}__${index}`;

            const li=document.createElement('li'); li.className='event-item';
            li.innerHTML=`
                <input type="checkbox" class="event-checkbox" data-id="${itemId}" ${selectedItems.has(itemId)?'checked':''}>
                <div class="event-item-thumb" style="${thumb?`background-image:url('${thumb}')`:''}"></div>
                <div class="event-item-info">
                    <strong>${event.title}</strong>
                    <div class="event-item-meta">${displayDate} · ★${event.rating}${catLabel?' · '+catLabel:''}</div>
                </div>
                <div class="event-item-actions">
                    <button class="btn-edit" onclick="editEvent('${key}',${index})">Изменить</button>
                    <button class="btn-copy" onclick="duplicateEvent('${key}',${index})">Копировать</button>
                    <button class="btn-template" onclick="saveAsTemplate('${key}',${index})">💾 Шаблон</button>
                    <button class="btn-delete" onclick="deleteEvent('${key}',${index})">Удалить</button>
                </div>`;

            // Checkbox listener
            const cb = li.querySelector('.event-checkbox');
            cb.addEventListener('change', () => {
                if (cb.checked) selectedItems.add(itemId);
                else selectedItems.delete(itemId);
                updateBulkBar();
            });

            list.appendChild(li);
        });
    }

    // === DUPLICATE ===
    window.duplicateEvent = function(key,index=0){
        const db=JSON.parse(localStorage.getItem('calendarEvents'))||{};
        let events=db[key];if(!events)return;if(!Array.isArray(events))events=[events];
        const event=events[index];if(!event)return;
        const copy=JSON.parse(JSON.stringify(event)); copy.title+=' (копия)';
        if(Array.isArray(db[key]))db[key].push(copy);else db[key]=[db[key],copy];
        localStorage.setItem('calendarEvents',JSON.stringify(db));
        addActivityLog('duplicate', event.title);
        toast('Событие скопировано');loadEvents();updateStats();
    };

    // === DELETE WITH UNDO ===
    window.deleteEvent = function(key,index=0){
        const db=JSON.parse(localStorage.getItem('calendarEvents'))||{};
        let events=db[key];if(!events)return;if(!Array.isArray(events))events=[events];
        const deleted=JSON.parse(JSON.stringify(events[index]));const title=deleted?.title||'Без названия';
        if(events.length>1){events.splice(index,1);db[key]=events;}else delete db[key];
        localStorage.setItem('calendarEvents',JSON.stringify(db));
        addActivityLog('delete', title);
        addNotification('delete', title);
        loadEvents();updateStats();
        toast(`«${title}» удалено`,'error',()=>{const dbNow=JSON.parse(localStorage.getItem('calendarEvents'))||{};if(dbNow[key]){const arr=Array.isArray(dbNow[key])?dbNow[key]:[dbNow[key]];arr.splice(index,0,deleted);dbNow[key]=arr;}else dbNow[key]=[deleted];localStorage.setItem('calendarEvents',JSON.stringify(dbNow));loadEvents();updateStats();toast('Восстановлено');});
    };

    clearBtn.addEventListener('click',()=>{const allData=localStorage.getItem('calendarEvents');if(!allData||allData==='{}')return;if(!confirm('Удалить ВСЕ события?'))return;const backup=allData;localStorage.removeItem('calendarEvents');addActivityLog('clear','Все события');loadEvents();updateStats();toast('Все удалены','error',()=>{localStorage.setItem('calendarEvents',backup);loadEvents();updateStats();toast('Восстановлено');});});

    searchInput.addEventListener('input',loadEvents);
    monthFilter.addEventListener('change',loadEvents);
    sortSelect.addEventListener('change',loadEvents);

    // === EXPORT / IMPORT ===
    btnExport.addEventListener('click',()=>{const db=localStorage.getItem('calendarEvents')||'{}';const blob=new Blob([db],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`calendar-events-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);toast('Экспортировано');});
    importFile.addEventListener('change',(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{try{const data=JSON.parse(ev.target.result);if(typeof data!=='object')throw 0;localStorage.setItem('calendarEvents',JSON.stringify(data));addActivityLog('import','Импорт файла');loadEvents();updateStats();toast('Импортировано');}catch(err){toast('Ошибка: неверный JSON','error');}e.target.value='';};r.readAsText(f);});

    // =============================================
    // === ESCAPE KEY HANDLER ===
    // =============================================
    document.addEventListener('keydown',(e)=>{
        if(e.key==='Escape'){
            if(coursePickerBackdrop.classList.contains('open'))closePicker();
            else if(editModalBackdrop.classList.contains('open'))closeEditModal();
            else if(document.getElementById('logModalBackdrop').classList.contains('open'))closeLogModal();
            else if(document.getElementById('previewModalBackdrop').classList.contains('open'))closePreviewModal();
            else if(document.getElementById('templatePickerBackdrop').classList.contains('open'))closeTemplatePicker();
            else if(document.getElementById('passwordModalBackdrop').classList.contains('open'))closePasswordModal();
            else if(document.getElementById('notificationsDropdown').style.display==='block')document.getElementById('notificationsDropdown').style.display='none';
        }
    });

    // =============================================
    // === АВТОСОХРАНЕНИЕ ЧЕРНОВИКА ===
    // =============================================
    const DRAFT_KEY='adminFormDraft';
    function saveDraft(){
        const draft={date:eventDateInput.value,title:document.getElementById('eventTitle').value,desc:document.getElementById('eventDesc').value,rating:document.getElementById('eventRating').value,link:document.getElementById('eventLink').value,imageUrl:eventImageUrl.value,category:document.getElementById('eventCategory').value};
        const rows=dateTagsWrapper.querySelectorAll('.date-row');draft.dateRows=[];rows.forEach(row=>{draft.dateRows.push({start:row.querySelector('.date-start').value,end:row.querySelector('.date-end').value});});
        localStorage.setItem(DRAFT_KEY,JSON.stringify(draft));
    }
    function loadDraft(){
        const raw=localStorage.getItem(DRAFT_KEY);if(!raw)return;
        try{const d=JSON.parse(raw);if(d.date)eventDateInput.value=d.date;if(d.title)document.getElementById('eventTitle').value=d.title;if(d.desc)document.getElementById('eventDesc').value=d.desc;if(d.rating)document.getElementById('eventRating').value=d.rating;if(d.link)document.getElementById('eventLink').value=d.link;if(d.category)document.getElementById('eventCategory').value=d.category;if(d.imageUrl){eventImageUrl.value=d.imageUrl;document.querySelector('.tab-btn[data-tab="url"]').click();showPreview(d.imageUrl);}if(d.dateRows&&d.dateRows.length){dateTagsWrapper.innerHTML='';d.dateRows.forEach(r=>addDateRow({start:r.start,end:r.end}));}if(d.date||d.title)toast('Черновик восстановлен');}catch(e){}
    }
    function clearDraft(){localStorage.removeItem(DRAFT_KEY);}

    [eventDateInput,document.getElementById('eventTitle'),document.getElementById('eventDesc'),document.getElementById('eventRating'),document.getElementById('eventLink'),eventImageUrl,document.getElementById('eventCategory')].forEach(f=>{f.addEventListener('input',saveDraft);f.addEventListener('change',saveDraft);});
    dateTagsWrapper.addEventListener('input',saveDraft);
    dateTagsWrapper.addEventListener('change',saveDraft);

    // =============================================
    // === FEATURE 1: DASHBOARD STATS ===
    // =============================================
    function updateStats() {
        // Stats bar removed from UI, function kept as stub
    }

    // =============================================
    // === FEATURE 2: MASS OPERATIONS (BULK) ===
    // =============================================
    const selectedItems = new Set();
    const bulkActionBar = document.getElementById('bulkActionBar');
    const bulkSelectAll = document.getElementById('bulkSelectAll');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const bulkCancelBtn = document.getElementById('bulkCancelBtn');
    const bulkCount = document.getElementById('bulkCount');

    function updateBulkBar() {
        const count = selectedItems.size;
        bulkCount.textContent = count;
        bulkActionBar.style.display = count > 0 ? 'flex' : 'none';
        // Sync select all checkbox
        const allCheckboxes = list.querySelectorAll('.event-checkbox');
        bulkSelectAll.checked = allCheckboxes.length > 0 && count === allCheckboxes.length;
    }

    bulkSelectAll.addEventListener('change', () => {
        const allCheckboxes = list.querySelectorAll('.event-checkbox');
        allCheckboxes.forEach(cb => {
            cb.checked = bulkSelectAll.checked;
            if (bulkSelectAll.checked) selectedItems.add(cb.dataset.id);
            else selectedItems.delete(cb.dataset.id);
        });
        updateBulkBar();
    });

    bulkCancelBtn.addEventListener('click', () => {
        selectedItems.clear();
        list.querySelectorAll('.event-checkbox').forEach(cb => cb.checked = false);
        updateBulkBar();
    });

    bulkDeleteBtn.addEventListener('click', () => {
        if (selectedItems.size === 0) return;
        if (!confirm(`Удалить ${selectedItems.size} событий?`)) return;

        let db = JSON.parse(localStorage.getItem('calendarEvents')) || {};
        const backup = JSON.stringify(db);
        const deletedCount = selectedItems.size;

        // Group by key
        const byKey = {};
        selectedItems.forEach(id => {
            const [key, idx] = id.split('__');
            if (!byKey[key]) byKey[key] = [];
            byKey[key].push(parseInt(idx, 10));
        });

        // Delete in reverse index order to not shift indices
        for (const key in byKey) {
            let events = db[key];
            if (!events) continue;
            if (!Array.isArray(events)) events = [events];
            const indices = byKey[key].sort((a, b) => b - a);
            indices.forEach(idx => events.splice(idx, 1));
            if (events.length === 0) delete db[key];
            else db[key] = events;
        }

        localStorage.setItem('calendarEvents', JSON.stringify(db));
        addActivityLog('delete', `Массовое удаление (${deletedCount})`);
        selectedItems.clear();
        updateBulkBar();
        loadEvents();
        updateStats();

        toast(`Удалено ${deletedCount} событий`, 'error', () => {
            localStorage.setItem('calendarEvents', backup);
            loadEvents();
            updateStats();
            toast('Восстановлено');
        });
    });

    // =============================================
    // === FEATURE 3: ACTIVITY LOG ===
    // =============================================
    const LOG_ICONS = {
        create: '➕', edit: '✏️', delete: '🗑', duplicate: '📋', import: '📤', clear: '🧹'
    };

    function addActivityLog(action, title) {
        const log = JSON.parse(localStorage.getItem('adminActivityLog') || '[]');
        log.unshift({
            action,
            title,
            role: currentRole || 'unknown',
            timestamp: Date.now()
        });
        // Keep only last 200 entries
        if (log.length > 200) log.length = 200;
        localStorage.setItem('adminActivityLog', JSON.stringify(log));
    }

    const logModalBackdrop = document.getElementById('logModalBackdrop');
    function openLogModal() { logModalBackdrop.classList.add('open'); document.body.style.overflow = 'hidden'; renderLogList(); }
    function closeLogModal() { logModalBackdrop.classList.remove('open'); document.body.style.overflow = ''; }

    document.getElementById('btnActivityLog').addEventListener('click', openLogModal);
    document.getElementById('logModalClose').addEventListener('click', closeLogModal);
    logModalBackdrop.addEventListener('click', (e) => { if (e.target === logModalBackdrop) closeLogModal(); });

    function renderLogList() {
        const log = JSON.parse(localStorage.getItem('adminActivityLog') || '[]');
        const logList = document.getElementById('logList');
        const logEmpty = document.getElementById('logEmpty');
        const entries = log.slice(0, 50);

        if (entries.length === 0) {
            logList.innerHTML = '';
            logEmpty.style.display = 'block';
            return;
        }
        logEmpty.style.display = 'none';

        const actionLabels = {
            create: 'Создание', edit: 'Редактирование', delete: 'Удаление',
            duplicate: 'Копирование', import: 'Импорт', clear: 'Очистка'
        };

        logList.innerHTML = entries.map(entry => {
            const d = new Date(entry.timestamp);
            const time = d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            const icon = LOG_ICONS[entry.action] || '📝';
            const label = actionLabels[entry.action] || entry.action;
            const roleLabel = ACCOUNTS[entry.role] ? ACCOUNTS[entry.role].label : entry.role;
            return `<div class="log-entry">
                <div class="log-entry-icon">${icon}</div>
                <div class="log-entry-body">
                    <div class="log-entry-desc"><strong>${label}:</strong> ${entry.title}</div>
                    <div class="log-entry-meta">${time} · ${roleLabel}</div>
                </div>
            </div>`;
        }).join('');
    }

    // =============================================
    // === FEATURE 4: CARD PREVIEW ===
    // =============================================
    const previewModalBackdrop = document.getElementById('previewModalBackdrop');
    function openPreviewModal() { previewModalBackdrop.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closePreviewModal() { previewModalBackdrop.classList.remove('open'); document.body.style.overflow = ''; }

    document.getElementById('previewModalClose').addEventListener('click', closePreviewModal);
    previewModalBackdrop.addEventListener('click', (e) => { if (e.target === previewModalBackdrop) closePreviewModal(); });

    document.getElementById('btnPreviewCard').addEventListener('click', () => {
        const title = document.getElementById('eventTitle').value.trim() || 'Название курса';
        const desc = document.getElementById('eventDesc').value.trim() || 'Описание курса...';
        const rating = document.getElementById('eventRating').value || '5.0';
        const link = document.getElementById('eventLink').value.trim() || '#';

        // Image
        let imgSrc = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop';
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab && activeTab.dataset.tab === 'url') {
            const u = eventImageUrl.value.trim();
            if (u && u.startsWith('http')) imgSrc = u;
        } else if (previewImg.src && (previewImg.src.startsWith('data:') || previewImg.src.startsWith('http'))) {
            if (imagePreview.style.display !== 'none') imgSrc = previewImg.src;
        }

        // Cell demo
        document.getElementById('previewCellDemo').innerHTML = `
            <img class="pcd-img" src="${imgSrc}" alt="" onerror="this.src='https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop'">
            <div class="pcd-title">${title}</div>
        `;

        // Modal demo
        document.getElementById('previewModalDemo').innerHTML = `
            <img class="pmd-img" src="${imgSrc}" alt="" onerror="this.src='https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop'">
            <div class="pmd-content">
                <div class="pmd-title">${title}</div>
                <div class="pmd-rating">★ ${rating}</div>
                <p class="pmd-desc">${desc.substring(0, 150)}${desc.length > 150 ? '...' : ''}</p>
                <a class="pmd-btn" href="${link}" target="_blank" onclick="event.preventDefault()">Записаться</a>
            </div>
        `;

        openPreviewModal();
    });

    // =============================================
    // === FEATURE 5: EVENT TEMPLATES ===
    // =============================================
    function getTemplates() {
        return JSON.parse(localStorage.getItem('eventTemplates') || '[]');
    }
    function saveTemplates(templates) {
        localStorage.setItem('eventTemplates', JSON.stringify(templates));
    }

    window.saveAsTemplate = function(key, index = 0) {
        const db = JSON.parse(localStorage.getItem('calendarEvents') || '{}');
        let events = db[key]; if (!events) return; if (!Array.isArray(events)) events = [events];
        const event = events[index]; if (!event) return;

        const templates = getTemplates();
        const tmpl = JSON.parse(JSON.stringify(event));
        delete tmpl.dateTags; // don't save dates in template
        tmpl._templateName = event.title;
        tmpl._templateDate = Date.now();
        templates.unshift(tmpl);
        saveTemplates(templates);
        toast('Шаблон сохранён: «' + event.title + '»');
    };

    const templatePickerBackdrop = document.getElementById('templatePickerBackdrop');
    function openTemplatePicker() { templatePickerBackdrop.classList.add('open'); document.body.style.overflow = 'hidden'; renderTemplateList(); }
    function closeTemplatePicker() { templatePickerBackdrop.classList.remove('open'); document.body.style.overflow = ''; }

    document.getElementById('btnPickTemplate').addEventListener('click', openTemplatePicker);
    document.getElementById('templatePickerClose').addEventListener('click', closeTemplatePicker);
    templatePickerBackdrop.addEventListener('click', (e) => { if (e.target === templatePickerBackdrop) closeTemplatePicker(); });

    function renderTemplateList() {
        const templates = getTemplates();
        const templateList = document.getElementById('templateList');
        const templateEmpty = document.getElementById('templateEmpty');

        if (templates.length === 0) {
            templateList.innerHTML = '';
            templateEmpty.style.display = 'block';
            return;
        }
        templateEmpty.style.display = 'none';

        templateList.innerHTML = templates.map((t, i) => {
            const catLabel = CATEGORY_LABELS[t.category] || '';
            return `<div class="template-item" data-idx="${i}">
                <div class="template-item-info">
                    <div class="template-item-title">${t._templateName || t.title}</div>
                    <div class="template-item-meta">${catLabel} · ★${t.rating || '5.0'}</div>
                </div>
                <button class="template-item-delete" data-delidx="${i}" title="Удалить шаблон">×</button>
            </div>`;
        }).join('');

        // Delete template
        templateList.querySelectorAll('.template-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.delidx, 10);
                const templates = getTemplates();
                templates.splice(idx, 1);
                saveTemplates(templates);
                renderTemplateList();
                toast('Шаблон удалён');
            });
        });

        // Select template
        templateList.querySelectorAll('.template-item').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.idx, 10);
                const templates = getTemplates();
                const t = templates[idx];
                if (!t) return;

                document.getElementById('eventTitle').value = t.title || '';
                document.getElementById('eventDesc').value = t.description || '';
                document.getElementById('eventRating').value = t.rating || '4.8';
                document.getElementById('eventLink').value = t.link || '';
                document.getElementById('eventCategory').value = t.category || '';

                if (t.image && t.image.startsWith('http')) {
                    eventImageUrl.value = t.image;
                    const urlTab = document.querySelector('.tab-btn[data-tab="url"]');
                    if (urlTab) urlTab.click();
                    showPreview(t.image);
                }

                closeTemplatePicker();
                toast('Шаблон «' + (t._templateName || t.title) + '» применён');
                saveDraft();
            });
        });
    }

    // =============================================
    // === FEATURE 6: NOTIFICATIONS BETWEEN ROLES ===
    // =============================================
    function addNotification(action, title) {
        const notifs = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        notifs.unshift({
            id: Date.now() + '_' + Math.random().toString(36).slice(2, 8),
            role: currentRole || 'unknown',
            action,
            title,
            timestamp: Date.now(),
            readBy: []
        });
        if (notifs.length > 100) notifs.length = 100;
        localStorage.setItem('adminNotifications', JSON.stringify(notifs));
        updateNotifications();
    }

    function updateNotifications() {
        if (!currentRole) return;
        const notifs = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        const badge = document.getElementById('notifBadge');
        const unread = notifs.filter(n => n.role !== currentRole && !n.readBy.includes(currentRole));
        if (unread.length > 0) {
            badge.textContent = unread.length > 99 ? '99+' : unread.length;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    function renderNotifications() {
        const notifs = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        const notifList = document.getElementById('notifList');
        const notifEmpty = document.getElementById('notifEmpty');
        // Show last 30 from OTHER roles
        const others = notifs.filter(n => n.role !== currentRole).slice(0, 30);

        if (others.length === 0) {
            notifList.innerHTML = '';
            notifEmpty.style.display = 'block';
            return;
        }
        notifEmpty.style.display = 'none';

        const actionLabels = {
            create: 'создал(а)', edit: 'отредактировал(а)', delete: 'удалил(а)'
        };

        notifList.innerHTML = others.map(n => {
            const d = new Date(n.timestamp);
            const time = d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
            const roleLabel = ACCOUNTS[n.role] ? ACCOUNTS[n.role].label : n.role;
            const actionLabel = actionLabels[n.action] || n.action;
            const isUnread = !n.readBy.includes(currentRole);
            return `<div class="notif-item${isUnread ? ' unread' : ''}">
                <strong>${roleLabel}</strong> ${actionLabel} «${n.title}»
                <div class="notif-item-time">${time}</div>
            </div>`;
        }).join('');
    }

    function markNotificationsRead() {
        if (!currentRole) return;
        const notifs = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        let changed = false;
        notifs.forEach(n => {
            if (n.role !== currentRole && !n.readBy.includes(currentRole)) {
                n.readBy.push(currentRole);
                changed = true;
            }
        });
        if (changed) {
            localStorage.setItem('adminNotifications', JSON.stringify(notifs));
            updateNotifications();
        }
    }

    const notificationsDropdown = document.getElementById('notificationsDropdown');
    document.getElementById('btnNotifications').addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = notificationsDropdown.style.display === 'block';
        notificationsDropdown.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) {
            renderNotifications();
            markNotificationsRead();
        }
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!document.getElementById('notificationsWrapper').contains(e.target)) {
            notificationsDropdown.style.display = 'none';
        }
    });

    // =============================================
    // === FEATURE 7: CHANGE PASSWORD ===
    // =============================================
    const passwordModalBackdrop = document.getElementById('passwordModalBackdrop');
    function openPasswordModal() { passwordModalBackdrop.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closePasswordModal() { passwordModalBackdrop.classList.remove('open'); document.body.style.overflow = ''; document.getElementById('changePasswordForm').reset(); }

    document.getElementById('btnChangePassword').addEventListener('click', openPasswordModal);
    document.getElementById('passwordModalClose').addEventListener('click', closePasswordModal);
    document.getElementById('passwordModalCancel').addEventListener('click', closePasswordModal);
    passwordModalBackdrop.addEventListener('click', (e) => { if (e.target === passwordModalBackdrop) closePasswordModal(); });

    document.getElementById('changePasswordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const current = document.getElementById('cpCurrentPass').value;
        const newPass = document.getElementById('cpNewPass').value;
        const confirm2 = document.getElementById('cpConfirmPass').value;

        if (!currentRole) return;
        if (getPassword(currentRole) !== current) {
            toast('Текущий пароль неверный', 'error');
            return;
        }
        if (newPass.length < 3) {
            toast('Новый пароль слишком короткий', 'error');
            return;
        }
        if (newPass !== confirm2) {
            toast('Пароли не совпадают', 'error');
            return;
        }

        const custom = JSON.parse(localStorage.getItem('adminCustomPasswords') || '{}');
        custom[currentRole] = newPass;
        localStorage.setItem('adminCustomPasswords', JSON.stringify(custom));

        toast('Пароль успешно изменён');
        closePasswordModal();
    });

    // =============================================
    // === INIT ===
    // =============================================
    loadDraft();
    if(!dateTagsWrapper.querySelector('.date-row'))addDateRow();
    loadEvents();
    updateStats();
    updateNotifications();
});
