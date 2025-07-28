const express = require("express");
const puppeteer = require("puppeteer");
const { BROWSER_OPTIONS } = require("../config/constants");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + '/../views/index.html');
});

router.get("/render", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing ?url");

  try {
    const browser = await puppeteer.launch(BROWSER_OPTIONS);
    const page = await browser.newPage();

    if (req.session.cookies) {
      await page.setCookie(...req.session.cookies);
    }

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const cookies = await page.cookies();
    req.session.cookies = cookies;

    const html = await page.content();
    await browser.close();

    res.set("Content-Type", "text/html");
    res.send(html);
  } catch (e) {
    res.status(500).send("Proxy error: " + e.message);
  }
});

module.exports = router;
