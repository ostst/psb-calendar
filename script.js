// === CATEGORY CONSTANTS ===
const CATEGORY_COLORS = {
    goz: '#1B5E20',
    finance: '#E65100',
    digital: '#1565C0',
    projects: '#6A1B9A',
    management: '#C62828',
    business: '#00838F',
    personal: '#F9A825',
    games: '#AD1457'
};

const CATEGORY_LABELS = {
    goz: 'ГОЗ и ОПК',
    finance: 'Финансовая грамотность',
    digital: 'Цифровые навыки',
    projects: 'Управление проектами',
    management: 'Менеджмент',
    business: 'Бизнес',
    personal: 'Личное развитие',
    games: 'Игры'
};

const FILTER_TABS = [
    { label: 'Все', categories: null },
    { label: 'ГОЗ и ОПК', categories: ['goz'] },
    { label: 'Финансовая грамотность', categories: ['finance'] },
    { label: 'Цифровые навыки', categories: ['digital'] },
    { label: 'Управление проектами', categories: ['projects'] },
    { label: 'Остальное', categories: ['projects', 'management', 'business', 'personal', 'games'] }
];

document.addEventListener('DOMContentLoaded', () => {
    // === ЭЛЕМЕНТЫ ===
    const grid = document.getElementById('calendarGrid');
    const monthDisplay = document.getElementById('monthDisplay');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const btnToday = document.getElementById('btnToday');
    const btnIcal = document.getElementById('btnIcal'); // removed from UI
    const filterTabsContainer = document.getElementById('filterTabs');
    const eventCounterEl = document.getElementById('eventCounter');
    const listView = document.getElementById('listView');
    const calendarGridContainer = document.getElementById('calendarGridContainer');
    const viewToggle = document.getElementById('viewToggle');

    // Модалка события
    const eventModal = document.getElementById('eventModal');
    const eventBackdrop = document.getElementById('modalBackdrop');

    // Внутренности модалки
    const modalTitle = eventModal.querySelector('.modal-title');
    const modalDesc = eventModal.querySelector('.modal-desc');
    const modalImg = document.getElementById('modalImage');
    const modalRating = document.getElementById('modalRating');
    const modalLinkBtn = document.getElementById('modalLinkBtn');
    const tagsContainer = document.getElementById('dateTagsContainer');
    const modalNav = document.getElementById('modalNav');
    const modalNavText = document.getElementById('modalNavText');
    const modalPrevBtn = document.getElementById('modalPrev');
    const modalNextBtn = document.getElementById('modalNext');
    // Share button removed

    let modalCurrentKey = '';
    let modalCurrentIndex = 0;

    // Настройки (версия для слабовидящих)
    const accessModal = document.getElementById('accessBackdrop');
    const btnEye = document.getElementById('btnEye');
    const closeAccessBtn = document.getElementById('closeAccess');
    const btnReset = document.getElementById('btnResetAccess') || document.querySelector('.btn-reset');
    const fontRadios = document.querySelectorAll('input[name="font"]');
    const themeRadios = document.querySelectorAll('input[name="theme"]');

    const navItems = document.querySelectorAll('.nav-item');

    // === СОСТОЯНИЕ ===
    let currentDate = new Date();
    let activeFilter = null; // null = показать всё
    let currentView = localStorage.getItem('calendarView') || 'grid';

    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const monthNamesGenitive = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

    // === ДАННЫЕ ===
    let eventsDB = {};
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
        const raw = JSON.parse(storedEvents);
        for (const k in raw) {
            eventsDB[k] = Array.isArray(raw[k]) ? raw[k] : [raw[k]];
        }
    } else {
        const t = new Date();
        const todayKey = `${t.getDate()}-${t.getMonth()}-${t.getFullYear()}`;
        const defaultImage = "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop";
        eventsDB = {};
        eventsDB[todayKey] = [{
            title: "Гособоронзаказ. Эксперты",
            image: defaultImage,
            description: "Программа предназначена для обучения сотрудников, задействованных в гособоронзаказе (ГОЗ).",
            rating: "4.8",
            link: "#",
            dateTags: [
                { line1: "с 17 июня", line2: "до 27 июня" },
                { line1: "с 9 сентября", line2: "до 19 сентября" }
            ],
            category: "goz"
        }];
        localStorage.setItem('calendarEvents', JSON.stringify(eventsDB));
    }

    // === ФИЛЬТРАЦИЯ ===
    function eventMatchesFilter(eventData) {
        if (!activeFilter) return true; // "Все"
        if (!eventData.category) return true; // события без категории видны всегда
        return activeFilter.includes(eventData.category);
    }

    // === ФИЛЬТР-ТАБЫ ===
    function buildFilterTabs() {
        filterTabsContainer.innerHTML = '';
        FILTER_TABS.forEach((tab, idx) => {
            const btn = document.createElement('button');
            btn.className = 'filter-tab' + (idx === 0 ? ' active' : '');
            btn.textContent = tab.label;
            btn.dataset.index = idx;
            btn.addEventListener('click', () => {
                filterTabsContainer.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilter = tab.categories;
                renderCurrentView();
            });
            filterTabsContainer.appendChild(btn);
        });
    }
    buildFilterTabs();

    // === СЧЁТЧИК СОБЫТИЙ ЗА МЕСЯЦ ===
    function countEventsInMonth(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let count = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const key = `${day}-${month}-${year}`;
            const arr = eventsDB[key];
            if (arr) {
                arr.forEach(ev => {
                    if (eventMatchesFilter(ev)) count++;
                });
            }
        }
        return count;
    }

    function updateEventCounter() {
        const count = countEventsInMonth(currentDate);
        let word;
        const lastTwo = count % 100;
        const lastOne = count % 10;
        if (lastTwo >= 11 && lastTwo <= 19) word = 'событий';
        else if (lastOne === 1) word = 'событие';
        else if (lastOne >= 2 && lastOne <= 4) word = 'события';
        else word = 'событий';
        eventCounterEl.textContent = `В этом месяце: ${count} ${word}`;
    }

    // === РЕНДЕР КАЛЕНДАРЯ (СЕТКА) ===
    const today = new Date();

    function renderCalendar(date) {
        grid.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();
        monthDisplay.textContent = `${monthNames[month]} ${year}`;

        let firstDayIndex = new Date(year, month, 1).getDay();
        let adjustedFirstDay = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < adjustedFirstDay; i++) {
            const div = document.createElement('div');
            div.className = 'day-cell empty';
            grid.appendChild(div);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell';

            // Подсветка сегодняшнего дня
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cell.classList.add('today');
            }

            const eventKey = `${day}-${month}-${year}`;
            const eventsArr = eventsDB[eventKey];

            // Отфильтрованные события
            let filteredEvents = [];
            if (eventsArr) {
                filteredEvents = eventsArr.filter(ev => eventMatchesFilter(ev));
            }

            const eventData = filteredEvents.length > 0 ? filteredEvents[0] : null;

            if (eventData) {
                cell.classList.add('has-event');
                if (eventData.image) cell.style.backgroundImage = `url('${eventData.image}')`;
            }

            const currentDayOfWeek = new Date(year, month, day).getDay();
            let numColorClass = (currentDayOfWeek === 0 || currentDayOfWeek === 6) ? 'grey' : 'orange';

            let htmlContent = `<span class="date-number ${numColorClass}">${day}</span>`;
            if (eventData) {
                const countBadge = filteredEvents.length > 1 ? `<span class="event-count-badge">${filteredEvents.length}</span>` : '';
                const originalIndex = eventsArr ? eventsArr.indexOf(eventData) : 0;

                // Ссылка «Записаться →»
                let signupHtml = '';
                if (eventData.link && eventData.link !== '#') {
                    signupHtml = `<a href="${eventData.link}" target="_blank" class="btn-signup" onclick="event.stopPropagation()">Записаться →</a>`;
                }

                htmlContent += `
                    <div class="event-info">
                        <div class="event-title">${eventData.title}${countBadge}</div>
                        <button class="btn-details" onclick="openEventModal(this)" data-key="${eventKey}" data-index="${originalIndex}">Подробнее</button>
                        ${signupHtml}
                    </div>
                `;
            }
            cell.innerHTML = htmlContent;

            // Цветная полоска категории (после innerHTML)
            if (eventData && eventData.category && CATEGORY_COLORS[eventData.category]) {
                const strip = document.createElement('div');
                strip.className = 'category-strip';
                strip.style.backgroundColor = CATEGORY_COLORS[eventData.category];
                cell.appendChild(strip);
            }

            // Данные для тултипа
            if (eventData) {
                cell.dataset.tooltipTitle = eventData.title;
                cell.dataset.tooltipRating = eventData.rating || '5.0';
                cell.dataset.tooltipCategory = eventData.category ? (CATEGORY_LABELS[eventData.category] || '') : '';
            }

            grid.appendChild(cell);
        }

        // Добивка
        const totalCells = adjustedFirstDay + daysInMonth;
        const remainingCells = 7 - (totalCells % 7);
        if (remainingCells < 7) {
            for (let i = 0; i < remainingCells; i++) {
                const div = document.createElement('div');
                div.className = 'day-cell empty';
                grid.appendChild(div);
            }
        }

        updateEventCounter();
    }

    // === РЕНДЕР СПИСКА ===
    function renderListView(date) {
        listView.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        monthDisplay.textContent = `${monthNames[month]} ${year}`;

        let hasEvents = false;

        for (let day = 1; day <= daysInMonth; day++) {
            const key = `${day}-${month}-${year}`;
            const eventsArr = eventsDB[key];
            if (!eventsArr) continue;

            const filtered = eventsArr.filter(ev => eventMatchesFilter(ev));
            if (filtered.length === 0) continue;

            hasEvents = true;

            filtered.forEach((ev) => {
                const originalIndex = eventsArr.indexOf(ev);
                const row = document.createElement('div');
                row.className = 'list-event-row';

                const catColor = ev.category && CATEGORY_COLORS[ev.category] ? CATEGORY_COLORS[ev.category] : '#ccc';
                const catLabel = ev.category && CATEGORY_LABELS[ev.category] ? CATEGORY_LABELS[ev.category] : '';

                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                row.innerHTML = `
                    <div class="list-event-color" style="background:${catColor}"></div>
                    <div class="list-event-date ${isToday ? 'list-today' : ''}">${day} ${monthNamesGenitive[month]}</div>
                    <div class="list-event-title">${ev.title}</div>
                    <div class="list-event-rating">★ ${ev.rating || '5.0'}</div>
                    <div class="list-event-category">${catLabel}</div>
                    <button class="btn-details list-btn-details" onclick="openEventModal(this)" data-key="${key}" data-index="${originalIndex}">Подробнее</button>
                `;
                listView.appendChild(row);
            });
        }

        if (!hasEvents) {
            listView.innerHTML = '<div class="list-empty">Нет событий в этом месяце</div>';
        }

        updateEventCounter();
    }

    // === ПЕРЕКЛЮЧЕНИЕ СЕТКА / СПИСОК ===
    function setView(view) {
        currentView = view;
        localStorage.setItem('calendarView', view);

        viewToggle.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        if (view === 'grid') {
            calendarGridContainer.style.display = '';
            listView.style.display = 'none';
            renderCalendar(currentDate);
        } else {
            calendarGridContainer.style.display = 'none';
            listView.style.display = 'block';
            renderListView(currentDate);
        }
    }

    viewToggle.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => setView(btn.dataset.view));
    });

    function renderCurrentView() {
        if (currentView === 'grid') {
            renderCalendar(currentDate);
        } else {
            renderListView(currentDate);
        }
    }

    // Обновление данных из localStorage (когда админка сохраняет в другом iframe/вкладке)
    function refreshFromStorage() {
        const stored = localStorage.getItem('calendarEvents');
        if (!stored) return;
        const raw = JSON.parse(stored);
        eventsDB = {};
        for (const k in raw) {
            eventsDB[k] = Array.isArray(raw[k]) ? raw[k] : [raw[k]];
        }
        renderCurrentView();
    }

    window.addEventListener('storage', function(e) {
        if (e.key === 'calendarEvents') refreshFromStorage();
    });

    // Начальный рендер
    setView(currentView);

    // === НАВИГАЦИЯ ПО МЕСЯЦАМ ===
    prevBtn.addEventListener('click', () => {
        if (currentView === 'grid') {
            grid.classList.add('calendar-slide-out-right');
            setTimeout(() => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar(currentDate);
                grid.classList.remove('calendar-slide-out-right');
                grid.classList.add('calendar-slide-in-left');
                setTimeout(() => grid.classList.remove('calendar-slide-in-left'), 300);
            }, 200);
        } else {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderListView(currentDate);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentView === 'grid') {
            grid.classList.add('calendar-slide-out-left');
            setTimeout(() => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar(currentDate);
                grid.classList.remove('calendar-slide-out-left');
                grid.classList.add('calendar-slide-in-right');
                setTimeout(() => grid.classList.remove('calendar-slide-in-right'), 300);
            }, 200);
        } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderListView(currentDate);
        }
    });

    // === КНОПКА «СЕГОДНЯ» ===
    btnToday.addEventListener('click', () => {
        currentDate = new Date();
        renderCurrentView();
    });

    // === ЭКСПОРТ iCAL ===
    if (btnIcal) btnIcal.addEventListener('click', () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let icsLines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Академия ПСБ//Календарь мероприятий//RU',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        for (let day = 1; day <= daysInMonth; day++) {
            const key = `${day}-${month}-${year}`;
            const arr = eventsDB[key];
            if (!arr) continue;

            arr.forEach((ev, idx) => {
                const dateStr = `${year}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}`;
                const uid = `${dateStr}-${idx}@psb-academy.ru`;
                icsLines.push('BEGIN:VEVENT');
                icsLines.push(`DTSTART;VALUE=DATE:${dateStr}`);
                icsLines.push(`DTEND;VALUE=DATE:${dateStr}`);
                icsLines.push(`SUMMARY:${ev.title}`);
                if (ev.description) icsLines.push(`DESCRIPTION:${ev.description.replace(/\n/g, '\\n')}`);
                if (ev.link && ev.link !== '#') icsLines.push(`URL:${ev.link}`);
                icsLines.push(`UID:${uid}`);
                icsLines.push('END:VEVENT');
            });
        }

        icsLines.push('END:VCALENDAR');

        const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `calendar-${monthNames[month]}-${year}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // === ТУЛТИП ПРИ НАВЕДЕНИИ ===
    let tooltipEl = document.createElement('div');
    tooltipEl.className = 'event-tooltip';
    tooltipEl.style.display = 'none';
    document.body.appendChild(tooltipEl);

    let tooltipTimeout = null;
    let hoveredCell = null;

    grid.addEventListener('mouseover', (e) => {
        if (window.innerWidth < 768) return;
        const cell = e.target.closest('.day-cell.has-event');

        if (cell === hoveredCell) return;

        // Очищаем предыдущий
        clearTimeout(tooltipTimeout);
        tooltipEl.style.display = 'none';
        hoveredCell = null;

        if (!cell || !cell.dataset.tooltipTitle) return;

        hoveredCell = cell;
        tooltipTimeout = setTimeout(() => {
            if (hoveredCell !== cell) return;

            const title = cell.dataset.tooltipTitle;
            const rating = cell.dataset.tooltipRating;
            const category = cell.dataset.tooltipCategory;

            tooltipEl.innerHTML = `
                <div class="tooltip-title">${title}</div>
                <div class="tooltip-meta">
                    <span class="tooltip-rating">★ ${rating}</span>
                    ${category ? `<span class="tooltip-category">${category}</span>` : ''}
                </div>
            `;

            tooltipEl.style.display = 'block';
            const rect = cell.getBoundingClientRect();
            const tooltipRect = tooltipEl.getBoundingClientRect();

            let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
            let top = rect.top - tooltipRect.height - 8;

            if (left < 8) left = 8;
            if (left + tooltipRect.width > window.innerWidth - 8) left = window.innerWidth - tooltipRect.width - 8;
            if (top < 8) top = rect.bottom + 8;

            tooltipEl.style.left = left + 'px';
            tooltipEl.style.top = top + 'px';
        }, 500);
    });

    grid.addEventListener('mouseout', (e) => {
        const cell = e.target.closest('.day-cell.has-event');
        const related = e.relatedTarget;
        if (cell && cell === hoveredCell && (!related || !cell.contains(related))) {
            clearTimeout(tooltipTimeout);
            tooltipEl.style.display = 'none';
            hoveredCell = null;
        }
    });

    grid.addEventListener('mouseleave', () => {
        clearTimeout(tooltipTimeout);
        tooltipEl.style.display = 'none';
        hoveredCell = null;
    });

    // === УМНОЕ ПОЗИЦИОНИРОВАНИЕ МОДАЛКИ ===
    function fillModalWithEvent(eventData) {
        modalTitle.textContent = eventData.title;
        modalDesc.textContent = eventData.description || "Описание отсутствует.";
        modalRating.textContent = eventData.rating || "5.0";
        modalLinkBtn.href = eventData.link || "#";
        if (eventData.image) modalImg.src = eventData.image;
        else modalImg.src = "";

        tagsContainer.innerHTML = '';
        if (eventData.dateTags) {
            eventData.dateTags.forEach((tagData, idx) => {
                const tagEl = document.createElement('div');
                tagEl.className = 'tag';
                if (idx === 0) tagEl.classList.add('active');
                tagEl.innerHTML = `<span>${tagData.line1}</span><span>${tagData.line2}</span>`;
                tagEl.addEventListener('click', () => {
                    tagsContainer.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
                    tagEl.classList.add('active');
                });
                tagsContainer.appendChild(tagEl);
            });
        }
    }

    window.openEventModal = function(btnElement) {
        const cell = btnElement.closest('.day-cell') || btnElement.closest('.list-event-row');
        const key = btnElement.dataset.key || (() => {
            const dayNum = cell.querySelector('.date-number').textContent;
            return `${dayNum}-${currentDate.getMonth()}-${currentDate.getFullYear()}`;
        })();
        const index = parseInt(btnElement.dataset.index || '0', 10);
        const eventsArr = eventsDB[key];
        const eventData = eventsArr && eventsArr[index];

        if (eventData) {
            modalCurrentKey = key;
            modalCurrentIndex = index;

            fillModalWithEvent(eventData);

            if (eventsArr.length > 1) {
                modalNav.style.display = 'flex';
                modalNavText.textContent = `${index + 1} из ${eventsArr.length}`;
            } else {
                modalNav.style.display = 'none';
            }

            // Показываем прозрачным для расчетов
            eventBackdrop.style.display = 'block';
            eventModal.style.visibility = 'hidden';
            eventModal.style.display = 'block';
            eventModal.classList.remove('modal-animate-in');

            // Вычисляем координаты
            if (window.innerWidth > 768 && cell && cell.classList.contains('day-cell')) {
                const rect = cell.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

                const modalWidth = eventModal.offsetWidth;
                const modalHeight = eventModal.offsetHeight;

                const isRightSide = (rect.left + rect.width / 2) > (window.innerWidth / 2);
                const isBottomSide = (rect.top + rect.height / 2) > (window.innerHeight / 2);

                eventModal.style.top = ''; eventModal.style.left = '';

                if (!isBottomSide && !isRightSide) {
                    eventModal.style.top = (rect.top + scrollTop) + 'px';
                    eventModal.style.left = (rect.left + scrollLeft) + 'px';
                }
                else if (!isBottomSide && isRightSide) {
                    eventModal.style.top = (rect.top + scrollTop) + 'px';
                    eventModal.style.left = (rect.right + scrollLeft - modalWidth) + 'px';
                }
                else if (isBottomSide && !isRightSide) {
                    eventModal.style.top = (rect.bottom + scrollTop - modalHeight) + 'px';
                    eventModal.style.left = (rect.left + scrollLeft) + 'px';
                }
                else if (isBottomSide && isRightSide) {
                    eventModal.style.top = (rect.bottom + scrollTop - modalHeight) + 'px';
                    eventModal.style.left = (rect.right + scrollLeft - modalWidth) + 'px';
                }
            } else {
                eventModal.style.top = ''; eventModal.style.left = '';
            }

            eventModal.style.visibility = 'visible';
            // Анимация появления
            requestAnimationFrame(() => eventModal.classList.add('modal-animate-in'));
        }
    };

    // Программное открытие модалки (для share URL)
    function openModalByKeyAndIndex(key, index) {
        const eventsArr = eventsDB[key];
        if (!eventsArr || !eventsArr[index]) return;
        const eventData = eventsArr[index];

        modalCurrentKey = key;
        modalCurrentIndex = index;
        fillModalWithEvent(eventData);

        if (eventsArr.length > 1) {
            modalNav.style.display = 'flex';
            modalNavText.textContent = `${index + 1} из ${eventsArr.length}`;
        } else {
            modalNav.style.display = 'none';
        }

        eventBackdrop.style.display = 'block';
        eventModal.style.display = 'block';
        eventModal.style.visibility = 'visible';
        eventModal.style.top = '';
        eventModal.style.left = '';
        eventModal.classList.remove('modal-animate-in');
        requestAnimationFrame(() => eventModal.classList.add('modal-animate-in'));
    }

    function closeEventModal() {
        eventBackdrop.style.display = 'none';
        eventModal.style.display = 'none';
    }
    eventBackdrop.addEventListener('click', closeEventModal);

    modalPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const arr = eventsDB[modalCurrentKey];
        if (!arr || modalCurrentIndex <= 0) return;
        modalCurrentIndex--;
        fillModalWithEvent(arr[modalCurrentIndex]);
        modalNavText.textContent = `${modalCurrentIndex + 1} из ${arr.length}`;
    });
    modalNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const arr = eventsDB[modalCurrentKey];
        if (!arr || modalCurrentIndex >= arr.length - 1) return;
        modalCurrentIndex++;
        fillModalWithEvent(arr[modalCurrentIndex]);
        modalNavText.textContent = `${modalCurrentIndex + 1} из ${arr.length}`;
    });

    // === SHARE VIA URL (при загрузке) ===
    function handleShareUrl() {
        const params = new URLSearchParams(window.location.search);
        const dateParam = params.get('date');
        if (!dateParam) return;

        const match = dateParam.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (!match) return;

        const day = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const year = parseInt(match[3]);

        currentDate = new Date(year, month, 1);
        renderCurrentView();

        const key = `${day}-${month}-${year}`;
        if (eventsDB[key] && eventsDB[key].length > 0) {
            setTimeout(() => openModalByKeyAndIndex(key, 0), 400);
        }
    }
    handleShareUrl();

    // === ЗАКРЫТИЕ ПО ESCAPE ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (accessModal.style.display === 'flex') {
                accessModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else if (eventModal.style.display === 'block') {
                closeEventModal();
            }
        }
    });

    // === ОСТАЛЬНОЕ ===
    btnEye.addEventListener('click', () => { accessModal.style.display = 'flex'; document.body.style.overflow = 'hidden'; });
    closeAccessBtn.addEventListener('click', () => { accessModal.style.display = 'none'; document.body.style.overflow = 'auto'; });
    accessModal.addEventListener('click', (e) => { if (e.target === accessModal) { accessModal.style.display = 'none'; document.body.style.overflow = 'auto'; } });

    // Шрифт: Стандартный / Специальный
    fontRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'special') {
                document.body.classList.add('special-font');
            } else {
                document.body.classList.remove('special-font');
            }
        });
    });

    // Тема: Стандартная / Тёмная
    themeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        });
    });

    // Сброс настроек
    function resetAccessibility() {
        document.body.classList.remove('special-font', 'dark-theme');
        fontRadios.forEach(r => { r.checked = (r.value === 'standard'); });
        themeRadios.forEach(r => { r.checked = (r.value === 'standard'); });
    }
    if (btnReset) btnReset.addEventListener('click', resetAccessibility);
    navItems.forEach(item => { item.addEventListener('mouseenter', () => item.classList.add('active')); item.addEventListener('mouseleave', () => item.classList.remove('active')); });

    // === АВТО-СКРЫТИЕ ХЕДЕРА ПРИ СКРОЛЛЕ ===
    const mainHeader = document.getElementById('mainHeader');
    let lastScrollY = 0;
    let headerHidden = false;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 80 && !headerHidden) {
            mainHeader.classList.add('header-hidden');
            headerHidden = true;
        } else if (currentScrollY < lastScrollY && headerHidden) {
            mainHeader.classList.remove('header-hidden');
            headerHidden = false;
        }
        lastScrollY = currentScrollY;
    }, { passive: true });

    // === МОБИЛЬНЫЙ СВАЙП ===
    let touchStartX = 0;
    let touchStartY = 0;
    const swipeThreshold = 50;

    function addSwipeListeners(el) {
        el.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        el.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Только горизонтальный свайп (diffX > diffY)
            if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    nextBtn.click();
                } else {
                    prevBtn.click();
                }
            }
        }, { passive: true });
    }

    addSwipeListeners(calendarGridContainer);
    addSwipeListeners(listView);
});
