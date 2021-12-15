import { PDFDocument, StandardFonts, rgb} from 'pdf-lib'

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
    const fontSize = 30
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