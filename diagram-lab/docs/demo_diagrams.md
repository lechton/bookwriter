# Svelte Demo Diagrams

## 01_state.md

<div class="dg">
  <div class="stack">
    <div class="box bg-yellow"><span class="box-title">Source of Truth</span><b>$state()</b><i>Holds reactive data</i></div>
    <div class="arrow-down"></div>
    <div class="box bg-blue"><span class="box-title">UI</span><b>DOM Element</b><i>Refreshes on change</i></div>
  </div>
</div>

## 02_derived.md

<div class="dg">
  <div class="stack">
    <div class="box bg-yellow"><span class="box-title">Input</span><b>$state()</b><i>Data changes</i></div>
    <div class="arrow-down"></div>
    <div class="box bg-green"><span class="box-title">Formula</span><b>$derived()</b><i>Recalculates automatically</i></div>
  </div>
</div>

## 03_effect.md

<div class="dg">
  <div class="stack">
    <div class="box bg-yellow"><span class="box-title">Trigger</span><b>$state() updates</b></div>
    <div class="arrow-down"></div>
    <div class="box bg-gray"><span class="box-title">Wait</span><b>DOM Renders</b></div>
    <div class="arrow-down"></div>
    <div class="box bg-pink"><span class="box-title">Action</span><b>$effect()</b><i>Interacts with outside world</i></div>
  </div>
</div>

## 04_props.md

<div class="dg" style="display:flex; justify-content:center; align-items:center; gap:20px; padding:40px 20px; background-image: radial-gradient(#000 1px, transparent 1px); background-size: 16px 16px;">
  <span style="position:absolute; top:-12px; left:20px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Data Flow Diagram</span>
  <div class="box bg-yellow" style="box-shadow: 6px 6px 0px 0px #000; font-size: 14pt;"><b>Parent.svelte</b></div>
  <div style="display:flex; flex-direction:column; align-items:center; z-index:2; background:#fff; border: 2px solid #000; padding: 4px 8px;">
    <span style="font-size:7pt; font-weight:800; text-transform:uppercase;">Passes "title"</span>
    <span style="font-size:18pt; font-weight:900; line-height:1;">→</span>
  </div>
  <div class="box bg-blue" style="box-shadow: 6px 6px 0px 0px #000; font-size: 14pt;"><b>Child.svelte</b></div>
</div>

## 05_prop_drilling.md

<div class="dg" style="display:flex; justify-content:center; gap:16px; padding:30px 10px; background:#f9fafb;">
  <div style="flex:1; border:3px dashed #9ca3af; padding:24px 10px 16px; position:relative; display:flex; flex-direction:column; align-items:center; background:#fff;">
    <span style="position:absolute; top:-10px; background:#9ca3af; color:#fff; font-size:6pt; font-weight:800; padding:2px 6px; text-transform:uppercase;">The Old Way</span>
    <div class="code-inline" style="width:100%; text-align:center; padding:6px; background:#f3f4f6; color:#6b7280; border-color:#9ca3af;">App.svelte</div>
    <div style="height:12px; width:2px; background:#9ca3af; margin:4px 0;"></div>
    <div class="code-inline" style="width:100%; text-align:center; padding:6px; background:#f3f4f6; color:#6b7280; border-color:#9ca3af;">Layout.svelte</div>
    <div style="height:12px; width:2px; background:#9ca3af; margin:4px 0;"></div>
    <div class="code-inline" style="width:100%; text-align:center; padding:6px; background:#f3f4f6; color:#6b7280; border-color:#9ca3af;">DeepChild.svelte</div>
  </div>
  <div style="flex:1; border:4px solid #000; padding:24px 10px 16px; position:relative; display:flex; flex-direction:column; align-items:center; background:#f0fdf4;">
    <span style="position:absolute; top:-12px; background:#22c55e; color:#000; font-size:6.5pt; font-weight:800; padding:4px 8px; border:2px solid #000; text-transform:uppercase; box-shadow: 2px 2px 0 0 #000;">Universal State</span>
    <div class="box bg-yellow" style="width:100%; padding:8px; box-shadow: 4px 4px 0 0 #000; margin-bottom:12px;"><b>store.svelte.js</b></div>
    <div style="display:flex; flex-direction:column; align-items:center; z-index:2;">
      <span style="font-size:16pt; font-weight:900; line-height:1;">↓</span>
      <span style="font-size:6.5pt; font-weight:800; text-transform:uppercase; background:#fff; border:2px solid #000; padding:2px 4px; margin-top:-2px;">Direct Import</span>
    </div>
    <div class="box bg-blue" style="width:100%; padding:8px; box-shadow: 4px 4px 0 0 #000; margin-top:12px;"><b>DeepChild.svelte</b></div>
  </div>
