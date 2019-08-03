const pdfMake = require('pdfmake');
const pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const cv = require("../../assets/curriculum.json");
const { profilepics } = require("../store");

exports.makeCV = _ => {
  console.log("preparing document definition");
  const dd = {
    info: {
      title: "sombriks (a.k.a. Leonardo Silveira) curriculum",
      author: "sombriks",
      randomrant: `
        Lisboa is way much more expensive than Fortaleza and this is bad because 
        i did some math and the 1.5k euros isn't enough since i am already 
        well-paid here. if possible, make it 4653 euros, that way you cover the
        city expenses and gives me a real income increase.
      `
    },
    content: [
      {
        layout: "headerLineOnly",
        table: {
          headerRows: 1,
          body: [
            [
              {
                text: `${cv.resume.name} (${cv.resume.alias})`,
                link: "https://sombriks.com.br",
                style: "title",
                alignment: "center"
              }
            ],
            [
              {
                layout: "headerLineOnly",
                table: {
                  // widths: ["25%", "75%"],
                  body: [
                    [
                      {
                        style: "h1",
                        fillColor: "#eeeeee",
                        text: "Basic info"
                      },
                      mkBasicInfo()
                    ],
                    [
                      {
                        style: "h1",
                        fillColor: "#eeffee",
                        text: "Work Experience"
                      },
                      mkWorkExperience()
                    ],
                    [
                      { style: "h1", fillColor: "#eeeeff", text: "Education" },
                      mkEducation()
                    ]
                  ]
                }
              }
            ]
          ]
        }
      },
      {
        text: `Generated at ${new Date().toJSON()}`,
        alignment: "right"
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
      },
      h2: {
        fontSize: 15,
        bold: true
      },
      h3: {
        fontSize: 13,
        bold: true
      },
      body: {
        fontSize: 12
      },
      description: {
        fontSize: 10,
        italics: true
      }
    }
  };
  pdfMake
    .createPdf(dd)
    .download(`leonardo-silveira-${new Date().toJSON()}.pdf`);
};

const mkBasicInfo = _ => {
  return {
    style: "body",
    text: `${cv.resume.country}, born in ${cv.resume.hometown}, ${
      cv.resume.birthdate
    }, state of ${cv.resume.state}. 
      ${cv.resume.bio}
      ${cv.contact.email} // ${cv.contact.phone}
    `
  };
};

const mkWorkExperience = _ => {
  let ret = { style: "body", stack: [] };
  cv.work.map(w => {
    ret.stack.push({
      style: "h2",
      text: `
        ${w.start} to ${w.end}
        ${mkPosition(w)} at ${w.company} 
      `
    });
    ret.stack.push({
      style: "body",
      text: `${w.description}
      `
    });
    mkProjects(w, ret.stack);
    mkTechStack(w, ret.stack);
  });
  return ret;
};

const mkPosition = w => {
  if (w.position) return w.position;
  if (w.positions) return w.positions.join(", ");
};

const mkProjects = (w, parent) => {
  parent.push({ style: "h3", text: `Projects/Client` });
  w.projects.map(p => {
    parent.push({
      style: "description",
      text: `> ${p.name}: ${p.description}\n\n`
    });
  });
};

const mkTechStack = (w, parent) => {
  parent.push({ style: "h3", text: `Tech Stack` });
  parent.push({ style: "description", text: w.techstack.join(", ") });
};

const mkEducation = _ => {
  let ret = { style: "body", stack: [] };
  cv.education.map(e => {
    ret.stack.push({
      style: "h2",
      text: `
        ${e.course} - ${e.start} to ${e.end}
      `
    });
    ret.stack.push({
      style: "description",
      text: `
        ${e.type}
        ${e.description}
      `
    });
  });
  return ret;
};
