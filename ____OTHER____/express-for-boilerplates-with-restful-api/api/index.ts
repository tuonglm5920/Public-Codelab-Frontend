import type { NextFunction, Request, Response } from "express";

require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// In-memory database
let brandings: Branding[] = [
  {
    _id: "1",
    merchantCode: "BEAUTY001",
    brandingCode: "BRAND001",
    brandingName: "Beauty Glow",
    createdBy: "Alice",
    updatedBy: "Alice",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  },
  {
    _id: "2",
    merchantCode: "BEAUTY002",
    brandingCode: "BRAND002",
    brandingName: "Radiant Skin",
    createdBy: "Bob",
    updatedBy: "Bob",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  },
  {
    _id: "3",
    merchantCode: "BEAUTY003",
    brandingCode: "BRAND003",
    brandingName: "Glamour Shades",
    createdBy: "Charlie",
    updatedBy: "Charlie",
    status: "DEACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  },
  {
    _id: "4",
    merchantCode: "BEAUTY004",
    brandingCode: "BRAND004",
    brandingName: "Elegance Essentials",
    createdBy: "David",
    updatedBy: "David",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  },
  {
    _id: "5",
    merchantCode: "BEAUTY005",
    brandingCode: "BRAND005",
    brandingName: "Luxe Looks",
    createdBy: "Eve",
    updatedBy: "Eve",
    status: "DEACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  },
  {
    _id: "6",
    merchantCode: "BEAUTY006",
    brandingCode: "BRAND006",
    brandingName: "Chic Styles",
    createdBy: "Fay",
    updatedBy: "Fay",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  },
  {
    _id: "7",
    merchantCode: "BEAUTY007",
    brandingCode: "BRAND007",
    brandingName: "Gorgeous Glam",
    createdBy: "Grace",
    updatedBy: "Grace",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  },
  {
    _id: "8",
    merchantCode: "BEAUTY008",
    brandingCode: "BRAND008",
    brandingName: "Dazzling Diva",
    createdBy: "Hank",
    updatedBy: "Hank",
    status: "DEACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  },
  {
    _id: "9",
    merchantCode: "BEAUTY009",
    brandingCode: "BRAND009",
    brandingName: "Polished Perfection",
    createdBy: "Ivy",
    updatedBy: "Ivy",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  },
  {
    _id: "10",
    merchantCode: "BEAUTY010",
    brandingCode: "BRAND010",
    brandingName: "Refined Radiance",
    createdBy: "Jack",
    updatedBy: "Jack",
    status: "DEACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  },
];
// Dummy user for login
const user = {
  _id: "1",
  merchantCode: "merchant123",
  memberCode: "member123",
  email: "dmsthp2023@gmail.com",
  memberName: "Test User",
  phone: "1234567890",
  roleSample: "Sample Role",
  role: "Admin",
  gender: "Male",
  position: "Manager",
  status: "Active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  __v: 0,
  password: "Admin@123",
};

// JWT secret key
const ACCESS_TOKEN_SECRET = "your_jwt_secret_key";
const REFRESH_TOKEN_SECRET = "your_refresh_token_secret_key";

// Branding model interface
export interface Branding {
  _id: string;
  merchantCode: string;
  brandingCode: string;
  brandingName: string;
  createdBy: string;
  updatedBy: string;
  status: "ACTIVE" | "DEACTIVE";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Response interfaces
export interface ResponseListSuccess<T> {
  code: number;
  data: {
    hits: T[];
    pagination: {
      totalRows: number;
      totalPages: number;
    };
  };
}

export interface ResponseDetailSuccess<T> {
  code: number;
  data: T;
}

export interface ResponseFailure {
  code: number;
  timestamp: string;
  path: string;
  message: string;
  errors: any[];
}

export interface ResponseData {
  member: {
    _id: string;
    merchantCode: string;
    memberCode: string;
    email: string;
    memberName: string;
    phone: string;
    roleSample: string;
    role: string;
    gender: string;
    position: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  payload: {
    type: string;
    accessToken: string;
    refreshToken: string;
  };
}

export interface Login {
  email: string;
  password: string;
}

// Generate Access Token
const generateAccessToken = (user: any) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "10s" });
};

// Generate Refresh Token
const generateRefreshToken = (user: any) => {
  return jwt.sign(user, REFRESH_TOKEN_SECRET);
};

// Authentication middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json(createFailureResponse(401, req.path, "Unauthorized", []));

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json(createFailureResponse(403, req.path, "Forbidden", []));
    // @ts-ignore
    req.user = user;
    next();
  });
};

