/* ---------- ICONOS ---------- */
const ICON = {
  pill: '<svg aria-hidden="true" focusable="false" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="8" width="20" height="8" rx="4" transform="rotate(45 12 12)"/><line x1="12" y1="4" x2="12" y2="20" transform="rotate(45 12 12)"/></svg>',
  plus: '<svg aria-hidden="true" focusable="false" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/></svg>',
  doctor: '<svg aria-hidden="true" focusable="false" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>',
  back: '<svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6 L9 12 L15 18"/></svg>',
  camera: '<svg aria-hidden="true" focusable="false" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13.5" r="3.4"/></svg>',
  speaker: '<svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.3 8.3a5.2 5.2 0 0 1 0 7.4"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  stop: '<svg aria-hidden="true" focusable="false" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="7" y1="7" x2="17" y2="17"/></svg>',
  silencio: '<svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  datos: '<svg aria-hidden="true" focusable="false" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6"/></svg>',
  ayuda: '<svg aria-hidden="true" focusable="false" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="7.5" x2="12" y2="13"/><circle cx="12" cy="16.3" r="1" fill="currentColor" stroke="none"/></svg>',
  check: '<svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5 L9.5 18 L20 6"/></svg>',
  editar: '<svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'
};

/* ---------- CONSTANTES DE FORMULARIO ---------- */
const UNIDADES = [
  {valor:'comprimidos', label:'comprimidos'},
  {valor:'mg', label:'mg'},
  {valor:'ml', label:'ml'},
  {valor:'UI', label:'UI (unidades)'},
  {valor:'mcg', label:'mcg'},
  {valor:'gotas', label:'gotas'}
];
const FRECUENCIAS = [
  {valor:4, label:'Cada 4 horas'},
  {valor:6, label:'Cada 6 horas'},
  {valor:8, label:'Cada 8 horas'},
  {valor:12, label:'Cada 12 horas'},
  {valor:24, label:'1 vez al día'}
];
const PERIODOS = [
  {valor:'manana', label:'De la mañana'},
  {valor:'tarde', label:'De la tarde'},
  {valor:'noche', label:'De la noche'}
];

function formStateInicial(){
  return {
    nombre:'', categoria:'', medico:'', clinica:'',
    hora:null, periodo:null, frecuencia:null,
    dosisCantidad:'', dosisUnidad:'comprimidos',
    medicoModificacion:'', clinicaModificacion:'', motivoModificacion:'',
    foto:null
  };
}

/* ---------- ESTADO ---------- */
let cuentas = [];          // todas las cuentas creadas en este dispositivo
let sesion = null;         // { cuentaId } — qué cuenta está activa en este dispositivo
let cuentaActual = null;   // objeto de la cuenta activa (personal o referente)
let viendoPersonaId = null; // si cuentaActual es referente, id de la persona que está viendo

let meds = [];
let perfil = null;
let tomasHoy = { fecha:'', marcados:[] };

let screen = 'bienvenida';
let stoppingMedId = null;
let stopOrigen = null; // null (la propia persona) | 'medico' | 'referente'
let editingMedId = null;
let hablando = false;
let formState = formStateInicial();

/* ---------- STORAGE ---------- */
async function cargarEstado(){
  try{
    const r = await window.storage.get('cuentas', false);
    cuentas = JSON.parse(r.value);
  }catch(e){
    cuentas = [];
  }
  try{
    const r = await window.storage.get('sesion', false);
    sesion = JSON.parse(r.value);
  }catch(e){
    sesion = null;
  }
}
function avisarErrorGuardado(error){
  console.error('Acordate: no se pudo guardar', error);
  showToast('No pudimos guardar tus datos. Puede que el celular no tenga espacio. Descargá una copia desde "Ver mis datos".', 7000);
}
async function guardarCuentas(){
  try{ await window.storage.set('cuentas', JSON.stringify(cuentas), false); }
  catch(e){ avisarErrorGuardado(e); }
}
async function guardarSesion(){
  try{ await window.storage.set('sesion', JSON.stringify(sesion), false); }
  catch(e){ avisarErrorGuardado(e); }
}
async function guardarPerfil(){ await guardarCuentas(); }
async function guardarDatos(){ await guardarCuentas(); }
async function guardarTomasHoy(){ await guardarCuentas(); }

async function iniciar(){
  // Pide al navegador que no borre los datos si el celular se queda sin espacio.
  try{ if(navigator.storage && navigator.storage.persist) navigator.storage.persist(); }catch(e){}
  await cargarEstado();
  cuentaActual = (sesion && sesion.cuentaId) ? (cuentas.find(c=>c.id===sesion.cuentaId) || null) : null;
  if(!cuentaActual){
    screen = 'bienvenida';
  }else if(cuentaActual.tipo==='personal'){
    activarPersona(cuentaActual);
    screen = 'home';
  }else{
    viendoPersonaId = null;
    screen = 'mis-personas';
  }
  render();
}

/* ---------- CUENTAS ---------- */
function activarPersona(cuenta){
  perfil = cuenta.perfil;
  meds = cuenta.meds;
  tomasHoy = cuenta.tomasHoy;
  if(tomasHoy.fecha !== claveDeHoy()){
    tomasHoy.fecha = claveDeHoy();
    tomasHoy.marcados = [];
  }
}
function cuentaPersonalActiva(){
  if(!cuentaActual) return null;
  if(cuentaActual.tipo==='personal') return cuentaActual;
  if(cuentaActual.tipo==='referente' && viendoPersonaId) return cuentas.find(c=>c.id===viendoPersonaId) || null;
  return null;
}
function actorEsReferente(){
  return !!(cuentaActual && cuentaActual.tipo==='referente' && viendoPersonaId);
}
function referentesDeLaPersonaActual(){
  const cuenta = cuentaPersonalActiva();
  if(!cuenta) return [];
  return cuentas.filter(c => c.tipo==='referente' && (c.vinculados||[]).includes(cuenta.id));
}
function generarCodigo(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo;
  do{
    codigo = Array.from({length:6}, ()=> chars[Math.floor(Math.random()*chars.length)]).join('');
  }while(cuentas.some(c=>c.codigo===codigo));
  return codigo;
}

/* ---------- HELPERS ---------- */
function periodoLabel(p){ return p==='manana' ? 'de la mañana' : p==='tarde' ? 'de la tarde' : 'de la noche'; }
function periodoOrden(p){ return p==='manana' ? 0 : p==='tarde' ? 1 : 2; }
const DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function fechaCortaHoy(){
  const d = new Date();
  return new Intl.DateTimeFormat('es-AR', { day:'numeric', month:'long', year:'numeric' }).format(d);
}
function fechaISOHoy(){
  const d = new Date();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}
function parseFechaISO(iso){
  const [y,m,d] = iso.split('-').map(Number);
  return new Date(y, m-1, d);
}
function fechaSlash(iso){
  if(!iso) return '—';
  const d = parseFechaISO(iso);
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}
function fechaConDia(iso){
  if(!iso) return '—';
  return `el ${DIAS[parseFechaISO(iso).getDay()]} ${fechaSlash(iso)}`;
}
function horarioTexto(h){ return h.hora + ' ' + periodoLabel(h.periodo); }
function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
function listaConY(arr){
  if(arr.length<=1) return arr.join('');
  return arr.slice(0,-1).join(', ') + ' y ' + arr[arr.length-1];
}
function medicoConClinica(medico, clinica){
  if(!medico) return '';
  return clinica ? `${medico} (${clinica})` : medico;
}
function quienDioBaja(m){
  if(m.indicadoPorMedico) return m.medicoQueModifico ? medicoConClinica(m.medicoQueModifico, m.clinicaQueModifico) : 'el médico';
  if(m.indicadoPorReferente) return m.referenteQueModifico || 'tu referente';
  return null;
}
function quienModificoIndicaciones(m){
  if(m.medicoQueModifico) return medicoConClinica(m.medicoQueModifico, m.clinicaQueModifico);
  if(m.referenteQueModifico) return m.referenteQueModifico;
  return null;
}

