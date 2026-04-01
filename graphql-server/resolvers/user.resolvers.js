import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Player from "../models/Player.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, 
  maxAge: 24 * 60 * 60 * 1000,
};

const userResolvers = {
  Query: {
 user: async (_, { id }, context) => {
  try {
    if (!context.user || context.user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error(error.message || "Failed to fetch user");
  }
},

    me: async (_, __, context) => {
      try {
        if (!context.user) {
          return null;
        }

        const user = await User.findById(context.user.id);

        if (!user) {
          return null;
        }

        return user;
      } catch (error) {
        console.error("Error fetching current user:", error);
        throw new Error("Failed to fetch current user");
      }
    },

    users: async (_, __, context) => {
  try {
    if (!context.user || context.user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const users = await User.find();
    console.log("Fetched users:", users);

    return users || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.message || "Failed to fetch users");
  }
},
  },

  Mutation: {
    register: async (_, { username, email, password, role }, context) => {
      try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          throw new Error("User already exists with this email");
        }

        const newUser = new User({
          username,
          email,
          password,
          role: role || "Player",
        });

        const savedUser = await newUser.save();

        if (savedUser.role === "Player") {
          const existingPlayer = await Player.findOne({ user: savedUser._id });

          if (!existingPlayer) {
            const newPlayer = new Player({
              user: savedUser._id,
              ranking: 0,
              tournaments: [],
            });

            await newPlayer.save();
          }
        }

        const token = jwt.sign(
          {
            id: savedUser._id,
            email: savedUser.email,
            role: savedUser.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        context.res.cookie("token", token, COOKIE_OPTIONS);

        return {
          message: "User registered successfully",
          user: savedUser,
        };
      } catch (error) {
        console.error("Error registering user:", error);
        throw new Error(error.message || "Registration failed");
      }
    },

    login: async (_, { email, password }, context) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        context.res.cookie("token", token, COOKIE_OPTIONS);

        return {
          message: "Login successful",
          user,
        };
      } catch (error) {
        console.error("Error logging in:", error);
        throw new Error(error.message || "Login failed");
      }
    },

    logout: async (_, __, context) => {
      try {
        context.res.clearCookie("token", {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        });

        return {
          message: "Logout successful",
          user: null,
        };
      } catch (error) {
        console.error("Error logging out:", error);
        throw new Error("Logout failed");
      }
    },

    createUser: async (_, { username, email, password, role }, context) => {
      try {
        if (!context.user || context.user.role !== "Admin") {
          throw new Error("Unauthorized");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
          throw new Error("User already exists with this email");
        }

        const newUser = new User({
          username,
          email,
          password,
          role,
        });

        const savedUser = await newUser.save();

        if (savedUser.role === "Player") {
          const existingPlayer = await Player.findOne({ user: savedUser._id });

          if (!existingPlayer) {
            const newPlayer = new Player({
              user: savedUser._id,
              ranking: 0,
              tournaments: [],
            });

            await newPlayer.save();
          }
        }

        return savedUser;
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error(error.message || "Failed to create user");
      }
    },

    updateUser: async (_, { id, username, email, role }, context) => {
  try {
    if (!context.user || context.user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const existingUser = await User.findById(id);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const emailOwner = await User.findOne({ email });

    if (emailOwner && emailOwner._id.toString() !== id) {
      throw new Error("Another user already uses this email");
    }

    existingUser.username = username;
    existingUser.email = email;
    existingUser.role = role;

    const updatedUser = await existingUser.save();

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(error.message || "Failed to update user");
  }
},

deleteUser: async (_, { id }, context) => {
  try {
    if (!context.user || context.user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    if (context.user.id === id) {
      throw new Error("You cannot delete your own admin account");
    }

    await Player.findOneAndDelete({ user: id });
    await User.findByIdAndDelete(id);

    return "User deleted successfully";
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error(error.message || "Failed to delete user");
  }
},
  },
};

export default userResolvers;