import { useState, useRef, useEffect } from 'react';

export default function App() {
  const canvasRef = useRef(null);
  const [text, setText] = useState('创意艺术字');
  const [fontSize, setFontSize] = useState(96);
  const [colorStart, setColorStart] = useState('#ff4d4f');
  const [colorEnd, setColorEnd] = useState('#fadb14');
  const [strokeColor, setStrokeColor] = useState('#1f1f1f');
  const [strokeWidth, setStrokeWidth] = useState(12);
  const [shadowBlur, setShadowBlur] = useState(20);
  const [shadowColor, setShadowColor] = useState('#ff7a45');

  // 每次参数变化时，重新绘制 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // 1. 清空画布（保持透明背景）
    ctx.clearRect(0, 0, width, height);

    // 2. 基础排版设置
    ctx.font = `900 ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round'; // 关键：防止中文笔画拐角出现尖刺

    const lines = text.split('\n');
    const lineHeight = fontSize * 1.25;
    const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

    // 3. 创建上下渐变色
    const gradient = ctx.createLinearGradient(0, startY - fontSize / 2, 0, startY + lines.length * lineHeight);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);

    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;

      // 绘制阴影与描边
      ctx.save();
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetY = 6;
      if (strokeWidth > 0) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        ctx.strokeText(line, width / 2, y);
      }
      ctx.restore();

      // 绘制渐变主体文字（放在描边之后，避免描边遮挡字形）
      ctx.fillStyle = gradient;
      ctx.fillText(line, width / 2, y);
    });
  }, [text, fontSize, colorStart, colorEnd, strokeColor, strokeWidth, shadowBlur, shadowColor]);

  // 导出高清透明 PNG
  const handleExport = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `art-text-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', background: '#141414', color: '#fff' }}>
      {/* 左侧参数控制面板 */}
      <div style={{ width: 300, padding: 24, background: '#1f1f1f', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ margin: 0 }}>艺术字生成器</h2>

        <label>
          文字内容（支持换行）：
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', marginTop: 6, padding: 8, background: '#2b2b2b', color: '#fff', border: '1px solid #444' }}
          />
        </label>

        <label>
          字号 ({fontSize}px)：
          <input type="range" min="36" max="180" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ width: '100%' }} />
        </label>

        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ flex: 1 }}>
            渐变顶部
            <input type="color" value={colorStart} onChange={(e) => setColorStart(e.target.value)} style={{ width: '100%', height: 36 }} />
          </label>
          <label style={{ flex: 1 }}>
            渐变底部
            <input type="color" value={colorEnd} onChange={(e) => setColorEnd(e.target.value)} style={{ width: '100%', height: 36 }} />
          </label>
        </div>

        <label>
          描边粗细 ({strokeWidth}px)：
          <input type="range" min="0" max="30" value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} style={{ width: '100%' }} />
        </label>

        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ flex: 1 }}>
            描边颜色
            <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} style={{ width: '100%', height: 36 }} />
          </label>
          <label style={{ flex: 1 }}>
            发光/阴影色
            <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} style={{ width: '100%', height: 36 }} />
          </label>
        </div>

        <label>
          发光强度 ({shadowBlur}px)：
          <input type="range" min="0" max="50" value={shadowBlur} onChange={(e) => setShadowBlur(Number(e.target.value))} style={{ width: '100%' }} />
        </label>

        <button
          onClick={handleExport}
          style={{ marginTop: 12, padding: '12px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 16, fontWeight: 'bold' }}
        >
          导出透明 PNG
        </button>
      </div>

      {/* 右侧实时预览画布（棋盘格代表透明背景） */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <canvas
          ref={canvasRef}
          width={1200}
          height={600}
          style={{
            maxWidth: '100%',
            borderRadius: 8,
            border: '1px solid #333',
            backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />
      </div>
    </div>
  );
}