/* ---------- HORARIOS Y FRECUENCIA ----------
   Convención interna (reloj de 24hs): "de la mañana" = la hora tal cual (1 a 12);
   "de la tarde" y "de la noche" = la hora + 12. Sirve solo para poder calcular
   los horarios a partir de la primera toma y la frecuencia. */
function horaPeriodoA24(hora, periodo){
  if(periodo==='manana') return hora===12 ? 12 : hora;
  return hora===12 ? 0 : hora+12;
}
function hora24AHoraPeriodo(h24){
  h24 = ((h24 % 24)+24)%24;
  if(h24===0) return {hora:12, periodo:'noche'};
  if(h24<12) return {hora:h24, periodo:'manana'};
  if(h24===12) return {hora:12, periodo:'manana'};
  const hora12 = h24-12;
  return {hora:hora12, periodo: hora12<=6 ? 'tarde' : 'noche'};
}
function calcularHorarios(hora, periodo, frecuenciaHoras){
  const inicio24 = horaPeriodoA24(hora, periodo);
  const cantidad = Math.max(1, Math.round(24 / frecuenciaHoras));
  const horarios = [];
  for(let i=0;i<cantidad;i++){
    horarios.push(hora24AHoraPeriodo(inicio24 + i*frecuenciaHoras));
  }
  return horarios;
}
function parseDetalleADosis(detalle){
  if(!detalle) return {cantidad:'', unidad:'comprimidos'};
  const match = detalle.trim().match(/^([\d]+(?:[.,]\d+)?)\s*(mg|mcg|ml|ui|gotas?|comprimidos?)$/i);
  if(!match) return {cantidad:'', unidad:'comprimidos'};
  const unidadRaw = match[2].toLowerCase();
  let unidad = unidadRaw;
  if(unidadRaw.startsWith('compr')) unidad = 'comprimidos';
  else if(unidadRaw.startsWith('gota')) unidad = 'gotas';
  else if(unidadRaw === 'ui') unidad = 'UI';
  return {cantidad:match[1].replace(',','.'), unidad};
}

function agendaDeHoy(){
  const mapa = {};
  meds.filter(m=>m.activo).forEach(m=>{
    m.horarios.forEach(h=>{
      const key = h.periodo+'-'+h.hora;
      if(!mapa[key]) mapa[key] = { hora:h.hora, periodo:h.periodo, meds:[], key };
      mapa[key].meds.push(m);
    });
  });
  return Object.values(mapa).sort((a,b)=> periodoOrden(a.periodo)-periodoOrden(b.periodo) || a.hora-b.hora);
}
function claveDeHoy(){
  const d = new Date();
  return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
}

function textoAgendaHablada(){
  const nombre = perfil && perfil.nombre ? perfil.nombre : '';
  const agenda = agendaDeHoy();
  let t = nombre ? `${nombre}, hoy te toca: ` : 'Hoy te toca: ';
  if(!agenda.length){
    t += 'no tenés remedios anotados para hoy. ';
  }else{
    agenda.forEach(a=>{
      t += `A las ${a.hora} ${periodoLabel(a.periodo)}: ${a.meds.map(m=>m.nombre).join(', ')}. `;
    });
  }
  t += nombre ? `Cuidate, ${nombre}.` : 'Cuidate.';
  return t;
}
function toggleLeerDia(){
  if(hablando){
    window.speechSynthesis.cancel();
    hablando = false;
    render();
    return;
  }
  const texto = textoAgendaHablada();
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-AR';
    u.rate = 0.95;
    u.onend = ()=>{ hablando = false; render(); };
    u.onerror = ()=>{ hablando = false; render(); };
    hablando = true;
    window.speechSynthesis.speak(u);
    render();
  }catch(err){
    hablando = false;
    showToast('Este dispositivo no puede leer en voz alta.');
  }
}

function showToast(msg, duracionMs = 2600){
  const old = document.querySelector('.toast');
  if(old) old.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.setAttribute('aria-live', 'polite');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), duracionMs);
}

/* ---------- RENDER ---------- */
function render(){
  const app = document.getElementById('app');
  let html = '';
  if(screen==='bienvenida') html = renderBienvenida();
  else if(screen==='onboarding-personal') html = renderOnboardingPersonal();
  else if(screen==='onboarding-referente') html = renderOnboardingReferente();
  else if(screen==='codigo-generado') html = renderCodigoGenerado();
  else if(screen==='mis-personas') html = renderMisPersonas();
  else if(screen==='vincular-persona') html = renderVincularPersona();
  else if(screen==='home') html = renderHome();
  else if(screen==='list') html = renderListaMenu();
  else if(screen==='lista-activos') html = renderListaActivos();
  else if(screen==='lista-inactivos') html = renderListaInactivos();
  else if(screen==='add') html = renderAdd();
  else if(screen==='doctor') html = renderDoctor();
  else if(screen==='editar-indicaciones') html = renderEditarIndicaciones();
  else if(screen==='mis-datos') html = renderMisDatos();
  else if(screen==='medicacion-hoy') html = renderMedicacionHoy();
  else if(screen==='editar-datos') html = renderEditarDatos();
  else if(screen==='ayuda') html = renderAyuda();
  if(stoppingMedId) html += renderStopModal();
  app.innerHTML = html;
  if(stoppingMedId){
    const primero = document.getElementById('medico-stop-input') || document.getElementById('motivo-input');
    if(primero) primero.focus();
  }
  actualizarBarraVista();
}

function actualizarBarraVista(){
  const barra = document.getElementById('viewing-bar');
  if(!barra) return;
  if(cuentaActual && cuentaActual.tipo==='referente' && viendoPersonaId){
    const persona = cuentas.find(c=>c.id===viendoPersonaId);
    barra.hidden = false;
    const nombreEl = document.getElementById('viewing-name');
    if(nombreEl) nombreEl.textContent = persona ? persona.perfil.nombre : '';
  }else{
    barra.hidden = true;
  }
}

/* ---------- BIENVENIDA / CUENTAS ---------- */
function renderBienvenida(){
  const existentes = cuentas.length ? `
    <div class="section-title">Cuentas en este dispositivo</div>
    ${cuentas.map(c=> `
      <button class="btn-primary" data-action="usar-cuenta" data-id="${c.id}">
        ${ICON.datos} ${c.tipo==='personal' ? esc(c.perfil.nombre || 'Sin nombre') : esc(c.nombre)+' (referente)'}
      </button>`).join('')}
  ` : '';
  return `
    <div class="hero" style="margin-top:24px;">
      <h1 class="greet">¡Hola!</h1>
      <div class="date">¿La app es para vos o sos referente de alguien que acompañás?</div>
    </div>
    <button class="btn-primary" data-action="nav" data-target="onboarding-personal">${ICON.datos} Es para mí</button>
    <button class="btn-primary doctor" data-action="nav" data-target="onboarding-referente">${ICON.doctor} Soy referente de alguien</button>
    ${existentes}
    <p class="aviso">Tus datos se guardan solo en este celular. Acordate no reemplaza la indicación de tu médico.</p>
    <button class="cancel-link" data-action="pick-copia">Recuperar una copia de seguridad</button>
    <input type="file" id="copia-input" accept="application/json,.json" style="display:none">
  `;
}

