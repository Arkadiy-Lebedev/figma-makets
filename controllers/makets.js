
const { connection } = require("./db");

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}



const getAllMakets = async (req, res) => {

  // CAST(CONCAT('["', REPLACE(makets.type, ', ', '", "'), '"]') AS JSON) AS type

    try {
  const resp = await connection.execute(
    `SELECT makets.id, makets.link, makets.image, CAST(makets.type AS JSON) AS type, CAST(makets.language AS JSON) AS language, CAST(makets.color AS JSON) AS color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", CAST(makets.images AS JSON) AS images, makets.features, levels.level, adaptives.adaptive  
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id 
       `);        
         res.status(200).json({data: resp[0]})   
          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список, повторите попытку познее" });
    }
};

const getMaket = async (req, res) => {

  const {id} = req.query
    try {
  const resp = await connection.execute(
    `SELECT makets.id, makets.link, makets.image, CAST(makets.type AS JSON) AS type, CAST(makets.language AS JSON) AS language, CAST(makets.color AS JSON) AS color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", CAST(makets.images AS JSON) AS images, makets.features, levels.level, adaptives.adaptive
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id WHERE makets.id = ?`, [id]);        
         res.status(200).json({data: resp[0]})   
          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список, повторите попытку познее" });
    }
};

const getMaketForOption = async (req, res) => {
 
  const {type, option} = req.query
    try {
  const resp = await connection.execute(
    `SELECT makets.id, makets.link, makets.image, CAST(makets.type AS JSON) AS type, CAST(makets.language AS JSON) AS language, CAST(makets.color AS JSON) AS color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", CAST(makets.images AS JSON) AS images, makets.features, levels.level, adaptives.adaptive
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id WHERE ${type} LIKE '%${option}%'`);        
         res.status(200).json({data: resp[0]})   
          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список, повторите попытку познее" });
    }
};

const getRandomMaketForOption = async (req, res) => {

  const {type, option} = req.query
    try {
  const resp = await connection.execute(
    `SELECT makets.id, makets.link, makets.image, CAST(makets.type AS JSON) AS type, CAST(makets.language AS JSON) AS language, CAST(makets.color AS JSON) AS color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", CAST(makets.images AS JSON) AS images, makets.features, levels.level, adaptives.adaptive
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id WHERE ${type} LIKE '%${option}%'`);   

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
     `SELECT makets.id, makets.link, makets.image, CAST(makets.type AS JSON) AS type, CAST(makets.language AS JSON) AS language, CAST(makets.color AS JSON) AS color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", CAST(makets.images AS JSON) AS images, makets.features, levels.level, adaptives.adaptive
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id ORDER BY makets.likes DESC`);   

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
    `SELECT makets.id, makets.link, makets.image, CAST(makets.type AS JSON) AS type, CAST(makets.language AS JSON) AS language, CAST(makets.color AS JSON) AS color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", CAST(makets.images AS JSON) AS images, makets.features, levels.level, adaptives.adaptive
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id LIMIT ${pageOn * limit},${limit}`);        
    res.status(200).json({
      count: count[0][0].count,
      pages: Math.ceil(pages),
      data: resp[0]
    })   
          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список, повторите попытку познее" });
    }
};


const addMakets = async (req, res) => {  
  const { link,
  image,
  level_id,
  type,
  adaptive_id,
  language,
  color,
  price,
  description,
  likes,
  title,
  date,
  images,
  features } = req.body
  console.log(req.body)

let daetOn 
  if (date) {
    daetOn = date.substr(0, 10)
  } else {
    daetOn = "2023-01-01"
  }
  
    try {       
     const resp = await connection.execute(
       `INSERT INTO makets(id, link, image, level_id, type, adaptive_id, language, color, price, description, likes, title, date, images, features) 
   VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
   [null, link, image, level_id, type, adaptive_id, language, color, price, description, likes, title, daetOn, images, features]);   
         console.log(resp[0])     
         res.status(200).json({data: resp[0]})   
          
    } catch {
      res.status(500).json({ status: "error", message: "Не удалось получить список , повторите попытку познее" });
    }
}; 

module.exports = {
  getAllMakets,
  getMaket,
  getMaketForOption,
  getRandomMaketForOption,
  getMaketPopular,
  getCountMakets,
  getMaketsPagination,
  addMakets

};

