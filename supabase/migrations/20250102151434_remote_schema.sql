alter table "public"."profiles" alter column "color_mode" drop default;

alter type "public"."color_mode_type" rename to "color_mode_type__old_version_to_be_dropped";

create type "public"."color_mode_type" as enum ('light', 'dark', 'system');

alter table "public"."profiles" alter column color_mode type "public"."color_mode_type" using color_mode::text::"public"."color_mode_type";

alter table "public"."profiles" alter column "color_mode" set default 'light'::color_mode_type;

drop type "public"."color_mode_type__old_version_to_be_dropped";

alter table "public"."profiles" alter column "language" set default 'en-US'::language_type;

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
    coalesce((new.raw_user_meta_data->>'language'), 'en-US')::public.language_type,
    coalesce((new.raw_user_meta_data->>'color_mode'), 'system')::public.color_mode_type
  );
  return new;
end;$function$
;
