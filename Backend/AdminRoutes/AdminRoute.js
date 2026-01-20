// Landstime_Androidapp/Backend/AdminRoutes/AdminRoute.js

// import express from "express";
// import { adminLogin } from "../AdminControllers/AdminController.js";

// const router = express.Router();

// router.post("/login", adminLogin);

// export default router;


// NEW CODE:
import express from "express";
import { 
adminLogin, 
adminLogout,
getAllUsers, 
toggleUserBlock,
createAdminAccount,    // ADD
  getAllAdmins,          // ADD
  updateAdminStatus,     // ADD
  deleteAdmin
} from "../AdminControllers/AdminController.js";
import { verifyAdmin } from "../AdminMiddleware/AdminMiddleware.js";

const router = express.Router();

// Public route
router.post("/login", adminLogin);

// Protected routes
router.post("/logout", verifyAdmin, adminLogout);
router.get("/users", verifyAdmin, getAllUsers);
router.put("/users/:userId/toggle-block", verifyAdmin, toggleUserBlock);
// SuperAdmin only routes
router.post("/admins", verifyAdmin, createAdminAccount);
router.get("/admins", verifyAdmin, getAllAdmins);
router.put("/admins/:adminId/status", verifyAdmin, updateAdminStatus);
router.delete("/admins/:adminId", verifyAdmin, deleteAdmin);

export default router;
