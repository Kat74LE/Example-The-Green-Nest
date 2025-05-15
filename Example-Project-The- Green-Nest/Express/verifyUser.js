const { User, UserDeliveryInformation, Admin } = require("../models");

//checks if the parameter user id and the user id from the database (extracted from token) are the same
async function checkAccessByID(res, userID) {
  const userUID = res.locals.userUID;
  const isAdmin = res.locals.isAdmin;

  if (isAdmin) {
    // Find the user by userID
    let user = null;

    user = await User.findOne({
      where: { userID },
      include: [{ model: UserDeliveryInformation }],
    });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    return user;
  } else {
    if (!userUID) {
      throw { status: 404, message: "User not found" };
    }
    // Find the user by userUID
    const user = await User.findOne({
      where: { userUID },
      include: [{ model: UserDeliveryInformation }],
    });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    // Check if the user has access to this ID
    if (user.userID != userID) {
      throw { status: 403, message: "Access denied (to this ID)" };
    }

    return user;
  }
}

//checks if the parameter admin id and the admin id from the database (extracted from token) are the same
async function checkAccessByIDAdmin(res, adminID) {
  const currAdminID = res.locals.adminUID;
  const isAdmin = res.locals.isAdmin;

  if (isAdmin) {
    let admin = null;

    admin = await Admin.findOne({
      where: { adminUID: currAdminID },
    });

    if (!admin) {
      throw { status: 404, message: "Admin not found" };
    }
    // Check if the admin has access to this ID
    if (admin.adminID != adminID) {
      throw { status: 403, message: "Access denied (to this ID)" };
    }

    return admin;
  } else {
    throw { status: 403, message: "Access denied" };
  }
}

//checks if the given email in the request is the same as in the database
async function checkAccessByEmail(res, email) {
  const userUID = res.locals.userUID;

  // Find the user by userUID
  const user = await User.findOne({
    where: { userUID },
    include: [{ model: UserDeliveryInformation }],
  });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  // Check if the user has access to this ID
  if (user.email != email) {
    throw { status: 403, message: "Access denied (to this email)" };
  }

  return user;
}

//checks if the given email in the request is the same as in the database
async function checkAccessByEmailAdmin(res, email) {
  const adminID = res.locals.adminUID;

  if (!adminID) {
    console.error("adminID is undefined!");
    throw { status: 500, message: "Internal Server Error" };
  }
  // Find the user by userUID
  const admin = await Admin.findOne({
    where: { adminUID: adminID },
  });

  if (!admin) {
    throw { status: 404, message: "Admin not found" };
  }

  // Check if the user has access to this ID
  if (admin.email != email) {
    throw { status: 403, message: "Access denied (to this email)" };
  }

  return admin;
}

module.exports = {
  checkAccessByID,
  checkAccessByEmail,
  checkAccessByIDAdmin,
  checkAccessByEmailAdmin,
};
