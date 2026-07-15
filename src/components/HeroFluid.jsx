import { useEffect, useRef } from 'react';

// Hero 流體背景（WebGL 密度場，仿 brik）＋直紋毛玻璃後處理：
// - 三顆 metaball ＋滑鼠雙液滴（本體+殘影）加總成「單一場」→ 融合天生無縫
// - fbm 域扭曲 → 形狀不規則、邊緣持續蠕動
// - 顏色＝長距離重疊的連續 ramp：背景 → 亮邊 → 深橘 → 琥珀 → 金 → 微亮核（橘→黃有過渡）
// - 滑鼠液滴帶強度：離場時位置不動、強度慢慢歸零 → 原地融回流體；殘影液滴慢速跟隨=拖尾
// - fluidSim（模組單例）把 blob / 液滴的即時位置分享給 Hero 的名字互動（同一個時鐘）
// - 每根直紋以柱狀透鏡公式重新取樣底下的流體，再疊細微亮／暗稜線與乳白霧面
// 效能：單次 GPU shader、DPR 上限 1.25；離屏/背景分頁暫停；reduce-motion 畫靜態一幀。

// 與 shader 內完全同步的模擬狀態（名字互動用）：
// blobs(w,h) 回傳三顆 blob 的螢幕座標（px、y 自頂部）與有效半徑；mouse/trail 為平滑後的液滴。
export const fluidSim = {
  start: performance.now(),
  mouse: { x: 0.5, y: 0.5, s: 0 },
  trail: { x: 0.5, y: 0.5, s: 0 },
  blobs(w, h) {
    const t = ((performance.now() - this.start) / 1000) * 0.105;
    const aspect = w / h;
    // 直式手機以高度計算半徑時，預設 blob 會佔掉大半個窄螢幕；只縮小
    // 三顆常駐 blob，保留游標液滴與桌面版原本的互動尺度。
    const blobScale = w <= 768 ? 0.38 : 1;
    // 與 FRAG 內 c1/c2/c3 同公式（場座標 x 已乘 aspect，轉回 uv 再轉 px）
    const mk = (fx, fy, k) => ({
      x: (fx / aspect) * w,
      y: (1 - fy) * h,
      // 名字互動跟可見流體邊界（場強約 0.78）對齊；舊值取到場強 0.2，
      // 半徑多出約一倍，尚未碰到流體的字也會整片亮起。
      r: Math.sqrt(Math.max((k * blobScale) / 0.78 - 0.003, 0)) * h,
    });
    return [
      mk(aspect * 0.30 + Math.sin(t * 1.3) * 0.11 * aspect, 0.70 + Math.cos(t * 0.9) * 0.16, 0.055),
      mk(aspect * 0.74 + Math.cos(t * 1.1) * 0.12 * aspect, 0.58 + Math.sin(t * 1.4) * 0.18, 0.065),
      mk(aspect * 0.50 + Math.sin(t * 0.8 + 2.0) * 0.13 * aspect, 0.14 + Math.cos(t * 1.2 + 1.0) * 0.14, 0.050),
    ];
  },
};

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uRibCount;
uniform float uBlobScale;
uniform vec3 uM1;
uniform vec3 uM2;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

