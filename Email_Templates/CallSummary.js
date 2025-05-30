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
<body
    style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 40px 20px; background-color: #f9fafb;">
        <div style="margin-bottom: 12px; background: {{primaryColor}}; border-radius: 8px 8px 0 0; padding: 12px; text-align: center; font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td>
                    <h1 style="color: white; margin: 0; font-size: 1.5rem; font-weight: 600; letter-spacing: 0.025em;">CALL SUMMARY</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 1rem;">{{contactCompanyName}} - {{callDate}}</p>
                </td>
            </tr>
        </table>
    </div>
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden;">

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
              background-color: #ffffff;
              border-radius: 6px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
                      <p style="margin: 0 0 5px 0; font-weight: bold; color: #666666">
                        Client:
                      </p>
                      <p style="margin: 0 0 10px 0; color: #333333">
                        {{contactCompanyName}}
                      </p>
                       <p style="margin: 0 0 5px 0; font-weight: bold; color: #666666">
                        Client Email:
                      </p>
                      <p style="margin: 0 0 10px 0; color: #333333">
                        {{contactEmail}}
                      </p>
                    </td>
                    <td
                      width="50%"
                      style="vertical-align: top; padding-left: 10px"
                    >
                      <p style="margin: 0 0 5px 0; font-weight: bold; color: #666666">
                       Customer #
                      </p>
                      <p style="margin: 0 0 10px 0; color: #333333">
                        {{customerNumber}}
                      </p>
                       <p style="margin: 0 0 5px 0; font-weight: bold; color: #666666">
                        Call Date:
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
              background-color: #ffffff;
              border-radius: 6px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
                      background-color: #f9f9f9;
                      border-left: 4px solid #4caf50;
                      border-radius: 3px;
                    "
                  >
                    <tr>
                      <td style="padding: 20px">
                        <p style="margin: 0; font-weight: bold; font-size: 16px">
                          Invoice #{{invoiceNumber}}
                        </p>
                      </td>
                        <td width="55%">
                          <p style="margin: 0 0 0 0; color: #666666">
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
                    background-color: #f9f9f9;
                    border-left: 4px solid #ff9800;
                    border-radius: 3px;
                  "
                >
                  <tr>
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
                    background-color: #f9f9f9;
                    border-left: 4px solid #f44336;
                    border-radius: 3px;
                  "
                >
                  <tr>
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
              background-color: #ffffff;
              border-radius: 6px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
              background-color: #ffffff;
              border-radius: 6px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
  contactCompanyName: "Pinnacle Systems",
  contactEmail: "pinnacle@email.com",
  callDate: "2025-05-12",
  customerNumber: 1101,
  hasEscalationNotes: true,
  invoiceData: [
    {
      invoiceNumber: "1001",
      tag: "shouldEscalate",
      promiseDate: null,
      escalationNotes:
        "The client said they are unable to pay the invoice becuase the project is not complete",
    },
    {
      invoiceNumber: "1003",
      tag: "willPay",
      promiseDate: "2025-05-12",
      escalationNotes: null,
    },
    {
      invoiceNumber: "1002",
      tag: "shouldEscalate",
      promiseDate: null,
      escalationNotes:
        "The client says they can not pay the invoice because the invoice is incorrect",
    },
    {
      invoiceNumber: "1004",
      tag: "wasPaid",
      promiseDate: null,
      escalationNotes: null,
    },
  ],
  callSummary:
    "Pinnacle Systems was contacted regarding two open invoices. The client was unsure about Invoice #1001 and requested it to be resent. The client confirmed they will pay Invoice #1002 by the end of day Thursday, May 8th. The payment for Invoice #1002 will be made by check from Pinnacle. The client was unclear about the status of Invoice #1001 and requested further clarification. The accounts receivable team will resend Invoice #1001 and look into it further to ensure everything is in order.",
  clientUpdates:
    "The client has requested to change their billing contact. The new information is ...",
  callRecordingLink: "templink",
  primaryColor: "#0277BD",
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
