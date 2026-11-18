/* Alpha3Zaed: رفتار سایت
   بخش‌ها به ترتیب: ابزارهای کمکی، شاهراه (شبکه)، بازار، زرادخانه (ابزارها)، پیک شاهی (پیام‌ها)،
   پروفایل، ثبت‌نام و ورود، درگاه پرداخت، اصلاحات پایانی.
   توجه: ثبت‌نام و داده‌ها فقط داخل مرورگر کاربر ذخیره می‌شوند (localStorage). */

const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const C={g:'#1fd67a',b:'#2f6bff',r:'#ff3b4e',y:'#ffc933'};
const bg=(a,b)=>`linear-gradient(135deg,${C[a]},#05060a 90%,${C[b]})`;
const fa=n=>n.toLocaleString('fa');
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let me='کاربر مهمان',tfa=false,saved=0,myPosts=0,orders=[],cart={},cat='همه',cur=0,unread=0;
try{me=localStorage.getItem('az_name')||me}catch(e){}
const users=[['ali_sec','g'],['nora','b'],['redteam','r'],['zaed','y'],['kave','g'],['sara_dev','b']];
$('#stories').innerHTML=users.map(([n,c])=>`<div class="st"><div class="ring"><div class="av" style="background:${C[c]}">${n[0].toUpperCase()}</div></div>${n}</div>`).join('');

/* ===== شاهراه: استوری‌ها، پست‌ها، لایک و نظر ===== */
const posts=[
 ['ali_sec','g','آموزش','فیشینگ','Phishing Alert','r','سه نشانه ایمیل بانکی جعلی: آدرس فرستنده، فوریت ساختگی و لینک کوتاه‌شده. قبل از کلیک، نشانگر را روی لینک نگه دارید. <em>#فیشینگ</em>',128],
 ['redteam','r','تست نفوذ','نفوذ','$ nmap -sV target','b','گزارش یک تست نفوذ مجاز: پورت‌های باز فراموش‌شده بزرگ‌ترین دلیل نفوذ بودند. سرویس‌های بلااستفاده را ببندید. <em>#pentest</em>',96],
 ['nora','b','خبر','خبر','2FA = +99%','g','فعال‌سازی احراز هویت دومرحله‌ای بیشتر حملات خودکار را بی‌اثر می‌کند. امروز انجامش بدهید. <em>#2FA</em>',214]];
const pc=['g','b','y','r'];
function postHTML(p,i){return `<article class="card post"><div class="ph"><div class="av" style="background:${C[p[1]]}">${esc(p[0])[0].toUpperCase()}</div><div><b>${esc(p[0])}</b><small>${p[2]}</small></div><span class="tag" style="background:${C[p[5]]}">${p[3]}</span></div>
<div class="media" style="background:${bg(p[5],p[1])}">${esc(p[4])}</div>
<div class="acts"><button class="like" data-n="${p[7]}">♥ <span>${fa(p[7])}</span></button><button class="cm">💬 نظر</button><button class="share">↗ اشتراک</button><button class="sv">🔖</button></div>
<div class="cap">${p[6]}</div><div class="cms"></div>
<form class="cmi hide"><input placeholder="نظر بنویس…" aria-label="نظر"><button class="btn" type="submit">ثبت</button></form></article>`}
function drawPosts(){$('#posts').innerHTML=posts.map(postHTML).join('')}
$('#pub').onclick=()=>{const t=$('#np').value.trim();if(!t)return;const k=$('#nt').value;
 posts.unshift([me,'g',k,k,t.slice(0,40),pc[posts.length%4],esc(t),0]);myPosts++;$('#np').value='';drawPosts();stat();note('پست شما منتشر شد.')};
document.addEventListener('click',e=>{
 const l=e.target.closest('.like');if(l){const on=l.classList.toggle('on');l.querySelector('span').textContent=fa(+l.dataset.n+(on?1:0))}
 const v=e.target.closest('.sv');if(v){saved+=v.classList.toggle('on')?1:-1;stat()}
 const c=e.target.closest('.cm');if(c)c.closest('.post').querySelector('.cmi').classList.toggle('hide');
 const s=e.target.closest('.share');if(s){try{navigator.clipboard.writeText(location.href)}catch(x){}s.textContent='✓ کپی شد'}
});
document.addEventListener('submit',e=>{const f=e.target.closest('.cmi');if(!f)return;e.preventDefault();const i=f.querySelector('input'),t=i.value.trim();if(!t)return;
 const d=document.createElement('div');d.innerHTML=`<b>${esc(me)}</b>: ${esc(t)}`;f.previousElementSibling.appendChild(d);i.value=''});

