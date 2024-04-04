import nodemailer from "nodemailer";

export const sendMail= (email:string,subject:string,html:string) =>{
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  const mailOptions={
    from:process.env.EMAIL_USER,
    to:email,
    subject:subject,
    html:html
  };
  transporter.sendMail(mailOptions,function(error:string,info):void{
    if(error){
      console.log(error);
    } else{
      console.log(`Email sent: ` + info.response);
    }
  });
}