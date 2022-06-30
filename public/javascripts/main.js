const App = {
  endpoint: "/api",
  interval: null,
};

App.init = () => {
  $("#invoice-form").collapse("show");
  $("#send-btn").click(App.sendBtn);
};

App.sendBtn = async () => {
  try {
    const name = $("#name").val();
    if (!name) $("#name").addClass("is-invalid");
    const lastname = $("#lastname").val();
    if (!lastname) $("#lastname").addClass("is-invalid");
    const email = $("#email").val();
    if (!email) $("#email").addClass("is-invalid");
    const response = await App.makeRequest({
      api: "invoice",
      post: { name, lastname, email },
    });

    if (!response) console.error("Error getting data!");
    if (response.success) {
      $("#invoice-form").collapse("hide");
      $("#pay-invoice").collapse("show");
      $("#invoice-text").text(response.request);
      $("#invoice-description").text(response.description);
      $("#invoice-amount").text(`${response.amount} `);
      const qrCode = App.qrCode(response.request.toUpperCase(), 400);
      $(".qr-code").html(qrCode);
      App.interval = setInterval(App.waitPayment, 2000, response.hash);
    }
  } catch (error) {
    console.log(error.responseJSON);
  }
};

App.waitPayment = async (hash) => {
  const response = await App.makeRequest({
    api: `invoice/${hash}`,
  });
  if (response.success && response.paid) {
    clearInterval(App.interval);
    App.interval = null;
    $("#pay-invoice").collapse("hide");
    const url = `http://localhost:3000/api/verify/${response.preimage}`;
    const qrCode = App.qrCode(url, 400);
    $(".preimage-qr-code").html(qrCode);
    $("#success-box").collapse("show");
    setTimeout(App.getBalance, 2000);
  }
};

/** Get qr code
  {
    text: <String>
  }

  @returns
  <QR Code Img Object>
*/
App.qrCode = (text) => {
  const back = "rgb(250, 250, 250)";
  const rounded = 100;
  const size = 300;

  const qr = kjua({ back, rounded, size, text });

  $(qr).css({ height: "auto", "max-width": "200px", width: "100%" });

  return qr;
};

App.makeRequest = ({ api, post }) => {
  const type = !post ? "GET" : "POST";
  const data = !!post ? JSON.stringify(post) : null;
  return $.ajax(`${App.endpoint}/${api}`, {
    type,
    data,
    contentType: "application/json",
    dataType: "json",
  });
};

$(() => App.init());
