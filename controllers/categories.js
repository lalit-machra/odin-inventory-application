import { addCategory, deleteCategory, getAllCategories } from "../db/categoriesQuery.js";
import { uploadImg, getImageUrl, deleteImg } from "../storage/s3operations.js";

async function populateCategories(categoryTitle, imgFilename, imgPath, imgBuffer, imgMimeType) {
  try {
    const bucketName = 'inventory-category-480';
    await uploadImg(bucketName, imgFilename, imgPath, imgBuffer, imgMimeType);
    await addCategory(categoryTitle, bucketName, imgFilename);
    console.log("entry added to categories");
  } catch(error) {
    console.error(error);
    console.log("couldn't add the entry to categories");
  }
}

async function dePopulateCategories(categoryTitle, imgFilename) {
  try {
    const bucketName = 'inventory-category-480';
    await deleteImg(bucketName, imgFilename);
    await deleteCategory(categoryTitle);
    console.log("entry removed from categories");
  } catch(err) {
    console.error(err);
    console.log("couldn't remove entry from categories");
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
        if (categ.name === 'Add New') {
          addNew.name = categ.name;
          addNew.image = categ.image;
        } else {
          categories.push(categ);
        }
        if (index === arr.length - 1) {
          resolve();
        }
      });
    });
    asyncIterator.then(() => {
      res.render("index", { categories: categories, addNew: addNew });
    });
  } catch(err) {
    console.error(err);
    console.log("some error occured in displaying categories");
    res.end();
  }
}

async function postCategories(req, res) {
  let categoryTitle = req.body.name;
  let fileMimeType = req.files.image.mimetype;
  let fileType = fileMimeType.slice(fileMimeType.indexOf("/") + 1);
  let fileName = categoryTitle.toLowerCase().replaceAll(" ", "-") + "." + fileType;
  let fileBuffer = req.files.image.data;
  if (fileBuffer) {
    await populateCategories(categoryTitle, fileName, null, fileBuffer, fileMimeType);
  }
  res.redirect("/");
}

export { getCategories, postCategories };