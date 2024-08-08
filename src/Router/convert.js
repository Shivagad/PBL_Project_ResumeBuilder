const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const path = require('path'); // Import the 'path' module

const router = express.Router();
const app = express();
// const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'ResumeTemplates', 'html1')));

// Serve the HTML form for creating the resume
router.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'Resume, 'html1', 'index.html'));
    res.render('resume1');
});

// Handle form submission and PDF generation
router.post('/', async (req, res) => {
    const { resumeContent } = req.body;

    try {
        // Launch Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set content and generate PDF
        await page.setContent(resumeContent);
        const pdfBuffer = await page.pdf();

        // Close browser
        await browser.close();

        // Send PDF as downloadable attachment
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports=router;