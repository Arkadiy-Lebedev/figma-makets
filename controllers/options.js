
const {connection} = require("./db");


const getOptions = async (req, res) => {
  console.log(req.query)
    try {
  const level = await connection.execute(
    `SELECT *  
       FROM levels`);    
 const types = await connection.execute(
    `SELECT *  
       FROM types`);    
 const adaptives = await connection.execute(
    `SELECT *  
       FROM adaptives`);    
 const language = await connection.execute(
    `SELECT *  
       FROM language`);  
 const colors = await connection.execute(
    `SELECT *  
       FROM colors`); 
       
      res.status(200).json({
        levels: level[0],
        types: types[0],
        adaptives: adaptives[0],
        language: language[0],
        colors: colors[0],
      }) 


          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список, повторите попытку познее" });
    }
};



module.exports = {
  getOptions

};

