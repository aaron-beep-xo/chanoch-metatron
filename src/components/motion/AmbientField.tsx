"use client";

import { useEffect, useRef } from "react";
import { usePrefs } from "@/components/chrome/Preferences";

/**
 * The site's one persistent WebGL layer: slow volumetric light and a fine drift
 * of luminous dust. It carries no information — every scene that means something
 * is drawn in the DOM or in its own accessible canvas — so it is safe to drop
 * entirely on reduced motion, on low-power devices, and where WebGL is missing.
 *
 * Cost control: single full-screen quad, DPR capped at 1.5, paused whenever the
 * document is hidden, and the shader is compiled only after first paint.
 */
export function AmbientField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { reduced, ready } = usePrefs();

  useEffect(() => {
    if (!ready || reduced) return;
    const canvas = ref.current;
    if (!canvas) return;

    // Never spin up a GPU context for a machine that has told us not to.
    const cores = navigator.hardwareConcurrency ?? 4;
    if (cores <= 2) return;

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, premultipliedAlpha: false }) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

    const fs = `
precision mediump float;
uniform vec2  uRes;
uniform float uTime;
uniform float uScroll;   // 0..1 through the document
uniform float uHue;      // act accent hue, degrees
uniform float uWarm;     // 1 = night ground, 0 = parchment ground

// Cheap value noise; three octaves is enough for light this diffuse.
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

vec3 hue2rgb(float h){
  vec3 k = vec3(1.0, 2.0 / 3.0, 1.0 / 3.0);
  vec3 p = abs(fract(vec3(mod(h, 360.0) / 360.0) + k) * 6.0 - 3.0);
  return clamp(p - 1.0, 0.0, 1.0);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 q = uv;
  q.x *= uRes.x / uRes.y;

  float t = uTime * 0.017;

  // A slow column of light that drifts with reading position: the site's
  // constant "or yashar", never bright enough to compete with the text.
  float column = exp(-pow((uv.x - 0.5 + 0.06 * sin(t * 0.6)) * 3.4, 2.0));
  float fall = smoothstep(0.0, 0.85, 1.0 - abs(uv.y - (0.86 - uScroll * 0.55)) * 1.35);
  float veil = fbm(q * 2.1 + vec2(0.0, -t * 1.4)) * 0.65 + 0.35;

  float body = column * fall * veil;

  // Fine dust, denser toward the lower third, as though matter were catching it.
  vec2 dp = q * 46.0 + vec2(t * 1.1, -t * 2.6);
  float dust = pow(noise(dp), 22.0) * 3.0 * smoothstep(1.0, 0.15, uv.y);

  // Desaturate toward warm ivory so the field never reads as a coloured wash.
  vec3 accent = mix(hue2rgb(uHue), vec3(1.0, 0.94, 0.84), 0.42);
  vec3 col = accent * (body * 0.20 + dust * 0.55);

  // The night ground takes a faint indigo depth; parchment takes none.
  col += vec3(0.05, 0.07, 0.16) * body * 0.5 * uWarm;

  float alpha = clamp(body * 0.42 + dust * 0.5, 0.0, 1.0) * (0.55 + 0.45 * uWarm);
  gl_FragColor = vec4(col, alpha);
}`;

    function compile(type: number, src: string) {
      const sh = gl!.createShader(type)!;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      return gl!.getShaderParameter(sh, gl!.COMPILE_STATUS) ? sh : null;
    }

    const v = compile(gl.VERTEX_SHADER, vs);
    const f = compile(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, v);
    gl.attachShader(prog, f);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    const uHue = gl.getUniformLocation(prog, "uHue");
    const uWarm = gl.getUniformLocation(prog, "uWarm");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let dpr = 1;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let raf = 0;
    let running = true;
    const start = performance.now();

    function frame(now: number) {
      if (!running) return;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const scroll = Math.min(1, window.scrollY / max);
      const styles = getComputedStyle(doc);
      const hue = parseFloat(styles.getPropertyValue("--act-hue")) || 40;
      const warm = doc.dataset.surface === "parchment" ? 0 : 1;

      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, (now - start) / 1000);
      gl!.uniform1f(uScroll, scroll);
      gl!.uniform1f(uHue, hue);
      gl!.uniform1f(uWarm, warm);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    canvas.dataset.live = "true";

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduced, ready]);

  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-fallback" />
      <canvas ref={ref} className="ambient-canvas" />
    </div>
  );
}
