run:
	docker-compose up --build;

deploy-digital-ocean:
	scp -r docker-compose.prod.yml root@104.131.26.226:/root;

deploy-static:
	cd client;\
	yarn build;\
	cd build;\

#	echo one-tricks.surge.sh > CNAME;\
	#surge;\
	#..;\