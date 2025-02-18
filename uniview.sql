PGDMP     )        	            |            uniview    15.2    15.2 4    Q           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            R           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            S           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            T           1262    32769    uniview    DATABASE     �   CREATE DATABASE uniview WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE uniview;
                postgres    false            �            1259    32817    advises    TABLE     w   CREATE TABLE public.advises (
    eid character varying(9) NOT NULL,
    departmentid character varying(8) NOT NULL
);
    DROP TABLE public.advises;
       public         heap    postgres    false            �            1259    32807    advisors    TABLE     o   CREATE TABLE public.advisors (
    eid character varying(9) NOT NULL,
    departmentid character varying(8)
);
    DROP TABLE public.advisors;
       public         heap    postgres    false            �            1259    32790    courses    TABLE     �  CREATE TABLE public.courses (
    name character varying(8),
    crn character varying(9) NOT NULL,
    starttime timestamp without time zone,
    endtime timestamp without time zone,
    departmentid character varying(8),
    credits integer,
    semester character(1),
    year integer,
    CONSTRAINT courses_credits_check CHECK (((credits >= 1) AND (credits <= 4))),
    CONSTRAINT courses_semester_check CHECK ((semester = ANY (ARRAY['S'::bpchar, 'F'::bpchar, 'U'::bpchar])))
);
    DROP TABLE public.courses;
       public         heap    postgres    false            �            1259    32770    departments    TABLE     �   CREATE TABLE public.departments (
    departmentid character varying(8) NOT NULL,
    name character varying(30),
    abbreviation character varying(5),
    building character varying(100),
    office character varying(100)
);
    DROP TABLE public.departments;
       public         heap    postgres    false            �            1259    32802 	   employees    TABLE       CREATE TABLE public.employees (
    eid character varying(9) NOT NULL,
    hashpw character varying(255),
    email character varying(50),
    firstname character varying(15) NOT NULL,
    lastname character varying(15) NOT NULL,
    role character varying(20)
);
    DROP TABLE public.employees;
       public         heap    postgres    false            �            1259    32895    enrolled_in    TABLE     �   CREATE TABLE public.enrolled_in (
    uid character varying(9) NOT NULL,
    crn character varying(9) NOT NULL,
    grade numeric(5,2),
    completed boolean
);
    DROP TABLE public.enrolled_in;
       public         heap    postgres    false            �            1259    32847    instructors    TABLE     r   CREATE TABLE public.instructors (
    eid character varying(9) NOT NULL,
    departmentid character varying(8)
);
    DROP TABLE public.instructors;
       public         heap    postgres    false            �            1259    32777    majors    TABLE     o   CREATE TABLE public.majors (
    name character varying(50) NOT NULL,
    departmentid character varying(8)
);
    DROP TABLE public.majors;
       public         heap    postgres    false            �            1259    32832    staff    TABLE     l   CREATE TABLE public.staff (
    eid character varying(9) NOT NULL,
    departmentid character varying(8)
);
    DROP TABLE public.staff;
       public         heap    postgres    false            �            1259    32877    students    TABLE     �  CREATE TABLE public.students (
    uid character varying(9) NOT NULL,
    hashpw character varying(255),
    email character varying(50),
    firstname character varying(15) NOT NULL,
    lastname character varying(15) NOT NULL,
    majorin character varying(50) NOT NULL,
    gpa numeric(3,2) NOT NULL,
    advised_by character varying(9),
    credits integer DEFAULT 0,
    CONSTRAINT students_gpa_check CHECK (((gpa >= (0)::numeric) AND (gpa <= 4.0)))
);
    DROP TABLE public.students;
       public         heap    postgres    false            �            1259    32862    teaches    TABLE     n   CREATE TABLE public.teaches (
    eid character varying(9) NOT NULL,
    crn character varying(9) NOT NULL
);
    DROP TABLE public.teaches;
       public         heap    postgres    false            I          0    32817    advises 
   TABLE DATA           4   COPY public.advises (eid, departmentid) FROM stdin;
    public          postgres    false    219   @       H          0    32807    advisors 
   TABLE DATA           5   COPY public.advisors (eid, departmentid) FROM stdin;
    public          postgres    false    218   q@       F          0    32790    courses 
   TABLE DATA           g   COPY public.courses (name, crn, starttime, endtime, departmentid, credits, semester, year) FROM stdin;
    public          postgres    false    216   �@       D          0    32770    departments 
   TABLE DATA           Y   COPY public.departments (departmentid, name, abbreviation, building, office) FROM stdin;
    public          postgres    false    214   zA       G          0    32802 	   employees 
   TABLE DATA           R   COPY public.employees (eid, hashpw, email, firstname, lastname, role) FROM stdin;
    public          postgres    false    217   B       N          0    32895    enrolled_in 
   TABLE DATA           A   COPY public.enrolled_in (uid, crn, grade, completed) FROM stdin;
    public          postgres    false    224   �C       K          0    32847    instructors 
   TABLE DATA           8   COPY public.instructors (eid, departmentid) FROM stdin;
    public          postgres    false    221   ;D       E          0    32777    majors 
   TABLE DATA           4   COPY public.majors (name, departmentid) FROM stdin;
    public          postgres    false    215   �D       J          0    32832    staff 
   TABLE DATA           2   COPY public.staff (eid, departmentid) FROM stdin;
    public          postgres    false    220   �D       M          0    32877    students 
   TABLE DATA           n   COPY public.students (uid, hashpw, email, firstname, lastname, majorin, gpa, advised_by, credits) FROM stdin;
    public          postgres    false    223   E       L          0    32862    teaches 
   TABLE DATA           +   COPY public.teaches (eid, crn) FROM stdin;
    public          postgres    false    222   �E       �           2606    32821    advises advises_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.advises
    ADD CONSTRAINT advises_pkey PRIMARY KEY (eid, departmentid);
 >   ALTER TABLE ONLY public.advises DROP CONSTRAINT advises_pkey;
       public            postgres    false    219    219            �           2606    32811    advisors advisors_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.advisors
    ADD CONSTRAINT advisors_pkey PRIMARY KEY (eid);
 @   ALTER TABLE ONLY public.advisors DROP CONSTRAINT advisors_pkey;
       public            postgres    false    218            �           2606    32796    courses courses_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (crn);
 >   ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_pkey;
       public            postgres    false    216            �           2606    32776 "   departments departments_office_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_office_key UNIQUE (office);
 L   ALTER TABLE ONLY public.departments DROP CONSTRAINT departments_office_key;
       public            postgres    false    214            �           2606    32774    departments departments_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (departmentid);
 F   ALTER TABLE ONLY public.departments DROP CONSTRAINT departments_pkey;
       public            postgres    false    214            �           2606    32806    employees employees_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (eid);
 B   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_pkey;
       public            postgres    false    217            �           2606    32899    enrolled_in enrolled_in_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.enrolled_in
    ADD CONSTRAINT enrolled_in_pkey PRIMARY KEY (uid, crn);
 F   ALTER TABLE ONLY public.enrolled_in DROP CONSTRAINT enrolled_in_pkey;
       public            postgres    false    224    224            �           2606    32851    instructors instructors_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.instructors
    ADD CONSTRAINT instructors_pkey PRIMARY KEY (eid);
 F   ALTER TABLE ONLY public.instructors DROP CONSTRAINT instructors_pkey;
       public            postgres    false    221            �           2606    32781    majors majors_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.majors
    ADD CONSTRAINT majors_pkey PRIMARY KEY (name);
 <   ALTER TABLE ONLY public.majors DROP CONSTRAINT majors_pkey;
       public            postgres    false    215            �           2606    32836    staff staff_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (eid);
 :   ALTER TABLE ONLY public.staff DROP CONSTRAINT staff_pkey;
       public            postgres    false    220            �           2606    32884    students students_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (uid);
 @   ALTER TABLE ONLY public.students DROP CONSTRAINT students_pkey;
       public            postgres    false    223            �           2606    32866    teaches teaches_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.teaches
    ADD CONSTRAINT teaches_pkey PRIMARY KEY (eid, crn);
 >   ALTER TABLE ONLY public.teaches DROP CONSTRAINT teaches_pkey;
       public            postgres    false    222    222            �           2606    32827 !   advises advises_departmentid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.advises
    ADD CONSTRAINT advises_departmentid_fkey FOREIGN KEY (departmentid) REFERENCES public.departments(departmentid);
 K   ALTER TABLE ONLY public.advises DROP CONSTRAINT advises_departmentid_fkey;
       public          postgres    false    219    3219    214            �           2606    32822    advises advises_eid_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.advises
    ADD CONSTRAINT advises_eid_fkey FOREIGN KEY (eid) REFERENCES public.advisors(eid);
 B   ALTER TABLE ONLY public.advises DROP CONSTRAINT advises_eid_fkey;
       public          postgres    false    219    218    3227            �           2606    32812    advisors advisors_eid_fkey    FK CONSTRAINT     z   ALTER TABLE ONLY public.advisors
    ADD CONSTRAINT advisors_eid_fkey FOREIGN KEY (eid) REFERENCES public.employees(eid);
 D   ALTER TABLE ONLY public.advisors DROP CONSTRAINT advisors_eid_fkey;
       public          postgres    false    3225    218    217            �           2606    32797 !   courses courses_departmentid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_departmentid_fkey FOREIGN KEY (departmentid) REFERENCES public.departments(departmentid);
 K   ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_departmentid_fkey;
       public          postgres    false    214    216    3219            �           2606    32905     enrolled_in enrolled_in_crn_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.enrolled_in
    ADD CONSTRAINT enrolled_in_crn_fkey FOREIGN KEY (crn) REFERENCES public.courses(crn);
 J   ALTER TABLE ONLY public.enrolled_in DROP CONSTRAINT enrolled_in_crn_fkey;
       public          postgres    false    3223    224    216            �           2606    32900     enrolled_in enrolled_in_uid_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.enrolled_in
    ADD CONSTRAINT enrolled_in_uid_fkey FOREIGN KEY (uid) REFERENCES public.students(uid);
 J   ALTER TABLE ONLY public.enrolled_in DROP CONSTRAINT enrolled_in_uid_fkey;
       public          postgres    false    223    3237    224            �           2606    40961    advisors fk_advisors_department    FK CONSTRAINT     �   ALTER TABLE ONLY public.advisors
    ADD CONSTRAINT fk_advisors_department FOREIGN KEY (departmentid) REFERENCES public.departments(departmentid);
 I   ALTER TABLE ONLY public.advisors DROP CONSTRAINT fk_advisors_department;
       public          postgres    false    214    218    3219            �           2606    32857 )   instructors instructors_departmentid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.instructors
    ADD CONSTRAINT instructors_departmentid_fkey FOREIGN KEY (departmentid) REFERENCES public.departments(departmentid);
 S   ALTER TABLE ONLY public.instructors DROP CONSTRAINT instructors_departmentid_fkey;
       public          postgres    false    221    214    3219            �           2606    32852     instructors instructors_eid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.instructors
    ADD CONSTRAINT instructors_eid_fkey FOREIGN KEY (eid) REFERENCES public.employees(eid);
 J   ALTER TABLE ONLY public.instructors DROP CONSTRAINT instructors_eid_fkey;
       public          postgres    false    217    3225    221            �           2606    32782    majors majors_departmentid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.majors
    ADD CONSTRAINT majors_departmentid_fkey FOREIGN KEY (departmentid) REFERENCES public.departments(departmentid);
 I   ALTER TABLE ONLY public.majors DROP CONSTRAINT majors_departmentid_fkey;
       public          postgres    false    3219    215    214            �           2606    32842    staff staff_departmentid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_departmentid_fkey FOREIGN KEY (departmentid) REFERENCES public.departments(departmentid);
 G   ALTER TABLE ONLY public.staff DROP CONSTRAINT staff_departmentid_fkey;
       public          postgres    false    3219    220    214            �           2606    32837    staff staff_eid_fkey    FK CONSTRAINT     t   ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_eid_fkey FOREIGN KEY (eid) REFERENCES public.employees(eid);
 >   ALTER TABLE ONLY public.staff DROP CONSTRAINT staff_eid_fkey;
       public          postgres    false    217    220    3225            �           2606    32872    teaches teaches_crn_fkey    FK CONSTRAINT     v   ALTER TABLE ONLY public.teaches
    ADD CONSTRAINT teaches_crn_fkey FOREIGN KEY (crn) REFERENCES public.courses(crn);
 B   ALTER TABLE ONLY public.teaches DROP CONSTRAINT teaches_crn_fkey;
       public          postgres    false    216    3223    222            �           2606    32867    teaches teaches_eid_fkey    FK CONSTRAINT     z   ALTER TABLE ONLY public.teaches
    ADD CONSTRAINT teaches_eid_fkey FOREIGN KEY (eid) REFERENCES public.instructors(eid);
 B   ALTER TABLE ONLY public.teaches DROP CONSTRAINT teaches_eid_fkey;
       public          postgres    false    221    222    3233            I   B   x�s�0735162�t�r54261530��u�r� ,gdlll`�	@8�H�CC�y1z\\\ ���      H   E   x�s54261530�t�r�r�CCC0��������!`������9&P���B9@�=... ��      F   �   x�m�M