</div>

## 06_events.md

<div class="dg" style="display:flex; justify-content:center; gap:20px; padding:30px 10px; background:repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 10px, #fff 10px, #fff 20px);">
  <div style="flex:1; border:4px solid #000; padding:30px 10px; background:#e5e7eb; position:relative; display:flex; flex-direction:column; align-items:center; opacity:0.6;">
    <span style="position:absolute; top:-12px; background:#000; color:#fff; font-size:7pt; font-weight:800; padding:2px 8px; text-transform:uppercase; border:2px solid #000;">The Old Way</span>
    <div style="font-size:18pt; font-family:monospace; font-weight:bold; text-decoration:line-through; color:#6b7280; text-decoration-color:#ef4444; text-decoration-thickness:4px;">on:click</div>
    <div style="font-size:8pt; font-weight:bold; color:#9ca3af; margin-top:8px;">|preventDefault</div>
  </div>
  <div style="flex:1; border:4px solid #000; padding:30px 10px; background:#f0fdf4; position:relative; display:flex; flex-direction:column; align-items:center; box-shadow:6px 6px 0 0 #000;">
    <span style="position:absolute; top:-12px; background:#4ade80; color:#000; font-size:7pt; font-weight:800; padding:2px 8px; text-transform:uppercase; border:2px solid #000; box-shadow: 2px 2px 0 0 #000;">Svelte 5</span>
    <div style="font-size:22pt; font-family:monospace; font-weight:bold; color:#000;">onclick</div>
    <div style="font-size:7.5pt; font-weight:bold; color:#166534; background:#fff; border:2px solid #000; padding:4px 6px; transform:rotate(-4deg); margin-top:8px;">Standard JS Event Object</div>
  </div>
</div>

## 07_snippets.md

<div class="dg" style="background:#fff; padding:40px 20px 20px; border-width:6px; position:relative;">
  <span style="position:absolute; top:0; left:0; background:#000; color:#fff; padding:4px 12px; font-size:7.5pt; font-weight:800; text-transform:uppercase; border-bottom:4px solid #000; border-right:4px solid #000;">Blueprint Factory</span>
  <div style="display:flex; flex-direction:column; align-items:center;">
    <div style="border:4px dashed #3b82f6; background:#eff6ff; padding:8px 24px; font-family:monospace; font-weight:bold; font-size:14pt; color:#1d4ed8; display:flex; align-items:center; gap:8px;">
      <span style="font-size:18pt;">📦</span> #snippet
    </div>
    <div style="display:flex; justify-content:space-between; width:100%; max-width:200px; padding:0 20px; margin:16px 0;">
      <span style="font-size:20pt; font-weight:900; transform:rotate(135deg); line-height:1;">↓</span>
      <span style="font-size:20pt; font-weight:900; line-height:1;">↓</span>
      <span style="font-size:20pt; font-weight:900; transform:rotate(-135deg); line-height:1;">↓</span>
    </div>
    <div style="display:flex; gap:12px; width:100%; justify-content:center;">
      <div style="border:2px solid #000; background:#fef08a; padding:8px 12px; font-family:monospace; font-weight:bold; text-align:center; box-shadow:4px 4px 0 0 #000;">{@render}<br><span style="font-family:sans-serif; font-size:8pt; font-weight:normal;">'News'</span></div>
      <div style="border:2px solid #000; background:#fef08a; padding:8px 12px; font-family:monospace; font-weight:bold; text-align:center; box-shadow:4px 4px 0 0 #000;">{@render}<br><span style="font-family:sans-serif; font-size:8pt; font-weight:normal;">'Sports'</span></div>
    </div>
  </div>