function renderOnboardingPersonal(){
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="bienvenida">${ICON.back}<span>Volver</span></button>
      <h1>Es para mí</h1>
    </div>
    <p class="empty-note">Contanos un poco de vos. Esto lo hacemos una sola vez.</p>
    <div class="card">
      <div class="field">
        <label for="input-nombre-perfil">¿Cómo te llamás?</label>
        <input type="text" id="input-nombre-perfil" class="onboard-input" placeholder="Ej: Choli">
      </div>
      <div class="field">
        <label for="input-direccion-perfil">¿Dónde vivís? (ciudad y provincia)</label>
        <input type="text" id="input-direccion-perfil" class="onboard-input" placeholder="Ej: Córdoba, Córdoba">
      </div>
      <div class="field">
        <label for="input-celular-perfil">¿Cuál es tu número de celular?</label>
        <input type="tel" id="input-celular-perfil" class="onboard-input" placeholder="Ej: 351 555 1234">
      </div>
      <div class="field" style="margin-bottom:0;">
        <label for="input-celular-emergencia-perfil">Número de celular de alguien de confianza, para una emergencia</label>
        <input type="tel" id="input-celular-emergencia-perfil" class="onboard-input" placeholder="Ej: 351 555 5678">
      </div>
    </div>
    <button class="save-btn" data-action="crear-cuenta-personal">Listo</button>
  `;
}

function renderOnboardingReferente(){
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="bienvenida">${ICON.back}<span>Volver</span></button>
      <h1>Soy referente</h1>
    </div>
    <p class="empty-note">Contanos quién sos. Esto lo hacemos una sola vez.</p>
    <div class="card">
      <div class="field">
        <label for="input-nombre-referente">¿Cómo te llamás?</label>
        <input type="text" id="input-nombre-referente" class="onboard-input" placeholder="Ej: María">
      </div>
      <div class="field" style="margin-bottom:0;">
        <label for="input-celular-referente">Tu número de celular (para que te puedan llamar)</label>
        <input type="tel" id="input-celular-referente" class="onboard-input" placeholder="Ej: 351 555 1234">
      </div>
    </div>
    <button class="save-btn" data-action="crear-cuenta-referente">Listo</button>
  `;
}

function renderCodigoGenerado(){
  const cuenta = cuentaActual;
  return `
    <div class="hero" style="margin-top:24px;">
      <h1 class="greet">¡Listo${cuenta && cuenta.perfil.nombre ? ', '+esc(cuenta.perfil.nombre) : ''}!</h1>
    </div>
    <div class="card">
      <div class="card-title">Tu código para compartir</div>
      <p class="empty-note">Si alguien te acompaña con tus remedios (un hijo, una hija, quien vos quieras), pasale este código para que pueda vincularse y ayudarte a cargar tu medicación.</p>
      <div class="dato-valor" style="font-size:34px; text-align:center; letter-spacing:6px; margin-top:12px;">${cuenta ? esc(cuenta.codigo) : ''}</div>
    </div>
    <button class="save-btn" data-action="nav" data-target="home">Listo, empezar</button>
  `;
}

function renderMisPersonas(){
  const personas = (cuentaActual.vinculados||[]).map(id=>cuentas.find(c=>c.id===id)).filter(Boolean);
  return `
    <div class="hero">
      <h1 class="greet">Mis personas</h1>
      <div class="date">${personas.length ? 'Elegí a quién querés ver' : 'Todavía no vinculaste a nadie'}</div>
    </div>
    <div class="personas-grid">
      ${personas.map(p => `
        <button class="persona-circle" data-action="ver-persona" data-id="${p.id}">
          <span class="persona-avatar">${esc((p.perfil.nombre||'?').charAt(0).toUpperCase())}</span>
          <span class="persona-nombre">${esc(p.perfil.nombre)}</span>
        </button>`).join('')}
      <button class="persona-circle" data-action="nav" data-target="vincular-persona">
        <span class="persona-avatar plus" aria-hidden="true">+</span>
        <span class="persona-nombre">Vincular a alguien nuevo</span>
      </button>
    </div>
    <button class="cancel-link" data-action="cerrar-sesion" style="margin-top:24px;">Cambiar de cuenta</button>
  `;
}

function renderVincularPersona(){
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="mis-personas">${ICON.back}<span>Volver</span></button>
      <h1>Vincular a alguien nuevo</h1>
    </div>
    <p class="empty-note">Pedile a la persona el código que le mostramos cuando creó su cuenta.</p>
    <div class="field">
      <label for="input-codigo-vincular">Código</label>
      <input type="text" id="input-codigo-vincular" class="onboard-input" placeholder="Ej: AB3F9K" style="text-transform:uppercase; letter-spacing:3px;">
    </div>
    <button class="save-btn" data-action="confirmar-vinculo">Vincular</button>
    <button class="cancel-link" data-action="nav" data-target="mis-personas">Cancelar</button>
  `;
}

function renderMisDatos(){
  const p = perfil || {};
  const cuentaPersona = cuentaPersonalActiva();
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="home">${ICON.back}<span>Volver</span></button>
      <h1>Mis datos</h1>
    </div>
    <div class="card">
      <div class="dato-row">
        <div class="dato-label">Nombre</div>
        <div class="dato-valor">${esc(p.nombre) || '—'}</div>
      </div>
      <div class="dato-row">
        <div class="dato-label">Dirección</div>
        <div class="dato-valor">${esc(p.direccion) || '—'}</div>
      </div>
      <div class="dato-row">
        <div class="dato-label">Tu celular</div>
        <div class="dato-valor">${esc(p.celular) || '—'}</div>
      </div>
      <div class="dato-row">
        <div class="dato-label">Celular de emergencia</div>
        <div class="dato-valor">${esc(p.celularEmergencia) || '—'}</div>
      </div>
      ${cuentaPersona ? `
      <div class="dato-row">
        <div class="dato-label">Código para vincular referentes</div>
        <div class="dato-valor" style="letter-spacing:3px;">${esc(cuentaPersona.codigo)}</div>
      </div>` : ''}
    </div>
    <button class="save-btn" data-action="nav" data-target="editar-datos">${ICON.editar} Editar mis datos</button>
    <button class="cancel-link" data-action="nav" data-target="home">Ya terminé de leer</button>
    ${!actorEsReferente() ? `
    <div class="card" style="margin-top:18px;">
      <div class="card-title">Copia de seguridad</div>
      <p class="aviso" style="margin-top:0;">Tus datos se guardan solo en este celular. Descargá una copia y guardala en un lugar seguro: si cambiás de celular o se borran los datos, podés recuperarla. El archivo incluye tus remedios y tus datos personales.</p>
      <button class="save-btn" data-action="descargar-copia" style="margin-top:0;">Descargar copia de mis datos</button>
    </div>
    <button class="cancel-link" data-action="cerrar-sesion" style="margin-top:10px;">Cambiar de cuenta</button>` : ''}
  `;
}