� ��z
/�2�$;�B�H0�B��Ɣ:h��'�㽉�� �A��p@p3�Wi8��ZL�M:�l|n��*u(��Q���Ձ��k
�|rRְ/�ٖ���#ꡜ��PN(������:���v✰s�{����Wux��R�w(��(N!      D   �   x�m���0C绯��&�(]�@Y�pjOj.�I��Tb��,�ٶ���啂���Ø=�xR��ۛe�G�A���x��(��i�CO%8�̔��z�jb��L��M�0�;�v���?����mJZk|����>l      G   �  x����n�0���àx��\&i������]ie`"��^�$�}��d1�T�������(6�;��ҹwc�S+]{�L6o�����=��C�jd�A�-{�����3	�h*v0ݒ+V̬H�o���B�hͻ�����=�Y'5���>P�}7�!�u�չ��R��K�,X0T�;o.�K�_����-YCC"�_�w�M��o�Ǎ���V:��ﶛB�z_a�;�@���٘��O�_�=;��Wܑ�nՎ:U�C�v��b�զ�6�����v�}�Gc�yF�1�5�1���4����Ѽ�vϤ�+���BD�W]�(d�b����}��4��0?�����|��	�X��g�u7i�E�MJ_�i+ʖa�Բ��_[x��D~���
�.�9UV1�h/����T(��\u�d����75�m�.Ә�������#�y�e�
�      N   I   x�5426153��44� CNc=S��P)#N=�R�@]HR���p)�?�4,�@=���A���qqq �O_      K   A   x�s54 CN�`.W(ǈ��1��5�t�s�!|�J3(�t1�r��������������� Ǜ      E   ,   x�s��-(-I-RN�L�KN�t�r�IM.)�LN��b���� '      J   A   x�s5426153��t�r�0735162��u��r54422661�t�s� ��
8]�b���� #N4      M   �   x�u����0���)|´T�f\���ᶗ&�,����o/�mv�������#�\oR����l�s7ە��%5wtW��)*����8X�k��S�����@D2�<ݬe"8J�!�_4i�\��쵭��1��`����r~P��M%@�q�i�L�8��!"$������y�~Z���v��k�P�c��x�J������o���1ƞڜ��      L   0   x�s54 CN(����C�.f3����L�b�\̔+F��� ��s     