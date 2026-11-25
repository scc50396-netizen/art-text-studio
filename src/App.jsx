import { useState, useRef, useEffect } from 'react';

// 免费商用艺术字体列表
const FONTS = [
  { name: '思源黑体（粗犷标题）', value: 'Noto Sans SC' },
  { name: '站酷庆科黄油（科技潮流）', value: 'ZCOOL QingKe HuangYou' },
  { name: '站酷快乐体（卡通综艺）', value: 'ZCOOL KuaiLe' },
  { name: '马善政毛笔（国风书法）', value: 'Ma Shan Zheng' },
  { name: '站酷小薇体（优雅衬线）', value: 'ZCOOL XiaoWei' },
];

// 一键切换爆款预设模板
const PRESETS = [
  {
    name: '⚡ 赛博霓虹',
    config: {
      fontFamily: 'ZCOOL QingKe HuangYou',
      fontSize: 105,
      colorStart: '#ffffff',
      colorMid: '#ffd6ff',
      colorEnd: '#ff4dff',
      strokeColor: '#ff00cc',
      strokeWidth: 6,
      shadowColor: '#00f2ff',
      shadowBlur: 35,
      depth3d: 0,
      color3d: '#5900b3',
      isNeon: true,
    },
  },
  {
    name: '✨ 奢华流金',
    config: {
      fontFamily: 'ZCOOL XiaoWei',
      fontSize: 110,
      colorStart: '#fff7d6',
      colorMid: '#d4af37',
      colorEnd: '#7a5200',
      strokeColor: '#3d2800',
      strokeWidth: 8,
      shadowColor: '#000000',
      shadowBlur: 20,
      depth3d: 8,
      color3d: '#4d3300',
      isNeon: false,
    },
  },
  {
    name: '🧊 3D 立体波普',
    config: {
      fontFamily: 'ZCOOL KuaiLe',
      fontSize: 108,
      colorStart: '#ffec3d',
      colorMid: '#ff9c6e',
      colorEnd: '#ff4d4f',
      strokeColor: '#141414',
      strokeWidth: 14,
      shadowColor: '#000000',
      shadowBlur: 15,
      depth3d: 14,
      color3d: '#0958d9',
      isNeon: false,
    },
  },
  {
    name: '🔥 爆款短视频',
    config: {
      fontFamily: 'Noto Sans SC',
      fontSize: 100,
      colorStart: '#fff566',
      colorMid: '#fadb14',
      colorEnd: '#fa8c16',
      strokeColor: '#a8071a',
      strokeWidth: 16,
      shadowColor: '#000000',
      shadowBlur: 18,
      depth3d: 6,
      color3d: '#5c0011',
      isNeon: false,
    },
  },
  {
    name: '🖌️ 国风墨韵',
    config: {
      fontFamily: 'Ma Shan Zheng',
      fontSize: 120,
      colorStart: '#ffffff',
      colorMid: '#e6e6e6',
      colorEnd: '#bfbfbf',
      strokeColor: '#cf1322',
      strokeWidth: 5,
      shadowColor: '#cf1322',
      shadowBlur: 22,
      depth3d: 4,
      color3d: '#262626',
      isNeon: false,
    },
  },
];

