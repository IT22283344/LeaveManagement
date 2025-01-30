import express from "express";
import {  addleaveform, deleteLeaverequest, GetLeaveform, updateleaveform } from "../controllers/leave.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/addleaveform",verifyToken,addleaveform);
router.get('/getleaveform',GetLeaveform);
router.delete('/deleteLeaverequest/:id',deleteLeaverequest);
router.put('/updateleaveform/:_id',updateleaveform);


export default router;