
    let http = require('request')

const sendTelegram = async (req, res) => {

  const { name, surname, telegram } = req.body  
  console.log(req.body  )
  try {     
    const config = require('../config.json');   
    let reqBody = req.body
    
    let fields = [
      '<b>Имя</b>: ' + reqBody.name,
      '<b>Фамилия</b>: ' + reqBody.surname,
      '<b>телеграмм</b>: ' + reqBody.telegram,
    ]
    let msg = ''
    
    fields.forEach(field => {
      msg += field + '\n'
    });
    msg = encodeURI(msg)
   
    http.post(`https://api.telegram.org/bot${config.telegram.token}/sendMessage?chat_id=${config.telegram.chat}&parse_mode=html&text=${msg}`, function (error, response, body) {  
    
      console.log('error:', error); 
      console.log('statusCode:', response && response.statusCode); 
      console.log('body:', body); 
      if(response.statusCode===200){
        res.status(200).json({status: 'ok', message: 'Успешно отправлено!'});
      }
      if(response.statusCode!==200){
        res.status(400).json({status: 'error', message: 'Произошла ошибка!'});
      }
    });

    } catch {
      res.status(500).json({ status: "error", message: "Ошибка, попробуйте позже" });
    }
};
module.exports = {
  sendTelegram

};

