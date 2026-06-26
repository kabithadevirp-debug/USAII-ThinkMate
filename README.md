<!DOCTYPE html>
<html lang="en">

<!-- HEADER -->
<div class="block">
<pre class="g" style="font-size:9px;line-height:1.2">
 ████████╗██╗  ██╗██╗███╗   ██╗██╗  ██╗███╗   ███╗ █████╗ ████████╗███████╗
    ██╔══╝██║  ██║██║████╗  ██║██║ ██╔╝████╗ ████║██╔══██╗╚══██╔══╝██╔════╝
    ██║   ███████║██║██╔██╗ ██║█████╔╝ ██╔████╔██║███████║   ██║   █████╗
    ██║   ██╔══██║██║██║╚██╗██║██╔═██╗ ██║╚██╔╝██║██╔══██║   ██║   ██╔══╝
    ██║   ██║  ██║██║██║ ╚████║██║  ██╗██║ ╚═╝ ██║██║  ██║   ██║   ███████╗
    ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
</pre>
<pre class="c" style="font-size:9px;line-height:1.2">
      █████╗ ██╗
     ██╔══██╗██║
     ███████║██║
     ██╔══██║██║
     ██║  ██║██║
     ╚═╝  ╚═╝╚═╝
</pre>
<div style="margin-top:8px">
  <span class="tag g">v1.0.0</span>&nbsp;
  <span class="tag c">Open Source</span>&nbsp;
  <span class="tag y">Productivity · AI</span>&nbsp;
  <span class="tag p">React 19</span>&nbsp;
  <span class="tag o">Full-Stack SSR</span>
</div>
<div style="margin-top:10px;color:var(--dim);font-size:11px">
  <span class="g">→</span> <span class="w">AI-Powered Cognitive Load Manager</span> <span class="d">·</span> <span class="c">Not another to-do list</span><span class="cursor"></span>
</div>
</div>

<div style="display:flex;gap:8px;font-size:10px;margin:10px 0;flex-wrap:wrap">
  <span><span class="g">●</span> <span class="d">Port:</span> <span class="g">localhost:8080</span></span>
  <span class="d">|</span>
  <span><span class="c">◈</span> <span class="d">Stack:</span> <span class="c">React 19 · TanStack Start · Nitro · PostgreSQL</span></span>
  <span class="d">|</span>
  <span><span class="y">★</span> <span class="d">AI:</span> <span class="y">Gemini 2.5 Flash · Llama 3.3 70B (fallback)</span></span>
</div>

<hr class="divider">

<!-- PROBLEM -->
<div class="prompt">cat PROBLEM.md</div>
<div class="block red">
<pre class="r" style="font-size:10px">
╔══════════════════════════════════════════════════════════════╗
║  PRODUCTIVITY APPS ARE LYING TO YOU                         ║
╚══════════════════════════════════════════════════════════════╝</pre>
<p style="color:var(--white);margin:10px 0;font-size:11px;line-height:1.7">
They promise clarity and deliver more complexity. You install a task manager and now you're managing your task manager. You read four books on productivity and end up with four conflicting systems and zero peace of mind.
</p>
<p style="color:var(--dim);font-size:11px;line-height:1.7">
The real problem was never the number of tasks.<br>
It was that <span class="r">nobody ever asked what's actually going on in your head.</span>
</p>
<div style="margin-top:12px;font-size:11px">
  <div style="margin:4px 0"><span class="r">✗</span> <span class="d">Notion — adds more tabs to your brain</span></div>
  <div style="margin:4px 0"><span class="r">✗</span> <span class="d">Todoist — assumes you already know what to do</span></div>
  <div style="margin:4px 0"><span class="r">✗</span> <span class="d">AI chatbots — dumps 10 bullet points, zero prioritization</span></div>
  <div style="margin:4px 0"><span class="r">✗</span> <span class="d">Pomodoro apps — times your work, not your thinking</span></div>
</div>
</div>

<!-- CORE PIPELINE -->
<div class="prompt">cat ARCHITECTURE.md</div>
<div class="block cyan">
<pre class="c" style="font-size:10px;line-height:1.3">
┌─────────────────────────────────────────────────────────────────────────────┐
│                     THINKMATE CORE PIPELINE                                 │
└─────────────────────────────────────────────────────────────────────────────┘</pre>
<div class="pipeline-step" style="margin:14px 0">
  <div class="pbox" style="background:#00ff410d;border:1px solid #00ff4133;color:var(--green)">① BRAIN DUMP</div>
  <div class="parrow">──▶</div>
  <div class="pbox" style="background:#00d4ff0d;border:1px solid #00d4ff33;color:var(--cyan)">② AKINATOR WIZARD</div>
  <div class="parrow">──▶</div>
  <div class="pbox" style="background:#ffd7000d;border:1px solid #ffd70033;color:var(--yellow)">③ COI ANALYSIS</div>
  <div class="parrow">──▶</div>
  <div class="pbox" style="background:#bf5fff0d;border:1px solid #bf5fff33;color:var(--purple)">④ FRAMEWORK SELECT</div>
  <div class="parrow">──▶</div>
  <div class="pbox" style="background:#ff8c000d;border:1px solid #ff8c0033;color:var(--orange)">⑤ ONE NEXT STEP</div>
</div>
</div>

<!-- SYSTEM ARCHITECTURE DIAGRAM -->
<div class="block" style="overflow-x:auto;padding:12px">
<svg width="100%" viewBox="0 0 840 600" role="img">
<title>ThinkMate AI System Architecture Diagram</title>
<desc>Four-layer architecture: UX/Browser, SSR Server, AI Gateway, and Data Persistence</desc>
<defs>
  <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
