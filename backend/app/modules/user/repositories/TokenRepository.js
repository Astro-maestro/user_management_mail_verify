const Token = require('../model/Token'); // Adjust the path according to your directory structure

class TokenRepository {
    // Create a new token
    async createToken(tokenData) {
        const token = new Token(tokenData);
        return await token.save();
    }

    // Find a token by user ID
    async findTokenByUserId(userId) {
        return await Token.findOne({ _userId: userId });
    }

    // Find a token by token string
    async findToken(tokenString) {
        return await Token.findOne({ token: tokenString });
    }

    // Delete a token by user ID
    async deleteTokenByUserId(userId) {
        return await Token.deleteOne({ _userId: userId });
    }

    // Delete a token by token string
    async deleteToken(tokenString) {
        return await Token.deleteOne({ token: tokenString });
    }

    // List all tokens for a user
    async listTokensForUser(userId) {
        return await Token.find({ _userId: userId });
    }
}

module.exports = new TokenRepository();