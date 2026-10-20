-- =====================================================================
-- Acordate — esquema de base de datos (Supabase / PostgreSQL)
--
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar todo → Run.
-- Se puede correr de nuevo sin romper nada (usa "if not exists" / "or replace").
--
-- Idea de seguridad: cada tabla tiene RLS (seguridad por fila) activada.
-- Una persona solo ve lo suyo; un referente solo ve a las personas que
-- le APROBARON el vínculo; nadie ve el resto. Esto lo hace la base de datos,
-- no la app, así que no depende de que el código del navegador sea correcto.
-- =====================================================================

-- ---------- TABLAS ----------

create table if not exists perfiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  tipo              text not null check (tipo in ('personal','referente')),
  nombre            text not null check (char_length(nombre) between 2 and 60),
  direccion         text not null default '' check (char_length(direccion) <= 120),
  celular           text not null default '' check (char_length(celular) <= 30),
  celular_emergencia text not null default '' check (char_length(celular_emergencia) <= 30),
  codigo            text unique check (codigo ~ '^[A-HJ-NP-Z2-9]{6}$'),  -- solo cuentas personales
  creado_el         timestamptz not null default now(),
  check ((tipo = 'personal') = (codigo is not null))
);

create table if not exists vinculos (
  id           uuid primary key default gen_random_uuid(),
  persona_id   uuid not null references perfiles(id) on delete cascade,
  referente_id uuid not null references perfiles(id) on delete cascade,
  estado       text not null default 'pendiente' check (estado in ('pendiente','aprobado','revocado')),
  creado_el    timestamptz not null default now(),
  respondido_el timestamptz,
  unique (persona_id, referente_id),
  check (persona_id <> referente_id)
);

create table if not exists medicamentos (
  id              uuid primary key default gen_random_uuid(),
  persona_id      uuid not null references perfiles(id) on delete cascade,
  nombre          text not null check (char_length(nombre) between 2 and 60),
  detalle         text not null default '' check (char_length(detalle) <= 40),   -- ej: "2 comprimidos"
  categoria       text not null check (char_length(categoria) between 3 and 80),  -- "para qué es"
  medico          text not null check (char_length(medico) between 3 and 60),
  clinica         text not null check (char_length(clinica) between 3 and 80),
  horarios        jsonb not null default '[]',
  frecuencia_horas int check (frecuencia_horas in (4,6,8,12,24)),
  fecha_inicio    date not null default current_date,
  activo          boolean not null default true,
  fecha_fin       date,
  motivo          text check (char_length(motivo) <= 500),
  foto_ruta       text,                       -- ruta en Storage, no la imagen
  creado_por      uuid not null references perfiles(id),
  creado_el       timestamptz not null default now()
);
create index if not exists medicamentos_persona_idx on medicamentos(persona_id);

-- Historial de decisiones: quién cambió qué y por qué. Solo se agrega, no se edita.
create table if not exists cambios (
  id             uuid primary key default gen_random_uuid(),
  medicamento_id uuid not null references medicamentos(id) on delete cascade,
  persona_id     uuid not null references perfiles(id) on delete cascade,
  tipo           text not null check (tipo in ('alta','edicion','baja','reactivacion')),
  origen         text not null check (origen in ('persona','medico','referente')),
  hecho_por      uuid not null references perfiles(id),
  medico         text,
  clinica        text,
  motivo         text check (char_length(motivo) <= 500),
  detalle        jsonb not null default '{}',   -- valores anteriores y nuevos
  creado_el      timestamptz not null default now()
);
create index if not exists cambios_persona_idx on cambios(persona_id, creado_el desc);

-- Marcas de "Ya tomé": una por horario y por día (ej: "manana-8").
-- (Reemplaza a una tabla "tomas" de una versión anterior, que nunca se usó.)
drop table if exists tomas;
create table if not exists marcas (
  id          uuid primary key default gen_random_uuid(),
  persona_id  uuid not null references perfiles(id) on delete cascade,
  fecha       date not null,
  horario     text not null check (horario ~ '^(manana|tarde|noche)-[0-9]{1,2}$'),
  marcada_el  timestamptz not null default now(),
  marcada_por uuid not null references perfiles(id),
  unique (persona_id, fecha, horario)
);

-- Cuándo la persona aceptó que sus datos de salud se guarden en la nube.
alter table perfiles add column if not exists acepto_el timestamptz;

-- ---------- FUNCIONES DE AYUDA ----------

