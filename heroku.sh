git add . 
git commit -am "heroku Build"
git push heroku master
heroku tail --logs