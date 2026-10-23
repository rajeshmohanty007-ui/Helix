export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/privacy", "/terms"],
        disallow: ["/api/", "/dashboard", "/tasks", "/projects", "/calendar", "/settings"],
      },
    ],
    sitemap: "https://helix.seraphimstudio.in/sitemap.xml",
  };
}
