// ═══════════════════════════════════════════════
// _shared.js — Roxy Store Ortak Sistem
// Her sayfada bu dosya import edilir
// ═══════════════════════════════════════════════

// ── FIREBASE ──────────────────────────────────────
var _fbApp = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp({
  apiKey:            "AIzaSyBf2A1GhEzruI_6lfCNbq4MsbU8hxFjoqI",
  authDomain:        "roxy-store-67c53.firebaseapp.com",
  projectId:         "roxy-store-67c53",
  storageBucket:     "roxy-store-67c53.firebasestorage.app",
  messagingSenderId: "450502544206",
  appId:             "1:450502544206:web:502d0200dc35ecacfc2c1f"
});
var auth = firebase.auth();
var db   = firebase.firestore();

// Auth guard — TEK SEFERLIK tetiklenir, token yenilemesinde TEKRAR ÇALIŞMAZ
function requireAuth(callback) {
  var unsub = auth.onAuthStateChanged(function(user) {
    unsub(); // dinlemeyi hemen kes
    if (!user) { window.location.href = 'auth.html'; return; }
    callback(user);
  });
}

// ── FORMAT ─────────────────────────────────────────
function formatPrice(n) {
  return Math.round(n || 0).toLocaleString('tr-TR') + ' ₺';
}
function fmtDate(ts) {
  if (!ts) return '—';
  var d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('tr-TR') + ' ' +
         d.toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'});
}
function isWorkingHours() {
  var n=new Date(), day=n.getDay(), h=n.getHours();
  return day===0 || day===6 || (h>=17 && h<24);
}

// ── ID ÜRETECI ─────────────────────────────────────
function _rndStr(len){
  var c='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',r='';
  for(var i=0;i<len;i++) r+=c[Math.floor(Math.random()*c.length)];
  return r;
}
function _dateStr(){
  var d=new Date(),p=function(n){return String(n).padStart(2,'0');};
  return p(d.getDate())+p(d.getMonth()+1)+d.getFullYear();
}
function generateVNId()  { return 'VN-'+_dateStr()+'-'+_rndStr(4); }
function generateSMMId() { return 'SMM-'+_dateStr()+'-'+_rndStr(4); }
function generateBALId() { return 'BAL-'+_dateStr()+'-'+_rndStr(4); }
function generateTKTId(n){ return 'TKT-'+_dateStr()+'-'+String(n).padStart(4,'0'); }

// ── SIDEBAR ─────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('active');
}

