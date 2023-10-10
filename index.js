var express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');


//정적 파일 경로 설정
app.use('/favicon.ico', express.static('public/favicon.ico'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.redirect('/view');
  });
app.get('/login', function(req, res) {
    res.render('login'); 
});
app.get('/view', function(req, res) {
    res.render('view'); 
});
app.listen(PORT, () => {
    console.log('Server On : http://localhost:${PORT}/');
});