import { comparePasswords, getFlagsByUsername, getUserByUsername } from "../models/authModel.js";

export const loginPage = (req, res) => {
  const errorMessage = req.session.errorMessage;
  delete req.session.errorMessage; // Clear the message after displaying
  res.render("login.ejs", { errorMessage }); // Render the login page with error messages
};

export const login = async (req, res) => {
  const username = req.body.username;
  const loginPassword = req.body.password;

  try {
    // Get user from database
    const { user, error: userError } = await getUserByUsername(username);
    if (userError) {
      req.session.errorMessage = "User not found";
      return res.redirect("/");
    }

    // Check password
    const result = await comparePasswords(loginPassword, user.password_hash);
    if (!result) {
      req.session.errorMessage = "Incorrect Password";
      return res.redirect("/");
    }

    // Get user's flags (restrictions)
    const { flags, error: flagsError } = await getFlagsByUsername(username);
    if (flagsError) {
      return res.status(500).send("Internal server error");
    }

    // Process flags for restrictions
    if (flags.length > 0) {
      // Check if the user is banned
      const banFlag = flags.find(flag => flag.restriction_type === 'Ban');
      if (banFlag) {
        return res.send("You have been banned. Access denied.");
      }

      // Check if the user is suspended
      const suspendFlag = flags.find(flag => flag.restriction_type === 'Suspend');
      if (suspendFlag) {
        const suspendDuration = 30 * 1000; // 30 seconds
        const nowUtc = new Date();
        const now = new Date(nowUtc.getTime() + (8 * 60 * 60 * 1000)); // Adjust for timezone
        const suspendTime = new Date(suspendFlag.created_time);
        const timeRemaining = now - suspendTime;

        if (timeRemaining < suspendDuration) {
          return res.send("You have been suspended. Please contact support.");
        }
      }
    }

    // No restriction, proceed with login
    req.session.user_id = user.user_id;
    req.session.username = username;

    // Redirect based on user type
    if (user.user_type === 'ADMIN') {
      return res.redirect("/admin");
    } else {
      return res.redirect("/main");
    }
  } catch (err) {
    console.error("Error during login process:", err);
    return res.status(500).send("Internal server error");
  }
};
