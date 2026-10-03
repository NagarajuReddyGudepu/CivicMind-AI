import Icon from "../components/Icon";
import { Status } from "../components/Badge";
import { fmtDate, getResolved } from "../util";
export default function Resolved({r,admin,go}){
 if(!r)return null;const back=admin?"adminReports":"reports";
 const issue=(r.issue||"issue").toLowerCase(),msg=issue.includes("pothole")?"The pothole has been repaired and the report is closed.":`The ${issue} has been resolved and the report is closed.`;
 return(<div className="center-page road"><div className="done card"><span className="bigcheck"><Icon n="check" s={3}/></span><h1>Issue Resolved!</h1><p>{msg}</p>
  <div className="fin">Final Status <Status v="Resolved"/></div>
  <dl className="facts"><div><dt>Report ID</dt><dd>{r.report_id}</dd></div><div><dt>Issue</dt><dd>{r.issue}</dd></div><div><dt>Category</dt><dd>{r.category}</dd></div>
   <div><dt>Resolved On</dt><dd>{getResolved(r.report_id)?fmtDate(getResolved(r.report_id)):"Not recorded"}</dd></div></dl>
  <button className="btn block" onClick={()=>go(back)}>View All Reports</button><p className="thanks">Thank you for helping build better communities!</p></div></div>);}
