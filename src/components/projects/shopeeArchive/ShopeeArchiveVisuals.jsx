import '../../../styles/components/ShopeeArchiveVisuals.css';

function DashboardMock() {
  return (
    <div className="sa-visual sa-dash" role="img" aria-label="同步流程中心 Dashboard v2.0 桌面介面">
      <div className="sa-visual__bar">
        <span className="sa-visual__dot" style={{ background: '#ff5f57' }} />
        <span className="sa-visual__dot" style={{ background: '#febc2e' }} />
        <span className="sa-visual__dot" style={{ background: '#28c840' }} />
        <span className="sa-visual__title">同步流程中心 — Dashboard v2.0</span>
      </div>
      <div className="sa-dash__nav">
        <span className="sa-dash__brand">同步流程中心</span>
        <span className="sa-dash__navlinks">
          <span className="muted">+ 新增流程</span>
          <span className="on">主頁面</span>
        </span>
      </div>
      <div className="sa-dash__body">
        <div className="sa-dash__list">
          <div className="sa-dash__list-head">
            <span>自動化流程列表</span>
            <span className="sa-dash__manage">管理</span>
          </div>
          <div className="sa-dash__bars">
            <div className="sa-dash__bar sa-dash__bar--active">雙12 素材同步</div>
            <div className="sa-dash__bar">品牌週 KV 同步</div>
            <div className="sa-dash__bar">日常 Banner 同步</div>
            <div className="sa-dash__bar">社群貼文 同步</div>
          </div>
        </div>
        <div className="sa-dash__main">
          <div className="sa-dash__task">雙12 素材同步</div>
          <div className="sa-dash__console">
            <div className="c-run">→ 啟動任務：雙12 素材同步</div>
            <div className="c-dim">--- [處理第 3 列 | 日期: 12/02] ---</div>
            <div className="c-add">&nbsp;&nbsp;[+] 同步: banner_1200x628.png</div>
            <div className="c-add">&nbsp;&nbsp;[+] 同步: kv_main.jpg</div>
            <div className="c-add">&nbsp;&nbsp;[+] 同步: app_icon.png</div>
            <div className="c-info">&nbsp;&nbsp;[→] 已開啟目標資料夾</div>
            <div className="c-dim">--- [處理第 4 列 | 日期: 12/02] 無更新檔案</div>
            <div>&nbsp;</div>
            <div className="c-done">[完成] 任務結束。</div>
          </div>
          <div className="sa-dash__start">啟動任務</div>
          <div className="sa-dash__opts">
            <span className="accent">只同步當天日期</span>
            <span>略過 psd · psb · ai 檔</span>
            <span>僅更新較新檔案</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SheetRow({ num, group, date, title, isLink, inPath, outPath, status, statusKind }) {
  return (
    <tr>
      <td className={`num ${group}-a`}>{num}</td>
      <td className={`${group}-a`}>{date}</td>
      <td className={`${group}-b`}>
        {isLink ? <span className="link">{title}</span> : title}
      </td>
      <td className={`path ${group}-cd`} title={inPath}>{inPath}</td>
      <td className={`path ${group}-cd`} title={outPath}>{outPath}</td>
      <td className={`${group}-b ${statusKind === 'ok' ? 'status-ok' : statusKind === 'wait' ? 'status-wait' : ''}`}>{status}</td>
    </tr>
  );
}

function SheetMock() {
  return (
    <div className="sa-visual sa-sheet-wrap" role="img" aria-label="工單自動同步試算表，依日期分組著色並附藍色超連結">
      <div className="sa-sheet__menu">
        <span className="dot" />
        <span className="name">同步機器人 1.0 — Google Sheet</span>
        <span className="tool">自動化工具 · 手動同步日曆</span>
      </div>
      <div className="sa-sheet">
        <table>
          <colgroup>
            <col style={{ width: '22px' }} />
            <col style={{ width: '64px' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '26%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '68px' }} />
          </colgroup>
          <thead>
            <tr>
              <th />
              <th>A · 日期</th>
              <th>B · 主旨</th>
              <th>C · 內部路徑</th>
              <th>D · 外部路徑</th>
              <th>G · 狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hidden-row">
              <td colSpan={6}>⊘ 過期項目已自動隱藏（今天以前）</td>
            </tr>
            <SheetRow num="3" group="g1" date="2025/12/02" title="[美術] 雙12 首頁 Banner" isLink inPath="…\內部-素材\1212\Banner\assets" outPath="…\外部-素材\1212\Banner" status="信件已建立" statusKind="ok" />
            <SheetRow num="4" group="g1" date="2025/12/02" title="[美術] 雙12 App icon" isLink inPath="…\內部-素材\1212\Icon\assets" outPath="…\外部-素材\1212\Icon" status="信件已建立" statusKind="ok" />
            <SheetRow num="5" group="g2" date="2025/12/03" title="[美術] 品牌週 KV" isLink inPath="…\內部-素材\BrandWeek\KV\assets" outPath="…\外部-素材\BrandWeek\KV" status="信件已建立" statusKind="ok" />
            <SheetRow num="6" group="g2" date="2025/12/03" title="[美術] 品牌週 社群圖" inPath="（貼上內部路徑後自動處理）" outPath="" status="待處理" statusKind="wait" />
          </tbody>
        </table>
        <div className="sa-sheet__legend">
          <span><span className="sw g1-a" /> / <span className="sw g2-a" /> 依日期分組交替上色</span>
          <span><span className="link">藍色底線</span> = 偵測到信件連結</span>
          <span className="status-ok">信件已建立 = 草稿已備好</span>
        </div>
      </div>
    </div>
  );
}

function GmailMock() {
  return (
    <div className="sa-visual sa-gmail-wrap" role="img" aria-label="系統自動建立的 Gmail 草稿信，含橘色路徑框，尚未寄出">
      <div className="sa-gmail__head">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ea4335" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
        <span className="name">Gmail — 草稿（系統自動建立，尚未寄出）</span>
        <span className="sa-gmail__badge">草稿</span>
      </div>
      <div className="sa-gmail">
        <div className="sa-gmail__meta">
          <div><span className="k">收件</span> Wei &lt;wei@partner-team.com&gt;</div>
          <div><span className="k">主旨</span> Re: [美術] 雙12 首頁 Banner</div>
        </div>
        <div className="sa-gmail__body">
          <div>Hi Wei,</div>
          <div>檔案已完成，再麻煩確認，謝謝!</div>
          <div style={{ marginTop: 12 }}>路徑:</div>
          <div className="sa-gmail__pathbox">G:\EXT_TWN_SHP_外部-素材\1212\Banner</div>
          <div className="sa-gmail__sign">— 設計團隊簽名檔 —</div>
        </div>
        <div className="sa-gmail__foot">
          <span className="sa-gmail__send">傳送</span>
          <span className="sa-gmail__note">✋ 由設計師確認檔案無誤後，人工按下傳送</span>
        </div>
      </div>
    </div>
  );
}

function ConfigMock() {
  return (
    <div className="sa-visual sa-config" role="img" aria-label="同步流程中心的流程設定畫面：任務命名、Sheet 網址、同步欄位與勾選選項">
      <div className="sa-visual__bar">
        <span className="sa-visual__dot" style={{ background: '#ff5f57' }} />
        <span className="sa-visual__dot" style={{ background: '#febc2e' }} />
        <span className="sa-visual__dot" style={{ background: '#28c840' }} />
        <span className="sa-visual__title">同步流程中心 — 流程設定</span>
      </div>
      <div className="sa-config__stage">
        <div className="sa-config__card">
          <div className="sa-config__title">流程設定</div>
          <div className="sa-config__field">
            <span className="sa-config__label">任務命名：</span>
            <span className="sa-config__input">雙12 素材同步</span>
          </div>
          <div className="sa-config__field">
            <span className="sa-config__label">Sheet 網址：</span>
            <span className="sa-config__input">docs.google.com/spreadsheets/d/1A2b3C…</span>
          </div>
          <div className="sa-config__field">
            <span className="sa-config__label">Sheet 名稱：</span>
            <span className="sa-config__input">工單清單</span>
          </div>
          <div className="sa-config__cols">
            <span className="lab">同步欄位：</span>
            <span className="sa-config__colbox">C</span>
            <span className="sep">至</span>
            <span className="sa-config__colbox">D</span>
          </div>
          <div className="sa-config__checks">
            <span className="sa-config__check sa-config__check--on">
              <span className="sa-config__box">✓</span>只同步當天日期（A 欄）
            </span>
            <span className="sa-config__check sa-config__check--muted">
              <span className="sa-config__box">✓</span>略過 psd、psb 和 ai 檔
            </span>
          </div>
          <div className="sa-config__btns">
            <span className="sa-config__btn sa-config__btn--cancel">取消</span>
            <span className="sa-config__btn sa-config__btn--save">儲存修改</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarEvent({ dot, date, keyword, rest, sub, tag, tagKind, muted }) {
  return (
    <div className="sa-cal__row">
      <span className="sa-cal__date">{date}</span>
      <span className="sa-cal__dot" style={{ background: dot }} />
      <span className="sa-cal__event">
        <span className={`ttl${muted ? ' muted' : ''}`}>
          {keyword ? (
            <>[<span className="sa-cal__kw">{keyword}</span>]{rest}</>
          ) : (
            rest
          )}
        </span>
        {sub && <span className="sub">{sub}</span>}
      </span>
      <span className={`sa-cal__tag ${tagKind === 'skip' ? 'sa-cal__tag--skip' : 'sa-cal__tag--on'}`}>{tag}</span>
    </div>
  );
}

function CalendarMock() {
  return (
    <div className="sa-visual sa-cal-wrap" role="img" aria-label="Google 日曆：系統只抓標題含「美術」的事件並擷取主旨與截止日">
      <div className="sa-cal__head">
        <span className="g">
          <span style={{ background: '#1a73e8' }} />
          <span style={{ background: '#9aa0a6' }} />
        </span>
        <span className="m">Google 日曆 · 2025 年 12 月</span>
        <span className="today">只抓「美術」</span>
      </div>
      <div className="sa-cal">
        <CalendarEvent dot="#1a73e8" date="12/02 (二)" keyword="美術" rest=" 雙12 首頁 Banner" sub="10:00–11:00 · DL 12/05 · 附件連結" tag="偵測 ✓" tagKind="on" />
        <CalendarEvent dot="#9aa0a6" date="12/02 (二)" rest="團隊週會" sub="09:00–09:30" tag="略過" tagKind="skip" muted />
        <CalendarEvent dot="#1a73e8" date="12/03 (三)" keyword="美術" rest=" 品牌週 KV" sub="14:00–15:00 · DL 12/06" tag="偵測 ✓" tagKind="on" />
      </div>
      <div className="sa-cal__note">系統只抓標題含「美術」的事件，並擷取主旨與 DL 截止日寫入 Sheet。</div>
    </div>
  );
}

const VISUALS = {
  dashboard: DashboardMock,
  sheet: SheetMock,
  gmail: GmailMock,
  config: ConfigMock,
  calendar: CalendarMock,
};

export default function ShopeeVisual({ id, compact = false }) {
  const Cmp = VISUALS[id];
  if (!Cmp) return null;
  return (
    <div className={`sa-visual-slot${compact ? ' sa-visual--compact' : ''}`}>
      <Cmp />
    </div>
  );
}