/* ===== بازار: محصولات، فیلتر، سبد خرید و تخفیف ===== */
const prods=[
 ['محصولات','آنتی‌ویروس سازمانی','محافظت زمان‌واقعی',390,'g','b','Antivirus'],
 ['محصولات','وی‌پی‌ان پرسرعت','یک‌ساله، ۵ دستگاه',520,'b','g','VPN'],
 ['محصولات','کلید امنیتی USB','احراز هویت سخت‌افزاری',640,'y','r','FIDO2'],
 ['محصولات','مدیریت رمز عبور','رمزنگاری AES-256',210,'g','y','Vault'],
 ['محصولات','فایروال خانگی','ویژه روتر و شبکه',880,'r','b','Firewall'],
 ['خدمات','تست نفوذ سایت','گزارش کامل فنی',4800,'r','b','Pentest'],
 ['خدمات','پاسخ به حادثه','تیم اضطراری ۲۴ ساعته',6500,'r','y','IR Team'],
 ['خدمات','ممیزی امنیتی','بررسی استانداردها',3900,'b','g','Audit'],
 ['خدمات','پاک‌سازی سایت هک‌شده','بازیابی و مقاوم‌سازی',2700,'y','r','Recovery'],
 ['خدمات','مشاوره امنیتی','جلسه ۱ ساعته',450,'g','y','Consult'],
 ['آموزش','دوره هک اخلاقی','۴۰ ساعت ویدیو',1450,'r','y','CEH'],
 ['آموزش','آگاهی امنیتی کارکنان','ویژه شرکت‌ها',980,'b','y','Awareness'],
 ['آموزش','دوره Blue Team','مانیتورینگ و SOC',1250,'b','g','SOC']];
const cats=['همه',...new Set(prods.map(p=>p[0]))];
function drawShop(){const q=$('#q').value.trim();
 $('#chips').innerHTML=cats.map(c=>`<button aria-pressed="${c==cat}" data-c="${c}">${c}</button>`).join('');
 $('#grid').innerHTML=prods.map((p,i)=>({p,i})).filter(({p})=>(cat=='همه'||p[0]==cat)&&(!q||(p[1]+p[2]+p[6]).includes(q))).map(({p,i})=>`<div class="card pr"><div class="media" style="background:${bg(p[4],p[5])}">${p[6]}</div><div class="t"><h3>${p[1]}</h3><p>${p[2]}</p></div><div class="pf"><span class="price">${fa(p[3])} هزار ت</span><button class="btn" data-i="${i}">افزودن</button></div></div>`).join('')||'<p style="color:var(--mut)">موردی پیدا نشد. عبارت دیگری را جستجو کنید.</p>'}
function total(){let s=0;for(const i in cart)s+=prods[i][3]*cart[i];return s}
function drawCart(){let n=0;
 $('#items').innerHTML=Object.keys(cart).map(i=>{n+=cart[i];return `<div class="li"><span>${prods[i][1]} × ${fa(cart[i])}</span><span>${fa(prods[i][3]*cart[i])}<button class="x" data-r="${i}" aria-label="حذف">✕</button></span></div>`}).join('')||'<p style="color:var(--mut);margin:14px 0">سبد خالی است. از بازار محصولی اضافه کنید.</p>';
 const d=$('#code').value.trim().toUpperCase()=='ALPHA10',t=total();
 $('#sum').textContent=fa(Math.round(d?t*.9:t))+' هزار ت';$('#cmsg').textContent=d?'کد تخفیف ۱۰٪ اعمال شد.':'';$('#cnt').textContent=fa(n)}
$('#chips').onclick=e=>{const b=e.target.closest('[data-c]');if(b){cat=b.dataset.c;drawShop()}};
$('#grid').onclick=e=>{const b=e.target.closest('[data-i]');if(b){cart[b.dataset.i]=(cart[b.dataset.i]||0)+1;drawCart();b.textContent='افزوده شد ✓'}};
$('#items').onclick=e=>{const b=e.target.closest('[data-r]');if(b){delete cart[b.dataset.r];drawCart()}};
$('#code').oninput=drawCart;
$('#cartBtn').onclick=()=>$('#drawer').classList.add('open');
$('#close').onclick=()=>$('#drawer').classList.remove('open');
$('#buy').onclick=()=>{if(!Object.keys(cart).length)return;
 orders.unshift(Object.keys(cart).map(i=>prods[i][1]).join('، ')+' | '+$('#sum').textContent);cart={};$('#code').value='';drawCart();drawOrders();stat();
 $('#cmsg').textContent='سفارش ثبت شد. ممنون از خرید شما.';note('سفارش شما ثبت شد.')};
