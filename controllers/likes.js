
const {connection} = require("./db");


const addLikes = async (req, res) => {
  const { id } = req.body  
  try {
      const maket = await connection.execute(
        `SELECT makets.likes FROM makets WHERE makets.id = ?`, [id]);       
    let like = maket[0][0].likes + 1
        console.log(like)
       const resp = await connection.execute(
      `UPDATE makets SET likes = ? WHERE id = ?`,
         [like, id]);   
         res.status(200).json({like: like})       
    } catch {
      res.status(500).json({ status: "error", message: "Ошибка, попробуйте позже" });
    }
};



module.exports = {
  addLikes

};

