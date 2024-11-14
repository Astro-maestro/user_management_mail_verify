// repositories/UserRepository.js
const User = require('../model/User');
const bcrypt = require('bcryptjs');

class UserRepository {
  // Register a new user with an optional image URL
  async register({ name, email, password, role, file }) {
    
    try {
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const image = file ? `/uploads/${file.filename}` : "https://www.jotform.com/blog/wp-content/uploads/2022/12/how-to-add-link-to-google-form-1280x500.jpg";
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        image // Save image URL
      });
      return await newUser.save();
    } catch (error) {
      throw new Error('Registration failed: ' + error.message);
    }
  }

  

  // Login a user
  async login(email) {
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid credentials"); // Avoid exposing details for security
        }


        return user; // Return user if found
    } catch (error) {
        throw new Error("Login failed: " + error.message);
    }
}

  


  // Update a user’s password
  async updatePassword(userId, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await User.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true }
      );
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Password update failed: ' + error.message);
    }
  }

  // Fetch user data for dashboard view
  async getUserDashboard(userId) {
    try {
      const user = await User.findById(userId, 'name email role image');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Error fetching user data: ' + error.message);
    }
  }

  async findUser(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Error fetching user data: ' + error.message);
    }
  }

  // Placeholder for logout (token management can be handled on the client side or with server-side blacklisting)
  async logout(userId) {
    try {
      // Optional server-side token management:
      // For example, add JWT to a blacklist or invalidate session (if implemented).
      // Here, we’ll just confirm the user has logged out
      return { message: 'User logged out successfully', userId };
    } catch (error) {
      throw new Error('Logout failed: ' + error.message);
    }
  }

}

module.exports = new UserRepository();
