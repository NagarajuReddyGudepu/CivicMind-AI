import { useState } from "react";
import Icon from "../components/Icon";
import { Status, Severity } from "../components/Badge";
import { fmtDate } from "../util";
export function ReportTable({rows,open,severity}){
 return(<div className="tw"><table className="tbl"><thead><tr><th>Report ID</th><th>Issue</th><th>Category</th>{severity&&<th>Severity</th>}<th>Status</th><th>Date</th></tr></thead>
  <tbody>{rows.map(r=><tr key={r.report_id}><td><button className="lnk" onClick={()=>open(r)}>{r.report_id}</button></td><td>{r.issue}</td><td>{r.category}</td>
   {severity&&<td><Severity v={r.severity}/></td>}<td><Status v={r.status}/></td><td>{fmtDate(r.created_at)}</td></tr>)}</tbody></table></div>);}
export const Empty=({text,go})=><div className="empty"><p>{text}</p>{go&&<button className="btn" onClick={go}>Report an Issue</button>}</div>;
export default function MyReports({reports,loading,error,open,go}){
 const [q,setQ]=useState(""),rows=reports.filter(r=>r.report_id.toLowerCase().includes(q.trim().toLowerCase()));
 return(<div className="panel wide"><div className="row-h"><div><h1 className="pt">My Reports</h1><p className="sub">Track the status of your submitted reports.</p></div>
  <label className="search"><Icon n="search"/><input placeholder="Search by Report ID..." value={q} onChange={e=>setQ(e.target.value)} aria-label="Search by Report ID"/></label></div>
  <div className="card flush">{loading?<Empty text="Loading your reports…"/>:error?<Empty text={error}/>:rows.length?<ReportTable rows={rows} open={open}/>:
   <Empty text={q?"No report matches that ID.":"You haven't submitted any reports yet."} go={q?null:()=>go("report")}/>}</div></div>);}
