export const confirmHTML = (token: string, userId: string, username: string) => {
  const PORT = process.env.PORT || 5000;
  const DOMAIN = process.env.DOMAIN;

  const date = new Date().toLocaleString("ru");

  const link = `${
    process.env.NODE_ENV === "production" ? DOMAIN : `http://localhost:${PORT}`
  }/api/v1/confirm-email?userId=${userId}&token=${token}`;

  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8" />
      <title>Подтверждение аккаунта</title>
    </head>
    <body
      style="
        margin:0;
        padding:20px;
        font-family:Helvetica, Arial, sans-serif;
        background:#f2f3f4;
        text-align:center;
      "
    >
      <div
        style="
          display:inline-block;
          width:90%;
          max-width:360px;
          background:#ffffff;
          padding:24px 24px;
          border-radius:8px;
          box-shadow:0 4px 12px rgba(0,0,0,0.1);
          text-align:left;
          box-sizing:border-box;
        "
      >
        <h1
          style="
            margin:0 0 24px 0;
            font-size:22px;
            color:#000000;
            line-height:1.2;
          "
        >
          Здравствуйте, ${username}!
        </h1>

        <p
          style="
            font-size:14px;
            line-height:1.5;
            color:#333333;
          "
        >
          Чтобы активировать ваш аккаунт в SaleWallet, нам нужно подтвердить вашу почту.<br><br>
          Пожалуйста, нажмите на кнопку ниже для верификации. Вы перейдете на сайт, после чего регистрация будет автоматически завершена.
        </p>

        <div style="text-align:center; margin:32px 0;">
          <a
            href="${link}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              display:inline-block;
              padding:14px 50px;
              background:#97689B;
              color:#ffffff;
              text-decoration:none;
              border-radius:8px;
              font-size:14px;
              white-space:nowrap;
            "
          >
            Активировать аккаунт
          </a>
        </div>

        <hr style="border:none; border-top:1px solid #e0e0e0; margin:20px 0;">

        <p
          style="
            font-size:10px;
            color:#999999;
            margin:0;
            text-align:center;
          "
        >
          Если вы не регистрировались в SaleWallet — просто проигнорируйте это письмо
        </p>
      </div>

      <p
        style="
          font-size:10px;
          color:#999999;
          margin-top:10px;
        "
      >
        Отправлено ${date}
      </p>
    </body>
    </html>
  `;
};
