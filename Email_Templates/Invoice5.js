require("../HandleBarHelpers");
const Handlebars = require("handlebars");
const fs = require("node:fs");
const path = require("node:path");
const chokidar = require("chokidar");

const subject = `Invoice #{{invoiceNumber}}- Client: {{contactCompanyName}}, Past Due Date`;

const emailMessage = `<!DOCTYPE html>
<html lang="en">
<head> 
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Outreach</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 40px 20px; background-color: #f9fafb;">
   <!-- Header -->
    <div style="margin-bottom: 12px; background: {{primaryColor}}; border-radius: 8px 8px 0 0; padding: 15px; text-align: center; font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td>
                    <h1 style="color: white; margin: 0; font-size: 1.5rem; font-weight: 600; letter-spacing: 0.025em;">INVOICE EXCEEDED NET TERMS</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 1rem;">INSPYR SOLUTIONS LLC</p>
                </td>
            </tr>
        </table>
    </div>  
     
    <!-- Message Section -->
    <div style="margin-bottom: 12px; padding: 24px; background-color: white; border-radius: 8px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">
        <p style="margin: 0 0 16px 0; font-size: 1rem; font-weight: 500;">Hello{{#if contactName}} {{contactName}},{{else}},{{/if}}</p>
        
         <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
        Checking in as our records indicate that <span style="font-weight: 600; color: #374151;">Invoice #1234567</span> has exceeded net terms.
        </p>

        <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
            If payment has been made, can you kindly provide the remit date?
        </p>

        <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
            If payment has not been made, can you please provide the scheduled remit date?
        </p>

        <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
            Looking forward to your prompt response.
        </p> 

        <p style="margin: 0; font-size: 1rem;">
            Best regards,<br>
            <span style="font-weight: 500;">Accounts Receiveable Department</span>
        </p>
    </div>
  
    <!-- Company Info -->
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div>
                <div style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 12px; font-weight: 600;">REMIT TO</div>
                <div style="font-weight: 600; color: #374151;">INSPYR Solutions, LLC</div>
                <div>PO Drawer 1217</div>
                <div>Dallas, TX 75373-7249</div>
            </div>
        </div>

        <!-- Invoice Title -->
        <div style="color: {{primaryColor}}; font-size: 40px; font-weight: 700; margin: 0 0 40px 0; letter-spacing: -0.5px; position: relative; display: inline-block; padding-bottom: 10px; border-bottom: 3px solid {{primaryColor}};">
            INVOICE
        </div>

        <!-- Billing Info -->
        <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px;">
            <tr>
                <td style="width: 50%;">
                    <div style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 12px; font-weight: 600;">BILL TO</div>
                    {{#if contactName}}<div style="font-weight: 600; color: #374151;">{{contactName}}</div>{{/if}}
                    {{#if contactCompanyName}} {{#if (ne contactCompanyName contactName)}}<div>{{contactCompanyName}}</div>{{/if}} {{/if}}
                    {{#if contactBillAddr.streetAddress}}<div>{{contactBillAddr.streetAddress}}</div>{{/if}}
                    {{#if (all contactBillAddr.city contactBillAddr.state)}}<div>{{contactBillAddr.city}}, {{contactBillAddr.state}} {{#if contactBillAddr.zipCode}}{{contactBillAddr.zipCode}}{{/if}}</div>{{/if}}
                </td>
              
                <td style="width: 50%; text-align: left; padding-left: 25%;">
                    {{#if customerNumber}}<div><span style="font-weight: 600; color: #374151; font-size: 0.8rem;">CUSTOMER</span> #{{customerNumber}}</div>{{/if}}
                    {{#if invoiceNumber}}<div><span style="font-weight: 600; color: #374151; font-size: 0.8rem;">INVOICE</span> #{{invoiceNumber}}</div>{{/if}}
                    {{#if transactionDate}}<div><span style="font-weight: 600; color: #374151; font-size: 0.8rem;">DATE-</span> {{transactionDate}}</div>{{/if}}
                    {{#if dueDate}}<div><span style="font-weight: 600; color: #374151; font-size: 0.8rem;">DUE DATE-</span> {{dueDate}}</div>{{/if}}
                    {{#if salesTerm}}<div><span style="font-weight: 600; color: #374151; font-size: 0.8rem;">TERMS-</span> {{salesTerm}}</div>{{/if}}
                </td>
            </tr>
        </table>


        <!-- Invoice Table -->
        {{#if lineItems}}
          {{#if hasServiceDate}}
            <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: separate; margin: 25px 0;">
              <thead>
                <tr>
                  <th style="background-color: {{primaryColor}}; padding: 12px 24px; text-align: left; font-size: 0.875rem; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.05em; width: 10%;">DATE</th>
                  <th style="background-color: {{primaryColor}}; padding: 12px 16px; text-align: left; font-size: 0.875rem; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.05em; width: 20%;">SERVICE</th>
                  <th style="background-color: {{primaryColor}}; padding: 12px 4px; text-align: left; font-size: 0.875rem; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.05em; width: 42%;">DESCRIPTION</th>
                  <th style="background-color: {{primaryColor}}; padding: 12px 16px; text-align: center; font-size: 0.875rem; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.05em; width: 8%;">QTY</th>
                  <th style="background-color: {{primaryColor}}; padding: 12px 16px; text-align: center; font-size: 0.875rem; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.05em; width: 8%;">RATE</th>
                  <th style="background-color: {{primaryColor}}; padding: 12px 16px; text-align: center; font-size: 0.875rem; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.05em; width: 12%;">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {{#each lineItems}}
                  <tr>
                    <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 0.875rem;">{{#if serviceDate}}{{ serviceDate}}{{else}}&nbsp;{{/if}}</td>
                    <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 0.875rem;">{{service}}</td>
                    <td style="border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 0.875rem;">{{description}}</td>
                    <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 0.875rem; text-align: center;">{{quantity}}</td>
                    <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 0.875rem; text-align: center;">{{rate}}</td>
                    <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 0.875rem; text-align: center;">{{amount}}</td>
                  </tr>
                {{/each}}
              </tbody>
            </table>
          {{else}}
            <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: separate; margin: 30px 0;">
              <thead>
                <tr>
              <th style="background-color: {{primaryColor}}; padding: 12px 20px; text-align: left; font-size: 0.875rem; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.05em; width: 20%;">SERVICE</th>
              <th style="background-color: {{primaryColor}}; padding: 12px 4px; text-align: left; font-size: 0.875rem; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.05em; width: 45%;">DESCRIPTION</th>
              <th style="background-color: {{primaryColor}}; padding: 12px 1px; text-align: center; font-size: 0.875rem; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.05em; width: 8%;">QTY</th>
              <th style="background-color: {{primaryColor}}; padding: 12px 16px; text-align: center; font-size: 0.875rem; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.05em; width: 12%;">RATE</th>
              <th style="background-color: {{primaryColor}}; padding: 12px 16px; text-align: center; font-size: 0.875rem; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.05em; width: 15%;">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {{#each lineItems}}
                  <tr>
                    <td style="padding: 16px;border-bottom: 1px solid #e5e7eb; color: #4b5563; text-align: left; width: 20%; font-size: 0.875rem;">{{service}}</td>
                    <td style="border-bottom: 1px solid #e5e7eb; color: #4b5563; text-align: left; width: 45%; font-size: 0.875rem;">{{description}}</td>
                    <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563; text-align: center; width: 8%; font-size: 0.875rem;">{{quantity}}</td>
                    <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563; text-align: center; width: 12%; font-size: 0.875rem;">{{ rate}}</td>
                    <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563; text-align: center; width: 15%; font-size: 0.875rem;">{{ amount}}</td>
                  </tr>
                {{/each}}
              </tbody>
            </table>
          {{/if}}
        {{/if}}

        <!-- Totals Section -->
        <table cellpadding="0" cellspacing="0" style="width: 100%; margin-top: 30px;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                 <table cellpadding="0" cellspacing="0" style="width: 100%;">
                    <tr>
                        <td style="width: 50%; vertical-align: top;">
                            <table cellpadding="0" cellspacing="0"">
                                {{#if customMessage}}
                                <tr>
                                    <td style="color: #6b7280; font-size: 0.85rem; text-align: left; padding-bottom: 20px;">
                                        {{customMessage}}
                                    </td>
                                </tr>
                                {{/if}}
                                <tr>
                                    <td style="border: 2px solid {{primaryColor}}; border-radius: 8px; padding: 25px; color: #4b5563; font-size: 0.85rem; text-align: left; line-height: 1.8;">
                                        <div style="font-weight: 600; margin-bottom: 12px; font-size: 0.875rem;">ACH DELIVERY INSTRUCTIONS:</div>
                                        <div>Beneficiary Bank: JP Morgan Chase</div><div>ABA Routing Number: 267084131</div><div>Account Name: INSPYR Solutions, LLC</div><div>Account Number: 909331909</div>
                                        <div>Remittance: cashposting@INSPYRSolutions.com</div>
                                        <div style="margin-top: 12px; font-style: italic;">Please include your invoice number with your payment.</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
              </td>
            
                <td style="width: 50%; vertical-align: top;">
                    <table cellpadding="0" cellspacing="0" style="width: 80%; margin-left: auto;">
                      {{#if (gt lineItems.length 1)}}
                          {{#if subTotal}}
                            <tr>
                                <td style=" padding: 8px 0; font-size: 0.95rem;">SUBTOTAL</td>
                                <td style="padding: 8px 20px 8px 0; font-size: 0.95rem; text-align: right;">{{ subTotal}}</td>
                            </tr>
                          {{/if}}
                      {{/if}}

                      {{#if discounts}}
                        <tr>
                            <td style=" padding: 8px 0px; font-size: 0.95rem;">DISCOUNTS </td>
                            <td style="padding: 8px 20px 8px 0; font-size: 0.95rem; text-align: right;">- {{ discounts}}</td>
                        </tr>
                      {{/if}}
                        {{#if totalTax}}<tr>
                            <td style="padding: 8px 0; font-size: 0.95rem;">TAX </td>
                            <td style="padding: 8px 20px 8px 0; font-size: 0.95rem; text-align: right;">{{ totalTax}}</td>
                        </tr>
                      {{/if}}
                  
                      {{#if totalAmount}}
                        <tr>
                            <td style="padding: 8px 0; font-size: 0.95rem;">TOTAL</td>
                            <td style="padding: 8px 20px 8px 0; font-size: 0.95rem; text-align: right;">{{ totalAmount}}</td>
                        </tr>    
                      {{/if}}  
                      {{#if amountPaid}}      
                        <tr>
                            <td style="padding: 8px 0; font-size: 0.95rem;">PAYMENTS</td>
                            <td style="padding: 8px 20px 8px 0; font-size: 0.95rem; text-align: right;">- {{ amountPaid}}</td>
                        </tr> 
                      {{/if}}  
                       {{#if balanceDue}}   
                      <tr>
                          <td colspan="2" style="padding: 20px 10px 0px 0; border-top: 1px solid #e5e7eb; font-size: 1.2rem; font-weight: 700; color: {{primaryColor}}; text-align: right;">
                              BALANCE DUE {{ balanceDue}}
                          </td>
                      </tr>
                      {{/if}}
                      {{#if isOverDue }}
                         <tr>
                            <td colspan="2" style="padding: 10px 10px 0px 0; font-size: 1.2rem; font-weight: 700; color: #e74c3c; text-align: right;">
                                OVERDUE {{dueDate}}
                            </td>
                        </tr>
                      {{/if}}
                    </table> 
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`;