</defs>

<!-- Layer 1: Browser/UX -->
<rect x="55" y="20" width="770" height="100" rx="4" fill="#00ff410a" stroke="#00ff4122" stroke-width="0.5"/>
<text x="52" y="70" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#00ff41" font-weight="700">UX</text>

<!-- Pages row -->
<rect x="75" y="32" width="108" height="36" rx="3" fill="#00ff410f" stroke="#00ff4155" stroke-width="1"/>
<text x="129" y="47" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#00ff41">BRAIN DUMP</text>
<text x="129" y="60" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#00994d">/brain-dump</text>

<rect x="197" y="32" width="108" height="36" rx="3" fill="#00d4ff0f" stroke="#00d4ff55" stroke-width="1"/>
<text x="251" y="47" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#00d4ff">DASHBOARD</text>
<text x="251" y="60" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#0088aa">/dashboard</text>

<rect x="319" y="32" width="108" height="36" rx="3" fill="#ffd7000f" stroke="#ffd70055" stroke-width="1"/>
<text x="373" y="47" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#ffd700">MATRIX</text>
<text x="373" y="60" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#998800">/matrix</text>

<rect x="441" y="32" width="108" height="36" rx="3" fill="#bf5fff0f" stroke="#bf5fff55" stroke-width="1"/>
<text x="495" y="47" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#bf5fff">DECIDE</text>
<text x="495" y="60" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#773399">/decide</text>

<rect x="563" y="32" width="108" height="36" rx="3" fill="#ff8c000f" stroke="#ff8c0055" stroke-width="1"/>
<text x="617" y="47" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#ff8c00">GOALS</text>
<text x="617" y="60" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#994400">/goals</text>

<rect x="685" y="32" width="108" height="36" rx="3" fill="#ff69b40f" stroke="#ff69b455" stroke-width="1"/>
<text x="739" y="47" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#ff69b4">REFLECT</text>
<text x="739" y="60" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#993366">/reflect</text>

<!-- State hook bar -->
<rect x="75" y="78" width="718" height="32" rx="3" fill="#00ff410a" stroke="#00ff4133" stroke-width="1" stroke-dasharray="4,3"/>
<text x="434" y="92" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#00ff41">useThinkMate Hook — React State Layer</text>
<text x="434" y="104" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#00994d">localStorage ◄──► React State ◄──► CustomEvent (cross-tab sync)</text>

<!-- Arrow down -->
<line x1="434" y1="122" x2="434" y2="158" stroke="#444" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#arr)" opacity="0.6"/>
<text x="480" y="143" font-family="'JetBrains Mono',monospace" font-size="8" fill="#444">HTTP · createServerFn (type-safe RPC)</text>

<!-- Layer 2: Nitro SSR Server -->
<rect x="55" y="160" width="770" height="100" rx="4" fill="#00d4ff0a" stroke="#00d4ff22" stroke-width="0.5"/>
<text x="52" y="212" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#00d4ff" font-weight="700">SSR</text>

<rect x="75" y="172" width="360" height="76" rx="3" fill="#00d4ff0f" stroke="#00d4ff44" stroke-width="1"/>
<text x="255" y="190" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#00d4ff">AI ENGINE — thinkmate.functions.ts</text>
<text x="255" y="206" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#0088aa">conductBrainDumpSession · analyzeDecision</text>
<text x="255" y="220" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#0088aa">breakdownGoal · generateReflection</text>
<text x="255" y="234" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#0088aa">callGateway (multi-provider dispatcher)</text>

<rect x="453" y="172" width="360" height="76" rx="3" fill="#bf5fff0f" stroke="#bf5fff44" stroke-width="1"/>
<text x="633" y="190" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#bf5fff">DATABASE BRIDGE — db.server.ts</text>
<text x="633" y="206" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#773399">saveSessionServer · saveTasksServer</text>
<text x="633" y="220" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#773399">updateTaskServer · getUserTasksServer</text>
<text x="633" y="234" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#773399">signUpUserServer · signInUserServer</text>

<!-- Arrows down from SSR -->
<line x1="255" y1="262" x2="255" y2="295" stroke="#00d4ff" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#arr)" opacity="0.5"/>
<text x="130" y="282" font-family="'JetBrains Mono',monospace" font-size="8" fill="#444">HTTPS API calls</text>
<line x1="633" y1="262" x2="633" y2="295" stroke="#bf5fff" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#arr)" opacity="0.5"/>
<text x="650" y="282" font-family="'JetBrains Mono',monospace" font-size="8" fill="#444">pg queries</text>

<!-- Layer 3: AI Gateway -->
<rect x="55" y="297" width="380" height="130" rx="4" fill="#ff8c000a" stroke="#ff8c0022" stroke-width="0.5"/>
<text x="52" y="362" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#ff8c00" font-weight="700">AI</text>

<text x="240" y="316" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#ff8c00">AI PROVIDER GATEWAY — cascading fallback</text>

<rect x="75" y="322" width="340" height="22" rx="3" fill="#00ff410f" stroke="#00ff4133" stroke-width="1"/>
<text x="140" y="337" font-family="'JetBrains Mono',monospace" font-size="8" fill="#00ff41">① OpenRouter</text>
<text x="270" y="337" font-family="'JetBrains Mono',monospace" font-size="8" fill="#00994d">→ Gemini 2.5 Flash</text>

<rect x="75" y="350" width="340" height="22" rx="3" fill="#00d4ff0f" stroke="#00d4ff33" stroke-width="1"/>
<text x="140" y="365" font-family="'JetBrains Mono',monospace" font-size="8" fill="#00d4ff">② Groq</text>
<text x="270" y="365" font-family="'JetBrains Mono',monospace" font-size="8" fill="#0088aa">→ Llama 3.3 70B</text>