</div>

## 08_bindable.md

<div class="dg" style="padding:30px 20px; background-color:#fff1f2; background-image:repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 8px); display:flex; align-items:center; justify-content:space-between; gap:0;">
  <div style="border:4px solid #000; background:#fff; padding:20px; font-weight:bold; text-align:center; width:35%; box-shadow:4px 4px 0 0 #000; z-index:2;">
    <div style="font-family:monospace; font-size:12pt;">Parent</div>
    <div style="font-size:8pt; color:#6b7280; font-weight:normal;">name</div>
  </div>
  <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; z-index:1; height:40px;">
    <div style="background:#000; color:#fff; font-family:monospace; font-size:7.5pt; font-weight:800; padding:4px 8px; border:2px solid #fff; border-radius:4px; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:3;">bind:value</div>
    <div style="width:100%; height:4px; background:#000; position:relative;">
      <div style="position:absolute; left:0; top:50%; transform:translateY(-50%) rotate(45deg); width:12px; height:12px; border-bottom:4px solid #000; border-left:4px solid #000; background:#fff1f2;"></div>
      <div style="position:absolute; right:0; top:50%; transform:translateY(-50%) rotate(45deg); width:12px; height:12px; border-top:4px solid #000; border-right:4px solid #000; background:#fff1f2;"></div>
    </div>
  </div>
  <div style="border:4px solid #000; background:#fff; padding:20px; font-weight:bold; text-align:center; width:35%; box-shadow:-4px 4px 0 0 #000; z-index:2;">
    <div style="font-family:monospace; font-size:12pt;">Child</div>
    <div style="font-size:8pt; color:#6b7280; font-weight:normal;">$bindable()</div>
  </div>
</div>

## 09_inspect.md

<div class="dg" style="border:none; padding:0; background:none; margin-top:24px;">
  <div style="border-radius:12px; box-shadow:8px 8px 0 0 #000; overflow:hidden; border:4px solid #000;">
    <div style="background:#e5e5e5; padding:12px 16px; border-bottom:3px solid #000; display:flex; gap:8px;">
      <div style="width:12px; height:12px; border-radius:50%; background:#ef4444; border:2px solid #000;"></div>
      <div style="width:12px; height:12px; border-radius:50%; background:#eab308; border:2px solid #000;"></div>
      <div style="width:12px; height:12px; border-radius:50%; background:#22c55e; border:2px solid #000;"></div>
      <span style="margin-left:auto; color:#4b5563; font-family:monospace; font-size:7.5pt; font-weight:800; text-transform:uppercase; letter-spacing:0.1em;">Developer Console</span>
    </div>
    <div style="padding:16px; font-family:monospace; font-size:9pt; line-height:1.8; background:#f9fafb;">
      <div style="color:#6b7280; margin-bottom:4px;">&gt; $inspect initialization</div>
      <div style="color:#059669; border-left:2px solid #d1d5db; padding-left:12px; margin-bottom:12px; display:flex; gap:16px;">
        <span>count: <span style="color:#d97706;">0</span></span>
        <span style="color:#2563eb;">Object { role: "admin" }</span>
      </div>
      <div style="color:#6b7280; margin-bottom:4px;">&gt; count updated</div>
      <div style="color:#059669; border-left:2px solid #d1d5db; padding-left:12px; background:rgba(0,0,0,0.05); padding-top:4px; padding-bottom:4px; display:flex; gap:16px;">
        <span>count: <span style="color:#d97706;">1</span></span>
        <span style="color:#2563eb;">Object { role: "admin" }</span>
      </div>
    </div>
  </div>
</div>

## 10_effect_cleanup.md

