--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-04-23 11:50:16

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 244 (class 1259 OID 17011)
-- Name: aiaccuracylogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aiaccuracylogs (
    log_id integer NOT NULL,
    category character varying(255) NOT NULL,
    accuracy_score numeric(5,2),
    issue_detail text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.aiaccuracylogs OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 17010)
-- Name: aiaccuracylogs_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.aiaccuracylogs_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.aiaccuracylogs_log_id_seq OWNER TO postgres;

--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 243
-- Name: aiaccuracylogs_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.aiaccuracylogs_log_id_seq OWNED BY public.aiaccuracylogs.log_id;


--
-- TOC entry 234 (class 1259 OID 16923)
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    application_id integer NOT NULL,
    job_id integer,
    jobseeker_id integer,
    status character varying(20) NOT NULL,
    applied_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    match_score numeric(5,2),
    notes text,
    CONSTRAINT applications_status_check CHECK (((status)::text = ANY ((ARRAY['applied'::character varying, 'reviewed'::character varying, 'interviewed'::character varying, 'rejected'::character varying, 'hired'::character varying])::text[])))
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16922)
-- Name: applications_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_application_id_seq OWNER TO postgres;

--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 233
-- Name: applications_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_application_id_seq OWNED BY public.applications.application_id;


--
-- TOC entry 236 (class 1259 OID 16944)
-- Name: assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessments (
    assessment_id integer NOT NULL,
    user_id integer,
    assessment_type character varying(255) NOT NULL,
    score integer,
    completed_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    validity_period integer,
    CONSTRAINT assessments_validity_period_check CHECK ((validity_period >= 0))
);


ALTER TABLE public.assessments OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16943)
-- Name: assessments_assessment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assessments_assessment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assessments_assessment_id_seq OWNER TO postgres;

--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 235
-- Name: assessments_assessment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assessments_assessment_id_seq OWNED BY public.assessments.assessment_id;


--
-- TOC entry 218 (class 1259 OID 16798)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    company_id integer NOT NULL,
    company_name character varying(255) NOT NULL,
    location character varying(255),
    industry character varying(255),
    description text,
    logo bytea
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16797)
-- Name: companies_company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_company_id_seq OWNER TO postgres;

--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 217
-- Name: companies_company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_company_id_seq OWNED BY public.companies.company_id;


--
-- TOC entry 248 (class 1259 OID 17046)
-- Name: historicalmetrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historicalmetrics (
    id integer NOT NULL,
    metric_name character varying(255) NOT NULL,
    value integer NOT NULL,
    recorded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.historicalmetrics OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 17045)
-- Name: historicalmetrics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historicalmetrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historicalmetrics_id_seq OWNER TO postgres;

--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 247
-- Name: historicalmetrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historicalmetrics_id_seq OWNED BY public.historicalmetrics.id;


--
-- TOC entry 230 (class 1259 OID 16883)
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    job_id integer NOT NULL,
    company_id integer,
    recruiter_id integer,
    title character varying(255) NOT NULL,
    description text,
    location character varying(255),
    remote_option boolean,
    employment_type character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) NOT NULL,
    CONSTRAINT jobs_employment_type_check CHECK (((employment_type)::text = ANY ((ARRAY['full-time'::character varying, 'contract'::character varying, 'part-time'::character varying, 'internship'::character varying])::text[]))),
    CONSTRAINT jobs_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'filled'::character varying, 'closed'::character varying])::text[])))
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16882)
-- Name: jobs_job_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_job_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_job_id_seq OWNER TO postgres;

--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 229
-- Name: jobs_job_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_job_id_seq OWNED BY public.jobs.job_id;


--
-- TOC entry 246 (class 1259 OID 17022)
-- Name: jobseeker_employment_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobseeker_employment_preferences (
    preference_id integer NOT NULL,
    jobseeker_id integer,
    employment_type character varying(50),
    CONSTRAINT jobseeker_employment_preferences_employment_type_check CHECK (((employment_type)::text = ANY ((ARRAY['full-time'::character varying, 'contract'::character varying, 'part-time'::character varying, 'internship'::character varying])::text[])))
);


ALTER TABLE public.jobseeker_employment_preferences OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 17021)
-- Name: jobseeker_employment_preferences_preference_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobseeker_employment_preferences_preference_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobseeker_employment_preferences_preference_id_seq OWNER TO postgres;

--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 245
-- Name: jobseeker_employment_preferences_preference_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobseeker_employment_preferences_preference_id_seq OWNED BY public.jobseeker_employment_preferences.preference_id;


--
-- TOC entry 222 (class 1259 OID 16821)
-- Name: jobseekers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobseekers (
    jobseeker_id integer NOT NULL,
    user_id integer,
    resume_document bytea,
    headline character varying(255),
    current_company character varying(255),
    years_experience integer,
    remote_preference boolean,
    profile_picture bytea,
    preferred_location character varying(255),
    onboarding_complete boolean DEFAULT false
);


ALTER TABLE public.jobseekers OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16820)
-- Name: jobseekers_jobseeker_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobseekers_jobseeker_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobseekers_jobseeker_id_seq OWNER TO postgres;

--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 221
-- Name: jobseekers_jobseeker_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobseekers_jobseeker_id_seq OWNED BY public.jobseekers.jobseeker_id;


--
-- TOC entry 232 (class 1259 OID 16905)
-- Name: jobskills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobskills (
    job_skill_id integer NOT NULL,
    job_id integer,
    skill_id integer,
    importance_level integer,
    CONSTRAINT jobskills_importance_level_check CHECK (((importance_level >= 1) AND (importance_level <= 5)))
);


ALTER TABLE public.jobskills OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16904)
-- Name: jobskills_job_skill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobskills_job_skill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobskills_job_skill_id_seq OWNER TO postgres;

--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 231
-- Name: jobskills_job_skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobskills_job_skill_id_seq OWNED BY public.jobskills.job_skill_id;


--
-- TOC entry 238 (class 1259 OID 16958)
-- Name: matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matches (
    match_id integer NOT NULL,
    job_id integer,
    jobseeker_id integer,
    match_score numeric(5,2),
    generated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20),
    CONSTRAINT matches_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'contacted'::character varying, 'responded'::character varying])::text[])))
);


ALTER TABLE public.matches OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16957)
-- Name: matches_match_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.matches_match_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matches_match_id_seq OWNER TO postgres;

--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 237
-- Name: matches_match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.matches_match_id_seq OWNED BY public.matches.match_id;


--
-- TOC entry 240 (class 1259 OID 16977)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    message_id integer NOT NULL,
    sender_id integer,
    receiver_id integer,
    related_job_id integer,
    content text NOT NULL,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    read_status boolean DEFAULT false
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16976)
-- Name: messages_message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_message_id_seq OWNER TO postgres;

--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 239
-- Name: messages_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_message_id_seq OWNED BY public.messages.message_id;


--
-- TOC entry 252 (class 1259 OID 17087)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type character varying(50) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    related_user_id integer NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 17084)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 249
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 251 (class 1259 OID 17086)
-- Name: notifications_related_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_related_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_related_user_id_seq OWNER TO postgres;

--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 251
-- Name: notifications_related_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_related_user_id_seq OWNED BY public.notifications.related_user_id;


--
-- TOC entry 250 (class 1259 OID 17085)
-- Name: notifications_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_user_id_seq OWNER TO postgres;

--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 250
-- Name: notifications_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_user_id_seq OWNED BY public.notifications.user_id;


--
-- TOC entry 224 (class 1259 OID 16835)
-- Name: recruiters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recruiters (
    recruiter_id integer NOT NULL,
    user_id integer,
    company_id integer,
    "position" character varying(255)
);


ALTER TABLE public.recruiters OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16834)
-- Name: recruiters_recruiter_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recruiters_recruiter_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recruiters_recruiter_id_seq OWNER TO postgres;

--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 223
-- Name: recruiters_recruiter_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recruiters_recruiter_id_seq OWNED BY public.recruiters.recruiter_id;


--
-- TOC entry 256 (class 1259 OID 17118)
-- Name: server_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.server_status (
    id integer NOT NULL,
    name text NOT NULL,
    status text NOT NULL,
    uptime interval NOT NULL,
    load real NOT NULL
);


ALTER TABLE public.server_status OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 17117)
-- Name: server_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.server_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.server_status_id_seq OWNER TO postgres;

--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 255
-- Name: server_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.server_status_id_seq OWNED BY public.server_status.id;


--
-- TOC entry 226 (class 1259 OID 16852)
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    skill_id integer NOT NULL,
    skill_name character varying(255) NOT NULL,
    category character varying(50),
    description text,
    CONSTRAINT skills_category_check CHECK (((category)::text = ANY ((ARRAY['technical'::character varying, 'soft'::character varying, 'other'::character varying])::text[])))
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16851)
-- Name: skills_skill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skills_skill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_skill_id_seq OWNER TO postgres;

--
-- TOC entry 5110 (class 0 OID 0)
-- Dependencies: 225
-- Name: skills_skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skills_skill_id_seq OWNED BY public.skills.skill_id;


--
-- TOC entry 254 (class 1259 OID 17110)
-- Name: system_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_metrics (
    id integer NOT NULL,
    cpu_usage real NOT NULL,
    memory_usage real NOT NULL,
    disk_usage real NOT NULL,
    response_time real NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.system_metrics OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 17109)
-- Name: system_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_metrics_id_seq OWNER TO postgres;

--
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 253
-- Name: system_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_metrics_id_seq OWNED BY public.system_metrics.id;


--
-- TOC entry 242 (class 1259 OID 17003)
-- Name: systemmetrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.systemmetrics (
    metric_id integer NOT NULL,
    metric_name character varying(255) NOT NULL,
    value numeric(8,2) NOT NULL,
    recorded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.systemmetrics OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 17002)
-- Name: systemmetrics_metric_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.systemmetrics_metric_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.systemmetrics_metric_id_seq OWNER TO postgres;

--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 241
-- Name: systemmetrics_metric_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.systemmetrics_metric_id_seq OWNED BY public.systemmetrics.metric_id;