<rect x="75" y="378" width="340" height="22" rx="3" fill="#ffd7000f" stroke="#ffd70033" stroke-width="1"/>
<text x="140" y="393" font-family="'JetBrains Mono',monospace" font-size="8" fill="#ffd700">③ Direct Gemini API</text>
<text x="270" y="393" font-family="'JetBrains Mono',monospace" font-size="8" fill="#998800">→ gemini-2.5-flash</text>

<rect x="75" y="406" width="340" height="22" rx="3" fill="#bf5fff0f" stroke="#bf5fff33" stroke-width="1"/>
<text x="140" y="421" font-family="'JetBrains Mono',monospace" font-size="8" fill="#bf5fff">④ Lovable Gateway</text>
<text x="270" y="421" font-family="'JetBrains Mono',monospace" font-size="8" fill="#773399">→ Gemini 2.5 Flash</text>

<!-- Layer 3: Data Persistence -->
<rect x="453" y="297" width="372" height="130" rx="4" fill="#ffd7000a" stroke="#ffd70022" stroke-width="0.5"/>
<text x="450" y="362" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#ffd700" font-weight="700">DB</text>

<text x="637" y="316" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#ffd700">POSTGRESQL — 8 tables</text>

<rect x="463" y="322" width="352" height="22" rx="3" fill="#ffd7000f" stroke="#ffd70033" stroke-width="1"/>
<text x="639" y="337" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#ffd700">users · sessions · brain_sessions · tasks</text>

<rect x="463" y="350" width="352" height="22" rx="3" fill="#ffd7000f" stroke="#ffd70033" stroke-width="1"/>
<text x="639" y="365" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#998800">load_history · reflections · goals · decisions</text>

<rect x="463" y="378" width="352" height="22" rx="3" fill="#00ff410f" stroke="#00ff4133" stroke-width="1"/>
<text x="639" y="393" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#00ff41">CLIENT: localStorage (11 named keys)</text>

<rect x="463" y="406" width="352" height="22" rx="3" fill="#00ff410a" stroke="#00ff4122" stroke-width="1" stroke-dasharray="3,2"/>
<text x="639" y="421" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#00994d">Demo mode → localStorage only, no DB writes</text>

</svg>
</div>

<!-- TECH STACK -->
<div class="prompt">cat STACK.md</div>
<div class="block cyan">
<pre class="c" style="font-size:10px;line-height:1.3">
┌──────────────────┬──────────────────────────────────────────────────────┐
│ LAYER            │ TECHNOLOGY                                           │
├──────────────────┼──────────────────────────────────────────────────────┤
│ Framework        │ React 19                                             │
│ Router           │ TanStack Router v1 (file-based routes)              │
│ SSR / Server Fns │ TanStack Start + Nitro                              │
│ Styling          │ Tailwind CSS v4 + tw-animate-css                    │
│ UI Components    │ Radix UI (shadcn/ui patterns) + Lucide React        │
│ Forms            │ React Hook Form + Zod                               │
│ State            │ Custom useThinkMate hook (localStorage-backed)       │
│ Build Tool       │ Vite 7                                              │
├──────────────────┼──────────────────────────────────────────────────────┤
│ Server Runtime   │ Nitro (via TanStack Start)                          │
│ Server Functions │ createServerFn — type-safe RPC                      │
│ Database Client  │ pg (node-postgres)                                  │
│ Validation       │ Zod schemas (shared client/server)                  │
│ Auth             │ Custom session tokens + bcrypt (no third-party)     │
├──────────────────┼──────────────────────────────────────────────────────┤
│ AI Primary       │ OpenRouter → Gemini 2.5 Flash      (sk-or- prefix) │
│ AI Fallback 1    │ Groq → Llama 3.3 70B               (gsk_ prefix)   │
│ AI Fallback 2    │ Direct Gemini API → gemini-2.5-flash (AIzaSy prefix)│
│ AI Fallback 3    │ Lovable Gateway → Gemini 2.5 Flash  (AQ. prefix)   │
│ AI Pattern       │ 3-stage structured JSON prompt chain                │
└──────────────────┴──────────────────────────────────────────────────────┘</pre>
</div>

<!-- COI -->
<div class="prompt">cat features/COI.md</div>
<div class="block yellow">
<pre class="y" style="font-size:10px;line-height:1.3">
╔══════════════════════════════════════════════════════════════╗
║         COGNITIVE OVERLOAD INDEX  ·  COI™                   ║
║         "Not a score. A cognitive health vital sign."        ║
╚══════════════════════════════════════════════════════════════╝</pre>
<table style="margin:12px 0">
  <tr><th>DIMENSION</th><th>SIGNAL DETECTED</th><th style="text-align:right">WEIGHT</th></tr>
  <tr><td class="w">Active task volume</td><td class="d">how many open loops exist</td><td style="text-align:right" class="y">25%</td></tr>
  <tr><td class="w">Deadline pressure</td><td class="d">urgency density across the dump</td><td style="text-align:right" class="o">30%</td></tr>
  <tr><td class="w">Dependency complexity</td><td class="d">how many tasks block others</td><td style="text-align:right" class="c">15%</td></tr>
  <tr><td class="w">Decision count</td><td class="d">items requiring judgment vs action</td><td style="text-align:right" class="p">20%</td></tr>
  <tr><td class="w">Context switching</td><td class="d">domain mix: work / health / finance</td><td style="text-align:right" class="g">10%</td></tr>