function renderEditarDatos(){
  const p = perfil || {};
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="mis-datos">${ICON.back}<span>Volver</span></button>
      <h1>Editar mis datos</h1>
    </div>
    <div class="card">
      <div class="field">
        <label for="input-nombre-perfil">¿Cómo te llamás?</label>
        <input type="text" id="input-nombre-perfil" class="onboard-input" value="${esc(p.nombre)}">
      </div>
      <div class="field">
        <label for="input-direccion-perfil">¿Dónde vivís? (ciudad y provincia)</label>
        <input type="text" id="input-direccion-perfil" class="onboard-input" value="${esc(p.direccion)}">
      </div>
      <div class="field">
        <label for="input-celular-perfil">¿Cuál es tu número de celular?</label>
        <input type="tel" id="input-celular-perfil" class="onboard-input" value="${esc(p.celular)}">
      </div>
      <div class="field" style="margin-bottom:0;">
        <label for="input-celular-emergencia-perfil">Número de celular de alguien de confianza, para una emergencia</label>
        <input type="tel" id="input-celular-emergencia-perfil" class="onboard-input" value="${esc(p.celularEmergencia)}">
      </div>
    </div>
    <button class="save-btn" data-action="guardar-perfil">Guardar cambios</button>
    <button class="cancel-link" data-action="nav" data-target="mis-datos">No quiero guardar</button>
  `;
}

function renderAyuda(){
  const numero = perfil && perfil.celularEmergencia ? perfil.celularEmergencia : '';
  const numeroLimpio = numero.replace(/\s+/g,'');
  const referentes = referentesDeLaPersonaActual();
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="home">${ICON.back}<span>Volver</span></button>
      <h1>Necesito ayuda</h1>
    </div>
    <div class="card">
      <div class="card-title">Vamos a llamar a tu contacto de emergencia</div>
      ${numero
        ? `<div class="dato-valor" style="font-size:26px; margin-top:6px;">${esc(numero)}</div>`
        : `<p class="empty-note">Todavía no cargaste un número de emergencia. Andá a "Ver mis datos" para agregarlo.</p>`}
    </div>
    ${numero
      ? `<a class="save-btn" style="display:block;text-align:center;text-decoration:none;background:var(--terracota);box-shadow:0 4px 0 var(--terracota-deep);" href="tel:${numeroLimpio}">${ICON.ayuda} Llamar ahora</a>`
      : ''}
    ${referentes.length ? `
    <div class="card">
      <div class="card-title">O llamá a tu referente</div>
      ${referentes.map(r => `
        <div class="dato-row">
          <div class="dato-label">${esc(r.nombre)}</div>
          ${r.celular ? `<a href="tel:${r.celular.replace(/\s+/g,'')}" class="dato-valor" style="display:block; text-decoration:none; color:inherit;">${esc(r.celular)}</a>` : '<div class="dato-valor">Sin celular cargado</div>'}
        </div>`).join('')}
    </div>` : ''}
    <button class="cancel-link" data-action="nav" data-target="home">Cancelar</button>
  `;
}

function renderHome(){
  return `
    <div class="hero">
      <h1 class="greet">¡Hola${perfil && perfil.nombre ? ', '+esc(perfil.nombre) : ''}!</h1>
    </div>
    <button class="btn-primary" data-action="nav" data-target="mis-datos">${ICON.datos} Ver mis datos</button>
    <button class="btn-primary" data-action="nav" data-target="medicacion-hoy">${ICON.speaker} Ver mi medicación del día</button>
    <button class="btn-primary" data-action="nav" data-target="list">${ICON.pill} Listado de remedios</button>
    <button class="btn-primary" data-action="nav" data-target="add">${ICON.plus} Agregar un nuevo remedio</button>
    <button class="btn-primary doctor" data-action="nav" data-target="doctor">${ICON.doctor} Hoy tengo médico</button>
    <button class="btn-primary ayuda" data-action="nav" data-target="ayuda">${ICON.ayuda} Necesito ayuda</button>
  `;
}

function renderMedicacionHoy(){
  const agenda = agendaDeHoy();
  let filas = agenda.length
    ? agenda.map(a => {
        const marcado = tomasHoy.marcados.includes(a.key);
        const medsHtml = a.meds.map(m => `
            <div class="today-med-item">
              <div class="today-med-photo">${m.foto ? `<img src="${m.foto}" alt="Foto de ${esc(m.nombre)}">` : ICON.pill}</div>
              <div class="today-med-name">${esc(m.nombre)}${m.detalle ? `<span class="today-med-detalle">${esc(m.detalle)}</span>` : ''}</div>
            </div>`).join('');
        return `
        <div class="today-row ${marcado ? 'marcado' : ''}">
          <div class="today-row-top">
            <div class="today-time"><span class="num">${a.hora}</span><span class="period">${periodoLabel(a.periodo)}</span></div>
            <div class="today-meds">${medsHtml}</div>
          </div>
          <button class="check-btn ${marcado ? 'checked' : ''}" data-action="toggle-tomado" data-key="${a.key}" aria-pressed="${marcado}">
            ${marcado ? ICON.check + ' Ya tomé' : 'Ya tomé'}
          </button>
        </div>`;
      }).join('')
    : `<p class="empty-note">Hoy no tenés remedios anotados. Podés agregar uno cuando quieras.</p>`;

  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="home">${ICON.back}<span>Volver</span></button>
      <h1>Mi medicación de hoy</h1>
    </div>
    <div class="card">
      <div class="card-head">
        <div class="card-title">Tu medicación</div>
        <button class="speak-btn ${hablando ? 'speaking' : ''}" data-action="leer-dia" aria-label="${hablando ? 'Parar de leer' : 'Leerme mi día'}">${hablando ? ICON.silencio : ICON.speaker}</button>
      </div>
      ${hablando ? `<p class="speaking-hint">Te lo estoy leyendo — tocá el botón para que pare.</p>` : ''}
      ${filas}
    </div>
    <button class="save-btn" data-action="nav" data-target="home">Ya terminé de leer</button>
  `;
}

function renderListaMenu(){
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="home">${ICON.back}<span>Volver</span></button>
      <h1>Mis remedios</h1>
    </div>
    <button class="btn-primary" data-action="nav" data-target="lista-activos">${ICON.pill} Estoy tomando</button>
    <button class="btn-primary stop" data-action="nav" data-target="lista-inactivos">${ICON.stop} Ya no tomo</button>
  `;
}

function renderListaActivos(){
  const activos = meds.filter(m=>m.activo);
  const categorias = [...new Set(activos.map(m=>m.categoria))];

  let html = `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="list">${ICON.back}<span>Volver</span></button>
      <h1>Estoy tomando</h1>
    </div>`;

  if(!categorias.length){
    html += `<p class="empty-note">Por ahora no tenés remedios activos anotados.</p>`;
  }else{
    categorias.forEach(cat=>{
      html += `<div class="section-title">${esc(cat)}</div>`;
      activos.filter(m=>m.categoria===cat).forEach(m=>{ html += medCardHtml(m); });
    });
  }
  html += `<button class="save-btn" data-action="nav" data-target="list">Ya terminé de leer</button>`;
  return html;
}

function renderListaInactivos(){
  const inactivos = meds.filter(m=>!m.activo);

  let html = `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="list">${ICON.back}<span>Volver</span></button>
      <h1>Ya no tomo</h1>
    </div>`;

  if(!inactivos.length){
    html += `<p class="empty-note">No hay remedios que hayas dejado de tomar.</p>`;
  }else{
    inactivos.forEach(m=>{ html += medCardHtml(m); });
  }
  html += `<button class="save-btn" data-action="nav" data-target="list">Ya terminé de leer</button>`;
  return html;
}

