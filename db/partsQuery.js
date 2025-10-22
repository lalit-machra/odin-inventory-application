import pool from "./pool.js";

async function addPart(name, price, imgbucket, imgkey, categoryId) {
  try {
    await pool.query(`
      INSERT INTO parts(part, price, imgbucket, imgkey, category_id)
      VALUES ($1, $2, $3, $4, $5);
    `, [name, price, imgbucket, imgkey, categoryId]);
    console.log("entry added to parts table");
  } catch(err) {
    console.error(err);
    console.log("Couldn't add entry to parts table");
  }
}

async function getStdPartImg() {
  try {
    const result = await pool.query(`
      SELECT imgkey FROM parts WHERE part LIKE 'Standard Part';
    `);
    console.log("Fetched standard part image info");
    return result.rows[0].imgkey;
  } catch(err) {
    console.error(err);
    console.log("Couldn't get standard part image info");
  }
}

async function getAllPartsByCategoryId(categoryId) {
  try {
    const result = await pool.query(`
      SELECT parts.part, parts.price, parts.imgbucket, parts.imgkey, categories.category
      FROM parts JOIN categories ON category_id = categories.id
      WHERE category_id = $1;
    `, [categoryId]);
    console.log("Part fetched from db");
    return result.rows;
  } catch(err) {
    console.error(err);
    console.log("failed to fetch part from db");
  }
}

export { addPart, getStdPartImg, getAllPartsByCategoryId };