// controllers/AuthController.js
const UserRepository = require("../../repositories/UserRepository");
const TokenRepository = require("../../repositories/TokenRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET, JWT_EXPIRATION, FRONTEND_BASE_URL } = process.env; // Configure these in your environment
const utils = require("../../../../utils/utils");
const crypto = require("crypto");
const User = require("../../model/User");
const Token = require("../../model/Token");

class AuthController {
  // Register a new user and create a verification token
  async adminRegister(req, res) {
    const { name, email, password, role } = req.body;
    const file = req.file; // Get the uploaded file, if any

    try {
      // Call the UserRepository to register the user
      const user = await UserRepository.register({
        name,
        email,
        password,
        role,
        file,
      });

      // Respond with success message and user details, without generating a token
      res
        .status(201)
        .json({ message: `${user.role} registered successfully`, user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Log in an existing user
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Validate required fields
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      // Attempt to authenticate the user with the repository
      const user = await UserRepository.login(email);

      if (!user.password) {
        return res
          .status(401)
          .json({ message: "Invalid credentials: no password stored" });
      }

      if (user.role !== "Admin" && !user.isVerified) {
        return res.status(403).json({
          message:
            "Account not verified. Please check your email for verification link.",
        });
      }

      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Invalid credentials password" });
      }

      // Generate a JWT token upon successful login
      const tokenString = jwt.sign(
        {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRATION,
        }
      );

      // Save the token to the database for session management
      await TokenRepository.createToken({
        _userId: user._id,
        token: tokenString,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      // Respond with the user information and the JWT token
      res.status(200).json({
        message: `${user.role} Logged in successfully!`,
        token: tokenString,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update password for an authenticated user
  async updatePassword(req, res) {
    const { userId } = req.user; // Assume this is set by JWT middleware
    const { newPassword } = req.body;
    try {
      const updatedUser = await UserRepository.updatePassword(
        userId,
        newPassword
      );

      // Invalidate previous tokens upon password update if desired
      await TokenRepository.deleteTokenByUserId(userId);

      res
        .status(200)
        .json({ message: "Password updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get dashboard information for the logged-in user
  async dashboard(req, res) {
    const { userId } = req.user;
    try {
      const user = await UserRepository.getUserDashboard(userId);
      res.status(200).json({
        message: `Welcome ${user.name}, we are glad to have you as a ${user.role}`,
        user: user,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Log out the user by deleting their token
  async logout(req, res) {
    const { userId } = req.user;
    const user = await UserRepository.getUserDashboard(userId);
    try {
      // Delete token from TokenRepository
      await TokenRepository.deleteTokenByUserId(userId);

      res.status(200).json({ message: `${user.role} logged out successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async registerCreate(req, res) {
    const { name, email, password, role } = req.body;
    const file = req.file;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists." });
      }

      // Register the user
      const user = await UserRepository.register({
        name,
        email,
        password,
        role,
        file,
      });

      // Create a verification token
      const token = crypto.randomBytes(16).toString("hex");
      await TokenRepository.createToken({
        _userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });

      // Prepare email options
      const senderEmail = process.env.SENDER_EMAIL; // Your sender email
      const app_password = process.env.APP_PASSWORD; // Your email password
      const transporter = utils.transport(senderEmail, app_password);

      const verification_mail = `${req.protocol}://${req.headers.host}/api/confirmation/${user.email}/${token}`;

      const mailOptions = {
        from: "no-reply@yourapp.com",
        to: user.email,
        subject: "Account Verification",
        html: `
        <p>Hello ${name},</p>
        <p>Please verify your account by clicking the link:</p>
        <a href="${verification_mail}" style="color: blue;">${verification_mail}</a>
        <br />
        
        <p>These are your credentials:</p>
        <p>Email: ${user.email}</p>
        <p>Password: ${password}</p>
        <p>Thank you!</p>
    `,
      };

      // Send verification email
      await utils.mailSender(req, res, transporter, mailOptions);

      // Respond to the client
      res
        .status(201)
        .json({ message: "Registration successful, verification email sent." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Confirm user email based on token
  async confirmation(req, res) {
    const { token, email } = req.params;

    try {
      // Step 1: Find the token in the database
      const foundToken = await Token.findOne({ token });
      if (!foundToken) {
        console.log("Token not found");
        return res
          .status(400)
          .json({ message: "Verification link may be expired" });
      }

      // Step 2: Find the user associated with the token and email
      const user = await User.findOne({ email, _id: foundToken._userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Step 3: Check if the user is already verified
      if (user.isVerified) {
        return res.status(400).json({ message: "User is already verified" });
      }

      // Step 4: Update user's verification status
      const userVerified = await User.findByIdAndUpdate(
        user._id,
        { isVerified: true },
        { new: true }
      );
      if (!userVerified) {
        return res.status(500).json({ message: "Failed to verify user" });
      }

      // Step 5: Remove the used token from the database
      await Token.deleteOne({ token });

      // Step 6: Redirect to frontend login page based on user's role
      const frontendUrl = `${process.env.FRONTEND_BASE_URL}/${user.role}/login`;

      return res.redirect(frontendUrl);
    } catch (error) {
      console.error("Error during confirmation:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  async forgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      // Step 1: Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Step 2: Generate a reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // Step 3: Save token with expiration (1 hour)
      await TokenRepository.createToken({
        _userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: hashedToken,
      });

      // Step 4: Send reset password email
      const senderEmail = process.env.SENDER_EMAIL;
      const app_password = process.env.APP_PASSWORD;
      const transporter = utils.transport(senderEmail, app_password);

      const resetUrl = `${process.env.FRONTEND_BASE_URL}/reset-password/${resetToken}/${user.role}`;
      const mailOptions = {
        from: "no-reply@yourapp.com",
        to: user.email,
        subject: "Password Reset Request",
        html: `
            <p>Hello ${user.name},</p>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="color: blue; text-decoration: underline;" target="_blank">
              Reset Password
            </a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
            <p>If you did not request this, please ignore this email.</p>
        `,
      };

      await utils.mailSender(req, res, transporter, mailOptions);

      return res
        .status(200)
        .json({ message: "Password reset email sent.", user: user });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      return res
        .status(500)
        .json({
          message: "An error occurred while sending the password reset email.",
        });
    }
  }

  // Reset password method
  async resetPassword(req, res) {
    const { newPassword } = req.body;
    const { token } = req.params;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required." });
    }

    try {
      // Step 1: Hash the token to match the stored hashed token
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      // Step 2: Find the token in the database
      const foundToken = await TokenRepository.findToken(hashedToken);
      if (!foundToken || foundToken.expiration < Date.now()) {
        return res
          .status(400)
          .json({ message: "Token is invalid or expired." });
      }

      // Step 3: Find the user associated with the token
      const user = await User.findById(foundToken._userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Step 4: Hash and update the user's password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      // Step 5: Delete the reset token after use
      await TokenRepository.deleteTokenByUserId(user._id);

      res
        .status(200)
        .json({
          message:
            "Password reset successfully. Please log in with your new password.",
        });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while resetting the password." });
    }
  }
}

module.exports = new AuthController();