function drawOrders(){if(orders.length)$('#orders').innerHTML=orders.map(o=>`<div class="li"><span>${o.split(' | ')[0]}</span><b class="price">${o.split(' | ')[1]}</b></div>`).join('')}
$('#q').oninput=()=>{show('shop');drawShop()};

/* ===== زرادخانه: رمز، لینک، هش و Base64 ===== */
$('#pw').oninput=e=>{const v=e.target.value;let s=0;
 if(v.length>=8)s++;if(v.length>=12)s++;if(/[a-z]/.test(v)&&/[A-Z]/.test(v))s++;if(/\d/.test(v))s++;if(/[^\w]/.test(v))s++;
 const m=[['',0,'یک رمز وارد کنید'],['r',20,'خیلی ضعیف'],['r',40,'ضعیف'],['y',60,'متوسط'],['g',80,'قوی'],['g',100,'عالی']][v?Math.max(1,s):0];
 $('#pwBar').style.cssText=`width:${m[1]}%;background:${C[m[0]]||'transparent'}`;$('#pwRes').textContent=m[2]};
$('#gen').onclick=()=>{const a='abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*',r=crypto.getRandomValues(new Uint32Array(16));
 $('#pw').value=[...r].map(x=>a[x%a.length]).join('');$('#pw').dispatchEvent(new Event('input'))};
$('#urlBtn').onclick=()=>{const u=$('#url').value.trim().toLowerCase(),f=[];
 if(!u){$('#urlRes').textContent='آدرس لینک را وارد کنید.';return}
 if(!u.startsWith('https://'))f.push('بدون HTTPS');
 if(/\d+\.\d+\.\d+\.\d+/.test(u))f.push('آدرس IP به‌جای دامنه');
 if(/(bit\.ly|tinyurl|t\.co)/.test(u))f.push('لینک کوتاه‌شده');
 if(/(login|verify|secure|bank|update)/.test(u)&&(u.match(/-/g)||[]).length>1)f.push('کلمات حساس با چند خط‌تیره');
 if(u.includes('@'))f.push('علامت @ در آدرس');
 $('#urlRes').style.color=f.length?C.r:C.g;
 $('#urlRes').textContent=f.length?'نشانه‌های مشکوک: '+f.join('، '):'نشانه مشکوکی پیدا نشد. باز هم قبل از ورود اطلاعات مطمئن شوید.'};
$('#hin').oninput=async e=>{const v=e.target.value;if(!v){$('#hout').textContent='';return}
 const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v));$('#hout').textContent=[...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,'0')).join('')};
$('#enc').onclick=()=>{try{$('#b64o').textContent=btoa(String.fromCharCode(...new TextEncoder().encode($('#b64').value)))}catch(e){$('#b64o').textContent='خطا در کدگذاری'}};
$('#dec').onclick=()=>{try{$('#b64o').textContent=new TextDecoder().decode(Uint8Array.from(atob($('#b64').value.trim()),c=>c.charCodeAt(0)))}catch(e){$('#b64o').textContent='ورودی Base64 معتبر نیست'}};

/* ===== پیک شاهی: پیام‌رسان ===== */
const ppl=[['ali_sec','g',['سلام! آماده‌ای برای دوره؟']],['nora','b',['اون لینک مشکوک رو بررسی کردی؟']],['redteam','r',['گزارش تست نفوذ فردا آماده می‌شه.']]];
const replies=['باشه، حتماً.','ممنون از پیام شما 🙏','بذار بررسی کنم و خبر بدم.','عالیه، هماهنگ می‌کنیم.'];
function drawCL(){$('#cl').innerHTML=ppl.map((p,i)=>`<button class="ct" role="tab" aria-selected="${i==cur}" data-c="${i}"><div class="av" style="background:${C[p[1]]}">${p[0][0].toUpperCase()}</div><small>${p[0]}</small></button>`).join('')}
function drawMsgs(){$('#msgs').innerHTML=ppl[cur][2].map((m,i)=>`<div class="m ${m.startsWith('›')?'me':''}">${esc(m.replace(/^›/,''))}</div>`).join('');$('#msgs').scrollTop=9e9}
$('#cl').onclick=e=>{const b=e.target.closest('[data-c]');if(b){cur=+b.dataset.c;drawCL();drawMsgs()}};
$('#cf').onsubmit=e=>{e.preventDefault();const t=$('#ci').value.trim();if(!t)return;const k=cur;ppl[k][2].push('›'+t);$('#ci').value='';drawMsgs();
 setTimeout(()=>{ppl[k][2].push(replies[Math.floor(Math.random()*replies.length)]);if($('#chat').classList.contains('hide')){unread++;$('#unread').textContent=fa(unread);$('#unread').classList.remove('hide')}if(k==cur)drawMsgs()},900)};

