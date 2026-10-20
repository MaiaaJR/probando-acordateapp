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
let cuentas = [];          // datos que el servidor nos deja ver: la propia cuenta y las personas que acompañamos
let cuentaActual = null;   // objeto de la cuenta con la que se ingresó (personal o referente)
let viendoPersonaId = null; // si cuentaActual es referente, id de la persona que está viendo
let sinConexion = false;   // true si estamos mostrando la última copia guardada en el celular

let meds = [];
let perfil = null;
let tomasHoy = { fecha:'', marcados:[] };

let screen = 'bienvenida';
let stoppingMedId = null;
let stopOrigen = null; // null (la propia persona) | 'medico' | 'referente'
let editingMedId = null;
let hablando = false;
let mailPendiente = '';  // mail al que se envió la confirmación
let ocupado = false;   // true mientras se guarda algo en el servidor (evita toques repetidos)
let formState = formStateInicial();

/* ---------- NUBE: cargar y guardar ---------- */
const CLAVE_COPIA = 'acordate:ultima-copia:';   // última lectura buena, para poder abrir sin internet
const CLAVE_PERFIL_PENDIENTE = 'acordate:perfil-pendiente';

function leerLocal(clave){ try{ return JSON.parse(localStorage.getItem(clave)); }catch(e){ return null; } }
function guardarLocal(clave, valor){ try{ localStorage.setItem(clave, JSON.stringify(valor)); }catch(e){} }
function borrarLocal(clave){ try{ localStorage.removeItem(clave); }catch(e){} }

function aplicarDatos(datos){
  cuentas = datos.cuentas;
  cuentaActual = cuentas.find(c => c.id === datos.yoId) || null;
  if(cuentaActual && cuentaActual.tipo === 'personal') activarPersona(cuentaActual);
  else if(viendoPersonaId){
    const p = cuentas.find(c => c.id === viendoPersonaId);
    if(p) activarPersona(p); else viendoPersonaId = null;
  }
}

/* Trae todo del servidor. Si no hay internet, usa la última copia guardada (solo para leer). */
async function cargarDesdeNube(){
  try{
    const datos = await Nube.cargarTodo();
    if(datos.sinPerfil) return datos;
    sinConexion = false;
    aplicarDatos(datos);
    guardarLocal(CLAVE_COPIA + datos.yoId, datos);
    return datos;
  }catch(e){
    const u = Nube.usuarioActual();
    const copia = u ? leerLocal(CLAVE_COPIA + u.id) : null;
    if(copia && copia.cuentas){
      sinConexion = true;
      aplicarDatos(copia);
      return copia;
    }
    throw e;
  }
}

/* Ejecuta un guardado en el servidor. Si falla, avisa y vuelve a leer lo que hay guardado. */
async function guardarEnNube(tarea){
  if(sinConexion){
    showToast('Estás sin internet. Podés mirar tus remedios, pero no cambiarlos hasta que vuelva la conexión.', 7000);
    return false;
  }
  if(ocupado) return false;
  ocupado = true;
  try{
    await tarea();
    return true;
  }catch(e){
    showToast((e && e.message) || 'No pudimos guardar. Probá de nuevo.', 7000);
    try{ await cargarDesdeNube(); }catch(_){}
    render();
    return false;
  }finally{
    ocupado = false;
  }
}

async function iniciar(){
  // Pide al navegador que no borre los datos si el celular se queda sin espacio.
  try{ if(navigator.storage && navigator.storage.persist) navigator.storage.persist(); }catch(e){}
  if(!Nube.iniciar()){
    screen = 'bienvenida';
    render();
    showToast('No pudimos conectarnos al servidor. Revisá tu conexión y abrí la app de nuevo.', 8000);
    return;
  }
  Nube.alCambiarAuth((evento) => {
    // Llegó desde el enlace del mail para elegir una contraseña nueva.
    if(evento === 'PASSWORD_RECOVERY'){ screen = 'nueva-clave'; render(); }
  });
  await Nube.recuperarSesion();
  if(!Nube.usuarioActual()){ screen = 'bienvenida'; render(); return; }
  if(screen === 'nueva-clave'){ render(); return; }
  await entrarConSesion();
}

/* La persona ya está identificada: leemos sus datos y elegimos la pantalla de inicio. */
async function entrarConSesion(irAlCodigo){
  let datos;
  try{
    datos = await cargarDesdeNube();
  }catch(e){
    screen = 'bienvenida';
    render();
    showToast((e && e.message) || 'No pudimos leer tus datos.', 8000);
    return;
  }
  if(datos.sinPerfil){
    // Se registró pero todavía no tiene perfil (por ejemplo, confirmó el mail después).
    const pendiente = leerLocal(CLAVE_PERFIL_PENDIENTE);
    const u = Nube.usuarioActual();
    if(pendiente && u && pendiente.email === u.email){
      try{
        await Nube.crearPerfil(pendiente.tipo, pendiente.perfil);
        borrarLocal(CLAVE_PERFIL_PENDIENTE);
        return entrarConSesion(true);
      }catch(e){ showToast(e.message, 8000); }
    }
    screen = 'completar-perfil';
    render();
    return;
  }
  if(cuentaActual.tipo === 'personal'){
    screen = irAlCodigo ? 'codigo-generado' : 'home';
  }else{
    viendoPersonaId = null;
    screen = 'mis-personas';
  }
  render();
}

