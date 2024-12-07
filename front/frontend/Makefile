env :
	python3 -m venv env
	@echo "Virtualenv activated"

init :
	pip install -r requirements.txt
	make back

back :
	python3 manage.py runserver
front :
	npm install
	npm run dev

push :
	git add .
	git commit -m "update"
	git push