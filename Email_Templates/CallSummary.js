const Handlebars = require("handlebars");
require("../HandleBarHelpers");
const fs = require("node:fs");
const path = require("node:path");
const chokidar = require("chokidar");

const subject = `Invoice {{#each invoiceData}}#{{invoiceNumber}} {{/each}}Client: {{contactCompanyName}}, Call Summary`;

const emailMessage = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Call Summary</title>
  </head>
<body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 40px 20px; background-color: #F8FBFF;">
<!-- Header -->
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
                <h2 style="margin: 0 0 5px 0; font-weight: 600; letter-spacing: 0.025em;"><span style="color: {{primaryColor}};">CALL SUMMARY</span></h2>
                <p style="font-weight: 600; margin: 0 0 15px 0; font-size: 1rem;">{{contactCompanyName}} - {{callDate}}</p>
              </td>
            </tr>
        </table>
    </div>    

    <div style="background: white; border-radius: 12px; padding: 40px; position: relative; overflow: hidden;">
    <table
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="max-width: 600px; margin: 0 auto"
    >
      <!-- Client Info Card -->
      <tr>
        <td style="padding: 15px 20px 0 20px">
          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="
              background-color: #F8FBFF;
              border-radius: 6px;
            "
          >
            <tr>
              <td style="padding: 20px">
                <h2
                  style="
                    color: {{primaryColor}};
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    border-bottom: 1px solid #eeeeee;
                    padding-bottom: 10px;
                  "
                >
                  Client Details
                </h2>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td
                      width="50%"
                      style="vertical-align: top; padding-right: 10px"
                    >
                      <p style="margin: 0 0 5px 0;">
                        <strong>Client:</strong>
                      </p>
                      <p style="margin: 0 0 10px 0; color: #333333">
                        {{contactCompanyName}}
                      </p>
                       <p style="margin: 0 0 5px 0;">
                        <strong>Client Email:</strong>
                      </p>
                      <p style="margin: 0 0 10px 0; color: #333333">
                        {{contactEmail}}
                      </p>
                    </td>
                    <td
                      width="50%"
                      style="vertical-align: top; padding-left: 10px" 
                    >
                      <p style="margin: 0 0 5px 0;">
                       <strong>Customer #</strong>
                      </p>
                      <p style="margin: 0 0 10px 0; color: #333333">
                        {{customerNumber}}
                      </p>
                       <p style="margin: 0 0 5px 0;">
                        <strong>Call Date:</strong>
                      </p>
                      <p style="margin: 0 0 10px 0; color: #333333">
                        {{ callDate}}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Invoices Card -->
      <tr>
        <td style="padding: 15px 20px 0 20px">
          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="
              background-color: #F8FBFF;
              border-radius: 6px;
            "
          >
            <tr>
              <td style="padding: 20px">
                <h2
                  style="
                    color:{{primaryColor}};
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    border-bottom: 1px solid #eeeeee;
                    padding-bottom: 10px;
                  "
                >
                  Invoices Discussed
                </h2>
                
                {{#each invoiceData}}
               
                <!-- Invoice Items -->
                {{#if (eq tag 'willPay')}}
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    width="100%"
                    style="
                      margin-bottom: 10px;
                      background-color: #F8FBFF;
                      border-left: 4px solid #4caf50;
                      border-radius: 3px;
                    "
                  >
                    <tr style="background-color: white; border-radius: 8px;"> 
                      <td style="padding: 20px">
                        <p style="margin: 0; font-weight: bold; font-size: 16px">
                          Invoice #{{invoiceNumber}}
                        </p>
                      </td>
                        <td width="55%">
                          <p style="margin: 0 0 0 0; color: #4b5563">
                            Status:
                            <span style="color: #4caf50; font-weight: bold">
                            Scheduled for {{ promiseDate}}
                            </span>
                          </p>
                      </td>
                    </tr>
                  </table>
                {{/if}}
                {{#if (eq tag 'wasPaid')}}
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="
                    margin-bottom: 10px;
                    background-color: #F8FBFF;
                    border-left: 4px solid #ff9800;
                    border-radius: 3px;
                  "
                >
                  <tr style="background-color: white; border-radius: 8px;">
                    <td style="padding: 20px">
                      <p style="margin: 0; font-weight: bold; font-size: 16px">
                        Invoice #{{invoiceNumber}}
                      </p>
                     </td>
                      <td width="55%">
                        <p style="margin: 0 0 0 0; color: #666666">
                          Status:
                          <span style="color: #ff9800; font-weight: bold">
                          Payment Research Required
                          </span>
                        </p>
                    </td>
                  </tr>
                </table>
                {{/if}}
                
                {{#if (eq tag 'shouldEscalate')}}
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="
                    margin-bottom: 10px;
                    background-color: #F8FBFF;
                    border-left: 4px solid #f44336;
                    border-radius: 3px;
                  "
                >
                  <tr style="background-color: white; border-radius: 8px;">
                    <td style="padding: 20px">
                      <p style="margin: 0; font-weight: bold; font-size: 16px">
                        Invoice #{{invoiceNumber}}
                      </p>
                     </td>
                      <td width="55%">
                        <p style="margin: 0 0 0 0; color: #666666">
                          Status:
                          <span style="color: #f44336; font-weight: bold">
                          Escalation Required
                          </span>
                        </p>
                    </td>
                  </tr>
                </table>
                {{/if}}
                
                {{/each}}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Call Summary Card -->
      <tr>
        <td style="padding: 15px 20px 0 20px">
          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="
              background-color: #F8FBFF;
              border-radius: 6px;
            "
          >
            <tr>
              <td style="padding: 20px">
                <h2
                  style="
                    color: {{primaryColor}};
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    border-bottom: 1px solid #eeeeee;
                    padding-bottom: 10px;
                  "
                >
                  Call Summary
                </h2>
                <p style="margin: 0; line-height: 1.5; color: #333333">
                {{callSummary}}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      {{#if hasEscalationNotes}}
        <!-- Escalations Card -->
        <tr>
          <td style="padding: 15px 20px 0 20px">
            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              width="100%"
              style="
                background-color: #fff8e1;
                border-radius: 6px;
                border-left: 4px solid #ff9800;
              "
            >
              <tr>
                <td style="padding: 20px">
                  <h2
                    style="
                      color: #ff9800;
                      margin: 0 0 0 0;
                      font-size: 18px;
                      border-bottom: 1px solid #ffe0b2;
                    "
                  >
                    Escalations
                  </h2>
                </td>
              </tr>
              {{#each invoiceData}}
              {{#if (eq tag 'shouldEscalate')}}
              <tr>
              <td style="padding: 0 20px 15px 20px">
                <p style="margin: 0; line-height: 1.5; color: #333333">
                <strong>Invoice #{{invoiceNumber}}:</strong> {{escalationNotes}}
                </p>
             </td>
              </tr>
              {{/if}}
              {{/each}}
            </table>
          </td>
        </tr>
        {{/if}}
        
      <!-- Client Related Updates -->
      {{#if clientUpdates}}
      <tr>
          <td style="padding: 15px 20px 0 20px">
            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              width="100%"
              style="
                background-color: #fff8e1;
                border-radius: 6px;
                border-left: 4px solid #ff9800;
              "
            >
              <tr>
                <td style="padding: 20px">
                  <h2
                    style="
                      color: #ff9800;
                      margin: 0 0 0 0;
                      font-size: 18px;
                      border-bottom: 1px solid #ffe0b2;
                    "
                  >
                    Client Updates
                  </h2>
                </td>
              </tr>
              <tr>
              <td style="padding: 0 20px 15px 20px">
                <p style="margin: 0; line-height: 1.5; color: #333333">
                {{clientUpdates}}
                </p>
             </td>
              </tr>
            </table>
          </td>
        </tr>
      {{/if}}

      <!-- Recording Link Card -->
      <tr>
        <td style="padding: 15px 20px 0 20px">
          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="
              background-color:  #F8FBFF;
              border-radius: 6px;
              margin-bottom: 20px;
            "
          >
            <tr>
            {{#if callRecordingLink}}
              <td style="padding: 20px; text-align: center">
                <h2
                  style="
                    color: {{primaryColor}};
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    border-bottom: 1px solid #eeeeee;
                    padding-bottom: 10px;
                  "
                >
                  Call Recording
                </h2>
                <a
                  href="{{callRecordingLink}}"
                  target="_blank"
                  style="
                    display: inline-block;
                    background-color: {{primaryColor}};
                    color: #ffffff;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    font-weight: bold;
                  "
                  >Listen to Full Recording</a
                >
              </td>
              {{/if}}
            </tr>
          </table>
        </td>
      </tr>
    </table>
    </div>
  </body>
</html>
`;

const data = {
  contactCompanyName: "Cranial Technologies, Inc.",
  contactEmail: "cranialtech@email.com",
  callDate: "07/13/2025",
  customerNumber: "1087331",
  hasEscalationNotes: true,
  invoiceData: [
    {
      tag: "shouldEscalate",
      promiseDate: null,
      invoiceNumber: "1068180",
      escalationNotes:
        "The client is experiencing issues with the integration process and has requested a refund instead of paying the invoice.",
    },
  ],
  callSummary:
    "Cranial Technologies, Inc. has an open invoice, #1068180, which was due on July 7, 2025. The client is experiencing issues with the integration process and has requested a refund instead of paying the invoice. The client also provided an updated contact number for future communication. The call was to discuss the status of open invoices and address the client's concerns. Cranial Technologies, Inc. is currently experiencing problems across the board and does not plan to pay the invoice until the issues are resolved. The accounts receivable team will review the client's concerns and reach out if needed.",
  clientUpdates:
    "The client is experiencing ongoing issues with the integration process and has requested a refund. The client also provided an updated contact number for future communication, as they will be leaving the company soon. The new contact is Jessica Rodriguez with phone number 9549384942.",
  callRecordingLink:
    "https://drive.google.com/file/d/11uWMW_5VSksnLeDLEV47nNpjFy8uTu43/view?usp=sharing",
  primaryColor: "#0068FF",
};

const template = Handlebars.compile(emailMessage);
const subjectTemplate = Handlebars.compile(subject);
function generateAndSaveHTML() {
  try {
    console.log("Generating HTML...");
    const html = template(data);
    console.log("Subject: ", subjectTemplate(data));
    const outputFile = path.join(__dirname, "./html_output/call_summary.html");
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
