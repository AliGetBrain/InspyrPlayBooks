const Handlebars = require("handlebars");
require("../HandleBarHelpers");
const fs = require("node:fs");
const path = require("node:path");
const chokidar = require("chokidar");

const subject = `Invoice {{#each invoiceData}}#{{invoiceNumber}} {{/each}}Client: {{contactCompanyName}}, Missed Call`;

const emailMessage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>First Call Miss</title>
</head>

<body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 40px 20px; background-color: #F8FBFF;">
    <div style="margin-bottom: 12px; background: white; border-color:{{primaryColor}}; border-bottom: 3px solid {{primaryColor}}; border-radius: 8px; text-align: center; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <div style="margin: 15px 20px 0 0;">
                <img src="https://raw.githubusercontent.com/AliGetBrain/Logo-Storage/main/IS_logo-full_RGB_250x80.png" width="250" height="80" alt="Logo">
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <h2 style="margin: 0 0 15px 0; font-weight: 600; letter-spacing: 0.025em;">MISSED CALL</h2>
            </td>
          </tr>
      </table>
    </div>    
    <div style="background: white; border-radius: 12px; padding: 40px; position: relative; overflow: hidden;">
         <div style="margin-bottom: 12px; padding: 24px; background-color: white; border-radius: 8px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">
        <p style="margin: 0 0 16px 0; font-size: 1rem; font-weight: 500;">Hello,</p>

        <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6">
            We've attempted to contact you via phone regarding the following outstanding invoices:
        </p>

       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="
            margin: 0 auto 24px auto;
            font-family: Arial, sans-serif;
            max-width: 600px;
        ">
            <tr>
                <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%"
                        style="border-radius: 8px">
                        <!-- Table Header -->
                        <tr style="border-radius: 8px 8px 0 0;">
                            <td style="background-color: #F8FBFF; padding: 16px; width: 33%; vertical-align: top; text-align: center;">
                                <p style="margin: 0; font-size: 14px; color: #333333; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                                    Invoice #
                                </p>
                            </td>
                            <td style="background-color: #F8FBFF; padding: 16px; width: 33%; vertical-align: top; text-align: center;">
                                <p style="margin: 0; font-size: 14px; color: #333333; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                                    Amount
                                </p>
                            </td>
                            <td style="background-color: #F8FBFF; padding: 16px; width: 33%; vertical-align: top; text-align: center;">
                                <p style="margin: 0; font-size: 14px; color: #333333; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                                    Due Date
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Invoice Data Rows -->
                        {{#each invoiceData}}
                        <tr>
                            <td style="padding: 16px; width: 33%; vertical-align: top; text-align: center;">
                                <p style="margin: 0; font-size: 16px; color: #333333; font-weight: 600;">
                                    {{invoiceNumber}}
                                </p>
                            </td>
                            <td style="padding: 16px; width: 33%; vertical-align: top; text-align: center;">
                                <p style="margin: 0; font-size: 16px; color: #333333; font-weight: 600;">
                                    {{ amount}}
                                </p>
                            </td>
                            <td style="padding: 16px; width: 33%; vertical-align: top; text-align: center;">
                                <p style="margin: 0; font-size: 16px; color: #e74c3c; font-weight: 600;">
                                    {{ dueDate}}
                                </p>
                            </td>
                        </tr>
                        {{/each}}
                    </table>
                </td>
            </tr>
        </table>

        <p style="margin-bottom: 12px; font-size: 1rem;">
            Please note we will try calling in a few days. <br>
            We kindly ask that you answer our call as the number is for outbound communication only and cannot receive incoming calls.
        </p>

          <p style="margin: 0; font-size: 1rem;">
            Best regards,<br>
            <span style="font-weight: 500;">Accounts Receiveable Department</span>
        </p>
        </div>

        <!-- Automated message -->
        <div style="margin-top: 15px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-family: Arial, Helvetica, sans-serif; font-size: 0.8rem; color: #6b7280; line-height: 1.4; text-align: center;">
        {{#if collector}}  
            <p style="margin: 0;">
              <strong style="color: #4b5563;">For questions, comments, or concerns contact your AR Specialist at <span style="color: #2563eb;">{{collectorEmail}}</span>.</strong>
          </p>
        {{/if}}  
          <p style="margin: 8px 0 0 0;">
              Find your original invoice by searching "<span style="font-style: italic;">Invoice #(Number)- Client: {{contactCompanyName}}</span>" in your inbox.
          </p>
      </div>
        </div>
        
</body>
</html>
`;

const data = {
  contactCompanyName: "Southern Ionics",
  contactName: "Kealy Baxter",
  collector: "Rachel Gonzalez",
  collectorEmail: "rgonzalez@inspyrsolutions.com",
  invoiceData: [
    {
      invoiceNumber: 1001,
      amount: 1880,
      dueDate: "2025-05-19",
    },
    {
      invoiceNumber: 1002,
      amount: 1880,
      dueDate: "2025-05-19",
    },
  ],
  primaryColor: "#0068FF",
};

const template = Handlebars.compile(emailMessage);
const subjectTemplate = Handlebars.compile(subject);
function generateAndSaveHTML() {
  try {
    console.log("Generating HTML...");
    const html = template(data);
    console.log("Subject: ", subjectTemplate(data));
    const outputFile = path.join(
      __dirname,
      "./html_output/first_failed_call.html"
    );
    fs.writeFileSync(outputFile, html);
    console.log(`HTML generated successfully at: ${outputFile}`);
  } catch (error) {
    console.error("Error generating HTML:", error);
  }
}

console.log("Setting up file watcher with chokidar...");

// Watch JS files
const watcher = chokidar.watch(["./*.js"], {
  ignored: /(node_modules|\.git)/,
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 300,
    pollInterval: 100,
  },
});

// Add event listeners
watcher
  .on("change", (path) => {
    console.log(`File ${path} has changed, regenerating HTML...`);
    generateAndSaveHTML();
  })
  .on("error", (error) => console.error(`Watcher error: ${error}`))
  .on("ready", () =>
    console.log("Initial scan complete. Ready for changes...")
  );

// Initial generation
console.log("Performing initial HTML generation...");
generateAndSaveHTML();