<div class="dg" style="border-color:#000; padding:30px 20px; background:#faf5ff; display:flex; flex-direction:column; gap:12px; align-items:center;">
  <div style="border:3px solid #000; background:#fff; padding:12px; text-align:center; width:80%; position:relative; box-shadow:4px 4px 0 0 #000;">
    <div style="width:24px; height:24px; background:#000; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:10pt; position:absolute; top:-12px; left:50%; transform:translateX(-50%); border:2px solid #fff;">1</div>
    <span style="font-weight:800; font-size:9pt; display:block; margin:8px 0 4px;">Effect Runs</span>
    <span style="font-size:7pt; color:#6b21a8; background:#f3e8ff; padding:2px 4px; font-weight:bold; border:1px solid #d8b4fe;">Timer starts</span>
  </div>
  <span style="font-size:18pt; font-weight:900; line-height:1;">↓</span>
  <div style="border:3px solid #000; background:#fff; padding:12px; text-align:center; width:80%; position:relative; box-shadow:4px 4px 0 0 #000;">
    <div style="width:24px; height:24px; background:#000; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:10pt; position:absolute; top:-12px; left:50%; transform:translateX(-50%); border:2px solid #fff;">2</div>
    <span style="font-weight:800; font-size:9pt; display:block; margin:8px 0 4px;">State Changes</span>
    <span style="font-size:7pt; color:#4b5563; background:#f3f4f6; padding:2px 4px; font-weight:bold; border:1px solid #d1d5db;">(or unmount)</span>
  </div>
  <span style="font-size:18pt; font-weight:900; line-height:1;">↓</span>
  <div style="border:3px solid #000; background:#e9d5ff; padding:12px; text-align:center; width:80%; position:relative; box-shadow:4px 4px 0 0 #000;">
    <div style="width:24px; height:24px; background:#000; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:10pt; position:absolute; top:-12px; left:50%; transform:translateX(-50%); border:2px solid #fff;">3</div>
    <span style="font-weight:800; font-size:9pt; display:block; margin:8px 0 4px;">Cleanup Runs</span>
    <span style="font-size:7pt; color:#b91c1c; background:#fee2e2; padding:2px 4px; font-weight:bold; border:1px solid #fca5a5;">Timer stops</span>
  </div>
</div>

## 11_class_reactivity.md

<div class="dg" style="background:#e0f2fe; padding:40px 20px; border:4px solid #000; position:relative; overflow:hidden;">
  <!-- Decor -->
  <div style="position:absolute; top:-40px; left:-10px; font-size:140px; opacity:0.1; font-weight:900; line-height:1; font-family:monospace;">{ }</div>
  
  <div style="display:flex; flex-direction:column; align-items:center; position:relative; z-index:2;">
    <!-- The Blueprint -->
    <div style="border:4px solid #000; background:#3b82f6; color:#fff; padding:12px 24px; font-family:monospace; font-weight:bold; font-size:16pt; box-shadow:6px 6px 0 0 #000; margin-bottom:30px; transform:rotate(-2deg);">
      class User
    </div>
    
    <div style="display:flex; justify-content:center; gap:24px; width:100%;">
      <!-- Instances -->
      <div style="border:3px solid #000; background:#fff; padding:16px 12px; display:flex; flex-direction:column; align-items:center; box-shadow:4px 4px 0 0 #000; width:120px;">
        <span style="background:#000; color:#fff; font-size:7pt; padding:2px 6px; margin-bottom:8px; font-weight:bold; letter-spacing:0.1em;">INSTANCE</span>
        <span style="font-size:24pt; margin-bottom:4px;">👤</span>
        <span style="font-family:monospace; font-weight:bold; font-size:10pt;">user1</span>
        <span style="background:#fef08a; padding:2px 6px; font-size:7pt; border:2px solid #000; margin-top:8px; font-weight:bold;">$state</span>
      </div>
      
      <div style="border:3px solid #000; background:#fff; padding:16px 12px; display:flex; flex-direction:column; align-items:center; box-shadow:4px 4px 0 0 #000; width:120px;">
        <span style="background:#000; color:#fff; font-size:7pt; padding:2px 6px; margin-bottom:8px; font-weight:bold; letter-spacing:0.1em;">INSTANCE</span>
        <span style="font-size:24pt; margin-bottom:4px;">👤</span>
        <span style="font-family:monospace; font-weight:bold; font-size:10pt;">user2</span>
        <span style="background:#fef08a; padding:2px 6px; font-size:7pt; border:2px solid #000; margin-top:8px; font-weight:bold;">$state</span>
      </div>
    </div>
  </div>
