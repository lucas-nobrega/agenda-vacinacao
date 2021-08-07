# Agenda Vacina

O projeto agendamento de cidadãos para vacinação contra Covid-19.

Sistema de agendamento online para a campanha de vacinação contra Covid-19, proposto pelo LAIS (EDITAL Nº 039/2021).
## 🛠️ Construído com

* [ReactJS](https://pt-br.reactjs.org/) - Biblioteca Javascript
* [React Native](https://reactnative.dev/) - Biblioteca Javascript
* [Django](https://www.djangoproject.com/) - framework Python
* [Django REST Framework](https://www.django-rest-framework.org/) - Django REST framework


## 🚀 Executar localmente
```
criar banco no postgresql 
criar arquivo .env com base no arquivo .env-exemplo
```

Importar locais de vacinação na pasta datasets
```
Locais de vacinação = http://repositorio.dados.gov.br/saude/unidades-saude/unidade-basica-saude/ubs.csv
```

Executar os seguintes comandos na pasta do projeto
```
virtualenv venv
cd .\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Configurar ALLOWED_HOSTS no arquivo settings.py
```sh 
Adicionar o IP do computador no array ALLOWED_HOSTS (Linha 190)
```

Executar os seguintes comandos na pasta ./front-end
```sh 
npm install
npm run build (para gerar o build de produção)
npm start
```

Links do projeto
```sh 
Página: http://localhost:8000/agenda/
Admin: http://localhost:8000/admin
Cadastro: http://localhost:8000/agenda/cadastro/cidadao
API: http://localhost:8000/api/v1/
Logar via API: http://localhost:8000/api/token
```


Para emular o aplicativo mobile, instale e configure o:
```sh 
Instale o Android Studio (crie tambem um AVD)
Extensão do  VScode: Android Ios Emulator
Configurar o path do emulator nas preferências do VScode
Colocar o IP do computador nos arquivos MeusAgendamentos.js (Linha 47) login.js (Linha 35)
No VScode pressione Ctrl + Shift + P e digite emulator e escolha o AVD criado
```

Executar os seguintes comandos na pasta ./mobile
```sh 
npm install
npm run android
```


## ✒️ Autor

* **Lucas Silva Nóbrega** - [github](https://github.com/lucas-nobrega)