const data = {
  invoiceNumber: 1049438,
  transactionDate: "2024-04-20",
  dueDate: "2025-05-20",
  customerNumber: 2189153,
  collector: "Rachel Gonzalez",
  collectorEmail: "rgonzalez@inspyrsolutions.com",
  contactCompanyName: "Southern Ionics",
  contactName: "Kealy Baxter",
  contactBillAddr: {
    streetAddress: "P.O. Drawer 1217",
    city: "West Point",
    state: "MS",
    zipCode: "39773",
  },
  salesTerm: "Net 30",
  hasServiceDate: true,
  lineItems: [
    {
      service: "Invoice 1 of 2 ",
      serviceDate: "2025-04-12",
      description:
        "Southern Ionics Incorporated - INSPYR-2024-12-30-11 - Fidelity_401K Import",
      quantity: "1",
      rate: "1800",
      amount: "1800",
    },
  ],
  subTotal: 1880,
  discounts: 0,
  totalAmount: 1880,
  amountPaid: 0,
  balanceDue: 1880,
  customMessage: "Thank you for your business and have a great day!",
  isOverDue: true,
  primaryColor: "#0277BD",
};

const template = Handlebars.compile(emailMessage);
const subjectTemplate = Handlebars.compile(subject);

function generateAndSaveHTML() {
  try {
    console.log("Generating HTML");
    const html = template(data);
    console.log("Subject:", subjectTemplate(data));
    const outputFile = path.join(__dirname, "./html_output/invoice5.html");
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