export default function App() {
  const canvasRef = useRef(null);
  const [text, setText] = useState('创意艺术字');
  const [fontFamily, setFontFamily] = useState('Noto Sans SC');
  const [fontSize, setFontSize] = useState(100);
  const [colorStart, setColorStart] = useState('#fff566');
  const [colorMid, setColorMid] = useState('#fadb14');
  const [colorEnd, setColorEnd] = useState('#fa8c16');
  const [strokeColor, setStrokeColor] = useState('#a8071a');
  const [strokeWidth, setStrokeWidth] = useState(16);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowBlur, setShadowBlur] = useState(18);
  const [depth3d, setDepth3d] = useState(6);
  const [color3d, setColor3d] = useState('#5c0011');
  const [isNeon, setIsNeon] = useState(false);

  // 一键应用预设模板
  const applyPreset = (config) => {
    setFontFamily(config.fontFamily);
    setFontSize(config.fontSize);
    setColorStart(config.colorStart);
    setColorMid(config.colorMid);
    setColorEnd(config.colorEnd);
    setStrokeColor(config.strokeColor);
    setStrokeWidth(config.strokeWidth);
    setShadowColor(config.shadowColor);
    setShadowBlur(config.shadowBlur);
    setDepth3d(config.depth3d);
    setColor3d(config.color3d);
    setIsNeon(config.isNeon);
  };

  useEffect(() => {
    let isCancelled = false;

    const drawCanvas = () => {
      if (isCancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.font = `900 ${fontSize}px "${fontFamily}", "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';

      const lines = text.split('\n');
      const lineHeight = fontSize * 1.25;
      const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, index) => {
        const x = width / 2;
        const y = startY + index * lineHeight;

        // 1. 绘制 3D 立体挤出层（从远到近逐层叠加）
        if (depth3d > 0) {
          for (let i = depth3d; i > 0; i--) {
            ctx.save();
            // 仅在最底层添加投影，增强立体悬浮感
            if (i === depth3d) {
              ctx.shadowColor = shadowColor;
              ctx.shadowBlur = shadowBlur;
              ctx.shadowOffsetX = 6;
              ctx.shadowOffsetY = 8;
            }
            if (strokeWidth > 0) {
              ctx.lineWidth = strokeWidth;
              ctx.strokeStyle = color3d;
              ctx.strokeText(line, x + i, y + i);
            }
            ctx.fillStyle = color3d;
            ctx.fillText(line, x + i, y + i);
            ctx.restore();
          }
        }

        // 2. 绘制外发光 / 霓虹双层光晕与主描边
        ctx.save();
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetY = isNeon ? 0 : 6;
        if (strokeWidth > 0) {
          ctx.lineWidth = strokeWidth;
          ctx.strokeStyle = strokeColor;
          ctx.strokeText(line, x, y);
          // 霓虹模式叠加第二层强发光
          if (isNeon) {
            ctx.shadowColor = strokeColor;
            ctx.shadowBlur = shadowBlur * 0.6;
            ctx.strokeText(line, x, y);
          }
        }
        ctx.restore();

        // 3. 绘制三段式渐变主体（支持金属高光质感）
        const gradient = ctx.createLinearGradient(0, y - fontSize / 2, 0, y + fontSize / 2);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(0.5, colorMid);
        gradient.addColorStop(1, colorEnd);

        ctx.fillStyle = gradient;
        ctx.fillText(line, x, y);
      });
    };

    // 先立刻绘制一次，等网络字体加载完毕后再自动重绘确保生效
    drawCanvas();
    if (document.fonts && document.fonts.load) {
      document.fonts.load(`900 ${fontSize}px "${fontFamily}"`).then(() => {
        drawCanvas();
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [text, fontFamily, fontSize, colorStart, colorMid, colorEnd, strokeColor, strokeWidth, shadowColor, shadowBlur, depth3d, color3d, isNeon]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `art-text-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', background: '#141414', color: '#fff' }}>
      {/* 左侧控制面板 */}
      <div style={{ width: 340, padding: 20, background: '#1f1f1f', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', maxHeight: '100vh', boxSizing: 'border-box' }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>艺术字生成器 Pro</h2>

        {/* 一键预设模板区 */}
        <div>
          <div style={{ fontSize: 13, color: '#aaa', marginBottom: 8 }}>一键套用爆款预设：</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset.config)}
                style={{
                  padding: '6px 10px',
                  fontSize: 12,
                  background: '#2c2c2c',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <label style={{ fontSize: 13 }}>
          文字内容（支持换行）：
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', marginTop: 6, padding: 8, background: '#2b2b2b', color: '#fff', border: '1px solid #444', borderRadius: 4, boxSizing: 'border-box' }}
          />
        </label>

        <label style={{ fontSize: 13 }}>
          免费商用字体：
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            style={{ width: '100%', marginTop: 6, padding: 8, background: '#2b2b2b', color: '#fff', border: '1px solid #444', borderRadius: 4 }}
          >
            {FONTS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ fontSize: 13 }}>
          字号 ({fontSize}px)：
          <input type="range" min="36" max="180" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ width: '100%' }} />
        </label>

        {/* 三段渐变色 */}
        <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
          <label style={{ flex: 1 }}>
            顶部色
            <input type="color" value={colorStart} onChange={(e) => setColorStart(e.target.value)} style={{ width: '100%', height: 32, marginTop: 4 }} />
          </label>
          <label style={{ flex: 1 }}>
            中间高光
            <input type="color" value={colorMid} onChange={(e) => setColorMid(e.target.value)} style={{ width: '100%', height: 32, marginTop: 4 }} />
          </label>
          <label style={{ flex: 1 }}>
            底部色
            <input type="color" value={colorEnd} onChange={(e) => setColorEnd(e.target.value)} style={{ width: '100%', height: 32, marginTop: 4 }} />
          </label>
        </div>

        {/* 3D 立体厚度与颜色 */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13 }}>
          <label style={{ flex: 2 }}>
            3D 立体厚度 ({depth3d}px)：
            <input type="range" min="0" max="25" value={depth3d} onChange={(e) => setDepth3d(Number(e.target.value))} style={{ width: '100%' }} />
          </label>
          <label style={{ flex: 1, fontSize: 12 }}>
            立体侧边色
            <input type="color" value={color3d} onChange={(e) => setColor3d(e.target.value)} style={{ width: '100%', height: 32, marginTop: 4 }} />
          </label>
        </div>

        {/* 描边设置 */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13 }}>
          <label style={{ flex: 2 }}>
            描边粗细 ({strokeWidth}px)：
            <input type="range" min="0" max="30" value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} style={{ width: '100%' }} />
          </label>
          <label style={{ flex: 1, fontSize: 12 }}>
            描边颜色
            <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} style={{ width: '100%', height: 32, marginTop: 4 }} />
          </label>
        </div>

        {/* 阴影 / 发光设置 */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13 }}>
          <label style={{ flex: 2 }}>
            发光/阴影 ({shadowBlur}px)：
            <input type="range" min="0" max="50" value={shadowBlur} onChange={(e) => setShadowBlur(Number(e.target.value))} style={{ width: '100%' }} />
          </label>
          <label style={{ flex: 1, fontSize: 12 }}>
            发光颜色
            <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} style={{ width: '100%', height: 32, marginTop: 4 }} />
          </label>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
          <input type="checkbox" checked={isNeon} onChange={(e) => setIsNeon(e.target.checked)} />
          开启霓虹双层光晕模式
        </label>

        <button
          onClick={handleExport}
          style={{ marginTop: 6, padding: '12px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15, fontWeight: 'bold' }}
        >
          导出高清透明 PNG
        </button>
      </div>

      {/* 右侧预览画布 */}
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