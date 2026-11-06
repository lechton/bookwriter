<script>
  import chapters from 'virtual:chapters';
  import { chapterBlocks } from './lib/blocks.js';

  const timings = Object.fromEntries(
    Object.values(import.meta.glob('./audio/*.timing.json', { eager: true, import: 'default' })).map((t) => [t.chapter, t]),
  );

  const DEFAULT_CHAPTER = '21';
  const fromHash = () => {
    const n = location.hash.replace(/^#\/?/, '');
    return chapters.some((c) => c.num === n) ? n : DEFAULT_CHAPTER;
  };

  let current = $state(fromHash());
  let frame = $state();
  let audio = $state();
  let playing = $state(false);
  let time = $state(0);
  let activeIndex = $state(-1);

  const chapter = $derived(chapters.find((c) => c.num === current));
  const timing = $derived(timings[current] ?? null);
  const duration = $derived(timing?.duration ?? 0);

  let doc = null;
  let entryEls = [];

  const FRAME_CSS = `
    body { padding-bottom: 45vh; }
    .rp-voiced { cursor: pointer; border-radius: 10px; transition: opacity .45s ease, background-color .45s ease, box-shadow .45s ease; }
    .rp-voiced:hover { box-shadow: 0 0 0 2px rgba(147, 64, 44, .22); }
    body.rp-reading .container > * { transition: opacity .45s ease; }
    body.rp-reading .container > *:not(.rp-focus) { opacity: .35; }
    .rp-focus { background-color: var(--terra-wash, #f6e6e0); box-shadow: 0 0 0 12px var(--terra-wash, #f6e6e0); opacity: 1; }
  `;

  function onFrameLoad() {
    doc = frame.contentDocument;
    entryEls = [];
    activeIndex = -1;
    const container = doc?.querySelector('.container');
    if (!container) return;
    const style = doc.createElement('style');
    style.textContent = FRAME_CSS;
    doc.head.append(style);

    const blocks = chapterBlocks(container);
    const byId = new Map(blocks.map((b) => [b.id, b.el]));
    for (const b of blocks) b.el.dataset.rpBlock = b.id;
    entryEls = (timing?.blocks ?? []).map((entry, i) => {
      const els = entry.ids.map((id) => byId.get(id)).filter(Boolean);
      for (const el of els) {
        el.classList.add('rp-voiced');
        el.dataset.rpEntry = String(i);
      }
      return els;
    });

    doc.addEventListener('click', (e) => {
      const el = e.target.closest?.('[data-rp-entry]');
      if (el) seekToEntry(Number(el.dataset.rpEntry));
    });
    doc.addEventListener('keydown', onKey);
  }

  function seekToEntry(i) {
    if (!audio || !timing) return;
    audio.currentTime = timing.blocks[i].start + 0.01;
    audio.play();
  }

  function entryAt(t) {
    if (!timing) return -1;
    return timing.blocks.findIndex((b) => t >= b.start && t < b.end);
  }

  // Applied whenever the spoken entry changes: the entry's blocks are focused and brought to the middle.
  $effect(() => {
    const i = activeIndex;
    if (!doc) return;
    doc.body.classList.toggle('rp-reading', i >= 0);
    for (const el of doc.querySelectorAll('.rp-focus')) el.classList.remove('rp-focus');
    const els = entryEls[i] ?? [];
    for (const el of els) el.classList.add('rp-focus');
    const el = els[0];
    if (el) {
      // A seek far down the chapter would take seconds to animate; only nearby moves glide.
      const far = Math.abs(el.getBoundingClientRect().top) > frame.clientHeight * 1.5;
      // A block taller than the window is read from its top, so its top edge is kept in view.
      const tall = el.getBoundingClientRect().height > frame.clientHeight * 0.8;
      el.scrollIntoView({ behavior: far ? 'instant' : 'smooth', block: tall ? 'start' : 'center' });
    }
  });

  // timeupdate fires only about four times a second; a frame loop keeps the focus on the word being spoken.
  $effect(() => {
    if (!playing) return;
    let raf;
    const tick = () => {
      time = audio.currentTime;
      const i = entryAt(time);
      if (i !== activeIndex) activeIndex = i;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });

  function toggle() {
    if (!audio || !timing) return;
    if (audio.paused) audio.play();
    else audio.pause();
  }

  function onEnded() {
    playing = false;
    activeIndex = -1;
    time = 0;
    audio.currentTime = 0;
  }

  function onKey(e) {
    if (e.code === 'Space' && !/^(INPUT|TEXTAREA|BUTTON)$/.test(e.target?.tagName)) {
      e.preventDefault();
      toggle();
    }
  }

  function seekBar(e) {
    if (!audio || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * duration;
    time = audio.currentTime;
    activeIndex = entryAt(time);
  }

  function open(num) {
    if (num === current) return;
    audio?.pause();
    playing = false;
    time = 0;
    activeIndex = -1;
    current = num;
    history.replaceState(null, '', `#/${num}`);
  }

  const clock = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = String(Math.floor(s % 60)).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
  };
</script>

<svelte:window onkeydown={onKey} onhashchange={() => open(fromHash())} />

<div class="shell">
  <nav class="toc" aria-label="Table of contents">
    <div class="toc-head">
      <div class="toc-kicker">React 10 · River Version</div>
      <div class="toc-title">React 19 Production Lectures</div>
    </div>
    <ol>
      {#each chapters as c (c.num)}
        <li>
          <a href={`#/${c.num}`} class:active={c.num === current} aria-current={c.num === current ? 'page' : undefined} onclick={(e) => { e.preventDefault(); open(c.num); }}>
            <span class="num">{c.num}</span>
            <span class="name">{c.title}</span>
            {#if timings[c.num]}<span class="badge" title="This chapter has audio">audio</span>{/if}
          </a>
        </li>
      {/each}
    </ol>
  </nav>

  <main class="reader">
    {#key current}
      <iframe bind:this={frame} src={`${import.meta.env.BASE_URL}chapters/${current}.html`} title={chapter?.title} onload={onFrameLoad}></iframe>
    {/key}
  </main>

  <footer class="bar">
    <button type="button" class="progress" aria-label="Seek" disabled={!timing} onclick={seekBar}>
      <span style:width={duration ? `${(time / duration) * 100}%` : '0%'}></span>
    </button>
    <div class="bar-left">
      <span class="bar-num">{current}</span>
      <span class="bar-title">{chapter?.title}</span>
    </div>
    <button type="button" class="play" onclick={toggle} disabled={!timing} aria-label={playing ? 'Pause' : 'Play'} title={timing ? (playing ? 'Pause (space)' : 'Play (space)') : 'No audio for this chapter yet'}>
      {#if playing}
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
      {:else}
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
      {/if}
    </button>
    <div class="bar-right">
      {#if timing}{clock(time)} / {clock(duration)}{:else}No audio yet{/if}
    </div>
  </footer>
</div>

{#if timing}
  {#key current}
    <audio bind:this={audio} src={`${import.meta.env.BASE_URL}${timing.audio}`} preload="auto" onplay={() => (playing = true)} onpause={() => (playing = false)} onended={onEnded}></audio>
  {/key}
{/if}