/* ===== پروفایل، اعلان‌ها، امتیاز امنیت و تعویض بخش‌ها ===== */
function stat(){$('#sP').textContent=fa(myPosts);$('#sS').textContent=fa(saved);$('#sO').textContent=fa(orders.length)}
function setName(){$('#mname').textContent=me;$('#mav').textContent=me[0]}
function note(t){const d=document.createElement('div');d.className='li';d.textContent=t;$('#notes').prepend(d)}
['حساب شما ساخته شد. اولین قدم: فعال‌سازی ۲FA','آسیب‌پذیری جدید در روترها گزارش شد'].forEach(note);
function score(){const s=tfa?92:72;$('#score').textContent=fa(s)+'٪';$('#scoreBar').style.width=s+'%';$('#tfaS').textContent=tfa?'فعال':'غیرفعال';$('#tfaS').style.color=tfa?C.g:C.r;$('#tfa').textContent=tfa?'غیرفعال‌سازی ۲FA':'فعال‌سازی احراز هویت دومرحله‌ای'}
$('#tfa').onclick=()=>{tfa=!tfa;score();note(tfa?'احراز هویت دومرحله‌ای فعال شد.':'احراز هویت دومرحله‌ای غیرفعال شد.')};
$('#theme').onclick=()=>{const r=document.documentElement,d=getComputedStyle(r).getPropertyValue('--bg').trim()=='#050608';r.dataset.theme=d?'light':'dark'};
$('#edit').onclick=()=>{$('#nm').value=me=='کاربر مهمان'?'':me;$('#modal').classList.remove('hide')};
$('#nmNo').onclick=()=>$('#modal').classList.add('hide');
$('#nmOk').onclick=()=>{const v=$('#nm').value.trim();if(v){me=v;try{localStorage.setItem('az_name',v)}catch(e){}setName()}$('#modal').classList.add('hide')};
function show(t){['feed','shop','tools','chat','me'].forEach(k=>$('#'+k).classList.toggle('hide',k!=t));
 $$('#nav button').forEach(b=>b.setAttribute('aria-selected',b.dataset.t==t));
 if(t=='chat'){unread=0;$('#unread').classList.add('hide')}if(t=='shop')drawShop()}
$('#nav').onclick=e=>{const b=e.target.closest('[data-t]');if(b)show(b.dataset.t)};
drawPosts();drawShop();drawCart();drawCL();drawMsgs();stat();setName();score();

