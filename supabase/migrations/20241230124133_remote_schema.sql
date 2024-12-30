create type "public"."language_type" as enum ('fr', 'en');

alter table "public"."profiles" add column "language" language_type not null default 'fr'::language_type;
