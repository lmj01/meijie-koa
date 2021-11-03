import { PDFDocument, StandardFonts, rgb} from 'pdf-lib'

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