</table>
<div style="margin:14px 0">
  <div class="zone" style="background:#00ff4115;border:1px solid #00ff4133;color:var(--green)">🟢 &nbsp;0 – 39 &nbsp;&nbsp; GREEN ZONE &nbsp;&nbsp;<span class="d">Focused execution. You're clear.</span></div>
  <div class="zone" style="background:#ffd70015;border:1px solid #ffd70033;color:var(--yellow)">🟡 &nbsp;40 – 70 &nbsp; YELLOW ZONE &nbsp;<span class="d">Protect deep work. Buffer incoming.</span></div>
  <div class="zone" style="background:#ff413615;border:1px solid #ff413633;color:var(--red)">🔴 &nbsp;71 – 100 &nbsp;RED ZONE &nbsp;&nbsp;&nbsp;&nbsp;<span class="d">Delegate, defer, or decompress.</span></div>
</div>
</div>

<!-- BOTTLENECK -->
<div class="prompt">cat features/BOTTLENECK.md</div>
<div class="block orange">
<pre class="o" style="font-size:10px">
╔══════════════════════════════════════════════════════════════╗
║  BOTTLENECK & HIDDEN DEPENDENCY DETECTION                    ║
║  "The feature only AI can do."                              ║
╚══════════════════════════════════════════════════════════════╝</pre>
<svg width="100%" viewBox="0 0 760 280" role="img" style="margin:14px 0">
<title>Bottleneck dependency graph</title>
<desc>Manager approval node blocking three downstream tasks</desc>
<defs>
  <marker id="bo" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
</defs>
<rect x="280" y="30" width="200" height="60" rx="6" fill="#ff8c0015" stroke="#ff8c00" stroke-width="1.5"/>
<text x="380" y="55" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="700" fill="#ff8c00">⚠ BOTTLENECK</text>
<text x="380" y="72" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#ff8c00">Manager approval</text>
<rect x="326" y="18" width="108" height="18" rx="9" fill="#ff8c00"/>
<text x="380" y="30" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#0a0a0a">BLOCKS 3 TASKS</text>
<rect x="80" y="170" width="160" height="48" rx="4" fill="#0a0a0a" stroke="#444" stroke-width="1"/>
<text x="160" y="192" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#888">Finalize project report</text>
<text x="160" y="207" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#555">blocked ✗</text>
<rect x="300" y="170" width="160" height="48" rx="4" fill="#0a0a0a" stroke="#444" stroke-width="1"/>
<text x="380" y="192" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#888">Submit to client</text>
<text x="380" y="207" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#555">blocked ✗</text>
<rect x="520" y="170" width="160" height="48" rx="4" fill="#0a0a0a" stroke="#444" stroke-width="1"/>
<text x="600" y="192" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#888">Schedule review</text>
<text x="600" y="207" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#555">blocked ✗</text>
<line x1="330" y1="90" x2="200" y2="170" stroke="#ff8c00" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#bo)" opacity="0.7"/>
<line x1="380" y1="90" x2="380" y2="170" stroke="#ff8c00" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#bo)" opacity="0.7"/>
<line x1="430" y1="90" x2="560" y2="170" stroke="#ff8c00" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#bo)" opacity="0.7"/>
<rect x="200" y="240" width="360" height="28" rx="4" fill="#ff8c0015" stroke="#ff8c0044" stroke-width="1"/>
<text x="380" y="258" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#ff8c00">→ Escalate before 2 PM · Unblocks 4.5h of stuck work</text>
</svg>
<div style="margin-top:4px;font-size:11px;color:var(--dim)">
Hidden dependency inference — tasks listed independently, inferred by AI:<br>
<span class="o">"Update resume"</span> <span class="d">must precede</span> <span class="o">"Apply to internship"</span> <span class="d">— connected automatically.</span>
</div>
</div>

<!-- FRAMEWORK INTELLIGENCE -->
<div class="prompt">cat features/FRAMEWORK_INTELLIGENCE.md</div>
<div class="block purple">
<pre class="p" style="font-size:10px">
╔══════════════════════════════════════════════════════════════╗
║  MULTI-FRAMEWORK INTELLIGENCE LAYER                          ║
║  "Every book teaches one framework. We know all of them."   ║
╚══════════════════════════════════════════════════════════════╝</pre>
<svg width="100%" viewBox="0 0 760 340" role="img" style="margin:12px 0">
<title>Framework selection flowchart</title>
<desc>Decision tree showing how AI selects the right productivity framework based on dump signals</desc>
<defs>
  <marker id="fp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
