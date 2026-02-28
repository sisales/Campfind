Copy the full code from the "pages/index.js — Main App" artifact above ⬆️import { useState } from "react";

const CATEGORIES = ["All","STEM","Sports","Arts","Outdoor","Technology","Music","Leadership"];
const AGE_GROUPS = ["All Ages","5-7","8-10","11-13","14-17"];
const catColors = {STEM:"#3b82f6",Sports:"#10b981",Arts:"#8b5cf6",Outdoor:"#f59e0b",Technology:"#06b6d4",Music:"#ec4899",Leadership:"#f97316"};
const catEmoji = {STEM:"🔬",Sports:"⚽",Arts:"🎨",Outdoor:"🌲",Technology:"💻",Music:"🎵",Leadership:"🏆"};

// Simple in-memory user store (replace with DB later)
const USERS = {};

// ─── AUTH MODAL ────────────────────────────────────────────────────
function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    setErr("");
    if (!email || !pass) return setErr("Please fill all fields.");
    if (mode === "signup") {
      if (!name) return setErr("Please enter your name.");
      if (USERS[email]) return setErr("Email already registered.");
      USERS[email] = { name, password: pass, favorites: [], bookings: [] };
      onLogin({ email, name });
    } else {
      const u = USERS[email];
      if (!u || u.password !== pass) return setErr("Invalid email or password.");
      onLogin({ email, name: u.name });
    }
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtn}>✕</button>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:36}}>🏕️</div>
          <h2 style={{margin:"8px 0 4px"}}>{mode==="login"?"Welcome Back":"Create Account"}</h2>
          <p style={{color:"#6b7280",fontSize:13}}>Save favorite camps & manage bookings</p>
        </div>
        <div style={{display:"flex",background:"#f3f4f6",borderRadius:10,padding:3,marginBottom:16}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>setMode(m)} style={{
              flex:1,padding:"8px 0",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",
              background:mode===m?"#fff":"transparent",color:mode===m?"#1e40af":"#6b7280"
            }}>{m==="login"?"Log In":"Sign Up"}</button>
          ))}
        </div>
        {mode==="signup"&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" style={inputSt}/>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={inputSt}/>
        <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" type="password" style={inputSt}/>
        {err&&<p style={{color:"#ef4444",fontSize:13}}>{err}</p>}
        <button onClick={submit} style={{...primaryBtn,width:"100%",marginTop:8}}>
          {mode==="login"?"Log In →":"Create Account →"}
        </button>
      </div>
    </div>
  );
}

