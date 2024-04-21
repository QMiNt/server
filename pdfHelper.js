const fs = require('fs');

const taxPeriod = { 'GSTR3B': 'Monthly', 'GSTR1': 'Monthly', 'GSTR2X': 'Quaterly', 'GSTR9C': 'Annualy', 'GSTR9': 'Annualy', 'ITC04': 'Annualy/Half Yearly', 'GSTR2': 'Annualy/Half Yearly', 'TRAN3': 'Annualy/Half Yearly' }
const gstRet = ['GSTR3B', 'GSTR1', 'GSTR2X', 'TRAN2', 'TRAN1']
const Months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

function generateHeader(doc) {
    doc.image('logo.png', 50, 45, { width: 50 })
        .fillColor('#444444')
        .fontSize(20)
        .text('CA Cloud Desk', 110, 57)
        .fontSize(10)
        .moveDown();
}

function generateFooter(doc) {
    doc.fontSize(
        10,
    ).text(
        'Payment is due within 15 days. Thank you for your business.',
        50,
        730,
        { align: 'center', width: 500 },
    );
}
function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke()
        .moveDown();
}
function generateCustomerInformation(doc, details) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("GST Information", 50, 130);

    generateHr(doc, 155);

    const customerInformationTop = 200 - 30;
    if (details.prd)
        doc
            .fontSize(10)
            .text("BUSINESS NAME:", 50, customerInformationTop)
            .font("Helvetica")
            .text(details.bsnm, 150, customerInformationTop)
            .font("Helvetica")
            .text("Trade Name:", 300, customerInformationTop)
            .text(details.lgnm, 400, customerInformationTop)
            .text("PAN:", 50, customerInformationTop + 15)
            .text(details.pan, 150, customerInformationTop + 15)
            .text("Financial Year:", 300, customerInformationTop + 15)
            .text(details.prd, 400, customerInformationTop + 15)
            .text("ADDRESS:", 50, customerInformationTop + 30)
            .text(details.address, 150, customerInformationTop + 30)
            .font("Helvetica")
            .text("Entity Type:", 50, customerInformationTop + 45)
            .font("Helvetica")
            .text(details.entityType, 150, customerInformationTop + 45)
            .text("Nature of Business:", 300, customerInformationTop + 45)
            .text(details.natureOfBusiness, 400, customerInformationTop + 45)
            .text("Pincode:", 50, customerInformationTop + 60)
            .text(details.pincode, 150, customerInformationTop + 60)
            .text("Department Code:", 300, customerInformationTop + 60)
            .text(details.departmentCode, 400, customerInformationTop + 60)
            .text("Registration Type:", 50, customerInformationTop + 75)
            .text(details.registrationType, 150, customerInformationTop + 75)
            .text("Registration Date:", 300, customerInformationTop + 75)
            .text(details.registrationDate, 400, customerInformationTop + 75)
            .moveDown();
    else
        doc
            .fontSize(10)
            .text("Business Name:", 50, customerInformationTop)
            .font("Helvetica")
            .text(details.bsnm, 150, customerInformationTop)
            .font("Helvetica")
            .text("Trade Name:", 300, customerInformationTop)
            .text(details.lgnm, 400, customerInformationTop)
            .text("PAN:", 50, customerInformationTop + 15)
            .text(details.pan, 150, customerInformationTop + 15)
            .text("Address:", 50, customerInformationTop + 30)
            .text(details.address, 150, customerInformationTop + 30)
            .font("Helvetica")
            .text("Entity Type:", 50, customerInformationTop + 45)
            .font("Helvetica")
            .text(details.entityType, 150, customerInformationTop + 45)
            .text("Nature of Business:", 300, customerInformationTop + 45)
            .text(details.natureOfBusiness, 400, customerInformationTop + 45)
            .text("Pincode:", 50, customerInformationTop + 60)
            .text(details.pincode, 150, customerInformationTop + 60)
            .text("Department Code:", 300, customerInformationTop + 60)
            .text(details.departmentCode, 400, customerInformationTop + 60)
            .text("Registration Type:", 50, customerInformationTop + 75)
            .text(details.registrationType, 150, customerInformationTop + 75)
            .text("Registration Date:", 300, customerInformationTop + 75)
            .text(details.registrationDate, 400, customerInformationTop + 75)
            .moveDown();

    generateHr(doc, 252 + 10);
}
function generateTables(doc, filling) {
    let s = 0;
    let types = Object.keys(filling);
    Object.keys(filling).forEach((key) => {
        doc.fontSize(20).text(key).moveDown();
        const tableArray = {
            headers: [
                { label: "Tax Period", property: 'ret_prd', width: 120, renderer: (value, indexColumn, indexRow, row) => gstRet.includes(key) ? Months[parseInt(value.slice(0, 2)) - 1] : taxPeriod[key] },
                { label: "Date of Filing", property: 'dof', width: 120, renderer: null },
                { label: "Status", property: 'status', width: 120, renderer: null },
            ],
            datas:
                filling[key]
            ,
        };
        doc.table(tableArray, {
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(14),
            prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(12),
        });
    })

    doc.moveDown(); // separate tables


}
function createInvoice(doc, details, filing) {
    generateHeader(doc); // Invoke `generateHeader` function.
    if (details)
        generateCustomerInformation(doc, details); // Invoke `generateCustomerInformation` function.
    if (filing) {
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("GST Filing Information", 50, 260 + 10)
            .moveDown();
        generateTables(doc, filing);
    }
    doc.end();
}

module.exports = {
    createInvoice,
};