function medCardHtml(m){
  const fotoHtml = m.foto ? `<img src="${m.foto}" alt="Foto de ${esc(m.nombre)}">` : ICON.pill;
  if(m.activo){
    return `
      <div class="med-card">
        <div class="med-photo">${fotoHtml}</div>
        <div class="med-info">
          <div class="med-label">
            <div class="med-name">${esc(m.nombre)}</div>
            ${m.detalle ? `<div class="med-detalle">${esc(m.detalle)}</div>` : ''}
          </div>
          <div class="med-times-pill">Tomar: ${listaConY(m.horarios.map(horarioTexto))}</div>
          ${m.frecuenciaHoras ? `<div class="med-frecuencia">Cada ${m.frecuenciaHoras} horas</div>` : ''}
          <div class="med-since">Lo tomo desde ${fechaConDia(m.fechaInicio)}</div>
          ${m.medico ? `<div class="med-medico">Indicado por ${esc(m.medico)}${m.clinica ? ' — '+esc(m.clinica) : ''}</div>` : ''}
          <div class="med-actions">
            <button class="stop-btn" data-action="pedir-stop" data-id="${m.id}">Ya no lo tomo</button>
          </div>
        </div>
      </div>`;
  }
  const quien = quienDioBaja(m);
  return `
    <div class="med-card">
      <div class="med-photo">${fotoHtml}</div>
      <div class="med-info">
        <div class="med-label">
          <div class="med-name">${esc(m.nombre)}</div>
          ${m.detalle ? `<div class="med-detalle">${esc(m.detalle)}</div>` : ''}
        </div>
        <div class="med-since">Lo tomé desde ${fechaConDia(m.fechaInicio)} al ${fechaSlash(m.fechaFin)}</div>
        ${m.medico ? `<div class="med-medico">Indicado por ${esc(m.medico)}${m.clinica ? ' — '+esc(m.clinica) : ''}</div>` : ''}
        ${quien
          ? `<div class="med-motivo">Fue ${esc(quien)} quien indicó dejar de tomarlo${m.motivo ? ' porque: '+esc(m.motivo) : '.'}</div>`
          : (m.motivo ? `<div class="med-motivo">Dejé de tomar porque: ${esc(m.motivo)}</div>` : '')}
        <div class="med-actions">
          <button class="reactivar-btn" data-action="reactivar" data-id="${m.id}">Volver a tomarlo</button>
        </div>
      </div>
    </div>`;
}

function dosisFieldHtml(){
  return `
    <fieldset class="field">
      <legend>¿Qué dosis toma?</legend>
      <div class="dosis-row">
        <input type="number" id="input-dosis-cantidad" inputmode="decimal" min="0" step="0.5" placeholder="Ej: 2" aria-label="Cantidad" value="${esc(formState.dosisCantidad)}">
        <div class="dosis-unidad-row" role="group" aria-label="Unidad">
          ${UNIDADES.map(u=> `<button type="button" class="unidad-btn ${formState.dosisUnidad===u.valor?'selected':''}" data-action="pick-unidad" data-value="${u.valor}" aria-pressed="${formState.dosisUnidad===u.valor}">${u.label}</button>`).join('')}
        </div>
      </div>
    </fieldset>`;
}
function primeraTomaFieldHtml(){
  const horas = Array.from({length:12}, (_,i)=> i+1);
  return `
    <fieldset class="field">
      <legend>¿A qué hora es la primera toma?</legend>
      <div class="hour-grid">
        ${horas.map(h=> `<button type="button" class="hour-btn ${formState.hora===h?'selected':''}" data-action="pick-hora" data-value="${h}" aria-pressed="${formState.hora===h}">${h}</button>`).join('')}
      </div>
      <div class="periodo-row">
        ${PERIODOS.map(p=> `<button type="button" class="periodo-btn ${formState.periodo===p.valor?'selected':''}" data-action="pick-periodo" data-value="${p.valor}" aria-pressed="${formState.periodo===p.valor}">${p.label}</button>`).join('')}
      </div>
    </fieldset>`;
}
function frecuenciaFieldHtml(){
  return `
    <fieldset class="field">
      <legend>¿Cada cuántas horas lo toma?</legend>
      <div class="frecuencia-row">
        ${FRECUENCIAS.map(f=> `<button type="button" class="frecuencia-btn ${formState.frecuencia===f.valor?'selected':''}" data-action="pick-frecuencia" data-value="${f.valor}" aria-pressed="${formState.frecuencia===f.valor}">${f.label}</button>`).join('')}
      </div>
    </fieldset>`;
}

function renderAdd(){
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="home">${ICON.back}<span>Volver</span></button>
      <h1>Agregar un remedio</h1>
    </div>

    <div class="field">
      <label id="foto-picker-label">Sacale una foto a la caja</label>
      <button type="button" class="photo-picker" data-action="pick-photo" aria-labelledby="foto-picker-label">
        <span class="thumb">${formState.foto ? `<img src="${formState.foto}" alt="">` : ICON.camera}</span>
        <span class="txt">${formState.foto ? 'Cambiar la foto' : 'Tocá para sacar la foto'}</span>
      </button>
      <input type="file" id="foto-input" accept="image/*" capture="environment" style="display:none">
    </div>

    <div class="field">
      <label for="input-nombre">¿Cómo se llama el remedio?</label>
      <input type="text" id="input-nombre" placeholder="Ej: Valsartán" value="${esc(formState.nombre)}">
    </div>

    <div class="field">
      <label for="input-categoria">¿Para qué es?</label>
      <input type="text" id="input-categoria" placeholder="Ej: Por la presión" value="${esc(formState.categoria)}">
    </div>

    <div class="field">
      <label for="input-medico">¿Qué médico te lo indicó?</label>
      <input type="text" id="input-medico" placeholder="Ej: Dr. Pérez" value="${esc(formState.medico)}">
    </div>

    <div class="field">
      <label for="input-clinica">¿En qué clínica o centro de salud?</label>
      <input type="text" id="input-clinica" placeholder="Ej: Clínica del Sol" value="${esc(formState.clinica)}">
    </div>

    ${dosisFieldHtml()}
    ${primeraTomaFieldHtml()}
    ${frecuenciaFieldHtml()}

    <button class="save-btn" data-action="guardar-remedio">Guardar remedio</button>
    <button class="cancel-link" data-action="nav" data-target="home">No quiero guardar</button>
  `;
}

function renderEditarIndicaciones(){
  const m = meds.find(x=>x.id===editingMedId);
  if(!m){
    return `
      <div class="topbar">
        <button class="back-btn" data-action="nav" data-target="doctor">${ICON.back}<span>Volver</span></button>
        <h1>Editar indicaciones</h1>
      </div>
      <p class="empty-note">No encontramos ese remedio.</p>`;
  }
  const esReferente = actorEsReferente();
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="doctor">${ICON.back}<span>Volver</span></button>
      <h1>Editar indicaciones</h1>
    </div>
    <p class="empty-note">${esc(m.nombre)}${m.categoria ? ' — '+esc(m.categoria) : ''}</p>

    ${esReferente ? `
    <div class="field">
      <label for="input-motivo-modificacion">¿Por qué se hace este cambio?</label>
      <textarea id="input-motivo-modificacion" class="motivo-textarea" placeholder="Ej: me lo indicó el médico por teléfono">${esc(formState.motivoModificacion)}</textarea>
    </div>
    ` : `
    <div class="field">
      <label for="input-medico-modificacion">Nombre del médico que indica este cambio</label>
      <input type="text" id="input-medico-modificacion" placeholder="Ej: Dr. Pérez" value="${esc(formState.medicoModificacion)}">
    </div>
    <div class="field">
      <label for="input-clinica-modificacion">Clínica o centro de salud</label>
      <input type="text" id="input-clinica-modificacion" placeholder="Ej: Clínica del Sol" value="${esc(formState.clinicaModificacion)}">
    </div>
    `}

    ${dosisFieldHtml()}
    ${primeraTomaFieldHtml()}
    ${frecuenciaFieldHtml()}

    <button class="save-btn" data-action="guardar-indicaciones">Guardar cambios</button>
    <button class="cancel-link" data-action="nav" data-target="doctor">No quiero guardar</button>
  `;
}

