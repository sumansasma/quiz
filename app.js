const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
// Enable CORS for all routes
app.use(cors());

app.post('/generate_certificate', async (req, res) => {
    const { name, location, score } = req.body;

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const currentDateTime = new Date().toLocaleString();

    const certificateHTML = `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: skyblue;
                    margin: 0;
                    padding: 0;
                }

                #certificate {
                    text-align: center;
                    margin: 20px;
                    background-color: white;
                    padding: 20px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                }

                h2 {
                    font-size: 24px;
                    color: #333;
                }

                p {
                    font-size: 18px;
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <div id="certificate">
                <h2>Certificate of Achievement</h2>
                <p>Name: ${name}</p>
                <p>Location: ${location}</p>
                <p>Total Score: ${score}</p>
                <p>Quiz Taken Date and Time: ${currentDateTime}</p>
                <p>Organization Name: Sijgeria Umesh Chandra Smriti Sangha</p>
            </div>
        </body>
    </html>
`;

    await page.setContent(certificateHTML);

    const pdfBuffer = await page.pdf();

    // Set the response headers to indicate that this is a PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="certificate.pdf');
    
    // Send the PDF as binary data
    res.end(pdfBuffer);

    await browser.close();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
