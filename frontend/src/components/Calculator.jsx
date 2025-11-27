import React, { useState } from "react";
import axios from "axios";

export default function Calculator() {
  const [estate, setEstate] = useState(0);
  const [debts, setDebts] = useState(0);
  const [will, setWill] = useState(0);
  const [ignoreWillLimit, setIgnoreWillLimit] = useState(false);
  const [counts, setCounts] = useState({
    husband:0, wife:0, sons:0, daughters:0, father:0, mother:0, brothers:0, sisters:0, uncles:0, aunts:0
  });
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    try {
      const resp = await axios.post("http://localhost:4000/api/calc", {
        estate, debts, willFraction: will, ignoreWillLimit, counts
      });
      setResult(resp.data);
    } catch (err) { console.error(err); alert("خطا در محاسبه!"); }
  };

  const handleCountsChange = (e) => {
    setCounts({...counts, [e.target.name]: Number(e.target.value)});
  };

  return (
    <div>
      <label>ترکه (تومان):</label>
      <input type="number" value={estate} onChange={e=>setEstate(Number(e.target.value))} />
      <label>بدهی:</label>
      <input type="number" value={debts} onChange={e=>setDebts(Number(e.target.value))} />
      <label>وصیت (کسری/1.0):</label>
      <input type="number" value={will} step="0.01" onChange={e=>setWill(Number(e.target.value))} />
      <label><input type="checkbox" checked={ignoreWillLimit} onChange={e=>setIgnoreWillLimit(e.target.checked)} /> نادیده گرفتن محدودیت 1/3 وصیت</label>
      <h3>تعداد وراث:</h3>
      {Object.keys(counts).map(k=>(
        <div key={k}>
          <label>{k}:</label>
          <input type="number" name={k} value={counts[k]} onChange={handleCountsChange} />
        </div>
      ))}
      <button onClick={handleCalculate}>محاسبه</button>

      {result && (
        <div style={{marginTop:"20px", background:"#eef", padding:"10px", borderRadius:"5px"}}>
          <h3>نتیجه:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