function renderDoctor(){
  const activos = meds.filter(m=>m.activo);
  const inactivos = meds.filter(m=>!m.activo);
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="home">${ICON.back}<span>Volver</span></button>
      <h1>Para el médico</h1>
    </div>
    <p class="empty-note">Resumen actualizado al ${fechaCortaHoy()}</p>

    <div class="doc-block">
      <h2>Medicación actual (${activos.length})</h2>
      ${activos.map(m=> `
        <div class="doc-item">
          <div class="n">${esc(m.nombre)} — ${esc(m.categoria)}</div>
          <div class="m">Toma: ${listaConY(m.horarios.map(horarioTexto))}${m.detalle ? ' · '+esc(m.detalle) : ''}${m.frecuenciaHoras ? ' · cada '+m.frecuenciaHoras+' horas' : ''} · desde ${fechaConDia(m.fechaInicio)}</div>
          <div class="m">Indicado por: ${m.medico ? esc(m.medico) : '—'}${m.clinica ? ' — '+esc(m.clinica) : ''}${quienModificoIndicaciones(m) ? ' · Última modificación: '+esc(quienModificoIndicaciones(m)) : ''}</div>
          <div class="doc-item-actions">
            <button class="doc-edit-btn" data-action="editar-indicaciones" data-id="${m.id}">${ICON.editar} Editar indicaciones</button>
            <button class="doc-stop-btn" data-action="pedir-stop-medico" data-id="${m.id}">${ICON.stop} Dejar de tomar</button>
          </div>
        </div>`).join('') || '<p class="empty-note">No hay medicación activa cargada.</p>'}
    </div>

    <div class="doc-block">
      <h2>Dejó de tomar (${inactivos.length})</h2>
      ${inactivos.map(m=> {
        const quien = quienDioBaja(m);
        return `
        <div class="doc-item">
          <div class="n">${esc(m.nombre)} — ${esc(m.categoria)}</div>
          <div class="m">Desde ${fechaConDia(m.fechaInicio)} hasta ${fechaSlash(m.fechaFin)}${quien
            ? ' · Fue '+esc(quien)+' quien indicó dejar de tomarlo'+(m.motivo ? ' porque: '+esc(m.motivo) : '')
            : (m.motivo ? ' · Motivo: '+esc(m.motivo) : '')}</div>
        </div>`;
      }).join('') || '<p class="empty-note">No hay cambios para mostrar.</p>'}
    </div>

    <button class="copy-btn" data-action="copiar-resumen">Copiar este resumen</button>
  `;
}

function renderStopModal(){
  const m = meds.find(x=>x.id===stoppingMedId);
  if(!m) return '';
  let pregunta, placeholder, camposExtra = '';
  if(stopOrigen==='medico'){
    pregunta = '¿Por qué deja de indicar esta medicación?';
    placeholder = 'Ej: dejó de fabricarse';
    camposExtra = `
        <div class="field" style="margin-bottom:14px;">
          <label for="medico-stop-input">Nombre del médico</label>
          <input type="text" id="medico-stop-input" placeholder="Ej: Dr. Pérez">
        </div>
        <div class="field" style="margin-bottom:14px;">
          <label for="clinica-stop-input">Clínica o centro de salud</label>
          <input type="text" id="clinica-stop-input" placeholder="Ej: Clínica del Sol">
        </div>`;
  }else if(stopOrigen==='referente'){
    pregunta = `¿Por qué dejás de indicar ${esc(m.nombre)}?`;
    placeholder = 'Ej: me lo indicó el médico por teléfono';
  }else{
    pregunta = `¿Por qué dejaste de tomar ${esc(m.nombre)}?`;
    placeholder = 'Ej: me lo sacó el médico (podés dejarlo en blanco)';
  }
  return `
    <div class="modal-overlay" data-action="cancel-stop">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="stop-modal-title">
        <h3 id="stop-modal-title">${pregunta}</h3>
        ${camposExtra}
        <textarea id="motivo-input" class="motivo-textarea" aria-labelledby="stop-modal-title" placeholder="${esc(placeholder)}"></textarea>
        <div class="modal-actions">
          <button class="modal-btn confirm" data-action="confirmar-stop">Guardar</button>
          <button class="modal-btn cancel" data-action="cancel-stop">Cancelar</button>
        </div>
      </div>
    </div>`;
}

/* ---------- EVENTOS ---------- */
document.getElementById('app').addEventListener('click', async (e)=>{
  const t = e.target.closest('[data-action]');
  if(!t) return;
  const action = t.dataset.action;
  if(action==='cancel-stop' && t.classList.contains('modal-overlay') && e.target!==t) return;

  if(action==='crear-cuenta-personal'){
    const nombre = document.getElementById('input-nombre-perfil').value.trim();
    const direccion = document.getElementById('input-direccion-perfil').value.trim();
    const celular = document.getElementById('input-celular-perfil').value.trim();
    const celularEmergencia = document.getElementById('input-celular-emergencia-perfil').value.trim();
    if(!nombre){ showToast('Escribí tu nombre para continuar.'); return; }
    if(!celularEmergencia){ showToast('Necesitamos un número de emergencia para poder ayudarte.'); return; }
    const cuenta = {
      id: 'p_'+Date.now(),
      tipo: 'personal',
      codigo: generarCodigo(),
      perfil: { nombre, direccion, celular, celularEmergencia },
      meds: [],
      tomasHoy: { fecha: claveDeHoy(), marcados: [] }
    };
    cuentas.push(cuenta);
    sesion = { cuentaId: cuenta.id };
    await guardarCuentas();
    await guardarSesion();
    cuentaActual = cuenta;
    activarPersona(cuenta);
    screen = 'codigo-generado';
    render();
  }
  else if(action==='crear-cuenta-referente'){
    const nombre = document.getElementById('input-nombre-referente').value.trim();
    const celular = document.getElementById('input-celular-referente').value.trim();
    if(!nombre){ showToast('Escribí tu nombre para continuar.'); return; }
    const cuenta = { id:'r_'+Date.now(), tipo:'referente', nombre, celular, vinculados: [] };
    cuentas.push(cuenta);
    sesion = { cuentaId: cuenta.id };
    await guardarCuentas();
    await guardarSesion();
    cuentaActual = cuenta;
    viendoPersonaId = null;
    screen = 'mis-personas';
    render();
  }
  else if(action==='usar-cuenta'){
    const cuenta = cuentas.find(c=>c.id===t.dataset.id);
    if(!cuenta) return;
    sesion = { cuentaId: cuenta.id };
    await guardarSesion();
    cuentaActual = cuenta;
    if(cuenta.tipo==='personal'){ activarPersona(cuenta); screen='home'; }
    else{ viendoPersonaId = null; screen = 'mis-personas'; }
    render();
  }
  else if(action==='cerrar-sesion'){
    sesion = null;
    await guardarSesion();
    cuentaActual = null;
    viendoPersonaId = null;
    screen = 'bienvenida';
    render();
  }
  else if(action==='ver-persona'){
    const persona = cuentas.find(c=>c.id===t.dataset.id);
    if(!persona) return;
    viendoPersonaId = persona.id;
    activarPersona(persona);
    screen = 'home';
    render();
  }
  else if(action==='confirmar-vinculo'){
    const input = document.getElementById('input-codigo-vincular');
    const codigo = input ? input.value.trim().toUpperCase() : '';
    if(!codigo){ showToast('Escribí el código.'); return; }
    const persona = cuentas.find(c=>c.tipo==='personal' && c.codigo===codigo);
    if(!persona){ showToast('No encontramos ese código.'); return; }
    cuentaActual.vinculados = cuentaActual.vinculados || [];
    if(cuentaActual.vinculados.includes(persona.id)){
      showToast('Ya está vinculada.');
      return;
    }
    cuentaActual.vinculados.push(persona.id);
    await guardarCuentas();
    screen = 'mis-personas';
    render();
    showToast('Vinculado correctamente.');
  }
  else if(action==='guardar-perfil'){
    const nombre = document.getElementById('input-nombre-perfil').value.trim();
    const direccion = document.getElementById('input-direccion-perfil').value.trim();
    const celular = document.getElementById('input-celular-perfil').value.trim();
    const celularEmergencia = document.getElementById('input-celular-emergencia-perfil').value.trim();
    if(!nombre){ showToast('Escribí tu nombre para continuar.'); return; }
    if(!celularEmergencia){ showToast('Necesitamos un número de emergencia para poder ayudarte.'); return; }
    const cuenta = cuentaPersonalActiva();
    cuenta.perfil = { nombre, direccion, celular, celularEmergencia };
    perfil = cuenta.perfil;
    guardarPerfil();
    screen = 'mis-datos';
    render();
    showToast('Tus datos quedaron actualizados.');
  }
  else if(action==='nav'){
    if(hablando){ window.speechSynthesis.cancel(); hablando = false; }
    screen = t.dataset.target;
    formState = formStateInicial();
    editingMedId = null;
    render();
  }
  else if(action==='pedir-stop'){
    stoppingMedId = t.dataset.id;
    stopOrigen = actorEsReferente() ? 'referente' : null;
    render();
  }
  else if(action==='pedir-stop-medico'){
    stoppingMedId = t.dataset.id;
    stopOrigen = 'medico';
    render();
  }
  else if(action==='cancel-stop'){
    stoppingMedId = null;
    stopOrigen = null;
    render();
  }
  else if(action==='confirmar-stop'){
    const ta = document.getElementById('motivo-input');
    const motivoTexto = ta && ta.value.trim() ? ta.value.trim() : '';
    const medicoInput = document.getElementById('medico-stop-input');
    const clinicaInput = document.getElementById('clinica-stop-input');
    const medicoTexto = medicoInput ? medicoInput.value.trim() : '';
    const clinicaTexto = clinicaInput ? clinicaInput.value.trim() : '';
    if(stopOrigen==='medico' && (!medicoTexto || !clinicaTexto || !motivoTexto)){
      showToast('Necesitamos el médico, la clínica y el motivo para guardar el cambio.');
      return;
    }
    if(stopOrigen==='referente' && !motivoTexto){
      showToast('Necesitamos el motivo para guardar el cambio.');
      return;
    }
    const m = meds.find(x=>x.id===stoppingMedId);
    if(m){
      m.activo = false;
      m.fechaFin = fechaISOHoy();
      m.motivo = motivoTexto || null;
      m.indicadoPorMedico = stopOrigen==='medico';
      m.indicadoPorReferente = stopOrigen==='referente';
      if(stopOrigen==='medico'){ m.medicoQueModifico = medicoTexto; m.clinicaQueModifico = clinicaTexto; m.referenteQueModifico = null; }
      if(stopOrigen==='referente'){ m.referenteQueModifico = cuentaActual.nombre; m.medicoQueModifico = null; m.clinicaQueModifico = null; }
      guardarDatos();
    }
    stoppingMedId = null;
    stopOrigen = null;
    render();
    showToast('Guardado exitosamente.');
  }
  else if(action==='reactivar'){
    const m = meds.find(x=>x.id===t.dataset.id);
    if(m){
      m.activo = true; m.fechaFin = null; m.motivo = null;
      m.indicadoPorMedico = false; m.indicadoPorReferente = false;
      m.medicoQueModifico = null; m.clinicaQueModifico = null; m.referenteQueModifico = null;
      guardarDatos();
    }
    render();
    showToast('Lo volvimos a poner en tu lista.');
  }
  else if(action==='descargar-copia'){
    const copia = { app:'acordate', version:1, exportadoEl:new Date().toISOString(), cuentas };
    const blob = new Blob([JSON.stringify(copia)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `acordate-copia-${fechaISOHoy()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=> URL.revokeObjectURL(url), 1000);
    showToast('Copia descargada. Guardala en un lugar seguro.');
  }
  else if(action==='pick-copia'){
    document.getElementById('copia-input').click();
  }
  else if(action==='leer-dia'){
    toggleLeerDia();
  }
  else if(action==='toggle-tomado'){
    const key = t.dataset.key;
    const idx = tomasHoy.marcados.indexOf(key);
    if(idx>=0) tomasHoy.marcados.splice(idx,1);
    else tomasHoy.marcados.push(key);
    guardarTomasHoy();
    render();
  }
  else if(action==='pick-hora'){
    formState.hora = Number(t.dataset.value);
    render();
  }
  else if(action==='pick-periodo'){
    formState.periodo = t.dataset.value;
    render();
  }
  else if(action==='pick-frecuencia'){
    formState.frecuencia = Number(t.dataset.value);
    render();
  }
  else if(action==='pick-unidad'){
    formState.dosisUnidad = t.dataset.value;
    render();
  }
  else if(action==='pick-photo'){
    document.getElementById('foto-input').click();
  }
  else if(action==='guardar-remedio'){
    const nombre = document.getElementById('input-nombre').value.trim();
    const categoria = document.getElementById('input-categoria').value.trim();
    const medico = (formState.medico||'').trim();
    const clinica = (formState.clinica||'').trim();
    if(!nombre || !categoria || !medico || !clinica || !formState.hora || !formState.periodo || !formState.frecuencia){
      showToast('Faltan datos: nombre, para qué es, médico, clínica, primera toma y frecuencia.');
      return;
    }
    const dosisTexto = formState.dosisCantidad ? `${formState.dosisCantidad} ${formState.dosisUnidad}` : '';
    meds.push({
      id: 'm'+Date.now(),
      nombre, detalle: dosisTexto, categoria,
      medico, clinica,
      horarios: calcularHorarios(formState.hora, formState.periodo, formState.frecuencia),
      frecuenciaHoras: formState.frecuencia,
      fechaInicio: fechaISOHoy(),
      activo:true, fechaFin:null, motivo:null,
      indicadoPorMedico:false, medicoQueModifico:null, clinicaQueModifico:null,
      indicadoPorReferente:false, referenteQueModifico:null,
      foto: formState.foto
    });
    guardarDatos();
    screen = 'list';
    formState = formStateInicial();
    render();
    showToast('Remedio guardado.');
  }
  else if(action==='editar-indicaciones'){
    const m = meds.find(x=>x.id===t.dataset.id);
    if(!m) return;
    editingMedId = m.id;
    const dosis = parseDetalleADosis(m.detalle);
    const primera = m.horarios[0] || {hora:null, periodo:null};
    formState = {
      nombre:'', categoria:'', medico:'', clinica:'',
      hora: primera.hora, periodo: primera.periodo,
      frecuencia: m.frecuenciaHoras || null,
      dosisCantidad: dosis.cantidad, dosisUnidad: dosis.unidad,
      medicoModificacion:'', clinicaModificacion:'', motivoModificacion:'',
      foto:null
    };
    screen = 'editar-indicaciones';
    render();
  }
  else if(action==='guardar-indicaciones'){
    const m = meds.find(x=>x.id===editingMedId);
    if(!m){ screen='doctor'; render(); return; }
    const esReferente = actorEsReferente();
    if(esReferente){
      const motivoTexto = (formState.motivoModificacion||'').trim();
      if(!motivoTexto || !formState.hora || !formState.periodo || !formState.frecuencia){
        showToast('Faltan datos: el motivo, la primera toma y la frecuencia.');
        return;
      }
      m.referenteQueModifico = cuentaActual.nombre;
      m.medicoQueModifico = null;
      m.clinicaQueModifico = null;
    }else{
      const medicoTexto = (formState.medicoModificacion||'').trim();
      const clinicaTexto = (formState.clinicaModificacion||'').trim();
      if(!medicoTexto || !clinicaTexto || !formState.hora || !formState.periodo || !formState.frecuencia){
        showToast('Faltan datos: médico, clínica, primera toma y frecuencia.');
        return;
      }
      m.medicoQueModifico = medicoTexto;
      m.clinicaQueModifico = clinicaTexto;
      m.referenteQueModifico = null;
    }
    m.horarios = calcularHorarios(formState.hora, formState.periodo, formState.frecuencia);
    m.frecuenciaHoras = formState.frecuencia;
    if(formState.dosisCantidad){
      m.detalle = `${formState.dosisCantidad} ${formState.dosisUnidad}`;
    }
    guardarDatos();
    editingMedId = null;
    screen = 'doctor';
    formState = formStateInicial();
    render();
    showToast('Indicaciones actualizadas.');
  }
  else if(action==='copiar-resumen'){
    const texto = construirResumenTexto();
    try{
      await navigator.clipboard.writeText(texto);
      showToast('Resumen copiado.');
    }catch(err){
      showToast('No se pudo copiar automáticamente.');
    }
  }
});

