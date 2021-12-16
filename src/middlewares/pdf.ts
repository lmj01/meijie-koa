import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import { readFileSync, Dir, PathLike } from 'fs';
import path from 'path';

export interface PdfParameter {
    type: string,
    name: string,
}


export const simplePdf = async () => {
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const page = pdfDoc.addPage()
    const {width, height} = page.getSize()
    const fontSize = 30
    page.drawText('Creating PDFs in javascript is awesome!', {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.56, 0.71),
    })
    return await pdfDoc.save()
}

export async function customerPdf(args: PdfParameter) {
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const page = pdfDoc.addPage()
    const {width, height} = page.getSize()
    const fontSize = 10
    page.drawText('Creating PDFs in javascript is awesome!', {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.56, 0.71),
    });
    page.drawText(`client provide data, type: ${ args.type }, name:  ${args.name}`, {
        x: 50,
        y: height - 5 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.56, 0.71),
    });
    return await pdfDoc.save()
}

export async function modifyPdf() {
    // This should be a Uint8Array or ArrayBuffer
    // This data can be obtained in a number of different ways
    // If your running in a Node environment, you could use fs.readFile()
    // In the browser, you could make a fetch() call and use res.arrayBuffer()
    const existingPdfBytes =  readFileSync(path.resolve(__dirname, '../assets/template0.pdf'), {flag:'r'});
    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Get the first page of the document
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize()

    // Draw a string of text diagonally across the first page
    firstPage.drawText('This text was added with JavaScript!', {
        x: 5,
        y: height / 2 + 300,
        size: 50,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-45),
    })


    // Serialize the PDFDocument to bytes (a Uint8Array)
    return await pdfDoc.save();
}

export async function pdfFormFill() {
    // These should be Uint8Arrays or ArrayBuffers
    // This data can be obtained in a number of different ways
    // If your running in a Node environment, you could use fs.readFile()
    // In the browser, you could make a fetch() call and use res.arrayBuffer()
    const formPdfBytes = readFileSync(path.resolve(__dirname, '../assets/template1.pdf'), {flag:'r'});
    // const marioImageBytes = readFileSync(path.resolve(__dirname, '../assets/favicon.png'), {flag:'r'});
    // const emblemImageBytes = readFileSync(path.resolve(__dirname, '../assets/favicon.png'), {flag:'r'});

    // Load a PDF with form fields
    const pdfDoc = await PDFDocument.load(formPdfBytes)

    // Embed the Mario and emblem images
    // const marioImage = await pdfDoc.embedPng(marioImageBytes)
    // const emblemImage = await pdfDoc.embedPng(emblemImageBytes)

    // Get the form containing all the fields
    const form = pdfDoc.getForm()

    // Get all fields in the PDF by their names    
    const describeField = form.getTextField('describe');
    const nameField = form.getTextField('name');
    const femaleField = form.getCheckBox('female');
    const maleField = form.getCheckBox('male');

    // const characterImageField = form.getButton('CHARACTER IMAGE')
    // const factionImageField = form.getTextField('Faction Symbol Image')

    // Fill in the basic info fields
    nameField.setText('Mario')
    femaleField.check();
    maleField.check();

    // Fill the character image field with our Mario image
    // characterImageField.setImage(marioImage)

    // Fill the faction image field with our emblem image
    // factionImageField.setImage(emblemImage)

    // Fill in the traits field
    describeField.setText(
    [
        `Mario can use three basic three power-ups:`,
        `  • the Super Mushroom, which causes Mario to grow larger`,
        `  • the Fire Flower, which allows Mario to throw fireballs`,
        `  • the Starman, which gives Mario temporary invincibility`,
    ].join('\n'),
    )

    // Serialize the PDFDocument to bytes (a Uint8Array)
    return await pdfDoc.save()
}

export async function pdfCreateAndFill() {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()

    // Add a blank page to the document
    const page = pdfDoc.addPage([550, 750])

    // Get the form so we can add fields to it
    const form = pdfDoc.getForm()

    // Add the superhero text field and description
    page.drawText('Enter your favorite superhero:', { x: 50, y: 700, size: 20 })

    const superheroField = form.createTextField('favorite.superhero')
    superheroField.setText('One Punch Man')
    superheroField.addToPage(page, { x: 55, y: 640 })

    // Add the rocket radio group, labels, and description
    page.drawText('Select your favorite rocket:', { x: 50, y: 600, size: 20 })

    page.drawText('Falcon Heavy', { x: 120, y: 560, size: 18 })
    page.drawText('Saturn IV', { x: 120, y: 500, size: 18 })
    page.drawText('Delta IV Heavy', { x: 340, y: 560, size: 18 })
    page.drawText('Space Launch System', { x: 340, y: 500, size: 18 })

    const rocketField = form.createRadioGroup('favorite.rocket')
    rocketField.addOptionToPage('Falcon Heavy', page, { x: 55, y: 540 })
    rocketField.addOptionToPage('Saturn IV', page, { x: 55, y: 480 })
    rocketField.addOptionToPage('Delta IV Heavy', page, { x: 275, y: 540 })
    rocketField.addOptionToPage('Space Launch System', page, { x: 275, y: 480 })
    rocketField.select('Saturn IV')

    // Add the gundam check boxes, labels, and description
    page.drawText('Select your favorite gundams:', { x: 50, y: 440, size: 20 })

    page.drawText('Exia', { x: 120, y: 400, size: 18 })
    page.drawText('Kyrios', { x: 120, y: 340, size: 18 })
    page.drawText('Virtue', { x: 340, y: 400, size: 18 })
    page.drawText('Dynames', { x: 340, y: 340, size: 18 })

    const exiaField = form.createCheckBox('gundam.exia')
    const kyriosField = form.createCheckBox('gundam.kyrios')
    const virtueField = form.createCheckBox('gundam.virtue')
    const dynamesField = form.createCheckBox('gundam.dynames')

    exiaField.addToPage(page, { x: 55, y: 380 })
    kyriosField.addToPage(page, { x: 55, y: 320 })
    virtueField.addToPage(page, { x: 275, y: 380 })
    dynamesField.addToPage(page, { x: 275, y: 320 })

    exiaField.check()
    dynamesField.check()

    // Add the planet dropdown and description
    page.drawText('Select your favorite planet*:', { x: 50, y: 280, size: 20 })

    const planetsField = form.createDropdown('favorite.planet')
    planetsField.addOptions(['Venus', 'Earth', 'Mars', 'Pluto'])
    planetsField.select('Pluto')
    planetsField.addToPage(page, { x: 55, y: 220 })

    // Add the person option list and description
    page.drawText('Select your favorite person:', { x: 50, y: 180, size: 18 })

    const personField = form.createOptionList('favorite.person')
    personField.addOptions([
    'Julius Caesar',
    'Ada Lovelace',
    'Cleopatra',
    'Aaron Burr',
    'Mark Antony',
    ])
    personField.select('Ada Lovelace')
    personField.addToPage(page, { x: 55, y: 70 })

    // Just saying...
    page.drawText(`* Pluto should be a planet too!`, { x: 15, y: 15, size: 15 })

    // Serialize the PDFDocument to bytes (a Uint8Array)
    return await pdfDoc.save();
}