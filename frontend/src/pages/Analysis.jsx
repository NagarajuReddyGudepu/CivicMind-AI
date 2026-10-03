import Icon from "../components/Icon";
const sev={High:"#dc2626",Medium:"#f59e0b",Low:"#16a34a"};
export default function Analysis({a,preview,go}){
 if(!a)return null;const pct=Math.round((a.confidence||0)*100);
 const rows=[["Issue",a.issue,"alert","#2563eb"],["Category",a.category,"tag","#16a34a"],["Confidence",pct+"%","gauge","#7c3aed"],["Severity",a.severity,"alert",sev[a.severity]||"#f97316"]];
 return(<div className="panel" style={{maxWidth:760}}><div className="card"><div className="res"><img src={preview} alt="Reported issue"/>
  <div><div className="ok"><Icon n="check" s={2.5}/>Analysis Complete!</div><p style={{color:"var(--mute)",fontSize:13}}>AI has analyzed the image and identified the issue.</p>
   <div className="rows">{rows.map(([l,v,i,c])=><div key={l}><span className="ico" style={{background:c}}><Icon n={i}/></span>{l}<b>{v}</b></div>)}</div></div></div>
  <div className="ex card" style={{background:"#f8fafc"}}><h3>AI Explanation</h3><p>{a.explanation}</p></div></div>
  <div className="next"><button className="btn" onClick={()=>go("complaint")}>Next: Generate Complaint</button></div></div>);}
