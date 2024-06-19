import PDFDocument from 'pdfkit'
import fs from 'fs'

export const pdfService = {
    buildPDF,
}

// function buildPDF(filename, entities) {
//     return new Promise((resolve, reject) => {
//         const doc = new PDFDocument();
        
//         const stream = fs.createWriteStream(filename);
//         stream.on('finish', resolve);
//         stream.on('error', reject);

//         doc.pipe(stream);

//         entities.forEach(entity => {
//             doc.fillColor("black")
//                 .fontSize(60)
//                 .text(entity.title)
//                 // .text(entity.description)
//                 // .text(entity.severity);

//             doc.addPage();
//         });

//         doc.end();
//     });
// }

function buildPDF(filename, entities) {
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream(filename))

    entities.forEach(entity => {
        doc.fillColor("black")
            .fontSize(60)
            .text(entity.title)

        doc.addPage()
    })

    doc.end()
}