vec3 fluidColor(vec2 uv) {
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.105;

  vec2 w = vec2(
    fbm(p * 1.7 + vec2(t * 0.9, -t * 0.6)),
    fbm(p * 1.7 + vec2(5.2 - t * 0.7, 2.8 + t * 0.8))
  );
  vec2 q = p + (w - 0.5) * 0.38;

  vec2 c1 = vec2(aspect * 0.30, 0.70) + vec2(sin(t * 1.3) * 0.11 * aspect, cos(t * 0.9) * 0.16);
  vec2 c2 = vec2(aspect * 0.74, 0.58) + vec2(cos(t * 1.1) * 0.12 * aspect, sin(t * 1.4) * 0.18);
  vec2 c3 = vec2(aspect * 0.50, 0.14) + vec2(sin(t * 0.8 + 2.0) * 0.13 * aspect, cos(t * 1.2 + 1.0) * 0.14);

  float f = 0.0;
  f += (0.055 * uBlobScale) / (dot(q - c1, q - c1) + 0.003);
  f += (0.065 * uBlobScale) / (dot(q - c2, q - c2) + 0.003);
  f += (0.050 * uBlobScale) / (dot(q - c3, q - c3) + 0.003);

  vec2 m1 = vec2(uM1.x * aspect, uM1.y);
  vec2 m2 = vec2(uM2.x * aspect, uM2.y);
  f += uM1.z * 0.018 / (dot(q - m1, q - m1) + 0.002);
  f += uM2.z * 0.011 / (dot(q - m2, q - m2) + 0.002);

  // 色帶互融：對場值疊 noise 抖動，讓色帶邊界彼此滲透
  float g = f + (fbm(p * 2.6 + vec2(t * 0.35, -t * 0.28)) - 0.5) * 0.26;

  // 參考圖漸層：上方暖奶油 → 中段燃橘 → 下方深棕黑。
  vec3 bg = mix(vec3(0.165, 0.051, 0.031), vec3(0.285, 0.060, 0.022), smoothstep(0.04, 0.44, uv.y));
  bg = mix(bg, vec3(0.900, 0.285, 0.040), smoothstep(0.28, 0.70, uv.y));
  bg = mix(bg, vec3(1.000, 0.790, 0.470), smoothstep(0.62, 0.98, uv.y));
  vec3 rimC   = vec3(1.000, 0.395, 0.070);
  vec3 edgeC  = vec3(0.945, 0.255, 0.075);
  vec3 amberC = vec3(0.985, 0.365, 0.105);
  vec3 goldC  = vec3(1.000, 0.515, 0.175);
  vec3 coreC  = vec3(1.000, 0.675, 0.340);

  // 長距離重疊的連續 ramp：邊帶深橘 → 琥珀 → 金 → 微亮核，橘慢慢暈進內部
  vec3 col = bg;
  float rimT = smoothstep(0.66, 0.90, g) * (1.0 - smoothstep(0.88, 1.02, g));
  col = mix(col, rimC, rimT * 0.45);
  float edgeIn = smoothstep(0.86, 1.02, g);
  vec3 inCol = edgeC;
  inCol = mix(inCol, amberC, smoothstep(1.00, 1.55, g));
  inCol = mix(inCol, goldC, smoothstep(1.40, 2.30, g));
  inCol = mix(inCol, coreC, smoothstep(2.80, 5.50, g) * 0.5);
  col = mix(col, inCol, edgeIn);

  // 參考圖式斜向掃光：寬燃橘 halo、窄暖白核心，光束邊緣由高頻 noise 打散。
  // 掃光放在 fluidColor 內，會跟底下流體一起被 16 根柱鏡折射，再經 CSS 毛玻璃。
  float sweepCycle = fract(uTime / 8.0);
  float sweepPos = mix(-0.52, 1.34, sweepCycle);
  float sweepAxis = uv.x - uv.y * 0.32;
  float sweepDist = abs(sweepAxis - sweepPos);
  float halo = exp(-sweepDist * sweepDist * 36.0);
  float hotCore = exp(-sweepDist * sweepDist * 420.0);
  float beamNoise = noise(p * 72.0 + vec2(uTime * 0.32, -uTime * 0.21));
  float grainMask = mix(0.76, 1.18, smoothstep(0.28, 0.78, beamNoise));
  halo *= grainMask;
  hotCore *= mix(0.88, 1.08, beamNoise);
  col += vec3(1.000, 0.205, 0.035) * halo * 0.24;
  col += vec3(1.000, 0.805, 0.585) * hotCore * 0.42;

  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;

  // 柱體數量與上層 CSS 同步：桌面 16 根、手機 8 根。
  float ribCount = uRibCount;
  float ribX = uv.x * ribCount;
  float localX = fract(ribX) - 0.5;

  // 柱狀透鏡：邊界位移回到 0，柱內才逐漸彎折底圖。
  float lensCurve = sin(localX * 6.28318530);
  float refractX = uv.x - lensCurve * (0.16 / ribCount);

  vec3 glassCol = fluidColor(vec2(clamp(refractX, 0.0, 1.0), uv.y));

  gl_FragColor = vec4(clamp(glassCol, 0.0, 1.0), 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-console
    console.error('HeroFluid shader error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroFluid({ children }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false });
    if (!gl) return undefined; // WebGL 不可用 → hero 純底色 fallback

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return undefined;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uRibCount = gl.getUniformLocation(prog, 'uRibCount');
    const uBlobScale = gl.getUniformLocation(prog, 'uBlobScale');
    const uM1 = gl.getUniformLocation(prog, 'uM1');
    const uM2 = gl.getUniformLocation(prog, 'uM2');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 液滴＝位置＋強度：離場時只把強度目標歸零（位置留著原地消散，不彈走）
    const m = { x: 0.5, y: 0.5, s: 0, tx: 0.5, ty: 0.5, ts: 0 };
    const trail = { x: 0.5, y: 0.5, s: 0 };
    let raf = 0;
    let running = false;
    let inView = true;
    const start = performance.now();
    fluidSim.start = start; // 名字互動與 shader 用同一個時鐘

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const wpx = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const hpx = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== wpx || canvas.height !== hpx) {
        canvas.width = wpx;
        canvas.height = hpx;
        gl.viewport(0, 0, wpx, hpx);
      }
    };

    const draw = () => {
      resize();
      const t = (performance.now() - start) / 1000;
      m.x += (m.tx - m.x) * 0.10;
      m.y += (m.ty - m.y) * 0.10;
      m.s += (m.ts - m.s) * 0.05;
      trail.x += (m.x - trail.x) * 0.035;
      trail.y += (m.y - trail.y) * 0.035;
      trail.s += (m.s * 0.7 - trail.s) * 0.05;
      fluidSim.mouse = { x: m.x, y: m.y, s: m.s };
      fluidSim.trail = { x: trail.x, y: trail.y, s: trail.s };
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uRibCount, canvas.clientWidth <= 768 ? 8 : 16);
      gl.uniform1f(uBlobScale, canvas.clientWidth <= 768 ? 0.38 : 1);
      gl.uniform3f(uM1, m.x, m.y, m.s);
      gl.uniform3f(uM2, trail.x, trail.y, trail.s);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = () => {
      draw();
      raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // 滑鼠事件掛 hero section（canvas 本身 pointer-events:none）
    const host = canvas.closest('.hero') || canvas.parentElement;
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      m.tx = (e.clientX - rect.left) / rect.width;
      m.ty = 1 - (e.clientY - rect.top) / rect.height;
      m.ts = 1;
    };
    const onLeave = () => {
      m.ts = 0;
    };
    host?.addEventListener('pointermove', onMove, { passive: true });
    host?.addEventListener('pointerleave', onLeave, { passive: true });

    // 背景分頁/捲離視野時暫停（省電）
    const onVis = () => {
      if (document.hidden || !inView) stopLoop();
      else startLoop();
    };
    document.addEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      onVis();
    });
    io.observe(canvas);

    draw(); // reduce-motion 也至少有一張靜態
    startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      host?.removeEventListener('pointermove', onMove);
      host?.removeEventListener('pointerleave', onLeave);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="hero__mesh" aria-hidden="true" />
      {children}
      <div className="hero__glass" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <span className="hero__glass-column" key={index} />
        ))}
      </div>
    </>
  );
}
