const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const cv = require("../../assets/curriculum.json")

exports.makeCV = _ => {
  console.log("preparing document definition")
  const dd = {
    info: {
      title: "sombriks (a.k.a. Leonardo Silveira) curriculum",
      author: "sombriks",
      randomrant: "Lisboa is way much more expensive than Fortaleza and this is bad because i did some math and the 1.5k euros isn't enough since i am already well-paid here. if possible, make it 4653 euros, that way you cover the city expenses and gives me a real income increase."
    },
    content: [
      { text: `${cv.resume.name} (${cv.resume.alias})`, style: "title" },
      ``,
      {
        table: {
          body: [
            []
          ]
        }
      }
    ],
    styles: {
      title: {
        fontSize: 24,
        bold: true
      },
      h1: {
        fontSize: 18,
        bold: true
      }
    }
  }
  pdfMake.createPdf(dd).download(`leonardo-silveira-${new Date().toJSON()}.pdf`);
}