</div>

## 12_untrack.md

<div class="dg" style="padding:40px 20px; background:#f4f4f5; border:6px solid #000; position:relative; display:flex; justify-content:center; align-items:center;">
  
  <div style="display:flex; flex-direction:column; gap:24px; z-index:2; width:100%;">
    <!-- Normal Var -->
    <div style="display:flex; align-items:center; justify-content:center; gap:16px;">
      <div style="border:3px solid #000; background:#fef08a; padding:8px 16px; font-family:monospace; font-weight:bold; box-shadow:4px 4px 0 0 #000;">actionCount</div>
      <span style="font-size:24pt; font-weight:900; color:#000; line-height:1;">→</span>
      <div style="border:3px solid #000; background:#ef4444; color:#fff; padding:8px 16px; font-weight:bold; box-shadow:4px 4px 0 0 #000; text-transform:uppercase;">Triggers Re-run</div>
    </div>
    <!-- Untracked Var -->
    <div style="display:flex; align-items:center; justify-content:center; gap:16px;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <div style="border:3px solid #000; background:#a8a29e; color:#000; padding:8px 16px; font-family:monospace; font-weight:bold; box-shadow:4px 4px 0 0 #000; border-style:dashed;">untrack(() => sessionToken)</div>
        <div style="font-size:12px; font-family:monospace; font-weight:bold; text-align:center;">Returns "xyz-987"</div>
      </div>
      <span style="font-size:24pt; font-weight:900; color:#000; line-height:1;">→</span>
      <div style="border:3px solid #000; background:#22c55e; color:#000; padding:8px 16px; font-weight:bold; box-shadow:4px 4px 0 0 #000; text-transform:uppercase;">Ignored by Svelte</div>
    </div>
  </div>
</div>

## 13_effect_pre.md

<div class="dg" style="display:flex; background:#f9fafb; padding:40px 20px; border:4px solid #000; position:relative;">
  <!-- Timeline Line -->
  <div style="position:absolute; left:50%; top:20px; bottom:20px; width:4px; background:#000; transform:translateX(-50%);"></div>
  
  <div style="display:flex; flex-direction:column; width:100%; gap:32px; z-index:2;">
    <!-- Step 1 -->
    <div style="display:flex; justify-content:flex-start; width:100%;">
      <div style="border:3px solid #000; background:#fef08a; padding:12px; width:45%; box-shadow:4px 4px 0 0 #000; position:relative;">
        <span style="position:absolute; right:-24px; top:50%; transform:translateY(-50%); font-size:16pt; font-weight:900; line-height:1;">→</span>
        <span style="font-weight:800; font-size:9pt; text-transform:uppercase;">1. $effect.pre</span>
        <div style="font-family:monospace; font-size:8pt; margin-top:4px;">Measures old layout</div>
      </div>
    </div>
    <!-- Step 2 -->
    <div style="display:flex; justify-content:center; width:100%;">
      <div style="border:4px dashed #000; background:#fff; padding:8px 24px; font-weight:bold; text-transform:uppercase; font-size:10pt;">
        DOM Updates
      </div>
    </div>
    <!-- Step 3 -->
    <div style="display:flex; justify-content:flex-end; width:100%;">
      <div style="border:3px solid #000; background:#bbf7d0; padding:12px; width:45%; box-shadow:4px 4px 0 0 #000; position:relative;">
        <span style="position:absolute; left:-24px; top:50%; transform:translateY(-50%) rotate(180deg); font-size:16pt; font-weight:900; line-height:1;">→</span>
        <span style="font-weight:800; font-size:9pt; text-transform:uppercase;">2. $effect</span>
        <div style="font-family:monospace; font-size:8pt; margin-top:4px;">Sees new layout</div>
      </div>
    </div>
  </div>
