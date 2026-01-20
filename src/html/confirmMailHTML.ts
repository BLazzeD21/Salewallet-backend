export const confirmMailHTML = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Email confirmed</title>
        <style>
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            background-color: #f5f7fa;
          }
          .card {
            padding: 32px;
            border-radius: 12px;
            background: #ffffff;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            text-align: center;
          }
          h1 {
            color: #2ecc71;
          }
          p {
            margin-top: 12px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Email confirmed</h1>
          <p>Your email has been successfully verified.</p>
        </div>
      </body>
    </html>
  `;
