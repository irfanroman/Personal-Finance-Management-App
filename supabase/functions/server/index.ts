/**
 * Backend Server Routes
 * Handles authentication and transaction management
 */
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono().basePath('/server');

// Initialize Supabase client
const getSupabaseClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to verify authentication
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized - No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];
  const supabase = getSupabaseClient();

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.error("Auth error:", error?.message);
    return c.json({ error: "Unauthorized - Invalid token" }, 401);
  }

  // Store user in context for use in route handlers
  c.set("user", user);
  await next();
};

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

/**
 * AUTHENTICATION ROUTES
 */

// Sign up endpoint
app.post("/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const supabase = getSupabaseClient();

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true,
    });

    if (error) {
      console.error("Signup error:", error.message);
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
      }
    });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

/**
 * TRANSACTION ROUTES
 */

// Get all transactions for the authenticated user
app.get("/transactions", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("kv_store_67ccc6c0")
      .select("value")
      .like("key", `transactions:${user.id}:%`);

    if (error) {
      console.error("Error fetching transactions:", error.message);
      return c.json({ error: "Failed to fetch transactions" }, 500);
    }

    // Extract transaction values from the data
    const transactions = data?.map(row => row.value) || [];

    return c.json({ transactions });
  } catch (error: any) {
    console.error("Error fetching transactions:", error.message);
    return c.json({ error: "Failed to fetch transactions" }, 500);
  }
});

// Create a new transaction
app.post("/transactions", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const transaction = await c.req.json();

    if (!transaction.id || !transaction.description || !transaction.amount || !transaction.date || !transaction.type) {
      return c.json({ error: "Invalid transaction data" }, 400);
    }

    const supabase = getSupabaseClient();

    // Store transaction with user-specific key
    const key = `transactions:${user.id}:${transaction.id}`;
    const { error } = await supabase
      .from("kv_store_67ccc6c0")
      .upsert({ key, value: transaction });

    if (error) {
      console.error("Error creating transaction:", error.message);
      return c.json({ error: "Failed to create transaction" }, 500);
    }

    return c.json({ transaction });
  } catch (error: any) {
    console.error("Error creating transaction:", error.message);
    return c.json({ error: "Failed to create transaction" }, 500);
  }
});

// Update a transaction
app.put("/transactions/:id", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const transactionId = c.req.param("id");
    const updates = await c.req.json();

    const supabase = getSupabaseClient();

    // First, verify the transaction belongs to this user
    const key = `transactions:${user.id}:${transactionId}`;
    const { data: existing, error: fetchError } = await supabase
      .from("kv_store_67ccc6c0")
      .select("value")
      .eq("key", key)
      .single();

    if (fetchError || !existing) {
      return c.json({ error: "Transaction not found" }, 404);
    }

    // Update the transaction
    const updatedTransaction = { ...existing.value, ...updates, id: transactionId };
    const { error } = await supabase
      .from("kv_store_67ccc6c0")
      .update({ value: updatedTransaction })
      .eq("key", key);

    if (error) {
      console.error("Error updating transaction:", error.message);
      return c.json({ error: "Failed to update transaction" }, 500);
    }

    return c.json({ transaction: updatedTransaction });
  } catch (error: any) {
    console.error("Error updating transaction:", error.message);
    return c.json({ error: "Failed to update transaction" }, 500);
  }
});

// Delete a transaction
app.delete("/transactions/:id", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const transactionId = c.req.param("id");

    const supabase = getSupabaseClient();

    const key = `transactions:${user.id}:${transactionId}`;
    const { error } = await supabase
      .from("kv_store_67ccc6c0")
      .delete()
      .eq("key", key);

    if (error) {
      console.error("Error deleting transaction:", error.message);
      return c.json({ error: "Failed to delete transaction" }, 500);
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting transaction:", error.message);
    return c.json({ error: "Failed to delete transaction" }, 500);
  }
});

Deno.serve(app.fetch);