</div>

## 14_dynamic_components.md

<div class="dg" style="display:flex; flex-direction:column; align-items:center; background:repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 11px); padding:40px 20px; border:4px solid #000;">
  
  <div style="border:4px solid #000; background:#fff; padding:12px 32px; font-family:monospace; font-weight:bold; font-size:18pt; box-shadow:6px 6px 0 0 #000; margin-bottom:24px;">
    &lt;<span style="color:#ef4444;">Tag</span> /&gt;
  </div>
  
  <div style="display:flex; gap:16px; align-items:center;">
    <div style="display:flex; flex-direction:column; align-items:center;">
      <span style="font-size:24pt; font-weight:900; transform:rotate(-135deg); margin-bottom:8px; line-height:1;">↓</span>
      <div style="border:3px dashed #3b82f6; background:#eff6ff; padding:8px; font-weight:bold; font-family:monospace; font-size:8pt;">Home</div>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center;">
      <span style="font-size:24pt; font-weight:900; margin-bottom:8px; line-height:1;">↓</span>
      <div style="border:3px dashed #10b981; background:#ecfdf5; padding:8px; font-weight:bold; font-family:monospace; font-size:8pt;">About</div>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center;">
      <span style="font-size:24pt; font-weight:900; transform:rotate(135deg); margin-bottom:8px; line-height:1;">↓</span>
      <div style="border:3px dashed #8b5cf6; background:#f5f3ff; padding:8px; font-weight:bold; font-family:monospace; font-size:8pt;">Profile</div>
    </div>
  </div>
</div>

## 15_error_boundaries.md

<div class="dg" style="padding:40px; background:#fff; border:4px solid #000; position:relative; overflow:hidden; display:flex; justify-content:center; align-items:center;">
  
  <!-- Outer App -->
  <div style="position:absolute; top:10px; left:10px; font-weight:900; font-size:14pt; color:#d1d5db; text-transform:uppercase;">Safe App Zone</div>
  
  <!-- The Boundary -->
  <div style="border:6px dashed #ef4444; background:#fef2f2; padding:32px; position:relative; display:flex; flex-direction:column; align-items:center; z-index:2; box-shadow:0 0 0 100px rgba(255,255,255,0.8);">
    <span style="position:absolute; top:-16px; background:#ef4444; color:#fff; font-weight:900; padding:4px 12px; text-transform:uppercase; letter-spacing:0.1em; border:2px solid #000; font-size:8pt;">&lt;svelte:boundary&gt;</span>
    
    <span style="font-size:32pt; margin-bottom:8px;">💥</span>
    <span style="font-weight:900; color:#991b1b; text-transform:uppercase; font-size:10pt; text-align:center;">
      Fatal Error<br/>Contained
    </span>
  </div>
</div>

## 16_state_raw.md

<div class="dg" style="padding:40px 20px; background:#f4f4f5; border:6px solid #000; position:relative; display:flex; justify-content:center; align-items:center; gap:40px;">
  <div style="border:4px solid #000; background:#fff; padding:20px; box-shadow:6px 6px 0 0 #000; flex:1; position:relative;">
    <div style="position:absolute; top:-12px; left:-12px; background:#ef4444; color:#fff; font-weight:900; padding:4px 12px; border:2px solid #000;">$state</div>
    <div style="font-family:monospace; font-weight:bold; margin-bottom:12px;">DEEP PROXY</div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <div style="border:2px dashed #000; background:#fef08a; padding:8px;">Object 1 (Tracked)</div>
      <div style="border:2px dashed #000; background:#fef08a; padding:8px;">Object 2 (Tracked)</div>
      <div style="border:2px dashed #000; background:#fef08a; padding:8px;">Object 3 (Tracked)</div>
    </div>
  </div>

  <span style="font-size:24pt; font-weight:900;">VS</span>

  <div style="border:4px solid #000; background:#fff; padding:20px; box-shadow:6px 6px 0 0 #000; flex:1; position:relative;">
    <div style="position:absolute; top:-12px; right:-12px; background:#22c55e; color:#fff; font-weight:900; padding:4px 12px; border:2px solid #000;">$state.raw</div>
    <div style="font-family:monospace; font-weight:bold; margin-bottom:12px;">SHALLOW</div>
    <div style="display:flex; flex-direction:column; gap:8px; border:4px solid #fef08a; padding:8px;">
      <div style="background:#e5e7eb; padding:8px; border:1px solid #9ca3af;">Object 1 (Ignored)</div>
      <div style="background:#e5e7eb; padding:8px; border:1px solid #9ca3af;">Object 2 (Ignored)</div>
      <div style="background:#e5e7eb; padding:8px; border:1px solid #9ca3af;">Object 3 (Ignored)</div>
    </div>
  </div>
