SHELL := env -i /bin/bash --norc --noprofile

ESY_EJECT__ROOT := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

ESY_EJECT__PREFIX ?= $(HOME)/.esy

ESY_EJECT__STORE = $(shell $(ESY_EJECT__ROOT)/bin/get-store-path $(ESY_EJECT__PREFIX))

ESY_EJECT__SANDBOX ?= $(CURDIR)

.PHONY: build
build: build.sandbox

.PHONY: build-shell
build-shell: shell.sandbox

.PHONY: clean
clean: clean.sandbox
	@rm -f $(ESY_EJECT__SANDBOX)/_build;\
	rm -f $(ESY_EJECT__SANDBOX)/_install;\
	rm -f $(ESY_EJECT__ROOT)/bin/realpath;\
	rm -f $(ESY_EJECT__ROOT)/bin/fastreplacestring.exe;

.PHONY: list-install-paths
list-install-paths: 
	@$(env_init) echo "$$ESY_EJECT__STORE/i/ocaml-4.2.3004-490319bf";\
	echo "$$ESY_EJECT__STORE/i/esy_ocaml__slash__substs-0.0.1-90afc72d";\
	echo "$$ESY_EJECT__STORE/i/esy_ocaml__slash__esy_installer-0.0.0-dc229629";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__base_unix-0.0.0-base-f2822328";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__base_threads-0.0.0-base-77e1ea07";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__conf_m4-1.0.0-610ffe39";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__ocamlfind-1.7.3-52861988";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__jbuilder-1.0.0-beta16-c55e4ee6";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__base_bytes-0.0.0-base-b8ba731f";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__cppo-1.6.0-30f7384e";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__result-1.2.0-727c6c3e";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__ocaml_migrate_parsetree-1.0.7-2238e7ee";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__ppx___tools___versioned-5.0.1-a6b7e20f";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__conf_which-1.0.0-d8fd577d";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__ocamlbuild-0.11.0-b4652c35";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__camlp4-4.2.0-7-20eee26a";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__lwt-3.1.0-dad91278";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__topkg-0.9.1-dfb77ba6";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__react-1.2.1-594ec451";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__camomile-0.8.7-c5b972e2";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__lwt___react-1.1.0-25025217";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__zed-1.6.0-fef33328";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__lambda_term-1.12.0-74112c56";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__utop-2.0.2-d06c2204";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__menhir-20171013.0.0-e9c5c76c";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__merlin_extend-0.3.0-f4fbbb48";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__reason-3.0.4-ab0846c3";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__easy_format-1.3.0-5a45940e";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__biniou-1.2.0-877572ad";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__yojson-1.4.0-c0e1ef13";\
	echo "$$ESY_EJECT__STORE/i/opam__slash__merlin-2.5.4-0d7ac2e7";\
	echo "$$ESY_EJECT__STORE/i/reason_cli-3.0.4-99f98981";



.PHONY: build.sandbox
build.sandbox: bootstrap $(ESY_EJECT__ROOT)/sandbox.sb build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/utop build.sandbox/node_modules/@opam/reason build.sandbox/node_modules/@opam/merlin
	@$(env_init) $(env__reason___cli_3__dot__0__dot__4_99f98981) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: shell.sandbox
shell.sandbox: bootstrap $(ESY_EJECT__ROOT)/sandbox.sb build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/utop build.sandbox/node_modules/@opam/reason build.sandbox/node_modules/@opam/merlin
	@$(env_init) $(env__reason___cli_3__dot__0__dot__4_99f98981) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: clean.sandbox
clean.sandbox: bootstrap clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/utop clean.sandbox/node_modules/@opam/reason clean.sandbox/node_modules/@opam/merlin
	@rm -f $(ESY_EJECT__ROOT)/sandbox.sb;

.PHONY: shell.sandbox/node_modules/ocaml
shell.sandbox/node_modules/ocaml: bootstrap $(ESY_EJECT__ROOT)/node_modules/ocaml/sandbox.sb
	@$(env_init) $(env__ocaml_4__dot__2__dot__3004_490319bf) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@esy-ocaml/substs
