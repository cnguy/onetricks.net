run:
	docker-compose up --build;

run-prod:
	docker-compose -f docker-compose.prod.yml pull;\
	docker-compose -f docker-compose.prod.yml up --build;

deploy-digital-ocean:
	scp -r docker-compose.prod.yml root@104.131.26.226:/root;\
	scp -r Makefile root@104.131.26.226:/root;

deploy-static:
	cd client;\
	yarn build;\
	cd build;\

dev-client-dockerless:
	cd client; yarn dev; ..;

#	echo one-tricks.surge.sh > CNAME;\
	#surge;\
	#..;\