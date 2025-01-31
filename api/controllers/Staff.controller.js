import staff from "../models/staff.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const add = async (req, res, next) => {
  const Staffmembername = req.body.Staffmembername;
  const employeeId = req.body.employeeId;
  const departmentname = req.body.departmentname;
  const email = req.body.email;
  const profilePicture = req.body.profilePicture;
  const password = req.body.password;
  const contactNumber = req.body.contactNumber;
  const position = req.body.position;
  const isManager = req.body.isManager;


  const newstaffmember = new staff({
    Staffmembername,
    employeeId,
    departmentname,
    email,
    password,
    contactNumber,
    position,
    profilePicture,
    isManager,
  });

  try {
    const savedmember = await newstaffmember.save();
    res.status(201).json(savedmember);
  } catch (error) {
    next(error);
  }
};
export const sendmail = async (req, res, next) => {
  const text = req.body.description;
  const to = req.body.email;
  const subject = req.body.subject;
  console.log(to);

  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service (e.g., Gmail, Outlook, etc.)
    auth: {
      user: "pesara.us@gmail.com", // Your email address
      pass: "", // Your email password or app password
    },
  });

  // Email options
  const mailOptions = {
    from: "pesara.us@gmail.com",
    to,
    subject,
    text,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ message: "Failed to send email", error });
  }
};

export const usersignin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await staff.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    let validPassword;
    if (password == validUser.password) {
      validPassword = true;
    }
    if (!validPassword) return next(errorHandler(400, "Invalid Credentials!"));
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000);
    res
      .cookie("acess_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json({ ...rest, id: validUser._id });
  } catch (error) {
    next(error);
  }
};

export const getstaff = async (req, res, next) => {
  staff
    .find()
    .then((Staff) => {
      res.json(Staff);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const Delete = async (req, res, next) => {
  let userId = req.params.id;

  staff
    .findByIdAndDelete(userId)
    .then(() => {
      res.status(200).send({ status: "Member deleted" });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send({ status: "Error with deleting data", error: err.message });
    });
};

export const Getmember = async (req, res, next) => {
  const userId = req.params.id;
  console.log(userId);
  staff.findOne({ _id: userId }).then((staff) => {
    if (staff) {
      res.json(staff);
    } else {
      res.status(401);
      console.log("error");
    }
  });
};

export const updatestaff = async (req, res, next) => {
  try {
    if (req.body.phonenumber) {
      const mobileRegex = /^(071|076|077|075|078|070|074|072)\d{7}$/;
      if (!mobileRegex.test(req.body.contactNumber)) {
        return next(errorHandler(400, "Invalid mobile number format."));
      }
    }
    const updatestaff = await staff.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          employeeId: req.body.employeeId,
          departmentname: req.body.departmentname,
          Staffmembername: req.body.Staffmembername,
          contactNumber: req.body.contactNumber,
          position: req.body.position,
          profilePicture:req.body.profilePicture,
          isManager:req.body.isManager,
        },
      },
      { new: true }
    );
    res.status(200).json(updatestaff);
  } catch (error) {
    next(error);
  }
};

export const assignManager = async (req, res, next) =>{
  const { id } = req.params;
  try {
    const user = await staff.findById(id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    user.isManager = true;
    await user.save();
    res.status(200).json({ message: 'User assigned Manager privileges successfully' });
  } catch (error) {
    next(error);
  }

};
export const resignManager = async (req, res, next) =>{

  const { id } = req.params;

  try {
    const user = await staff.findById(id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    user.isManager = false;
    await user.save();
    res.status(200).json({ message: 'User resigned Manager privileges successfully' });
  } catch (error) {
    next(error);
  }
  
};
