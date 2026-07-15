import { useState } from 'react';
import '../styles/components/BrandEditPanel.css';

function Row({ label, value, min, max, step = 0.5, unit = '%', onChange }) {
  return (
    <label className="bep-row">
      <span className="bep-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <input
        className="bep-num"
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className="bep-unit">{unit}</span>
    </label>
  );
}

export default function BrandEditPanel({ tune, setTune }) {
  const [sel, setSel] = useState(4);
  const set = (k) => (v) => setTune((t) => ({ ...t, [k]: v }));
  const setStar = (n, axis) => (v) =>
    setTune((t) => ({ ...t, stars: { ...t.stars, [n]: { ...t.stars[n], [axis]: v } } }));

  const summary = JSON.stringify(tune);

  return (
    <div className="bep" onWheel={(e) => e.stopPropagation()}>
      <div className="bep-title">位置編輯面板</div>
      <p className="bep-hint">拖動或輸入數值即時預覽。調好後按「複製數值」貼給我，我寫死成預設。</p>

      <fieldset>
        <legend>MY BRAND 文字</legend>
        <Row label="左 left" value={tune.brandLeft} min={0} max={90} onChange={set('brandLeft')} />
        <Row label="上 top" value={tune.brandTop} min={0} max={90} onChange={set('brandTop')} />
        <Row label="字級" value={tune.brandSize} min={3} max={16} step={0.2} unit="vw" onChange={set('brandSize')} />
      </fieldset>

      <fieldset>
        <legend>小標文字</legend>
        <Row label="X" value={tune.descX} min={-240} max={240} step={1} unit="px" onChange={set('descX')} />
        <Row label="Y" value={tune.descY} min={-160} max={220} step={1} unit="px" onChange={set('descY')} />
        <Row label="間距 gap" value={tune.descGap} min={0} max={48} step={1} unit="px" onChange={set('descGap')} />
        <Row label="字級" value={tune.descSize} min={0.6} max={3} step={0.1} unit="vw" onChange={set('descSize')} />
        <Row label="行高" value={tune.descLine} min={1} max={2.4} step={0.1} unit="" onChange={set('descLine')} />
        <Row label="透明" value={tune.descAlpha} min={0.2} max={1} step={0.05} unit="" onChange={set('descAlpha')} />
      </fieldset>

      <fieldset>
        <legend>螢幕光暈 (點亮的淺黃框)</legend>
        <Row label="左 left" value={tune.glowLeft} min={0} max={90} onChange={set('glowLeft')} />
        <Row label="上 top" value={tune.glowTop} min={0} max={95} onChange={set('glowTop')} />
        <Row label="寬 width" value={tune.glowW} min={2} max={40} onChange={set('glowW')} />
        <Row label="高 height" value={tune.glowH} min={2} max={40} onChange={set('glowH')} />
      </fieldset>

      <fieldset>
        <legend>地板滑板狗：桌面版</legend>
        <Row label="狗 X" value={tune.dogX} min={-5} max={5} step={0.1} onChange={set('dogX')} />
        <Row label="狗 Y" value={tune.dogY} min={-5} max={5} step={0.1} onChange={set('dogY')} />
        <Row label="狗大小" value={tune.dogSize} min={4} max={16} step={0.1} unit="vw" onChange={set('dogSize')} />
      </fieldset>

      <fieldset>
        <legend>星星位移</legend>
        <label className="bep-row">
          <span className="bep-label">選星星</span>
          <select value={sel} onChange={(e) => setSel(parseInt(e.target.value, 10))}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                star-{n}
              </option>
            ))}
          </select>
        </label>
        <Row label="X" value={tune.stars[sel].x} min={-40} max={40} onChange={setStar(sel, 'x')} />
        <Row label="Y" value={tune.stars[sel].y} min={-40} max={40} onChange={setStar(sel, 'y')} />
      </fieldset>

      <fieldset>
        <legend>手機版：房子與文字</legend>
        <Row
          label="房子寬"
          value={tune.mobileStageWidth}
          min={160}
          max={340}
          step={1}
          unit="vw"
          onChange={set('mobileStageWidth')}
        />
        <Row
          label="大標 X"
          value={tune.mobileBrandLeft}
          min={0}
          max={90}
          step={0.5}
          onChange={set('mobileBrandLeft')}
        />
        <Row
          label="大標 Y"
          value={tune.mobileBrandTop}
          min={0}
          max={70}
          step={0.5}
          onChange={set('mobileBrandTop')}
        />
        <Row
          label="大標字"
          value={tune.mobileBrandSize}
          min={6}
          max={24}
          step={0.2}
          unit="vw"
          onChange={set('mobileBrandSize')}
        />
        <Row
          label="小標 X"
          value={tune.mobileDescX}
          min={-180}
          max={180}
          step={1}
          unit="px"
          onChange={set('mobileDescX')}
        />
        <Row
          label="小標 Y"
          value={tune.mobileDescY}
          min={-140}
          max={180}
          step={1}
          unit="px"
          onChange={set('mobileDescY')}
        />
        <Row
          label="小標距"
          value={tune.mobileDescGap}
          min={0}
          max={48}
          step={1}
          unit="px"
          onChange={set('mobileDescGap')}
        />
        <Row
          label="小標字"
          value={tune.mobileDescSize}
          min={2}
          max={7}
          step={0.1}
          unit="vw"
          onChange={set('mobileDescSize')}
        />
        <Row
          label="小標行"
          value={tune.mobileDescLine}
          min={1}
          max={2.4}
          step={0.1}
          unit=""
          onChange={set('mobileDescLine')}
        />
        <Row
          label="小標透"
          value={tune.mobileDescAlpha}
          min={0.2}
          max={1}
          step={0.05}
          unit=""
          onChange={set('mobileDescAlpha')}
        />
      </fieldset>

      <fieldset>
        <legend>手機版：Knock 與燈牌</legend>
        <Row
          label="氣泡 X"
          value={tune.mobileBubbleX}
          min={-80}
          max={80}
          step={0.5}
          onChange={set('mobileBubbleX')}
        />
        <Row
          label="氣泡 Y"
          value={tune.mobileBubbleY}
          min={-80}
          max={80}
          step={0.5}
          onChange={set('mobileBubbleY')}
        />
        <Row
          label="氣泡縮"
          value={tune.mobileBubbleScale}
          min={0.4}
          max={1.8}
          step={0.05}
          unit=""
          onChange={set('mobileBubbleScale')}
        />
        <Row
          label="燈牌 X"
          value={tune.mobileSignX}
          min={-80}
          max={80}
          step={0.5}
          onChange={set('mobileSignX')}
        />
        <Row
          label="燈牌 Y"
          value={tune.mobileSignY}
          min={-80}
          max={80}
          step={0.5}
          onChange={set('mobileSignY')}
        />
        <Row
          label="燈牌縮"
          value={tune.mobileSignScale}
          min={0.4}
          max={1.8}
          step={0.05}
          unit=""
          onChange={set('mobileSignScale')}
        />
      </fieldset>

      <fieldset>
        <legend>手機版：滑板狗</legend>
        <Row label="狗 X" value={tune.mobileDogX} min={-10} max={10} step={0.1} onChange={set('mobileDogX')} />
        <Row label="狗 Y" value={tune.mobileDogY} min={-10} max={10} step={0.1} onChange={set('mobileDogY')} />
        <Row
          label="狗大小"
          value={tune.mobileDogSize}
          min={10}
          max={40}
          step={0.1}
          unit="vw"
          onChange={set('mobileDogSize')}
        />
      </fieldset>

      <textarea className="bep-out" readOnly value={summary} />
      <button
        className="bep-copy"
        onClick={() => {
          navigator.clipboard?.writeText(summary);
        }}
      >
        複製數值
      </button>
    </div>
  );
}
