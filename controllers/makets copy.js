
const { connection } = require("./db");

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}



const getAllMakets = async (req, res) => {

    try {
  const resp = await connection.execute(
    `SELECT makets.id, makets.link, makets.image, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, makets.features, levels.level, types.type, adaptives.adaptive, language.language, colors.color 
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id LEFT JOIN types ON makets.type_id = types.id
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id LEFT JOIN language ON makets.language_id = language.id
       LEFT JOIN colors ON makets.color_id = colors.id`);        
         res.status(200).json({data: resp[0]})   
          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список, повторите попытку познее" });
    }
};

const getMaket = async (req, res) => {

  const {id} = req.query
    try {
  const resp = await connection.execute(
    `SELECT makets.id, makets.link, makets.image, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, makets.features, levels.level, types.type, adaptives.adaptive, language.language, colors.color 
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id LEFT JOIN types ON makets.type_id = types.id
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id LEFT JOIN language ON makets.language_id = language.id
       LEFT JOIN colors ON makets.color_id = colors.id WHERE makets.id = ?`, [id]);        
         res.status(200).json({data: resp[0]})   
          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список, повторите попытку познее" });
    }
};

const getMaketForOption = async (req, res) => {
  console.log(req.query)
  const {type, option} = req.query
    try {
  const resp = await connection.execute(
    `SELECT makets.id, makets.link, makets.image, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, levels.level, types.type, adaptives.adaptive, language.language, colors.color 
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id LEFT JOIN types ON makets.type_id = types.id
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id LEFT JOIN language ON makets.language_id = language.id
       LEFT JOIN colors ON makets.color_id = colors.id WHERE ${type} = ?`, [option]);        
         res.status(200).json({data: resp[0]})   
          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список, повторите попытку познее" });
    }
};

const getRandomMaketForOption = async (req, res) => {

  const {type, option} = req.query
    try {
  const resp = await connection.execute(
    `SELECT makets.id, makets.link, makets.image, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, levels.level, types.type, adaptives.adaptive, language.language, colors.color 
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id LEFT JOIN types ON makets.type_id = types.id
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id LEFT JOIN language ON makets.language_id = language.id
       LEFT JOIN colors ON makets.color_id = colors.id WHERE ${type} = ?`, [option]);   

       let arr = []

      for (let i = 0; i < 4; i++) {
  arr.push(resp[0][getRndInteger(0, resp[0].length-1)])
      }
    
         res.status(200).json({data: arr})   
          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список, повторите попытку познее" });
    }
};

const getMaketPopular = async (req, res) => {

    try {
  const resp = await connection.execute(
     `SELECT makets.id, makets.link, makets.image, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", levels.level, types.type, adaptives.adaptive, language.language, colors.color 
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id LEFT JOIN types ON makets.type_id = types.id
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id LEFT JOIN language ON makets.language_id = language.id
       LEFT JOIN colors ON makets.color_id = colors.id ORDER BY makets.likes DESC`);   

       let arr = resp[0].slice(0, 5)
    
         res.status(200).json({data: arr})   
          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список, повторите попытку познее" });
    }
};


const getCountMakets = async (req, res) => {

    try {
  const resp = await connection.execute(
     `SELECT COUNT(*) as count FROM makets;`);   
    
         res.status(200).json({data: resp[0]})  
          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список, повторите попытку познее" });
    }
};



const getMaketsPagination = async (req, res) => {
const {page, limits} = req.query

 
  let pageOn = page -1
  let limit = limits
  try {
 const count = await connection.execute(
    `SELECT count(*) as count FROM makets`);     

    let pages = count[0][0].count / limit
    
  const resp = await connection.execute(
    `SELECT makets.id, makets.link, makets.image, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, makets.features, levels.level, types.type, adaptives.adaptive, language.language, colors.color 
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id LEFT JOIN types ON makets.type_id = types.id
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id LEFT JOIN language ON makets.language_id = language.id
       LEFT JOIN colors ON makets.color_id = colors.id LIMIT ${pageOn * limit},${limit}`);        
    res.status(200).json({
      count: count[0][0].count,
      pages: Math.ceil(pages),
      data: resp[0]
    })   
          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список, повторите попытку познее" });
    }
};

module.exports = {
  getAllMakets,
  getMaket,
  getMaketForOption,
  getRandomMaketForOption,
  getMaketPopular,
  getCountMakets,
  getMaketsPagination

};