// ─── CHECKOUT MODAL ────────────────────────────────────────────────
function CheckoutModal({ camp, user, onClose, onConfirm }) {
  const [child, setChild] = useState("");
  const [age, setAge] = useState("");
  const [week, setWeek] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const weeks = ["July 7–11","July 14–18","July 21–25","July 28–Aug 1","Aug 4–8","Aug 11–15"];

  const submit = () => {
    if (!child||!age||!week) return;
    onConfirm({ camp, child, age, week, notes, status:"pending", bookedAt: new Date().toLocaleString() });
    setDone(true);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtn}>✕</button>
        {done ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:52}}>🎉</div>
            <h2 style={{color:"#10b981"}}>Booking Submitted!</h2>
            <p style={{color:"#6b7280",fontSize:14,lineHeight:1.6}}>
              Your booking for <strong>{camp.name}</strong> is under <strong>privacy review</strong>.<br/>
              Confirmation sent to {user.email} within 24 hours.
            </p>
            <div style={{background:"#fef3c7",borderRadius:12,padding:14,textAlign:"left",fontSize:13,margin:"12px 0"}}>
              <strong>📋 What happens next:</strong>
              <ul style={{margin:"8px 0 0",paddingLeft:18,lineHeight:2}}>
                <li>Camp operator reviews your request</li>
                <li>Privacy & safety check completed</li>
                <li>Payment collected after approval</li>
              </ul>
            </div>
            <button onClick={onClose} style={{...primaryBtn,width:"100%"}}>Done ✓</button>
          </div>
        ) : (
          <>
            <h2 style={{margin:"0 0 4px"}}>Book Camp</h2>
            <p style={{color:"#6b7280",fontSize:13,margin:"0 0 16px"}}>{camp.name} · ${camp.price}/week</p>
            <label style={labelSt}>Child&apos;s Name</label>
            <input value={child} onChange={e=>setChild(e.target.value)} placeholder="e.g. Emma" style={inputSt}/>
            <label style={labelSt}>Child&apos;s Age</label>
            <input value={age} onChange={e=>setAge(e.target.value)} placeholder="e.g. 10" type="number" style={inputSt}/>
            <label style={labelSt}>Select Week</label>
            <select value={week} onChange={e=>setWeek(e.target.value)} style={inputSt}>
              <option value="">Choose a week...</option>
              {weeks.map(w=><option key={w}>{w}</option>)}
            </select>
            <label style={labelSt}>Special Notes (optional)</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Allergies, special needs..." style={{...inputSt,height:72,resize:"vertical"}}/>
            <div style={{background:"#eff6ff",borderRadius:10,padding:12,fontSize:12,color:"#1e40af",margin:"8px 0"}}>
              🔒 No payment until booking is approved after privacy review.
            </div>
            <button onClick={submit} style={{...primaryBtn,width:"100%",marginTop:10}}>Submit for Review →</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── BOOKINGS PANEL ────────────────────────────────────────────────
function BookingsPanel({ user, onClose }) {
  const bookings = USERS[user.email]?.bookings || [];
  const sc = {pending:"#f59e0b",approved:"#10b981",declined:"#ef4444"};
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtn}>✕</button>
        <h2 style={{margin:"0 0 16px"}}>My Bookings</h2>
        {bookings.length===0 ? (
          <div style={{textAlign:"center",padding:"30px 0",color:"#9ca3af"}}>
            <div style={{fontSize:36}}>📋</div><p>No bookings yet</p>
          </div>
        ) : bookings.map((b,i)=>(
          <div key={i} style={{border:"1px solid #e5e7eb",borderRadius:12,padding:14,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div>
                <strong>{b.camp.name}</strong>
                <p style={{margin:"2px 0",fontSize:12,color:"#6b7280"}}>👧 {b.child}, age {b.age} · 📅 {b.week}</p>
                <p style={{margin:0,fontSize:11,color:"#9ca3af"}}>{b.bookedAt}</p>
              </div>
              <span style={{background:sc[b.status]+"20",color:sc[b.status],fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,height:"fit-content"}}>
                {b.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CAMP CARD ─────────────────────────────────────────────────────
function CampCard({ camp, user, isFav, onFavorite, onBook }) {
  const color = catColors[camp.category]||"#6b7280";
  return (
    <div style={{background:"#fff",borderRadius:16,overflow:"hidden",border:camp.featured?"2px solid #3b82f6":"1px solid #e5e7eb",boxShadow:camp.featured?"0 4px 24px rgba(59,130,246,0.15)":"0 2px 8px rgba(0,0,0,0.08)"}}>
      <div style={{height:88,background:`linear-gradient(135deg,${color}22,${color}44)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        {camp.featured&&<div style={{position:"absolute",top:8,left:8,background:"#3b82f6",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>⭐ FEATURED</div>}
        <button onClick={()=>onFavorite(camp)} style={{position:"absolute",top:8,right:8,background:isFav?"#ef4444":"rgba(255,255,255,0.8)",border:"none",borderRadius:20,padding:"4px 10px",fontSize:13,cursor:"pointer",color:isFav?"#fff":"#6b7280"}}>
          {isFav?"♥ Saved":"♡ Save"}
        </button>
        <span style={{fontSize:34}}>{catEmoji[camp.category]||"🏕️"}</span>
      </div>
      <div style={{padding:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <h3 style={{margin:0,fontSize:15,fontWeight:700,flex:1,paddingRight:8}}>{camp.name}</h3>
          <span style={{background:color,color:"#fff",fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:20,whiteSpace:"nowrap"}}>{camp.category}</span>
        </div>
        <p style={{margin:"0 0 6px",fontSize:12,color:"#6b7280"}}>📍 {camp.location} · 👧 Ages {camp.ageRange} · ⏱ {camp.duration}</p>
        <div style={{display:"flex",gap:3,marginBottom:8}}>
          {[1,2,3,4,5].map(i=><span key={i} style={{color:i<=Math.round(camp.rating)?"#f59e0b":"#d1d5db",fontSize:12}}>★</span>)}
          <span style={{fontSize:11,color:"#6b7280"}}>{camp.rating} ({camp.reviewCount})</span>
        </div>
        <p style={{margin:"0 0 10px",fontSize:12,color:"#4b5563",lineHeight:1.5}}>{camp.description}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:12}}>
          {camp.highlights.map((h,i)=><span key={i} style={{background:`${color}15`,color,fontSize:10,padding:"2px 8px",borderRadius:20}}>✓ {h}</span>)}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div><span style={{fontSize:20,fontWeight:800}}>${camp.price}</span><span style={{fontSize:12,color:"#6b7280"}}>/week</span></div>
          <span style={{fontSize:11,color:camp.spotsLeft<=5?"#ef4444":"#10b981",fontWeight:600}}>
            {camp.spotsLeft<=5?`🔥 ${camp.spotsLeft} left`:`✅ ${camp.spotsLeft} spots`}
          </span>
        </div>
        <button onClick={()=>onBook(camp)} style={{width:"100%",background:color,color:"#fff",border:"none",borderRadius:10,padding:"10px 0",fontSize:13,fontWeight:600,cursor:"pointer"}}>
          Book Now →
        </button>
      </div>
    </div>
  );
}

// ─── SHARED STYLES ─────────────────────────────────────────────────
const overlayStyle = {position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16};
const modalStyle = {background:"#fff",borderRadius:20,padding:28,maxWidth:420,width:"100%",position:"relative",boxShadow:"0 20px 60px rgba(0,0,0,0.3)",maxHeight:"90vh",overflowY:"auto"};
const closeBtn = {position:"absolute",top:12,right:14,background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#6b7280"};
const inputSt = {width:"100%",border:"1px solid #e5e7eb",borderRadius:10,padding:"10px 12px",fontSize:14,outline:"none",marginBottom:10,boxSizing:"border-box",background:"#f9fafb"};
const labelSt = {display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:4};
const primaryBtn = {background:"linear-gradient(135deg,#1e40af,#3b82f6)",color:"#fff",border:"none",borderRadius:10,padding:"11px 20px",fontSize:14,fontWeight:600,cursor:"pointer"};

// ─── MAIN PAGE ─────────────────────────────────────────────────────
export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [ageGroup, setAgeGroup] = useState("All Ages");
  const [maxPrice, setMaxPrice] = useState(800);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [checkoutCamp, setCheckoutCamp] = useState(null);
  const [tab, setTab] = useState("search");

  const favorites = user ? (USERS[user.email]?.favorites || []) : [];

  const search = async () => {
    setLoading(true); setSearched(true); setTab("search");
    try {
      const res = await fetch("/api/camps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, category, ageGroup, maxPrice })
      });
      const data = await res.json();
      setCamps(data.camps || []);
    } catch { setCamps([]); }
    setLoading(false);
  };

  const toggleFav = (camp) => {
    if (!user) return setShowAuth(true);
    const u = USERS[user.email];
    const idx = u.favorites.findIndex(f=>f.id===camp.id&&f.name===camp.name);
    if (idx>=0) u.favorites.splice(idx,1); else u.favorites.push(camp);
    setUser({...user});
  };

  const handleBook = (camp) => {
    if (!user) return setShowAuth(true);
    setCheckoutCamp(camp);
  };

  const confirmBooking = (booking) => {
    USERS[user.email].bookings.push(booking);
    setCheckoutCamp(null);
  };

  const isFav = (camp) => favorites.some(f=>f.id===camp.id&&f.name===camp.name);
  const displayCamps = tab==="favorites" ? favorites : camps;

  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"system-ui,sans-serif"}}>
      {/* NAV */}
      <div style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:24}}>🏕️</span>
          <span style={{fontWeight:800,fontSize:17,color:"#1e40af"}}>CampFindr Niagara</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {user ? (
            <>
              <button onClick={()=>setTab(t=>t==="favorites"?"search":"favorites")} style={{background:tab==="favorites"?"#eff6ff":"#f3f4f6",border:"none",borderRadius:8,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",color:tab==="favorites"?"#1e40af":"#374151"}}>
                ♥ Saved ({favorites.length})
              </button>
              <button onClick={()=>setShowBookings(true)} style={{background:"#f3f4f6",border:"none",borderRadius:8,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer"}}>📋 Bookings</button>
              <div style={{display:"flex",alignItems:"center",gap:6,background:"#eff6ff",borderRadius:8,padding:"6px 12px"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"#3b82f6",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700}}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{fontSize:13,fontWeight:600,color:"#1e40af"}}>{user.name.split(" ")[0]}</span>
                <button onClick={()=>setUser(null)} style={{background:"none",border:"none",color:"#9ca3af",cursor:"pointer",fontSize:12}}>✕</button>
              </div>
            </>
          ) : (
            <button onClick={()=>setShowAuth(true)} style={{...primaryBtn,padding:"8px 18px",fontSize:13}}>Log In / Sign Up</button>
          )}
        </div>
      </div>

      {/* HERO */}
      <div style={{background:"linear-gradient(135deg,#1e40af,#3b82f6,#06b6d4)",padding:"36px 20px 44px",textAlign:"center",color:"#fff"}}>
        <h1 style={{margin:"0 0 6px",fontSize:26,fontWeight:800}}>Find Niagara Summer Camps</h1>
        <p style={{margin:"0 0 22px",opacity:0.85,fontSize:14}}>Discover, save & book the perfect camp for your child</p>
        <div style={{display:"flex",gap:8,maxWidth:580,margin:"0 auto",background:"#fff",borderRadius:14,padding:5,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
          <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}
            placeholder="Search camps (robotics, swimming, art...)"
            style={{flex:1,border:"none",outline:"none",fontSize:14,padding:"8px 12px",background:"transparent",color:"#111"}}/>
          <button onClick={search} style={{...primaryBtn,padding:"9px 18px"}}>Search 🔍</button>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"10px 16px",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",justifyContent:"center"}}>
        {CATEGORIES.map(c=>(
          <button key={c} onClick={()=>setCategory(c)} style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:500,border:"1px solid",cursor:"pointer",background:category===c?"#3b82f6":"#fff",color:category===c?"#fff":"#374151",borderColor:category===c?"#3b82f6":"#d1d5db"}}>{c}</button>
        ))}
        <select value={ageGroup} onChange={e=>setAgeGroup(e.target.value)} style={{padding:"5px 10px",borderRadius:20,border:"1px solid #d1d5db",fontSize:12,cursor:"pointer",outline:"none"}}>
          {AGE_GROUPS.map(a=><option key={a}>{a}</option>)}
        </select>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
          <span style={{color:"#6b7280"}}>Max ${maxPrice}/wk</span>
          <input type="range" min={200} max={800} step={50} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} style={{width:90}}/>
        </div>
      </div>

      {/* RESULTS */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 16px"}}>
        {tab==="favorites"&&<div style={{marginBottom:16}}><h2 style={{margin:"0 0 4px"}}>♥ My Saved Camps</h2><p style={{margin:0,fontSize:13,color:"#6b7280"}}>{favorites.length} saved</p></div>}
        {!searched&&tab==="search"&&(
          <div style={{textAlign:"center",padding:"50px 0",color:"#9ca3af"}}>
            <div style={{fontSize:56,marginBottom:12}}>🏕️</div>
            <h2 style={{color:"#6b7280"}}>Ready to Find a Camp?</h2>
            <button onClick={search} style={{...primaryBtn,padding:"12px 28px",marginTop:8}}>Browse All Camps →</button>
          </div>
        )}
        {loading&&<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:36}}>⏳</div><p style={{color:"#6b7280"}}>Finding camps...</p></div>}
        {!loading&&(searched||tab==="favorites")&&displayCamps.length>0&&(
          <>
            {tab==="search"&&<p style={{color:"#6b7280",marginBottom:14,fontSize:13}}><strong>{displayCamps.length} camps</strong> found in Niagara</p>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:18}}>
              {displayCamps.map((camp,i)=><CampCard key={i} camp={camp} user={user} isFav={isFav(camp)} onFavorite={toggleFav} onBook={handleBook}/>)}
            </div>
          </>
        )}
        {!loading&&tab==="favorites"&&favorites.length===0&&(
          <div style={{textAlign:"center",padding:"50px 0",color:"#9ca3af"}}>
            <div style={{fontSize:48}}>♡</div>
            <h3 style={{color:"#6b7280"}}>No saved camps yet</h3>
            <button onClick={()=>setTab("search")} style={{...primaryBtn,marginTop:8}}>Browse Camps →</button>
          </div>
        )}
      </div>

      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onLogin={setUser}/>}
      {showBookings&&user&&<BookingsPanel user={user} onClose={()=>setShowBookings(false)}/>}
      {checkoutCamp&&user&&<CheckoutModal camp={checkoutCamp} user={user} onClose={()=>setCheckoutCamp(null)} onConfirm={confirmBooking}/>}
    </div>
  );
          }
