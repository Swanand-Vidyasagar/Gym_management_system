// Auth middleware for Next.js API routes
const jwt = require('jsonwebtoken');

// Helper to get user from token
async function getAuthUser(req) {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// Middleware wrapper for Next.js API routes
export async function authenticate(req) {
  const decoded = await getAuthUser(req);
  
  if (!decoded) {
    return {
      error: {
        success: false,
        message: 'No token provided or invalid token',
        status: 401
      }
    };
  }

  return { userId: decoded.userId, decoded };
}

export async function requireAuth(req) {
  const auth = await authenticate(req);
  if (auth.error) {
    return auth.error;
  }
  return auth;
}

export async function requireAdmin(req) {
  const auth = await authenticate(req);
  if (auth.error) {
    return auth.error;
  }

  // Note: You'll need to fetch user from DB to check role
  // This is a simplified version - implement full check in route handlers
  return auth;
}