-- ¿El usuario actual puede ver/gestionar a esta persona?
-- Sí si es ella misma, o si es un referente con vínculo aprobado.
create or replace function puede_gestionar(p_persona uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select auth.uid() = p_persona
      or exists (
        select 1 from vinculos v
        where v.persona_id = p_persona
          and v.referente_id = auth.uid()
          and v.estado = 'aprobado'
      );
$$;

-- El referente pide vincularse con un código. Crea una solicitud PENDIENTE:
-- no ve nada hasta que la persona la apruebe.
create or replace function solicitar_vinculo(p_codigo text)
returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_persona uuid;
  v_tipo text;
begin
  select tipo into v_tipo from perfiles where id = auth.uid();
  if v_tipo is distinct from 'referente' then
    raise exception 'Solo una cuenta referente puede vincularse a otra persona';
  end if;

  select id into v_persona from perfiles
   where tipo = 'personal' and codigo = upper(trim(p_codigo));
  if v_persona is null then
    return 'no_encontrado';
  end if;

  insert into vinculos (persona_id, referente_id, estado)
  values (v_persona, auth.uid(), 'pendiente')
  on conflict (persona_id, referente_id) do update
    set estado = case when vinculos.estado = 'aprobado' then 'aprobado' else 'pendiente' end,
        respondido_el = null
  returning estado into v_tipo;
  return v_tipo;   -- 'pendiente' o 'aprobado'
end;
$$;

-- La persona aprueba, rechaza o revoca un vínculo.
create or replace function responder_vinculo(p_vinculo uuid, p_aprobar boolean)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  update vinculos
     set estado = case when p_aprobar then 'aprobado' else 'revocado' end,
         respondido_el = now()
   where id = p_vinculo and persona_id = auth.uid();
  if not found then
    raise exception 'No existe ese vínculo';
  end if;
end;
$$;

-- El referente ve el nombre de quien pide vincularse / de a quién acompaña
-- sin tener acceso a todo su perfil: ver políticas de "perfiles" más abajo.

-- ---------- SEGURIDAD POR FILA (RLS) ----------

alter table perfiles     enable row level security;
alter table vinculos     enable row level security;
alter table medicamentos enable row level security;
alter table cambios      enable row level security;
alter table marcas       enable row level security;

-- perfiles
drop policy if exists perfiles_ver on perfiles;
create policy perfiles_ver on perfiles for select
  using (
    id = auth.uid()
    or puede_gestionar(id)                                -- referente ve a su persona aprobada
    or exists (select 1 from vinculos v                    -- persona ve a quien le pide vincularse
               where v.persona_id = auth.uid() and v.referente_id = perfiles.id
                 and v.estado in ('pendiente','aprobado'))
  );

drop policy if exists perfiles_crear on perfiles;
create policy perfiles_crear on perfiles for insert
  with check (id = auth.uid());

drop policy if exists perfiles_editar on perfiles;
create policy perfiles_editar on perfiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- vinculos: se ven los propios (como persona o como referente).
-- Se crean y cambian SOLO con las funciones de arriba.
drop policy if exists vinculos_ver on vinculos;
create policy vinculos_ver on vinculos for select
  using (persona_id = auth.uid() or referente_id = auth.uid());

-- medicamentos
drop policy if exists meds_ver on medicamentos;
create policy meds_ver on medicamentos for select using (puede_gestionar(persona_id));
drop policy if exists meds_crear on medicamentos;
create policy meds_crear on medicamentos for insert
  with check (puede_gestionar(persona_id) and creado_por = auth.uid());
drop policy if exists meds_editar on medicamentos;
create policy meds_editar on medicamentos for update
  using (puede_gestionar(persona_id)) with check (puede_gestionar(persona_id));
-- Sin política de borrado: los remedios no se borran, se pasan a "ya no lo tomo".

-- cambios: se pueden leer y agregar, nunca modificar ni borrar.
drop policy if exists cambios_ver on cambios;
create policy cambios_ver on cambios for select using (puede_gestionar(persona_id));
drop policy if exists cambios_crear on cambios;
create policy cambios_crear on cambios for insert
  with check (puede_gestionar(persona_id) and hecho_por = auth.uid());

-- marcas
drop policy if exists marcas_ver on marcas;
create policy marcas_ver on marcas for select using (puede_gestionar(persona_id));
drop policy if exists marcas_crear on marcas;
create policy marcas_crear on marcas for insert
  with check (puede_gestionar(persona_id) and marcada_por = auth.uid());
drop policy if exists marcas_borrar on marcas;             -- para destildar "Ya tomé"
create policy marcas_borrar on marcas for delete using (puede_gestionar(persona_id));

-- ---------- FOTOS (Storage) ----------
-- Bucket privado. Cada foto se guarda en una carpeta con el id de la persona:
--   fotos/<persona_id>/<archivo>.jpg
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', false)
on conflict (id) do nothing;

drop policy if exists fotos_ver on storage.objects;
create policy fotos_ver on storage.objects for select
  using (bucket_id = 'fotos' and puede_gestionar(((storage.foldername(name))[1])::uuid));
drop policy if exists fotos_subir on storage.objects;
create policy fotos_subir on storage.objects for insert
  with check (bucket_id = 'fotos' and puede_gestionar(((storage.foldername(name))[1])::uuid));
drop policy if exists fotos_borrar on storage.objects;
create policy fotos_borrar on storage.objects for delete
  using (bucket_id = 'fotos' and puede_gestionar(((storage.foldername(name))[1])::uuid));