document.getElementById('app').addEventListener('change', (e)=>{
  if(e.target.id === 'foto-input'){
    const file = e.target.files[0];
    if(!file) return;
    comprimirFoto(file)
      .then((dataUrl)=>{ formState.foto = dataUrl; render(); })
      .catch(()=> showToast('No pudimos usar esa foto. Probá con otra.'));
  }
  else if(e.target.id === 'copia-input'){
    const file = e.target.files[0];
    if(!file) return;
    recuperarCopia(file);
  }
});

/* Lee un archivo de copia de seguridad y suma las cuentas que todavía no están. */
async function recuperarCopia(archivo){
  try{
    const datos = JSON.parse(await archivo.text());
    const validas = Array.isArray(datos.cuentas) && datos.cuentas.every(c =>
      c && typeof c.id === 'string' && (c.tipo === 'personal' || c.tipo === 'referente'));
    if(datos.app !== 'acordate' || !validas) throw new Error('formato inválido');
    let nuevas = 0;
    datos.cuentas.forEach(c=>{
      if(!cuentas.some(x=>x.id===c.id)){ cuentas.push(c); nuevas++; }
    });
    await guardarCuentas();
    render();
    showToast(nuevas ? `Copia recuperada: ${nuevas} cuenta${nuevas>1?'s':''}.` : 'Esa copia ya estaba en este celular.');
  }catch(err){
    showToast('Ese archivo no es una copia de Acordate.');
  }
}

