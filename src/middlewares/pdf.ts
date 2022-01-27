import { 
    PDFDocument, StandardFonts, rgb, degrees, 
    PDFFont, PDFPage, RGB, PDFImage, PageSizes, 
} from 'pdf-lib';
import fontKit from '@pdf-lib/fontkit';
import { readFileSync, Dir, PathLike } from 'fs';
import path from 'path';

export interface PdfParameter {
    type: string,
    name: string,
}

/**
 * pdf绘制特征
 * 坐标是原点是左下角，向右是x增长，向上是y的增长
 */
const DefFontSize = 12;    
class PdfBase {
    font?: PDFFont;
    doc?: PDFDocument;
    page?: PDFPage;
    pageWidth: number;
    pageHeight: number;
    color?: RGB;
    fontSize: number;
    constructor() {    
        this.pageWidth = 0;
        this.pageHeight = 0;    
        this.fontSize = DefFontSize;
    }
    async create() {
        this.doc = await PDFDocument.create();
    }
    async save() {
        return await this.getDoc().save();
    }
    getDoc() {
        if (!this.doc) throw 'not create document';        
        return this.doc;
    }
    getFont() {
        if (!this.font) throw 'not create font';        
        return this.font;
    }
    getPage() {
        if (!this.page) throw 'not create page';        
        return this.page;
    }
    async fontStandard() {
        this.font = await this.getDoc().embedFont(StandardFonts.TimesRoman);
    }
    async fontRegister(fontPath: string, options: any) {
        const fontBytes = await readFileSync(path.resolve(__dirname, fontPath));
        this.getDoc().registerFontkit(fontKit);
        this.font = await this.getDoc().embedFont(fontBytes, options);
    }
    async imageRead(imgPath: string, imgType: string) {
        const imgBytes = await readFileSync(path.resolve(__dirname, imgPath));
        if (imgType == 'png') return await this.getDoc().embedPng(imgBytes);
        else if (imgType == 'jpg') return await this.getDoc().embedJpg(imgBytes);
        throw `not support image type ${imgType}`;
    }
    newPage(size:[number,number]) {
        this.page = this.getDoc().addPage(size);
        this.pageWidth = size[0];
        this.pageHeight = size[1];
    }
    toY(y: number) {
        return this.pageHeight - y;
    }
    text(idx:number, str: string, x: number, y: number) {
        const page = this.getDoc().getPage(idx);
        page.drawText(str, {
            x: x,
            y: y,
            color: this.color,
            size: this.fontSize,
            font: this.getFont(),
        })
    }
    lineHeight() {
        const font = this.getFont();
        return font.heightAtSize(this.fontSize);
    }
    strWidth(str:string) {
        const font = this.getFont();
        return font.widthOfTextAtSize(str, this.fontSize);
    }
    image(idx:number, img:PDFImage, x: number, y: number, width: number, height: number) {
        const page = this.getDoc().getPage(idx);
        page.drawImage(img, {x: x, y: y, width: width, height: -height});
    }    
    rect(idx:number, x: number, y: number, width: number, height: number, isFill:boolean) {
        const page = this.getDoc().getPage(idx);
        page.drawRectangle({
            x: x, y: y, width: width, height: -height,
            color: isFill ? this.color : undefined,
            borderColor: !isFill ? this.color : undefined,
        });
    }
}

export const simplePdf = async () => {
    const pdf = new PdfBase();
    await pdf.create();
    await pdf.fontStandard();
    pdf.newPage(PageSizes.A4);
    pdf.fontSize = 30;
    pdf.color = rgb(0, 0.56, 0.71);
    pdf.text(0, 'Creating PDFs in javascript is awesome!', 50, 4 * 30);
    return pdf.save();
}

export const pdfFont = async () => {
    const pdf = new PdfBase();
    await pdf.create();
    await pdf.fontRegister('../assets/NotoSansCJKsc-Regular.otf', {});
    const imgBiteRamp = await pdf.imageRead('../assets/images/doctor/biteRamp.png', 'png');    
    const [width, height] = PageSizes.A4;
    console.log('-a4 size-', width, height)
    let pageIdx = 0;
    const fontSize1 = 12;
    pdf.fontSize = fontSize1;
    const marginX = 25, marginY = 25;
    const paddingX = 8, paddingY = 8;
    const rcA1Width = 428, rcAHeight = pdf.lineHeight() * 2;
    const rcBWidth = (width - marginX * 2), rcBHeight = 30;
    const rcCWidth = (width - marginX * 2), rcCHeight = height - marginY * 2 - paddingY * 2 - rcAHeight - rcBHeight;
    function newPageTemplate() {        
        pdf.newPage([width, height]);
        pageIdx = pdf.getDoc().getPageCount() - 1;
        pdf.color = rgb(0, 1, 0);
        pdf.rect(pageIdx, marginX, pdf.toY(marginY), rcA1Width, rcAHeight, false);
        pdf.color = rgb(0, 0.56, 0.71);
        pdf.rect(pageIdx, marginX, pdf.toY(marginY+paddingY+rcAHeight), rcBWidth, rcBHeight, true);
        pdf.color = rgb(0, 1, 0);
        pdf.rect(pageIdx, marginX, pdf.toY(marginY + paddingY * 2 + rcAHeight + rcBHeight), rcCWidth, rcCHeight, false);        
    }
    function fillPageTitle() {
        const doc = pdf.getDoc();
        const count = doc.getPageCount();
        pdf.color = rgb(0, 0.56, 0.71);
        const today = new Date();
        const strToday = `${today.getFullYear()}/${today.getMonth()+1}/${today.getDay()}`;
        const strPatient1 = '患者：测试人员', strPatient2 = '#A00084', strDoctor = '医生：杨医生';
        for (let i = 0; i < count; i++) {
            pdf.text(i, strPatient1, marginX + paddingX, pdf.toY(marginY + pdf.lineHeight() * 0.8));            
            pdf.text(i, strPatient2, marginX + paddingX + pdf.strWidth(strPatient1) + paddingX, pdf.toY(marginY + pdf.lineHeight() * 0.8));            
            pdf.text(i, strDoctor, marginX + paddingX, pdf.toY(marginY + pdf.lineHeight() * 0.8 * 2));            
            pdf.text(i, strToday, rcA1Width + marginX - paddingX - pdf.strWidth(strToday), pdf.toY(marginY + pdf.lineHeight() * 0.8));
            let strPage = `${i+1}/${count}`
            pdf.text(i, strPage, rcA1Width + marginX - paddingX - pdf.strWidth(strPage), pdf.toY(marginY + pdf.lineHeight() * 0.8 * 2));
        }
    }
    newPageTemplate();
    // 
    pdf.fontSize = fontSize1;
    pdf.color = rgb(0, 0.56, 0.71);    
    pdf.image(pageIdx, imgBiteRamp, 80, pdf.toY(90), imgBiteRamp.width, imgBiteRamp.height);
    pdf.image(pageIdx, imgBiteRamp, 180, pdf.toY(90), 20, 20);
    newPageTemplate();
    fillPageTitle();
    return pdf.save();
}

export async function customerPdf(args: PdfParameter) {
    const pdf = new PdfBase();
    await pdf.create();
    await pdf.fontStandard();
    pdf.newPage(PageSizes.A4);
    pdf.fontSize = 10;
    pdf.color = rgb(0, 0.56, 0.71); 
    pdf.text(0, 'Creating PDFs in javascript is awesome!', 50, 4 * 10);
    pdf.text(0, `client provide data, type: ${ args.type }, name:  ${args.name}`, 50, 5 * 10);
    return pdf.save();
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