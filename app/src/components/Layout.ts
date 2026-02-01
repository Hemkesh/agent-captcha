export function Layout({ title, children, wide }: { title: string; children: string; wide?: boolean }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Agent-CAPTCHA</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="container${wide ? ' wide' : ''}">
    ${children}
  </div>
</body>
</html>`;
}
