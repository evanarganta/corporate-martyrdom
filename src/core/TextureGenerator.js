import { TILE_SIZE, ITEMS } from './Constants.js';

export class TextureGenerator {
  static generateAll(scene) {
    this.generateTerrainTextures(scene);
    this.generateOreTextures(scene);
    this.generateLogisticsTextures(scene);
    this.generateBuildingTextures(scene);
    this.generateItemTextures(scene);
    this.generateParticleTextures(scene);
  }

  static generateTerrainTextures(scene) {
    const s = TILE_SIZE;

    const canvas = scene.textures.createCanvas('tile_ground', s, s);
    const ctx = canvas.getContext();
    ctx.fillStyle = '#101216';
    ctx.fillRect(0, 0, s, s);

    ctx.strokeStyle = '#1a1e26';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, s - 1, s - 1);

    ctx.fillStyle = '#222731';
    ctx.fillRect(4, 6, 2, 2);
    ctx.fillRect(s - 8, 12, 3, 2);
    ctx.fillRect(14, s - 10, 2, 3);
    ctx.fillRect(s - 14, s - 12, 2, 2);

    canvas.refresh();

    const cCanvas = scene.textures.createCanvas('tile_concrete', s, s);
    const cCtx = cCanvas.getContext();
    cCtx.fillStyle = '#181b22';
    cCtx.fillRect(0, 0, s, s);
    cCtx.strokeStyle = '#2d3340';
    cCtx.lineWidth = 1;
    cCtx.strokeRect(1, 1, s - 2, s - 2);
    cCtx.fillStyle = '#0f1116';
    cCtx.fillRect(2, 2, 3, 3);
    cCtx.fillRect(s - 5, 2, 3, 3);
    cCtx.fillRect(2, s - 5, 3, 3);
    cCtx.fillRect(s - 5, s - 5, 3, 3);
    cCanvas.refresh();
  }

  static generateOreTextures(scene) {
    const s = TILE_SIZE;

    {
      const canvas = scene.textures.createCanvas('ore_iron', s, s);
      const ctx = canvas.getContext();
      ctx.fillStyle = '#101216';
      ctx.fillRect(0, 0, s, s);

      ctx.fillStyle = '#262d38';
      ctx.beginPath();
      ctx.moveTo(8, 16); ctx.lineTo(24, 6); ctx.lineTo(40, 14); ctx.lineTo(42, 34); ctx.lineTo(28, 44); ctx.lineTo(10, 38);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(12, 18); ctx.lineTo(26, 10); ctx.lineTo(34, 22); ctx.lineTo(20, 30);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(26, 10); ctx.lineTo(38, 16); ctx.lineTo(34, 22);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(14, 24); ctx.lineTo(22, 14); ctx.lineTo(26, 26);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(16, 16); ctx.lineTo(26, 10); ctx.lineTo(36, 15);
      ctx.stroke();

      canvas.refresh();
    }

    {
      const canvas = scene.textures.createCanvas('ore_copper', s, s);
      const ctx = canvas.getContext();
      ctx.fillStyle = '#101216';
      ctx.fillRect(0, 0, s, s);

      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(s / 2, s / 2, s * 0.38, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(s / 2 - 6, s / 2 - 4, 8, 0, Math.PI * 2);
      ctx.arc(s / 2 + 7, s / 2 - 5, 7, 0, Math.PI * 2);
      ctx.arc(s / 2 + 3, s / 2 + 7, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(s / 2 - 6, s / 2 - 4, 5, 0, Math.PI * 2);
      ctx.arc(s / 2 + 7, s / 2 - 5, 4, 0, Math.PI * 2);
      ctx.arc(s / 2 + 3, s / 2 + 7, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(12, 16); ctx.lineTo(20, 24); ctx.lineTo(16, 36);
      ctx.moveTo(22, 14); ctx.lineTo(34, 20); ctx.lineTo(38, 32);
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.fillRect(18, 16, 2, 2);
      ctx.fillRect(29, 17, 2, 2);

      canvas.refresh();
    }

    {
      const canvas = scene.textures.createCanvas('ore_coal', s, s);
      const ctx = canvas.getContext();
      ctx.fillStyle = '#101216';
      ctx.fillRect(0, 0, s, s);

      ctx.fillStyle = '#05070a';
      ctx.beginPath();
      ctx.moveTo(6, 14); ctx.lineTo(22, 6); ctx.lineTo(42, 12); ctx.lineTo(44, 32); ctx.lineTo(30, 44); ctx.lineTo(10, 40);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(10, 18); ctx.lineTo(24, 10); ctx.lineTo(32, 24); ctx.lineTo(16, 32);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(24, 10); ctx.lineTo(38, 14); ctx.lineTo(32, 24);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(16, 32); ctx.lineTo(32, 24); ctx.lineTo(38, 38); ctx.lineTo(18, 40);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(12, 19); ctx.lineTo(24, 11);
      ctx.moveTo(22, 28); ctx.lineTo(34, 25);
      ctx.stroke();

      canvas.refresh();
    }

    {
      const canvas = scene.textures.createCanvas('ore_quartz', s, s);
      const ctx = canvas.getContext();
      ctx.fillStyle = '#101216';
      ctx.fillRect(0, 0, s, s);

      ctx.fillStyle = '#082f49';
      ctx.beginPath();
      ctx.arc(s / 2, s / 2, s * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(24, 4); ctx.lineTo(30, 18); ctx.lineTo(27, 40); ctx.lineTo(21, 40); ctx.lineTo(18, 18);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(24, 4); ctx.lineTo(21, 18); ctx.lineTo(21, 40); ctx.lineTo(24, 40);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.moveTo(24, 4); ctx.lineTo(26, 18); ctx.lineTo(24, 40);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0ea5e9';
      ctx.beginPath();
      ctx.moveTo(12, 12); ctx.lineTo(18, 22); ctx.lineTo(16, 38); ctx.lineTo(8, 34);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#7dd3fc';
      ctx.beginPath();
      ctx.moveTo(36, 14); ctx.lineTo(40, 26); ctx.lineTo(34, 40); ctx.lineTo(28, 24);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(24, 5); ctx.lineTo(24, 30);
      ctx.moveTo(12, 13); ctx.lineTo(15, 26);
      ctx.stroke();

      canvas.refresh();
    }

    {
      const canvas = scene.textures.createCanvas('ore_titanium', s, s);
      const ctx = canvas.getContext();
      ctx.fillStyle = '#101216';
      ctx.fillRect(0, 0, s, s);

      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.moveTo(8, 14); ctx.lineTo(26, 6); ctx.lineTo(42, 10); ctx.lineTo(44, 34); ctx.lineTo(30, 44); ctx.lineTo(10, 38);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#4338ca';
      ctx.beginPath();
      ctx.moveTo(14, 18); ctx.lineTo(26, 10); ctx.lineTo(34, 22); ctx.lineTo(20, 32);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.moveTo(26, 10); ctx.lineTo(38, 14); ctx.lineTo(34, 22);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#818cf8';
      ctx.beginPath();
      ctx.moveTo(18, 26); ctx.lineTo(26, 14); ctx.lineTo(32, 28);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#c7d2fe';
      ctx.beginPath();
      ctx.moveTo(26, 14); ctx.lineTo(30, 24); ctx.lineTo(26, 32);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#e0e7ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(18, 16); ctx.lineTo(26, 10); ctx.lineTo(38, 14);
      ctx.stroke();

      canvas.refresh();
    }
  }

  static generateLogisticsTextures(scene) {
    const s = TILE_SIZE;

    for (let f = 0; f < 4; f++) {
      const canvas = scene.textures.createCanvas(`conveyor_mk1_${f}`, s, s);
      const ctx = canvas.getContext();

      ctx.fillStyle = '#1a1d24';
      ctx.fillRect(0, 0, s, s);

      ctx.fillStyle = '#373e4d';
      ctx.fillRect(0, 0, 4, s);
      ctx.fillRect(s - 4, 0, 4, s);

      ctx.fillStyle = '#101216';
      ctx.fillRect(4, 0, s - 8, s);

      ctx.fillStyle = '#262b36';
      const offset = (f * (s / 4)) % s;
      for (let y = -s; y < s * 2; y += 12) {
        const py = (y + offset) % s;
        if (py >= 0 && py < s) {
          ctx.fillRect(5, py, s - 10, 3);
        }
      }

      ctx.fillStyle = '#f39c12';
      ctx.beginPath();
      ctx.moveTo(s / 2, 9);
      ctx.lineTo(s / 2 - 7, 22);
      ctx.lineTo(s / 2 + 7, 22);
      ctx.closePath();
      ctx.fill();

      canvas.refresh();
    }

    for (let f = 0; f < 4; f++) {
      const canvas = scene.textures.createCanvas(`conveyor_mk2_${f}`, s, s);
      const ctx = canvas.getContext();

      ctx.fillStyle = '#14171d';
      ctx.fillRect(0, 0, s, s);

      ctx.fillStyle = '#e58e26';
      ctx.fillRect(0, 0, 5, s);
      ctx.fillRect(s - 5, 0, 5, s);

      ctx.fillStyle = '#0c0e12';
      ctx.fillRect(5, 0, s - 10, s);

      const offset = (f * (s / 4)) % s;
      ctx.fillStyle = 'rgba(243, 156, 18, 0.45)';
      for (let y = -s; y < s * 2; y += 10) {
        const py = (y + offset) % s;
        if (py >= 0 && py < s) {
          ctx.fillRect(6, py, s - 12, 2);
        }
      }

      ctx.fillStyle = '#f39c12';
      ctx.beginPath();
      ctx.moveTo(s / 2, 8);
      ctx.lineTo(s / 2 - 8, 20);
      ctx.lineTo(s / 2 + 8, 20);
      ctx.closePath();
      ctx.fill();

      canvas.refresh();
    }

    const splitCanvas = scene.textures.createCanvas('splitter', s, s);
    const splitCtx = splitCanvas.getContext();
    splitCtx.fillStyle = '#1e293b';
    splitCtx.fillRect(0, 0, s, s);
    splitCtx.fillStyle = '#3b82f6';
    splitCtx.fillRect(4, 4, s - 8, s - 8);
    splitCtx.fillStyle = '#ffffff';
    splitCtx.beginPath();
    splitCtx.moveTo(s / 2, 8);
    splitCtx.lineTo(s / 2 - 6, 16);
    splitCtx.lineTo(s / 2 + 6, 16);
    splitCtx.closePath();
    splitCtx.fill();
    splitCtx.fillRect(2, s / 2 - 2, 4, 4);
    splitCtx.fillRect(s - 6, s / 2 - 2, 4, 4);
    splitCanvas.refresh();

    const mergeCanvas = scene.textures.createCanvas('merger', s, s);
    const mergeCtx = mergeCanvas.getContext();
    mergeCtx.fillStyle = '#1e293b';
    mergeCtx.fillRect(0, 0, s, s);
    mergeCtx.fillStyle = '#8b5cf6';
    mergeCtx.fillRect(4, 4, s - 8, s - 8);
    mergeCtx.fillStyle = '#ffffff';
    mergeCtx.beginPath();
    mergeCtx.moveTo(s / 2, 8);
    mergeCtx.lineTo(s / 2 - 6, 18);
    mergeCtx.lineTo(s / 2 + 6, 18);
    mergeCtx.closePath();
    mergeCtx.fill();
    mergeCanvas.refresh();

    const chuteCanvas = scene.textures.createCanvas('chute_tunnel', s, s);
    const chuteCtx = chuteCanvas.getContext();
    chuteCtx.fillStyle = '#111827';
    chuteCtx.fillRect(0, 0, s, s);
    chuteCtx.fillStyle = '#374151';
    chuteCtx.fillRect(3, 3, s - 6, s - 6);
    chuteCtx.fillStyle = '#000000';
    chuteCtx.beginPath();
    chuteCtx.arc(s / 2, s / 2, 14, 0, Math.PI * 2);
    chuteCtx.fill();
    chuteCtx.strokeStyle = '#00f0ff';
    chuteCtx.lineWidth = 2;
    chuteCtx.stroke();
    chuteCanvas.refresh();
  }

  static generateBuildingTextures(scene) {
    const s = TILE_SIZE;

    const bdCanvas = scene.textures.createCanvas('burner_drill', s * 2, s * 2);
    const bdCtx = bdCanvas.getContext();
    const w2 = s * 2;
    bdCtx.fillStyle = '#334155';
    bdCtx.fillRect(4, 4, w2 - 8, w2 - 8);
    bdCtx.strokeStyle = '#64748b';
    bdCtx.lineWidth = 3;
    bdCtx.strokeRect(6, 6, w2 - 12, w2 - 12);
    bdCtx.fillStyle = '#e2e8f0';
    bdCtx.beginPath();
    bdCtx.arc(w2 / 2, w2 / 2, 22, 0, Math.PI * 2);
    bdCtx.fill();
    bdCtx.fillStyle = '#475569';
    bdCtx.beginPath();
    bdCtx.arc(w2 / 2, w2 / 2, 14, 0, Math.PI * 2);
    bdCtx.fill();
    bdCtx.fillStyle = '#ffb703';
    bdCtx.beginPath();
    bdCtx.moveTo(w2 / 2, 6);
    bdCtx.lineTo(w2 / 2 - 8, 18);
    bdCtx.lineTo(w2 / 2 + 8, 18);
    bdCtx.closePath();
    bdCtx.fill();
    bdCanvas.refresh();

    const edCanvas = scene.textures.createCanvas('electric_drill', s * 2, s * 2);
    const edCtx = edCanvas.getContext();
    edCtx.fillStyle = '#1e293b';
    edCtx.fillRect(4, 4, w2 - 8, w2 - 8);
    edCtx.strokeStyle = '#00f0ff';
    edCtx.lineWidth = 2;
    edCtx.strokeRect(6, 6, w2 - 12, w2 - 12);
    edCtx.fillStyle = '#0ea5e9';
    edCtx.beginPath();
    edCtx.arc(w2 / 2, w2 / 2, 24, 0, Math.PI * 2);
    edCtx.fill();
    edCtx.fillStyle = '#00f0ff';
    edCtx.beginPath();
    edCtx.arc(w2 / 2, w2 / 2, 12, 0, Math.PI * 2);
    edCtx.fill();
    edCtx.fillStyle = '#00f0ff';
    edCtx.beginPath();
    edCtx.moveTo(w2 / 2, 4);
    edCtx.lineTo(w2 / 2 - 10, 18);
    edCtx.lineTo(w2 / 2 + 10, 18);
    edCtx.closePath();
    edCtx.fill();
    edCanvas.refresh();

    const ddCanvas = scene.textures.createCanvas('deep_drill', s * 3, s * 3);
    const ddCtx = ddCanvas.getContext();
    const w3 = s * 3;
    ddCtx.fillStyle = '#0f172a';
    ddCtx.fillRect(6, 6, w3 - 12, w3 - 12);
    ddCtx.strokeStyle = '#818cf8';
    ddCtx.lineWidth = 4;
    ddCtx.strokeRect(8, 8, w3 - 16, w3 - 16);
    ddCtx.fillStyle = '#312e81';
    ddCtx.beginPath();
    ddCtx.arc(w3 / 2, w3 / 2, 38, 0, Math.PI * 2);
    ddCtx.fill();
    ddCtx.fillStyle = '#a855f7';
    ddCtx.beginPath();
    ddCtx.arc(w3 / 2, w3 / 2, 20, 0, Math.PI * 2);
    ddCtx.fill();
    ddCtx.fillStyle = '#00f0ff';
    ddCtx.beginPath();
    ddCtx.moveTo(w3 / 2, 6);
    ddCtx.lineTo(w3 / 2 - 14, 24);
    ddCtx.lineTo(w3 / 2 + 14, 24);
    ddCtx.closePath();
    ddCtx.fill();
    ddCanvas.refresh();

    const smCanvas = scene.textures.createCanvas('smelter_mk1', s * 2, s * 2);
    const smCtx = smCanvas.getContext();
    smCtx.fillStyle = '#334155';
    smCtx.fillRect(4, 4, w2 - 8, w2 - 8);
    smCtx.strokeStyle = '#f97316';
    smCtx.lineWidth = 3;
    smCtx.strokeRect(6, 6, w2 - 12, w2 - 12);
    const glowGrad = smCtx.createRadialGradient(w2 / 2, w2 / 2, 4, w2 / 2, w2 / 2, 26);
    glowGrad.addColorStop(0, '#ffffff');
    glowGrad.addColorStop(0.3, '#ffedd5');
    glowGrad.addColorStop(0.7, '#ea580c');
    glowGrad.addColorStop(1, '#7c2d12');
    smCtx.fillStyle = glowGrad;
    smCtx.beginPath();
    smCtx.arc(w2 / 2, w2 / 2, 24, 0, Math.PI * 2);
    smCtx.fill();
    smCtx.fillStyle = '#1e293b';
    smCtx.fillRect(16, 10, 12, 10);
    smCtx.fillRect(w2 - 28, 10, 12, 10);
    smCanvas.refresh();

    const pfCanvas = scene.textures.createCanvas('smelter_mk2', s * 3, s * 3);
    const pfCtx = pfCanvas.getContext();
    pfCtx.fillStyle = '#0f172a';
    pfCtx.fillRect(6, 6, w3 - 12, w3 - 12);
    pfCtx.strokeStyle = '#06b6d4';
    pfCtx.lineWidth = 3;
    pfCtx.strokeRect(8, 8, w3 - 16, w3 - 16);
    const pGrad = pfCtx.createRadialGradient(w3 / 2, w3 / 2, 6, w3 / 2, w3 / 2, 36);
    pGrad.addColorStop(0, '#ffffff');
    pGrad.addColorStop(0.4, '#a5f3fc');
    pGrad.addColorStop(0.8, '#0891b2');
    pGrad.addColorStop(1, '#164e63');
    pfCtx.fillStyle = pGrad;
    pfCtx.beginPath();
    pfCtx.arc(w3 / 2, w3 / 2, 34, 0, Math.PI * 2);
    pfCtx.fill();
    pfCanvas.refresh();

    const asCanvas = scene.textures.createCanvas('assembler_mk1', s * 3, s * 3);
    const asCtx = asCanvas.getContext();
    asCtx.fillStyle = '#1e293b';
    asCtx.fillRect(6, 6, w3 - 12, w3 - 12);
    asCtx.strokeStyle = '#10b981';
    asCtx.lineWidth = 3;
    asCtx.strokeRect(8, 8, w3 - 16, w3 - 16);
    asCtx.fillStyle = '#0f172a';
    asCtx.fillRect(20, 20, w3 - 40, w3 - 40);
    asCtx.strokeStyle = '#10b981';
    asCtx.lineWidth = 4;
    asCtx.beginPath();
    asCtx.moveTo(w3 / 2 - 20, w3 / 2);
    asCtx.lineTo(w3 / 2 + 20, w3 / 2);
    asCtx.moveTo(w3 / 2, w3 / 2 - 20);
    asCtx.lineTo(w3 / 2, w3 / 2 + 20);
    asCtx.stroke();
    asCtx.fillStyle = '#34d399';
    asCtx.beginPath();
    asCtx.arc(w3 - 22, 22, 6, 0, Math.PI * 2);
    asCtx.fill();
    asCanvas.refresh();

    const as2Canvas = scene.textures.createCanvas('assembler_mk2', s * 3, s * 3);
    const as2Ctx = as2Canvas.getContext();
    as2Ctx.fillStyle = '#0f172a';
    as2Ctx.fillRect(6, 6, w3 - 12, w3 - 12);
    as2Ctx.strokeStyle = '#ec4899';
    as2Ctx.lineWidth = 3;
    as2Ctx.strokeRect(8, 8, w3 - 16, w3 - 16);
    as2Ctx.fillStyle = '#1e1b4b';
    as2Ctx.fillRect(20, 20, w3 - 40, w3 - 40);
    as2Ctx.strokeStyle = '#f43f5e';
    as2Ctx.lineWidth = 4;
    as2Ctx.beginPath();
    as2Ctx.arc(w3 / 2, w3 / 2, 24, 0, Math.PI * 2);
    as2Ctx.stroke();
    as2Canvas.refresh();

    const ppCanvas = scene.textures.createCanvas('power_pole', s, s);
    const ppCtx = ppCanvas.getContext();
    ppCtx.fillStyle = '#475569';
    ppCtx.beginPath();
    ppCtx.arc(s / 2, s / 2, 10, 0, Math.PI * 2);
    ppCtx.fill();
    ppCtx.strokeStyle = '#ffd166';
    ppCtx.lineWidth = 2;
    ppCtx.stroke();
    ppCtx.fillStyle = '#ffd166';
    ppCtx.beginPath();
    ppCtx.arc(s / 2, s / 2, 5, 0, Math.PI * 2);
    ppCtx.fill();
    ppCanvas.refresh();

    const cgCanvas = scene.textures.createCanvas('coal_generator', s * 2, s * 2);
    const cgCtx = cgCanvas.getContext();
    cgCtx.fillStyle = '#1e293b';
    cgCtx.fillRect(4, 4, w2 - 8, w2 - 8);
    cgCtx.strokeStyle = '#ffd166';
    cgCtx.lineWidth = 2;
    cgCtx.strokeRect(6, 6, w2 - 12, w2 - 12);
    cgCtx.fillStyle = '#334155';
    cgCtx.beginPath();
    cgCtx.arc(w2 / 2, w2 / 2, 20, 0, Math.PI * 2);
    cgCtx.fill();
    cgCtx.fillStyle = '#f59e0b';
    cgCtx.beginPath();
    cgCtx.arc(w2 / 2, w2 / 2, 8, 0, Math.PI * 2);
    cgCtx.fill();
    cgCtx.fillStyle = '#475569';
    cgCtx.fillRect(12, 10, 10, 16);
    cgCtx.fillRect(w2 - 22, 10, 10, 16);
    cgCanvas.refresh();

    const spCanvas = scene.textures.createCanvas('solar_panel', s * 3, s * 3);
    const spCtx = spCanvas.getContext();
    spCtx.fillStyle = '#0f172a';
    spCtx.fillRect(6, 6, w3 - 12, w3 - 12);
    const cellW = (w3 - 24) / 3;
    const cellH = (w3 - 24) / 3;
    for (let gx = 0; gx < 3; gx++) {
      for (let gy = 0; gy < 3; gy++) {
        spCtx.fillStyle = '#1e3a8a';
        spCtx.fillRect(12 + gx * cellW, 12 + gy * cellH, cellW - 2, cellH - 2);
        spCtx.strokeStyle = '#38bdf8';
        spCtx.lineWidth = 1;
        spCtx.strokeRect(12 + gx * cellW, 12 + gy * cellH, cellW - 2, cellH - 2);
      }
    }
    spCanvas.refresh();

    const accCanvas = scene.textures.createCanvas('accumulator', s * 2, s * 2);
    const accCtx = accCanvas.getContext();
    accCtx.fillStyle = '#1e293b';
    accCtx.fillRect(4, 4, w2 - 8, w2 - 8);
    accCtx.strokeStyle = '#10b981';
    accCtx.lineWidth = 2;
    accCtx.strokeRect(6, 6, w2 - 12, w2 - 12);
    accCtx.fillStyle = '#06d6a0';
    accCtx.fillRect(16, 16, w2 - 32, w2 - 32);
    accCanvas.refresh();

    const stCanvas = scene.textures.createCanvas('storage_chest', s * 2, s * 2);
    const stCtx = stCanvas.getContext();
    stCtx.fillStyle = '#334155';
    stCtx.fillRect(4, 4, w2 - 8, w2 - 8);
    stCtx.strokeStyle = '#94a3b8';
    stCtx.lineWidth = 3;
    stCtx.strokeRect(6, 6, w2 - 12, w2 - 12);
    stCtx.fillStyle = '#64748b';
    stCtx.fillRect(14, 14, w2 - 28, w2 - 28);
    stCtx.fillStyle = '#ffd166';
    stCtx.fillRect(w2 / 2 - 8, w2 / 2 - 4, 16, 8);
    stCanvas.refresh();

    const lpCanvas = scene.textures.createCanvas('launchpad', s * 4, s * 4);
    const lpCtx = lpCanvas.getContext();
    const w4 = s * 4;
    lpCtx.fillStyle = '#0f172a';
    lpCtx.fillRect(6, 6, w4 - 12, w4 - 12);
    lpCtx.strokeStyle = '#00f0ff';
    lpCtx.lineWidth = 4;
    lpCtx.strokeRect(8, 8, w4 - 16, w4 - 16);
    lpCtx.strokeStyle = '#fbbf24';
    lpCtx.lineWidth = 3;
    lpCtx.strokeRect(16, 16, w4 - 32, w4 - 32);
    lpCtx.fillStyle = '#1e293b';
    lpCtx.beginPath();
    lpCtx.arc(w4 / 2, w4 / 2, 54, 0, Math.PI * 2);
    lpCtx.fill();
    const lpGrad = lpCtx.createRadialGradient(w4 / 2, w4 / 2, 4, w4 / 2, w4 / 2, 36);
    lpGrad.addColorStop(0, '#ffffff');
    lpGrad.addColorStop(0.5, '#00f0ff');
    lpGrad.addColorStop(1, 'transparent');
    lpCtx.fillStyle = lpGrad;
    lpCtx.beginPath();
    lpCtx.arc(w4 / 2, w4 / 2, 34, 0, Math.PI * 2);
    lpCtx.fill();
    lpCanvas.refresh();
  }

  static generateItemTextures(scene) {
    const is = 24;

    Object.values(ITEMS).forEach(item => {
      const canvas = scene.textures.createCanvas(`item_${item.id}`, is, is);
      const ctx = canvas.getContext();

      ctx.clearRect(0, 0, is, is);

      ctx.fillStyle = item.color;
      ctx.shadowColor = item.color;
      ctx.shadowBlur = 4;

      if (item.category === 'ore') {
        ctx.beginPath();
        ctx.arc(is / 2, is / 2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(is / 2 - 3, is / 2 - 3, 3, 3);
      } else if (item.category === 'smelted') {
        ctx.fillRect(4, 6, is - 8, is - 12);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(4, 6, is - 8, is - 12);
      } else {
        ctx.beginPath();
        ctx.arc(is / 2, is / 2, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      canvas.refresh();
    });
  }

  static generateParticleTextures(scene) {
    const dotCanvas = scene.textures.createCanvas('part_dot', 16, 16);
    const dCtx = dotCanvas.getContext();
    const dGrad = dCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    dGrad.addColorStop(0, '#ffffff');
    dGrad.addColorStop(0.5, '#00f0ff');
    dGrad.addColorStop(1, 'transparent');
    dCtx.fillStyle = dGrad;
    dCtx.fillRect(0, 0, 16, 16);
    dotCanvas.refresh();

    const smkCanvas = scene.textures.createCanvas('part_smoke', 24, 24);
    const smkCtx = smkCanvas.getContext();
    const smkGrad = smkCtx.createRadialGradient(12, 12, 0, 12, 12, 12);
    smkGrad.addColorStop(0, 'rgba(200, 210, 230, 0.6)');
    smkGrad.addColorStop(0.6, 'rgba(100, 120, 150, 0.2)');
    smkGrad.addColorStop(1, 'transparent');
    smkCtx.fillStyle = smkGrad;
    smkCtx.fillRect(0, 0, 24, 24);
    smkCanvas.refresh();
  }
}
