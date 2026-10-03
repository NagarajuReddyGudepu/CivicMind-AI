export const fmtDate=s=>s?new Date(s).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"—";
const K="civicmind_resolved";
export const getResolved=id=>{try{return JSON.parse(localStorage.getItem(K)||"{}")[id]}catch{return}};
export const setResolved=id=>{try{const o=JSON.parse(localStorage.getItem(K)||"{}");o[id]=new Date().toISOString();localStorage.setItem(K,JSON.stringify(o))}catch{/* storage unavailable */}};
export const STATUSES=["Submitted","Under Review","In Progress","Resolved"];