/* ===== ثبت‌نام و ورود (ذخیره‌ی محلی، رمز به‌صورت هش) ===== */
let acct=null,user=null,mode='up';
try{acct=JSON.parse(localStorage.getItem('az_acct')||'null');if(acct&&localStorage.getItem('az_in')=='1')user=acct}catch(e){}
const hash=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
function authUI(){$('#authBtn').textContent=user?'خروج ('+user.name+')':'ثبت‌نام / ورود';if(user){me=user.name;setName();$('#mname').textContent=user.name+' · '+user.role}}
function setMode(m){mode=m;$$('.seg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m==m));$('#upOnly').classList.toggle('hide',m=='in');$('#tl').classList.toggle('hide',m=='in');$('#aGo').textContent=m=='up'?'ثبت‌نام':'ورود';$('#authT').textContent=m=='up'?'پیوستن به جاویدانان':'ورود به تخت‌جمشید';$('#aErr').textContent=''}
function openAuth(msg,m){setMode(m||(acct?'in':'up'));$('#authMsg').textContent=msg||'';$('#authM').classList.remove('hide')}
$('#authBtn').onclick=()=>{if(user){user=null;try{localStorage.removeItem('az_in')}catch(e){}me='کاربر مهمان';setName();authUI();note('از حساب خارج شدید.')}else openAuth()};
$('#heroSign').onclick=()=>openAuth();$('#heroIn').onclick=()=>openAuth('','in');
$('#authX').onclick=()=>$('#authM').classList.add('hide');
$('.seg').onclick=e=>{const b=e.target.closest('[data-m]');if(b)setMode(b.dataset.m)};
$('#aGo').onclick=async()=>{
 const n=$('#aN').value.trim(),em=$('#aE').value.trim().toLowerCase(),p=$('#aP').value,er=$('#aErr');
 if(!/^\S+@\S+\.\S+$/.test(em)){er.textContent='ایمیل معتبر وارد کنید.';return}
 if(mode=='up'){
  if(!n){er.textContent='نام نمایشی را وارد کنید.';return}
  if(p.length<8){er.textContent='رمز عبور باید حداقل ۸ نویسه باشد.';return}
  if(!$('#aT').checked){er.textContent='برای ادامه باید قوانین را بپذیرید.';return}
  acct={name:n,email:em,role:$('#aR').value,h:await hash(p)};
 }else if(!acct||acct.email!=em||acct.h!=await hash(p)){er.textContent='ایمیل یا رمز عبور درست نیست.';return}
 user=acct;try{localStorage.setItem('az_acct',JSON.stringify(acct));localStorage.setItem('az_in','1')}catch(e){}
 $('#authM').classList.add('hide');$('#aP').value='';authUI();note('خوش آمدی '+user.name+'؛ به جاویدانان پیوستی.');
};
document.addEventListener('click',e=>{if(!user&&e.target.closest('#pub,#buy,.sv')){e.stopPropagation();e.preventDefault();openAuth('برای ادامه ابتدا ثبت‌نام کنید یا وارد شوید.')}},true);
document.addEventListener('submit',e=>{if(!user&&e.target.closest('#cf,.cmi')){e.stopPropagation();e.preventDefault();openAuth('برای گفتگو و نظر دادن ثبت‌نام کنید.')}},true);
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)show(g.dataset.go)});

/* ===== درگاه پرداخت =====
   payment: آدرس درگاه یا لینک پرداخت خود را در link بگذارید؛ خالی = حالت آزمایشی */
const GATEWAY={link:'',currency:'تومان'};
document.addEventListener('click',e=>{
 if(!GATEWAY.link||!user||!e.target.closest('#buy')||!Object.keys(cart).length)return;
 e.stopPropagation();e.preventDefault();
 const d=$('#code').value.trim().toUpperCase()=='ALPHA10',amt=Math.round(total()*1000*(d?.9:1)),id='AZ'+Date.now();
 try{localStorage.setItem('az_pending',JSON.stringify({id,amt,items:Object.keys(cart).map(i=>[prods[i][1],cart[i]])}))}catch(x){}
 try{const u=new URL(GATEWAY.link);u.searchParams.set('amount',amt);u.searchParams.set('order',id);u.searchParams.set('email',user.email);location.href=u.toString()}catch(x){$('#cmsg').textContent='آدرس درگاه نادرست است.'}
},true);
authUI();

/* ===== اصلاحات پایانی: انتشار پست، کلید Esc و اسکرول ===== */
$('#pub').onclick=()=>{const t=$('#np').value.trim();if(!t)return;const k=$('#nt').value,p=[me,'g',k,k,t.slice(0,40),pc[posts.length%4],esc(t),0];posts.unshift(p);myPosts++;$('#np').value='';$('#posts').insertAdjacentHTML('afterbegin',postHTML(p));stat();note('پست شما منتشر شد.')};
$('#nmOk').onclick=()=>{const v=$('#nm').value.trim();if(v){me=v;if(user){user.name=v;acct=user;try{localStorage.setItem('az_acct',JSON.stringify(acct))}catch(e){}authUI()}else{try{localStorage.setItem('az_name',v)}catch(e){}setName()}}$('#modal').classList.add('hide')};
document.addEventListener('keydown',e=>{if(e.key=='Escape'){$$('.modal').forEach(m=>m.classList.add('hide'));$('#drawer').classList.remove('open')}});
$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.add('hide')}));
$('#nav').addEventListener('click',()=>scrollTo({top:0}));
document.addEventListener('click',e=>{if(e.target.closest('[data-go]'))scrollTo({top:0})});