</defs>
<rect x="280" y="14" width="200" height="44" rx="6" fill="#bf5fff15" stroke="#bf5fff" stroke-width="1.5"/>
<text x="380" y="35" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="700" fill="#bf5fff">DUMP ANALYZED</text>
<text x="380" y="51" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#773399">AI reads your signals</text>
<line x1="310" y1="58" x2="100" y2="120" stroke="#bf5fff" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#fp)" opacity="0.5"/>
<line x1="340" y1="58" x2="218" y2="120" stroke="#bf5fff" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#fp)" opacity="0.5"/>
<line x1="380" y1="58" x2="380" y2="120" stroke="#bf5fff" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#fp)" opacity="0.5"/>
<line x1="420" y1="58" x2="540" y2="120" stroke="#bf5fff" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#fp)" opacity="0.5"/>
<line x1="450" y1="58" x2="670" y2="120" stroke="#bf5fff" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#fp)" opacity="0.5"/>
<rect x="24" y="120" width="152" height="80" rx="4" fill="#00ff4110" stroke="#00ff4144" stroke-width="1"/>
<text x="100" y="141" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#00ff41">EISENHOWER</text>
<text x="100" y="157" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#00994d">urgent × important</text>
<text x="100" y="171" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#555">IF: hard deadlines</text>
<text x="100" y="187" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#555">+ time pressure</text>
<rect x="148" y="120" width="140" height="80" rx="4" fill="#00d4ff10" stroke="#00d4ff44" stroke-width="1"/>
<text x="218" y="141" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#00d4ff">OKR DECOMP</text>
<text x="218" y="157" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#0088aa">goals → key results</text>
<text x="218" y="171" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#555">IF: long-term goal</text>
<text x="218" y="187" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#555">no clear steps</text>
<rect x="300" y="120" width="160" height="80" rx="4" fill="#ffd70010" stroke="#ffd70044" stroke-width="1"/>
<text x="380" y="141" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#ffd700">ABCDE METHOD</text>
<text x="380" y="157" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#998800">A=must B=should</text>
<text x="380" y="171" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#555">IF: 8+ tasks</text>
<text x="380" y="187" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#555">unclear priority</text>
<rect x="472" y="120" width="136" height="80" rx="4" fill="#ff8c0010" stroke="#ff8c0044" stroke-width="1"/>
<text x="540" y="141" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#ff8c00">MIT METHOD</text>
<text x="540" y="157" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#994400">pick only 3 tasks</text>
<text x="540" y="171" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#555">IF: COI &gt; 70</text>
<text x="540" y="187" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#555">cognitive overload</text>
<rect x="620" y="120" width="120" height="80" rx="4" fill="#ff69b410" stroke="#ff69b444" stroke-width="1"/>
<text x="680" y="141" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" fill="#ff69b4">MIND SWEEP</text>
<text x="680" y="157" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#993366">GTD capture</text>
<text x="680" y="171" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#555">IF: anxiety</text>
<text x="680" y="187" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="#555">emotional weight</text>
<line x1="100" y1="200" x2="380" y2="268" stroke="#555" stroke-width="0.5" stroke-dasharray="3,3" marker-end="url(#fp)" opacity="0.3"/>
<line x1="218" y1="200" x2="380" y2="268" stroke="#555" stroke-width="0.5" stroke-dasharray="3,3" marker-end="url(#fp)" opacity="0.3"/>
<line x1="380" y1="200" x2="380" y2="268" stroke="#555" stroke-width="0.5" stroke-dasharray="3,3" marker-end="url(#fp)" opacity="0.3"/>
<line x1="540" y1="200" x2="380" y2="268" stroke="#555" stroke-width="0.5" stroke-dasharray="3,3" marker-end="url(#fp)" opacity="0.3"/>
<line x1="680" y1="200" x2="380" y2="268" stroke="#555" stroke-width="0.5" stroke-dasharray="3,3" marker-end="url(#fp)" opacity="0.3"/>
<rect x="230" y="268" width="300" height="48" rx="6" fill="#bf5fff20" stroke="#bf5fff" stroke-width="1.5"/>
<text x="380" y="289" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="700" fill="#bf5fff">ONE SMART NEXT STEP</text>
<text x="380" y="307" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9" fill="#773399">Framework: Eisenhower + MIT · Why: high urgency + overload</text>
</svg>
</div>

<!-- EXPLAINABLE AI -->
<div class="prompt">cat features/XAI.md</div>
<div class="block green">
<pre class="g" style="font-size:10px">
╔══════════════════════════════════════════════════════════════╗
║  EXPLAINABLE AI — "We show our work. Most AI doesn't."      ║
╚══════════════════════════════════════════════════════════════╝</pre>
<div style="margin:12px 0;font-size:11px">
<div style="color:var(--dim);margin-bottom:8px"><span class="g">AI chose: </span><span class="w">"Prioritize Critical Blockers — Project Omega"</span></div>
<table>
  <tr><th>FACTOR</th><th style="text-align:right">WEIGHT</th></tr>
  <tr><td class="w">Deadline impact (Friday)</td><td style="text-align:right"><div class="coi-bar"><div class="coi-fill" style="width:40%;background:#ff4136"></div></div><span class="r">40%</span></td></tr>
  <tr><td class="w">Blocks 3 downstream tasks</td><td style="text-align:right"><div class="coi-bar"><div class="coi-fill" style="width:30%;background:#ff8c00"></div></div><span class="o">30%</span></td></tr>
  <tr><td class="w">Aligns with stated goal</td><td style="text-align:right"><div class="coi-bar"><div class="coi-fill" style="width:20%;background:#00d4ff"></div></div><span class="c">20%</span></td></tr>
  <tr><td class="w">Effort: short (~25 min)</td><td style="text-align:right"><div class="coi-bar"><div class="coi-fill" style="width:10%;background:#00ff41"></div></div><span class="g">10%</span></td></tr>
</table>
<div style="margin-top:10px;color:var(--dim);font-size:10px"><span class="g">→</span> Starting this TODAY prevents a cascade failure across 3 blocked tasks.</div>
</div>
</div>

<!-- AUTH & SECURITY -->
<div class="prompt">cat AUTH.md</div>
<div class="block pink">
<pre class="pk" style="font-size:10px">
╔══════════════════════════════════════════════════════════════╗
║  AUTHENTICATION & SECURITY                                   ║
╚══════════════════════════════════════════════════════════════╝</pre>
<div style="margin:10px 0;font-size:11px;line-height:2">
  <div><span class="pk">◈</span> <span class="w">No external auth provider</span> <span class="d">— fully self-hosted in db.server.ts</span></div>
  <div><span class="pk">◈</span> <span class="w">Passwords hashed with bcrypt</span> <span class="d">server-side before storage</span></div>
  <div><span class="pk">◈</span> <span class="w">Session tokens</span> <span class="d">are opaque random strings, stored in PostgreSQL sessions table</span></div>
  <div><span class="pk">◈</span> <span class="w">Token validated</span> <span class="d">on every server function call before any DB access</span></div>
  <div><span class="pk">◈</span> <span class="w">AuthGuard component</span> <span class="d">wraps all protected routes — redirects to /login if unauthenticated</span></div>
  <div><span class="pk">◈</span> <span class="w">Demo mode</span> <span class="d">bypasses DB entirely — AI calls work, zero data is persisted</span></div>
