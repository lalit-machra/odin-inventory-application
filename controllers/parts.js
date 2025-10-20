import { uploadImg, getImageUrl } from "../storage/s3operations.js";
import { addPart, getStdPartImg, getCategoryId, getAllPartsByCategoryId } from "../db/query.js";

async function populateParts(part, price, imgFileName, imgFilePath, category) {
  try {
    const bucketName = 'inventory-parts-480';
    let categoryId = await getCategoryId(category);
    if (categoryId) {
      if (imgFilePath != null) {
        await uploadImg(bucketName, imgFileName, imgFilePath);
      } else {
        imgFileName = await getStdPartImg();
      }
      await addPart(part, price, bucketName, imgFileName, categoryId);
      console.log("added to parts successfully");
    } else {
      throw new Error("No such category exists");
    }
  } catch(err) {
    console.error(err);
    console.log("couldn't add to parts");
  }
}

async function getParts(req, res) {
  let rawPart = req.params.part;
  // Capitalize each word
  let partName = rawPart.split('-').map(word => word.substr(0, 1).toUpperCase() + word.substr(1)).join(" ");
  let categoryId = await getCategoryId(partName);

  let parts = [];
  let addNew = {};  // send addNew as separate parameter to view.ejs and display it at last

  if (categoryId) {
    let allParts = await getAllPartsByCategoryId(categoryId);
    // Wait for allParts.forEach to finish before moving ahead
    let asyncIterator = new Promise((resolve, reject) => {
      allParts.forEach(async (part, index, arr) => {
        let partObj = {};
        partObj.name = part.part;
        partObj.price = part.price;
      
        let imgBucket = part.imgbucket;
        let imgKey = part.imgkey;
        partObj.image = await getImageUrl(imgBucket, imgKey);
        // 'Add New' should be at last
        parts.push(partObj);
        
        if (index === arr.length - 1) {
          resolve();
        }
      });
    });
    asyncIterator.then(() => {
      res.render("parts", { title: partName, parts: parts, addNew: addNew });
    });
  } else {
    console.log("Couldn't load the part");
    res.end();
  }
}

async function postParts(req, res) {

}

export { getParts, postParts };