shell.sandbox/node_modules/@esy-ocaml/substs: bootstrap $(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/substs/sandbox.sb
	@$(env_init) $(env__esy___ocaml____slash____substs_0__dot__0__dot__1_90afc72d) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@esy-ocaml/esy-installer
shell.sandbox/node_modules/@esy-ocaml/esy-installer: bootstrap $(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/esy-installer/sandbox.sb
	@$(env_init) $(env__esy___ocaml____slash____esy___installer_0__dot__0__dot__0_dc229629) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/base-unix
shell.sandbox/node_modules/@opam/base-unix: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/base-unix/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml
	@$(env_init) $(env__opam____slash____base___unix_0__dot__0__dot__0_base_f2822328) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/base-threads
shell.sandbox/node_modules/@opam/base-threads: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/base-threads/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml
	@$(env_init) $(env__opam____slash____base___threads_0__dot__0__dot__0_base_77e1ea07) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/conf-m4
shell.sandbox/node_modules/@opam/conf-m4: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/conf-m4/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml
	@$(env_init) $(env__opam____slash____conf___m4_1__dot__0__dot__0_610ffe39) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/ocamlfind
shell.sandbox/node_modules/@opam/ocamlfind: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/ocamlfind/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/conf-m4
	@$(env_init) $(env__opam____slash____ocamlfind_1__dot__7__dot__3_52861988) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/jbuilder
shell.sandbox/node_modules/@opam/jbuilder: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/jbuilder/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind
	@$(env_init) $(env__opam____slash____jbuilder_1__dot__0__dot__0_beta16_c55e4ee6) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/base-bytes
shell.sandbox/node_modules/@opam/base-bytes: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/base-bytes/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind
	@$(env_init) $(env__opam____slash____base___bytes_0__dot__0__dot__0_base_b8ba731f) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/cppo
shell.sandbox/node_modules/@opam/cppo: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/cppo/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/base-bytes build.sandbox/node_modules/@opam/base-unix
	@$(env_init) $(env__opam____slash____cppo_1__dot__6__dot__0_30f7384e) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/result
shell.sandbox/node_modules/@opam/result: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/result/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml
	@$(env_init) $(env__opam____slash____result_1__dot__2__dot__0_727c6c3e) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/ocaml-migrate-parsetree
shell.sandbox/node_modules/@opam/ocaml-migrate-parsetree: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/ocaml-migrate-parsetree/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/result build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/jbuilder
	@$(env_init) $(env__opam____slash____ocaml___migrate___parsetree_1__dot__0__dot__7_2238e7ee) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/ppx_tools_versioned
shell.sandbox/node_modules/@opam/ppx_tools_versioned: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/ppx_tools_versioned/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/ocaml-migrate-parsetree
	@$(env_init) $(env__opam____slash____ppx_____tools_____versioned_5__dot__0__dot__1_a6b7e20f) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/conf-which
shell.sandbox/node_modules/@opam/conf-which: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/conf-which/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml
	@$(env_init) $(env__opam____slash____conf___which_1__dot__0__dot__0_d8fd577d) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/ocamlbuild
shell.sandbox/node_modules/@opam/ocamlbuild: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/ocamlbuild/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml
	@$(env_init) $(env__opam____slash____ocamlbuild_0__dot__11__dot__0_b4652c35) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/camlp4
shell.sandbox/node_modules/@opam/camlp4: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/camlp4/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/conf-which build.sandbox/node_modules/@opam/ocamlbuild
	@$(env_init) $(env__opam____slash____camlp4_4__dot__2__dot__0_7_20eee26a) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/lwt
shell.sandbox/node_modules/@opam/lwt: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/lwt/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/base-unix build.sandbox/node_modules/@opam/cppo build.sandbox/node_modules/@opam/result build.sandbox/node_modules/@opam/ocaml-migrate-parsetree build.sandbox/node_modules/@opam/ppx_tools_versioned build.sandbox/node_modules/@opam/base-threads build.sandbox/node_modules/@opam/camlp4
	@$(env_init) $(env__opam____slash____lwt_3__dot__1__dot__0_dad91278) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/topkg
shell.sandbox/node_modules/@opam/topkg: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/topkg/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/ocamlbuild build.sandbox/node_modules/@opam/result
	@$(env_init) $(env__opam____slash____topkg_0__dot__9__dot__1_dfb77ba6) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/react
shell.sandbox/node_modules/@opam/react: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/react/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/ocamlbuild build.sandbox/node_modules/@opam/topkg
	@$(env_init) $(env__opam____slash____react_1__dot__2__dot__1_594ec451) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/camomile
shell.sandbox/node_modules/@opam/camomile: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/camomile/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/base-bytes build.sandbox/node_modules/@opam/cppo build.sandbox/node_modules/@opam/camlp4
	@$(env_init) $(env__opam____slash____camomile_0__dot__8__dot__7_c5b972e2) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/lwt_react
shell.sandbox/node_modules/@opam/lwt_react: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/lwt_react/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/lwt build.sandbox/node_modules/@opam/react
	@$(env_init) $(env__opam____slash____lwt_____react_1__dot__1__dot__0_25025217) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/zed
shell.sandbox/node_modules/@opam/zed: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/zed/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/base-bytes build.sandbox/node_modules/@opam/camomile build.sandbox/node_modules/@opam/react
	@$(env_init) $(env__opam____slash____zed_1__dot__6__dot__0_fef33328) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/lambda-term
shell.sandbox/node_modules/@opam/lambda-term: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/lambda-term/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/lwt build.sandbox/node_modules/@opam/react build.sandbox/node_modules/@opam/camomile build.sandbox/node_modules/@opam/zed build.sandbox/node_modules/@opam/lwt_react
	@$(env_init) $(env__opam____slash____lambda___term_1__dot__12__dot__0_74112c56) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/utop
shell.sandbox/node_modules/@opam/utop: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/utop/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/base-unix build.sandbox/node_modules/@opam/base-threads build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/cppo build.sandbox/node_modules/@opam/lwt build.sandbox/node_modules/@opam/react build.sandbox/node_modules/@opam/camomile build.sandbox/node_modules/@opam/lwt_react build.sandbox/node_modules/@opam/lambda-term
	@$(env_init) $(env__opam____slash____utop_2__dot__0__dot__2_d06c2204) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/menhir
shell.sandbox/node_modules/@opam/menhir: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/menhir/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/ocamlbuild
	@$(env_init) $(env__opam____slash____menhir_20171013__dot__0__dot__0_e9c5c76c) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/merlin-extend
shell.sandbox/node_modules/@opam/merlin-extend: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/merlin-extend/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/cppo
	@$(env_init) $(env__opam____slash____merlin___extend_0__dot__3__dot__0_f4fbbb48) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/reason
shell.sandbox/node_modules/@opam/reason: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/reason/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/ocamlbuild build.sandbox/node_modules/@opam/menhir build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/result build.sandbox/node_modules/@opam/ocaml-migrate-parsetree build.sandbox/node_modules/@opam/utop build.sandbox/node_modules/@opam/merlin-extend
	@$(env_init) $(env__opam____slash____reason_3__dot__0__dot__4_ab0846c3) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/easy-format
shell.sandbox/node_modules/@opam/easy-format: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/easy-format/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder
	@$(env_init) $(env__opam____slash____easy___format_1__dot__3__dot__0_5a45940e) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/biniou
shell.sandbox/node_modules/@opam/biniou: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/biniou/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/conf-which build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/easy-format
	@$(env_init) $(env__opam____slash____biniou_1__dot__2__dot__0_877572ad) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/yojson
shell.sandbox/node_modules/@opam/yojson: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/yojson/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/cppo build.sandbox/node_modules/@opam/easy-format build.sandbox/node_modules/@opam/biniou
	@$(env_init) $(env__opam____slash____yojson_1__dot__4__dot__0_c0e1ef13) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: shell.sandbox/node_modules/@opam/merlin
shell.sandbox/node_modules/@opam/merlin: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/merlin/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/yojson
	@$(env_init) $(env__opam____slash____merlin_2__dot__5__dot__4_0d7ac2e7) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyShell;

.PHONY: bootstrap
bootstrap: esy-root esy-store

define env__reason___cli_3__dot__0__dot__4_99f98981
	source $(ESY_EJECT__ROOT)/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/reason_cli-3.0.4-99f98981";\
	export esy_build__build_type="out-of-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command='';\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/sandbox.sb: $(ESY_EJECT__ROOT)/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/ocaml
build.sandbox/node_modules/ocaml: bootstrap $(ESY_EJECT__ROOT)/node_modules/ocaml/sandbox.sb
	@$(env_init) $(env__ocaml_4__dot__2__dot__3004_490319bf) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@opam/utop
build.sandbox/node_modules/@opam/utop: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/utop/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/base-unix build.sandbox/node_modules/@opam/base-threads build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/cppo build.sandbox/node_modules/@opam/lwt build.sandbox/node_modules/@opam/react build.sandbox/node_modules/@opam/camomile build.sandbox/node_modules/@opam/lwt_react build.sandbox/node_modules/@opam/lambda-term
	@$(env_init) $(env__opam____slash____utop_2__dot__0__dot__2_d06c2204) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@opam/reason
build.sandbox/node_modules/@opam/reason: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/reason/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/ocamlbuild build.sandbox/node_modules/@opam/menhir build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/result build.sandbox/node_modules/@opam/ocaml-migrate-parsetree build.sandbox/node_modules/@opam/utop build.sandbox/node_modules/@opam/merlin-extend
	@$(env_init) $(env__opam____slash____reason_3__dot__0__dot__4_ab0846c3) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@opam/merlin
build.sandbox/node_modules/@opam/merlin: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/merlin/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/yojson
	@$(env_init) $(env__opam____slash____merlin_2__dot__5__dot__4_0d7ac2e7) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: clean.sandbox/node_modules/ocaml
clean.sandbox/node_modules/ocaml: bootstrap
	@rm -f $(ESY_EJECT__ROOT)/node_modules/ocaml/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/utop
clean.sandbox/node_modules/@opam/utop: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/base-unix clean.sandbox/node_modules/@opam/base-threads clean.sandbox/node_modules/@opam/ocamlfind clean.sandbox/node_modules/@opam/jbuilder clean.sandbox/node_modules/@opam/cppo clean.sandbox/node_modules/@opam/lwt clean.sandbox/node_modules/@opam/react clean.sandbox/node_modules/@opam/camomile clean.sandbox/node_modules/@opam/lwt_react clean.sandbox/node_modules/@opam/lambda-term
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/utop/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/reason
clean.sandbox/node_modules/@opam/reason: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/ocamlfind clean.sandbox/node_modules/@opam/ocamlbuild clean.sandbox/node_modules/@opam/menhir clean.sandbox/node_modules/@opam/jbuilder clean.sandbox/node_modules/@opam/result clean.sandbox/node_modules/@opam/ocaml-migrate-parsetree clean.sandbox/node_modules/@opam/utop clean.sandbox/node_modules/@opam/merlin-extend
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/reason/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/merlin
clean.sandbox/node_modules/@opam/merlin: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/ocamlfind clean.sandbox/node_modules/@opam/yojson
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/merlin/sandbox.sb;

define env__ocaml_4__dot__2__dot__3004_490319bf
	source $(ESY_EJECT__ROOT)/node_modules/ocaml/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/ocaml/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/ocaml";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/ocaml-4.2.3004-490319bf";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('mkdir compilerlibs' './configure -no-cfi -prefix $$cur__install' 'make -j1 world.opt' 'make install' 'make clean');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/ocaml/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/ocaml/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/ocaml/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__esy___ocaml____slash____substs_0__dot__0__dot__1_90afc72d
	source $(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/substs/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/substs/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@esy-ocaml/substs";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/esy_ocaml__slash__substs-0.0.1-90afc72d";\
	export esy_build__build_type="out-of-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('cp ./substs $$cur__bin/substs');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/substs/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/substs/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/substs/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__esy___ocaml____slash____esy___installer_0__dot__0__dot__0_dc229629
	source $(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/esy-installer/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/esy-installer/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@esy-ocaml/esy-installer";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/esy_ocaml__slash__esy_installer-0.0.0-dc229629";\
	export esy_build__build_type="out-of-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('make install');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/esy-installer/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/esy-installer/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/esy-installer/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__opam____slash____base___unix_0__dot__0__dot__0_base_f2822328
	source $(ESY_EJECT__ROOT)/node_modules/@opam/base-unix/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/base-unix/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/base-unix";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__base_unix-0.0.0-base-f2822328";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/base-unix/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/base-unix/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/base-unix/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@esy-ocaml/substs
build.sandbox/node_modules/@esy-ocaml/substs: bootstrap $(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/substs/sandbox.sb
	@$(env_init) $(env__esy___ocaml____slash____substs_0__dot__0__dot__1_90afc72d) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@esy-ocaml/esy-installer
build.sandbox/node_modules/@esy-ocaml/esy-installer: bootstrap $(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/esy-installer/sandbox.sb
	@$(env_init) $(env__esy___ocaml____slash____esy___installer_0__dot__0__dot__0_dc229629) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____base___threads_0__dot__0__dot__0_base_77e1ea07
	source $(ESY_EJECT__ROOT)/node_modules/@opam/base-threads/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/base-threads/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/base-threads";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__base_threads-0.0.0-base-77e1ea07";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/base-threads/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/base-threads/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/base-threads/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__opam____slash____conf___m4_1__dot__0__dot__0_610ffe39
	source $(ESY_EJECT__ROOT)/node_modules/@opam/conf-m4/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/conf-m4/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/conf-m4";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__conf_m4-1.0.0-610ffe39";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('sh -exc "echo | m4"' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/conf-m4/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/conf-m4/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/conf-m4/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__opam____slash____ocamlfind_1__dot__7__dot__3_52861988
	source $(ESY_EJECT__ROOT)/node_modules/@opam/ocamlfind/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/ocamlfind/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/ocamlfind";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__ocamlfind-1.7.3-52861988";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('bash ./_esy/build $$ESY_EJECT__STORE/i/ocaml-4.2.3004-490319bf/lib/ocaml');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/ocamlfind/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/ocamlfind/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/ocamlfind/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/conf-m4
build.sandbox/node_modules/@opam/conf-m4: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/conf-m4/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml
	@$(env_init) $(env__opam____slash____conf___m4_1__dot__0__dot__0_610ffe39) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____jbuilder_1__dot__0__dot__0_beta16_c55e4ee6
	source $(ESY_EJECT__ROOT)/node_modules/@opam/jbuilder/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/jbuilder/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/jbuilder";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__jbuilder-1.0.0-beta16-c55e4ee6";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('ocaml bootstrap.ml' './boot.exe --subst' './boot.exe -j 4' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/jbuilder/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/jbuilder/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/jbuilder/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/ocamlfind
build.sandbox/node_modules/@opam/ocamlfind: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/ocamlfind/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/conf-m4
	@$(env_init) $(env__opam____slash____ocamlfind_1__dot__7__dot__3_52861988) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____base___bytes_0__dot__0__dot__0_base_b8ba731f
	source $(ESY_EJECT__ROOT)/node_modules/@opam/base-bytes/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/base-bytes/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/base-bytes";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__base_bytes-0.0.0-base-b8ba731f";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/base-bytes/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/base-bytes/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/base-bytes/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__opam____slash____cppo_1__dot__6__dot__0_30f7384e
	source $(ESY_EJECT__ROOT)/node_modules/@opam/cppo/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/cppo/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/cppo";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__cppo-1.6.0-30f7384e";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('jbuilder subst' 'jbuilder build -p cppo -j 4' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/cppo/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/cppo/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/cppo/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/jbuilder
build.sandbox/node_modules/@opam/jbuilder: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/jbuilder/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind
	@$(env_init) $(env__opam____slash____jbuilder_1__dot__0__dot__0_beta16_c55e4ee6) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@opam/base-bytes
build.sandbox/node_modules/@opam/base-bytes: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/base-bytes/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind
	@$(env_init) $(env__opam____slash____base___bytes_0__dot__0__dot__0_base_b8ba731f) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@opam/base-unix
build.sandbox/node_modules/@opam/base-unix: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/base-unix/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml
	@$(env_init) $(env__opam____slash____base___unix_0__dot__0__dot__0_base_f2822328) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____result_1__dot__2__dot__0_727c6c3e
	source $(ESY_EJECT__ROOT)/node_modules/@opam/result/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/result/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/result";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__result-1.2.0-727c6c3e";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=(make 'make byte result.install' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/result/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/result/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/result/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__opam____slash____ocaml___migrate___parsetree_1__dot__0__dot__7_2238e7ee
	source $(ESY_EJECT__ROOT)/node_modules/@opam/ocaml-migrate-parsetree/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/ocaml-migrate-parsetree/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/ocaml-migrate-parsetree";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__ocaml_migrate_parsetree-1.0.7-2238e7ee";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('jbuilder build -p ocaml-migrate-parsetree -j 4' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/ocaml-migrate-parsetree/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/ocaml-migrate-parsetree/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/ocaml-migrate-parsetree/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/result
build.sandbox/node_modules/@opam/result: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/result/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml
	@$(env_init) $(env__opam____slash____result_1__dot__2__dot__0_727c6c3e) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____ppx_____tools_____versioned_5__dot__0__dot__1_a6b7e20f
	source $(ESY_EJECT__ROOT)/node_modules/@opam/ppx_tools_versioned/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/ppx_tools_versioned/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/ppx_tools_versioned";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__ppx___tools___versioned-5.0.1-a6b7e20f";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('make all' 'make install' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/ppx_tools_versioned/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/ppx_tools_versioned/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/ppx_tools_versioned/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/ocaml-migrate-parsetree
build.sandbox/node_modules/@opam/ocaml-migrate-parsetree: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/ocaml-migrate-parsetree/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/result build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/jbuilder
	@$(env_init) $(env__opam____slash____ocaml___migrate___parsetree_1__dot__0__dot__7_2238e7ee) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____conf___which_1__dot__0__dot__0_d8fd577d
	source $(ESY_EJECT__ROOT)/node_modules/@opam/conf-which/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/conf-which/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/conf-which";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__conf_which-1.0.0-d8fd577d";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('which which' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/conf-which/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/conf-which/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/conf-which/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__opam____slash____ocamlbuild_0__dot__11__dot__0_b4652c35
	source $(ESY_EJECT__ROOT)/node_modules/@opam/ocamlbuild/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/ocamlbuild/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/ocamlbuild";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__ocamlbuild-0.11.0-b4652c35";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=(true);\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/ocamlbuild/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/ocamlbuild/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/ocamlbuild/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__opam____slash____camlp4_4__dot__2__dot__0_7_20eee26a
	source $(ESY_EJECT__ROOT)/node_modules/@opam/camlp4/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/camlp4/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/camlp4";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__camlp4-4.2.0-7-20eee26a";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('sed "-i'\''.orig'\''" -e "s/directory = \"+camlp4\"/# directory = \"+camlp4\"/g" camlp4/META.in' './configure --bindir=$$cur__bin --libdir=$$cur__lib --pkgdir=$$cur__lib' 'make all' 'make install install-META' 'sh -c "(opam-installer --prefix=$$cur__install || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/camlp4/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/camlp4/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/camlp4/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/conf-which
build.sandbox/node_modules/@opam/conf-which: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/conf-which/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml
	@$(env_init) $(env__opam____slash____conf___which_1__dot__0__dot__0_d8fd577d) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@opam/ocamlbuild
build.sandbox/node_modules/@opam/ocamlbuild: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/ocamlbuild/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml
	@$(env_init) $(env__opam____slash____ocamlbuild_0__dot__11__dot__0_b4652c35) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____lwt_3__dot__1__dot__0_dad91278
	source $(ESY_EJECT__ROOT)/node_modules/@opam/lwt/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/lwt/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/lwt";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__lwt-3.1.0-dad91278";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('ocaml src/util/configure.ml -use-libev $${conf_libev_installed:-false} -use-camlp4 $${camlp4_installed:-false}' 'jbuilder build -p lwt -j 4' 'ocaml src/util/install_filter.ml' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/lwt/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/lwt/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/lwt/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/cppo
build.sandbox/node_modules/@opam/cppo: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/cppo/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/base-bytes build.sandbox/node_modules/@opam/base-unix
	@$(env_init) $(env__opam____slash____cppo_1__dot__6__dot__0_30f7384e) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@opam/ppx_tools_versioned
build.sandbox/node_modules/@opam/ppx_tools_versioned: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/ppx_tools_versioned/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/ocaml-migrate-parsetree
	@$(env_init) $(env__opam____slash____ppx_____tools_____versioned_5__dot__0__dot__1_a6b7e20f) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@opam/base-threads
build.sandbox/node_modules/@opam/base-threads: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/base-threads/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml
	@$(env_init) $(env__opam____slash____base___threads_0__dot__0__dot__0_base_77e1ea07) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@opam/camlp4
build.sandbox/node_modules/@opam/camlp4: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/camlp4/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/conf-which build.sandbox/node_modules/@opam/ocamlbuild
	@$(env_init) $(env__opam____slash____camlp4_4__dot__2__dot__0_7_20eee26a) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____topkg_0__dot__9__dot__1_dfb77ba6
	source $(ESY_EJECT__ROOT)/node_modules/@opam/topkg/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/topkg/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/topkg";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__topkg-0.9.1-dfb77ba6";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('ocaml pkg/pkg.ml build --pkg-name topkg --dev-pkg false' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/topkg/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/topkg/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/topkg/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__opam____slash____react_1__dot__2__dot__1_594ec451
	source $(ESY_EJECT__ROOT)/node_modules/@opam/react/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/react/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/react";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__react-1.2.1-594ec451";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('ocaml pkg/pkg.ml build --dev-pkg false' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/react/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/react/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/react/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/topkg
build.sandbox/node_modules/@opam/topkg: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/topkg/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/ocamlbuild build.sandbox/node_modules/@opam/result
	@$(env_init) $(env__opam____slash____topkg_0__dot__9__dot__1_dfb77ba6) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____camomile_0__dot__8__dot__7_c5b972e2
	source $(ESY_EJECT__ROOT)/node_modules/@opam/camomile/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/camomile/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/camomile";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__camomile-0.8.7-c5b972e2";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('ocaml configure.ml --share $$cur__share/camomile' 'jbuilder build -p camomile -j 4' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/camomile/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/camomile/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/camomile/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__opam____slash____lwt_____react_1__dot__1__dot__0_25025217
	source $(ESY_EJECT__ROOT)/node_modules/@opam/lwt_react/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/lwt_react/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/lwt_react";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__lwt___react-1.1.0-25025217";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('jbuilder build -p lwt_react -j 4' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/lwt_react/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/lwt_react/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/lwt_react/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/lwt
build.sandbox/node_modules/@opam/lwt: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/lwt/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/base-unix build.sandbox/node_modules/@opam/cppo build.sandbox/node_modules/@opam/result build.sandbox/node_modules/@opam/ocaml-migrate-parsetree build.sandbox/node_modules/@opam/ppx_tools_versioned build.sandbox/node_modules/@opam/base-threads build.sandbox/node_modules/@opam/camlp4
	@$(env_init) $(env__opam____slash____lwt_3__dot__1__dot__0_dad91278) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@opam/react
build.sandbox/node_modules/@opam/react: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/react/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/ocamlbuild build.sandbox/node_modules/@opam/topkg
	@$(env_init) $(env__opam____slash____react_1__dot__2__dot__1_594ec451) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____zed_1__dot__6__dot__0_fef33328
	source $(ESY_EJECT__ROOT)/node_modules/@opam/zed/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/zed/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/zed";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__zed-1.6.0-fef33328";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('jbuilder subst' 'jbuilder build -p zed -j 4' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/zed/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/zed/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/zed/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/camomile
build.sandbox/node_modules/@opam/camomile: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/camomile/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/base-bytes build.sandbox/node_modules/@opam/cppo build.sandbox/node_modules/@opam/camlp4
	@$(env_init) $(env__opam____slash____camomile_0__dot__8__dot__7_c5b972e2) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____lambda___term_1__dot__12__dot__0_74112c56
	source $(ESY_EJECT__ROOT)/node_modules/@opam/lambda-term/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/lambda-term/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/lambda-term";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__lambda_term-1.12.0-74112c56";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('jbuilder subst' 'jbuilder build -p lambda-term -j 4' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/lambda-term/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/lambda-term/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/lambda-term/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/zed
build.sandbox/node_modules/@opam/zed: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/zed/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/base-bytes build.sandbox/node_modules/@opam/camomile build.sandbox/node_modules/@opam/react
	@$(env_init) $(env__opam____slash____zed_1__dot__6__dot__0_fef33328) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@opam/lwt_react
build.sandbox/node_modules/@opam/lwt_react: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/lwt_react/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/lwt build.sandbox/node_modules/@opam/react
	@$(env_init) $(env__opam____slash____lwt_____react_1__dot__1__dot__0_25025217) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____utop_2__dot__0__dot__2_d06c2204
	source $(ESY_EJECT__ROOT)/node_modules/@opam/utop/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/utop/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/utop";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__utop-2.0.2-d06c2204";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('jbuilder subst' 'jbuilder build -p utop -j 4' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/utop/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/utop/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/utop/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/lambda-term
build.sandbox/node_modules/@opam/lambda-term: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/lambda-term/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/lwt build.sandbox/node_modules/@opam/react build.sandbox/node_modules/@opam/camomile build.sandbox/node_modules/@opam/zed build.sandbox/node_modules/@opam/lwt_react
	@$(env_init) $(env__opam____slash____lambda___term_1__dot__12__dot__0_74112c56) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____menhir_20171013__dot__0__dot__0_e9c5c76c
	source $(ESY_EJECT__ROOT)/node_modules/@opam/menhir/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/menhir/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/menhir";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__menhir-20171013.0.0-e9c5c76c";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('make -f Makefile PREFIX=$$cur__install USE_OCAMLFIND=true docdir=$$cur__doc/menhir libdir=$$cur__lib/menhir mandir=$$cur__man/man1' 'make -f Makefile install PREFIX=$$cur__install docdir=$$cur__doc/menhir libdir=$$cur__lib/menhir mandir=$$cur__man/man1' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/menhir/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/menhir/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/menhir/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__opam____slash____merlin___extend_0__dot__3__dot__0_f4fbbb48
	source $(ESY_EJECT__ROOT)/node_modules/@opam/merlin-extend/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/merlin-extend/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/merlin-extend";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__merlin_extend-0.3.0-f4fbbb48";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=(make 'make install' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/merlin-extend/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/merlin-extend/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/merlin-extend/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__opam____slash____reason_3__dot__0__dot__4_ab0846c3
	source $(ESY_EJECT__ROOT)/node_modules/@opam/reason/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/reason/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/reason";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__reason-3.0.4-ab0846c3";\
	export esy_build__build_type="_build";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('jbuilder build --root .' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/reason/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/reason/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/reason/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/menhir
build.sandbox/node_modules/@opam/menhir: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/menhir/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/ocamlbuild
	@$(env_init) $(env__opam____slash____menhir_20171013__dot__0__dot__0_e9c5c76c) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

.PHONY: build.sandbox/node_modules/@opam/merlin-extend
build.sandbox/node_modules/@opam/merlin-extend: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/merlin-extend/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/ocamlfind build.sandbox/node_modules/@opam/cppo
	@$(env_init) $(env__opam____slash____merlin___extend_0__dot__3__dot__0_f4fbbb48) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____easy___format_1__dot__3__dot__0_5a45940e
	source $(ESY_EJECT__ROOT)/node_modules/@opam/easy-format/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/easy-format/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/easy-format";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__easy_format-1.3.0-5a45940e";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('jbuilder build -p easy-format -j 4' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/easy-format/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/easy-format/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/easy-format/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

define env__opam____slash____biniou_1__dot__2__dot__0_877572ad
	source $(ESY_EJECT__ROOT)/node_modules/@opam/biniou/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/biniou/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/biniou";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__biniou-1.2.0-877572ad";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('jbuilder build -p biniou -j 4' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/biniou/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/biniou/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/biniou/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/easy-format
build.sandbox/node_modules/@opam/easy-format: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/easy-format/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder
	@$(env_init) $(env__opam____slash____easy___format_1__dot__3__dot__0_5a45940e) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____yojson_1__dot__4__dot__0_c0e1ef13
	source $(ESY_EJECT__ROOT)/node_modules/@opam/yojson/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/yojson/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/yojson";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__yojson-1.4.0-c0e1ef13";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('jbuilder build -p yojson -j 4' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/yojson/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/yojson/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/yojson/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/biniou
build.sandbox/node_modules/@opam/biniou: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/biniou/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/conf-which build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/easy-format
	@$(env_init) $(env__opam____slash____biniou_1__dot__2__dot__0_877572ad) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env__opam____slash____merlin_2__dot__5__dot__4_0d7ac2e7
	source $(ESY_EJECT__ROOT)/node_modules/@opam/merlin/eject-env;\
	export esy_build__sandbox_config_darwin="$(ESY_EJECT__ROOT)/node_modules/@opam/merlin/sandbox.sb";\
	export esy_build__source_root="$$ESY_EJECT__SANDBOX/node_modules/@opam/merlin";\
	export esy_build__install_root="$$ESY_EJECT__STORE/i/opam__slash__merlin-2.5.4-0d7ac2e7";\
	export esy_build__build_type="in-source";\
	export esy_build__source_type="immutable";\
	export esy_build__build_command=('./configure --prefix $$cur__install' 'rm -rf $$cur__install/share/ocamlmerlin' 'make -j 4' 'sh -c "(esy-installer || true)"');\
	export esy_build__install_command='';
endef

$(ESY_EJECT__ROOT)/node_modules/@opam/merlin/sandbox.sb: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/node_modules/@opam/merlin/sandbox.sb: $(ESY_EJECT__ROOT)/node_modules/@opam/merlin/sandbox.sb.in esy-root
	@$(env_init) $(ESY_EJECT__ROOT)/bin/render-env $(<) $(@);

.PHONY: build.sandbox/node_modules/@opam/yojson
build.sandbox/node_modules/@opam/yojson: bootstrap $(ESY_EJECT__ROOT)/node_modules/@opam/yojson/sandbox.sb build.sandbox/node_modules/@esy-ocaml/substs build.sandbox/node_modules/@esy-ocaml/esy-installer build.sandbox/node_modules/ocaml build.sandbox/node_modules/@opam/jbuilder build.sandbox/node_modules/@opam/cppo build.sandbox/node_modules/@opam/easy-format build.sandbox/node_modules/@opam/biniou
	@$(env_init) $(env__opam____slash____yojson_1__dot__4__dot__0_c0e1ef13) source $(ESY_EJECT__ROOT)/bin/shell-builder.sh;\
	cd $$esy_build__source_root;\
	esyBuild;

define env_init
	export TMPDIR="$(TMPDIR)";\
	export ESY_EJECT__PREFIX="$(ESY_EJECT__PREFIX)";\
	export ESY_EJECT__STORE="$(ESY_EJECT__STORE)";\
	export ESY_EJECT__SANDBOX="$(ESY_EJECT__SANDBOX)";\
	export ESY_EJECT__ROOT="$(ESY_EJECT__ROOT)";
endef

.PHONY: esy-root
esy-root: $(ESY_EJECT__ROOT)/bin/realpath $(ESY_EJECT__ROOT)/bin/fastreplacestring.exe

.PHONY: esy-store
esy-store: $(ESY_EJECT__STORE)/b $(ESY_EJECT__STORE)/i $(ESY_EJECT__STORE)/s $(ESY_EJECT__SANDBOX)/node_modules/.cache/_esy/store/b $(ESY_EJECT__SANDBOX)/node_modules/.cache/_esy/store/i $(ESY_EJECT__SANDBOX)/node_modules/.cache/_esy/store/s

.PHONY: clean.sandbox/node_modules/@esy-ocaml/substs
clean.sandbox/node_modules/@esy-ocaml/substs: bootstrap
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/substs/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@esy-ocaml/esy-installer
clean.sandbox/node_modules/@esy-ocaml/esy-installer: bootstrap
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@esy-ocaml/esy-installer/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/base-unix
clean.sandbox/node_modules/@opam/base-unix: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/base-unix/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/base-threads
clean.sandbox/node_modules/@opam/base-threads: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/base-threads/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/ocamlfind
clean.sandbox/node_modules/@opam/ocamlfind: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/conf-m4
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/ocamlfind/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/jbuilder
clean.sandbox/node_modules/@opam/jbuilder: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/ocamlfind
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/jbuilder/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/cppo
clean.sandbox/node_modules/@opam/cppo: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/jbuilder clean.sandbox/node_modules/@opam/base-bytes clean.sandbox/node_modules/@opam/base-unix
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/cppo/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/lwt
clean.sandbox/node_modules/@opam/lwt: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/ocamlfind clean.sandbox/node_modules/@opam/jbuilder clean.sandbox/node_modules/@opam/base-unix clean.sandbox/node_modules/@opam/cppo clean.sandbox/node_modules/@opam/result clean.sandbox/node_modules/@opam/ocaml-migrate-parsetree clean.sandbox/node_modules/@opam/ppx_tools_versioned clean.sandbox/node_modules/@opam/base-threads clean.sandbox/node_modules/@opam/camlp4
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/lwt/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/react
clean.sandbox/node_modules/@opam/react: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/ocamlfind clean.sandbox/node_modules/@opam/ocamlbuild clean.sandbox/node_modules/@opam/topkg
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/react/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/camomile
clean.sandbox/node_modules/@opam/camomile: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/jbuilder clean.sandbox/node_modules/@opam/base-bytes clean.sandbox/node_modules/@opam/cppo clean.sandbox/node_modules/@opam/camlp4
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/camomile/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/lwt_react
clean.sandbox/node_modules/@opam/lwt_react: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/jbuilder clean.sandbox/node_modules/@opam/lwt clean.sandbox/node_modules/@opam/react
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/lwt_react/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/lambda-term
clean.sandbox/node_modules/@opam/lambda-term: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/jbuilder clean.sandbox/node_modules/@opam/lwt clean.sandbox/node_modules/@opam/react clean.sandbox/node_modules/@opam/camomile clean.sandbox/node_modules/@opam/zed clean.sandbox/node_modules/@opam/lwt_react
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/lambda-term/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/ocamlbuild
clean.sandbox/node_modules/@opam/ocamlbuild: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/ocamlbuild/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/menhir
clean.sandbox/node_modules/@opam/menhir: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/ocamlfind clean.sandbox/node_modules/@opam/ocamlbuild
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/menhir/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/result
clean.sandbox/node_modules/@opam/result: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/result/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/ocaml-migrate-parsetree
clean.sandbox/node_modules/@opam/ocaml-migrate-parsetree: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/result clean.sandbox/node_modules/@opam/ocamlfind clean.sandbox/node_modules/@opam/jbuilder
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/ocaml-migrate-parsetree/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/merlin-extend
clean.sandbox/node_modules/@opam/merlin-extend: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/ocamlfind clean.sandbox/node_modules/@opam/cppo
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/merlin-extend/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/yojson
clean.sandbox/node_modules/@opam/yojson: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/jbuilder clean.sandbox/node_modules/@opam/cppo clean.sandbox/node_modules/@opam/easy-format clean.sandbox/node_modules/@opam/biniou
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/yojson/sandbox.sb;

$(ESY_EJECT__ROOT)/bin/realpath: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/bin/realpath: $(ESY_EJECT__ROOT)/bin/realpath.c
	@gcc -o $(@) -x c $(<) 2> /dev/null;

$(ESY_EJECT__ROOT)/bin/fastreplacestring.exe: SHELL=/bin/bash
$(ESY_EJECT__ROOT)/bin/fastreplacestring.exe: $(ESY_EJECT__ROOT)/bin/fastreplacestring.cpp
	@g++ -Ofast -o $(@) $(<) 2> /dev/null;

$(ESY_EJECT__STORE)/b: 
	@mkdir -p $(@);

$(ESY_EJECT__STORE)/i: 
	@mkdir -p $(@);

$(ESY_EJECT__STORE)/s: 
	@mkdir -p $(@);

$(ESY_EJECT__SANDBOX)/node_modules/.cache/_esy/store/b: 
	@mkdir -p $(@);

$(ESY_EJECT__SANDBOX)/node_modules/.cache/_esy/store/i: 
	@mkdir -p $(@);

$(ESY_EJECT__SANDBOX)/node_modules/.cache/_esy/store/s: 
	@mkdir -p $(@);

.PHONY: clean.sandbox/node_modules/@opam/conf-m4
clean.sandbox/node_modules/@opam/conf-m4: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/conf-m4/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/base-bytes
clean.sandbox/node_modules/@opam/base-bytes: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/ocamlfind
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/base-bytes/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/ppx_tools_versioned
clean.sandbox/node_modules/@opam/ppx_tools_versioned: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/ocamlfind clean.sandbox/node_modules/@opam/ocaml-migrate-parsetree
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/ppx_tools_versioned/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/camlp4
clean.sandbox/node_modules/@opam/camlp4: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/conf-which clean.sandbox/node_modules/@opam/ocamlbuild
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/camlp4/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/topkg
clean.sandbox/node_modules/@opam/topkg: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/ocamlfind clean.sandbox/node_modules/@opam/ocamlbuild clean.sandbox/node_modules/@opam/result
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/topkg/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/zed
clean.sandbox/node_modules/@opam/zed: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/jbuilder clean.sandbox/node_modules/@opam/base-bytes clean.sandbox/node_modules/@opam/camomile clean.sandbox/node_modules/@opam/react
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/zed/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/easy-format
clean.sandbox/node_modules/@opam/easy-format: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/jbuilder
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/easy-format/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/biniou
clean.sandbox/node_modules/@opam/biniou: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml clean.sandbox/node_modules/@opam/conf-which clean.sandbox/node_modules/@opam/jbuilder clean.sandbox/node_modules/@opam/easy-format
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/biniou/sandbox.sb;

.PHONY: clean.sandbox/node_modules/@opam/conf-which
clean.sandbox/node_modules/@opam/conf-which: bootstrap clean.sandbox/node_modules/@esy-ocaml/substs clean.sandbox/node_modules/@esy-ocaml/esy-installer clean.sandbox/node_modules/ocaml
	@rm -f $(ESY_EJECT__ROOT)/node_modules/@opam/conf-which/sandbox.sb;