</div>
<table style="margin-top:8px">
  <tr><th>FLOW</th><th>MECHANISM</th></tr>
  <tr><td class="w">Sign up</td><td class="d">signUpUserServer() → bcrypt hash → INSERT users</td></tr>
  <tr><td class="w">Sign in</td><td class="d">signInUserServer() → bcrypt compare → INSERT sessions → return token</td></tr>
  <tr><td class="w">Request auth</td><td class="d">read token from localStorage → validate against sessions table</td></tr>
  <tr><td class="w">Sign out</td><td class="d">signOutUserServer() → DELETE session row → clear localStorage</td></tr>
</table>
</div>

<!-- STATE MANAGEMENT -->
<div class="prompt">cat STATE.md</div>
<div class="block cyan">
<pre class="c" style="font-size:10px">
╔══════════════════════════════════════════════════════════════╗
║  STATE MANAGEMENT — useThinkMate Hook                        ║
╚══════════════════════════════════════════════════════════════╝</pre>
<div style="margin:10px 0;font-size:11px;color:var(--dim)">
Custom React hook at <span class="c">src/lib/thinkmate-store.ts</span> — the single source of truth for all client state.
</div>
<table>
  <tr><th>METHOD</th><th>PURPOSE</th></tr>
  <tr><td class="c">saveAnalysis()</td><td class="d">Persists AI results to localStorage + PostgreSQL (fire-and-forget)</td></tr>
  <tr><td class="c">toggleTask()</td><td class="d">Marks task complete/incomplete, synced to DB</td></tr>
  <tr><td class="c">moveTask()</td><td class="d">Reassigns task to a different Eisenhower quadrant</td></tr>
  <tr><td class="c">addTask()</td><td class="d">Manually adds a task (used in /goals and /reflect)</td></tr>
  <tr><td class="c">initializeFromDB()</td><td class="d">On auth, hydrates localStorage from server DB</td></tr>
  <tr><td class="c">clearAll()</td><td class="d">Wipes all stored state</td></tr>
</table>
<div style="margin-top:14px">
<div style="color:var(--dim);font-size:10px;margin-bottom:6px">localStorage keys (persisted under <span class="c">thinkmate:state:v1</span>):</div>
<table>
  <tr><th>KEY</th><th>CONTENTS</th></tr>
  <tr><td class="c">thinkmate:state:v1</td><td class="d">Full ThinkMateState — tasks, COI score, next step</td></tr>
  <tr><td class="c">thinkmate-tasks</td><td class="d">Task array mirror</td></tr>
  <tr><td class="c">thinkmate-load-history</td><td class="d">Last 7 {date, score, risk_level} entries</td></tr>
  <tr><td class="c">thinkmate-session-context</td><td class="d">Session summary + classification reasons</td></tr>
  <tr><td class="c">thinkmate-reflections</td><td class="d">Array of evening reflection results</td></tr>
  <tr><td class="c">thinkmate-goals</td><td class="d">Array of goal breakdown results</td></tr>
  <tr><td class="c">thinkmate-session-token</td><td class="d">Auth session token</td></tr>
  <tr><td class="c">thinkmate-user-id</td><td class="d">Authenticated user UUID</td></tr>
  <tr><td class="c">thinkmate-display-name</td><td class="d">User display name</td></tr>
  <tr><td class="c">thinkmate-demo-mode</td><td class="d">"true" when in demo — skips all DB writes</td></tr>
  <tr><td class="c">thinkmate-explain-expanded</td><td class="d">UI state for XAI rationale panel</td></tr>
</table>
</div>
</div>

<!-- DATABASE SCHEMA -->
<div class="prompt">cat DATABASE.md</div>
<div class="block yellow">
<pre class="y" style="font-size:10px">
╔══════════════════════════════════════════════════════════════╗
║  DATABASE SCHEMA — PostgreSQL                                ║
╚══════════════════════════════════════════════════════════════╝</pre>
<div class="col2" style="margin-top:12px">
  <div>
    <div style="color:var(--yellow);font-size:10px;font-weight:700;margin-bottom:6px">users</div>
    <pre class="d" style="font-size:9px;line-height:1.6">id            UUID PK
email         TEXT UNIQUE
password_hash TEXT
display_name  TEXT
created_at    TIMESTAMP</pre>
    <div style="color:var(--yellow);font-size:10px;font-weight:700;margin:10px 0 6px">sessions</div>
    <pre class="d" style="font-size:9px;line-height:1.6">id         UUID PK
user_id    UUID → users
token      TEXT UNIQUE
created_at TIMESTAMP
expires_at TIMESTAMP</pre>
    <div style="color:var(--yellow);font-size:10px;font-weight:700;margin:10px 0 6px">load_history</div>
    <pre class="d" style="font-size:9px;line-height:1.6">id          UUID PK
user_id     UUID → users
score       INT (0–100)
risk_level  ENUM low|moderate|high
recorded_at TIMESTAMP</pre>
    <div style="color:var(--yellow);font-size:10px;font-weight:700;margin:10px 0 6px">goals</div>
    <pre class="d" style="font-size:9px;line-height:1.6">id         UUID PK
