const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.post('/generate_certificate', (req, res) => {
    const { name, location, score } = req.body;

    // Create a PDF document in memory
    const pdfDoc = new PDFDocument();
    const buffers = [];
    
    pdfDoc.on('data', buffer => buffers.push(buffer));
    pdfDoc.on('end', () => {
        // Concatenate all buffers to get the complete PDF
        const pdfData = Buffer.concat(buffers);
        
        // Set response headers for the PDF file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="certificate.pdf"`);
        
        // Stream the PDF to the response
        res.end(pdfData);
    });

    // Generate the certificate content
    pdfDoc.fontSize(16);
    pdfDoc.text('Certificate of Achievement', { align: 'center' });
    pdfDoc.text(`Name: ${name}`);
    pdfDoc.text(`Location: ${location}`);
    pdfDoc.text(`Total Score: ${score}`);

    pdfDoc.end(); // This triggers the 'end' event to finish the PDF generation
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