--
-- TOC entry 220 (class 1259 OID 16807)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    user_type character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp without time zone,
    CONSTRAINT users_user_type_check CHECK (((user_type)::text = ANY ((ARRAY['job_seeker'::character varying, 'recruiter'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16806)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 228 (class 1259 OID 16864)
-- Name: userskills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userskills (
    user_skill_id integer NOT NULL,
    user_id integer,
    skill_id integer,
    proficiency_score integer,
    verified boolean DEFAULT false,
    assessment_date timestamp without time zone,
    CONSTRAINT userskills_proficiency_score_check CHECK (((proficiency_score >= 0) AND (proficiency_score <= 100)))
);


ALTER TABLE public.userskills OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16863)
-- Name: userskills_user_skill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.userskills_user_skill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.userskills_user_skill_id_seq OWNER TO postgres;

--
-- TOC entry 5114 (class 0 OID 0)
-- Dependencies: 227
-- Name: userskills_user_skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.userskills_user_skill_id_seq OWNED BY public.userskills.user_skill_id;


--
-- TOC entry 4812 (class 2604 OID 17014)
-- Name: aiaccuracylogs log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aiaccuracylogs ALTER COLUMN log_id SET DEFAULT nextval('public.aiaccuracylogs_log_id_seq'::regclass);


--
-- TOC entry 4801 (class 2604 OID 16926)
-- Name: applications application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN application_id SET DEFAULT nextval('public.applications_application_id_seq'::regclass);


--
-- TOC entry 4803 (class 2604 OID 16947)
-- Name: assessments assessment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments ALTER COLUMN assessment_id SET DEFAULT nextval('public.assessments_assessment_id_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 16801)
-- Name: companies company_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN company_id SET DEFAULT nextval('public.companies_company_id_seq'::regclass);


--
-- TOC entry 4815 (class 2604 OID 17049)
-- Name: historicalmetrics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historicalmetrics ALTER COLUMN id SET DEFAULT nextval('public.historicalmetrics_id_seq'::regclass);


--
-- TOC entry 4798 (class 2604 OID 16886)
-- Name: jobs job_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN job_id SET DEFAULT nextval('public.jobs_job_id_seq'::regclass);


--
-- TOC entry 4814 (class 2604 OID 17025)
-- Name: jobseeker_employment_preferences preference_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobseeker_employment_preferences ALTER COLUMN preference_id SET DEFAULT nextval('public.jobseeker_employment_preferences_preference_id_seq'::regclass);


--
-- TOC entry 4792 (class 2604 OID 16824)
-- Name: jobseekers jobseeker_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobseekers ALTER COLUMN jobseeker_id SET DEFAULT nextval('public.jobseekers_jobseeker_id_seq'::regclass);


--
-- TOC entry 4800 (class 2604 OID 16908)
-- Name: jobskills job_skill_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobskills ALTER COLUMN job_skill_id SET DEFAULT nextval('public.jobskills_job_skill_id_seq'::regclass);


--
-- TOC entry 4805 (class 2604 OID 16961)
-- Name: matches match_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches ALTER COLUMN match_id SET DEFAULT nextval('public.matches_match_id_seq'::regclass);


--
-- TOC entry 4807 (class 2604 OID 16980)
-- Name: messages message_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN message_id SET DEFAULT nextval('public.messages_message_id_seq'::regclass);


--
-- TOC entry 4817 (class 2604 OID 17090)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 4818 (class 2604 OID 17091)
-- Name: notifications user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN user_id SET DEFAULT nextval('public.notifications_user_id_seq'::regclass);


--
-- TOC entry 4821 (class 2604 OID 17094)
-- Name: notifications related_user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN related_user_id SET DEFAULT nextval('public.notifications_related_user_id_seq'::regclass);


--
-- TOC entry 4794 (class 2604 OID 16838)
-- Name: recruiters recruiter_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recruiters ALTER COLUMN recruiter_id SET DEFAULT nextval('public.recruiters_recruiter_id_seq'::regclass);


--
-- TOC entry 4824 (class 2604 OID 17121)
-- Name: server_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.server_status ALTER COLUMN id SET DEFAULT nextval('public.server_status_id_seq'::regclass);


--
-- TOC entry 4795 (class 2604 OID 16855)
-- Name: skills skill_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills ALTER COLUMN skill_id SET DEFAULT nextval('public.skills_skill_id_seq'::regclass);


--
-- TOC entry 4822 (class 2604 OID 17113)
-- Name: system_metrics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_metrics ALTER COLUMN id SET DEFAULT nextval('public.system_metrics_id_seq'::regclass);


--
-- TOC entry 4810 (class 2604 OID 17006)
-- Name: systemmetrics metric_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.systemmetrics ALTER COLUMN metric_id SET DEFAULT nextval('public.systemmetrics_metric_id_seq'::regclass);


--
-- TOC entry 4789 (class 2604 OID 16810)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4796 (class 2604 OID 16867)
-- Name: userskills user_skill_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userskills ALTER COLUMN user_skill_id SET DEFAULT nextval('public.userskills_user_skill_id_seq'::regclass);


--
-- TOC entry 5076 (class 0 OID 17011)
-- Dependencies: 244
-- Data for Name: aiaccuracylogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.aiaccuracylogs (log_id, category, accuracy_score, issue_detail, "timestamp") FROM stdin;
\.


--
-- TOC entry 5066 (class 0 OID 16923)
-- Dependencies: 234
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (application_id, job_id, jobseeker_id, status, applied_date, match_score, notes) FROM stdin;
\.


--
-- TOC entry 5068 (class 0 OID 16944)
-- Dependencies: 236
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessments (assessment_id, user_id, assessment_type, score, completed_date, validity_period) FROM stdin;
\.


--
-- TOC entry 5050 (class 0 OID 16798)
-- Dependencies: 218
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (company_id, company_name, location, industry, description, logo) FROM stdin;
\.


--
-- TOC entry 5080 (class 0 OID 17046)
-- Dependencies: 248
-- Data for Name: historicalmetrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historicalmetrics (id, metric_name, value, recorded_at) FROM stdin;
1	total_users	80	2025-03-20 12:55:12.887617
2	job_seekers	50	2025-03-20 12:55:12.887617
3	recruiters	25	2025-03-20 12:55:12.887617
4	total_users	81	2025-03-21 12:55:12.887617
5	job_seekers	51	2025-03-21 12:55:12.887617
6	recruiters	25	2025-03-21 12:55:12.887617
7	total_users	82	2025-03-22 12:55:12.887617
8	job_seekers	51	2025-03-22 12:55:12.887617
9	recruiters	26	2025-03-22 12:55:12.887617
10	total_users	83	2025-03-23 12:55:12.887617
11	job_seekers	52	2025-03-23 12:55:12.887617
12	recruiters	26	2025-03-23 12:55:12.887617
13	total_users	84	2025-03-24 12:55:12.887617
14	job_seekers	52	2025-03-24 12:55:12.887617
15	recruiters	27	2025-03-24 12:55:12.887617
16	total_users	85	2025-03-25 12:55:12.887617
17	job_seekers	53	2025-03-25 12:55:12.887617
18	recruiters	27	2025-03-25 12:55:12.887617
19	total_users	86	2025-03-26 12:55:12.887617
20	job_seekers	53	2025-03-26 12:55:12.887617
21	recruiters	28	2025-03-26 12:55:12.887617
22	total_users	87	2025-03-27 12:55:12.887617
23	job_seekers	54	2025-03-27 12:55:12.887617
24	recruiters	28	2025-03-27 12:55:12.887617
25	total_users	88	2025-03-28 12:55:12.887617
26	job_seekers	54	2025-03-28 12:55:12.887617
27	recruiters	29	2025-03-28 12:55:12.887617
28	total_users	89	2025-03-29 12:55:12.887617
29	job_seekers	55	2025-03-29 12:55:12.887617
30	recruiters	29	2025-03-29 12:55:12.887617
31	total_users	90	2025-03-30 12:55:12.887617
32	job_seekers	55	2025-03-30 12:55:12.887617
33	recruiters	30	2025-03-30 12:55:12.887617
34	total_users	91	2025-03-31 12:55:12.887617
35	job_seekers	56	2025-03-31 12:55:12.887617
36	recruiters	30	2025-03-31 12:55:12.887617
37	total_users	92	2025-04-01 12:55:12.887617
38	job_seekers	56	2025-04-01 12:55:12.887617
39	recruiters	30	2025-04-01 12:55:12.887617
40	total_users	93	2025-04-02 12:55:12.887617
41	job_seekers	57	2025-04-02 12:55:12.887617
42	recruiters	30	2025-04-02 12:55:12.887617
43	total_users	94	2025-04-03 12:55:12.887617
44	job_seekers	57	2025-04-03 12:55:12.887617
45	recruiters	31	2025-04-03 12:55:12.887617
46	total_users	95	2025-04-04 12:55:12.887617
47	job_seekers	58	2025-04-04 12:55:12.887617
48	recruiters	31	2025-04-04 12:55:12.887617
49	total_users	96	2025-04-05 12:55:12.887617
50	job_seekers	58	2025-04-05 12:55:12.887617
51	recruiters	31	2025-04-05 12:55:12.887617
52	total_users	97	2025-04-06 12:55:12.887617
53	job_seekers	59	2025-04-06 12:55:12.887617
54	recruiters	31	2025-04-06 12:55:12.887617
55	total_users	98	2025-04-07 12:55:12.887617
56	job_seekers	59	2025-04-07 12:55:12.887617
57	recruiters	32	2025-04-07 12:55:12.887617
58	total_users	99	2025-04-08 12:55:12.887617
59	job_seekers	60	2025-04-08 12:55:12.887617
60	recruiters	32	2025-04-08 12:55:12.887617
61	total_users	100	2025-04-09 12:55:12.887617
62	job_seekers	60	2025-04-09 12:55:12.887617
63	recruiters	32	2025-04-09 12:55:12.887617
64	total_users	100	2025-04-10 12:55:12.887617
65	job_seekers	60	2025-04-10 12:55:12.887617
66	recruiters	33	2025-04-10 12:55:12.887617
67	total_users	101	2025-04-11 12:55:12.887617
68	job_seekers	61	2025-04-11 12:55:12.887617
69	recruiters	33	2025-04-11 12:55:12.887617
70	total_users	102	2025-04-12 12:55:12.887617
71	job_seekers	61	2025-04-12 12:55:12.887617
72	recruiters	33	2025-04-12 12:55:12.887617
73	total_users	103	2025-04-13 12:55:12.887617
74	job_seekers	62	2025-04-13 12:55:12.887617
75	recruiters	33	2025-04-13 12:55:12.887617
76	total_users	104	2025-04-14 12:55:12.887617
77	job_seekers	62	2025-04-14 12:55:12.887617
78	recruiters	34	2025-04-14 12:55:12.887617
79	total_users	105	2025-04-15 12:55:12.887617
80	job_seekers	63	2025-04-15 12:55:12.887617
81	recruiters	34	2025-04-15 12:55:12.887617
82	total_users	106	2025-04-16 12:55:12.887617
83	job_seekers	63	2025-04-16 12:55:12.887617
84	recruiters	34	2025-04-16 12:55:12.887617
85	total_users	107	2025-04-17 12:55:12.887617
86	job_seekers	64	2025-04-17 12:55:12.887617
87	recruiters	34	2025-04-17 12:55:12.887617
88	total_users	108	2025-04-18 12:55:12.887617
89	job_seekers	64	2025-04-18 12:55:12.887617
90	recruiters	35	2025-04-18 12:55:12.887617
91	total_users	110	2025-04-19 12:55:12.887617
92	job_seekers	65	2025-04-19 12:55:12.887617
93	recruiters	35	2025-04-19 12:55:12.887617
\.


--
-- TOC entry 5062 (class 0 OID 16883)
-- Dependencies: 230
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (job_id, company_id, recruiter_id, title, description, location, remote_option, employment_type, created_at, status) FROM stdin;
\.


--
-- TOC entry 5078 (class 0 OID 17022)
-- Dependencies: 246
-- Data for Name: jobseeker_employment_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobseeker_employment_preferences (preference_id, jobseeker_id, employment_type) FROM stdin;
\.


--
-- TOC entry 5054 (class 0 OID 16821)
-- Dependencies: 222
-- Data for Name: jobseekers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobseekers (jobseeker_id, user_id, resume_document, headline, current_company, years_experience, remote_preference, profile_picture, preferred_location, onboarding_complete) FROM stdin;
4	\N	\\x504b03041400060008000000210032916f5766010000a5050000130008025b436f6e74656e745f54797065735d2e786d6c20a2040228a000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b494cb6ac3301045f785fe83d1b6d84aba28a5c4c9a28f651b68fa018a344e44f542a3bcfebee33831a5243134c9c620cfdc7bcf083183d1da9a6c0911b57725eb173d9681935e69372bd9d7e42d7f641926e19430de41c936806c34bcbd194c36013023b5c392cd530a4f9ca39c831558f8008e2a958f56243ac6190f427e8b19f0fb5eef814bef12b894a7da830d072f50898549d9eb9a7e3724110cb2ecb969acb34a2642305a8a4475be74ea4f4abe4b2848b9edc1b90e78470d8c1f4ca82bc70376ba0fba9aa815646311d3bbb0d4c5573e2aaebc5c585216a76d0e70faaad2125a7ded16a2978048776e4dd156acd06ecf7f94c32dec1422292f0fd25a774260da18c0cb1334beddf1901209ae01b073ee4458c1f4f36a14bfcc3b412aca9d88a981cb63b4d69d1089d60034dffed91c5b9b5391d4398e3e20ad95f88fb1f77ba356e734708098f4e957d72692f5d9f341bd9214a803d97cbb64873f000000ffff0300504b0304140006000800000021001e911ab7ef0000004e0200000b0008025f72656c732f2e72656c7320a2040228a000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ac92c16ac3300c40ef83fd83d1bd51dac118a34e2f63d0db18d907085b494c13dbd86ad7fefd3cd8d8025de96147cbd2d393d07a739c4675e0945df01a96550d8abd09d6f95ec35bfbbc78009585bca53178d670e20c9be6f666fdca234929ca838b59158acf1a0691f88898cdc013e52a44f6e5a70b692229cfd46324b3a39e7155d7f7987e33a09931d5d66a485b7b07aa3d45be861dbace197e0a663fb197332d908fc2deb25dc454ea93b8328d6a29f52c1a6c302f259c9162ac0a1af0bcd1ea7aa3bfa7c589852c09a109892ffb7c665c125afee78ae6193f36ef2159b45fe16f1b9c5d41f3010000ffff0300504b03041400060008000000210023beafe1f3160000daa0000011000000776f72642f646f63756d656e742e786d6cec3dd972db3a96ef5335ff80f2c354bada0bf7c5d3490fd7c489e3b82c2777e6690aa2201111b7cbc5b2fc74ff61e6657eafbf64009094444976a025be72da4995258204089cfde01c1cfdedeff77104ee505ee034797b249e0a470025413ac0c9e8edd1d75bffc43802450993018cd204bd3d9aa2e2e8efeffef55ffe36391fa44115a3a4046488a4389f64c1dba3b02cb3f3b3b32208510c8bd31807795aa4c3f23448e3b37438c4013a9ba4f9e04c1244817dcbf234404541dee7c0e40e1647cd70c13ddf68831c4e48673aa0721684302fd1fd7c0c71e341d433f3cc581d48da6220b242495c1d4ade7828ed8cce6a652065ab81c8ac564652b71b69cde2b4ed46925647d2b71b495e1dc9d86ea415728a57093ccd50426e0ed33c8625b9cc476731ccc755764206ce6089fb38c2e5948c2968ed301027e32d66447acd4688e5c1c623e867713a40913c684749df1e557972def43f99f5a7533faffb371f6d8f9c67fd7517b7110e6ce567398a082cd2a4087136e3f078dbd1c8cdb01de4eea945dcc551fbdc241339d9e531f1e4d6a09c0fc833fd06fe7154cffce911458103237488590f9e2974dfd9ce242654387ff156a05900aec82940da01a49501b400710afc760ca319e32c9873281d0773b2463b4e8d153a0e9e0356e49463cb935918a018948370a351a416ae67b42f2c61088b19a1d311d166935267c34de3051865a3dd18e17d9e56d97c34bcdb681773b136a106c60663350cb5c8e4c56e93e9853023d22e0ece2f46499ac37e446644d803100a070c03f42f2114fac1bea27bd64e710da88c397a472ca37e3a98d2cf8cdc53ce3398c30b42949a2d58b2ecdb47ac95e89592b6eacd3fd27a4eacb0c1cddb2341d015cdf2e459938b86b08aca853b6cf4eb9c7dd803f659a6e475e777307a7b94e0e8e88cb6456858ae34f6d3b24ce395e61c8fc2350fa3728250b2d47e367f6d91c180408e3c10618a3f4911e8bce9c54d45c107ab326dde504fb878684713a5fa46f1e014ddb6b3e669faa2f6932db21f351ff558e44baf9c46a8ed0deb0149f36fa489c84791408c4da89c66643283fbf91317c9a07ee644d21f79c426d4416ce325f0524a8910ed513cbc3d32d8170205d2970d13a4519a535cd17fab78d8bc7717619bf7ef6076f3ee382134883eec3ac0b76d07385b41453fba84d3b4a26baa7136c4f76830c3da659a8edb97099ac0461de2bc286fd249f392082e5eb19b4e1a5571b270bfd390a41f6ce2051182aaafbeb557b309ce08f27d8e07f4eb887c923100a3315d511a68749a6579718d6dcf3207eb84c1822c516449552c457a4496d4833433ca3fa045021029449a57b68f04f5dff6aae11d36e7198ce77c11ac678bbd491d3ab3c57714216554f6441021982f5009132e0c8311e5fe99a82983cf70412a5241a0286bd6d24cf5d1fbb3593ffa44bb80471e606b617361df1a91ddc12531cd4d41f796f482ecbaa66aea1a1df131bd70cdf8c4311453f3668d0bca427504d9133acaa2232d6f714918912de34fd6222baa41d6565543ddb6ac1ae854d231f5ba7a2571d7c8c3d402ac9916c60413ff7d6f0c63b14af3711f4e1adaf129c7cf05ce25acaf9a95d5c3794c3fd483d56bebc27d01ba2bd3578cd5e9d76dedf409a8a9d5d28abe2c4705caefd0d13bc028a57eb0f3d6055caf7f6733cdce3b5b56dffd9d6b896e4bdcd197395fbe7937e0d2bbbd251ffff8e37f8075655dfe57eff6185817679f2f3b336ad57f9771445b1635c7751e11823f649c06818f334e73e79a3649be6cf91d5e9a5b3e7d441cae567ffdd00cfa1eb44009884b8bf286b81a5a66174cbab54f2daad24db03d67901f12ee1edf4ab1f6312d501692a5834f5318a51ca85425c9f474ba47f29350b980b7ae0cec55fdf2d0c460eea74949e10b8b0013ffea33ca733c41b00c11537ea1452caaa5e6fa054be892d688a1ba8d4f8ad6c64e2d45a731160c33c2708482ada428b3953888f11957cf29106b9a650a9cf5596f2e315b0ebc9a4b3fd95c921c53b045c6ec3f5f541c8a6fbd4ec3d4b6e1138ef68c9110614cabc0f0edd14d4a66c84820286657ac0f87f017d7e8f5b62d242b8c1657390971c984ea16ea68cdc4bf6404503d9814eddce70dbb4fffc7e2e012276334b848ce972da590506f4e703006391372f9c540ad97b2c52239b1238aaaea38fbc1cee4bc6adb1abfbc0b8f7793c9e494ae0f0d70c2b6d0707236a65afde47babe54ffaaaa6f74d499797a5e60c3a8fe97dd93515c7b5977c1f49b554cff0a861b73533db8a4ced8957663e4066fe13274ee9f33d2e3f54fd25469ead630d59bd98a5ad975e3c42abe694e705c2b3ca311a1628cecfce46b80cab3e9364448015d3b51eca0fe5962858aa6ac9cdaedcab11b291dcfa912eefefce2fcf6374ec71a294fefe2aa90a104551916443309769729df6940c499425f5950a9f9b0a5f247dcd0c36416116dc7f8c6288232a0ad7d01a6d09ea8fba7b4737ac8b49889e61db9a4f770a378e4988baf61a9438a8a084617aa6ad6ea1e036d87bfb80204d346c3686fe54093367e475fb6034ce36db07d307f2fde03ec915256e90bed93e5813f46e98d2fbcf6befe6c2bb723c0e81afe8b6a979ea6e29049c5869a679183ba2fdf68936a4bc240025655500d66dab927a1d8219a01a04e7c3d1dd7824e161381c6c8560b98be041551469720c7214a725ea60b9fdb36e910b927bbd59ff8f3ffe77256ef303902d6a03271d1094e7c47ece39284ff21ddb900d1aadffe994d7c0ef80e50113a90db9249a321c3d547234a9a65b914b43ba0d5a7ade359004493901d7375ecfbbbae5418e6b88ae666c61073e899ced025c73c83d45bc2eba43519aa10180041088e0a08225b9fa7c09589a6a012aeac701188d5242a3615c80a20a42000b405f0973c24ea39c666d51d68ad2112e4a1c741ae9c00314607a05ca1ca1e274ddb6fe32303553f03555f27702e66a9ad66ec05c3f55c1b34c5b17b708803e03dedfbd87e49901c8f27488038c92600a7002685e236943f3a4bb633044b0ac72045032225d50ce1a29fa182980342b718c1f5806714316d9b40cc9057da608f0189727d4064b4e39f02bfa9ea4591a65e1571dcaa71da96069c5dde4bb9055a1268eef8bd6e6dd4cdca91d71e7a24f5f6f8fc1d59460fd6054a355963008d9d996a2ac06e49383ae1447341451b25e3524c53273c81b9231c2b16acac3422ee0682b9269bcdb063b1fad2ba621c109f86cdd381fd805078254d3301cc9df4db01fd8c6089fb2054e1a45b09fe64cc54e883a053429ba3819564940a52a8c4089605c1c13111cc28449ff208de32ac1412d76a9a42522bb1fa1f8a448a33bfa4431260e2ea752f52cd730b7d92f7d39b027167552e6b85f51209729e85738a2cc0a2018e23221ca8e417182a2a8bec8b2a8012f97de927455f5e4c7523ef9407860e9e32d08d7af58b62d5b154cf339246a9bc8fb8448636f6c445a9a99493a8c119c20f6d68d459ade1169dfbe5c7ebdbaf5bc9b8babf71ca4206bb2ef38dab338636d3afe13806129dc0d60744a06f771f55099c956806972761ac05cd004b93b8c08119d006b7097127e418018a5e0b794e8676a50f66ebdcf3cead93045c35bceb2fd393063eaf9699851a26e6186c7d1a8df9f1891a96c474c6607668d072913fdb8810f29ca92627af6beb5e3aa2fd13810704830db71279e4c9ac46cb14cc8cc8dc0aef8bd26d0258e46c6941c218c3b98e3b42ac8d786860a2a9507b8082a227d873028d39c48e1e110111d48a7b848514464a36850f00866ddf32c47f2b6c85d3c14c8f54298534f0de505b305d03df94a3d36442c82208451443c33fa9dea2f7a9a838cc580398fc78e50324039852e010b2e31a2706790e401a1e02bb2af5934ddf085827049f7e710d7db171302d999ea2f4298b1d6dae822c614c811b5b308f0eaf3b1b46f5165594a0545871e033210c10f0f3465573515c37e2c10c3074d9e1d8c7d4373fd72245531745ba4137f2e87bdf104f93d6491adb6350ea261650ec3fc61246eb7232836776ada7ac4a6b723425684da2e2881815e49d69a60c0fc69a747b9368b204e82e9498762da3fab0b7cfc4dbd984800e08439dd638309f1269867504e4144a046b89e832635c3d23cd1dc37876fab7ec5c5cc66ed4e29443419e3fe98b9ad9be3ab4d6dae65c1d5976f3305dc7ce7f14f355532349b51d20b1582f34ddd9a30e871ffc64b04fd29a01b2a29dddc23dfe23ea2ca97eef1c1048e68e3889e2b2602b1c88820ac0b271035c223f054cb1264cb78b11a989d46640a140daee108d9398263d6b57cf7251f11be7e4074931cd10482761bdcc6547fd0fd29dca8e99cb2e424cdc75c40537c5f123c79dfc7917fc63eb7a8888663ec188c7ea6a9aa8ee91acab3b8198710379f298f4e968aadd3ffcd833ceab313601f1b51358cc6d9047fdf4e1c2f45d8ddaf8e757bf1e58a8329d8bc6dc57d0ef4fd22c101713176ae4da67112e2e4defc9d050d36c75d2778fe8841e2a20131433e615a080683af096605ac88f04b87e016056142687134056f9831f4171e5968cb9a2c39bb59ccbfccdebdb818ded6efca60fa808287ef69b91d4697e2db282b99f6a7669174427019cc2e551e0e3515dd17a4bd6f0a1ed44eb27dda0b4ea99d9d118732073d163eeda68e3c6209e9aeaa88f292fc121d4b702591edd3bdcaaf656a5f8c6e060f430c0749314a1eb2eda8bd13de7ccca12a4f819524e81f7ffc5f013e576508097047388f0ad2f2e459ec85532de53bbafb028a204cd3888334245b566c457a16d5f60264dc628032c6785a8a53ad88f4ed02946dfeed9358ff08930ae65340cb459d002bcb71c4642007ee44df177c55defb86ff0b085d7e727a3c9991bae93bb22ded161d7b91107a9f1357fb1c58273cdb30aaa3ab86663f4b92c241b9270ba9a2b3ecf98554d14e5ac90f24c7621cf07b78a71b59664eca87ed7245c56e20f0fae6cb47cfb9edf1c873d9f60cd5da7b3ac3a1aafa1f6065310879170baa98c7d3309d4cb6c34a370a299e3a391ae012dce0624c34378ca605269a9b66a7f1309d2fda8ab2ffbdcf1720bd17d23cd7256936097e654a3302073828c943c4b31bd4cbe60b762892a4fadb9c817a41fe804553450810db44c90245346849f35aa9bb8b7faf50b399cae0d9a4d33200a332c74101de046932ac6a9843d2747f0c601054390ca6c7c0174f8a20cd118fab2ca996e15ae6de15ed96b907e262207d80efa450ec67ba39611b4a9bf37d37922e511f6c3844083821ca89e9e64490d0ed1073a5ccaba6abbab6fef3c370bbef5aea8e2a69b2b6e454cb9ea338b6c376037e5509b528a09cab2b2a8a821ac95310d4b80f28ee6940bb0f69bc8d70508eb33aa81bd1dec51b7a7d0caaa4fe24d28b32e71dfacb29f85ae2886dde5fb384e5637ee7ee1625459afb513a59ee52dfaf83f1f4c0a0f38d25c4e0188e10cdd16bd2aad9fd32873821173c925430354b55945f3a3ff2dd454c207447104280cbb23e10ad085b67a75328c2111197642d4432469dc4731e084aa6e73a3ed7398ca69cd81a08ae161a3be0143dc1b7345bd79cee8a15c516655fe80a8e1faeb8b9f348b5351e05d1e0583e0534825694c081498072705d1b173383838b195c5d75d9d9c99d51f9f4c27e863c976c8d70a1cc6371ee8a961760843e2673eb93da0b6be2d0115c466cbfa6bea0a6beb42a83345ed41f317d8cc8177a16862b7d5ab525cb35b9f6ee7e117c6e8aa32545bb72328809f7a7ce1ecd4ceac5934733f5c983245d560441d69690248ba6a3dbf576e33f0f92def9695035d4de68d13af1ad76399ae304b3c37929a0261761199c0082ad684a8ca8b2454788229635876bd50d06188e929431e182f2263d4304a332a48972049b25d5ee7cf99bbeed58fe72fea6e2cba268cb1be2edd09054af98c2e0b572217dfb9f5b5341b1155f159e256dff05d4546024d7c6dda00027df0d4192d0769e7bbbabcb5ef7543e55efd3c5e525d7feaa2b199ebd5c9a6e776c1d46b8943dddc9d959ac2cf3442dad259b6be7f1281e3ec07c007a2c4ff09c0333a2ea1992e2ec3d21f8a01c55f194b82de92887714c955f0493514548b9389f6d25dc70804a505d5a5cfe9722e2155049a7d605f8371867ff0e3ec380d59dbea4361f81db39e855193dfd416d116a747c4d8a7943fbd431b842cce1bf226fa6f993a4e1f29a03bcb2e978baa3ec3bf1f4b0c02b9f5ee27e0ed9161805a14f68123130f130ab221a92e6efbd46c1618168be59774cd8f336cd83f0187c42392494b4e8851c371b763c70933d97d80b7b4f493b7c7f5d3975a99f16125a8b180bf3c83951f31c735925289a63c9aecb2c8a5f155a0c56d45aae0599dfb8b3de62298d6bfafb9dc5069bcf57557c3de5d1c492ec9bb2bff79ca283626ef5d489d28af8ab112ce90feb11156cfdd63b06d603013407902447740553fdb52394dae96d9a46b582b89e03ea63954d6906e3555a226ab41fd3e8799012723c06ef714948339d90dbf605b94c53621ad25205b05b9b773d5475c1b75dcf5cce64d1449b68646aeffcb21caf9f7eab7faf17b0438769745e83929bbbd7d43f7e44aa9aa66e7ac66ed942ab11cc038e67888665ba2adb747f75fa6ae2f8594e5f2f25ebe677fa144dd32c75ef29fa09d174ec0b8eeee86fb2d5aba81740ee5dcc36a4da50d3acc361c9dfeba6364bafaecdc20150cdf265dbd2f7ad965e2840d7c7e19a273a9076e8f1761abdb9259ee6980fd692aca88266ecdb4efae5617d8b60bc50bc88e83c1e605ba22969eaaba4d810d8d6006625ac7fb09c07cca2275aa2b4ef3a7abfbefc58acabc523a775cfb73575dff5280fd808d389b8544473ef5b462f344eb258aaa0acee433d9e0ce07d7a4f9b378f93744b1538decded857f519f8fe5898aa8a6a3fab6be970304cd1d16e4763c55939dc7d175898bf29acc6194c32c9c49033e49c18e641d8ca4581608eb9d3ceb82a6f2cdb6ff59cdbe0e7a9a3f4f85baea40c109f83a2092894ba68bb6e2aa02ab42f58addfd18e66c7fae39c0c976470866692e8a8d46384988237f023ec23b586629e62a332a30688a7bc9d27c45d1029f0007e5251e368a99720d8a797846306dcf54b4bd24c4bf228421e4a6a9017387c06fa80f5c54e051024e809f2344cbd63b30ce3830a3f98a2f6afedee3c42fd48e58acb111dcdf8f5121a97d69bb8a4752b7c4c6a575f5feabf5dee3b1201443160555db77cc949bf6dbea5087eb37c8b3e3885db6f09251848b904b8f5b862f5aaf30decc377bec08322e2630247e3107e4655bb12577c7da7bff7c907f47447b12f090b6e2499a2dfbbb6d3b1c983bcc2104d603433775d5d3d809ad056008bae32bca2e074eb6ac902c3160b7556d7f1ff7cbe1ef63d4cfb62be324757f47c7b9fc6af78075e582de17e7c2bbbde0d236b26a488aec2c057424cdb15d7fe964db4649d96b7e5e766fd659fbbb454d87155e6922a583e658425e57ce2bc09bf7ee7b9e239cbaa0dba2e02de5a16a96af2bba4825d70b84495d0e9a167f8ae19896167cf3dbed671e60a8862a99aabc140691055f926c66a4bc4060acfa9cb5678361046845ed28c22376cf89aa3e78e3f6ac0b870b56aaae5bb2b9ec7b6aaa2211da79a1b0a235c28003890b18e100f4eadffb686a87393d1eb0889ae5aae6b2452b2b9ee54a2e05d6a360e91c9c7829b06abd335a7eb22e51c58e761032f3ca909e356fa8aa79d8f1b8688be66919c2f2af47aaae42cba2ee90c1c5a1ca9ad57df862db7c4a45f12d9b488dddcceb551be4a79cecb60c4754dc7d27347093540bea5987dd1639439693b29fd60808fda112b3dad91c88d36c41d7147fb7e271fb42dca4290c4bcd4b1af4e0b0f744d5364dcd5cda9f555457547556c9f58562f303e60ca413d1a7f9b6c5b3a5d308ca3500e8ded94eaa3e8d27c1161c455aa9cd63e896e75b34aeb5b7693e1be909b62ba9e28ee922cfc83a9496e6bf5f4c3ffad13a7af275dfb3f65d04f9a082ab050acaeb7ccd52d84c473d5a198b1e6a931a708754ce184ac3ffd9e833a49dc9526879c99a1ee9b4de1e191a03473df7d9658d93e6226475c01ba40ed394d5cda6f82297a3aa6497b3175d55f1ed34a33c5750a7b21137cc55a495ba9a8d9939b6eb85b1affd7430655f066950d13ae3effe1f0000ffff0300504b030414000600080000002100b66fc12e5c010000230500001c000801776f72642f5f72656c732f646f63756d656e742e786d6c2e72656c7320a2040128a0000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bc94d14ec2301486ef4d7c87a5f7ac80026a18dca80931de283e40b79d6d95ed74690f8ebdbd67186044249a2c5e9ebfed7fbefecde974be2972ef03acd3060331f0fbc2038c4cac310dc4dbf2b177233c470a63951b8440d4e0c47c7679317d815c111f72992e9dc72ee8029111957752ba28834239df9480bc92185b28e2d2a6b254d14aa52087fdfe58dab687981d797a8b3810761173ff655dc26fbc4d92e808ee4db42e00e9440b497c16d850d9142810dbf24b1cf86c26e46986ab2e191c1071baee80b153ce214cba44480cd25285792b8abd740e62d8690e54e7d04e615b9f6b3fe8b23dae8b102cc77e20d84be720c65d4264ec64738dab034463ebd837d594ad433f32857c37ced54f354fe06edbb38999e061436051fd883afa0754b6adaaca6f16803f8d2daf46b96a687b0c0e65a6117ae1683c096f87936692fe7083eb2e6f5041f8fa6df65ae2eed5e5d1d736fb040000ffff0300504b030414000600080000002100215aa28462060000db1d000015000000776f72642f7468656d652f7468656d65312e786d6cec594b6f13471cbf57ea7718ed1dfc881d920807c58e0d6d084489a1e238de1def0e99dd59cd8c93f856c1b152a5aab4eaa148bdf550b54502a917fa69d252b554e22bf43f33ebf5ae3d2606828a5a7cb0e7f1fbbf1f33bbbe7ce52466e888084979d2f26a17ab1e2289cf039a842def56bf7761cd4352e124c08c27a4e58d89f4ae6c7ef8c165bca122121304f489dcc02d2f522adda854a40fcb585ee42949606fc8458c154c455809043e06be31abd4abd5d54a8c69e2a104c7c0f6e670487d82fa9aa5b73961de65f09528a9177c260e346b52a230d8e0b0a67fe4587698404798b53c9013f0e33e39511e62582ad8687955f3f12a9b972b3911530b680b743df3c9e83282e0b06ee84438c8096bbdc6faa5ed9cbf0130358feb76bb9d6e2de76700d8f7c152ab4b11dbe8add5da139e05901dcef3ee549bd546195fe0bf32875f6fb7dbcdf512de80ecb031875fabae36b6ea25bc01d961735efff656a7b35ac21b901daecee17b97d6571b65bc01458c268773681dcf3c323964c8d935277c0de06b930498a22a85ecb2f4895a946b31becb450f0026b858d104a9714a86d8075c07333a10540bc01b041776ec922fe796b42c247d4153d5f23e4e3154c414f2e2e98f2f9e3e46a7f79e9cdefbe5f4fefdd37b3f3ba8aee1242c523dfffe8bbf1f7e8afe7afcddf3075fb9f1b288fffda7cf7efbf54b37501581cfbe7ef4c79347cfbef9fccf1f1e38e05b020f8af03e8d894437c831dae73118e6104006e2d528fa11a6458aad249438c19ac681eeaaa884be31c60c3b706d52f6e06d012dc005bc3aba5b52f820122395c5bb04dc89e212709773d6e6c269d38e9655f4c22809ddc2c5a888dbc7f8c825bb3313dfee28855ca62e969d8894d4dc6310721c928428a4f7f821210eb23b9496fcba4b7dc1251f2a7487a236a64e97f4e9a0944d53a26b3486b88c5d0a42bc4bbed9bd8dda9cb9d86f93a33212aa0233174bc24a6ebc8a470ac74e8d71cc8ac8eb58452e250fc6c22f395c2a8874481847dd8048e9a2b929c6257577a075b8c3becbc6711929143d7421af63ce8bc86d7ed889709c3a75a64954c47e240f214531dae3caa9042f57889e431c70b230dcb7292985fbecdabe45c3924ad304d13b23e12a09c2cbf53866434c0cf3ca4caf8e69f2b2c61d43dfce0c3fbfc60dadf2d9b70fdd9df59d6cd95be00457cdcc36ea45b8d9f6dce122a0ef7e77dec6a3648f404138a0ef9bf3fbe6fc9f6fce8beaf9fc5bf2b40b9b2bf8e4a26dd8c40b6fdd43cad8811a33725d9afe2dc1bca0078b666288f24b7e1ac1301357c285029b31125c7d42557410e114c4d48c845066ac4389522ee1d1c22c3b79eb0d383f945d6b4e1e2a018dd52e0fecf24af16133676366a179a09d085ad10c9615b672e9cd84d52c70496935a3dabcb4dc64a734f3937913ea0661fd2aa1b65ab7a22151302381f6bb653009cb5b0c5166b53524c201712c17ecab19779ebb378b8972b612e7e3e40983a99375d9cd54134bca3374dcf2d69bf5a6877c9cb6bc21dc966018a7c04fea4e835998b43c5f5903cfaec5198bd7dd5955ab4ed6e70c2e89488554db584696ca6c65442c99ea5f6f36b41fcec7004733594e8b95b5dabfa885f92986960c87c4570b56a6d36c8f8f14110751708c066c24f631e8ddb0d91550099ddee49a9e08c86db303b372e166b531fbca26ab19ccd20867d9ae5fcd4c2cb47033ce7530b3827af96c46f7d7344557fc7999524ce3ff99293a73e17eba12e8a10fa7b8c048e768cbe342451cba501a51bf27e0dc37b2402f0465a155424cbf80d6ba92a369dfb23c4c41c18543edd310090a9d4e4582903d95d97906b35ad615b3cac818657d265757a6f677408e08ebebea5dd5f67b289a7493cc1106371bb4f23c73c620d485faae5e5c6cdabceac1331564e997155668fa85a360fdcd5458e6002e88b31d6b4e5cbdb9f0e4993d6a5378ca40fa0b1a37153e9b5e4ffb7c1fa28ff2731e41225ed05d4d6761be38009deda295a65959096fff1694cb9d7176b138ced1d9f9256ac6d92f17f7facece46255f17f3c8e1eaca7c89560acf216636f747141fdc05d9dbf07833627645a630b3833d610c1ef0609c0d99b42dc13a62d2d259b24f8688062793b0ce7834fba7273fccf7ad006d7b4eb872366186d738db9d72e2fad9c43985910c2d3b27364f712e066c2ad9e26d94f316997b8a256fe2b2259477bbcc99bdcbba6c8940bd86cbd4c9cb5d9679aae24a3c72a204ee4cfeba82fcb58c4cca6efe030000ffff0300504b0304140006000800000021008fe19f2533040000370c000011000000776f72642f73657474696e67732e786d6cb4566d6fdb3610fe3e60ffc1d0e7397ab1acb8429dc276ec2545bc0e538a7da624da26c23790941d77d87fdf91122da7c98aa45bbfd8d43d77cf1d8fc73bbefff0c8e8608f9526824f83f8220a069857a2267c3b0d3edfaf869360a00de235a282e36970c43af870f5f34fef0fb9c6c6809a1e0005d739aba6c1ce189987a1ae7698217d2124e6006e8462c8c0a7da860ca987460e2bc12432a424949863984451167434621a348ae71dc590914a092d36c69ae462b32115eefebc857a8ddfd6e45a540dc3dc388fa1c21462105cef88d49e8d7d2f1b803b4fb2ffd626f68c7abd431cbd62bb07a1ea93c56bc2b30652890a6b0d07c4a80f90f0de71fa8ce8e4fb027c775b7454601e476e751ef9f86d04c93382acc28f6fe398741c21589ef390fa6d3cd98987f4898db3ef0be68c40d7a6debd8925f1790dad2d326887f4a98a2c237e5b50e313dd91f539d2f43555d34277a45448b577b22b1956e5b75b2e142a298403a53380d31fb8e8ec2f24d1feb9257e74729b87e00a7ac41721d8e0904bac2ab828d060a228082d00e5293685410628722d31a5aee3541423f078c8b70a31e8155ee26c6abc410d35f7a82c8c90a0b447b0b1cba4a3ac7648a1ca6055485401db4270a304f57ab5f84d9805f41d05d7a2b3705da85f156d47030b8e186cf549975a8b1adbc81a455e7f26d6c0798fc7e72ebf7624a0032b52e37b9be2c21c295e41f005f98267bcfed8684380d1f5aaff10c1b702c0dc7afe0445717f9478859169204d3fc8993b891525724d9412ea96d7501b3fcc19d96cb00207046a6d0de5439438b83cdf6054c3e0fb417e1b8dff0465b893a37b28cb87b93046b09ba3dc41aeff87930ccfcb17c677adfde20f218c578da2cb349b2d476da416ed9164359aadbabbf314192fa2d1f245e4dfd9e6e9e812a6f80bc86292becb962f22cb71365abc84ac96599cba2b139e76c7723b627f577e65afc880b5160bc44a45d0606d877068354af53027dce325864e87cf91a2293d381cb6806688d2151c96075c0a585e132daff1c6ade91aa96dcfdb69a817a5d0af3e9eb86cffc3ea57251ad9a20785645bfa5e254ed3ce927073479897eba62cbc1587de7c0635bcfeb4572e4f7d7a0eb98152722de40eb99274ba980f3f175dc95255d872c36b24655bb5e5369e06946c7726b68566e0ab86b79afb28b74987250e4b5acc7da0caee0cb4bb452f4bbcec4c6fe465a35e967a59dacbc65e36ee6599976556b6833ea560683cc005f24b2bdf084ac501d7373dfe4cd42641ef90c4d7ed4c81f212ada01b327ab0cff1234c2c5c13034f60496a861eed004b5c9177da141d45639ee85acc2acba70c76b8fbabfbc4d895f857b1d859571128c7e2c8ca7e845db48153a2a1dd48987646288ffde2b038cd6b51ddda819c76e37139998fb26cdec2e3133c6ee1bfe25992ade2193cf4dfa59361ba8ca3e16494cc87b3493a9bc4d793d96236febbbb88fec57ff50f000000ffff0300504b030414000600080000002100d3b928610c0500003238000012000000776f72642f6e756d626572696e672e786d6cec5acd6ee33610be17e83b18ba27fa977fb0ce428eed2245bb28b0297aa625da1622920225dbf175af7be8adbdf6d647e8fbf405f6154a8a96fc23d79164cbce8197281e723ecd7c9c198e07fef0f11585ad25a47140705fd1ef35a505b147fc00cffacaafcfe3bb8ed28a13807d10120cfbca1ac6cac787efbffbb0eae1059a40ca36b618068e7babc8eb2bf324897aaa1a7b7388407c8f028f92984c937b8f20954ca78107d515a1be6a68ba96fe1751e2c13866388f002f41ac6ce0bcd772683e052ba6cc012dd59b039ac0d72d865e19c456bb6aa70864d400621e1a7a11caac0ce5a8dcaa0290550b88595540b2eb211d71cea987641491daf590cc2252a71e52219c5031c04904315b9c128a40c23ed2998a007d5944770c3802493009c22059334ccdc96040805f6a58c4b4720464fa9511da2a223e0c4d3f43217d6541716fa37f97eb73d37b427ff3c8346819ff85ca90780b0471927aae5218322e088ee741946738aa8bc616e719c8f294134b1466fb56915e325dfeaf3c0d05955bc032e66ff847a1b0fc34a2ae9538110e916b943161ff9d99258845e1f6c5b5a8d921572f59403200a300e078b064c1cf303a1b0cd5db6628c7094aa64686234e85e3045b62f59275ecd0981d80d84ffc79251423e355e5ba20017310e781ce116135a3ec1c6e8d76388a66e725c20f942ca22d5a701edad3b6acad788751016b9350bb491e9f67cce7398858b5435eef69860905939059c4d2a3c522bc959e00ffcb02853fd27fe16b2ae767dde235467960ad1198c409055ef269815a7b9f9e586cb2168ba1f528647d15e542d145b9d304d20185e0856fe12838e6efe92d41c8248f03c7b6bb4345e52b681126c14f7009c3e77504b33da934e452b12b415198ad9903d7188f5d4dac844bbe10b047f6aed4966cb32e76b1066f8c72e164118630c9f59fe16bbef4ef9fbfe7f21fbd4c1ac2e9667bf40be58f007377b8b8afb40d4e436f0ef02c6d354d27354dcd3753f158646898b59f9b1de9929abeedd019fd12ce7cadea8c6e598d78635cc09b3ffeaaea8da13b8d7863de24d08c4ea7116f44a25f3bd298f18d7863df24d22cb3992ae0dc24d26cad992ad0be49a4d9ed66aa40e72691e65897aa02eade7dce554e5ef67a9dcb5ed7460373dc76853bc72ffbf97a4203ffe71357fea86bbb0cc6cab9cacf20a5228942f67596c56c57d3b40bdc9bdfbefc53f554ca3601744c70127372632f60ede6e7359a90305575196f7b820033601f4e0163e6ed68e4c7b3cf84994ad8574df67d75092fd25190aabc94ee270e8979240b1a40dafa04573bec1c48bdb8b8b11a6b468135fbf2ac7dfbf27755de4a772e87bcfdc676f39167bcc3dabeac1a412288f613ac01822a275ce966a8b98cb3de65c695eeab6e947122bfde5fc695eee09ace38e79d665ce9a6b0b98c6bbfcb8c2bdd5fde28e33aef34e34a77b297cfb88aad2fef122ab7be86e6ea2c404fb6bea7e65cdd81eb0cdb5d39e72ae18c9c73c939d79bdec839d7f99126e75c72ce759d48bbd99c8bb794d52f7bd77c745cbb23dca93be71a3ebaa3416764e55ce56720e75cdb7ee1900939e77a9b3539e77ab3d5392448ceb9e49c4bceb9b6bcc939d7d5324eceb9e49ceb16732e5ee92bb7bee67064e9c3f650f85f7dce351eb50d43d336adf3ee81ca39d7d9df09e59c4bceb9ae136972ce25e75cd7893439e72a3be7c2e9258fb3df6f71d1de8d9f215a1b387c444d54faa36a999dc7d444493daa669c502bfce87cab669e501345e2a85a7a84999a788aaee6e13f000000ffff0300504b0304140006000800000021002114d7b5a00d0000e28200000f000000776f72642f7374796c65732e786d6cdc9ddf779b3816c7dff79cfd1f387eda7d681dc7f9d1e64c3a274ddb6dce246da64eb7cf32c8b13680bc80e364fefa9584c0c21761ae50b373661e2635f6fd20f4d5f7a28bc1fae5d7a7240e1e6996339e9e8f26af0f46014d431eb1f4fe7cf4fdeed3ab37a3202f481a9198a7f47cf44cf3d1afeffefeb75f366779f11cd33c1080343f4bc2f3d1b2285667e3711e2e6942f2d77c4553f1e682670929c4cbec7e9c90ec61bd7a15f264450a3667312b9ec787070727238dc9fa50f862c142fa8187eb84a6858a1f673416449ee64bb6ca2bdaa60f6dc3b36895f190e6b938e8242e790961698d991c0150c2c28ce77c51bc1607a35ba450227c72a0fe95c45bc0310e70080027217dc231de68c658449a1c16e1382735874506c7ad3106208f8a6889a21c56fd3a96b1a4204b922f4d22c535eab8c63d27b28f92f0ecea3ee51999c78224540f84708102cbff8be3977fd43fe993da2e0f61f44e7821e2e107ba20ebb8c8e5cbec36d32ff52bf5e7134f8b3cd89c913c64ec7c7443b38c6d282996341b89cd94e4c545ce087c677991e62d0161beb36d2c7713f29867e2dd47129f8f4ed47fe51bf91fd5d6c99b6acba56c4f635b4cd2fb6a1b4d9beda2e9abef33b969ce22d11e92bd9a5dc8a8b13ec6f2af71e4abdd57f2cf86457c7329fa22e371b5a703dda0150999daff9c0a8f0a1526870772873193c9673a39ac5e7c5b4b8dc8bae065244b85386719bb5f16e273078a37d6bb2cffd60d1903b944ea10896456e633f12e5d5cf3f08146b342bc211b576efc7e759b319e899c753e7afb566f9cd1847d66514453e383e99245f4c792a6df731a6db7fffe49e51dbd21e4eb5436f6f4440da1388f3e3e857425b39878372589d8f5171910cb4fafd976e72afcbf156ca2856b8b5f5222537930d945a8e6a310aaeb73e368db99eb9d63579f42ed68fa523b3a7aa91d1dbfd48e4e5e6a47a72fb5a3372fb52385f9993b12194a9c35d4e7e16e00751fc7e24634c7623634c7e22534c7621534c7e20434c732d0d11ccb3846732cc314c12978681b85c6609f5a467b3777ff39c28dbbff94e0c6dd7f0670e3ee4ff86edcfdf9dd8dbb3f9dbb71f7676f37eefe648de79653ade04ad82c2d06bb6cc17991f28206057d1a4e23a960a9fad60f4f9ef4ca1a62f0417ac094994d9f8807d342a25eef1f21caa4eee7f3429689015f040b76bfce683eb8e1347da4315fd1804491e0790466b45867961e7119d3195dd08ca621f539b0fd41657d18a4eb64ee616caec8bd37164d23cfdd5711bd24857a408baa7a294dc23c0cea8484191fde344ebce5876b960fef2b0909deafe3987a627df133c4146b786da030c34b0385195e1928ccf0c2c0d0cc5717699aa79ed2344f1da6699efaad1c9fbefa4dd33cf59ba679ea374d1bde6f77ac88558a37671d93fed7ee2e632ebf9118dc8e19bb4f8998000c3fdde86ba6c12dc9c87d4656cb405ed26ec79ac78cddcf7b1e3d07773ece6935c9d7bc5e0d1179f19aa5ebe11ddaa0f93257cdf364af9ae7c960356fb8c56ec434594ed03efba96766eb79d16a5a45ea65da1989d7e58476b8db48317c846d0df08965b9371bb4633d8ce02f723a2be5f491f9b6ad1cdeb02d6bb8ad76b392d7e669a48756c63c7cf093863f3faf6826cab287c1a44f3c8ef98646fe88b322e3e558332d7fa824e965f98fc96a4972a66aa506a2ffa9beba9721b821abc107741b1396fad1ede3ab84b038f03783f87c77731ddcf1952c3365c7f801bee745c1136f4c7d25f01f3fe8fc9f7e1a78218ae0f4d9d3d15e78ba3ca46097ccc349a624f1c813494c3359cabc9c4315ef37fa3ce7248bfcd06e33796b82b074413d1167245995930e0fde12797123f28f87d990e2fd9b644c5e17f265aa3b2f30e3b261be9eff8786c353dd171e78b932f4755da8eb8f6aaaaba2fde1864f131ab8e15304a5a6383dc8f1ebe1601bb8e107dbc0f93ad8cb98e439b37e85eaccf375b815cff7f10e2ffe344fde9eb658c7fe3ab0027aebc10ae8ad0b79bc4ed2dce7112b9ec703563cdfc7eb71c8289e874b728af7af8c45dec450305f4a28982f1914cc97060ae65580e177e818b0e1b7e918b0e1f7ea94304f530003e66b9c793dfd7bfa96c780f91a670ae66b9c2998af71a660bec6d9f44340170b3109f6778a3190bec69c81f477a2490b9aac7846b2674fc88f31bd271e2e9096b4db8c2fe473253c2d6fe2f68094d7a8638f93ed12e74be41f74eead6992e5b35d1eae889238e6dcd3b5b5ed09474536ef5ddb1776b7a4c9f032fa3626215df238a299e598ecb1a25e9e954f6bec365f35a3d765cf6bf9b846305bd657fb4dcc897e26a423b22ad81b61fb77d8d6e727871d61373462eba46a287c98e264da3f588de846f0d1fee0ed4ca21179dc3312ee533f12d415b99d2537224f7b46c27d560f18ed8b543e6d4476f9e103c91e5a07c269d7f8a96b3ccbe03bed1a457570eb6ebb06521dd936044fbb4651c32ac14518ca6f0ba03afd3c638fef671e7b3cc645760ac64e764a6f5fd9115d06fb461f993cb36392a6da5f7df704c8fb6a12dd2b73febee6e575fbc6174efd1feaba1213a734a7412b67daff8bab4696b1f763ef746347f4ce3b7644ef046447f4ca44d670544ab2537ae7263ba27792b223d0d90a9e1170d90ac6e3b2158c77c95690e292ad06cc02ec88ded3013b026d5488401b75c04cc18e401915843b191552d0468508b45121026d543801c31915c6e38c0ae35d8c0a292e468514b45121026d5488401b1522d0468508b4511de7f6d67027a3420adaa81081362a44a08daae68b038c0ae3714685f12e46851417a3420adaa81081362a44a08d0a1168a34204daa81081322a0877322aa4a08d0a1168a34204daa8e5a386ee4685f138a3c27817a3428a8b5121056d5488401b1522d0468508b45121026d5488401915843b191552d0468508b45121026d54f565e100a3c2789c5161bc8b5121c5c5a89082362a44a08d0a1168a34204daa81081362a44a08c0ac29d8c0a2968a34204daa810d1353ef55794b6dbec27f8ab9ed63bf6fb7f75a51bf5cd7c94db444dfba3aa56d959fd9f4578cff943d0fae0e154d51bfd206c1e33ae2e515bbe5637b9ea9608d4179f5f2fbb9ff031e9037f74493f0ba1be3305f0a3be91e09aca51d7903723419177d435d2cd4830eb3ceacabe6624380d1e75255de5cbeaa614713a02c15d69c6089e58c2bbb2b5110ebbb82b471b81b087bb32b311083bb82b1f1b81c7814ccebbd1c73dfbe9a4bebf1410ba86a34138b513ba8625d4aa4ac7d0187d45b313faaa6727f495d14e40e969c5e085b5a3d00adb516e52439b61a57637aa9d80951a129ca4061877a921ca596a8872931a2646acd4908095da3d39db094e52038cbbd410e52c3544b9490d4f6558a921012b352460a51e7842b662dca5862867a921ca4d6a38b9c34a0d0958a921012b352438490d30ee524394b3d410e52635a892d1524302566a48c04a0d094e52038cbbd410e52c35447549adaea234a446296c84e326614620ee846c04e292b311e8502d19d18ed5924170ac96a05695e6b86ac914cd4ee8ab9e9dd057463b01a5a7158317d68e422b6c47b9498dab96daa47637aa9d80951a572d59a5c6554b9d52e3aaa54ea971d5925d6a5cb5d42635ae5a6a93da3d39db094e52e3aaa54ea971d552a7d4b86ac92e35ae5a6a931a572db5498dab96daa41e7842b662dca5c6554b9d52e3aa25bbd4b86aa94d6a5cb5d42635ae5a6a931a572d59a5c6554b9d52e3aaa54ea971d5925d6a5cb5d42635ae5a6a931a572db5498dab96ac52e3aaa54ea971d552a7d4b86ae94684300f3f01354b485604fe7e2fee33c9970519fee384dfd38ce63c7ea451e0f750af514739de3496bf926cb5b09ff87c21fa4cfe02baf1b85254fe02ac06aa0f5e45f532553258b624d0ab7ae9cdaac1faebda728f2a70cfae6ab8feae7802f0dbc5add41ee6441cd557d91b60e7a9fc61c496eddbc158bdabedb66d6dbd6c195c9bece4c0589becf0a87eb1bb36192f7f74e9fab1b9dc59b53c997581b8af2b9a063392aafb14b6abb03536eba5e11adbe4ba70db0d65dfa8ff87d290551b0e0f4edf5eaa0c672cdfe622cca155186d6f9fc234c7b04dab074a575f045a6d932f842768ae5e4119a7e6127328192b0335656ce9eb03f55f89d92ec377a8fbc75c86afdc365091a955117df7c19f5c9149692cb2286856bf72d0a7eacb17b399b1c462bde8a2b1c4a2da3650db23abb6fafe109fda6e4f213f4deaea064ba89e1aab7bd5bbcbe87c1d2e6911dccc9a02eebea335dcdd2c656c6cebed52d121d506f943ed31f520efb1555e7d13cf5f465e355cffccf20e54b25cd5b34d499d1afe324aaa91f9ff529279d4335c0a4143fddba996a9ae5e03a17e885fad80b0abb465a1048b867afeba4f437bbb0b597075b45915649d73f4b266b30eb2dea3ac98c7a5fae21f576a49de8d5eaeb66c69f4444a9478ff92c6f10d293fcd57f68fc67421cdb0913301f593593befcfcb5f7fb6c6ab4581ed8071b331e5cbee7152ae07a5ef5fb59644b2166ee96e7533f5d09ec6e6a4f296e0ddc6945bfd25a3894e11bdaaa7c614afd714dc7da65ddda26e2685729b6b92af978ad8edd3fa0d8fddaa1344ff6ed51d79aaaeb8f4e8c89f3825b6a8b3bfdfeba416ae73e1ef997c73d7644475ff4e279bd90e242585f9c637ef491acdd81fb56cba8bab4f5cf2d8fe89b6c4a58b948ed4d5f6be99bada3fd1485ef0030ec9ab7d3ccba4b4fd619add41ad2eeb6ddfde37b4e1109eeae2c41cc259cee409420f8cf747d3d3033d33d283b35cd35df6a174ab3675287ff3efa9589358fffc98319eb7075dfd2b7ff73f000000ffff0300504b030414000600080000002100fce5bcac2e0100004b03000014000000776f72642f77656253657474696e67732e786d6c9cd1cd6ec2300c00e0fba4bd43953ba4a0815045e1324dda79db0384c4a511495cc56185b79fdb01abc485ee927f7fb29df5f6e45df60d912c8652cca6b9c820683436ec4bf1f5f93659898c920a46390c508a3390d86e9e9fd66dd1c2ee0352e29794b112a8f0ba14754a4d2125e91abca2293610f8b2c2e855e26ddc4bafe2e1d84c34fa4625bbb3cea6b39ce7f9525c98f88882556535bca23e7a08a98f97111c8b18a8b60d5db5f611adc5689a881a88b81eef7e3daf6cb831b3973bc85b1d91b04a532ee692514f71f82cef57defd018b71c0fc0e586a388d3356174372e4d0b1669cb3bc39d60c9cff253300c824538f52e6d7beca2e5625552baa87228c4b6a71e3cebeeb91d7c5fb3e60543bc712ff7ac61f97f5703772fdddd42fe1d49f772508b9f9010000ffff0300504b030414000600080000002100f55b66c7e90200004a0d000012000000776f72642f666f6e745461626c652e786d6cd4565d6fdb20147d9fb4ff60f9bd35769d8f46752b356ba43d7493da4e7bc63689d10c5840eae4dfef024ee22a8966a6b5d26225311738e69c7bb8f8e66ec3eae095484505cfc2f8128501e18528295f65e18f97c5c5340c94c6bcc4b5e0240bb7448577b79f3fddb4b3a5e05a05309fab192bb2b0d2ba9945912a2ac2b0ba140de1d0b91492610d4db98a1896bfd6cd4521588335cd694df5364a101a871d8c1c8222964b5a902fa25833c2b59d1f495203a2e0aaa28ddaa1b543d05a21cb468a8228059c59edf018a67c0f13a747408c165228b1d49740a65b918582e931b277ac3e008cfc009223807141367e18d30e2382997d1c5afae18cf738b4ece1fcdd627a00aad465e58592ec748dcc5cac718555d547247e8b1aede1b6cc68c48ad9d7151712e7352041d603485c6081cd2ff0377ff6966c6cdc50086fbbad10b4338e19cc7ca18ca8e01b698327c130b7031acc8522318c79c5751622c3668caed008a5f04de02e0d2333b0a8b054c480b981c8859798d17abb8b4a8b6b3b1aaa8b6a177fc5929ad5bb2e4557d0b15639cac2078450f2b058842e1267e11c2293e9e8be8b24e659f673dd45aef611642285c5b1cdd8e11416673f069e1939258e1479deb25cd4278518c11523b36926204802adc96921927f23449f9213227e1b3908b18b9c1462fa36325088b9584b4aa431c7195b4cc00ad7d61ec616a9972d9828893c25c7926e4839dc14e9d54798e227945b73cca833be38fa78f802afb5f88f6cf148a4a42dc1ba22d2aa3128ddde2413b30eb0d88164b7b6c48fa46dc6d7166738c9ef70f606cf98bb7c0f62a85aaa94779d339e3e504c2de7e33a974c0750f4b4f48b24f91a8e1e1d3c3e9fd9dff7b6ec9bfded2e9ffded2f875df1787a9c714f5bbbb6af1c4f221760d1f733b4cb76bf8099b27132db430ced496f8e6b9a4b7a26d10b5bc06d8a6dc2df37d10fe9a9529ea4930f39dfe7988110f88c12e60dc7bde938ebbfff9b0e1af7954813a3c43e6294b095705091fb9312dd8dbafd0d0000ffff0300504b0304140006000800000021005f6a34135c0100008502000011000801646f6350726f70732f636f72652e786d6c20a2040128a00001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007c92d14ec2301486ef4d7c87a5f75bbbc1882cdb485488a22809331aef9aee008d5bd7b495c9dbdb0d18108997ddf9ced7ff9c351efd9485b301a5792512e47b043920589573b14ad05b36716f90a30d15392d2a0109da8246a3f4fa2a6632629582b9aa2428c3413bd62474c46482d6c6c80863cdd65052ed5942d8e2b2522535f6a8565852f6455780034206b80443736a286e84aeec8c68afcc59a794dfaa680539c3504009c268ec7b3e3eb20654a92f36b49513b2e4662be1227a2876f48fe61d58d7b557f75ad4e6f7f1c7ec79d18eea72d1ec8a014ae39c454c0135954aa7af8bf1fce1f1651ce393afcd060baacdcc2e7bc921bfdda6d34a835c7301ced3d6ee3bc67f91a64bc18637ff2b1db444778cf7c3efae80dcb1a1a3dd8887ca7befee3e9ba0342041dff5039704994fa2308c08f96cd29df51f85e53ec0ffc6d0ea5c32ccfc30ea0fcf8d0741da263e7f38e92f000000ffff0300504b030414000600080000002100144b1f23dc010000da03000010000801646f6350726f70732f6170702e786d6c20a2040128a00001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009c53cb6edb3010bc17e83f08bcc7945cc7688c3583c2419143db18b0929c596a6513a54882648cb85fdf9514ab74db53759a1dae86b30fc2ed6b678a2386a89d5db36a56b202ad728db6fb357bac3f5f7d64454cd236d2388b6b76c2c86ec5fb77b00dce63481a63411236aed92125bfe23caa037632cee8d8d249eb4227138561cf5ddb6a85774ebd7468139f97e592e36b42db6073e52741362aae8ee97f451ba77a7ff1a93e79d2135063e78d4c28bef57f1ae01301b54bd2d4ba437143f414c056ee318a39f011c0b30b4d14d755057c84b039c82055a2e689f94d750d3c23e093f7462b99a8afe2ab56c145d7a6e261305bf402c0f314a00276a85e824e275102cf43f8a26d6f65017c44e42dc87d90fe10c5b2373845b053d2e0866a17ad341181ff26e01e653fd7add4bdc1635a1d5125178aa87fd264e7acf82e23f61d5bb3a30c5adac4c6b43118b0f1310551eb64487b8a0798a7e5582f44352410b84c1c82c103e14b77c30df1a1a5dad23fcc56b9d9c1c36835b3933b3bdff187eac6755e5a6a309f1035f8477cf4b5bbeb97e3ad87976436f7679d0e3b2f15cde4c3625ee61b901dc18e586c68a4d3502602eea98460fa0be85fbbc7e69cf3f741bf534fe35315d57256d2372cd199a34d98de90f8050000ffff0300504b01022d001400060008000000210032916f5766010000a50500001300000000000000000000000000000000005b436f6e74656e745f54797065735d2e786d6c504b01022d00140006000800000021001e911ab7ef0000004e0200000b000000000000000000000000009f0300005f72656c732f2e72656c73504b01022d001400060008000000210023beafe1f3160000daa000001100000000000000000000000000bf060000776f72642f646f63756d656e742e786d6c504b01022d0014000600080000002100b66fc12e5c010000230500001c00000000000000000000000000e11d0000776f72642f5f72656c732f646f63756d656e742e786d6c2e72656c73504b01022d0014000600080000002100215aa28462060000db1d000015000000000000000000000000007f200000776f72642f7468656d652f7468656d65312e786d6c504b01022d00140006000800000021008fe19f2533040000370c0000110000000000000000000000000014270000776f72642f73657474696e67732e786d6c504b01022d0014000600080000002100d3b928610c050000323800001200000000000000000000000000762b0000776f72642f6e756d626572696e672e786d6c504b01022d00140006000800000021002114d7b5a00d0000e28200000f00000000000000000000000000b2300000776f72642f7374796c65732e786d6c504b01022d0014000600080000002100fce5bcac2e0100004b03000014000000000000000000000000007f3e0000776f72642f77656253657474696e67732e786d6c504b01022d0014000600080000002100f55b66c7e90200004a0d00001200000000000000000000000000df3f0000776f72642f666f6e745461626c652e786d6c504b01022d00140006000800000021005f6a34135c010000850200001100000000000000000000000000f8420000646f6350726f70732f636f72652e786d6c504b01022d0014000600080000002100144b1f23dc010000da03000010000000000000000000000000008b450000646f6350726f70732f6170702e786d6c504b0506000000000c000c00010300009d4800000000	Backend developer	Student	1	t	\N	Kenya	t
5	35	\N	\N	\N	\N	\N	\N	\N	f
\.


--
-- TOC entry 5064 (class 0 OID 16905)
-- Dependencies: 232
-- Data for Name: jobskills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobskills (job_skill_id, job_id, skill_id, importance_level) FROM stdin;
\.


--
-- TOC entry 5070 (class 0 OID 16958)
-- Dependencies: 238
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.matches (match_id, job_id, jobseeker_id, match_score, generated_date, status) FROM stdin;
\.


--
-- TOC entry 5072 (class 0 OID 16977)
-- Dependencies: 240
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (message_id, sender_id, receiver_id, related_job_id, content, sent_at, read_status) FROM stdin;
\.


--
-- TOC entry 5084 (class 0 OID 17087)
-- Dependencies: 252
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, type, message, is_read, created_at, related_user_id) FROM stdin;
\.


--
-- TOC entry 5056 (class 0 OID 16835)
-- Dependencies: 224
-- Data for Name: recruiters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recruiters (recruiter_id, user_id, company_id, "position") FROM stdin;
1	28	\N	\N
2	29	\N	\N
\.


--
-- TOC entry 5088 (class 0 OID 17118)
-- Dependencies: 256
-- Data for Name: server_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.server_status (id, name, status, uptime, load) FROM stdin;
\.


--
-- TOC entry 5058 (class 0 OID 16852)
-- Dependencies: 226
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skills (skill_id, skill_name, category, description) FROM stdin;
\.


--
-- TOC entry 5086 (class 0 OID 17110)
-- Dependencies: 254
-- Data for Name: system_metrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_metrics (id, cpu_usage, memory_usage, disk_usage, response_time, "timestamp") FROM stdin;
1	40	96	90	150	2025-04-19 15:49:46.101423+03
2	60	94	90	226	2025-04-19 15:50:18.396186+03
3	51	91	90	233	2025-04-19 15:50:43.904161+03
4	35	92	90	192	2025-04-19 15:51:13.894192+03
5	19	92	90	248	2025-04-19 15:51:42.829882+03
6	44	93	90	208	2025-04-19 15:52:13.539637+03
7	34	92	90	161	2025-04-19 15:52:43.43554+03
8	52	94	90	195	2025-04-19 15:53:14.115087+03
9	62	95	90	162	2025-04-19 15:53:47.685262+03
10	44	93	90	174	2025-04-19 15:54:32.873092+03
11	37	93	90	207	2025-04-19 15:54:44.197537+03
12	41	92	90	185	2025-04-19 15:55:23.406777+03
13	27	86	90	178	2025-04-19 15:55:43.090984+03
14	34	87	90	250	2025-04-19 15:56:13.818112+03
15	37	90	90	203	2025-04-19 15:56:42.769751+03
16	32	93	90	178	2025-04-19 15:57:14.011095+03
17	52	94	90	172	2025-04-19 15:57:44.195035+03
18	49	93	90	226	2025-04-19 15:58:51.648528+03
19	56	91	90	187	2025-04-19 15:59:46.974797+03
20	54	88	90	217	2025-04-19 16:00:47.124437+03
21	48	94	90	233	2025-04-19 16:01:51.61611+03
22	68	94	90	177	2025-04-19 16:02:54.566516+03
23	60	94	90	189	2025-04-19 16:05:06.120575+03
24	49	94	90	185	2025-04-19 16:05:10.281899+03
25	61	91	90	160	2025-04-19 16:05:50.656359+03
26	56	80	90	159	2025-04-19 16:06:46.511084+03
27	50	85	89	167	2025-04-19 16:07:46.410453+03
28	51	94	89	180	2025-04-19 16:08:47.253151+03
29	38	91	89	170	2025-04-19 16:09:06.952842+03
30	55	92	89	244	2025-04-19 16:09:47.388987+03
31	46	89	89	245	2025-04-19 16:15:56.767877+03
32	58	94	89	230	2025-04-19 16:17:40.999868+03
33	60	92	89	205	2025-04-19 16:17:41.170969+03
34	41	93	89	166	2025-04-19 16:18:00.667438+03
35	62	93	89	186	2025-04-19 16:18:32.345439+03
36	43	90	89	159	2025-04-19 16:19:25.11823+03
37	52	94	89	176	2025-04-19 16:19:33.081049+03
38	55	92	89	204	2025-04-19 16:20:01.849989+03
39	58	87	89	232	2025-04-19 16:20:48.319201+03
40	41	85	89	237	2025-04-19 16:21:46.361737+03
41	50	87	89	158	2025-04-19 16:22:46.019124+03
42	66	91	89	226	2025-04-19 16:23:46.921134+03
43	40	91	89	212	2025-04-19 16:26:50.489358+03
44	56	92	89	181	2025-04-19 16:27:18.014194+03
45	57	93	89	185	2025-04-19 16:27:32.086311+03
46	53	95	89	187	2025-04-19 16:28:02.607941+03
47	63	95	89	172	2025-04-19 16:28:35.782159+03
48	54	92	89	196	2025-04-19 16:29:51.584263+03
49	75	94	89	205	2025-04-19 16:31:32.228495+03
50	53	93	89	206	2025-04-19 16:31:32.227127+03
51	64	94	89	158	2025-04-19 16:32:04.618739+03
52	52	94	89	220	2025-04-19 16:32:34.908458+03
53	56	94	89	220	2025-04-19 16:33:04.301908+03
54	45	94	89	161	2025-04-19 16:33:37.133714+03
55	46	94	89	187	2025-04-19 16:34:03.990323+03
56	57	95	89	176	2025-04-19 16:34:34.329604+03
57	62	94	89	179	2025-04-19 16:35:10.854807+03
58	68	92	89	221	2025-04-19 16:35:48.403997+03
59	40	89	89	243	2025-04-19 16:36:26.187679+03
60	40	89	89	199	2025-04-19 16:37:00.073043+03
61	44	90	89	157	2025-04-19 16:37:30.858746+03
62	25	91	89	197	2025-04-19 16:37:59.854991+03
63	40	94	89	194	2025-04-19 16:38:31.109614+03
64	33	93	89	237	2025-04-19 16:39:00.918593+03
65	40	94	89	158	2025-04-19 16:40:41.973767+03
66	61	92	89	193	2025-04-19 16:41:05.980364+03
67	45	90	89	206	2025-04-19 16:41:34.776903+03
68	35	92	89	156	2025-04-19 16:42:00.887156+03
69	49	94	89	169	2025-04-19 16:43:07.446853+03
70	69	94	89	205	2025-04-19 16:43:50.563802+03
71	66	89	89	225	2025-04-19 16:44:48.671162+03
72	40	88	89	214	2025-04-19 16:44:59.971184+03
73	38	90	89	214	2025-04-19 16:45:32.156968+03
74	47	85	89	207	2025-04-19 16:46:00.925653+03
75	39	87	89	166	2025-04-19 16:46:33.57564+03
76	58	92	89	226	2025-04-19 16:47:46.824539+03
77	57	95	89	207	2025-04-19 16:48:54.085637+03
78	82	92	89	199	2025-04-19 16:50:16.830209+03
79	67	88	89	236	2025-04-19 16:51:29.83846+03
80	27	88	89	151	2025-04-19 16:51:33.403687+03
81	32	89	89	163	2025-04-19 16:52:03.990621+03
82	37	90	89	207	2025-04-19 16:52:33.670861+03
83	51	90	89	226	2025-04-19 16:53:04.069002+03
84	38	90	89	228	2025-04-19 16:53:45.82947+03
85	37	91	89	165	2025-04-19 16:54:45.566617+03
86	41	91	89	182	2025-04-19 16:55:47.03978+03
87	45	92	89	182	2025-04-19 16:56:45.600817+03
88	46	94	89	161	2025-04-19 16:57:48.190259+03
89	46	95	89	235	2025-04-19 16:58:51.265235+03
90	36	92	89	153	2025-04-19 16:59:50.910543+03
91	52	94	89	187	2025-04-19 17:00:49.33865+03
92	42	87	89	241	2025-04-19 17:01:45.774252+03
93	19	89	89	202	2025-04-19 17:02:47.259362+03
94	49	94	89	195	2025-04-20 15:03:05.711168+03
\.


--
-- TOC entry 5074 (class 0 OID 17003)
-- Dependencies: 242
-- Data for Name: systemmetrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.systemmetrics (metric_id, metric_name, value, recorded_at) FROM stdin;
1	total_users_growth	1.25	2025-03-21 12:56:52.723583
2	job_seekers_growth	2.00	2025-03-21 12:56:52.723583
3	recruiters_growth	0.00	2025-03-21 12:56:52.723583
4	total_users_growth	1.23	2025-03-22 12:56:52.723583
5	job_seekers_growth	0.00	2025-03-22 12:56:52.723583
6	recruiters_growth	4.00	2025-03-22 12:56:52.723583
7	total_users_growth	1.22	2025-03-23 12:56:52.723583
8	job_seekers_growth	1.96	2025-03-23 12:56:52.723583
9	recruiters_growth	0.00	2025-03-23 12:56:52.723583
10	total_users_growth	1.20	2025-03-24 12:56:52.723583
11	job_seekers_growth	0.00	2025-03-24 12:56:52.723583
12	recruiters_growth	3.85	2025-03-24 12:56:52.723583
13	total_users_growth	1.19	2025-03-25 12:56:52.723583
14	job_seekers_growth	1.92	2025-03-25 12:56:52.723583
15	recruiters_growth	0.00	2025-03-25 12:56:52.723583
16	total_users_growth	1.18	2025-03-26 12:56:52.723583
17	job_seekers_growth	0.00	2025-03-26 12:56:52.723583
18	recruiters_growth	3.70	2025-03-26 12:56:52.723583
19	total_users_growth	1.16	2025-03-27 12:56:52.723583
20	job_seekers_growth	1.89	2025-03-27 12:56:52.723583
21	recruiters_growth	0.00	2025-03-27 12:56:52.723583
22	total_users_growth	1.15	2025-03-28 12:56:52.723583
23	job_seekers_growth	0.00	2025-03-28 12:56:52.723583
24	recruiters_growth	3.57	2025-03-28 12:56:52.723583
25	total_users_growth	1.14	2025-03-29 12:56:52.723583
26	job_seekers_growth	1.85	2025-03-29 12:56:52.723583
27	recruiters_growth	0.00	2025-03-29 12:56:52.723583
28	total_users_growth	1.12	2025-03-30 12:56:52.723583
29	job_seekers_growth	0.00	2025-03-30 12:56:52.723583
30	recruiters_growth	3.45	2025-03-30 12:56:52.723583
31	total_users_growth	1.11	2025-03-31 12:56:52.723583
32	job_seekers_growth	1.82	2025-03-31 12:56:52.723583
33	recruiters_growth	0.00	2025-03-31 12:56:52.723583
34	total_users_growth	1.10	2025-04-01 12:56:52.723583
35	job_seekers_growth	0.00	2025-04-01 12:56:52.723583
36	recruiters_growth	0.00	2025-04-01 12:56:52.723583
37	total_users_growth	1.09	2025-04-02 12:56:52.723583
38	job_seekers_growth	1.79	2025-04-02 12:56:52.723583
39	recruiters_growth	0.00	2025-04-02 12:56:52.723583
40	total_users_growth	1.08	2025-04-03 12:56:52.723583
41	job_seekers_growth	0.00	2025-04-03 12:56:52.723583
42	recruiters_growth	3.33	2025-04-03 12:56:52.723583
43	total_users_growth	1.06	2025-04-04 12:56:52.723583
44	job_seekers_growth	1.75	2025-04-04 12:56:52.723583
45	recruiters_growth	0.00	2025-04-04 12:56:52.723583
46	total_users_growth	1.05	2025-04-05 12:56:52.723583
47	job_seekers_growth	0.00	2025-04-05 12:56:52.723583
48	recruiters_growth	0.00	2025-04-05 12:56:52.723583
49	total_users_growth	1.04	2025-04-06 12:56:52.723583
50	job_seekers_growth	1.72	2025-04-06 12:56:52.723583
51	recruiters_growth	0.00	2025-04-06 12:56:52.723583
52	total_users_growth	1.03	2025-04-07 12:56:52.723583
53	job_seekers_growth	0.00	2025-04-07 12:56:52.723583
54	recruiters_growth	3.23	2025-04-07 12:56:52.723583
55	total_users_growth	1.02	2025-04-08 12:56:52.723583
56	job_seekers_growth	1.69	2025-04-08 12:56:52.723583
57	recruiters_growth	0.00	2025-04-08 12:56:52.723583
58	total_users_growth	1.01	2025-04-09 12:56:52.723583
59	job_seekers_growth	0.00	2025-04-09 12:56:52.723583
60	recruiters_growth	0.00	2025-04-09 12:56:52.723583
61	total_users_growth	0.00	2025-04-10 12:56:52.723583
62	job_seekers_growth	0.00	2025-04-10 12:56:52.723583
63	recruiters_growth	3.13	2025-04-10 12:56:52.723583
64	total_users_growth	1.00	2025-04-11 12:56:52.723583
65	job_seekers_growth	1.67	2025-04-11 12:56:52.723583
66	recruiters_growth	0.00	2025-04-11 12:56:52.723583
67	total_users_growth	0.99	2025-04-12 12:56:52.723583
68	job_seekers_growth	0.00	2025-04-12 12:56:52.723583
69	recruiters_growth	0.00	2025-04-12 12:56:52.723583
70	total_users_growth	0.98	2025-04-13 12:56:52.723583
71	job_seekers_growth	1.64	2025-04-13 12:56:52.723583
72	recruiters_growth	0.00	2025-04-13 12:56:52.723583
73	total_users_growth	0.97	2025-04-14 12:56:52.723583
74	job_seekers_growth	0.00	2025-04-14 12:56:52.723583
75	recruiters_growth	3.03	2025-04-14 12:56:52.723583
76	total_users_growth	0.96	2025-04-15 12:56:52.723583
77	job_seekers_growth	1.61	2025-04-15 12:56:52.723583
78	recruiters_growth	0.00	2025-04-15 12:56:52.723583
79	total_users_growth	0.95	2025-04-16 12:56:52.723583
80	job_seekers_growth	0.00	2025-04-16 12:56:52.723583
81	recruiters_growth	0.00	2025-04-16 12:56:52.723583
82	total_users_growth	0.94	2025-04-17 12:56:52.723583
83	job_seekers_growth	1.59	2025-04-17 12:56:52.723583
84	recruiters_growth	0.00	2025-04-17 12:56:52.723583
85	total_users_growth	0.93	2025-04-18 12:56:52.723583
86	job_seekers_growth	0.00	2025-04-18 12:56:52.723583
87	recruiters_growth	2.94	2025-04-18 12:56:52.723583
88	total_users_growth	1.85	2025-04-19 12:56:52.723583
89	job_seekers_growth	1.56	2025-04-19 12:56:52.723583
90	recruiters_growth	0.00	2025-04-19 12:56:52.723583
\.


--
-- TOC entry 5052 (class 0 OID 16807)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, password, full_name, user_type, created_at, updated_at, last_login) FROM stdin;
9	kyalo.kathini22@students.dkut.ac.ke	$2b$10$IjKoq9YAh8yum1AnGCFDjum4cFReXpwolHJyMK3UYQwYPKxM7oUpu	Josephine Kathini	recruiter	2025-04-14 02:01:48.716831	2025-04-14 02:01:48.716831	\N
12	gmail@gmail.com	$2b$10$oXRXoRwTDSoaRff0ZVC7XOsWalQM.p1Hmpj1jMVpPMyy3IpHqVhkG	Form Tester	job_seeker	2025-04-15 16:01:20.946122	2025-04-15 16:01:20.946122	\N
13	admin@gmail.com	$2b$10$J6TqLGFqeWQxeRaidDMKpOXhUAm.7zOu4i/3FZeR2cUoPd9wMWXcC	Admin Josephine	admin	2025-04-17 15:51:36.132903	2025-04-17 15:51:36.132903	\N
8	josephine04kyalo@gmail.com	$2b$10$niw/4xDLMXLQunXUUums/ekgoyPWFHtbakV75lQSbsQsUOwuq/35S	Josephine Kyalo	job_seeker	2025-04-14 01:58:06.049151	2025-04-14 01:58:06.049151	2025-04-17 17:44:37.981932
17	testeradmin@gmail.com	$2b$10$UTnO.rIDpBo85lysz0MNVeFeKtfeXRocY8XrPTkmeD755pVcmKzLC	Admin Tester	admin	2025-04-17 18:00:28.554796	2025-04-17 18:00:28.554796	\N
20	admin254@gmail.com	$2b$10$BLKPz72cggMMxsTpovnhZ.QEn8MBGxSPWL/Y6CHNm7LncoaTqJCHO	Moses Blaise	admin	2025-04-18 01:37:09.923725	2025-04-18 01:37:09.923725	\N
21	koechkathini@gmail.com	$2b$10$l.ezap7Wq1bknp6WQU3WHOxyMPIdOdYdzUMWQGW5KeMcrSXWzAy9W	Kathini Koech	admin	2025-04-18 01:56:42.818311	2025-04-18 01:56:42.818311	\N
22	markwambua@gmail.com	$2b$10$v23DJK2ZgdpzW5J7dJzjI.8fLQ.ahMs.G7Qngrxc/VQsK73VRYc9y	Mark Wambua	recruiter	2025-04-18 03:00:28.020368	2025-04-18 03:00:28.020368	\N
23	sabrinakoech@gmail.com	$2b$10$aZwP3EGP96XpDPVMBPVdoOwgtgswYrKIk15UiaotSh.8CsEjoH2VS	Sabrina Kipkoech	recruiter	2025-04-18 03:02:43.359504	2025-04-18 03:02:43.359504	\N
24	chebetmarya@gmail.com	$2b$10$id8PunRlNqtDbqV.rRKsQOLtVaoB2qWIgleH.CN.eiCH3kzxK3fFa	Marya Chebet	admin	2025-04-18 03:03:48.716236	2025-04-18 03:03:48.716236	\N
25	dennisjohn@gmail.com	$2b$10$.MrpQ4ELGA8AXCW7AZ0dzuiWxoucPTrC5sQ4JvQdsc8OcTaAq/P4W	Dennis John	admin	2025-04-18 03:23:09.311275	2025-04-18 03:23:09.311275	\N
26	kyaloblaise@gmail.com	$2b$10$T1mKW8xKhfvGQPozYvM/2eo8YZtbFvwOOqENzuipoPWYEG/Gv1TbC	Blaise Kyalo	admin	2025-04-18 03:41:44.42717	2025-04-18 03:41:44.42717	\N
27	kevinaskari@gmail.com	$2b$10$imel8KcletIYWM3lYcF7su1FGKgQ885IWCzgN4K49GXg4phFSMaSa	Kevina Askari	admin	2025-04-18 03:57:07.625311	2025-04-18 03:57:07.625311	\N
28	felistusmutee@gmail.com	$2b$10$MAVub.o3brS2rhad.iAbaOVz.3VBi0UoJEloAFp9.TYDDvWdXGEmi	Felistus Mutethya	recruiter	2025-04-18 03:58:18.965855	2025-04-18 03:58:18.965855	\N
29	njerunode@gmail.com	$2b$10$y0Yda3M1MeRykidfv5nFO.BuBgTc0zDC1/JdbwI8TO9TK5fk0Rs/6	Arnold Njeru	recruiter	2025-04-18 04:01:30.970867	2025-04-18 04:01:30.970867	\N
15	cynthiamutheu@gmail.com	$2b$10$cBQlcHuakiRdJ2PoWOa0tOBBBqJAtQKPubL0kwyjEqmdlCYSXTdvy	Cynthia Mutheu	job_seeker	2025-04-17 17:55:31.548601	2025-04-18 04:10:43.699267	\N
18	lastadmin@gmail.com	$2b$10$47PcQqq8RTUZtDqKv8ACH.AgmjE0tLZD3kfKk8F0oZ2Ba0EZhQNRG	Eric Kyalo	admin	2025-04-17 18:31:44.262479	2025-04-18 04:11:55.213316	\N
30	masimbunde@gmail.com	$2b$10$XTH83y7VzECuwMbM6cf70ef1mkEUlJcWGV5BP4efsp3Z9uC4fYFbm	Muinde Masimbu	admin	2025-04-18 12:51:22.460212	2025-04-18 12:51:22.460212	\N
31	annsammy@gmail.com	$2b$10$ok4EXUfI1GtP6DOX.bg1.ez.fGm4ljgRvHKh4tDboQjRmTuUzPN5O	Ann Sammy	admin	2025-04-18 13:18:39.557781	2025-04-18 13:18:39.557781	2025-04-19 16:50:55.665292
33	mainakitheka@gmail.com	$2b$10$EqF2.wROqcNTCehsgGMsueMlM4jZQMUG0cYTdeTTcFl9RMmqCm.wq	Maina Kitheka	admin	2025-04-19 10:55:21.61588	2025-04-19 10:55:21.61588	2025-04-19 12:00:30.458378
11	guinkathini@gmail.com	$2b$10$wDODv/h2H8h/RtP/szQEd.P2dhjaXRvVDyEbjo1.clNGRZrypwyga	Guin Kajose	job_seeker	2025-04-15 15:21:45.419004	2025-04-19 12:46:46.501721	2025-04-19 11:18:28.49641
35	gabmary@gmail.com	$2b$10$VOy.z3/lZ.XQXvpyNifj0eH5oIsxC7meqhnr/0gVZ70/C.5CBlJaa	Mary Gabriel	job_seeker	2025-04-19 12:48:50.080703	2025-04-19 12:48:50.080703	\N
34	kithekamaina@gmail.com	$2b$10$IROLRc4Xkk7hL54IjcdV9eu1xHSizHswfHs5lmYHVxGkgTanthx/S	Anthony Kitheka	admin	2025-04-19 10:57:44.421384	2025-04-19 10:57:44.421384	2025-04-19 12:57:54.520484
32	josekhan@gmail.com	$2b$10$yY4xB1ELPvONoSxWYp/jCOCkwCCSF2QC8yeukya3Ii0l/DXD.pTb.	Joseph Khan	admin	2025-04-18 14:17:23.939122	2025-04-18 14:17:23.939122	2025-04-19 16:17:22.496497
\.


--
-- TOC entry 5060 (class 0 OID 16864)
-- Dependencies: 228
-- Data for Name: userskills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userskills (user_skill_id, user_id, skill_id, proficiency_score, verified, assessment_date) FROM stdin;
\.


--
-- TOC entry 5115 (class 0 OID 0)
-- Dependencies: 243
-- Name: aiaccuracylogs_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.aiaccuracylogs_log_id_seq', 1, false);


--
-- TOC entry 5116 (class 0 OID 0)
-- Dependencies: 233
-- Name: applications_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_application_id_seq', 1, false);


--
-- TOC entry 5117 (class 0 OID 0)
-- Dependencies: 235
-- Name: assessments_assessment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assessments_assessment_id_seq', 1, false);


--
-- TOC entry 5118 (class 0 OID 0)
-- Dependencies: 217
-- Name: companies_company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_company_id_seq', 1, false);


--
-- TOC entry 5119 (class 0 OID 0)
-- Dependencies: 247
-- Name: historicalmetrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historicalmetrics_id_seq', 93, true);


--
-- TOC entry 5120 (class 0 OID 0)
-- Dependencies: 229
-- Name: jobs_job_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_job_id_seq', 1, false);


--
-- TOC entry 5121 (class 0 OID 0)
-- Dependencies: 245
-- Name: jobseeker_employment_preferences_preference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobseeker_employment_preferences_preference_id_seq', 1, false);


--
-- TOC entry 5122 (class 0 OID 0)
-- Dependencies: 221
-- Name: jobseekers_jobseeker_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobseekers_jobseeker_id_seq', 5, true);


--
-- TOC entry 5123 (class 0 OID 0)
-- Dependencies: 231
-- Name: jobskills_job_skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobskills_job_skill_id_seq', 1, false);


--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 237
-- Name: matches_match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.matches_match_id_seq', 1, false);


--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 239
-- Name: messages_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_message_id_seq', 1, false);


--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 249
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 251
-- Name: notifications_related_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_related_user_id_seq', 1, false);


--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 250
-- Name: notifications_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_user_id_seq', 1, false);


--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 223
-- Name: recruiters_recruiter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recruiters_recruiter_id_seq', 2, true);


--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 255
-- Name: server_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.server_status_id_seq', 1, false);


--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 225
-- Name: skills_skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skills_skill_id_seq', 2, true);


--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 253
-- Name: system_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_metrics_id_seq', 94, true);


--
-- TOC entry 5133 (class 0 OID 0)
-- Dependencies: 241
-- Name: systemmetrics_metric_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.systemmetrics_metric_id_seq', 90, true);


--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 35, true);


--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 227
-- Name: userskills_user_skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.userskills_user_skill_id_seq', 1, false);


--
-- TOC entry 4867 (class 2606 OID 17019)
-- Name: aiaccuracylogs aiaccuracylogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aiaccuracylogs
    ADD CONSTRAINT aiaccuracylogs_pkey PRIMARY KEY (log_id);


--
-- TOC entry 4856 (class 2606 OID 16932)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (application_id);


--
-- TOC entry 4858 (class 2606 OID 16951)
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (assessment_id);


--
-- TOC entry 4836 (class 2606 OID 16805)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (company_id);


--
-- TOC entry 4873 (class 2606 OID 17052)
-- Name: historicalmetrics historicalmetrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historicalmetrics
    ADD CONSTRAINT historicalmetrics_pkey PRIMARY KEY (id);


--
-- TOC entry 4852 (class 2606 OID 16893)
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (job_id);


--
-- TOC entry 4869 (class 2606 OID 17030)
-- Name: jobseeker_employment_preferences jobseeker_employment_preferenc_jobseeker_id_employment_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobseeker_employment_preferences
    ADD CONSTRAINT jobseeker_employment_preferenc_jobseeker_id_employment_type_key UNIQUE (jobseeker_id, employment_type);


--
-- TOC entry 4871 (class 2606 OID 17028)
-- Name: jobseeker_employment_preferences jobseeker_employment_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobseeker_employment_preferences
    ADD CONSTRAINT jobseeker_employment_preferences_pkey PRIMARY KEY (preference_id);


--
-- TOC entry 4842 (class 2606 OID 16828)
-- Name: jobseekers jobseekers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobseekers
    ADD CONSTRAINT jobseekers_pkey PRIMARY KEY (jobseeker_id);


--
-- TOC entry 4854 (class 2606 OID 16911)
-- Name: jobskills jobskills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobskills
    ADD CONSTRAINT jobskills_pkey PRIMARY KEY (job_skill_id);


--
-- TOC entry 4860 (class 2606 OID 16965)
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (match_id);


--
-- TOC entry 4862 (class 2606 OID 16986)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (message_id);


--
-- TOC entry 4876 (class 2606 OID 17098)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4844 (class 2606 OID 16840)
-- Name: recruiters recruiters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recruiters
    ADD CONSTRAINT recruiters_pkey PRIMARY KEY (recruiter_id);


--
-- TOC entry 4881 (class 2606 OID 17127)
-- Name: server_status server_status_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.server_status
    ADD CONSTRAINT server_status_name_key UNIQUE (name);


--
-- TOC entry 4883 (class 2606 OID 17125)
-- Name: server_status server_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.server_status
    ADD CONSTRAINT server_status_pkey PRIMARY KEY (id);


--
-- TOC entry 4846 (class 2606 OID 16860)
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (skill_id);


--
-- TOC entry 4848 (class 2606 OID 16862)
-- Name: skills skills_skill_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_skill_name_key UNIQUE (skill_name);


--
-- TOC entry 4879 (class 2606 OID 17116)
-- Name: system_metrics system_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_metrics
    ADD CONSTRAINT system_metrics_pkey PRIMARY KEY (id);


--
-- TOC entry 4865 (class 2606 OID 17009)
-- Name: systemmetrics systemmetrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.systemmetrics
    ADD CONSTRAINT systemmetrics_pkey PRIMARY KEY (metric_id);


--
-- TOC entry 4838 (class 2606 OID 16819)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4840 (class 2606 OID 16817)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4850 (class 2606 OID 16871)
-- Name: userskills userskills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userskills
    ADD CONSTRAINT userskills_pkey PRIMARY KEY (user_skill_id);


--
-- TOC entry 4874 (class 1259 OID 17054)
-- Name: idx_hist_metric_name_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hist_metric_name_date ON public.historicalmetrics USING btree (metric_name, recorded_at);


--
-- TOC entry 4863 (class 1259 OID 17053)
-- Name: idx_metric_name_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_metric_name_date ON public.systemmetrics USING btree (metric_name, recorded_at);


--
-- TOC entry 4877 (class 1259 OID 17128)
-- Name: idx_system_metrics_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_system_metrics_timestamp ON public.system_metrics USING btree ("timestamp");


--
-- TOC entry 4893 (class 2606 OID 16933)
-- Name: applications applications_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(job_id) ON DELETE CASCADE;


--
-- TOC entry 4894 (class 2606 OID 16938)
-- Name: applications applications_jobseeker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_jobseeker_id_fkey FOREIGN KEY (jobseeker_id) REFERENCES public.jobseekers(jobseeker_id) ON DELETE CASCADE;


--
-- TOC entry 4895 (class 2606 OID 16952)
-- Name: assessments assessments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4889 (class 2606 OID 16894)
-- Name: jobs jobs_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE SET NULL;


--
-- TOC entry 4890 (class 2606 OID 16899)
-- Name: jobs jobs_recruiter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_recruiter_id_fkey FOREIGN KEY (recruiter_id) REFERENCES public.recruiters(recruiter_id) ON DELETE SET NULL;


--
-- TOC entry 4901 (class 2606 OID 17031)
-- Name: jobseeker_employment_preferences jobseeker_employment_preferences_jobseeker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobseeker_employment_preferences
    ADD CONSTRAINT jobseeker_employment_preferences_jobseeker_id_fkey FOREIGN KEY (jobseeker_id) REFERENCES public.jobseekers(jobseeker_id) ON DELETE CASCADE;


--
-- TOC entry 4884 (class 2606 OID 16829)
-- Name: jobseekers jobseekers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobseekers
    ADD CONSTRAINT jobseekers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4891 (class 2606 OID 16912)
-- Name: jobskills jobskills_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobskills
    ADD CONSTRAINT jobskills_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(job_id) ON DELETE CASCADE;


--
-- TOC entry 4892 (class 2606 OID 16917)
-- Name: jobskills jobskills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobskills
    ADD CONSTRAINT jobskills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(skill_id) ON DELETE CASCADE;


--
-- TOC entry 4896 (class 2606 OID 16966)
-- Name: matches matches_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(job_id) ON DELETE CASCADE;


--
-- TOC entry 4897 (class 2606 OID 16971)
-- Name: matches matches_jobseeker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_jobseeker_id_fkey FOREIGN KEY (jobseeker_id) REFERENCES public.jobseekers(jobseeker_id) ON DELETE CASCADE;


--
-- TOC entry 4898 (class 2606 OID 16992)
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4899 (class 2606 OID 16997)
-- Name: messages messages_related_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_related_job_id_fkey FOREIGN KEY (related_job_id) REFERENCES public.jobs(job_id) ON DELETE CASCADE;


--
-- TOC entry 4900 (class 2606 OID 16987)
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4902 (class 2606 OID 17104)
-- Name: notifications notifications_related_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_related_user_id_fkey FOREIGN KEY (related_user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- TOC entry 4903 (class 2606 OID 17099)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4885 (class 2606 OID 16846)
-- Name: recruiters recruiters_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recruiters
    ADD CONSTRAINT recruiters_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE SET NULL;


--
-- TOC entry 4886 (class 2606 OID 16841)
-- Name: recruiters recruiters_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recruiters
    ADD CONSTRAINT recruiters_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4887 (class 2606 OID 16877)
-- Name: userskills userskills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userskills
    ADD CONSTRAINT userskills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(skill_id) ON DELETE CASCADE;


--
-- TOC entry 4888 (class 2606 OID 16872)
-- Name: userskills userskills_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userskills
    ADD CONSTRAINT userskills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2025-04-23 11:50:17

--
-- PostgreSQL database dump complete
--

