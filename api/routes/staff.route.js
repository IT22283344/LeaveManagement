import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { add,assignManager,resignManager,sendmail } from '../controllers/Staff.controller.js';
import { getstaff } from '../controllers/Staff.controller.js';
import { Delete } from '../controllers/Staff.controller.js';
import { Getmember } from '../controllers/Staff.controller.js';
import {updatestaff} from "../controllers/Staff.controller.js";
import { usersignin } from '../controllers/Staff.controller.js';

const router = express.Router();

router.post('/add',add);
router.post('/sendmail',sendmail);
router.get('/get',getstaff);
router.delete('/delete/:id',Delete);
router.get('/getmember/:id',Getmember);
router.put('/updatemember/:id',updatestaff);
router.post('/login',usersignin);
router.put("/assignmanager/:id" , verifyToken , assignManager);
router.put("/resignmanager/:id" , verifyToken , resignManager);




export default router;