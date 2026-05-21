const users = [
  { id: 1, name: "Khairunnisa" },
  { id: 2, name: "Floome" },
  { id: 3, name: "4shoboiz" },
];

const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Mouse" },
  { id: 3, name: "Keyboard" },
];

const server = Bun.serve({
  port: 3001,

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // =========================================================
    // LATIHAN 3: Middleware - hitung waktu eksekusi per request
    // =========================================================
    const startTime = performance.now();

    const response = await handleRequest(path, method, request);

    const duration = (performance.now() - startTime).toFixed(2);
    console.log(`[${new Date().toLocaleTimeString()}] ${method} ${path} → ${response.status} (${duration}ms)`);

    return response;
  },
});

console.log(`🚀 Server Bun berjalan di http://localhost:${server.port}`);

// ===== HANDLER UTAMA =====
async function handleRequest(path: string, method: string, request: Request): Promise<Response> {

  // GET /
  if (path === "/" && method === "GET") {
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body>
          <h1>🏠 Halaman Utama (Bun)</h1>
          <p>Selamat datang di server Bun + TypeScript!</p>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // GET /about
  if (path === "/about" && method === "GET") {
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body>
          <h1>📄 Tentang Kami (Bun)</h1>
          <p>Routing manual dengan Bun sangat mudah!</p>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // GET /api/users
  if (path === "/api/users" && method === "GET") {
    return Response.json(users);
  }

  // POST /api/users
  if (path === "/api/users" && method === "POST") {
    try {
      const body = await request.json();
      console.log("Body diterima:", body);
    } catch {
      return Response.json({ error: "Body tidak valid" }, { status: 400 });
    }
    return Response.json({ message: "User berhasil dibuat (Bun)" }, { status: 201 });
  }

  // =========================================================
  // LATIHAN 1: Rute baru GET /api/products
  // Mengembalikan daftar produk dalam format JSON
  // =========================================================
  if (path === "/api/products" && method === "GET") {
    return Response.json(products);
  }

  // =========================================================
  // LATIHAN 1: Rute baru POST /api/products
  // Menerima data produk baru dan mengembalikan pesan sukses
  // =========================================================
  if (path === "/api/products" && method === "POST") {
    try {
      const body = await request.json();
      console.log("Produk diterima:", body);
      return Response.json(
        { message: "Produk berhasil ditambahkan!", data: body },
        { status: 201 }
      );
    } catch {
      return Response.json({ error: "Body tidak valid" }, { status: 400 });
    }
  }

  // =========================================================
  // LATIHAN 2: Parameter dinamis GET /api/users/:id
  // Menggunakan regex untuk menangkap angka di akhir path
  // Contoh: /api/users/1, /api/users/2
  // =========================================================
  const userMatch = path.match(/^\/api\/users\/(\d+)$/);
  if (userMatch && method === "GET") {
    const id = parseInt(userMatch[1]);
    const user = users.find((u) => u.id === id);

    if (!user) {
      return Response.json(
        { error: `User dengan ID ${id} tidak ditemukan` },
        { status: 404 }
      );
    }

    return Response.json(user);
  }

  // 404 fallback
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8"></head>
      <body>
        <h1>❌ 404 - Halaman Tidak Ditemukan (Bun)</h1>
      </body>
    </html>`,
    { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
