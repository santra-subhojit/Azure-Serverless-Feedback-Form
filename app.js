const form = document.getElementById("feedbackForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  const res = await fetch("https://<YOUR_FUNCTION_APP>.azurewebsites.net/api/submitFeedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message }),
  });

  const result = await res.json();
  status.textContent = result.message;
  form.reset();
});
