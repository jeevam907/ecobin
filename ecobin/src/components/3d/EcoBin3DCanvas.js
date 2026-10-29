/**
 * EcoBin 3D Canvas Component
 * Interactive High-Performance 3D Smart Bin with Fill Shader, Floating Leaves & Orbit Control
 */

export class EcoBin3DCanvas {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.options = {
      fillLevel: 68, // Default 68%
      interactive: true,
      autoRotate: true,
      color: '#10b981',
      ...options
    };

    if (!this.container) return;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.innerHTML = '';
    this.container.appendChild(this.canvas);

    this.rotation = 0.4;
    this.pitch = 0.25;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    // Floating particles (leaves / eco sparks)
    this.particles = Array.from({ length: 24 }, () => ({
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      z: (Math.random() - 0.5) * 200,
      size: Math.random() * 6 + 3,
      speedY: Math.random() * 0.4 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      type: Math.random() > 0.4 ? 'leaf' : 'spark'
    }));

    this.setupListeners();
    this.resize();
    this.animate();
  }

  resize() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width || 340;
    this.height = rect.height || 340;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  setupListeners() {
    window.addEventListener('resize', () => this.resize());

    if (!this.options.interactive) return;

    const onDown = (clientX, clientY) => {
      this.isDragging = true;
      this.lastMouseX = clientX;
      this.lastMouseY = clientY;
    };

    const onMove = (clientX, clientY) => {
      if (!this.isDragging) return;
      const dx = clientX - this.lastMouseX;
      const dy = clientY - this.lastMouseY;
      this.rotation += dx * 0.012;
      this.pitch = Math.max(-0.4, Math.min(0.6, this.pitch + dy * 0.008));
      this.lastMouseX = clientX;
      this.lastMouseY = clientY;
    };

    const onUp = () => {
      this.isDragging = false;
    };

    this.canvas.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onUp);

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchend', onUp);
  }

  setFillLevel(level) {
    this.options.fillLevel = Math.max(0, Math.min(100, level));
  }

  animate() {
    this.render();
    if (this.options.autoRotate && !this.isDragging) {
      this.rotation += 0.008;
    }
    requestAnimationFrame(() => this.animate());
  }

  project(x, y, z) {
    // 3D rotation around Y and X axis
    const cosY = Math.cos(this.rotation);
    const sinY = Math.sin(this.rotation);
    const cosX = Math.cos(this.pitch);
    const sinX = Math.sin(this.pitch);

    // Rotate Y
    const x1 = x * cosY - z * sinY;
    const z1 = z * cosY + x * sinY;

    // Rotate X
    const y2 = y * cosX - z1 * sinX;
    const z2 = z1 * cosX + y * sinX;

    const fov = 420;
    const scale = fov / (fov + z2 + 180);
    return {
      x: this.width / 2 + x1 * scale,
      y: this.height / 2 + y2 * scale,
      scale,
      depth: z2
    };
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Draw ambient floor glow & shadow
    const floorY = 95;
    const floorProj = this.project(0, floorY, 0);
    const shadowGrad = ctx.createRadialGradient(floorProj.x, floorProj.y, 10, floorProj.x, floorProj.y, 85);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    shadowGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(floorProj.x, floorProj.y, 80 * floorProj.scale, 35 * floorProj.scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Render 3D Cylinder / Bin Segments
    const segments = 28;
    const topRadius = 60;
    const bottomRadius = 48;
    const binHeight = 130;
    const topY = -65;
    const bottomY = topY + binHeight;

    // Determine Fill Level color (Green -> Yellow -> Red)
    const fill = this.options.fillLevel;
    let fillGradStart = '#10b981';
    let fillGradEnd = '#059669';
    if (fill > 80) {
      fillGradStart = '#ef4444';
      fillGradEnd = '#991b1b';
    } else if (fill > 60) {
      fillGradStart = '#f59e0b';
      fillGradEnd = '#b45309';
    }

    // Bin Body Polygonal Faces
    const faces = [];
    for (let i = 0; i < segments; i++) {
      const theta1 = (i / segments) * Math.PI * 2;
      const theta2 = ((i + 1) / segments) * Math.PI * 2;

      const p1Top = { x: Math.cos(theta1) * topRadius, y: topY, z: Math.sin(theta1) * topRadius };
      const p2Top = { x: Math.cos(theta2) * topRadius, y: topY, z: Math.sin(theta2) * topRadius };
      const p1Bottom = { x: Math.cos(theta1) * bottomRadius, y: bottomY, z: Math.sin(theta1) * bottomRadius };
      const p2Bottom = { x: Math.cos(theta2) * bottomRadius, y: bottomY, z: Math.sin(theta2) * bottomRadius };

      const pr1Top = this.project(p1Top.x, p1Top.y, p1Top.z);
      const pr2Top = this.project(p2Top.x, p2Top.y, p2Top.z);
      const pr1Bottom = this.project(p1Bottom.x, p1Bottom.y, p1Bottom.z);
      const pr2Bottom = this.project(p2Bottom.x, p2Bottom.y, p2Bottom.z);

      // Light vector from top-left (approx)
      const avgZ = (pr1Top.depth + pr2Top.depth + pr1Bottom.depth + pr2Bottom.depth) / 4;
      const normalX = Math.cos((theta1 + theta2) / 2);
      const normalZ = Math.sin((theta1 + theta2) / 2);
      
      // Calculate shaded intensity with 3D highlight
      const cosY = Math.cos(this.rotation);
      const sinY = Math.sin(this.rotation);
      const rotNormalX = normalX * cosY - normalZ * sinY;
      const lightDot = Math.max(0.12, (rotNormalX * 0.6) + 0.45);

      faces.push({
        points: [pr1Top, pr2Top, pr2Bottom, pr1Bottom],
        depth: avgZ,
        intensity: lightDot,
        isFront: avgZ < 0
      });
    }

    // Sort by depth (Painter's algorithm)
    faces.sort((a, b) => b.depth - a.depth);

    for (const face of faces) {
      ctx.beginPath();
      ctx.moveTo(face.points[0].x, face.points[0].y);
      for (let j = 1; j < 4; j++) {
        ctx.lineTo(face.points[j].x, face.points[j].y);
      }
      ctx.closePath();

      // Metallic emerald gradient tone
      const baseR = Math.floor(16 * face.intensity);
      const baseG = Math.floor(185 * face.intensity);
      const baseB = Math.floor(129 * face.intensity);
      ctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(52, 211, 153, ${0.15 * face.intensity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Render Lid with 3D Sensor & LED
    const lidProj = this.project(0, topY - 8, 0);
    const lidGrad = ctx.createRadialGradient(lidProj.x, lidProj.y, 5, lidProj.x, lidProj.y, topRadius * lidProj.scale);
    lidGrad.addColorStop(0, '#34d399');
    lidGrad.addColorStop(0.7, '#065f46');
    lidGrad.addColorStop(1, '#022c22');

    ctx.beginPath();
    ctx.ellipse(lidProj.x, lidProj.y, topRadius * lidProj.scale, (topRadius * 0.35) * lidProj.scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = lidGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // IoT Sensor Indicator Dome on top of Lid
    const sensorProj = this.project(0, topY - 14, 0);
    ctx.beginPath();
    ctx.arc(sensorProj.x, sensorProj.y, 6 * sensorProj.scale, 0, Math.PI * 2);
    ctx.fillStyle = fill > 85 ? '#ef4444' : (fill > 60 ? '#f59e0b' : '#10b981');
    ctx.fill();
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset

    // Render Floating Eco Leaves & Sparks
    for (const p of this.particles) {
      p.y -= p.speedY;
      p.rotation += p.rotSpeed;
      if (p.y < -150) p.y = 150;

      const pp = this.project(p.x, p.y, p.z);
      ctx.save();
      ctx.translate(pp.x, pp.y);
      ctx.rotate(p.rotation);

      if (p.type === 'leaf') {
        ctx.fillStyle = 'rgba(163, 230, 53, 0.75)';
        ctx.beginPath();
        ctx.moveTo(0, -p.size * pp.scale);
        ctx.quadraticCurveTo(p.size * pp.scale, 0, 0, p.size * pp.scale);
        ctx.quadraticCurveTo(-p.size * pp.scale, 0, 0, -p.size * pp.scale);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.beginPath();
        ctx.arc(0, 0, (p.size / 2) * pp.scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }
}
