import Icon from "../components/Icon";
import { Severity, Status } from "../components/Badge";
export default function Success({r,go}){
 if(!r)return null;
 const T=[["Issue",r.issue,"pin","#2563eb"],["Category",r.category,"road","#16a34a"],["Severity",<Severity v={r.severity}/>,"alert","#f97316"],["Status",<Status v={r.status}/>,"check","#16a34a"]];
 return(<div className="center-page"><div className="done card"><span className="bigcheck"><Icon n="check" s={3}/></span>
  <h1>Report Submitted Successfully!</h1><p>Your civic issue has been reported and saved.</p>
  <div className="rid"><span>Report ID</span><strong>{r.report_id}</strong></div>
  <div className="tiles">{T.map(([l,v,i,c])=><div key={l}><span className="ico" style={{background:c}}><Icon n={i}/></span><small>{l}</small><b>{v}</b></div>)}</div>
  <button className="btn block" onClick={()=>go("reports")}>View My Reports</button>
  <button className="lnk" onClick={()=>go("home")}>Back to Dashboard</button></div></div>);}
