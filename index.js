// import "dotenv/config";
import { CronJob } from "cron";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";

const notOpenText =
  "We are not open for applications right now. Please check back later!";

const notify = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.goto("https://cloudfactory.app/auth/apply");

  const jobDisabled = ".recruitment-disabled-info";

  // await page.waitForSelector(jobDisabled);
  await page.waitForNetworkIdle();
  if ((await page.$(jobDisabled)) !== null) {
    // do things with its content
    const isOpen = await page.evaluate(
      (el) => el.innerText,
      await page.$(jobDisabled)
    );
    if (isOpen !== null) {
      browser.close();
    }
    console.log(isOpen);
  } else {
    // do something else
    transporter.sendMail(mailOptions);
    const isOpen = "";
    console.log(isOpen);
    browser.close();
  }
};

const mailOptions = {
  from: process.env.EMAIL_ADDRESS,
  to: process.env.EMAIL_RECEIVER,
  subject: "Cloud Factory may have job openings",
  text: "Hello, I am cheerio, I have checked the page but didn't find the job application disabled element on the given page so I am sending you this email so you can check if there is some job opening in Cloud Factory.",
};

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS,
  },
});

const job = new CronJob("* * * * *", notify);

job.start();
