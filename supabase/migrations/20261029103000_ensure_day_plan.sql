create or replace function public.ensure_day_plan(p_plan_date date)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid;
  v_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select id into v_id
  from public.day_plans
  where user_id = v_user_id and plan_date = p_plan_date;

  if v_id is not null then
    return v_id;
  end if;

  insert into public.day_plans (user_id, plan_date, template_id)
  values (v_user_id, p_plan_date, null)
  on conflict (user_id, plan_date) do nothing
  returning id into v_id;

  if v_id is null then
    select id into v_id
    from public.day_plans
    where user_id = v_user_id and plan_date = p_plan_date;
  end if;

  return v_id;
end;
$$;

grant execute on function public.ensure_day_plan(date) to authenticated;
