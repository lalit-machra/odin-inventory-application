import { addCategory, getAllCategories } from "../db/query.js";
import { uploadImg, getImageUrl } from "../storage/s3operations.js";

async function populateCategories(imgFilename, imgPath, imgTitle) {
  try {
    const bucketName = 'inventory-category-480';
    await uploadImg(bucketName, imgFilename, imgPath);
    await addCategory(imgTitle, bucketName, imgFilename);
    console.log("entry added to categories");
  } catch(error) {
    console.error(error);
    console.log("couldn't add the entry to categories");
  }
}

async function getCategories(req, res) {
  try {
    const categories = [];
    let addNew = {};
    const allCategories = await getAllCategories();
    // Wait for allCategories.forEach to finish before moving ahead
    let asyncIterator = new Promise((resolve, reject) => {
      allCategories.forEach(async (category, index, arr) => {
        let categ = {};
        categ.name = category.category;
        categ.tag = categ.name.toLowerCase().replaceAll(" ", "-");
        let imgBucket = category.imgbucket;
        let imgKey = category.imgkey;
        categ.image = await getImageUrl(imgBucket, imgKey);
        // 'Add New' should be at last
        if (categ.name != 'Add New') {
          categories.push(categ);
        } else {
          Object.assign(addNew, categ);
        }
        if (index === arr.length - 1) {
          categories.push(addNew);
          resolve();
        }
      });
    });
    asyncIterator.then(() => {
      res.render("index", { categories: categories });
    });
  } catch(err) {
    console.error(err);
    console.log("some error occured in displaying categories");
    res.end();
  }
}

function postCategories(req, res) {

}

export { getCategories, postCategories };