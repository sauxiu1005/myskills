/* Design adapter: follow the upstream player's current row inside the table. */
(() => {
  const video = document.getElementById('report-video');
  const cards = document.getElementById('cards');
  const tools = document.querySelector('.library-tools');
  if (!video || !cards || !tools) return;
  const english = document.documentElement.lang === 'en';
  const label = document.createElement('label');
  label.className = 'report-follow-control';
  const toggle = document.createElement('input');
  toggle.type = 'checkbox'; toggle.checked = true; toggle.id = 'follow-current-shot';
  label.append(toggle, document.createTextNode(english ? 'Follow current shot' : '自动跟随当前镜头'));
  tools.prepend(label);
  let lastId = null;
  let queued = false;
  function follow(force = false) {
    if (!toggle.checked) return;
    const row = cards.querySelector('[data-player-shot].is-current');
    // Filtering may hide the active shot. Never select a different shot to compensate.
    if (!row) { lastId = null; return; }
    const id = row.dataset.playerShot;
    if (!force && id === lastId) return;
    lastId = id;
    const box = cards.getBoundingClientRect();
    const rect = row.getBoundingClientRect();
    const top = Math.max(0, Math.min(cards.scrollHeight - cards.clientHeight,
      cards.scrollTop + rect.top - box.top - cards.clientTop - 16));
    // Instant moves avoid lag behind fast cuts, seeks or repeated interactions.
    cards.scrollTo({top, behavior:'instant'});
  }
  function queueFollow() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; follow(); });
  }
  new MutationObserver(queueFollow).observe(cards, {subtree:true, childList:true, attributes:true, attributeFilter:['class']});
  toggle.addEventListener('change', () => follow(true));
  for (const event of ['timeupdate','seeked','loadedmetadata','play','ended']) video.addEventListener(event, queueFollow);
  window.addEventListener('resize', () => follow(true));
  queueFollow();
})();