/* Achica la foto antes de guardarla. Una foto de celular pesa varios MB y el
   navegador solo deja guardar unos 5 MB en total: sin esto, con una o dos
   fotos la app se llena y deja de guardar. Queda en ~800 px, suficiente para
   reconocer la caja. */
function comprimirFoto(archivo, ladoMax = 800, calidad = 0.72){
  return new Promise((resolver, rechazar)=>{
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = ()=>{
      try{
        const escala = Math.min(1, ladoMax / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * escala));
        const h = Math.max(1, Math.round(img.naturalHeight * escala));
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';           // evita fondo negro si la imagen tiene transparencia
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolver(canvas.toDataURL('image/jpeg', calidad));
      }catch(err){
        URL.revokeObjectURL(url);
        rechazar(err);
      }
    };
    img.onerror = ()=>{ URL.revokeObjectURL(url); rechazar(new Error('imagen ilegible')); };
    img.src = url;
  });
}

document.getElementById('app').addEventListener('input', (e)=>{
  if(e.target.id === 'input-nombre') formState.nombre = e.target.value;
  else if(e.target.id === 'input-categoria') formState.categoria = e.target.value;
  else if(e.target.id === 'input-medico') formState.medico = e.target.value;
  else if(e.target.id === 'input-clinica') formState.clinica = e.target.value;
  else if(e.target.id === 'input-dosis-cantidad') formState.dosisCantidad = e.target.value;
  else if(e.target.id === 'input-medico-modificacion') formState.medicoModificacion = e.target.value;
  else if(e.target.id === 'input-clinica-modificacion') formState.clinicaModificacion = e.target.value;
  else if(e.target.id === 'input-motivo-modificacion') formState.motivoModificacion = e.target.value;
});

document.getElementById('viewing-bar').addEventListener('click', (e)=>{
  if(e.target.id === 'viewing-switch' || e.target.closest('#viewing-switch')){
    viendoPersonaId = null;
    screen = 'mis-personas';
    render();
  }
});

function construirResumenTexto(){
  const activos = meds.filter(m=>m.activo);
  const inactivos = meds.filter(m=>!m.activo);
  let t = `Resumen de medicación — ${fechaCortaHoy()}\n\n`;
  t += `MEDICACIÓN ACTUAL:\n`;
  activos.forEach(m=>{
    t += `- ${m.nombre} (${m.categoria})${m.detalle ? ' - '+m.detalle : ''}: ${listaConY(m.horarios.map(horarioTexto))}${m.frecuenciaHoras ? ' (cada '+m.frecuenciaHoras+' horas)' : ''}, desde ${fechaConDia(m.fechaInicio)}${m.medico ? ', indicado por '+m.medico+(m.clinica ? ' ('+m.clinica+')' : '') : ''}\n`;
  });
  t += `\nDEJÓ DE TOMAR:\n`;
  inactivos.forEach(m=>{
    const quien = quienDioBaja(m);
    t += `- ${m.nombre} (${m.categoria}): desde ${fechaConDia(m.fechaInicio)} hasta ${fechaSlash(m.fechaFin)}${quien
      ? ', indicado por '+quien+(m.motivo ? ' porque: '+m.motivo : '')
      : (m.motivo ? ', motivo: '+m.motivo : '')}\n`;
  });
  return t;
}

/* ---------- RELOJ FIJO ---------- */
function textoRelojActual(){
  const d = new Date();
  const {hora, periodo} = hora24AHoraPeriodo(d.getHours());
  const mm = String(d.getMinutes()).padStart(2,'0');
  return `Hoy es ${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}, ${hora}:${mm} ${periodoLabel(periodo)}`;
}
function actualizarReloj(){
  const el = document.getElementById('clock-text');
  if(el) el.textContent = textoRelojActual();
}
actualizarReloj();
setInterval(actualizarReloj, 15000);

iniciar();
