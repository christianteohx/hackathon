alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;

create policy "users_select_own"
on public.users
for select
to authenticated
using (auth.uid() = id);

create policy "users_insert_own"
on public.users
for insert
to authenticated
with check (auth.uid() = id);

create policy "users_update_own"
on public.users
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "projects_select_member"
on public.projects
for select
to authenticated
using (
  exists (
    select 1
    from public.project_members
    where project_members.project_id = projects.id
      and project_members.user_id = auth.uid()
  )
);

create policy "projects_insert_creator"
on public.projects
for insert
to authenticated
with check (created_by_user_id = auth.uid());

create policy "projects_update_owner"
on public.projects
for update
to authenticated
using (
  exists (
    select 1
    from public.project_members
    where project_members.project_id = projects.id
      and project_members.user_id = auth.uid()
      and project_members.role = 'owner'
  )
)
with check (
  exists (
    select 1
    from public.project_members
    where project_members.project_id = projects.id
      and project_members.user_id = auth.uid()
      and project_members.role = 'owner'
  )
);

create policy "projects_delete_creator"
on public.projects
for delete
to authenticated
using (created_by_user_id = auth.uid());

create policy "project_members_select_own"
on public.project_members
for select
to authenticated
using (user_id = auth.uid());

create policy "project_members_insert_self"
on public.project_members
for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    (
      role = 'owner'
      and exists (
        select 1
        from public.projects
        where projects.id = project_members.project_id
          and projects.created_by_user_id = auth.uid()
      )
    )
    or role = 'member'
  )
);

create policy "project_members_delete_own"
on public.project_members
for delete
to authenticated
using (user_id = auth.uid());
