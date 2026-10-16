/**
 * RAILLINK - Modern Smart Train Reservation System
 * Interactive Logic, Dynamic Seat Selection & E-Ticket Boarding Pass
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Station Dataset ---
  const STATIONS = [
    { name: '서울', code: 'SEL', cat: 'major' },
    { name: '용산', code: 'YOS', cat: 'major' },
    { name: '수서', code: 'SSO', cat: 'major' },
    { name: '부산', code: 'PUS', cat: 'major' },
    { name: '동대구', code: 'DGD', cat: 'major' },
    { name: '대전', code: 'DJN', cat: 'major' },
    { name: '광주송정', code: 'GJJ', cat: 'major' },
    { name: '강릉', code: 'KNG', cat: 'major' },
    
    // 경부선
    { name: '영등포', code: 'YDP', cat: 'gyeongbu' },
    { name: '수원', code: 'SWN', cat: 'gyeongbu' },
    { name: '천안아산', code: 'CAS', cat: 'gyeongbu' },
    { name: '오송', code: 'OSG', cat: 'gyeongbu' },
    { name: '김천구미', code: 'KCG', cat: 'gyeongbu' },
    { name: '서대구', code: 'SDG', cat: 'gyeongbu' },
    { name: '신경주', code: 'SKJ', cat: 'gyeongbu' },
    { name: '울산', code: 'ULS', cat: 'gyeongbu' },
    { name: '밀양', code: 'MYG', cat: 'gyeongbu' },
    { name: '포항', code: 'POH', cat: 'gyeongbu' },
    
    // 호남 / 전라선
    { name: '서대전', code: 'SDJ', cat: 'honam' },
    { name: '공주', code: 'GJU', cat: 'honam' },
    { name: '익산', code: 'IKS', cat: 'honam' },
    { name: '정읍', code: 'JEU', cat: 'honam' },
    { name: '나주', code: 'NJU', cat: 'honam' },
    { name: '목포', code: 'MPO', cat: 'honam' },
    { name: '전주', code: 'JJU', cat: 'honam' },
    { name: '남원', code: 'NMW', cat: 'honam' },
    { name: '순천', code: 'SCN', cat: 'honam' },
    { name: '여수EXPO', code: 'YSE', cat: 'honam' },

    // 강원 / 동해선
    { name: '청량리', code: 'CLR', cat: 'gangwon' },
    { name: '상봉', code: 'SBG', cat: 'gangwon' },
    { name: '만종', code: 'MJG', cat: 'gangwon' },
    { name: '횡성', code: 'HSG', cat: 'gangwon' },
    { name: '평창', code: 'PCG', cat: 'gangwon' },
    { name: '진부', code: 'JBU', cat: 'gangwon' },
    { name: '동해', code: 'DHE', cat: 'gangwon' },
    { name: '춘천', code: 'CCN', cat: 'gangwon' }
  ];

  // Base train schedule templates
  const SCHEDULE_TEMPLATES = [
    { type: 'ktx', name: 'KTX 015', depHour: 6, depMin: 20, durMin: 135, price: 59800, amenities: ['Wi-Fi', '콘센트', '스낵바'] },
    { type: 'srt', name: 'SRT 309', depHour: 7, depMin: 10, durMin: 132, price: 52600, amenities: ['Wi-Fi', '콘센트', '넓은좌석'] },
    { type: 'ktx', name: 'KTX-산천 023', depHour: 8, depMin: 45, durMin: 140, price: 59800, amenities: ['Wi-Fi', '콘센트', '유아실'] },
    { type: 'itx', name: 'ITX-마음 1103', depHour: 9, depMin: 30, durMin: 210, price: 42600, amenities: ['Wi-Fi', '자판기'] },
    { type: 'ktx', name: 'KTX-이음 041', depHour: 10, depMin: 15, durMin: 138, price: 59800, amenities: ['Wi-Fi', '무선충전', '개별창'] },
    { type: 'srt', name: 'SRT 327', depHour: 11, depMin: 50, durMin: 130, price: 52600, amenities: ['Wi-Fi', '콘센트'] },
    { type: 'mugunghwa', name: '무궁화호 1211', depHour: 12, depMin: 40, durMin: 295, price: 28600, amenities: ['자판기', '화물'] },
    { type: 'ktx', name: 'KTX 053', depHour: 14, depMin: 0, durMin: 142, price: 59800, amenities: ['Wi-Fi', '콘센트'] },
    { type: 'srt', name: 'SRT 345', depHour: 15, depMin: 25, durMin: 134, price: 52600, amenities: ['Wi-Fi', '콘센트'] },
    { type: 'ktx', name: 'KTX-산천 067', depHour: 17, depMin: 10, durMin: 139, price: 59800, amenities: ['Wi-Fi', '콘센트'] },
    { type: 'itx', name: 'ITX-새마을 1025', depHour: 18, depMin: 30, durMin: 220, price: 42600, amenities: ['Wi-Fi', '자판기'] },
    { type: 'ktx', name: 'KTX 089', depHour: 20, depMin: 15, durMin: 136, price: 59800, amenities: ['Wi-Fi', '콘센트'] },
    { type: 'srt', name: 'SRT 381', depHour: 21, depMin: 40, durMin: 133, price: 52600, amenities: ['Wi-Fi', '콘센트'] }
  ];

  // --- App State ---
  const state = {
    depStation: '서울',
    arrStation: '부산',
    travelDate: new Date().toISOString().split('T')[0],
    passengers: {
      adult: 1,
      child: 0,
      senior: 0
    },
    trainFilter: 'all',
    timeFilter: 'all',
    activeModalStationTarget: 'dep', // 'dep' | 'arr'
    activeTrain: null,
    activeFareType: 'standard', // 'standard' | 'first'
    selectedCoach: 2,
    selectedSeats: [], // ['7A', '7B']
    currentHoldingTimer: null,
    holdingTimeLeft: 300, // 5 minutes in seconds
    myTickets: JSON.parse(localStorage.getItem('raillink_tickets') || '[]'),
    theme: localStorage.getItem('raillink_theme') || 'light'
  };

  // --- Theme Initialization ---
  if (state.theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // --- DOM Elements ---
  const tabBookBtn = document.getElementById('tab-book-btn');
  const tabTicketsBtn = document.getElementById('tab-tickets-btn');
  const tabLiveBtn = document.getElementById('tab-live-btn');
  const viewBooking = document.getElementById('view-booking');
  const viewTickets = document.getElementById('view-tickets');
  const viewLive = document.getElementById('view-live');
  const themeToggle = document.getElementById('theme-toggle');
  const headerTicketCount = document.getElementById('header-ticket-count');

  // Search Controls
  const depStationDisplay = document.getElementById('dep-station-display');
  const arrStationDisplay = document.getElementById('arr-station-display');
  const depStationName = document.getElementById('dep-station-name');
  const arrStationName = document.getElementById('arr-station-name');
  const swapStationsBtn = document.getElementById('swap-stations-btn');
  const travelDateInput = document.getElementById('travel-date');
  const travelWeekday = document.getElementById('travel-weekday');
  const passengerTrigger = document.getElementById('passenger-trigger');
  const passengerPopover = document.getElementById('passenger-popover');
  const passengerSummaryText = document.getElementById('passenger-summary-text');
  const searchTrainsForm = document.getElementById('train-search-form');

  // Station Modal
  const stationModal = document.getElementById('station-modal');
  const closeStationModal = document.getElementById('close-station-modal');
  const stationModalTitle = document.getElementById('station-modal-title');
  const stationSearchInput = document.getElementById('station-search-input');
  const stationListContainer = document.getElementById('station-list-container');
  const stationCatPills = document.querySelectorAll('.station-categories .cat-pill');

  // Results & Train List
  const trainListContainer = document.getElementById('train-list');
  const summaryDepName = document.getElementById('summary-dep-name');
  const summaryArrName = document.getElementById('summary-arr-name');
  const summaryDateText = document.getElementById('summary-date-text');
  const summaryPassengerText = document.getElementById('summary-passenger-text');
  const trainCountBadge = document.getElementById('train-count-badge');
  const timeChips = document.querySelectorAll('.time-chip');

  // Seat Drawer
  const seatDrawerOverlay = document.getElementById('seat-drawer-overlay');
  const closeSeatDrawer = document.getElementById('close-seat-drawer');
  const drawerTrainType = document.getElementById('drawer-train-type');
  const drawerTrainRoute = document.getElementById('drawer-train-route');
  const holdingTimerText = document.getElementById('holding-timer-text');
  const coachTabsContainer = document.getElementById('coach-tabs-container');
  const seatsGrid = document.getElementById('seats-grid');
  const selectedSeatsBadge = document.getElementById('selected-seats-badge');
  const totalPriceText = document.getElementById('total-price-text');
  const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');

  // Checkout Modal
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutModal = document.getElementById('close-checkout-modal');
  const payRouteDep = document.getElementById('pay-route-dep');
  const payRouteArr = document.getElementById('pay-route-arr');
  const payTrainInfo = document.getElementById('pay-train-info');
  const payDateInfo = document.getElementById('pay-date-info');
  const payFinalPrice = document.getElementById('pay-final-price');
  const payButtonAmount = document.getElementById('pay-button-amount');
  const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
  const payMethodCards = document.querySelectorAll('.pay-method-card');

  // Boarding Pass Modal
  const ticketModal = document.getElementById('ticket-modal');
  const closeTicketModal = document.getElementById('close-ticket-modal');
  const downloadTicketBtn = document.getElementById('download-ticket-btn');
  const walletBtn = document.getElementById('wallet-btn');
  const viewMyTicketsBtn = document.getElementById('view-my-tickets-btn');

  // Tickets Grid & Live Table
  const myTicketsGrid = document.getElementById('my-tickets-grid');
  const liveTableBody = document.getElementById('live-table-body');
  const toast = document.getElementById('app-toast');

  // --- Helper Functions ---
  const formatKRW = (num) => new Intl.NumberFormat('ko-KR').format(num) + '원';
  
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 2800);
  };

  const updateTicketCount = () => {
    headerTicketCount.textContent = state.myTickets.length;
  };

  const getWeekday = (dateStr) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = new Date(dateStr);
    return `${days[d.getDay()]}요일`;
  };

  const getTotalPassengerCount = () => {
    return state.passengers.adult + state.passengers.child + state.passengers.senior;
  };

  // --- Tab Navigation ---
  const switchView = (targetView) => {
    [viewBooking, viewTickets, viewLive].forEach(el => el.classList.remove('active'));
    [tabBookBtn, tabTicketsBtn, tabLiveBtn].forEach(el => el.classList.remove('active'));

    if (targetView === 'booking') {
      viewBooking.classList.add('active');
      tabBookBtn.classList.add('active');
    } else if (targetView === 'tickets') {
      viewTickets.classList.add('active');
      tabTicketsBtn.classList.add('active');
      renderMyTickets();
    } else if (targetView === 'live') {
      viewLive.classList.add('active');
      tabLiveBtn.classList.add('active');
      renderLiveTrainTable();
    }
  };

  tabBookBtn.addEventListener('click', () => switchView('booking'));
  tabTicketsBtn.addEventListener('click', () => switchView('tickets'));
  tabLiveBtn.addEventListener('click', () => switchView('live'));
  document.getElementById('nav-home-btn').addEventListener('click', () => switchView('booking'));

  // --- Theme Toggle ---
  themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    if (state.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('raillink_theme', state.theme);
    showToast(state.theme === 'dark' ? '다크 모드가 적용되었습니다.' : '라이트 모드가 적용되었습니다.');
  });

  // --- Date Initialization ---
  travelDateInput.value = state.travelDate;
  travelWeekday.textContent = getWeekday(state.travelDate);
  travelDateInput.addEventListener('change', (e) => {
    state.travelDate = e.target.value;
    travelWeekday.textContent = getWeekday(state.travelDate);
  });

  // --- Passenger Stepper Logic ---
  const updatePassengerSummary = () => {
    const parts = [];
    if (state.passengers.adult > 0) parts.push(`성인 ${state.passengers.adult}명`);
    if (state.passengers.child > 0) parts.push(`어린이 ${state.passengers.child}명`);
    if (state.passengers.senior > 0) parts.push(`경로 ${state.passengers.senior}명`);
    passengerSummaryText.textContent = parts.join(', ') || '성인 1명';
    document.getElementById('adult-count').textContent = state.passengers.adult;
    document.getElementById('child-count').textContent = state.passengers.child;
    document.getElementById('senior-count').textContent = state.passengers.senior;
  };

  passengerTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    passengerPopover.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!passengerPopover.contains(e.target) && !passengerTrigger.contains(e.target)) {
      passengerPopover.classList.remove('active');
    }
  });

  document.getElementById('confirm-passengers-btn').addEventListener('click', () => {
    passengerPopover.classList.remove('active');
  });

  document.querySelectorAll('.step-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = btn.dataset.target;
      const isPlus = btn.classList.contains('plus');
      const current = state.passengers[target];

      if (isPlus) {
        if (getTotalPassengerCount() < 9) {
          state.passengers[target]++;
        } else {
          showToast('최대 9명까지 예매 가능합니다.');
        }
      } else {
        if (target === 'adult' && current > 1 && getTotalPassengerCount() > 1) {
          state.passengers[target]--;
        } else if (target !== 'adult' && current > 0) {
          state.passengers[target]--;
        }
      }
      updatePassengerSummary();
    });
  });

  // --- Station Selection Modal ---
  const openStationModal = (type) => {
    state.activeModalStationTarget = type;
    stationModalTitle.textContent = type === 'dep' ? '출발역 선택' : '도착역 선택';
    stationSearchInput.value = '';
    renderStationList('major');
    stationCatPills.forEach(p => p.classList.toggle('active', p.dataset.cat === 'major'));
    stationModal.classList.add('active');
  };

  depStationDisplay.addEventListener('click', () => openStationModal('dep'));
  arrStationDisplay.addEventListener('click', () => openStationModal('arr'));
  closeStationModal.addEventListener('click', () => stationModal.classList.remove('active'));

  stationModal.addEventListener('click', (e) => {
    if (e.target === stationModal) stationModal.classList.remove('active');
  });

  const renderStationList = (category = 'all', query = '') => {
    stationListContainer.innerHTML = '';
    const filtered = STATIONS.filter(st => {
      const matchCat = category === 'all' || st.cat === category;
      const matchQuery = !query || st.name.includes(query) || st.code.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      stationListContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">검색된 역이 없습니다.</div>`;
      return;
    }

    filtered.forEach(st => {
      const btn = document.createElement('div');
      btn.className = 'station-btn';
      btn.innerHTML = `<strong>${st.name}</strong><span>${st.code}</span>`;
      btn.addEventListener('click', () => {
        if (state.activeModalStationTarget === 'dep') {
          if (st.name === state.arrStation) {
            state.arrStation = state.depStation;
            arrStationName.textContent = state.arrStation;
          }
          state.depStation = st.name;
          depStationName.textContent = st.name;
        } else {
          if (st.name === state.depStation) {
            state.depStation = state.arrStation;
            depStationName.textContent = state.depStation;
          }
          state.arrStation = st.name;
          arrStationName.textContent = st.name;
        }
        stationModal.classList.remove('active');
        executeSearch();
      });
      stationListContainer.appendChild(btn);
    });
  };

  stationCatPills.forEach(pill => {
    pill.addEventListener('click', () => {
      stationCatPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderStationList(pill.dataset.cat, stationSearchInput.value.trim());
    });
  });

  stationSearchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    if (q) {
      renderStationList('all', q);
    } else {
      const activeCat = document.querySelector('.station-categories .cat-pill.active').dataset.cat;
      renderStationList(activeCat);
    }
  });

  // Station Swap
  swapStationsBtn.addEventListener('click', () => {
    const temp = state.depStation;
    state.depStation = state.arrStation;
    state.arrStation = temp;
    depStationName.textContent = state.depStation;
    arrStationName.textContent = state.arrStation;
    showToast(`출발역과 도착역이 전환되었습니다: ${state.depStation} ⇄ ${state.arrStation}`);
    executeSearch();
  });

  // Quick Route Chips
  document.querySelectorAll('.route-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state.depStation = chip.dataset.dep;
      state.arrStation = chip.dataset.arr;
      depStationName.textContent = state.depStation;
      arrStationName.textContent = state.arrStation;
      executeSearch();
      showToast(`${state.depStation} ➔ ${state.arrStation} 구간으로 설정되었습니다.`);
    });
  });

  // Radio filters
  document.querySelectorAll('input[name="trainFilter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.trainFilter = e.target.value;
      executeSearch();
    });
  });

  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      timeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.timeFilter = chip.dataset.time;
      executeSearch();
    });
  });

  // --- Train Schedule Generation & Search ---
  const generateTrains = () => {
    const isShortRoute = (state.depStation === '서울' && state.arrStation === '대전') ||
                         (state.depStation === '수서' && state.arrStation === '동대구');
    const factor = isShortRoute ? 0.65 : 1.0;

    return SCHEDULE_TEMPLATES.map((tpl, idx) => {
      const depHourStr = String(tpl.depHour).padStart(2, '0');
      const depMinStr = String(tpl.depMin).padStart(2, '0');
      const dur = Math.round(tpl.durMin * factor);
      const arrTotalMinutes = tpl.depHour * 60 + tpl.depMin + dur;
      const arrHour = Math.floor(arrTotalMinutes / 60) % 24;
      const arrMin = arrTotalMinutes % 60;
      const arrHourStr = String(arrHour).padStart(2, '0');
      const arrMinStr = String(arrMin).padStart(2, '0');

      const durHours = Math.floor(dur / 60);
      const durMins = dur % 60;
      const durationFormatted = `${durHours}시간 ${durMins}분`;

      const standardFare = Math.round((tpl.price * factor) / 100) * 100;
      const firstFare = Math.round((standardFare * 1.4) / 100) * 100;

      // Realistic pseudo-random availability
      const standardSoldOut = idx === 3;
      const standardLowStock = idx === 1 || idx === 5;
      const firstSoldOut = idx === 2;

      return {
        id: `TR-${idx + 1}`,
        type: tpl.type,
        trainName: tpl.name,
        depTime: `${depHourStr}:${depMinStr}`,
        arrTime: `${arrHourStr}:${arrMinStr}`,
        duration: durationFormatted,
        rawDepHour: tpl.depHour,
        standardFare,
        firstFare,
        standardSoldOut,
        standardLowStock,
        firstSoldOut,
        amenities: tpl.amenities
      };
    });
  };

  const executeSearch = () => {
    summaryDepName.textContent = state.depStation;
    summaryArrName.textContent = state.arrStation;
    summaryDateText.textContent = `${state.travelDate}(${getWeekday(state.travelDate)[0]})`;
    summaryPassengerText.textContent = `총 ${getTotalPassengerCount()}명`;

    const allTrains = generateTrains();
    const filtered = allTrains.filter(tr => {
      // Train type filter
      if (state.trainFilter === 'ktx' && !(tr.type === 'ktx' || tr.type === 'srt')) return false;
      if (state.trainFilter === 'itx' && tr.type !== 'itx') return false;
      if (state.trainFilter === 'mugunghwa' && tr.type !== 'mugunghwa') return false;

      // Time filter
      if (state.timeFilter === 'morning' && (tr.rawDepHour < 6 || tr.rawDepHour >= 12)) return false;
      if (state.timeFilter === 'afternoon' && (tr.rawDepHour < 12 || tr.rawDepHour >= 18)) return false;
      if (state.timeFilter === 'evening' && (tr.rawDepHour < 18 || tr.rawDepHour >= 24)) return false;

      return true;
    });

    trainCountBadge.textContent = `조회 결과 ${filtered.length}편`;
    renderTrainCards(filtered);
  };

  const renderTrainCards = (trains) => {
    trainListContainer.innerHTML = '';
    if (trains.length === 0) {
      trainListContainer.innerHTML = `
        <div class="glass-panel" style="text-align: center; padding: 4rem; border-radius: var(--radius-md);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🚆</div>
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.3rem;">조회된 열차가 없습니다</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">시간대나 열차 종류 필터를 변경하여 다시 검색해보세요.</p>
        </div>
      `;
      return;
    }

    trains.forEach(tr => {
      const card = document.createElement('div');
      card.className = 'train-card glass-panel';

      const typeLabel = tr.type.toUpperCase();
      const typeClass = tr.type;

      card.innerHTML = `
        <div class="train-badge-group">
          <span class="train-type-pill ${typeClass}">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            ${typeLabel}
          </span>
          <div class="train-no">${tr.trainName}</div>
          <div class="train-amenities">
            ${tr.amenities.map(a => `<span>#${a}</span>`).join(' ')}
          </div>
        </div>

        <div class="train-schedule-info">
          <div class="schedule-stop">
            <span class="stop-time">${tr.depTime}</span>
            <span class="stop-station">${state.depStation}</span>
          </div>
          <div class="schedule-duration-track">
            <span class="duration-text">${tr.duration}</span>
            <div class="track-line">
              <span class="moving-train">🚅</span>
            </div>
          </div>
          <div class="schedule-stop">
            <span class="stop-time">${tr.arrTime}</span>
            <span class="stop-station">${state.arrStation}</span>
          </div>
        </div>

        <div class="train-booking-options">
          <div class="fare-box ${tr.standardSoldOut ? 'sold-out' : ''}" data-train-id="${tr.id}" data-fare-type="standard">
            <span class="fare-class">일반실</span>
            <span class="fare-price">${formatKRW(tr.standardFare)}</span>
            <span class="fare-status">${tr.standardSoldOut ? '매진' : (tr.standardLowStock ? '🔥 잔여 3석' : '예약가능')}</span>
          </div>
          <div class="fare-box ${tr.firstSoldOut ? 'sold-out' : ''}" data-train-id="${tr.id}" data-fare-type="first">
            <span class="fare-class">특실 / 우등</span>
            <span class="fare-price">${formatKRW(tr.firstFare)}</span>
            <span class="fare-status">${tr.firstSoldOut ? '매진' : '예약가능'}</span>
          </div>
        </div>
      `;

      // Fare Box click triggers interactive seat selector
      card.querySelectorAll('.fare-box:not(.sold-out)').forEach(box => {
        box.addEventListener('click', () => {
          const fareType = box.dataset.fareType;
          openSeatDrawer(tr, fareType);
        });
      });

      trainListContainer.appendChild(card);
    });
  };

  searchTrainsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSearch();
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
  });

  // --- Seat Selection Drawer Logic ---
  const openSeatDrawer = (train, fareType) => {
    state.activeTrain = train;
    state.activeFareType = fareType;
    state.selectedSeats = [];
    state.selectedCoach = fareType === 'first' ? 1 : 2;

    drawerTrainType.textContent = `${train.trainName} (${fareType === 'first' ? '특실' : '일반실'})`;
    drawerTrainRoute.textContent = `${state.depStation} (${train.depTime}) ➔ ${state.arrStation} (${train.arrTime})`;

    renderCoachTabs();
    renderSeatMap();
    updateSeatSelectionSummary();
    startHoldingTimer();

    seatDrawerOverlay.classList.add('active');
  };

  closeSeatDrawer.addEventListener('click', () => {
    seatDrawerOverlay.classList.remove('active');
    clearInterval(state.currentHoldingTimer);
  });

  seatDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === seatDrawerOverlay) {
      seatDrawerOverlay.classList.remove('active');
      clearInterval(state.currentHoldingTimer);
    }
  });

  const startHoldingTimer = () => {
    clearInterval(state.currentHoldingTimer);
    state.holdingTimeLeft = 300; // 5 min
    const updateTimerDisplay = () => {
      const mins = String(Math.floor(state.holdingTimeLeft / 60)).padStart(2, '0');
      const secs = String(state.holdingTimeLeft % 60).padStart(2, '0');
      holdingTimerText.textContent = `선택 제한 ${mins}:${secs}`;
      if (state.holdingTimeLeft <= 0) {
        clearInterval(state.currentHoldingTimer);
        showToast('좌석 선택 가능 시간이 초과되어 초기화되었습니다.');
        seatDrawerOverlay.classList.remove('active');
      }
      state.holdingTimeLeft--;
    };
    updateTimerDisplay();
    state.currentHoldingTimer = setInterval(updateTimerDisplay, 1000);
  };

  const renderCoachTabs = () => {
    coachTabsContainer.innerHTML = '';
    const coaches = [
      { num: 1, label: '1호차 (특실)', isFirst: true },
      { num: 2, label: '2호차 (일반실)', isFirst: false },
      { num: 3, label: '3호차 (유아동반)', isFirst: false },
      { num: 4, label: '4호차 (조용한 객실)', isFirst: false },
      { num: 5, label: '5호차 (일반실)', isFirst: false }
    ];

    coaches.forEach(c => {
      const btn = document.createElement('button');
      btn.className = `coach-tab-btn ${state.selectedCoach === c.num ? 'active' : ''}`;
      btn.textContent = c.label;
      btn.addEventListener('click', () => {
        state.selectedCoach = c.num;
        state.activeFareType = c.isFirst ? 'first' : 'standard';
        state.selectedSeats = [];
        renderCoachTabs();
        renderSeatMap();
        updateSeatSelectionSummary();
      });
      coachTabsContainer.appendChild(btn);
    });
  };

  const renderSeatMap = () => {
    seatsGrid.innerHTML = '';
    const isFirstClass = state.selectedCoach === 1;
    const totalRows = 8;
    const columns = isFirstClass ? ['A', 'B', 'aisle', 'C'] : ['A', 'B', 'aisle', 'C', 'D'];

    for (let row = 1; row <= totalRows; row++) {
      const rowEl = document.createElement('div');
      rowEl.className = 'seat-row';
      if (isFirstClass) {
        rowEl.style.gridTemplateColumns = '1.2fr 1.2fr 40px 1.2fr';
      } else {
        rowEl.style.gridTemplateColumns = '1fr 1fr 40px 1fr 1fr';
      }

      columns.forEach(col => {
        if (col === 'aisle') {
          const aisle = document.createElement('div');
          aisle.className = 'aisle-number';
          aisle.textContent = `${row}열`;
          rowEl.appendChild(aisle);
          return;
        }

        const seatId = `${row}${col}`;
        const isReserved = (row === 2 && col === 'A') || (row === 4 && (col === 'C' || col === 'D')) || (row === 6 && col === 'B');
        const isSelected = state.selectedSeats.includes(seatId);

        const seatBtn = document.createElement('div');
        seatBtn.className = `seat-item ${isReserved ? 'reserved' : ''} ${isSelected ? 'selected' : ''}`;
        
        let positionTag = '창측';
        if (col === 'B' || col === 'C') positionTag = isFirstClass ? '내측' : '통로';
        if (col === 'A' || col === 'D') positionTag = '창측';

        seatBtn.innerHTML = `
          <span class="seat-code">${seatId}</span>
          <span class="seat-tag">${positionTag}</span>
        `;

        if (!isReserved) {
          seatBtn.addEventListener('click', () => {
            const maxSeats = getTotalPassengerCount();
            if (state.selectedSeats.includes(seatId)) {
              state.selectedSeats = state.selectedSeats.filter(s => s !== seatId);
            } else {
              if (state.selectedSeats.length >= maxSeats) {
                state.selectedSeats.shift(); // replace oldest selection
              }
              state.selectedSeats.push(seatId);
            }
            renderSeatMap();
            updateSeatSelectionSummary();
          });
        }

        rowEl.appendChild(seatBtn);
      });

      seatsGrid.appendChild(rowEl);
    }
  };

  const calculateTotalFare = () => {
    if (!state.activeTrain) return 0;
    const basePrice = state.activeFareType === 'first' ? state.activeTrain.firstFare : state.activeTrain.standardFare;
    
    const adultTotal = state.passengers.adult * basePrice;
    const childTotal = state.passengers.child * Math.round(basePrice * 0.5);
    const seniorTotal = state.passengers.senior * Math.round(basePrice * 0.7);
    return adultTotal + childTotal + seniorTotal;
  };

  const updateSeatSelectionSummary = () => {
    const totalRequired = getTotalPassengerCount();
    const currentCount = state.selectedSeats.length;

    if (currentCount === 0) {
      selectedSeatsBadge.textContent = `좌석 ${totalRequired}개를 선택해주세요`;
      totalPriceText.textContent = '0원';
      proceedCheckoutBtn.disabled = true;
    } else {
      selectedSeatsBadge.textContent = `${state.selectedCoach}호차 ${state.selectedSeats.join(', ')} (${currentCount}/${totalRequired}석)`;
      const total = calculateTotalFare();
      totalPriceText.textContent = formatKRW(total);
      proceedCheckoutBtn.disabled = currentCount < totalRequired;
    }
  };

  // --- Proceed to Checkout ---
  proceedCheckoutBtn.addEventListener('click', () => {
    seatDrawerOverlay.classList.remove('active');
    openCheckoutModal();
  });

  const openCheckoutModal = () => {
    payRouteDep.textContent = state.depStation;
    payRouteArr.textContent = state.arrStation;
    payTrainInfo.textContent = `${state.activeTrain.trainName} (${state.selectedCoach}호차 ${state.selectedSeats.join(', ')})`;
    payDateInfo.textContent = `${state.travelDate}(${getWeekday(state.travelDate)[0]}) ${state.activeTrain.depTime} ~ ${state.activeTrain.arrTime}`;
    
    const total = calculateTotalFare();
    payFinalPrice.textContent = formatKRW(total);
    payButtonAmount.textContent = formatKRW(total);

    checkoutModal.classList.add('active');
  };

  closeCheckoutModal.addEventListener('click', () => checkoutModal.classList.remove('active'));
  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) checkoutModal.classList.remove('active');
  });

  payMethodCards.forEach(card => {
    card.addEventListener('click', () => {
      payMethodCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      card.querySelector('input').checked = true;
    });
  });

  // --- Confirm Payment & Issue Boarding Pass ---
  confirmPaymentBtn.addEventListener('click', () => {
    const custName = document.getElementById('cust-name').value.trim() || '홍길동';
    const custPhone = document.getElementById('cust-phone').value.trim() || '010-0000-0000';
    const ticketNo = `84${Math.floor(10 + Math.random() * 90)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = {
      id: 'TKT-' + Date.now(),
      ticketNo,
      owner: custName,
      phone: custPhone,
      depStation: state.depStation,
      arrStation: state.arrStation,
      travelDate: state.travelDate,
      depTime: state.activeTrain.depTime,
      arrTime: state.activeTrain.arrTime,
      duration: state.activeTrain.duration,
      trainName: state.activeTrain.trainName,
      coach: `${state.selectedCoach}호차`,
      seats: state.selectedSeats.join(', '),
      classType: state.activeFareType === 'first' ? '특실' : '일반실',
      price: calculateTotalFare(),
      bookedAt: new Date().toLocaleString('ko-KR')
    };

    // Save ticket
    state.myTickets.unshift(newTicket);
    localStorage.setItem('raillink_tickets', JSON.stringify(state.myTickets));
    updateTicketCount();

    // Close checkout and display Boarding Pass
    checkoutModal.classList.remove('active');
    clearInterval(state.currentHoldingTimer);
    displayBoardingPass(newTicket);
    showToast('승차권 결제 및 발권이 완료되었습니다!');
  });

  const displayBoardingPass = (ticket) => {
    document.getElementById('ticket-card-train').textContent = ticket.trainName;
    document.getElementById('ticket-card-dep').textContent = ticket.depStation;
    document.getElementById('ticket-card-arr').textContent = ticket.arrStation;
    document.getElementById('ticket-card-deptime').textContent = ticket.depTime;
    document.getElementById('ticket-card-arrtime').textContent = ticket.arrTime;
    document.getElementById('ticket-card-depdate').textContent = ticket.travelDate;
    document.getElementById('ticket-card-arrdate').textContent = ticket.travelDate;
    document.getElementById('ticket-card-duration').textContent = ticket.duration;
    document.getElementById('ticket-card-class').textContent = ticket.classType;
    document.getElementById('ticket-card-car').textContent = ticket.coach;
    document.getElementById('ticket-card-seats').textContent = ticket.seats;
    document.getElementById('ticket-card-owner').textContent = ticket.owner;
    document.getElementById('ticket-card-no').textContent = ticket.ticketNo;

    ticketModal.classList.add('active');
  };

  closeTicketModal.addEventListener('click', () => ticketModal.classList.remove('active'));
  ticketModal.addEventListener('click', (e) => {
    if (e.target === ticketModal) ticketModal.classList.remove('active');
  });

  downloadTicketBtn.addEventListener('click', () => {
    window.print();
  });

  walletBtn.addEventListener('click', () => {
    showToast('Apple 지갑 (.pkpass) 등록이 요청되었습니다.');
  });

  viewMyTicketsBtn.addEventListener('click', () => {
    ticketModal.classList.remove('active');
    switchView('tickets');
  });

  // --- My Tickets Tab Render ---
  const renderMyTickets = () => {
    myTicketsGrid.innerHTML = '';
    if (state.myTickets.length === 0) {
      myTicketsGrid.innerHTML = `
        <div class="empty-ticket-state">
          <div class="empty-icon">🎟️</div>
          <h3 class="empty-title">예약된 승차권이 없습니다</h3>
          <p class="empty-desc">새로운 기차 여행 일정을 검색하고 실시간으로 좌석을 예매해 보세요.</p>
          <button class="btn-primary-large" style="max-width: 200px; margin: 0 auto;" onclick="document.getElementById('tab-book-btn').click()">
            열차 예매하기
          </button>
        </div>
      `;
      return;
    }

    state.myTickets.forEach((ticket, idx) => {
      const card = document.createElement('div');
      card.className = 'saved-ticket-card glass-panel';
      card.innerHTML = `
        <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: #fff; padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 0.75rem; color: #94a3b8;">${ticket.travelDate} 탑승</span>
            <h4 style="font-size: 1.15rem; font-weight: 800;">${ticket.trainName}</h4>
          </div>
          <span style="background: #10b981; color: #fff; font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px;">탑승 확정</span>
        </div>
        <div style="padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <span style="font-size: 1.4rem; font-weight: 800;">${ticket.depStation}</span>
              <span style="display: block; font-size: 0.85rem; color: var(--primary); font-weight: 700;">${ticket.depTime}</span>
            </div>
            <div style="text-align: center; color: var(--text-muted); font-size: 0.75rem;">
              <span>${ticket.duration}</span>
              <div style="color: var(--primary); font-size: 1.1rem;">➔</div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 1.4rem; font-weight: 800;">${ticket.arrStation}</span>
              <span style="display: block; font-size: 0.85rem; color: var(--primary); font-weight: 700;">${ticket.arrTime}</span>
            </div>
          </div>
          <div style="background: var(--surface-muted); padding: 0.75rem; border-radius: var(--radius-sm); display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 1rem;">
            <div>
              <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">좌석 정보</span>
              <strong>${ticket.coach} ${ticket.seats}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">결제 금액</span>
              <strong>${formatKRW(ticket.price)}</strong>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-ticket-action" style="flex: 1;" onclick="viewSavedPass('${ticket.id}')">모바일 승차권</button>
            <button class="btn-ticket-action" style="color: var(--accent-danger);" onclick="cancelSavedTicket('${ticket.id}')">예매 취소</button>
          </div>
        </div>
      `;
      myTicketsGrid.appendChild(card);
    });
  };

  window.viewSavedPass = (ticketId) => {
    const t = state.myTickets.find(x => x.id === ticketId);
    if (t) displayBoardingPass(t);
  };

  window.cancelSavedTicket = (ticketId) => {
    if (confirm('해당 승차권 예매를 취소하시겠습니까? (수수료 없음)')) {
      state.myTickets = state.myTickets.filter(x => x.id !== ticketId);
      localStorage.setItem('raillink_tickets', JSON.stringify(state.myTickets));
      updateTicketCount();
      renderMyTickets();
      showToast('승차권이 성공적으로 취소/환불되었습니다.');
    }
  };

  // --- Real-time Operations Board ---
  const renderLiveTrainTable = () => {
    const liveTrains = [
      { no: 'KTX 012', type: 'KTX', route: '부산 ➔ 서울', plan: '15:20', status: '정시 운행', curr: '대전역 진입' },
      { no: 'SRT 338', type: 'SRT', route: '목포 ➔ 수서', plan: '15:35', status: '정시 운행', curr: '오송역 부근' },
      { no: 'KTX 027', type: 'KTX', route: '서울 ➔ 부산', plan: '15:42', status: '3분 지연', curr: '천안아산역 통과' },
      { no: 'ITX-청춘 2011', type: 'ITX', route: '용산 ➔ 춘천', plan: '15:50', status: '정시 운행', curr: '청량리역 정차' },
      { no: 'KTX-이음 804', type: 'KTX-이음', route: '강릉 ➔ 서울', plan: '16:05', status: '정시 운행', curr: '만종역 부근' }
    ];

    liveTableBody.innerHTML = '';
    liveTrains.forEach(lt => {
      const isDelayed = lt.status.includes('지연');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${lt.no}</strong></td>
        <td><span class="train-type-pill ktx" style="font-size: 0.72rem;">${lt.type}</span></td>
        <td>${lt.route}</td>
        <td>${lt.plan}</td>
        <td><span class="status-badge ${isDelayed ? 'delayed' : 'ontime'}">${lt.status}</span></td>
        <td>${lt.curr}</td>
      `;
      liveTableBody.appendChild(tr);
    });

    const now = new Date();
    document.getElementById('live-sync-time').textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} 기준`;
  };

  // --- Initial Launch ---
  updateTicketCount();
  executeSearch();
});
