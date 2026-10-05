const $ = (selector) => document.querySelector(selector);
const menu = $('.menu-toggle');
const navigation = $('#navigation');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', (event) => {
  if (!event.target.closest('a, button')) return;
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
});

const practiceDescriptions = {
  'Criminal Defense': 'Protecting your rights at every stage. Discuss investigations, charges, and your options for building a considered defense with legal counsel.',
  'Personal Injury': 'Understand your options after an injury. A consultation can help you assess documentation, insurance questions, and potential paths to compensation.',
  'Business Law': 'Clear legal guidance for commercial decisions, from business formation and contracts to disputes and risk management.',
  'Family Law': 'Thoughtful guidance through sensitive family matters, including divorce, parenting arrangements, and financial agreements.',
  'Estate Planning': 'Plan for the people and priorities that matter most. Explore wills, trusts, and a considered approach to your future.'
};
const panels = {
  about: { title: 'Counsel with conviction.', paragraphs: ['Our law firm is built on a foundation of trust, integrity, and a relentless commitment to achieving justice for our clients.', 'Our approach starts by listening. We help you understand your options, set clear priorities, and take the next step with confidence.'] },
  attorneys: { title: 'Personal attention. Expert counsel.', paragraphs: ['Your matter deserves focused attention and an advisor who understands your priorities.', 'Attorney profiles and verified credentials have not yet been supplied for this website. Use the consultation form to prepare a request for the appropriate practice area.'] },
  results: { title: 'Every case is personal.', paragraphs: ['Our focus is careful preparation, clear communication, and pursuing the best possible outcome for each client.', 'Verified case results have not yet been supplied. No outcome is promised, and prior results do not guarantee a similar result in another matter.'] },
  blog: { title: 'A clearer legal perspective.', paragraphs: ['Preparing for a first consultation: make a short timeline, gather relevant documents, and note your most important questions.', 'Avoid including confidential details in an initial email. General information on this website is not legal advice.'] },
  privacy: { title: 'Privacy & disclaimer', paragraphs: ['This is a demonstration website. Contact details and the May 2025 calendar are illustrative, not verified firm information or live availability.', 'Forms create an email draft only. No request is transmitted by this website, no appointment is confirmed, and form entries are not saved in browser storage. Your email provider handles any message you choose to send.', 'Do not include confidential or sensitive information. Submitting a request does not establish an attorney-client relationship. This site provides general information, not legal advice.'] }
};
const dialog = $('#info-dialog');
function openPanel(title, paragraphs) {
  $('#dialog-title').textContent = title;
  const content = $('#dialog-content');
  content.replaceChildren(...paragraphs.map((text) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  }));
  dialog.showModal();
}
document.querySelectorAll('[data-panel]').forEach((button) => button.addEventListener('click', () => {
  const panel = panels[button.dataset.panel];
  openPanel(panel.title, panel.paragraphs);
}));
$('.dialog-close').addEventListener('click', () => dialog.close());
$('.dialog-done').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
document.querySelectorAll('[data-practice]').forEach((button) => {
  button.addEventListener('click', () => {
    $('#practice').value = button.dataset.practice;
    openPanel(button.dataset.practice, [practiceDescriptions[button.dataset.practice], 'Select this practice area in the appointment form to prepare a consultation request.']);
  });
  button.addEventListener('pointerenter', () => { $('.office-photo').style.filter = 'brightness(.62) sepia(.55)'; });
  button.addEventListener('pointerleave', () => { $('.office-photo').style.filter = ''; });
});

let calendarYear = 2025;
let calendarMonth = 4;
let selectedDate = '2025-05-15';
let selectedTime = '';
const dateValue = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
function renderCalendar() {
  $('#month-title').textContent = new Date(calendarYear, calendarMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = $('#calendar-days');
  days.replaceChildren();
  const offset = new Date(calendarYear, calendarMonth, 1).getDay();
  for (let i = 0; i < offset; i++) days.append(document.createElement('span'));
  const length = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  for (let day = 1; day <= length; day++) {
    const button = document.createElement('button');
    const value = dateValue(calendarYear, calendarMonth, day);
    button.type = 'button';
    button.textContent = day;
    button.dataset.date = value;
    button.setAttribute('aria-label', new Date(calendarYear, calendarMonth, day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    button.setAttribute('aria-pressed', String(value === selectedDate));
    button.classList.toggle('selected', value === selectedDate);
    button.addEventListener('click', () => {
      selectedDate = value;
      $('#booking-form .form-status').replaceChildren();
      renderCalendar();
      $('#booking-form').classList.toggle('ready', Boolean(selectedTime));
    });
    days.append(button);
  }
}
function changeMonth(direction) {
  const next = new Date(calendarYear, calendarMonth + direction, 1);
  calendarYear = next.getFullYear();
  calendarMonth = next.getMonth();
  renderCalendar();
}
$('#prev-month').addEventListener('click', () => changeMonth(-1));
$('#next-month').addEventListener('click', () => changeMonth(1));
renderCalendar();
document.querySelectorAll('[data-time]').forEach((button) => button.addEventListener('click', () => {
  selectedTime = button.dataset.time;
  document.querySelectorAll('[data-time]').forEach((slot) => {
    const selected = slot.dataset.time === selectedTime;
    slot.classList.toggle('selected', selected);
    slot.setAttribute('aria-pressed', String(selected));
  });
  $('#booking-form').classList.add('ready');
  $('#booking-form .form-status').replaceChildren();
}));

function prepareEmail(form, subject, additionalLines = []) {
  const data = new FormData(form);
  const body = [
    `Name: ${data.get('name')}`, `Email: ${data.get('email')}`, `Phone: ${data.get('phone')}`,
    ...additionalLines, `Details: ${data.get('details') || 'Not provided'}`
  ].join('\n');
  const status = form.querySelector('.form-status');
  status.textContent = 'Your email draft is ready. Nothing has been sent; confirmation is required. ';
  const link = document.createElement('a');
  link.href = `mailto:info@lexfordlaw.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  link.className = 'draft-link';
  link.textContent = 'Open email draft →';
  status.append(link);
}
$('#consultation').addEventListener('submit', (event) => {
  event.preventDefault();
  prepareEmail(event.currentTarget, 'Lexford — Consultation request');
});
$('#booking-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!selectedTime) {
    $('#booking-form .form-status').textContent = 'Please select your preferred appointment time.';
    $('[data-time]').focus();
    return;
  }
  const date = new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  prepareEmail(event.currentTarget, 'Lexford — Appointment request', [
    `Preferred date (preview): ${date}`, `Preferred time: ${selectedTime}`, `Practice area: ${$('#practice').value}`
  ]);
});
document.querySelectorAll('form').forEach((form) => form.addEventListener('input', () => form.querySelector('.form-status').replaceChildren()));
$('#year').textContent = new Date().getFullYear();

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const cursor = $('.cursor-ring');
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('pointermove', (event) => {
      cursor.classList.add('visible');
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.toggle('hovering', Boolean(event.target.closest('a,button,input,select,textarea')));
    });
    document.addEventListener('pointerleave', () => cursor.classList.remove('visible'));
  }
  const sealObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      document.querySelectorAll('.brand-shield').forEach((seal) => seal.classList.add('seal-stamped'));
      sealObserver.disconnect();
    }
  });
  sealObserver.observe($('footer'));
}
