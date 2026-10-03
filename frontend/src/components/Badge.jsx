const slug=s=>(s||"").toLowerCase().replace(/\s+/g,"-");
export const Status=({v})=><span className={"bdg st-"+slug(v)}>{v}</span>;
export const Severity=({v})=><span className={"bdg sv-"+slug(v)}>{v}</span>;