user_id    UUID → users
goal_text  TEXT
timeline   TEXT
result     JSONB
created_at TIMESTAMP</pre>
  </div>
  <div>
    <div style="color:var(--yellow);font-size:10px;font-weight:700;margin-bottom:6px">brain_sessions</div>
    <pre class="d" style="font-size:9px;line-height:1.6">id                    UUID PK
user_id               UUID → users
brain_dump_text       TEXT
conversation_history  JSONB
analysis              JSONB
session_summary       TEXT
classification_exp    JSONB
created_at            TIMESTAMP</pre>
    <div style="color:var(--yellow);font-size:10px;font-weight:700;margin:10px 0 6px">tasks</div>
    <pre class="d" style="font-size:9px;line-height:1.6">id                UUID PK
user_id           UUID → users
session_id        UUID → brain_sessions
title             TEXT
priority          ENUM high|medium|low
quadrant          ENUM do_now|schedule|delegate|ignore
completed         BOOLEAN
estimated_minutes INT
deadline          TEXT
dependencies      JSONB
rationale         TEXT
carried_over_from DATE
created_at        TIMESTAMP</pre>
    <div style="color:var(--yellow);font-size:10px;font-weight:700;margin:10px 0 6px">reflections</div>
    <pre class="d" style="font-size:9px;line-height:1.6">id               UUID PK
user_id          UUID → users
completed_tasks  JSONB
incomplete_tasks JSONB
free_text        TEXT
summary          TEXT
encouragement    TEXT
tomorrow_focus   TEXT
carried_over     JSONB
created_at       TIMESTAMP</pre>
  </div>
</div>
</div>

<!-- AI FALLBACK WATERFALL -->
<div class="prompt">cat features/AI_GATEWAY.md</div>
<div class="block" style="border-color:#bf5fff33;background:#bf5fff08">
<pre class="p" style="font-size:10px">
╔══════════════════════════════════════════════════════════════╗
║  AI PROVIDER FALLBACK WATERFALL                              ║
║  "ThinkMate never goes down due to a single AI outage."     ║
╚══════════════════════════════════════════════════════════════╝</pre>
<div style="margin:14px 0;font-size:11px">
<div style="margin:6px 0;display:flex;align-items:center;gap:10px">
  <div style="padding:5px 12px;background:#00ff410d;border:1px solid #00ff4133;border-radius:3px;color:var(--green);font-size:10px;font-weight:700;min-width:160px">① OpenRouter</div>
  <span class="d" style="font-size:10px">key prefix: <span class="g">sk-or-</span> · model: <span class="w">google/gemini-2.5-flash</span></span>
</div>
<div style="margin-left:20px;color:var(--dim);font-size:9px;margin-bottom:4px">↓ if fails</div>
<div style="margin:6px 0;display:flex;align-items:center;gap:10px">
  <div style="padding:5px 12px;background:#00d4ff0d;border:1px solid #00d4ff33;border-radius:3px;color:var(--cyan);font-size:10px;font-weight:700;min-width:160px">② Groq</div>
  <span class="d" style="font-size:10px">key prefix: <span class="c">gsk_</span> · model: <span class="w">llama-3.3-70b-versatile</span></span>
</div>
<div style="margin-left:20px;color:var(--dim);font-size:9px;margin-bottom:4px">↓ if fails</div>
<div style="margin:6px 0;display:flex;align-items:center;gap:10px">
  <div style="padding:5px 12px;background:#ffd7000d;border:1px solid #ffd70033;border-radius:3px;color:var(--yellow);font-size:10px;font-weight:700;min-width:160px">③ Direct Gemini</div>
  <span class="d" style="font-size:10px">key prefix: <span class="y">AIzaSy</span> · model: <span class="w">gemini-2.5-flash</span> · responseSchema JSON</span>
</div>
<div style="margin-left:20px;color:var(--dim);font-size:9px;margin-bottom:4px">↓ if fails</div>
<div style="margin:6px 0;display:flex;align-items:center;gap:10px">
  <div style="padding:5px 12px;background:#bf5fff0d;border:1px solid #bf5fff33;border-radius:3px;color:var(--purple);font-size:10px;font-weight:700;min-width:160px">④ Lovable Gateway</div>
  <span class="d" style="font-size:10px">key prefix: <span class="p">AQ.</span> · model: <span class="w">google/gemini-2.5-flash</span></span>
</div>
<div style="margin-left:20px;color:var(--dim);font-size:9px;margin-bottom:4px">↓ all fail</div>
<div style="margin:6px 0;display:flex;align-items:center;gap:10px">
  <div style="padding:5px 12px;background:#ff41360d;border:1px solid #ff413633;border-radius:3px;color:var(--red);font-size:10px;font-weight:700;min-width:160px">✗ Error thrown</div>
  <span class="d" style="font-size:10px">collected error messages surfaced to caller</span>
</div>
</div>
<div style="font-size:10px;color:var(--dim);margin-top:4px">Configure via <span class="w">.env</span> — key prefix auto-detected to route to correct provider. Only one key needed.</div>
</div>

<!-- GETTING STARTED -->
<div class="prompt">cat GETTING_STARTED.md</div>
<div class="block green">
<pre class="g" style="font-size:10px">
╔══════════════════════════════════════════════════════════════╗
║  GETTING STARTED                                             ║
╚══════════════════════════════════════════════════════════════╝</pre>
<div style="margin:12px 0;font-size:11px">
<div class="y" style="font-weight:700;margin-bottom:6px">Prerequisites</div>
<div style="color:var(--dim);line-height:2">
  <div><span class="g">▶</span> Node.js 18+ or Bun</div>
  <div><span class="g">▶</span> API key for one of: OpenRouter · Groq · Gemini · Lovable</div>
  <div><span class="g">▶</span> PostgreSQL instance <span class="d">(optional — app runs in demo mode without it)</span></div>
