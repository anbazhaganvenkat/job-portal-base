const sendgrid = require("sendgrid")("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");
const mailHelper = require("sendgrid").mail;
const EmailTemplate = require("email-templates").EmailTemplate;
const mime = require("mime-types");

function sendEmail(data, callback) {
   
    if (!data.to) {
        return callback("Email is required");
    }

    const toEmails = [];
    if (data.from.email && data.from.email !== data.to) {
        toEmails.push(data.to);
    }
 

    if (toEmails.length === 0) {
        return callback();
    }
    
    const template = new EmailTemplate(
        `${process.cwd()}/templates/${data.template}`
    );

    

    template.render(data.substitutions, (err, results) => {
  
        if (err) {
            return callback(err);
        }

        const content = new mailHelper.Content("text/html", results.html);


        const personalization = new mailHelper.Personalization();
        toEmails.forEach((toEmail) => {
            toEmail = new mailHelper.Email(toEmail);
            personalization.addTo(toEmail);
        });
        const attachment = new mailHelper.Attachment();
        if (data.attachment) {
            attachment.setContent(data.attachment);
            attachment.setType(mime.lookup(data.fileName));
            attachment.setFilename(data.fileName);
            attachment.setDisposition("attachment");
        }

        const mailDetail = new mailHelper.Mail();
        mailDetail.addPersonalization(personalization);
        mailDetail.setSubject(data.subject);
        mailDetail.setFrom({
            email: data.from.email,
            name: data.from.name,
        });
        if (data.attachment) {
            mailDetail.addAttachment(attachment);
        }
        mailDetail.addContent(content);

        const request = sendgrid.emptyRequest({
            method: "POST",
            path: "/v3/mail/send",
            body: mailDetail.toJSON(),
        });

      const sendgridApi = sendgrid.API(request, (err) => {
            if (err) {
                console.log(err);
            }
            return callback();
        });

        return sendgridApi;
    });
}

module.exports = sendEmail;