const createSuccessDetailResponse = <T>(data: T): ResponseDetailSuccess<T> => ({
  code: 0,
  data,
});

const createFailureResponse = (
  code: number,
  path: string,
  message: string,
  errors: any[]
): ResponseFailure => ({
  code,
  timestamp: new Date().toISOString(),
  path,
  message,
  errors,
});

// Login endpoint to generate tokens
app.post("/authz/login", (req: Request, res: Response) => {
  // Dummy authentication logic, replace with your actual authentication logic
  const { email, password } = req.body;

  if (email !== user.email || password !== user.password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const response: ResponseData = {
    member: user,
    payload: {
      type: "Bearer",
      accessToken,
      refreshToken,
    },
  };

  res.json(createSuccessDetailResponse(response));
});

// Endpoint to refresh access token using refresh token
app.post("/authz/refresh-token", (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken as any;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ email: user.email }); // Example: Re-generate access token

    const response: ResponseData = {
      member: user,
      payload: {
        type: "Bearer",
        accessToken,
        refreshToken,
      },
    };

    res.json(createSuccessDetailResponse(response));
  });
});

// Endpoint to get user profile
app.get("/authz/profile", authenticateToken, (req: Request, res: Response) => {
  const userProfile = {
    member: user,
  };

  const response: ResponseDetailSuccess<typeof userProfile> = {
    code: 0,
    data: userProfile,
  };

  res.json(response);
});

// Branding CRUD APIs
app.get(
  "/merchants/category/branding",
  authenticateToken,
  (req: Request, res: Response) => {
    const {
      limit = "10",
      offset = "0",
      status = {},
      BrandingName = {},
    } = req.query;

    const statusEq = (status as any).eq;
    const brandingNameContains = (BrandingName as any).contains;

    let filteredBrandings = brandings;

    if (statusEq) {
      filteredBrandings = filteredBrandings.filter(
        (branding) => branding.status === statusEq
      );
    }
    if (brandingNameContains) {
      filteredBrandings = filteredBrandings.filter((branding) =>
        branding.brandingName
          .toLowerCase()
          .includes((brandingNameContains as string).toLowerCase())
      );
    }

    const totalRows = filteredBrandings.length;
    const totalPages = Math.ceil(totalRows / +limit);
    const hits = filteredBrandings.slice(+offset, +offset + +limit);

    const response: ResponseListSuccess<Branding> = {
      code: 0,
      data: {
        hits,
        pagination: {
          totalRows,
          totalPages,
        },
      },
    };

    res.json(response);
  }
);

app.get(
  "/merchants/category/branding/:id",
  authenticateToken,
  (req: Request, res: Response) => {
    const branding = brandings.find((b) => b._id === req.params.id);
    if (!branding)
      return res
        .status(404)
        .json(createFailureResponse(404, req.path, "Branding not found", []));

    res.json(createSuccessDetailResponse(branding));
  }
);

app.post(
  "/merchants/category/branding",
  authenticateToken,
  (req: Request, res: Response) => {
    const branding: Branding = {
      ...req.body,
      _id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };
    brandings.push(branding);
    res.status(201).json(createSuccessDetailResponse(branding));
  }
);

app.put(
  "/merchants/category/branding/:id",
  authenticateToken,
  (req: Request, res: Response) => {
    const index = brandings.findIndex((b) => b._id === req.params.id);
    if (index === -1)
      return res
        .status(404)
        .json(createFailureResponse(404, req.path, "Branding not found", []));

    brandings[index] = {
      ...brandings[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    res.json(createSuccessDetailResponse(brandings[index]));
  }
);

app.delete(
  "/merchants/category/branding/:id",
  authenticateToken,
  (req: Request, res: Response) => {
    const index = brandings.findIndex((b) => b._id === req.params.id);
    if (index === -1)
      return res
        .status(404)
        .json(createFailureResponse(404, req.path, "Branding not found", []));

    brandings.splice(index, 1);
    res.status(204).send();
  }
);

// Server setup
app.listen(8080, () => console.log("Server ready on port 8080."));

module.exports = app;