/* Cuando la app vuelve a primer plano, actualiza lo que se ve (por si un referente cambió algo). */
const PANTALLAS_DE_LECTURA = ['home','list','lista-activos','lista-inactivos','doctor','mis-datos','medicacion-hoy','ayuda','mis-personas'];
async function refrescarSilencioso(){
  if(document.hidden || ocupado || stoppingMedId || hablando) return;
  if(!Nube.usuarioActual() || !cuentaActual) return;
  if(!PANTALLAS_DE_LECTURA.includes(screen)) return;
  try{
    await cargarDesdeNube();
    if(!ocupado && !stoppingMedId && PANTALLAS_DE_LECTURA.includes(screen)) render();
  }catch(e){ /* sin conexión: dejamos lo que se ve */ }
}
document.addEventListener('visibilitychange', refrescarSilencioso);

/* ---------- CUENTAS ---------- */
function activarPersona(cuenta){
  perfil = cuenta.perfil;
  meds = cuenta.meds;
  tomasHoy = cuenta.tomasHoy;
  tomasHoy.fecha = claveDeHoy();
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
  return (cuenta.referentes || []).filter(r => r.estado === 'aprobado');
}
function nombreDeQuienActua(){
  if(!cuentaActual) return null;
  return cuentaActual.tipo === 'referente' ? cuentaActual.nombre : (cuentaActual.perfil && cuentaActual.perfil.nombre);
}
function solicitudesPendientes(){
  if(!cuentaActual || cuentaActual.tipo !== 'personal') return [];
  return (cuentaActual.referentes || []).filter(r => r.estado === 'pendiente');
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
/* ---------- VALIDACIÓN ----------
   Cada validador devuelve { valor } si está bien, o { error } con un mensaje
   claro para la persona. Los textos se limpian (espacios de más) antes de revisar. */
function limpiarTexto(s){ return (s||'').replace(/\s+/g,' ').trim(); }
function contarLetras(s){ return (s.match(/\p{L}/gu)||[]).length; }
const SOLO_NOMBRE = /^\p{L}[\p{L}\p{M} '’.\-]*$/u;
const TEXTO_COMUN = /^[\p{L}\p{M}0-9 .,;:'’"()\/%+°ºª#&\-]+$/u;

function validarNombre(v){
  v = limpiarTexto(v);
  if(!v) return { error:'Escribí tu nombre para continuar.' };
  if(v.length < 2 || contarLetras(v) < 2) return { error:'El nombre es muy corto. Escribilo completo.' };
  if(v.length > 60) return { error:'El nombre es muy largo (máximo 60 letras).' };
  if(!SOLO_NOMBRE.test(v)) return { error:'El nombre solo puede tener letras. Revisalo.' };
  return { valor:v };
}
function validarTextoLibre(v, { etiqueta, minLetras = 3, max = 80, obligatorio = true, soloNombre = false }){
  v = limpiarTexto(v);
  if(!v) return obligatorio ? { error:`Escribí ${etiqueta}.` } : { valor:'' };
  if(contarLetras(v) < minLetras) return { error:`Revisá ${etiqueta}: parece muy corto.` };
  if(v.length > max) return { error:`Revisá ${etiqueta}: es muy largo (máximo ${max} letras).` };
  if(!(soloNombre ? SOLO_NOMBRE : TEXTO_COMUN).test(v)) return { error:`Revisá ${etiqueta}: tiene símbolos que no podemos guardar.` };
  return { valor:v };
}
function validarCelular(v, { obligatorio = false, etiqueta = 'el número' } = {}){
  v = limpiarTexto(v);
  if(!v) return obligatorio ? { error:`Escribí ${etiqueta}.` } : { valor:'' };
  if(!/^[\d\s+()\-.]+$/.test(v)) return { error:'El número solo puede tener cifras. Ejemplo: 351 555 1234.' };
  let d = v.replace(/\D/g,'');
  if(d.startsWith('549')) d = d.slice(3);
  else if(d.startsWith('54')) d = d.slice(2);
  if(d.startsWith('0')) d = d.slice(1);
  // Formato viejo con "15" después del código de área (ej: 0351 15 555 1234).
  if(d.length === 12){
    for(const area of [2,3,4]){
      if(d.slice(area, area+2) === '15' && d.length - 2 === 10){ d = d.slice(0,area) + d.slice(area+2); break; }
    }
  }
  if(d.length !== 10 || /^0/.test(d)){
    return { error:'Revisá el número: tiene que tener 10 cifras, con código de área y sin el 0 ni el 15. Ejemplo: 351 555 1234.' };
  }
  if(/^(\d)\1+$/.test(d)) return { error:'Ese número no parece real. Revisalo.' };
  return { valor:v };
}
function validarCantidadDosis(v){
  const s = String(v||'').trim().replace(',', '.');
  if(!s) return { valor:'' };
  const n = Number(s);
  if(!isFinite(n) || n <= 0) return { error:'La cantidad tiene que ser un número mayor que cero.' };
  if(n > 10000) return { error:'Esa cantidad parece demasiado grande. Revisala.' };
  return { valor:String(n) };
}
function validarMotivo(v){
  v = limpiarTexto(v);
  if(!v) return { error:'Contanos el motivo: queda anotado para que se sepa por qué se hizo el cambio.' };
  if(v.length < 5 || contarLetras(v) < 4) return { error:'El motivo es muy corto. Contanos un poco más.' };
  if(v.length > 500) return { error:'El motivo es muy largo (máximo 500 letras).' };
  return { valor:v };
}
function validarEmail(v){
  v = (v||'').trim().toLowerCase();
  if(!v) return { error:'Escribí tu mail.' };
  if(v.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return { error:'Revisá el mail: tiene que ser como nombre@ejemplo.com.' };
  return { valor:v };
}
function validarClaveNueva(v, email){
  v = v || '';
  if(v.length < 8) return { error:'La contraseña tiene que tener al menos 8 caracteres.' };
  if(v.length > 72) return { error:'La contraseña es muy larga (máximo 72 caracteres).' };
  if(/^(.)\1+$/.test(v) || /^(0?1?2?3?4?5?6?7?8?9?0?)+$/.test(v) && /^\d+$/.test(v)){
    return { error:'Esa contraseña es muy fácil de adivinar. Probá con otra.' };
  }
  if(email && v.toLowerCase() === email.toLowerCase()) return { error:'La contraseña no puede ser igual al mail.' };
  return { valor:v };
}
function validarCodigo(v){
  const c = (v||'').trim().toUpperCase().replace(/\s+/g,'');
  if(!c) return { error:'Escribí el código.' };
  if(!/^[A-HJ-NP-Z2-9]{6}$/.test(c)) return { error:'El código tiene 6 letras o números. Revisalo (no usa 0, 1, I ni O).' };
  return { valor:c };
}
/* Devuelve el primer error de una lista de { id, r } y marca el campo. */
function primerError(lista){
  document.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
  for(const { id, r } of lista){
    if(r.error){
      showToast(r.error, 6000);
      const el = id && document.getElementById(id);
      if(el){ el.setAttribute('aria-invalid','true'); el.focus(); }
      return true;
    }
  }
  return false;
}

/* Lee y valida el formulario de datos personales. Devuelve el perfil o null. */
function leerPerfilValidado(){
  const val = id => document.getElementById(id).value;
  const nombre = validarNombre(val('input-nombre-perfil'));
  const direccion = validarTextoLibre(val('input-direccion-perfil'), { etiqueta:'la ciudad y provincia', minLetras:3, max:120, obligatorio:false });
  const celular = validarCelular(val('input-celular-perfil'), { etiqueta:'tu número de celular' });
  const emergencia = validarCelular(val('input-celular-emergencia-perfil'), { obligatorio:true, etiqueta:'un número de emergencia' });
  if(primerError([
    { id:'input-nombre-perfil', r:nombre },
    { id:'input-direccion-perfil', r:direccion },
    { id:'input-celular-perfil', r:celular },
    { id:'input-celular-emergencia-perfil', r:emergencia }
  ])) return null;
  const solo = s => s.replace(/\D/g,'');
  if(celular.valor && solo(celular.valor) === solo(emergencia.valor)){
    primerError([{ id:'input-celular-emergencia-perfil', r:{ error:'El número de emergencia tiene que ser de otra persona, no el tuyo.' } }]);
    return null;
  }
  return { nombre:nombre.valor, direccion:direccion.valor, celular:celular.valor, celularEmergencia:emergencia.valor };
}

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
  else if(screen==='ingresar') html = renderIngresar();
  else if(screen==='nueva-clave') html = renderNuevaClave();
  else if(screen==='revisa-mail') html = renderRevisaMail();
  else if(screen==='completar-perfil') html = renderCompletarPerfil();
  else if(screen==='confirmar-salir') html = renderConfirmarSalir();
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

  // Antes de redibujar, anotamos qué elemento tenía el foco para devolvérselo después.
  const activo = document.activeElement;
  let selectorFoco = null;
  if(activo && app.contains(activo)){
    if(activo.id) selectorFoco = '#' + CSS.escape(activo.id);
    else if(activo.dataset && activo.dataset.action){
      selectorFoco = `[data-action="${activo.dataset.action}"]` +
        ['value','id','key','target'].filter(k => activo.dataset[k] !== undefined)
          .map(k => `[data-${k}="${CSS.escape(activo.dataset[k])}"]`).join('');
    }
  }
  const mismaPantalla = pantallaPrevia === screen;

  app.innerHTML = html;

  if(stoppingMedId){
    const primero = document.getElementById('medico-stop-input') || document.getElementById('motivo-input');
    if(primero) primero.focus();
  }else if(mismaPantalla && selectorFoco){
    // Mismo lugar: el foco vuelve al botón o campo que se estaba usando.
    const el = app.querySelector(selectorFoco);
    if(el) el.focus({ preventScroll:true });
  }else if(!mismaPantalla){
    // Pantalla nueva: el lector de pantalla empieza leyendo el título.
    const titulo = app.querySelector('h1');
    if(titulo){ titulo.setAttribute('tabindex','-1'); titulo.focus({ preventScroll:true }); }
  }
  pantallaPrevia = screen;
  actualizarBarraVista();
}
let pantallaPrevia = null;

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
  return `
    <div class="hero" style="margin-top:24px;">
      <h1 class="greet">¡Hola!</h1>
      <div class="date">Acordate te ayuda a no olvidarte de tus remedios.</div>
    </div>
    <button class="btn-primary" data-action="nav" data-target="ingresar">${ICON.datos} Ya tengo cuenta</button>
    <div class="section-title">Soy nuevo</div>
    <button class="btn-primary" data-action="nav" data-target="onboarding-personal">${ICON.datos} Es para mí</button>
    <button class="btn-primary doctor" data-action="nav" data-target="onboarding-referente">${ICON.doctor} Soy referente de alguien</button>
    <p class="aviso">Acordate no reemplaza la indicación de tu médico.</p>
  `;
}

/* Campos de mail y contraseña. "nueva" = al crear cuenta; si no, al ingresar. */
function camposAcceso(nueva){
  return `
      <div class="field">
        <label for="input-email">Tu mail</label>
        <input type="email" id="input-email" class="onboard-input" placeholder="Ej: choli@gmail.com" autocomplete="email" autocapitalize="none" spellcheck="false" inputmode="email">
        ${nueva ? '<p class="ayuda-campo">Si alguien te está ayudando a crear la cuenta, puede usar su propio mail.</p>' : ''}
      </div>
      <div class="field">
        <label for="input-clave">${nueva ? 'Elegí una contraseña (mínimo 8 caracteres)' : 'Tu contraseña'}</label>
        <input type="password" id="input-clave" class="onboard-input" autocomplete="${nueva ? 'new-password' : 'current-password'}" autocapitalize="none" spellcheck="false">
        <button type="button" class="cancel-link" data-action="ver-clave" style="margin-top:6px;" aria-pressed="false">Mostrar la contraseña</button>
      </div>`;
}
function textoConsentimiento(tipo){
  return tipo === 'personal'
    ? 'Entiendo que mis datos de salud (mis remedios, mis horarios y mis datos personales) se guardan en mi cuenta de Acordate en internet, y que solo los van a ver las personas que yo acepte.'
    : 'Entiendo que mis datos se guardan en mi cuenta de Acordate, y que solo voy a ver los datos de salud de las personas que me acepten como referente.';
}
function bloqueConsentimiento(tipo){
  return `
      <label class="check-row">
        <input type="checkbox" id="input-acepto">
        <span>${textoConsentimiento(tipo)}</span>
      </label>`;
}

function renderIngresar(){
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="bienvenida">${ICON.back}<span>Volver</span></button>
      <h1>Ingresar</h1>
    </div>
    <div class="card">
      ${camposAcceso(false)}
    </div>
    <button class="save-btn" data-action="ingresar">Ingresar</button>
    <button class="cancel-link" data-action="olvide-clave">Me olvidé la contraseña</button>
    <p class="aviso">Después de ingresar, la app te recuerda en este celular. No te lo vamos a pedir cada vez.</p>
  `;
}

function renderNuevaClave(){
  return `
    <div class="hero" style="margin-top:24px;">
      <h1 class="greet">Elegí una contraseña nueva</h1>
    </div>
    <div class="card">
      <div class="field" style="margin-bottom:0;">
        <label for="input-clave">Contraseña nueva (mínimo 8 caracteres)</label>
        <input type="password" id="input-clave" class="onboard-input" autocomplete="new-password" autocapitalize="none" spellcheck="false">
        <button type="button" class="cancel-link" data-action="ver-clave" style="margin-top:6px;" aria-pressed="false">Mostrar la contraseña</button>
      </div>
    </div>
    <button class="save-btn" data-action="guardar-nueva-clave">Guardar contraseña</button>
  `;
}

function renderCompletarPerfil(){
  return `
    <div class="hero" style="margin-top:24px;">
      <h1 class="greet">Falta un paso</h1>
      <div class="date">Tu mail ya está listo. Contanos cómo vas a usar Acordate.</div>
    </div>
    <button class="btn-primary" data-action="nav" data-target="onboarding-personal">${ICON.datos} Es para mí</button>
    <button class="btn-primary doctor" data-action="nav" data-target="onboarding-referente">${ICON.doctor} Soy referente de alguien</button>
    <button class="cancel-link" data-action="cerrar-sesion">Usar otro mail</button>
  `;
}

function renderOnboardingPersonal(){
  const yaTieneMail = !!Nube.usuarioActual();
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="${yaTieneMail ? 'completar-perfil' : 'bienvenida'}">${ICON.back}<span>Volver</span></button>
      <h1>Es para mí</h1>
    </div>
    <p class="empty-note">Contanos un poco de vos. Esto lo hacemos una sola vez.</p>
    <div class="card">
      ${yaTieneMail ? '' : camposAcceso(true)}
      <div class="field">
        <label for="input-nombre-perfil">¿Cómo te llamás?</label>
        <input type="text" id="input-nombre-perfil" class="onboard-input" placeholder="Ej: Choli" autocomplete="given-name">
      </div>
      <div class="field">
        <label for="input-direccion-perfil">¿Dónde vivís? (ciudad y provincia)</label>
        <input type="text" id="input-direccion-perfil" class="onboard-input" placeholder="Ej: Córdoba, Córdoba">
      </div>
      <div class="field">
        <label for="input-celular-perfil">¿Cuál es tu número de celular?</label>
        <input type="tel" id="input-celular-perfil" class="onboard-input" placeholder="Ej: 351 555 1234" autocomplete="tel">
      </div>
      <div class="field" style="margin-bottom:0;">
        <label for="input-celular-emergencia-perfil">Número de celular de alguien de confianza, para una emergencia</label>
        <input type="tel" id="input-celular-emergencia-perfil" class="onboard-input" placeholder="Ej: 351 555 5678">
      </div>
    </div>
    <div class="card">${bloqueConsentimiento('personal')}</div>
    <button class="save-btn" data-action="crear-cuenta-personal">Crear mi cuenta</button>
  `;
}

function renderOnboardingReferente(){
  const yaTieneMail = !!Nube.usuarioActual();
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="${yaTieneMail ? 'completar-perfil' : 'bienvenida'}">${ICON.back}<span>Volver</span></button>
      <h1>Soy referente</h1>
    </div>
    <p class="empty-note">Contanos quién sos. Esto lo hacemos una sola vez.</p>
    <div class="card">
      ${yaTieneMail ? '' : camposAcceso(true)}
      <div class="field">
        <label for="input-nombre-referente">¿Cómo te llamás?</label>
        <input type="text" id="input-nombre-referente" class="onboard-input" placeholder="Ej: María" autocomplete="given-name">
      </div>
      <div class="field" style="margin-bottom:0;">
        <label for="input-celular-referente">Tu número de celular (para que te puedan llamar)</label>
        <input type="tel" id="input-celular-referente" class="onboard-input" placeholder="Ej: 351 555 1234" autocomplete="tel">
      </div>
    </div>
    <div class="card">${bloqueConsentimiento('referente')}</div>
    <button class="save-btn" data-action="crear-cuenta-referente">Crear mi cuenta</button>
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
      <p class="empty-note">Si alguien te acompaña con tus remedios (un hijo, una hija, quien vos quieras), pasale este código. Cuando lo use, te va a aparecer un aviso para que aceptes o no. Nadie ve tus datos si vos no aceptás.</p>
      <div class="dato-valor" style="font-size:34px; text-align:center; letter-spacing:6px; margin-top:12px;">${cuenta ? esc(cuenta.codigo) : ''}</div>
    </div>
    <button class="save-btn" data-action="nav" data-target="home">Listo, empezar</button>
  `;
}

function renderRevisaMail(){
  return `
    <div class="hero" style="margin-top:24px;">
      <h1 class="greet">Revisá tu mail</h1>
    </div>
    <div class="card">
      <p class="empty-note" style="margin:0;">Te enviamos un mensaje a <strong>${esc(mailPendiente)}</strong>. Abrilo y tocá el enlace para confirmar tu cuenta. Después volvé acá y tocá "Ya confirmé, ingresar". Si no lo ves, mirá en la carpeta de correo no deseado (spam).</p>
    </div>
    <button class="save-btn" data-action="nav" data-target="ingresar">Ya confirmé, ingresar</button>
  `;
}

function renderConfirmarSalir(){
  return `
    <div class="topbar">
      <button class="back-btn" data-action="nav" data-target="${cuentaActual && cuentaActual.tipo==='referente' ? 'mis-personas' : 'mis-datos'}">${ICON.back}<span>Volver</span></button>
      <h1>Cerrar sesión</h1>
    </div>
    <div class="card">
      <p class="empty-note" style="margin:0;">Si cerrás la sesión, la próxima vez vas a tener que escribir tu mail y tu contraseña. Tus remedios no se borran: quedan guardados en tu cuenta.</p>
    </div>
    <button class="save-btn" data-action="cerrar-sesion">Sí, cerrar sesión</button>
    <button class="cancel-link" data-action="nav" data-target="${cuentaActual && cuentaActual.tipo==='referente' ? 'mis-personas' : 'mis-datos'}">No, quedarme</button>
  `;
}

function renderMisPersonas(){
  const personas = (cuentaActual.vinculados||[]).map(id=>cuentas.find(c=>c.id===id)).filter(Boolean);
  const pend = cuentaActual.pendientes || 0;
  return `
    <div class="hero">
      <h1 class="greet">Mis personas</h1>
      <div class="date">${personas.length ? 'Elegí a quién querés ver' : 'Todavía no acompañás a nadie'}</div>
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
    ${pend ? `<p class="aviso">Esperando respuesta de ${pend} ${pend===1?'persona':'personas'}. Cuando acepten, van a aparecer acá.</p>` : ''}
    <button class="cancel-link" data-action="nav" data-target="confirmar-salir" style="margin-top:24px;">Cerrar sesión</button>
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
    ${actorEsReferente() ? '' : `<button class="save-btn" data-action="nav" data-target="editar-datos">${ICON.editar} Editar mis datos</button>`}
    ${!actorEsReferente() ? renderQuienesMeAcompanan() : ''}
    <button class="cancel-link" data-action="nav" data-target="home">Ya terminé de leer</button>
    ${!actorEsReferente() ? `<button class="cancel-link" data-action="nav" data-target="confirmar-salir" style="margin-top:6px;">Cerrar sesión</button>` : ''}
  `;
}

/* Lista de referentes de la persona: aceptar, rechazar o dejar de compartir. */
function renderQuienesMeAcompanan(){
  const cuenta = cuentaActual && cuentaActual.tipo === 'personal' ? cuentaActual : null;
  const lista = cuenta ? (cuenta.referentes || []) : [];
  if(!lista.length) return '';
  return `
    <div class="card" style="margin-top:18px;">
      <div class="card-title">Quienes me acompañan</div>
      ${lista.map(r => r.estado === 'pendiente' ? `
        <div class="dato-row">
          <div class="dato-label">Pide acompañarte</div>
          <div class="dato-valor">${esc(r.nombre)}</div>
          <div class="fila-botones">
            <button class="save-btn" data-action="responder-vinculo" data-id="${r.vinculoId}" data-si="1" style="margin-top:8px;">Aceptar</button>
            <button class="cancel-link" data-action="responder-vinculo" data-id="${r.vinculoId}" data-si="0">No aceptar</button>
          </div>
        </div>` : `
        <div class="dato-row">
          <div class="dato-label">Puede ver y cargar tus remedios</div>
          <div class="dato-valor">${esc(r.nombre)}</div>
          <button class="cancel-link" data-action="responder-vinculo" data-id="${r.vinculoId}" data-si="0">Dejar de compartir con ${esc(r.nombre)}</button>
        </div>`).join('')}
    </div>`;
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
  const pendientes = actorEsReferente() ? [] : solicitudesPendientes();
  return `
    <div class="hero">
      <h1 class="greet">¡Hola${perfil && perfil.nombre ? ', '+esc(perfil.nombre) : ''}!</h1>
    </div>
    ${sinConexion ? '<p class="aviso" role="status">Estás sin internet. Podés ver tus remedios, pero no cambiarlos.</p>' : ''}
    ${pendientes.length ? `
    <div class="card" role="status">
      <div class="card-title">${esc(pendientes[0].nombre)} quiere acompañarte</div>
      <p class="empty-note" style="margin:6px 0 0;">Si aceptás, va a poder ver y cargar tus remedios. Podés dejar de compartir cuando quieras.</p>
      <button class="save-btn" data-action="responder-vinculo" data-id="${pendientes[0].vinculoId}" data-si="1">Aceptar</button>
      <button class="cancel-link" data-action="responder-vinculo" data-id="${pendientes[0].vinculoId}" data-si="0">No aceptar</button>
    </div>` : ''}
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
        <input type="number" id="input-dosis-cantidad" inputmode="decimal" min="0" step="any" placeholder="Ej: 2" aria-label="Cantidad" value="${esc(formState.dosisCantidad)}">
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

  if(action==='crear-cuenta-personal' || action==='crear-cuenta-referente'){
    const tipo = action==='crear-cuenta-personal' ? 'personal' : 'referente';
    if(ocupado) return;
    const sinMail = !Nube.usuarioActual();
    let email = null, clave = null;
    if(sinMail){
      const rEmail = validarEmail(document.getElementById('input-email').value);
      const rClave = validarClaveNueva(document.getElementById('input-clave').value, rEmail.valor);
      if(primerError([{ id:'input-email', r:rEmail }, { id:'input-clave', r:rClave }])) return;
      email = rEmail.valor; clave = rClave.valor;
    }
    let datosPerfil;
    if(tipo==='personal'){
      datosPerfil = leerPerfilValidado();
      if(!datosPerfil) return;
    }else{
      const nombreR = validarNombre(document.getElementById('input-nombre-referente').value);
      const celularR = validarCelular(document.getElementById('input-celular-referente').value, { obligatorio:true, etiqueta:'tu número de celular' });
      if(primerError([
        { id:'input-nombre-referente', r:nombreR },
        { id:'input-celular-referente', r:celularR }
      ])) return;
      datosPerfil = { nombre:nombreR.valor, celular:celularR.valor };
    }
    if(!document.getElementById('input-acepto').checked){
      primerError([{ id:'input-acepto', r:{ error:'Para crear tu cuenta, marcá la casilla que dice que entendés cómo se guardan tus datos.' } }]);
      return;
    }
    ocupado = true;
    try{
      if(sinMail){
        const { conSesion } = await Nube.registrar(email, clave);
        if(!conSesion){
          // La cuenta pide confirmar el mail antes de entrar: guardamos los datos para completarla después.
          guardarLocal(CLAVE_PERFIL_PENDIENTE, { email, tipo, perfil: datosPerfil });
          formState = formStateInicial();
          mailPendiente = email;
          screen = 'revisa-mail';
          render();
          return;
        }
      }
      await Nube.crearPerfil(tipo, datosPerfil);
    }catch(err){
      showToast(err.message || 'No pudimos crear la cuenta.', 8000);
      if(Nube.usuarioActual()){ screen = 'completar-perfil'; render(); }
      return;
    }finally{
      ocupado = false;
    }
    await entrarConSesion(true);
  }
  else if(action==='ver-clave'){
    const campo = document.getElementById('input-clave');
    if(campo){
      const mostrar = campo.type === 'password';
      campo.type = mostrar ? 'text' : 'password';
      t.textContent = mostrar ? 'Ocultar la contraseña' : 'Mostrar la contraseña';
      t.setAttribute('aria-pressed', String(mostrar));
    }
  }
  else if(action==='ingresar'){
    if(ocupado) return;
    const rEmail = validarEmail(document.getElementById('input-email').value);
    const claveIng = document.getElementById('input-clave').value;
    const rClave = claveIng ? { valor:claveIng } : { error:'Escribí tu contraseña.' };
    if(primerError([{ id:'input-email', r:rEmail }, { id:'input-clave', r:rClave }])) return;
    ocupado = true;
    try{
      await Nube.ingresar(rEmail.valor, claveIng);
    }catch(err){
      showToast(err.message, 8000);
      return;
    }finally{
      ocupado = false;
    }
    await entrarConSesion();
  }
  else if(action==='olvide-clave'){
    if(ocupado) return;
    const rEmail = validarEmail(document.getElementById('input-email').value);
    if(primerError([{ id:'input-email', r:rEmail }])) return;
    ocupado = true;
    try{
      await Nube.pedirNuevaClave(rEmail.valor);
      showToast('Si ese mail tiene una cuenta, te enviamos un mensaje para elegir una contraseña nueva.', 9000);
    }catch(err){
      showToast(err.message, 8000);
    }finally{
      ocupado = false;
    }
  }
  else if(action==='guardar-nueva-clave'){
    if(ocupado) return;
    const u = Nube.usuarioActual();
    const rClave = validarClaveNueva(document.getElementById('input-clave').value, u && u.email);
    if(primerError([{ id:'input-clave', r:rClave }])) return;
    ocupado = true;
    try{
      await Nube.cambiarClave(rClave.valor);
    }catch(err){
      showToast(err.message, 8000);
      return;
    }finally{
      ocupado = false;
    }
    showToast('Listo, ya tenés tu contraseña nueva.');
    await entrarConSesion();
  }
  else if(action==='cerrar-sesion'){
    const u = Nube.usuarioActual();
    await Nube.salir();
    if(u) borrarLocal(CLAVE_COPIA + u.id);   // en un celular compartido no queda nada guardado
    cuentas = []; cuentaActual = null; viendoPersonaId = null;
    meds = []; perfil = null; tomasHoy = { fecha:'', marcados:[] };
    sinConexion = false;
    if(hablando){ window.speechSynthesis.cancel(); hablando = false; }
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
    const rCodigo = validarCodigo(input ? input.value : '');
    if(primerError([{ id:'input-codigo-vincular', r:rCodigo }])) return;
    let resultado = null;
    const ok = await guardarEnNube(async () => { resultado = await Nube.solicitarVinculo(rCodigo.valor); });
    if(!ok) return;
    if(resultado === 'no_encontrado'){
      primerError([{ id:'input-codigo-vincular', r:{ error:'No encontramos ese código. Revisalo con la persona.' } }]);
      return;
    }
    try{ await cargarDesdeNube(); }catch(_){}
    screen = 'mis-personas';
    render();
    showToast(resultado === 'aprobado'
      ? 'Ya estaba vinculada.'
      : 'Listo. Le avisamos a la persona. Cuando acepte, la vas a ver acá.', 7000);
  }
  else if(action==='responder-vinculo'){
    const aprobar = t.dataset.si === '1';
    const ok = await guardarEnNube(() => Nube.responderVinculo(t.dataset.id, aprobar));
    if(!ok) return;
    try{ await cargarDesdeNube(); }catch(_){}
    render();
    showToast(aprobar ? 'Listo, ahora puede acompañarte.' : 'Listo. Ya no puede ver tus datos.', 6000);
  }
  else if(action==='guardar-perfil'){
    const nuevoPerfil = leerPerfilValidado();
    if(!nuevoPerfil) return;
    const ok = await guardarEnNube(() => Nube.actualizarPerfil(nuevoPerfil));
    if(!ok) return;
    const cuenta = cuentaPersonalActiva();
    cuenta.perfil = nuevoPerfil;
    perfil = cuenta.perfil;
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
    const medicoInput = document.getElementById('medico-stop-input');
    const clinicaInput = document.getElementById('clinica-stop-input');
    const exigeMotivo = stopOrigen==='medico' || stopOrigen==='referente';
    const rMotivo = exigeMotivo ? validarMotivo(ta ? ta.value : '') : { valor: limpiarTexto(ta ? ta.value : '') };
    const rMedicoStop = stopOrigen==='medico'
      ? validarTextoLibre(medicoInput ? medicoInput.value : '', { etiqueta:'el nombre del médico', minLetras:3, max:60, soloNombre:true })
      : { valor:'' };
    const rClinicaStop = stopOrigen==='medico'
      ? validarTextoLibre(clinicaInput ? clinicaInput.value : '', { etiqueta:'la clínica', minLetras:3, max:80 })
      : { valor:'' };
    if(primerError([
      { id:'medico-stop-input', r:rMedicoStop },
      { id:'clinica-stop-input', r:rClinicaStop },
      { id:'motivo-input', r:rMotivo }
    ])) return;
    const motivoTexto = rMotivo.valor;
    const medicoTexto = rMedicoStop.valor;
    const clinicaTexto = rClinicaStop.valor;
    const m = meds.find(x=>x.id===stoppingMedId);
    if(m){
      const origenBaja = stopOrigen || 'persona';
      const guardadoBaja = await guardarEnNube(async () => {
        m.activo = false;
        m.fechaFin = fechaISOHoy();
        m.motivo = motivoTexto || null;
        m.indicadoPorMedico = stopOrigen==='medico';
        m.indicadoPorReferente = stopOrigen==='referente';
        if(stopOrigen==='medico'){ m.medicoQueModifico = medicoTexto; m.clinicaQueModifico = clinicaTexto; m.referenteQueModifico = null; }
        if(stopOrigen==='referente'){ m.referenteQueModifico = cuentaActual.nombre; m.medicoQueModifico = null; m.clinicaQueModifico = null; }
        await Nube.actualizarMed(cuentaPersonalActiva().id, m, {
          tipo: 'baja', origen: origenBaja,
          medico: medicoTexto || null, clinica: clinicaTexto || null,
          motivo: motivoTexto || null, quienNombre: nombreDeQuienActua()
        });
      });
      if(!guardadoBaja) return;
    }
    stoppingMedId = null;
    stopOrigen = null;
    render();
    showToast('Guardado exitosamente.');
  }
  else if(action==='reactivar'){
    const m = meds.find(x=>x.id===t.dataset.id);
    if(m){
      const guardadoRe = await guardarEnNube(async () => {
        m.activo = true; m.fechaFin = null; m.motivo = null;
        m.indicadoPorMedico = false; m.indicadoPorReferente = false;
        m.medicoQueModifico = null; m.clinicaQueModifico = null; m.referenteQueModifico = null;
        await Nube.actualizarMed(cuentaPersonalActiva().id, m, {
          tipo: 'reactivacion',
          origen: actorEsReferente() ? 'referente' : 'persona',
          quienNombre: nombreDeQuienActua()
        });
      });
      if(!guardadoRe) return;
    }
    render();
    showToast('Lo volvimos a poner en tu lista.');
  }
  else if(action==='leer-dia'){
    toggleLeerDia();
  }
  else if(action==='toggle-tomado'){
    const key = t.dataset.key;
    const marcar = !tomasHoy.marcados.includes(key);
    const personaId = cuentaPersonalActiva().id;
    await guardarEnNube(async () => {
      if(marcar) tomasHoy.marcados.push(key);
      else tomasHoy.marcados.splice(tomasHoy.marcados.indexOf(key), 1);
      render();   // se ve al instante; si el servidor falla, se vuelve atrás solo
      await Nube.marcarToma(personaId, key, marcar);
    });
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
    const rNombre = validarTextoLibre(document.getElementById('input-nombre').value, { etiqueta:'el nombre del remedio', minLetras:2, max:60 });
    const rCategoria = validarTextoLibre(document.getElementById('input-categoria').value, { etiqueta:'para qué es', minLetras:3, max:80 });
    const rMedico = validarTextoLibre(formState.medico, { etiqueta:'el nombre del médico', minLetras:3, max:60, soloNombre:true });
    const rClinica = validarTextoLibre(formState.clinica, { etiqueta:'la clínica', minLetras:3, max:80 });
    const rDosis = validarCantidadDosis(formState.dosisCantidad);
    if(primerError([
      { id:'input-nombre', r:rNombre },
      { id:'input-categoria', r:rCategoria },
      { id:'input-medico', r:rMedico },
      { id:'input-clinica', r:rClinica },
      { id:'input-dosis-cantidad', r:rDosis }
    ])) return;
    if(!formState.hora || !formState.periodo || !formState.frecuencia){
      showToast('Falta elegir a qué hora es la primera toma y cada cuánto se toma.', 6000);
      return;
    }
    const nombre = rNombre.valor, categoria = rCategoria.valor, medico = rMedico.valor, clinica = rClinica.valor;
    const dosisTexto = rDosis.valor ? `${rDosis.valor} ${formState.dosisUnidad}` : '';
    const personaId = cuentaPersonalActiva().id;
    const nuevoMed = {
      id: crypto.randomUUID(),
      nombre, detalle: dosisTexto, categoria,
      medico, clinica,
      horarios: calcularHorarios(formState.hora, formState.periodo, formState.frecuencia),
      frecuenciaHoras: formState.frecuencia,
      fechaInicio: fechaISOHoy(),
      activo:true, fechaFin:null, motivo:null,
      indicadoPorMedico:false, medicoQueModifico:null, clinicaQueModifico:null,
      indicadoPorReferente:false, referenteQueModifico:null,
      foto: formState.foto
    };
    const fotoParaSubir = formState.foto;
    const guardado = await guardarEnNube(async () => {
      await Nube.crearMed(personaId, nuevoMed, fotoParaSubir, {
        origen: actorEsReferente() ? 'referente' : 'persona',
        quienNombre: nombreDeQuienActua(),
        detalle: { nombre, detalle: dosisTexto, medico, clinica }
      });
      meds.push(nuevoMed);
    });
    if(!guardado) return;
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
    const rDosisMod = validarCantidadDosis(formState.dosisCantidad);
    let rMotivoMod = null, rMedicoMod = null, rClinicaMod = null;
    if(esReferente){
      rMotivoMod = validarMotivo(formState.motivoModificacion);
      if(primerError([
        { id:'input-dosis-cantidad', r:rDosisMod },
        { id:'input-motivo-modificacion', r:rMotivoMod }
      ])) return;
    }else{
      rMedicoMod = validarTextoLibre(formState.medicoModificacion, { etiqueta:'el nombre del médico', minLetras:3, max:60, soloNombre:true });
      rClinicaMod = validarTextoLibre(formState.clinicaModificacion, { etiqueta:'la clínica', minLetras:3, max:80 });
      if(primerError([
        { id:'input-dosis-cantidad', r:rDosisMod },
        { id:'input-medico-modificacion', r:rMedicoMod },
        { id:'input-clinica-modificacion', r:rClinicaMod }
      ])) return;
    }
    if(!formState.hora || !formState.periodo || !formState.frecuencia){
      showToast('Falta elegir a qué hora es la primera toma y cada cuánto se toma.', 6000);
      return;
    }
    const antes = { detalle: m.detalle, horarios: m.horarios, frecuenciaHoras: m.frecuenciaHoras };
    const guardadoInd = await guardarEnNube(async () => {
      if(esReferente){
        m.referenteQueModifico = cuentaActual.nombre;
        m.medicoQueModifico = null;
        m.clinicaQueModifico = null;
      }else{
        m.medicoQueModifico = rMedicoMod.valor;
        m.clinicaQueModifico = rClinicaMod.valor;
        m.referenteQueModifico = null;
      }
      m.horarios = calcularHorarios(formState.hora, formState.periodo, formState.frecuencia);
      m.frecuenciaHoras = formState.frecuencia;
      if(rDosisMod.valor){
        m.detalle = `${rDosisMod.valor} ${formState.dosisUnidad}`;
      }
      await Nube.actualizarMed(cuentaPersonalActiva().id, m, {
        tipo: 'edicion',
        origen: esReferente ? 'referente' : 'medico',
        medico: esReferente ? null : rMedicoMod.valor,
        clinica: esReferente ? null : rClinicaMod.valor,
        motivo: esReferente ? rMotivoMod.valor : null,
        quienNombre: nombreDeQuienActua(),
        detalle: { antes, despues: { detalle: m.detalle, horarios: m.horarios, frecuenciaHoras: m.frecuenciaHoras } }
      });
    });
    if(!guardadoInd) return;
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
});

/* Achica la foto antes de subirla. Una foto de celular pesa varios MB: así
   sube rápido (también con datos móviles) y ocupa poco. Queda en ~800 px,
   suficiente para reconocer la caja. */
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
  if(e.target.getAttribute('aria-invalid')) e.target.removeAttribute('aria-invalid');
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
