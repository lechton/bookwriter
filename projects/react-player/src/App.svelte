<script>
  import chapters from 'virtual:chapters';
  import { chapterBlocks } from './lib/blocks.js';

  const timings = Object.fromEntries(
    Object.values(import.meta.glob('./audio/*.timing.json', { eager: true, import: 'default' })).map((t) => [t.chapter, t]),
  );

  const DEFAULT_CHAPTER = '20';
  const INDEX = 'index';
  const fromHash = () => {
    const n = location.hash.replace(/^#\/?/, '');
    if (n === INDEX) return INDEX;
    return chapters.some((c) => c.num === n) ? n : DEFAULT_CHAPTER;
  };

  let current = $state(fromHash());
  let frame = $state();
  let audio = $state();
  let playing = $state(false);
  let time = $state(0);
  let activeIndex = $state(-1);
  let sections = $state([]);
  let activeSection = $state(-1);
  let sectionLinks = [];

  const isIndex = $derived(current === INDEX);
  const chapter = $derived(chapters.find((c) => c.num === current));
  const timing = $derived(timings[current] ?? null);
  const duration = $derived(timing?.duration ?? 0);

  let doc = null;
  let entryEls = [];

  const FRAME_CSS = `
    body { padding-bottom: 45vh; }
    .rp-voiced { cursor: pointer; border-radius: 10px; transition: opacity .45s ease, background-color .45s ease, box-shadow .45s ease; }
    body.rp-reading .container > * { transition: opacity .45s ease; }
    body.rp-reading .container > *:not(.rp-focus) { opacity: .35; }
    .rp-focus { background-color: var(--terra-wash, #f6e6e0); box-shadow: 0 0 0 12px var(--terra-wash, #f6e6e0); opacity: 1; }
  `;

  function onFrameLoad() {
    doc = frame.contentDocument;
    entryEls = [];
    activeIndex = -1;
    sections = [];
    activeSection = -1;
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

    sections = blocks
      .filter((b) => b.id.startsWith('h2-') || b.id.startsWith('h3-'))
      .map((b) => ({
        id: b.id,
        el: b.el,
        level: b.id.startsWith('h2-') ? 2 : 3,
        kicker: b.el.querySelector('.section-kicker')?.textContent.trim() ?? '',
        label: (b.el.querySelector('.h2-title') ?? b.el).textContent.trim(),
        entry: (timing?.blocks ?? []).findIndex((e) => e.ids.includes(b.id)),
      }));
    doc.defaultView.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();

    doc.addEventListener('click', (e) => {
      const el = e.target.closest?.('[data-rp-entry]');
      if (el) seekToEntry(Number(el.dataset.rpEntry));
    });
    doc.addEventListener('keydown', onKey);
  }

  // The section being read is the last heading above the reading line, which sits a little above the
  // middle of the page because the spoken block is centered there.
  function updateActiveSection() {
    if (!frame || !sections.length) return;
    const line = frame.clientHeight * 0.45;
    let k = -1;
    for (let j = 0; j < sections.length; j++) {
      if (sections[j].el.getBoundingClientRect().top <= line) k = j;
      else break;
    }
    if (k !== activeSection) activeSection = k;
  }

  $effect(() => {
    sectionLinks[activeSection]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  function goToSection(j) {
    const s = sections[j];
    if (playing && s.entry >= 0) seekToEntry(s.entry);
    else s.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // While the voice reads, its entry is focused and the rest of the page dims; on pause the page goes
  // back to plain reading, and on resume the focus returns to the entry being read.
  $effect(() => {
    const i = playing ? activeIndex : -1;
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
    sections = [];
    activeSection = -1;
    doc = null;
    current = num;
    history.replaceState(null, '', `#/${num}`);
  }

  const clock = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = String(Math.floor(s % 60)).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
  };
</script>

<svelte:window onkeydown={onKey} onhashchange={() => open(fromHash())} />

<div class="shell" class:index-view={isIndex}>
  <header class="crumbs">
    <nav aria-label="Breadcrumb">
      <a href="#/index" class:here={isIndex} aria-current={isIndex ? 'page' : undefined} onclick={(e) => { e.preventDefault(); open(INDEX); }}>Index</a>
      {#if !isIndex}
        <span class="sep" aria-hidden="true">/</span>
        <span class="here" aria-current="page">{Number(current)}. {chapter?.title}</span>
      {/if}
    </nav>
    <div class="crumbs-kicker">React 10 · River Version</div>
  </header>

  {#if isIndex}
    <main class="index">
      <h1>React 19 Production Lectures</h1>
      <ol>
        {#each chapters as c (c.num)}
          <li>
            <a href={`#/${c.num}`} onclick={(e) => { e.preventDefault(); open(c.num); }}>
              <span class="num">{c.num}</span>
              <span class="name">{c.title}</span>
              {#if timings[c.num]}<span class="badge" title="This chapter has audio">audio</span>{/if}
            </a>
          </li>
        {/each}
      </ol>
    </main>
  {:else}
    <nav class="toc" aria-label="Sections of this chapter">
      <div class="toc-head">
        <div class="toc-kicker">Lecture {Number(current)}</div>
        <div class="toc-title">{chapter?.title}</div>
      </div>
      <ol>
        {#each sections as s, j (s.id)}
          <li>
            <a bind:this={sectionLinks[j]} href={`#/${current}`} class="lvl{s.level}" class:active={j === activeSection} aria-current={j === activeSection ? 'location' : undefined} onclick={(e) => { e.preventDefault(); goToSection(j); }}>
              {#if s.kicker}<span class="kicker">{s.kicker}</span>{/if}
              <span class="name">{s.label}</span>
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
        <span class="bar-title">{activeSection >= 0 ? sections[activeSection].label : chapter?.title}</span>
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
  {/if}
</div>

{#if timing}
  {#key current}
    <audio bind:this={audio} src={`${import.meta.env.BASE_URL}${timing.audio}`} preload="auto" onplay={() => (playing = true)} onpause={() => (playing = false)} onended={onEnded}></audio>
  {/key}
{/if}
