create type "public"."color_mode_type" as enum ('light', 'dark');

create type "public"."language_type" as enum ('fr-FR', 'en-US');

alter table "public"."profiles" add column "color_mode" color_mode_type not null default 'light'::color_mode_type;

alter table "public"."profiles" add column "language" language_type not null default 'fr-FR'::language_type;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
  insert into public.profiles (id, username, first_name, last_name, avatar_url, email, language, color_mode)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url',
    new.email,
    new.raw_user_meta_data->>'language',
    new.raw_user_meta_data->>'color_mode'
  );
  return new;
end;$function$
;