</div>

## 17_effect_root.md

<div class="dg" style="padding:40px 20px; background:repeating-linear-gradient(45deg, #fff, #fff 10px, #f4f4f5 10px, #f4f4f5 20px); border:6px solid #000; position:relative; display:flex; justify-content:center; align-items:center; gap:24px;">
  
  <div style="border:4px solid #000; background:#fff; box-shadow:6px 6px 0 0 #000; padding:20px; width:45%; text-align:center;">
    <div style="background:#000; color:#fff; font-weight:bold; padding:4px 8px; margin-bottom:16px;">Component.svelte</div>
    <div style="border:3px solid #000; background:#3b82f6; color:#fff; font-weight:bold; padding:12px; border-radius:50px;">$effect</div>
    <div style="margin-top:16px; font-family:monospace; font-weight:bold;">Auto Cleanup 🗑️</div>
  </div>

  <div style="border:4px solid #000; background:#fff; box-shadow:6px 6px 0 0 #000; padding:20px; width:45%; text-align:center; position:relative;">
    <div style="background:#ef4444; color:#fff; font-weight:bold; padding:4px 8px; margin-bottom:16px; border:2px solid #000;">store.js (Global)</div>
    <div style="border:4px dashed #000; padding:16px; position:relative;">
      <div style="position:absolute; top:-14px; left:50%; transform:translateX(-50%); background:#fef08a; border:2px solid #000; padding:2px 8px; font-family:monospace; font-weight:bold; font-size:10px;">$effect.root</div>
      <div style="border:3px solid #000; background:#3b82f6; color:#fff; font-weight:bold; padding:12px; border-radius:50px;">$effect</div>
    </div>
    <div style="margin-top:16px; font-family:monospace; font-weight:bold;">Manual Cleanup ✋</div>
  </div>

</div>

## 18_derived_by.md

<div class="dg" style="padding:40px; background:#f4f4f5; border:6px solid #000; display:flex; flex-direction:column; gap:20px; position:relative; align-items:center;">
  
  <div style="display:flex; width:100%; gap:20px; align-items:stretch;">
    <!-- Normal Derived -->
    <div style="flex:1; border:4px solid #000; background:#fff; padding:20px; box-shadow:6px 6px 0 0 #000;">
      <div style="background:#22c55e; color:#000; font-family:monospace; font-weight:900; padding:4px 8px; border:2px solid #000; display:inline-block; margin-bottom:12px;">$derived</div>
      <div style="border-left:4px solid #d1d5db; padding-left:12px; font-family:monospace; color:#4b5563;">
        One line only.<br>
        x * 2
      </div>
    </div>

    <!-- Derived By -->
    <div style="flex:1; border:4px solid #000; background:#fff; padding:20px; box-shadow:6px 6px 0 0 #000; position:relative;">
      <div style="background:#fef08a; color:#000; font-family:monospace; font-weight:900; padding:4px 8px; border:2px solid #000; display:inline-block; margin-bottom:12px;">$derived.by</div>
      <div style="border-left:4px solid #d1d5db; padding-left:12px; font-family:monospace; color:#4b5563;">
        Full function.<br>
        Loops allowed.<br>
        If statements.<br>
        Must <b>return</b>.
      </div>
    </div>
  </div>
</div>

