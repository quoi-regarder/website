

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."color_mode_type" AS ENUM (
    'light',
    'dark',
    'system'
);


ALTER TYPE "public"."color_mode_type" OWNER TO "supabase_admin";


CREATE TYPE "public"."language_iso_type" AS ENUM (
    'fr-FR',
    'en-US'
);


ALTER TYPE "public"."language_iso_type" OWNER TO "supabase_admin";


CREATE TYPE "public"."movie_list_status" AS ENUM (
    'recommended',
    'to_watch',
    'watched'
);


ALTER TYPE "public"."movie_list_status" OWNER TO "supabase_admin";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."movie_translations" (
    "tmdb_id" bigint NOT NULL,
    "language" "public"."language_iso_type" NOT NULL,
    "title" "text" NOT NULL,
    "overview" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."movie_translations" OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."fetch_and_store_translation"("p_tmdb_id" integer, "p_language" "text") RETURNS "public"."movie_translations"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    v_api_key TEXT;
    v_url TEXT;
    v_response JSONB;
    v_translation movie_translations;
BEGIN
    v_api_key := get_tmdb_api_key();

    v_url := 'https://api.themoviedb.org/3/movie/' || p_tmdb_id::TEXT || 
        '?api_key=' || v_api_key || 
        '&language=' || p_language;
    
    SELECT content::jsonb INTO v_response
    FROM extensions.http_get(v_url);

    INSERT INTO movie_translations (tmdb_id, language, title, overview)
    VALUES (
        p_tmdb_id::BIGINT,
        p_language::language_iso_type,
        v_response->>'title',
        v_response->>'overview'
    )
    RETURNING * INTO v_translation;
    
    RETURN v_translation;

EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'Error in fetch_and_store_translation: %', SQLERRM;
END;$$;


ALTER FUNCTION "public"."fetch_and_store_translation"("p_tmdb_id" integer, "p_language" "text") OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."get_movie_data"("p_tmdb_id" integer) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    v_api_key TEXT;
    v_url TEXT;
    v_response JSONB;
BEGIN
    v_api_key := get_tmdb_api_key();

    v_url := 'https://api.themoviedb.org/3/movie/' || p_tmdb_id::TEXT || 
        '?api_key=' || v_api_key || 
        '&language=en-US';
    SELECT content::jsonb INTO v_response
    FROM extensions.http_get(v_url);
    RETURN v_response;
END;$$;


ALTER FUNCTION "public"."get_movie_data"("p_tmdb_id" integer) OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."get_tmdb_api_key"() RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    RETURN (
        SELECT decrypted_secret 
        FROM vault.decrypted_secrets 
        WHERE name = 'tmdb_api_key'
    );
END;$$;


ALTER FUNCTION "public"."get_tmdb_api_key"() OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$begin
  insert into public.profiles (id, username, first_name, last_name, avatar_url, email, language, color_mode)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url',
    new.email,
    coalesce((new.raw_user_meta_data->>'language'), 'fr-FR')::public.language_type,
    coalesce((new.raw_user_meta_data->>'color_mode'), 'system')::public.color_mode_type
  );
  return new;
end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_missing_translations"("p_tmdb_ids" bigint[], "p_language" "public"."language_iso_type") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_tmdb_id BIGINT;
BEGIN
    FOR v_tmdb_id IN
        SELECT DISTINCT unnest(p_tmdb_ids)
        WHERE NOT EXISTS (
            SELECT 1 FROM movie_translations mt 
            WHERE mt.tmdb_id = unnest(p_tmdb_ids)
            AND mt.language = p_language
        )
    LOOP
        PERFORM fetch_and_store_translation(v_tmdb_id::INTEGER, p_language::TEXT);
    END LOOP;
END;
$$;


ALTER FUNCTION "public"."sync_missing_translations"("p_tmdb_ids" bigint[], "p_language" "public"."language_iso_type") OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."sync_movie_from_tmdb"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    v_movie_data JSONB;
    v_lang language_iso_type;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM movies WHERE tmdb_id = NEW.tmdb_id) THEN
        v_movie_data := get_movie_data(NEW.tmdb_id::INTEGER);
        
        INSERT INTO movies (tmdb_id, release_date, poster_path, runtime)
        VALUES (
            NEW.tmdb_id,
            (v_movie_data->>'release_date')::DATE,
            v_movie_data->>'poster_path',
            (v_movie_data->>'runtime')::INTEGER
        );

        FOR v_lang IN 
            SELECT unnest(enum_range(NULL::language_iso_type))
        LOOP
            PERFORM fetch_and_store_translation(NEW.tmdb_id::INTEGER, v_lang::TEXT);
        END LOOP;
    END IF;

    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."sync_movie_from_tmdb"() OWNER TO "supabase_admin";


ALTER TABLE "public"."movie_translations" ALTER COLUMN "tmdb_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."movie_translations_tmdb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."movies" (
    "tmdb_id" bigint NOT NULL,
    "release_date" "date",
    "poster_path" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "runtime" bigint
);


ALTER TABLE "public"."movies" OWNER TO "supabase_admin";


