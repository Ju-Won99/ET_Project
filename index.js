var express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const {pool } = require('./db');
const sql = require('mssql');
const { data } = require('jquery');

app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');

//정적 파일 경로 설정
app.use('/favicon.ico', express.static('public/favicon.ico'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.redirect('/login');
  });

app.get('/login', function(req, res) {
    console.log("실행 /login")
    res.render('login'); 
});

app.post('/login', async (req, res) => {
    try {
        var email = req.body.EMAIL ? req.body.EMAIL.trim() : '';
        var password = req.body.PW ? req.body.PW.trim() : '';

        var query = await pool
        var result = await query.request()
            .input('P_VALUE1', email )
            .input('P_VALUE2', password )
            .execute("login_ET")
           
        var result_data = result.recordsets[0];

        console.log(result_data)

        res.redirect('/view');
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
  });

app.get('/view', async function(req, res) {
  try {
    const Month_Data = req.query.Month_Data || null; // 날짜 데이터
    const Item = req.query.Item || null; // 매출/매입 데이터
    const Separtes_Item = req.query.Separtes_Item || null; // separates items 데이터
    const FEE = req.query.FEE || null; // fee 데이터
    const MEMO = req.query.MEMO || null; // memo 데이터
  
    var query = await pool
    var result = await query.request()
      .input('P_VALUE1', Month_Data )
      .input('P_VALUE2', Item)
      .input('P_VALUE3', Separtes_Item)
      .input('P_VALUE4', FEE)
      .input('P_VALUE5', MEMO)
      .execute("Month_Table_ET")
          
    var result_data = result.recordsets[0];

    res.render("view", {
    result_data: result_data, Month_Data:Month_Data,  ITEM:Item,
    Separtes_Item:Separtes_Item,FEE:FEE, MEMO:MEMO
  });
  }
  catch(err) {
    res.status(500);
    res.send(err.message);
  } 
});

app.get('/view_tab_2', async function(req, res) {
  try {
    const Month_Data = req.query.Month_Data || null; // 날짜 데이터
    const Item = req.query.Item || null; // 매출/매입 데이터
    const Separtes_Item = req.query.Separtes_Item || null; // separates items 데이터
    const FEE = req.query.FEE || null; // fee 데이터
    const MEMO = req.query.MEMO || null; // memo 데이터
  
    var query = await pool
    var result = await query.request()
      .input('P_VALUE1', Month_Data )
      .input('P_VALUE2', Item)
      .input('P_VALUE3', Separtes_Item)
      .input('P_VALUE4', FEE)
      .input('P_VALUE5', MEMO)
      .execute("Month_Table_ET")
          
    var result_data = result.recordsets[0];

    res.render("view_tab_2", {
    result_data: result_data, Month_Data:Month_Data,  ITEM:Item,
    Separtes_Item:Separtes_Item,FEE:FEE, MEMO:MEMO
  });
  }
  catch(err) {
    res.status(500);
    res.send(err.message);
  } 
});

app.get('/view_tab_3', async function(req, res) {

  res.render("view_tab_3");
});

app.get('/estimate', async function (req, res) {
  try {
    const selectedMonth = req.query.selectedMonth || null; 

    var query = await pool
    var result = await query.request()
    .input('P_VALUE1', selectedMonth)
    .execute("ESTIMATE_ET");

    var result_data = result.recordsets[0];
    console.log("실행 /estimate");
    res.render("view_tab_2", {
      result_data: result_data, selectedMonth: selectedMonth
    });
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

app.post('/delete', async (req, res) => {

  try {
    const selectedIds = JSON.parse(req.body.selectedIds);
    for (var i = 0; i < selectedIds.length; i++) {
      var query = await pool;
      var result = await query.request()
        .input('P_VALUE1', sql.Int, selectedIds[i]) // 각 ID에 대해 입력값 설정
        .execute("DELETE_ET");
    }
    res.redirect("view_tab_2")
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }

});

app.get('/get_data', async (req, res) => {
  try {
      const selectedIds = req.query.selectedIds.split(','); // GET 요청에서 선택한 ID 배열을 가져옵니다.

      const query = await pool;
      const selectedData = [];
      console.log(selectedData);
      for (let i = 0; i < selectedIds.length; i++) {
          const result = await query.request()
              .input('P_VALUE1', sql.Int, selectedIds[i])
              .execute("UPDATE_VIEW_ET");
          const data = result.recordsets[0][0];
          console.log(data);
          selectedData.push(data);
      }
      res.json(selectedData);
  } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
  }
});

app.post('/update', async (req, res) => {
  try {
    const updatedDataArray = req.body; // 수정된 데이터 배열을 받아옵니다.
    console.log(updatedDataArray)
    for (let i = 0; i < updatedDataArray.length; i++) {
        const updatedData = updatedDataArray[i];
        
        var query = await pool;
        var result = await query.request()
            .input('P_VALUE1', updatedData.Month_Data)
            .input('P_VALUE2', updatedData.Separtes_Item)
            .input('P_VALUE3', updatedData.FEE)
            .input('P_VALUE4', updatedData.MEMO)
            .input('P_VALUE5', updatedData.ID)
            .execute("UPDATE_ET");
    
        var result_data = result.recordsets[0];
    }
    
    // 수정 작업이 완료된 후 /view_tab_2 페이지로 리디렉션
    res.render('/view_tab_2');
  } catch (err) {
      res.status(500);
      res.send(err.message);
  }
});

app.get('/view_tab_4', async function(req, res) {

  res.render("view_tab_4");
});

app.listen(PORT, () => {
    console.log('Server On : http://localhost:${PORT}/');
});