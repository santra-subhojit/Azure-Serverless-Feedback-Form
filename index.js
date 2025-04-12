const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

module.exports = async function (context, req) {
  const name = req.body.name || "Anonymous";
  const message = req.body.message || "";

  const account = process.env.STORAGE_ACCOUNT_NAME;
  const key = process.env.STORAGE_ACCOUNT_KEY;
  const tableName = "Feedback";

  const credential = new AzureNamedKeyCredential(account, key);
  const client = new TableClient(`https://${account}.table.core.windows.net`, tableName, credential);

  await client.createTable(); // safe even if exists

  await client.createEntity({
    partitionKey: "feedback",
    rowKey: Date.now().toString(),
    name,
    message,
    submitted: new Date().toISOString(),
  });

  context.res = {
    status: 200,
    body: { message: "Thank you for your feedback!" },
  };
};