// ── ROXY UI (Alert/Confirm/Toast) ─────────────────
var RoxyUI = {

  toast: function(msg, type, dur) {
    dur = dur || 3500;
    var colors = {success:'#00FF88', error:'#FF6584', warning:'#FFB347', info:'#00D9FF'};
    var icons  = {success:'check-circle', error:'times-circle', warning:'exclamation-triangle', info:'info-circle'};
    var wrap = document.getElementById('_roxyToasts');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = '_roxyToasts';
      wrap.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:10px;max-width:360px;';
      document.body.appendChild(wrap);
    }
    var t = document.createElement('div');
    t.style.cssText = 'display:flex;align-items:center;gap:12px;padding:14px 18px;'
      + 'background:#1F1F2E;border:1.5px solid '+(colors[type]||colors.info)+';'
      + 'border-radius:14px;font-family:Poppins,sans-serif;font-size:14px;color:#fff;'
      + 'box-shadow:0 8px 32px rgba(0,0,0,.5);animation:_roxyFadeIn .3s ease;min-width:240px;';
    t.innerHTML = '<i class="fas fa-'+(icons[type]||'info-circle')+'" style="color:'
      +(colors[type]||colors.info)+';font-size:18px;flex-shrink:0"></i><span>'+msg+'</span>';
    wrap.appendChild(t);
    setTimeout(function(){
      t.style.transition='.3s'; t.style.opacity='0'; t.style.transform='translateY(8px)';
      setTimeout(function(){t.remove();},300);
    }, dur);
  },

  alert: function(title, msg, type) {
    return new Promise(function(resolve) {
      var icons  = {success:'check-circle', error:'times-circle', warning:'exclamation-triangle', info:'info-circle'};
      var colors = {success:'#00FF88', error:'#FF6584', warning:'#FFB347', info:'#00D9FF'};
      var ov = document.createElement('div');
      ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:99998;'
        + 'display:flex;align-items:center;justify-content:center;padding:16px;';
      ov.innerHTML = '<div style="background:#1A1A28;border:1.5px solid rgba(0,217,255,.2);'
        + 'border-radius:20px;padding:36px 30px;max-width:420px;width:100%;text-align:center;font-family:Poppins,sans-serif;">'
        + '<div style="font-size:48px;margin-bottom:14px">'
        + '<i class="fas fa-'+(icons[type||'info']||'info-circle')+'" style="color:'+(colors[type||'info']||colors.info)+'"></i></div>'
        + '<div style="font-size:19px;font-weight:800;margin-bottom:10px;color:#fff">'+title+'</div>'
        + '<div style="font-size:14px;color:#A0A0B8;line-height:1.7;margin-bottom:26px">'+msg+'</div>'
        + '<button id="_rOk" style="padding:13px 40px;background:linear-gradient(135deg,#00D9FF,#A855F7);'
        + 'border:none;border-radius:12px;color:#0A0A0F;font-weight:800;font-size:15px;'
        + 'cursor:pointer;font-family:Poppins,sans-serif;">Tamam</button></div>';
      document.body.appendChild(ov);
      ov.querySelector('#_rOk').onclick = function() { ov.remove(); resolve(); };
    });
  },

  confirm: function(title, msg, okLabel, cancelLabel, danger) {
    return new Promise(function(resolve) {
      var ov = document.createElement('div');
      ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:99998;'
        + 'display:flex;align-items:center;justify-content:center;padding:16px;';
      ov.innerHTML = '<div style="background:#1A1A28;border:1.5px solid rgba(0,217,255,.2);'
        + 'border-radius:20px;padding:36px 30px;max-width:420px;width:100%;text-align:center;font-family:Poppins,sans-serif;">'
        + '<div style="font-size:48px;margin-bottom:14px">'
        + '<i class="fas fa-question-circle" style="color:#00D9FF"></i></div>'
        + '<div style="font-size:19px;font-weight:800;margin-bottom:10px;color:#fff">'+title+'</div>'
        + '<div style="font-size:14px;color:#A0A0B8;line-height:1.7;margin-bottom:26px">'+msg+'</div>'
        + '<div style="display:flex;gap:12px;justify-content:center;">'
        + '<button id="_rCancel" style="padding:13px 28px;background:transparent;border:1.5px solid rgba(255,255,255,.15);'
        + 'border-radius:12px;color:#A0A0B8;font-weight:700;cursor:pointer;font-family:Poppins,sans-serif;">'+(cancelLabel||'İptal')+'</button>'
        + '<button id="_rConfirm" style="padding:13px 28px;background:'
        + (danger ? 'linear-gradient(135deg,#FF6584,#c0392b)' : 'linear-gradient(135deg,#00D9FF,#A855F7)')
        + ';border:none;border-radius:12px;color:#0A0A0F;font-weight:800;cursor:pointer;font-family:Poppins,sans-serif;">'+(okLabel||'Onayla')+'</button>'
        + '</div></div>';
      document.body.appendChild(ov);
      ov.querySelector('#_rConfirm').onclick = function() { ov.remove(); resolve(true); };
      ov.querySelector('#_rCancel').onclick  = function() { ov.remove(); resolve(false); };
    });
  }
};

// Logout helper
function handleLogout() {
  RoxyUI.confirm('Çıkış Yap', 'Hesabınızdan çıkış yapmak istiyor musunuz?', 'Çıkış Yap', 'İptal', true)
    .then(function(ok){ if(ok) auth.signOut().then(function(){ window.location.href='auth.html'; }); });
}
