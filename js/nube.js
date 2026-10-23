/* ---------------------------------------------------------------
   nube.js — conexión de Acordate con Supabase.

   Acá vive TODO lo que habla con el servidor: registro e ingreso,
   leer y guardar datos, vínculos entre personas y referentes.
   app.js no conoce a Supabase: solo llama a las funciones de "Nube".

   Las funciones que fallan lanzan un Error con un mensaje en español
   (propiedad .message) listo para mostrarle a la persona.
------------------------------------------------------------------ */
const Nube = (() => {
  const cfg = window.ACORDATE_CONFIG || {};
  const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let sb = null;
  let usuario = null;

  function iniciar(){
    if(sb) return true;
    if(!window.supabase || !cfg.url || !cfg.anonKey) return false;
    sb = window.supabase.createClient(cfg.url, cfg.anonKey, {
      // La sesión queda guardada en el dispositivo hasta que la persona cierre sesión.
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return true;
  }
  function usuarioActual(){ return usuario; }
  function tipoRegistrado(){
    const t = usuario && usuario.user_metadata && usuario.user_metadata.tipo;
    return t === 'personal' || t === 'referente' ? t : null;
  }
  function alCambiarAuth(cb){
    sb.auth.onAuthStateChange((evento, sesion) => {
      usuario = sesion ? sesion.user : null;
      cb(evento);
    });
  }

  /* Traduce errores técnicos a mensajes claros. */
  function traducir(error, porDefecto){
    const m = String((error && error.message) || error || '').toLowerCase();
    if(m.includes('invalid login credentials')) return 'El mail o la contraseña no son correctos.';
    if(m.includes('email not confirmed')) return 'Falta confirmar tu mail. Buscá el mensaje que te enviamos y tocá el enlace.';
    if(m.includes('already registered') || m.includes('already been registered')) return 'Ese mail ya tiene una cuenta. Probá con "Ya tengo cuenta".';
    if(m.includes('password should be') || m.includes('weak password')) return 'La contraseña es muy fácil de adivinar. Probá con otra más larga.';
    if(m.includes('rate limit') || m.includes('too many')) return 'Hiciste muchos intentos. Esperá unos minutos y probá de nuevo.';
    if(m.includes('failed to fetch') || m.includes('networkerror') || m.includes('network request failed') || m.includes('load failed')){
      return 'No hay conexión a internet. Revisá tu conexión y probá de nuevo.';
    }
    if(m.includes('schema cache') || m.includes('does not exist') || m.includes('could not find the')){
      return 'La base de datos todavía no está lista: falta ejecutar el archivo SQL en Supabase.';
    }
    if(m.includes('row-level security') || m.includes('permission denied')){
      return 'No tenés permiso para hacer eso con esta cuenta.';
    }
    if(m.includes('jwt') || m.includes('not authenticated')) return 'Tu sesión venció. Ingresá de nuevo.';
    return porDefecto || 'No pudimos completar la acción. Probá de nuevo en un rato.';
  }
  function fallo(error, porDefecto){
    console.error('Acordate/nube:', error);
    const e = new Error(traducir(error, porDefecto));
    e.original = error;
    return e;
  }
  function exigir(resultado, porDefecto){
    if(resultado && resultado.error) throw fallo(resultado.error, porDefecto);
    return resultado ? resultado.data : null;
  }

  function fechaISO(d = new Date()){
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }
  function codigoAlAzar(){
    const bytes = new Uint32Array(6);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => ALFABETO[b % ALFABETO.length]).join('');
  }

  /* ---------- SESIÓN ---------- */
  async function recuperarSesion(){
    try{
      const { data } = await sb.auth.getSession();
      usuario = data && data.session ? data.session.user : null;
    }catch(e){ usuario = null; }
    return usuario;
  }
  async function registrar(email, clave, tipo){
    // El rol (personal o referente) queda guardado en la cuenta: no se vuelve a preguntar.
    const r = await sb.auth.signUp({ email, password: clave, options: { data: { tipo } } });
    if(r.error) throw fallo(r.error, 'No pudimos crear la cuenta.');
    const u = r.data.user;
    // Con la confirmación por mail activada, un mail repetido vuelve sin "identities".
    if(u && Array.isArray(u.identities) && u.identities.length === 0){
      throw fallo('already registered');
    }
    usuario = r.data.session ? r.data.session.user : null;
    return { conSesion: !!r.data.session };
  }
  async function ingresar(email, clave){
    const r = await sb.auth.signInWithPassword({ email, password: clave });
    if(r.error) throw fallo(r.error, 'No pudimos ingresar.');
    usuario = r.data.user;
    return usuario;
  }
  async function salir(){
    try{ await sb.auth.signOut(); }catch(e){ console.error(e); }
    usuario = null;
  }
  async function pedirNuevaClave(email){
    const destino = location.origin + location.pathname;
    const r = await sb.auth.resetPasswordForEmail(email, { redirectTo: destino });
    if(r.error) throw fallo(r.error, 'No pudimos enviar el mail.');
  }
  async function cambiarClave(clave){
    const r = await sb.auth.updateUser({ password: clave });
    if(r.error) throw fallo(r.error, 'No pudimos cambiar la contraseña.');
  }

  /* ---------- PERFIL ---------- */
  async function crearPerfil(tipo, datos){
    if(!usuario) throw fallo('not authenticated');
    const base = {
      id: usuario.id,
      tipo,
      nombre: datos.nombre,
      direccion: datos.direccion || '',
      celular: datos.celular || '',
      celular_emergencia: datos.celularEmergencia || '',
      acepto_el: new Date().toISOString()
    };
    if(tipo !== 'personal'){
      exigir(await sb.from('perfiles').insert(base), 'No pudimos guardar tus datos.');
      return;
    }
    // El código tiene que ser único: si justo coincide con otro, se prueba con uno nuevo.
    for(let intento = 0; intento < 6; intento++){
      const r = await sb.from('perfiles').insert({ ...base, codigo: codigoAlAzar() });
      if(!r.error) return;
      if(r.error.code !== '23505') throw fallo(r.error, 'No pudimos guardar tus datos.');
      if(String(r.error.message).includes('perfiles_pkey')) return; // ya existía el perfil
    }
    throw fallo('codigo', 'No pudimos generar tu código. Probá de nuevo.');
  }
  async function actualizarPerfil(datos){
    const r = await sb.from('perfiles').update({
      nombre: datos.nombre,
      direccion: datos.direccion || '',
      celular: datos.celular || '',
      celular_emergencia: datos.celularEmergencia || ''
    }).eq('id', usuario.id);
    exigir(r, 'No pudimos guardar tus datos.');
  }

  /* ---------- LEER TODO ---------- */
  function armarMed(fila, cambios, fotoUrl){
    // El último cambio dice quién decidió qué (médico, referente o la propia persona).
    const ultimo = cambios.find(c => c.medicamento_id === fila.id);
    const m = {
      id: fila.id,
      nombre: fila.nombre,
      detalle: fila.detalle || '',
      categoria: fila.categoria,
      medico: fila.medico,
      clinica: fila.clinica,
      horarios: Array.isArray(fila.horarios) ? fila.horarios : [],
      frecuenciaHoras: fila.frecuencia_horas,
      fechaInicio: fila.fecha_inicio,
      activo: fila.activo,
      fechaFin: fila.fecha_fin,
      motivo: fila.motivo,
      indicadoPorMedico: false, medicoQueModifico: null, clinicaQueModifico: null,
      indicadoPorReferente: false, referenteQueModifico: null,
      creadoPor: fila.creado_por,
      foto: fotoUrl || null
    };
    if(ultimo && (ultimo.tipo === 'baja' || ultimo.tipo === 'edicion')){
      const nombreQuien = (ultimo.detalle && ultimo.detalle.hecho_por_nombre) || null;
      if(ultimo.origen === 'medico'){
        m.medicoQueModifico = ultimo.medico; m.clinicaQueModifico = ultimo.clinica;
        if(ultimo.tipo === 'baja') m.indicadoPorMedico = true;
      }else if(ultimo.origen === 'referente'){
        m.referenteQueModifico = nombreQuien;
        if(ultimo.tipo === 'baja') m.indicadoPorReferente = true;
      }
    }
    return m;
  }

  /* Devuelve { sinPerfil:true } o { cuentas, yoId }, con las cuentas en la forma que usa la app. */
  async function cargarTodo(){
    if(!usuario) throw fallo('not authenticated');
    const hoy = fechaISO();
    const [perfiles, vinculos, meds, cambios, marcas] = await Promise.all([
      sb.from('perfiles').select('*'),
      sb.from('vinculos').select('*'),
      sb.from('medicamentos').select('*').order('creado_el', { ascending: true }),
      sb.from('cambios').select('*').order('creado_el', { ascending: false }).limit(2000),
      sb.from('marcas').select('persona_id,horario').eq('fecha', hoy)
    ]);
    const P = exigir(perfiles, 'No pudimos leer tus datos.');
    const V = exigir(vinculos, 'No pudimos leer tus datos.');
    const M = exigir(meds, 'No pudimos leer tus datos.');
    const C = exigir(cambios, 'No pudimos leer tus datos.');
    const K = exigir(marcas, 'No pudimos leer tus datos.');

    const yo = P.find(p => p.id === usuario.id);
    if(!yo) return { sinPerfil: true };

    // Fotos: la carpeta es privada, así que se piden enlaces temporales.
    const rutas = M.map(f => f.foto_ruta).filter(Boolean);
    const urlPorRuta = {};
    if(rutas.length){
      try{
        const r = await sb.storage.from('fotos').createSignedUrls(rutas, 60 * 60 * 6);
        (r.data || []).forEach(x => { if(x.signedUrl) urlPorRuta[x.path] = x.signedUrl; });
      }catch(e){ console.error('fotos', e); }
    }

    const porId = {};
    P.forEach(p => { porId[p.id] = p; });
    const aprobadosDeMiReferente = V.filter(v => v.referente_id === yo.id && v.estado === 'aprobado').map(v => v.persona_id);

    const cuentas = [];
    const armarPersona = (p) => {
      const misMeds = M.filter(f => f.persona_id === p.id);
      const cambiosPersona = C.filter(c => c.persona_id === p.id);
      return {
        id: p.id,
        tipo: 'personal',
        codigo: p.codigo,
        perfil: {
          nombre: p.nombre, direccion: p.direccion,
          celular: p.celular, celularEmergencia: p.celular_emergencia
        },
        meds: misMeds.map(f => armarMed(f, cambiosPersona, f.foto_ruta ? urlPorRuta[f.foto_ruta] : null)),
        tomasHoy: {
          fecha: null, // lo completa la app con su clave del día
          marcados: K.filter(k => k.persona_id === p.id).map(k => k.horario)
        },
        // Referentes de esta persona, con su estado (solo se ven los pendientes y aprobados).
        referentes: V.filter(v => v.persona_id === p.id && v.estado !== 'revocado')
          .map(v => {
            const r = porId[v.referente_id];
            return r ? { vinculoId: v.id, id: r.id, nombre: r.nombre, celular: r.celular, estado: v.estado } : null;
          }).filter(Boolean)
      };
    };

    if(yo.tipo === 'personal'){
      cuentas.push(armarPersona(yo));
    }else{
      aprobadosDeMiReferente.forEach(id => { if(porId[id]) cuentas.push(armarPersona(porId[id])); });
      cuentas.push({
        id: yo.id, tipo: 'referente', nombre: yo.nombre, celular: yo.celular,
        vinculados: aprobadosDeMiReferente.filter(id => porId[id]),
        pendientes: V.filter(v => v.referente_id === yo.id && v.estado === 'pendiente').length
      });
    }
    return { cuentas, yoId: yo.id, tipo: yo.tipo };
  }

  /* ---------- REMEDIOS ---------- */
  async function registrarCambio(c){
    const r = await sb.from('cambios').insert({
      medicamento_id: c.medicamentoId,
      persona_id: c.personaId,
      tipo: c.tipo,
      origen: c.origen,
      hecho_por: usuario.id,
      medico: c.medico || null,
      clinica: c.clinica || null,
      motivo: c.motivo || null,
      detalle: { ...(c.detalle || {}), hecho_por_nombre: c.quienNombre || null }
    });
    exigir(r, 'No pudimos guardar el cambio.');
  }

  async function crearMed(personaId, m, fotoDataUrl, cambio){
    let ruta = null;
    if(fotoDataUrl){
      ruta = `${personaId}/${m.id}.jpg`;
      const blob = await (await fetch(fotoDataUrl)).blob();
      const up = await sb.storage.from('fotos').upload(ruta, blob, { contentType: 'image/jpeg', upsert: true });
      if(up.error) throw fallo(up.error, 'No pudimos guardar la foto.');
    }
    exigir(await sb.from('medicamentos').insert({
      id: m.id, persona_id: personaId,
      nombre: m.nombre, detalle: m.detalle || '', categoria: m.categoria,
      medico: m.medico, clinica: m.clinica,
      horarios: m.horarios, frecuencia_horas: m.frecuenciaHoras,
      fecha_inicio: m.fechaInicio, foto_ruta: ruta, creado_por: usuario.id
    }), 'No pudimos guardar el remedio.');
    await registrarCambio({ ...cambio, medicamentoId: m.id, personaId, tipo: 'alta' });
  }

  async function actualizarMed(personaId, m, cambio){
    exigir(await sb.from('medicamentos').update({
      detalle: m.detalle || '',
      horarios: m.horarios,
      frecuencia_horas: m.frecuenciaHoras,
      activo: m.activo,
      fecha_fin: m.fechaFin,
      motivo: m.motivo
    }).eq('id', m.id), 'No pudimos guardar el cambio.');
    await registrarCambio({ ...cambio, medicamentoId: m.id, personaId });
  }

  async function marcarToma(personaId, horario, marcado){
    const fecha = fechaISO();
    if(marcado){
      const r = await sb.from('marcas').upsert(
        { persona_id: personaId, fecha, horario, marcada_por: usuario.id },
        { onConflict: 'persona_id,fecha,horario', ignoreDuplicates: true }
      );
      exigir(r, 'No pudimos guardar que ya tomaste.');
    }else{
      const r = await sb.from('marcas').delete()
        .eq('persona_id', personaId).eq('fecha', fecha).eq('horario', horario);
      exigir(r, 'No pudimos guardar el cambio.');
    }
  }

  /* ---------- VÍNCULOS ---------- */
  async function solicitarVinculo(codigo){
    const r = await sb.rpc('solicitar_vinculo', { p_codigo: codigo });
    return exigir(r, 'No pudimos enviar la solicitud.'); // 'no_encontrado' | 'pendiente' | 'aprobado'
  }
  async function responderVinculo(vinculoId, aprobar){
    exigir(await sb.rpc('responder_vinculo', { p_vinculo: vinculoId, p_aprobar: aprobar }), 'No pudimos guardar tu respuesta.');
  }

  return {
    iniciar, usuarioActual, tipoRegistrado, alCambiarAuth, recuperarSesion,
    registrar, ingresar, salir, pedirNuevaClave, cambiarClave,
    crearPerfil, actualizarPerfil, cargarTodo,
    crearMed, actualizarMed, marcarToma,
    solicitarVinculo, responderVinculo,
    fechaISO, traducir
  };
})();
