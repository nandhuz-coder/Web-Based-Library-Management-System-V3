const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

// Function to create email template
function createEmailTemplate(templateName, data) {
  const templatePath = path.join(__dirname, `${templateName}.hbs`);
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateSource);
  return template(data);
}

module.exports = createEmailTemplate;
