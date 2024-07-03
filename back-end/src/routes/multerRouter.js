import { Router } from "express";
import { insertImg } from "../controllers/multerController.js";
import { uploadDocs, uploadProd, uploadProfile } from "../config/multer.js";

const multerRouter = Router();


multerRouter.post('/profiles', uploadProfile.single('profile'), insertImg);
multerRouter.post('/docs', uploadDocs.array('documents'), insertImg);
multerRouter.post('/products', uploadProd.array('products'), insertImg);

export default multerRouter;
