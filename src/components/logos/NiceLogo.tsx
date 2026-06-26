const BASE = import.meta.env.BASE_URL;
const SYMBOL_URL = `${BASE}NICE_Symbol_Blue (1).png`;
const BIZINFO_URL = `${BASE}logo-nicednb.c820dabc (1).jpg`;
const DNB_URL = `${BASE}nice-dnb.svg`;

/** 사이드바 상단 — 실제 NICE 심볼 PNG + "Sentinel" */
export function NiceSentinelLogo() {
  return (
    <div className="flex items-center gap-3">
      <img src={SYMBOL_URL} alt="NICE" className="h-10 w-10 object-contain bg-white rounded p-0.5 flex-shrink-0" />
      <div>
        <span className="text-white font-bold text-base tracking-wide">Sentinel</span>
        <div className="text-blue-300 text-[10px] tracking-widest uppercase mt-0.5">AI 가맹점 심사역</div>
      </div>
    </div>
  );
}

/** NICE평가정보 출처 배지 */
export function NiceBizinfoBadge() {
  return (
    <div className="inline-flex items-center bg-white border border-[#002555]/25 rounded-md px-2 py-1">
      <img src={BIZINFO_URL} alt="NICE평가정보" className="h-5 w-auto object-contain" style={{ maxWidth: 100 }} />
    </div>
  );
}

/** NICE D&B 출처 배지 */
export function NiceDnbBadge() {
  return (
    <div className="inline-flex items-center bg-white border border-[#002555]/25 rounded-md px-2 py-1">
      <img src={DNB_URL} alt="NICE D&B" className="h-5 w-auto object-contain" style={{ maxWidth: 90 }} />
    </div>
  );
}
