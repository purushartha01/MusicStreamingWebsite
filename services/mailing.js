const mailjet = require("node-mailjet");

const mjet = mailjet.apiConnect(
  "ab5c5c3f6923acd75c8f7a79387527e4",
  "29dd5c1f0ec95c84d985eb6a1083a40d"
);

const sendMail = (email, userName, subject, body) => {
  const request = mjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [{
        From: {
          Email: "symfonyhelpdesk@gmail.com",
          Name: "Symfony Help Center"
        },
        To: [{
          Email: email,
          Name: userName
        }],
        Subject: subject,
        TextPart: '',
        HTMLPart: body
      }]
    })
  return request;
}

module.exports.welcomeMail= (sendTo, username, subject) => {
  let body=`<h3>Hello,${username}. Welcome to Symfony.</h3> <br/><br/><p>We are happy that you have decided to join the userbase of Symfony.</p></br><H2>Stay Tuned for all exciting and keep listening! More features coming soon!</H2>`;

  return sendMail(sendTo,username,subject,body);
}

module.exports.verifyAccount=(sendTo, username, subject)=>{
  let url = `https://musicstreamingwebsite.purushartha-sin.repl.co/verify/${username}`;

  let body = `<h3>Hello,${username}. Welcome to Symfony.</h3><br/>
  <a href='${url}'>Please verify your account!</a>
  <br/>
  <p><h2>To proceed further please verify your account!</h2>`;

  return sendMail(sendTo, username, subject, body);
}