</div>

<div class="y" style="font-weight:700;margin:14px 0 6px">Environment Setup</div>
<pre style="background:#0d0d0d;border:1px solid #1e1e1e;padding:12px;border-radius:3px;font-size:10px;color:var(--dim)"><span class="g"># .env — only ONE key needed, prefix auto-detected</span>
<span class="c">GEMINI_API_KEY</span>=<span class="y">AIzaSy...</span>     <span class="d"># Direct Google Gemini</span>
<span class="c">OPENROUTER_API_KEY</span>=<span class="y">sk-or-...</span> <span class="d"># OpenRouter</span>
<span class="c">GROQ_API_KEY</span>=<span class="y">gsk_...</span>         <span class="d"># Groq</span>
<span class="c">LOVABLE_API_KEY</span>=<span class="y">AQ....</span>       <span class="d"># Lovable Gateway</span>

<span class="g"># Optional — omit to use demo mode (localStorage only)</span>
<span class="c">DATABASE_URL</span>=<span class="y">postgresql://user:pass@host:5432/dbname</span></pre>

<div class="y" style="font-weight:700;margin:14px 0 6px">Run</div>
<pre style="background:#0d0d0d;border:1px solid #1e1e1e;padding:12px;border-radius:3px;font-size:10px;color:var(--dim)"><span class="g">npm run dev</span>    <span class="d"># or</span>  <span class="g">bun run dev</span>

<span class="d"># Windows launchers</span>
<span class="g">start.bat</span>     <span class="d"># auto-detects package manager</span>
<span class="g">run.bat</span>       <span class="d"># quick launch</span></pre>
<div style="margin-top:8px;font-size:10px;color:var(--dim)">App available at <span class="g">http://localhost:8080</span></div>
</div>
</div>

<!-- WHAT WE BUILT / WHAT WE DIDN'T -->
<div class="prompt">cat DECISIONS.md</div>
<div class="col2">
  <div class="block green" style="margin:0">
    <div class="g" style="font-weight:700;font-size:11px;margin-bottom:10px">✅ WHAT'S INCLUDED</div>
    <div style="font-size:10px;line-height:2">
      <div><span class="g">▶</span> Brain Dump + Akinator Wizard</div>
      <div><span class="g">▶</span> Cognitive Overload Index (COI)</div>
      <div><span class="g">▶</span> Bottleneck & Dependency Detection</div>
      <div><span class="g">▶</span> Multi-Framework Intelligence Layer</div>
      <div><span class="g">▶</span> Explainable AI Decision Card</div>
      <div><span class="g">▶</span> Eisenhower Matrix + drag-and-drop override</div>
      <div><span class="g">▶</span> Evening Reflection + Carry Forward</div>
      <div><span class="g">▶</span> ONE Smart Next Step</div>
      <div><span class="g">▶</span> Custom auth (bcrypt + session tokens)</div>
      <div><span class="g">▶</span> Multi-provider AI fallback waterfall</div>
      <div><span class="g">▶</span> Full demo mode (no DB required)</div>
    </div>
  </div>
  <div class="block red" style="margin:0">
    <div class="r" style="font-weight:700;font-size:11px;margin-bottom:10px">✗ INTENTIONALLY EXCLUDED</div>
    <div style="font-size:10px;line-height:2">
      <div><span class="r">✗</span> <span class="d">Focus Timer — Pomodoro clocks already exist</span></div>
      <div><span class="r">✗</span> <span class="d">Weekly PDF/email report — async, undemoable</span></div>
      <div><span class="r">✗</span> <span class="d">Morning push notifications — zero novelty</span></div>
      <div><span class="r">✗</span> <span class="d">Team Mode — fundamentally different product</span></div>
      <div><span class="r">✗</span> <span class="d">Cognitive Twin — requires weeks of user data</span></div>
      <div><span class="r">✗</span> <span class="d">Pattern Profiler — needs 3+ sessions to surface anything</span></div>
    </div>
    <div style="margin-top:12px;font-size:9px;color:var(--dim)">Cutting things is the harder decision. It's also the right one.</div>
  </div>
</div>

<!-- PHILOSOPHY -->
<div class="prompt">cat PHILOSOPHY.md</div>
<div class="block" style="border-color:#333;text-align:center;padding:28px">
<pre class="w" style="font-size:11px;line-height:1.8">
  ╔═══════════════════════════════════════════╗
  ║                                           ║
  ║   AI recommends.  Humans decide.          ║
  ║                              Always.      ║
  ║                                           ║
  ╚═══════════════════════════════════════════╝
</pre>
<div style="color:var(--dim);font-size:10px;margin-top:4px">
ThinkMate is not an autonomous agent. It surfaces signal from noise.<br>
What you do with that signal is entirely yours.
</div>
</div>

<!-- FOOTER -->
<div style="font-size:10px;color:var(--dim);margin-top:16px;line-height:2">
  <span class="g">◉</span> Stack: <span class="c">React 19 · TanStack Start · Nitro · PostgreSQL · Vite 7</span><br>
  <span class="y">★</span> AI: <span class="w">Gemini 2.5 Flash (primary) · Llama 3.3 70B (fallback)</span><br>
  <span class="p">⬡</span> License: <span class="w">MIT</span><br>
  <br>
  <span class="d">─────────────────────────────────────────────</span><br>
  <span class="g">ThinkMate</span> <span class="d">·</span> <span class="c">Because the bottleneck was never your effort.</span><span class="cursor"></span>
</div>

</div>
</body>
</html>