ALTER TABLE "public"."movies" ALTER COLUMN "tmdb_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."movies_tmdb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "updated_at" timestamp with time zone,
    "color_mode" "public"."color_mode_type" DEFAULT 'light'::"public"."color_mode_type" NOT NULL,
    "language" "public"."language_iso_type" DEFAULT 'fr-FR'::"public"."language_iso_type" NOT NULL,
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_movie_lists" (
    "user_id" "uuid" NOT NULL,
    "tmdb_id" bigint NOT NULL,
    "status" "public"."movie_list_status" DEFAULT 'to_watch'::"public"."movie_list_status" NOT NULL,
    "added_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_movie_lists" OWNER TO "supabase_admin";


ALTER TABLE ONLY "public"."movie_translations"
    ADD CONSTRAINT "movie_translations_pkey" PRIMARY KEY ("tmdb_id", "language");



ALTER TABLE ONLY "public"."movies"
    ADD CONSTRAINT "movies_pkey" PRIMARY KEY ("tmdb_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."user_movie_lists"
    ADD CONSTRAINT "user_movie_lists_pkey" PRIMARY KEY ("user_id", "tmdb_id");



CREATE OR REPLACE TRIGGER "before_movie_list_insert" BEFORE INSERT ON "public"."user_movie_lists" FOR EACH ROW EXECUTE FUNCTION "public"."sync_movie_from_tmdb"();



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');



ALTER TABLE ONLY "public"."movie_translations"
    ADD CONSTRAINT "movie_translations_tmdb_id_fkey" FOREIGN KEY ("tmdb_id") REFERENCES "public"."movies"("tmdb_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_movie_lists"
    ADD CONSTRAINT "user_movie_lists_tmdb_id_fkey" FOREIGN KEY ("tmdb_id") REFERENCES "public"."movies"("tmdb_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_movie_lists"
    ADD CONSTRAINT "user_movie_lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Enable delete for users based on user_id" ON "public"."user_movie_lists" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."user_movie_lists" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all authenticated users" ON "public"."movies" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."movie_translations" FOR SELECT USING (true);



CREATE POLICY "Enable select for users based on user_id" ON "public"."user_movie_lists" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable update for users based on user_id" ON "public"."user_movie_lists" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



ALTER TABLE "public"."movie_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."movies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_movie_lists" ENABLE ROW LEVEL SECURITY;


CREATE PUBLICATION "realtime_messages_publication_" WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION "realtime_messages_publication_" OWNER TO "supabase_admin";




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."profiles";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."user_movie_lists";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































































































































GRANT ALL ON TABLE "public"."movie_translations" TO "postgres";
GRANT ALL ON TABLE "public"."movie_translations" TO "anon";
GRANT ALL ON TABLE "public"."movie_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."movie_translations" TO "service_role";



GRANT ALL ON FUNCTION "public"."fetch_and_store_translation"("p_tmdb_id" integer, "p_language" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."fetch_and_store_translation"("p_tmdb_id" integer, "p_language" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."fetch_and_store_translation"("p_tmdb_id" integer, "p_language" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fetch_and_store_translation"("p_tmdb_id" integer, "p_language" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_movie_data"("p_tmdb_id" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."get_movie_data"("p_tmdb_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_movie_data"("p_tmdb_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_movie_data"("p_tmdb_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_tmdb_api_key"() TO "postgres";
GRANT ALL ON FUNCTION "public"."get_tmdb_api_key"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_tmdb_api_key"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_tmdb_api_key"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_missing_translations"("p_tmdb_ids" bigint[], "p_language" "public"."language_iso_type") TO "postgres";
GRANT ALL ON FUNCTION "public"."sync_missing_translations"("p_tmdb_ids" bigint[], "p_language" "public"."language_iso_type") TO "anon";
GRANT ALL ON FUNCTION "public"."sync_missing_translations"("p_tmdb_ids" bigint[], "p_language" "public"."language_iso_type") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_missing_translations"("p_tmdb_ids" bigint[], "p_language" "public"."language_iso_type") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_movie_from_tmdb"() TO "postgres";
GRANT ALL ON FUNCTION "public"."sync_movie_from_tmdb"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_movie_from_tmdb"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_movie_from_tmdb"() TO "service_role";


















GRANT ALL ON SEQUENCE "public"."movie_translations_tmdb_id_seq" TO "postgres";
GRANT ALL ON SEQUENCE "public"."movie_translations_tmdb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."movie_translations_tmdb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."movie_translations_tmdb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."movies" TO "postgres";
GRANT ALL ON TABLE "public"."movies" TO "anon";
GRANT ALL ON TABLE "public"."movies" TO "authenticated";
GRANT ALL ON TABLE "public"."movies" TO "service_role";



GRANT ALL ON SEQUENCE "public"."movies_tmdb_id_seq" TO "postgres";
GRANT ALL ON SEQUENCE "public"."movies_tmdb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."movies_tmdb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."movies_tmdb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."user_movie_lists" TO "postgres";
GRANT ALL ON TABLE "public"."user_movie_lists" TO "anon";
GRANT ALL ON TABLE "public"."user_movie_lists" TO "authenticated";
GRANT ALL ON TABLE "public"."user_movie_lists" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
