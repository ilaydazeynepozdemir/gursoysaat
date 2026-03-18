import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock3, Search } from "lucide-react";

type WatchItem = {
  id: number | string;
  brand?: string;
  model?: string;
  price?: number;
  image?: string;
  category?: string;
  stock?: number;
  description?: string;
  caseSize?: string;
  mechanism?: string;
};

function tryParseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return [];

  const headers = lines[0].split(",").map((h) => h.trim());

  return lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line, index) => {
      const values = line.split(",").map((v) => v.trim());
      const row: Record<string, string | number> = { id: index + 1 };

      headers.forEach((header, i) => {
        row[header] = values[i] ?? "";
      });

      if (row.price !== undefined && row.price !== "") {
        row.price = Number(row.price);
      }

      if (row.stock !== undefined && row.stock !== "") {
        row.stock = Number(row.stock);
      }

      return row;
    });
}

export default function GursoySaat() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/13ScUvY9yu-txJSkGZF6hhyBaHgC6ZR62joDHceq9OFc/export?format=csv&gid=0"
        );

        if (!response.ok) {
          throw new Error("Veri alınamadı.");
        }

        const text = await response.text();
        const json = tryParseJson(text);

        let parsed: WatchItem[] = [];

        if (Array.isArray(json)) {
          parsed = json;
        } else if (json && Array.isArray((json as { items?: WatchItem[] }).items)) {
          parsed = (json as { items: WatchItem[] }).items;
        } else {
          parsed = parseCsv(text) as WatchItem[];
        }

        if (!parsed.length) {
          throw new Error("Geçerli veri bulunamadı.");
        }

        setItems(parsed);
      } catch {
        setError("Ürünler yüklenemedi.");
      }
    };

    fetchProducts();
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return items;

    return items.filter((item) =>
      [item.brand, item.model, item.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, query]);

  const formatPrice = (price?: number) => {
    if (typeof price !== "number" || Number.isNaN(price)) return "Fiyat yok";

    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(201,167,90,0.18) 0%, rgba(15,15,15,0) 32%), linear-gradient(135deg, #0b0b0b 0%, #171411 46%, #c9a75a 100%)",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background:
              "linear-gradient(135deg, rgba(255,249,238,0.97) 0%, rgba(240,223,185,0.94) 100%)",
            borderRadius: 34,
            padding: 36,
            boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
            border: "1px solid rgba(210,175,96,0.48)",
            marginBottom: 24,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -80,
              top: -100,
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(201,167,90,0.26) 0%, rgba(201,167,90,0) 70%)",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 0.7fr",
              gap: 22,
              alignItems: "stretch",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20, flexWrap: "wrap" }}>
                <div
                  style={{
                    padding: 5,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #d7b261 0%, #f5e3a7 48%, #a77d2d 100%)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                  }}
                >
                  <div
                    style={{
                      width: 92,
                      height: 92,
                      borderRadius: "50%",
                      background: "#f8f3e8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src="/logo.png"
                      alt="Gürsoy Saat"
                      style={{ width: 78, height: 78, objectFit: "contain", display: "block", filter: "contrast(1.1) brightness(0.95)" }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 4,
                      textTransform: "uppercase",
                      color: "#8d6a27",
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    
                  </div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: 44,
                      lineHeight: 1.08,
                      color: "#8d6a27",
                    }}
                  >
                    Gürsoy Saat
                    <br />
                  </h1>
                </div>
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#4f3d18",
                  fontSize: 17,
                  lineHeight: 1.75,
                  maxWidth: 720,
                }}
              >
                Seçkin koleksiyon, sofistike detaylar ve lüks görünüm. Gold, krem ve siyah
                tonlarla tasarlanan bu vitrin, markanın premium kimliğini öne çıkarır.
              </p>

              <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
                <div
                  style={{
                    background: "#111111",
                    color: "#f0dcad",
                    borderRadius: 999,
                    padding: "10px 16px",
                    fontSize: 13,
                    letterSpacing: 1,
                    fontWeight: 600,
                  }}
                >
                  Premium Koleksiyon
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.66)",
                    color: "#6f521b",
                    borderRadius: 999,
                    padding: "10px 16px",
                    fontSize: 13,
                    letterSpacing: 1,
                    fontWeight: 600,
                    border: "1px solid rgba(201,167,90,0.4)",
                  }}
                >
                  Zamansız Tasarım
                </div>
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #101010 0%, #2c2418 58%, #c9a75a 100%)",
                color: "white",
                borderRadius: 30,
                padding: 26,
                boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: 3,
                    color: "#f3e1b0",
                    textTransform: "uppercase",
                  }}
                >
                  Canlı Saat
                </div>
                <div style={{ fontSize: 42, fontWeight: 700, marginTop: 10 }}>
                  {currentTime.toLocaleTimeString("tr-TR")}
                </div>
                <div style={{ color: "#f0dfb5", marginTop: 10, lineHeight: 1.6, fontSize: 14 }}>
                  {currentTime.toLocaleDateString("tr-TR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.16)" }}>
                <div style={{ color: "#f3e1b0", fontSize: 13 }}>Koleksiyondaki Ürün</div>
                <div style={{ fontSize: 34, fontWeight: 700, marginTop: 4 }}>{items.length}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div
          style={{
            background: "rgba(255,249,238,0.95)",
            borderRadius: 24,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 12px 30px rgba(0,0,0,0.14)",
            border: "1px solid rgba(210,175,96,0.45)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: 0, color: "#111111", fontSize: 30 }}>Saatler</h2>
              <p style={{ marginTop: 8, color: "#7a5c20" }}>
                Koleksiyonu keşfet ve tarzına uygun modeli bul.
              </p>
            </div>

            <div style={{ position: "relative", width: 340, maxWidth: "100%" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#8a6a2d",
                }}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Marka, model veya kategori ara"
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 40px",
                  borderRadius: 16,
                  border: "1px solid #c9a75a",
                  boxSizing: "border-box",
                  background: "#fffaf0",
                  color: "#111111",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {error ? (
            <div
              style={{
                marginTop: 16,
                background: "#fff1f1",
                color: "#b42318",
                border: "1px solid #f3b2b2",
                borderRadius: 14,
                padding: 14,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id ?? index}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <div
                style={{
                  background: "linear-gradient(180deg, rgba(255,251,243,0.99) 0%, rgba(244,231,199,0.96) 100%)",
                  borderRadius: 26,
                  overflow: "hidden",
                  boxShadow: "0 18px 36px rgba(0,0,0,0.16)",
                  height: "100%",
                  border: "1px solid rgba(210,175,96,0.48)",
                }}
              >
                <div
                  style={{
                    aspectRatio: "4 / 3",
                    background: "linear-gradient(135deg, #f5e6c4 0%, #d8b56b 100%)",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.image || "https://placehold.co/600x450?text=Gorsel+Yok"}
                    alt={`${item.brand || "Saat"} ${item.model || ""}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.4s ease",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x450?text=Gorsel+Yok";
                    }}
                  />
                </div>

                <div style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
                    <div>
                      <div style={{ fontSize: 19, fontWeight: 700, color: "#111111" }}>
                        {item.brand || "Marka"}
                      </div>
                      <div style={{ fontSize: 14, color: "#7a5c20", marginTop: 4 }}>
                        {item.model || "Model"}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        background: "#111111",
                        color: "#f3deb0",
                        borderRadius: 999,
                        padding: "7px 12px",
                        height: "fit-content",
                        fontWeight: 600,
                      }}
                    >
                      {item.category || "Saat"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 18,
                      marginBottom: 18,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#111111" }}>
                      {formatPrice(item.price)}
                    </div>
                    <div style={{ fontSize: 14, color: "#7a5c20", fontWeight: 600 }}>
                      Stok: {item.stock ?? "-"}
                    </div>
                  </div>

                  <div style={{ fontSize: 14, color: "#4b3a16", lineHeight: 1.65 }}>
                    <div>{item.description || "Açıklama yok"}</div>
                    <div style={{ marginTop: 8 }}>Kasa: {item.caseSize || "-"}</div>
                    <div>Mekanizma: {item.mechanism || "-"}</div>
                  </div>

                  <button
                    style={{
                      width: "100%",
                      marginTop: 18,
                      padding: "13px 14px",
                      borderRadius: 16,
                      border: "none",
                      background: "linear-gradient(135deg, #111111 0%, #b89248 100%)",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: 700,
                      letterSpacing: 0.2,
                    }}
                  >
                    İncele
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
